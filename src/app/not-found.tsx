// src/app/not-found.tsx
'use client';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-center px-6">
      <motion.p className="section-label mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        404 · Frame Not Found
      </motion.p>
      <motion.h1
        className="font-display text-[clamp(80px,15vw,180px)] leading-none tracking-wider text-white/10 mb-8"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
      >
        404
      </motion.h1>
      <motion.p
        className="font-body text-[13px] font-light text-white/40 max-w-xs mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        This frame doesn't exist in the universe. Let's take you somewhere real.
      </motion.p>
      <a href="/" className="btn-primary cursor-none">← Back to EMONOSHOTS</a>
    </div>
  );
}
