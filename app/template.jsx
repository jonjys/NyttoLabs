'use client'

import { motion } from 'framer-motion'

// Next re-mounts this on every navigation (unlike layout.jsx, which persists),
// so every page — Home, Products, Partners, Contact, legal — gets the same
// soft fade-and-rise entrance instead of a hard cut. Keeps the chrome (nav,
// footer) stable since only the page content underneath template.jsx moves.
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
