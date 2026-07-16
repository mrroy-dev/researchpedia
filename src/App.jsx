import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header.jsx";
import { papers } from "./lib/papers.js";

const Home = lazy(() => import("./pages/Home.jsx"));
const Library = lazy(() => import("./pages/Library.jsx"));
const Reader = lazy(() => import("./pages/Reader.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

export default function App() {
  const location = useLocation();

  return (
    <>
      <div className="grain" />
      <Header count={papers.length} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={null}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Library />} />
              <Route path="/paper/:id" element={<Reader />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
