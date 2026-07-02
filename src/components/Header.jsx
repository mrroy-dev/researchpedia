import { Link, NavLink } from "react-router-dom";
import "./Header.css";

const brandName = "researchpedia";

export default function Header({ count }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__mark" aria-label="researchpedia home">
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 24V7c3-2 6-2 9 0v17c-3-2-6-2-9 0Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d="M25 24V7c-3-2-6-2-9 0v17c3-2 6-2 9 0Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          <span className="site-header__brand" aria-hidden="true">
            {brandName.split("").map((letter, index) => (
              <span
                className="site-header__brand-letter"
                style={{ "--letter-index": index }}
                key={`${letter}-${index}`}
              >
                {letter}
              </span>
            ))}
          </span>
        </Link>

        <nav className="site-header__nav" aria-label="Main">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "is-active" : "")}>
            Home
          </NavLink>
          <NavLink to="/browse" className={({ isActive }) => (isActive ? "is-active" : "")}>
            Browse
          </NavLink>
        </nav>

        <p className="site-header__tag">
          A personal archive · {count.toLocaleString()} volumes catalogued
        </p>
      </div>
    </header>
  );
}
