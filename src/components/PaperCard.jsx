import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./PaperCard.css";

export default function PaperCard({ paper, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 12) * 0.035, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, rotate: -0.35 }}
      className="paper-card"
    >
      <Link to={`/paper/${paper.id}`} className="paper-card__link">
        <span className="paper-card__fold" aria-hidden="true" />
        <span className="paper-card__call">{paper.callNumber}</span>
        <h3 className="paper-card__title">{paper.title}</h3>
        <p className="paper-card__authors">{(paper.authors || []).join(", ")}</p>
        <div className="paper-card__meta">
          <span>{paper.year}</span>
          {paper.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="paper-card__tag">
              {tag}
            </span>
          ))}
        </div>
        <span className="paper-card__open" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M3 10 10 3M10 3H4.5M10 3v5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
}
