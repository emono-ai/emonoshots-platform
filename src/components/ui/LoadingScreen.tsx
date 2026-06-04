'use client';
// src/components/ui/LoadingScreen.tsx

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmonoStore } from '@/store/emonoStore';

export function LoadingScreen() {
  const { phase, setPhase, loadProgress, setLoadProgress, setNavVisible } = useEmonoStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (phase !== 'loading') return;

    // Simulate asset loading with realistic variance
    let progress = 0;
    intervalRef.current = setInterval(() => {
      const increment = Math.random() * 4 + (progress < 70 ? 2 : 0.5);
      progress = Math.min(progress + increment, 100);
      setLoadProgress(progress);

      if (progress >= 100) {
        clearInterval(intervalRef.current!);
        setTimeout(() => setPhase('reveal'), 300);
      }
    }, 60);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, setPhase, setLoadProgress]);

  useEffect(() => {
    if (phase === 'main') {
      setTimeout(() => setNavVisible(true), 800);
    }
  }, [phase, setNavVisible]);

  const isLoading  = phase === 'loading';
  const isRevealing = phase === 'reveal';

  return (
    <AnimatePresence>
      {(isLoading || isRevealing) && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Loader text */}
          <AnimatePresence>
            {isLoading && (
              <motion.p
                className="loader-text mb-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                LOADING MEMORIES...
              </motion.p>
            )}
          </AnimatePresence>

          {/* EMONOSHOTS reveal */}
          <AnimatePresence>
            {isRevealing && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.15 }}
                transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
              >
                <motion.h1
                  className="font-display text-[clamp(52px,10vw,140px)] tracking-[0.15em] text-white text-center"
                  initial={{ letterSpacing: '0.05em', opacity: 0 }}
                  animate={{ letterSpacing: '0.15em', opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                >
                  EMONO<span className="text-brand-amber">SHOTS</span>
                </motion.h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-white/5">
            <motion.div
              className="h-full bg-brand-amber"
              style={{ width: `${loadProgress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          {/* Progress percentage */}
          {isLoading && (
            <div className="absolute bottom-6 right-8">
              <span className="font-mono text-[10px] tracking-[0.3em] text-white/20">
                {Math.round(loadProgress).toString().padStart(3, '0')}
              </span>
            </div>
          )}

          {/* Location tag */}
          <div className="absolute bottom-6 left-8">
            <span className="font-body text-[9px] tracking-[0.4em] uppercase text-white/20">
              Casablanca · Morocco
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
