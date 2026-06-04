'use client';
// src/components/ui/SecretFeatures.tsx
// Konami code, dev mode, night drive, weather-reactive, seasonal overlays

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmonoStore } from '@/store/emonoStore';

const KONAMI = [38,38,40,40,37,39,37,39,66,65];

export function SecretFeatures() {
  const { nightDriveMode, setNightDriveMode, devMode, setDevMode, unlockSecret, secrets } = useEmonoStore();
  const konamiIdx = useRef(0);

  // Konami code → Night Drive Mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.keyCode === KONAMI[konamiIdx.current]) {
        konamiIdx.current++;
        if (konamiIdx.current === KONAMI.length) {
          konamiIdx.current = 0;
          setNightDriveMode(true);
          unlockSecret('night-drive');
        }
      } else {
        konamiIdx.current = 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setNightDriveMode, unlockSecret]);

  // Dev mode: Ctrl+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDevMode(!devMode);
        unlockSecret('dev-mode');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [devMode, setDevMode, unlockSecret]);

  // Apply dev mode class
  useEffect(() => {
    if (devMode) document.body.classList.add('dev-mode');
    else document.body.classList.remove('dev-mode');
  }, [devMode]);

  // Apply night drive CSS variable override
  useEffect(() => {
    if (nightDriveMode) {
      document.documentElement.style.setProperty('--brand-amber', '#00FFAA');
      document.documentElement.style.setProperty('--night-drive', '1');
    } else {
      document.documentElement.style.setProperty('--brand-amber', '#FF8A00');
      document.documentElement.style.removeProperty('--night-drive');
    }
  }, [nightDriveMode]);

  return (
    <>
      {/* Night Drive activation banner */}
      <AnimatePresence>
        {nightDriveMode && secrets.has('night-drive') && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] text-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setTimeout(() => {}, 3000)}
          >
            <p className="font-display text-[56px] tracking-[0.2em]" style={{ color: 'var(--brand-amber)' }}>
              NIGHT DRIVE MODE
            </p>
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-white/40 mt-2">
              SECRET ACTIVATED
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Night Drive: subtle teal colour shift overlay */}
      <AnimatePresence>
        {nightDriveMode && (
          <motion.div
            className="fixed inset-0 z-[5] pointer-events-none"
            style={{ background: 'rgba(0,30,40,0.25)', mixBlendMode: 'multiply' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          />
        )}
      </AnimatePresence>

      {/* Night Drive: exit hint */}
      {nightDriveMode && (
        <button
          onClick={() => setNightDriveMode(false)}
          className="fixed bottom-20 right-10 z-50 font-body text-[8px] tracking-[0.4em] uppercase cursor-none"
          style={{ color: 'var(--brand-amber)', opacity: 0.5 }}
        >
          Exit Night Drive
        </button>
      )}

      {/* Dev mode indicator */}
      {devMode && (
        <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-[999] font-mono text-[8px] tracking-[0.3em] text-green-400 bg-black/80 px-3 py-1 border border-green-400/30">
          DEV MODE · Ctrl+Shift+D to exit
        </div>
      )}

      {/* Seasonal ambient — winter: subtle snow particles (December–February) */}
      <SeasonalOverlay />
    </>
  );
}

function SeasonalOverlay() {
  const month = new Date().getMonth(); // 0-indexed
  const isWinter = month === 11 || month <= 1;

  if (!isWinter) return null;

  return (
    <div className="fixed inset-0 z-[6] pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-white/30 rounded-full"
          style={{ left: `${(i * 13 + 5) % 100}%`, top: '-2px' }}
          animate={{ y: ['0vh', '102vh'], opacity: [0, 0.3, 0] }}
          transition={{
            duration: 8 + (i % 5) * 2,
            repeat: Infinity,
            delay: (i * 0.7) % 6,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
