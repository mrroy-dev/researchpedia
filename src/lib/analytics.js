// Per-browser reading analytics.
// IMPORTANT: this is a static site with no server, so this only tracks
// activity on *this* browser (via localStorage) — it is a stand-in for
// real multi-user analytics, which would need a backend + database.

const KEY = "reading-room:stats:v1";

function readStore() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // localStorage unavailable (private mode, etc.) — fail silently
  }
}

export function trackView(id) {
  const store = readStore();
  const entry = store[id] || { views: 0, seconds: 0, lastViewed: null };
  entry.views += 1;
  entry.lastViewed = Date.now();
  store[id] = entry;
  writeStore(store);
}

export function addReadingTime(id, seconds) {
  if (!seconds || seconds < 2) return;
  const store = readStore();
  const entry = store[id] || { views: 0, seconds: 0, lastViewed: null };
  entry.seconds += seconds;
  store[id] = entry;
  writeStore(store);
}

export function getStats(id) {
  const store = readStore();
  return store[id] || { views: 0, seconds: 0, lastViewed: null };
}

/** Papers this browser has opened before, most recent first. */
export function getRecentlyRead(papers, limit = 6) {
  const store = readStore();
  return papers
    .filter((p) => store[p.id]?.lastViewed)
    .sort((a, b) => store[b.id].lastViewed - store[a.id].lastViewed)
    .slice(0, limit);
}

/** Papers ranked by (views + minutes spent) on this browser. */
export function getTrending(papers, limit = 6) {
  const store = readStore();
  return papers
    .filter((p) => store[p.id]?.views > 0)
    .sort((a, b) => {
      const scoreA = store[a.id].views + store[a.id].seconds / 60;
      const scoreB = store[b.id].views + store[b.id].seconds / 60;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export function hasAnyActivity() {
  const store = readStore();
  return Object.keys(store).length > 0;
}
