import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar.jsx";
import LetterRail from "../components/LetterRail.jsx";
import PaperCard from "../components/PaperCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PageTransition from "../components/PageTransition.jsx";
import { papers, filterPapers, availableLetters } from "../lib/papers.js";
import "./Library.css";

const PAGE_SIZE = 24;

export default function Library() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [letter, setLetter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Browse — researchpedia";
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const enabledLetters = useMemo(() => new Set(availableLetters(papers)), []);

  const filtered = useMemo(() => {
    return filterPapers(papers, { query, letter });
  }, [query, letter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleQuery(v) {
    setQuery(v);
    setPage(1);
  }

  function handleLetter(l) {
    setLetter((prev) => (prev === l ? "All" : l));
    setPage(1);
  }

  return (
    <PageTransition>
      <div className="library">
      <div className="library__toolbar">
        <SearchBar value={query} onChange={handleQuery} resultCount={filtered.length} />
      </div>

      <div className="library__body">
        <LetterRail active={letter} enabled={enabledLetters} onSelect={handleLetter} />

        <div className="library__shelf">
          {pageItems.length === 0 ? (
            <EmptyState title="Nothing on this shelf">
              No papers match your search. Try a different title, author, or subject —
              or add PDFs to <code>public/papers</code> and run <code>npm run scan</code>.
            </EmptyState>
          ) : (
            <motion.div layout className="library__grid">
              {pageItems.map((paper, i) => (
                <PaperCard key={paper.id} paper={paper} index={i} />
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <nav className="library__pagination" aria-label="Pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              <span className="library__folio">
                — {currentPage} of {totalPages} —
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
