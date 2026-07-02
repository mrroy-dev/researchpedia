import { motion } from "framer-motion";
import "./LetterRail.css";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LetterRail({ active, enabled, onSelect }) {
  return (
    <nav className="letter-rail" aria-label="Jump to letter">
      <button
        className={`letter-rail__tab letter-rail__tab--all ${active === "All" ? "is-active" : ""}`}
        onClick={() => onSelect("All")}
      >
        {active === "All" && (
          <motion.span layoutId="letter-highlight" className="letter-rail__highlight" />
        )}
        <span className="letter-rail__label">All</span>
      </button>
      {LETTERS.map((letter) => {
        const isEnabled = enabled.has(letter);
        const isActive = active === letter;
        return (
          <button
            key={letter}
            className={`letter-rail__tab ${isActive ? "is-active" : ""} ${
              isEnabled ? "" : "is-disabled"
            }`}
            disabled={!isEnabled}
            onClick={() => onSelect(letter)}
          >
            {isActive && (
              <motion.span layoutId="letter-highlight" className="letter-rail__highlight" />
            )}
            <span className="letter-rail__label">{letter}</span>
          </button>
        );
      })}
    </nav>
  );
}
