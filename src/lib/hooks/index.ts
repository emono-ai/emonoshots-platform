// src/lib/hooks/index.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

// ── Konami code hook ───────────────────────────────────────
export function useKonamiCode(callback: () => void) {
  const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  const buffer = useRef<number[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      buffer.current.push(e.keyCode);
      if (buffer.current.length > KONAMI.length) buffer.current.shift();
      if (buffer.current.join(',') === KONAMI.join(',')) {
        callback();
        buffer.current = [];
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [callback]);
}

// ── Mouse parallax ─────────────────────────────────────────
export function useMouseParallax(strength = 1) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth  - 0.5) * strength * 40);
      y.set((e.clientY / window.innerHeight - 0.5) * strength * 40);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [strength, x, y]);

  return { x: springX, y: springY };
}

// ── Scroll progress ────────────────────────────────────────
export function useScrollProgress() {
  const progress = useMotionValue(0);

  useEffect(() => {
    const handler = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      progress.set(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [progress]);

  return progress;
}

// ── Intersection observer ──────────────────────────────────
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ── Cursor hover variants ──────────────────────────────────
export function useCursorHover(variant: 'expand' | 'play' | 'drag') {
  const { setCursorVariant } = require('@/store/emonoStore').useEmonoStore();

  return {
    onMouseEnter: () => setCursorVariant(variant),
    onMouseLeave: () => setCursorVariant('default'),
  };
}

// ── Lenis smooth scroll init ───────────────────────────────
export function useSmoothScroll() {
  useEffect(() => {
    let lenis: any;
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });
    return () => lenis?.destroy();
  }, []);
}

// ── Window size ────────────────────────────────────────────
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}

// ── Debounce ───────────────────────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
