import { motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, rotateY: -14, x: 30 },
  animate: { opacity: 1, rotateY: 0, x: 0 },
  exit: { opacity: 0, rotateY: 10, x: -18 },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      style={{
        transformPerspective: 1800,
        transformOrigin: "left center",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
