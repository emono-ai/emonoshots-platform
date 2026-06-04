'use client';
// src/components/layout/CinematicEntry.tsx
// Handles the "cursor as camera" hidden-image reveal effect during loading
import { useEffect, useRef } from 'react';
import { useEmonoStore } from '@/store/emonoStore';

export function CinematicEntry() {
  const { phase } = useEmonoStore();
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 'loading') return;
    const el = spotlightRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.background = `radial-gradient(circle 180px at ${e.clientX}px ${e.clientY}px, rgba(255,138,0,0.06) 0%, transparent 70%)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [phase]);

  if (phase !== 'loading') return null;

  return (
    <div
      ref={spotlightRef}
      className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
