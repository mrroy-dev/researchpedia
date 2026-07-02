import rawPapers from "../data/papers.json";

export const papers = rawPapers;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function firstLetter(title) {
  const c = title.trim()[0]?.toUpperCase() ?? "#";
  return LETTERS.includes(c) ? c : "#";
}

export function availableLetters(list = papers) {
  const present = new Set(list.map((p) => firstLetter(p.title)));
  return LETTERS.filter((l) => present.has(l));
}

export function filterPapers(list, { query = "", letter = "All" } = {}) {
  let result = list;

  if (letter && letter !== "All") {
    result = result.filter((p) => firstLetter(p.title) === letter);
  }

  const q = query.trim().toLowerCase();
  if (q) {
    result = result.filter((p) => {
      const haystack = [
        p.title,
        ...(p.authors || []),
        ...(p.tags || []),
        p.callNumber,
        String(p.year ?? ""),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  return result;
}

export function getPaperById(id) {
  return papers.find((p) => p.id === id);
}
