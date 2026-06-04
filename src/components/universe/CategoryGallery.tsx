'use client';
// src/components/universe/CategoryGallery.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEmonoStore } from '@/store/emonoStore';
import type { Category, Photo } from '@/types';

const CATEGORY_META: Record<Category, { label: string; color: string; desc: string }> = {
  AUTOMOTIVE:   { label: 'Automotive',   color: '#FF8A00', desc: 'Speed. Metal. Light.' },
  DRIFT:        { label: 'Drift',        color: '#FF2244', desc: 'Smoke. Angle. Precision.' },
  MOTORSPORTS:  { label: 'Motorsports',  color: '#FF4400', desc: 'Competition. Speed. Glory.' },
  ARCHITECTURE: { label: 'Architecture', color: '#4488FF', desc: 'Form. Silence. Structure.' },
  STREET:       { label: 'Street',       color: '#FF6644', desc: 'Real. Raw. Casablanca.' },
  MACRO:        { label: 'Macro',        color: '#44DD88', desc: 'Invisible worlds revealed.' },
  PORTRAIT:     { label: 'Portraits',    color: '#AA44FF', desc: 'A face. A story. A second.' },
  CINEMATIC:    { label: 'Cinematic',    color: '#FFDD44', desc: 'Every frame, a film still.' },
};

// Placeholder photos for demo
function buildPlaceholderPhotos(category: Category, count = 12): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${category}-${i}`,
    title: `${CATEGORY_META[category].label} No. ${i + 1}`,
    slug: `${category.toLowerCase()}-${i + 1}`,
    category,
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=1200&h=800&fit=crop&auto=format&q=80`,
    thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=600&h=400&fit=crop&auto=format&q=60`,
    featured: i < 3,
    published: true,
    views: Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString(),
  }));
}

export function CategoryGallery({ category }: { category: Category }) {
  const { setActiveStoryPhoto, setCursorVariant } = useEmonoStore();
  const meta = CATEGORY_META[category];
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/photos?category=${category}&limit=24`)
      .then((r) => r.json())
      .then((d) => {
        setPhotos(d.photos?.length ? d.photos : buildPlaceholderPhotos(category));
      })
      .catch(() => setPhotos(buildPlaceholderPhotos(category)))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Back nav */}
      <div className="fixed top-0 left-0 right-0 z-20 px-10 py-7 flex items-center justify-between bg-gradient-to-b from-black to-transparent pointer-events-none">
        <span className="font-display text-[18px] tracking-[0.15em]">
          EMONO<span className="text-brand-amber">SHOTS</span>
        </span>
        <a href="/" className="nav-link pointer-events-auto cursor-none">← Universe</a>
      </div>

      {/* Hero header */}
      <div className="pt-32 pb-20 px-10">
        <motion.p
          className="section-label mb-4"
          style={{ color: meta.color }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          {meta.label}
        </motion.p>
        <motion.h1
          className="font-display text-[clamp(52px,8vw,104px)] leading-none tracking-[0.02em] text-white"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
        >
          {meta.desc.split('. ').map((word, i) => (
            <span key={i} style={i === 0 ? { color: meta.color } : {}}>{word}{i < 2 ? '.\n' : ''}</span>
          ))}
        </motion.h1>
      </div>

      {/* Masonry-style grid */}
      <div className="px-4 pb-32 columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
        {(loading ? Array.from({ length: 12 }) : photos).map((photo, i) =>
          !photo ? (
            <div key={i} className="break-inside-avoid w-full aspect-[4/5] bg-brand-graphite animate-pulse mb-2" />
          ) : (
            <motion.div
              key={(photo as Photo).id}
              className="break-inside-avoid w-full relative overflow-hidden bg-brand-graphite cursor-none mb-2 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              onClick={() => setActiveStoryPhoto(photo as Photo)}
              onMouseEnter={() => setCursorVariant('expand')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {(photo as Photo).thumbnailUrl && (
                <Image
                  src={(photo as Photo).thumbnailUrl!}
                  alt={(photo as Photo).title}
                  width={600} height={400}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <div className="absolute bottom-4 left-4">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/60 mb-1">{(photo as Photo).category}</p>
                  <p className="font-display text-[18px] tracking-wide text-white">{(photo as Photo).title}</p>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
