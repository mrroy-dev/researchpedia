import "./SearchBar.css";

export default function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="search-slip">
      <svg
        className="search-slip__icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M11 11 14.5 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search title, author, subject…"
        aria-label="Search the catalog"
      />
      <span className="search-slip__count">
        {resultCount.toLocaleString()} {resultCount === 1 ? "result" : "results"}
      </span>
    </div>
  );
}
