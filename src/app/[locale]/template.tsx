"use client";

import { motion } from "framer-motion";

/**
 * Re-mounts on every navigation, giving each route a cinematic entrance.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: "blur(8px)", scale: 0.992 }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
