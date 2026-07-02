import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";
import Reader from "./pages/Reader.jsx";
import { papers } from "./lib/papers.js";

export default function App() {
  const location = useLocation();

  return (
    <>
      <div className="grain" />
      <Header count={papers.length} />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Library />} />
          <Route path="/paper/:id" element={<Reader />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
