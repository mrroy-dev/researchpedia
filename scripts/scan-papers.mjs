// Scans public/papers/*.pdf and (re)generates src/data/papers.json
// Reads the actual PDF content to find the real title/authors/abstract,
// instead of relying on the filename or (often missing) PDF metadata.
// Usage: npm run scan
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const papersDir = path.join(root, "public", "papers");
const outFile = path.join(root, "src", "data", "papers.json");

function titleFromFilename(filename) {
  const base = filename.replace(/\.pdf$/i, "").replace(/\n/g, " ");
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function callNumberFor(index, letter) {
  const num = String(index + 1).padStart(3, "0");
  return `RR ${num} ${letter}`;
}

// Lines that are watermarks/headers/footers rather than a title
const SKIP_LINE =
  /^(arxiv:|doi:|issn|isbn|page \d+|^\d+$|proceedings of|copyright|published|microsoft word|in press|under review|as a conference paper|conference paper at|draft\b|preprint\b|working paper|technical report|submitted to|anonymous authors?|running head|manuscript)/i;

// Short leftover fragments from a header we already skipped (e.g. "at ICLR 2019")
const FRAGMENT_LINE = /^(as|at|in|for|to)\s.{0,25}$/i;

const PLACEHOLDER_TITLE = /^your (title|paper|name)s?$/i;

function looksLikeTitle(line) {
  if (!line) return false;
  const trimmed = line.trim();
  if (trimmed.length < 8 || trimmed.length > 220) return false;
  if (SKIP_LINE.test(trimmed)) return false;
  if (FRAGMENT_LINE.test(trimmed)) return false;
  if (PLACEHOLDER_TITLE.test(trimmed)) return false;
  if (/^\S+@\S+$/.test(trimmed)) return false; // bare email
  if (trimmed.split(/\s+/).length < 3) return false; // too short to be a real title
  const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
  if (letters < trimmed.length * 0.5) return false; // too much symbol/number noise
  return true;
}

function extractTitleFromText(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  for (let i = 0; i < Math.min(lines.length, 12); i++) {
    if (looksLikeTitle(lines[i])) {
      let title = lines[i];
      // If the title looks like it wrapped onto the next short line
      // (no @ sign, not an author/affiliation line), stitch it together.
      const next = lines[i + 1];
      if (
        next &&
        title.length < 60 &&
        !/@|university|institute|department|,.*,/i.test(next) &&
        looksLikeTitle(next) &&
        next.length < 80
      ) {
        title = `${title} ${next}`;
      }
      return title.replace(/\s+/g, " ").trim();
    }
  }
  return null;
}

function extractAbstract(text) {
  const idx = text.search(/abstract/i);
  if (idx === -1) return text.replace(/\s+/g, " ").trim().slice(0, 320) || null;
  let after = text.slice(idx + "abstract".length, idx + "abstract".length + 900);
  const cutAt = after.search(/\n\s*(keywords|1[\s.]+introduction|introduction)\b/i);
  if (cutAt > 40) after = after.slice(0, cutAt);
  return after.replace(/\s+/g, " ").trim().slice(0, 320) || null;
}

function yearFromDate(pdfDate) {
  // PDF dates look like "D:20190418004742Z"
  const m = /D:(\d{4})/.exec(pdfDate || "");
  return m ? Number(m[1]) : null;
}

async function extractMetadata(filePath) {
  const parser = new PDFParse({ data: await readFile(filePath) });
  try {
    const info = await parser.getInfo();
    const meta = info?.info || {};
    const { text } = await parser.getText();

    const metaTitle = (meta.Title || "").trim();
    const title =
      metaTitle.length > 5 && !PLACEHOLDER_TITLE.test(metaTitle)
        ? metaTitle
        : extractTitleFromText(text);

    const authors = (meta.Author || "")
      .split(/,|;| and |\s{2,}/i)
      .map((a) => a.trim())
      .filter(Boolean);

    return {
      title,
      authors,
      abstract: extractAbstract(text),
      year: yearFromDate(meta.CreationDate),
    };
  } catch (err) {
    console.warn(`  ! could not parse ${path.basename(filePath)}: ${err.message}`);
    return { title: null, authors: [], abstract: null, year: null };
  } finally {
    await parser.destroy();
  }
}

async function main() {
  let files;
  try {
    files = (await readdir(papersDir)).filter((f) => f.toLowerCase().endsWith(".pdf"));
  } catch {
    console.error(`No folder found at ${papersDir}. Create it and add your PDFs first.`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("No PDF files found in public/papers — nothing to scan.");
    return;
  }

  files.sort((a, b) => a.localeCompare(b));

  console.log(`Scanning ${files.length} PDF file(s)...`);
  const papers = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(papersDir, filename);
    const meta = await extractMetadata(filePath);
    const title = meta.title || titleFromFilename(filename);
    const letter = /^[A-Za-z]/.test(title) ? title[0].toUpperCase() : "#";

    papers.push({
      id: `p${String(i + 1).padStart(4, "0")}`,
      callNumber: callNumberFor(i, letter),
      title,
      authors: meta.authors.length ? meta.authors : ["Unknown"],
      year: meta.year || new Date().getFullYear(),
      tags: [],
      abstract: meta.abstract || "No abstract extracted yet — edit src/data/papers.json to add one.",
      file: `papers/${filename}`,
    });

    console.log(`  \u2713 ${filename} \u2192 "${title}"`);
  }

  await writeFile(outFile, JSON.stringify(papers, null, 2) + "\n", "utf-8");
  console.log(`\nWrote ${papers.length} entries to src/data/papers.json`);
}

main();
