import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getPaperById } from "../lib/papers.js";
import { trackView, addReadingTime } from "../lib/analytics.js";
import EmptyState from "../components/EmptyState.jsx";
import PageTransition from "../components/PageTransition.jsx";
import "./Reader.css";

export default function Reader() {
  const { id } = useParams();
  const paper = getPaperById(id);

  useEffect(() => {
    if (paper) {
      document.title = `${paper.title} — researchpedia`;
    } else {
      document.title = "Not found — researchpedia";
    }
  }, [paper]);

  // Local (this-browser-only) reading analytics: one view per open,
  // plus accumulated time spent on the page.
  const startedAt = useRef(null);
  useEffect(() => {
    if (!paper) return;
    trackView(paper.id);
    startedAt.current = Date.now();
    return () => {
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      addReadingTime(paper.id, seconds);
    };
  }, [paper]);

  if (!paper) {
    return (
      <PageTransition>
        <div className="reader reader--notfound">
          <EmptyState title="Not in the catalog">
            This paper doesn't exist in the archive.
          </EmptyState>
          <Link className="reader__back" to="/browse">
            ← Back to the shelf
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="reader">
      <Link className="reader__back" to="/browse">
        ← Back to the shelf
      </Link>

      <div className="reader__layout">
        <aside className="reader__slip">
          <span className="reader__slip-label">Borrower's Card</span>
          <h1 className="reader__title">{paper.title}</h1>
          <dl className="reader__facts">
            <div>
              <dt>Author{paper.authors?.length > 1 ? "s" : ""}</dt>
              <dd>{(paper.authors || []).join(", ")}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{paper.year}</dd>
            </div>
            <div>
              <dt>Call No.</dt>
              <dd className="reader__mono">{paper.callNumber}</dd>
            </div>
            {paper.tags?.length > 0 && (
              <div>
                <dt>Subjects</dt>
                <dd>
                  <div className="reader__tags">
                    {paper.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </dd>
              </div>
            )}
          </dl>
          {paper.abstract && (
            <>
              <span className="reader__slip-label">Abstract</span>
              <p className="reader__abstract">{paper.abstract}</p>
            </>
          )}
          <a className="reader__open-tab" href={`/${paper.file}`} target="_blank" rel="noreferrer">
            Open in new tab ↗
          </a>
        </aside>

        <div className="reader__page">
          <iframe
            title={paper.title}
            src={`/${paper.file}`}
            className="reader__frame"
          />
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
