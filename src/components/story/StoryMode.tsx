'use client';
// src/components/story/StoryMode.tsx
// Cinematic documentary-style photo story viewer

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmonoStore } from '@/store/emonoStore';
import Image from 'next/image';

export function StoryMode() {
  const { activeStoryPhoto, setActiveStoryPhoto } = useEmonoStore();
  const [baPosition, setBaPosition] = useState(50);
  const baActive = useRef(false);
  const baRef = useRef<HTMLDivElement>(null);

  const handleBAMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!baActive.current || !baRef.current) return;
    const rect = baRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setBaPosition(pct);
  }, []);

  const close = () => setActiveStoryPhoto(null);

  // Demo story data — in production these come from the activeStoryPhoto prop
  const story = activeStoryPhoto ?? {
    title: 'Smoke & Precision',
    category: 'AUTOMOTIVE',
    description: 'The circuit smelled of burnt rubber and ambition. 3am at the Port of Casablanca — only the photographer, the driver, and an abandoned pier that became a stage for controlled chaos.',
    story: 'The moment that made this frame was not the drift itself — it was the half-second of absolute stillness before it began. That pause where the driver commits everything.',
    camera: 'Sony A7 IV',
    lens: '85mm f/1.4 GM',
    aperture: 'f/1.8',
    shutterSpeed: '1/500',
    iso: 3200,
    locationName: 'Port de Casablanca, Pier 7',
    imageUrl: '',
    slug: 'smoke-and-precision',
    featured: true,
    published: true,
    views: 0,
    id: 'demo',
    createdAt: new Date().toISOString(),
  } as any;

  return (
    <AnimatePresence>
      {activeStoryPhoto !== null && (
        <motion.div
          className="fixed inset-0 z-50 bg-brand-black overflow-y-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Close */}
          <button
            onClick={close}
            className="fixed top-7 right-10 z-60 font-body text-[9px] tracking-[0.35em] uppercase text-white/35 hover:text-brand-amber transition-colors cursor-none"
          >
            ← Back
          </button>

          <div className="max-w-[820px] mx-auto px-6 pb-32 pt-0">
            {/* Hero image */}
            <div className="w-full aspect-video bg-brand-graphite mb-14 relative overflow-hidden">
              {story.imageUrl ? (
                <Image src={story.imageUrl} alt={story.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,138,0,0.2)" strokeWidth="0.5">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
                    <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
                    <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
                  </svg>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-black" />
            </div>

            {/* Meta */}
            <p className="section-label mb-4">{story.category} · Documentary</p>
            <h1 className="font-display text-[clamp(40px,7vw,88px)] leading-none tracking-[0.02em] text-white mb-10">
              {story.title.includes('&')
                ? story.title.split('&').map((p: string, i: number) => (
                    <span key={i}>{i === 1 ? <span className="text-brand-amber">&</span> : ''}{i === 1 ? p : p}</span>
                  ))
                : story.title}
            </h1>

            <div className="amber-divider mb-14" />

            {/* Context */}
            <StorySection label="Context">
              <p>{story.description}</p>
            </StorySection>

            {/* Discovery */}
            <StorySection label="The Discovery">
              <p>{story.story}</p>
            </StorySection>

            {/* Camera settings */}
            <StorySection label="Camera Settings">
              <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5">
                {[
                  { label: 'Camera',   value: story.camera ?? 'Sony A7 IV' },
                  { label: 'Lens',     value: story.lens ?? '85mm f/1.4' },
                  { label: 'ISO',      value: String(story.iso ?? '3200') },
                  { label: 'Shutter',  value: story.shutterSpeed ?? '1/500s' },
                  { label: 'Aperture', value: story.aperture ?? 'f/1.8' },
                  { label: 'Location', value: story.locationName ?? 'Casablanca' },
                ].map((item) => (
                  <div key={item.label} className="bg-brand-deep p-4">
                    <p className="exif-label mb-1">{item.label}</p>
                    <p className="font-display text-[22px] text-white tracking-wider">{item.value}</p>
                  </div>
                ))}
              </div>
            </StorySection>

            {/* Before / After */}
            <StorySection label="Before / After">
              <div
                ref={baRef}
                className="relative w-full aspect-video bg-brand-graphite overflow-hidden select-none"
                style={{ cursor: 'ew-resize' }}
                onMouseDown={() => { baActive.current = true; }}
                onMouseUp={() => { baActive.current = false; }}
                onMouseLeave={() => { baActive.current = false; }}
                onMouseMove={handleBAMove}
                onTouchStart={() => { baActive.current = true; }}
                onTouchEnd={() => { baActive.current = false; }}
                onTouchMove={handleBAMove}
              >
                {/* RAW side */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <span className="font-body text-[9px] tracking-[0.5em] uppercase text-white/30">RAW</span>
                </div>
                {/* EDITED side */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - baPosition}% 0 0)` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF8A00]/20 to-zinc-900 flex items-center justify-center">
                    <span className="font-body text-[9px] tracking-[0.5em] uppercase text-white/30">EDITED</span>
                  </div>
                </div>
                {/* Divider handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-brand-amber"
                  style={{ left: `${baPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-amber flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="15 18 9 12 15 6"/>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="font-body text-[9px] tracking-[0.3em] uppercase text-white/25 mt-3 text-center">
                Drag to compare RAW vs. final edit
              </p>
            </StorySection>

            {/* Commission CTA */}
            <div className="border-t border-white/6 pt-14 mt-4 text-center">
              <p className="section-label mb-4">Commission a similar series</p>
              <button
                onClick={() => {
                  setActiveStoryPhoto(null);
                  useEmonoStore.getState().setAIOpen(true);
                }}
                className="btn-ghost cursor-none"
              >
                Talk to AI Concierge →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StorySection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-14">
      <p className="section-label pb-3 mb-5 border-b border-brand-amber/20">{label}</p>
      <div className="font-body text-[14px] font-light leading-[1.95] text-white/60">{children}</div>
    </div>
  );
}
