import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { papers } from "../lib/papers.js";
import { getRecentlyRead, getTrending, hasAnyActivity } from "../lib/analytics.js";
import PaperCard from "../components/PaperCard.jsx";
import PageTransition from "../components/PageTransition.jsx";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const recentlyAdded = useMemo(() => papers.slice(-6).reverse(), []);
  const recentlyRead = useMemo(() => getRecentlyRead(papers, 6), []);
  const trending = useMemo(() => getTrending(papers, 6), []);
  const anyActivity = useMemo(() => hasAnyActivity(), []);

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/browse${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  }

  return (
    <PageTransition>
    <div className="home">
      <section className="home__hero">
        <span className="home__eyebrow">Est. today · {papers.length.toLocaleString()} volumes</span>
        <h1 className="home__headline">
          Every paper you've <em>saved</em>,
          <br />
          in one reading room.
        </h1>
        <form className="home__search" onSubmit={handleSubmit}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 11 14.5 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or subject…"
            aria-label="Search the catalog"
            autoFocus
          />
          <button type="submit">Search</button>
        </form>
        <button className="home__browse-link" onClick={() => navigate("/browse")}>
          or browse the full catalog →
        </button>
      </section>

      {recentlyRead.length > 0 && (
        <Shelf title="Pick up where you left off" subtitle="Recently opened on this device">
          {recentlyRead.map((p, i) => (
            <PaperCard key={p.id} paper={p} index={i} />
          ))}
        </Shelf>
      )}

      <Shelf
        title="Trending on this device"
        subtitle={
          anyActivity
            ? "Ranked by how much you've opened and read them — tracked locally in this browser only, not shared across other readers."
            : "No reading activity yet on this device. Open a few papers and this shelf will fill in — tracked locally in this browser only, not shared across other readers."
        }
      >
        {trending.length > 0
          ? trending.map((p, i) => <PaperCard key={p.id} paper={p} index={i} />)
          : recentlyAdded.slice(0, 4).map((p, i) => <PaperCard key={p.id} paper={p} index={i} />)}
      </Shelf>

      <Shelf title="Recently catalogued" subtitle="Latest additions to the archive">
        {recentlyAdded.map((p, i) => (
          <PaperCard key={p.id} paper={p} index={i} />
        ))}
      </Shelf>
    </div>
    </PageTransition>
  );
}

function Shelf({ title, subtitle, children }) {
  return (
    <motion.section
      className="shelf"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="shelf__heading">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="shelf__grid">{children}</div>
    </motion.section>
  );
}
