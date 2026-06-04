'use client';
// src/components/ui/HeroUI.tsx

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmonoStore } from '@/store/emonoStore';
import { CameraMode } from '@/components/camera/CameraMode';
import { AIConcierge } from '@/components/ai/AIConcierge';
import { PhotoUniverse } from '@/components/universe/PhotoUniverse';
import { StoryMode } from '@/components/story/StoryMode';

const CATEGORIES = ['Galaxy', 'Automotive', 'Architecture', 'Street', 'Macro', 'Drift'] as const;
type Mode = typeof CATEGORIES[number];

export function HeroUI() {
  const {
    phase, navVisible,
    cameraMode, setCameraMode,
    universeMode, setUniverseMode,
    aiOpen, setAIOpen,
    activeStoryPhoto,
    setPhase,
    setCursorVariant,
  } = useEmonoStore();

  const visible = phase === 'main' || phase === 'camera' || phase === 'universe' || phase === 'ai';

  return (
    <>
      {/* Main UI */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            {/* Navigation */}
            <Nav onCameraToggle={() => setCameraMode(!cameraMode)} onAI={() => setAIOpen(true)} onUniverse={() => setUniverseMode(true)} />

            {/* Hero Text */}
            <HeroText />

            {/* Scroll indicator */}
            <ScrollIndicator />

            {/* Mode bar */}
            <ModeBar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen overlays */}
      <CameraMode />
      <AIConcierge />
      <PhotoUniverse />
      <StoryMode />
    </>
  );
}

// ── Navigation ─────────────────────────────────────────────
function Nav({ onCameraToggle, onAI, onUniverse }: {
  onCameraToggle: () => void;
  onAI: () => void;
  onUniverse: () => void;
}) {
  const { cameraMode } = useEmonoStore();

  return (
    <nav className="absolute top-0 left-0 w-full px-10 py-7 flex items-center justify-between pointer-events-auto z-20">
      {/* Logo */}
      <motion.div
        className="font-display text-[18px] tracking-[0.15em] text-white cursor-none select-none"
        whileHover={{ scale: 1.02 }}
      >
        EMONO<span className="text-brand-amber">SHOTS</span>
      </motion.div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        <button onClick={onUniverse} className="nav-link cursor-none">Universe</button>
        <a href="/story/smoke-and-precision" className="nav-link cursor-none">Story</a>
        <button onClick={onAI} className="nav-link cursor-none">AI Concierge</button>
        <a href="/client-portal" className="nav-link cursor-none">Client Portal</a>
      </div>

      {/* CTA */}
      <motion.button
        onClick={onCameraToggle}
        className="btn-primary pointer-events-auto cursor-none"
        whileTap={{ scale: 0.97 }}
      >
        {cameraMode ? 'Exit Camera' : 'Enter Camera Mode'}
      </motion.button>
    </nav>
  );
}

// ── Hero Text ──────────────────────────────────────────────
function HeroText() {
  return (
    <div className="absolute left-10 bottom-24 pointer-events-none">
      <motion.p
        className="section-label mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Casablanca · Morocco
      </motion.p>

      <motion.h1
        className="font-display text-[clamp(52px,7.5vw,100px)] leading-[0.93] tracking-[0.02em] text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        Frames<br />
        That Hit<br />
        <span className="text-brand-amber">Different.</span>
      </motion.h1>

      <motion.p
        className="mt-6 font-body text-[12px] font-light tracking-[0.2em] text-white/35 max-w-xs leading-[1.9]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        Automotive · Drift · Architecture · Street · Macro · Cinematic Portraits
      </motion.p>
    </div>
  );
}

// ── Scroll indicator ───────────────────────────────────────
function ScrollIndicator() {
  return (
    <div className="absolute right-10 bottom-24 flex flex-col items-center gap-3">
      <span className="font-body text-[9px] tracking-[0.5em] uppercase text-white/30 [writing-mode:vertical-rl]">
        Explore
      </span>
      <div className="w-px h-16 relative overflow-hidden bg-white/10">
        <motion.div
          className="absolute top-0 left-0 w-full bg-brand-amber"
          animate={{ scaleY: [0, 1, 0] }}
          style={{ transformOrigin: 'top' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ height: '100%', transformOrigin: 'top' }}
        />
      </div>
    </div>
  );
}

// ── Mode bar ───────────────────────────────────────────────
function ModeBar() {
  const { activeCategory, setActiveCategory } = useEmonoStore();

  return (
    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-px pointer-events-auto">
      {CATEGORIES.map((cat) => {
        const isActive = (cat === 'Galaxy' && !activeCategory) || cat.toUpperCase() === activeCategory;
        return (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === 'Galaxy' ? null : (cat.toUpperCase() as any))}
            className={`px-5 py-2 font-body text-[9px] tracking-[0.3em] uppercase transition-all duration-300 cursor-none
              ${isActive
                ? 'text-brand-amber border border-brand-amber/40 bg-brand-amber/5'
                : 'text-white/35 border border-white/10 hover:text-brand-amber/70 hover:border-brand-amber/20'
              }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
