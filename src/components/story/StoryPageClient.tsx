'use client';
// src/app/story/[slug]/StoryPageClient.tsx

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { useEmonoStore } from '@/store/emonoStore';
import type { SanityPhoto } from '@/types';

export function StoryPageClient({ photo }: { photo: SanityPhoto }) {
  const { setActiveStoryPhoto } = useEmonoStore();

  // Sync with store
  useEffect(() => {
    return () => setActiveStoryPhoto(null);
  }, [setActiveStoryPhoto]);

  const exif = photo.exif ?? {};

  return (
    <div className="min-h-screen bg-brand-black text-white">
      {/* Back nav */}
      <div className="fixed top-7 right-10 z-50">
        <Link href="/" className="nav-link hover:text-brand-amber">← Home</Link>
      </div>

      {/* Hero image */}
      <motion.section
        className="relative w-full aspect-[21/9] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
      >
        {photo.image?.asset?._ref ? (
          <Image
            src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${photo.image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`}
            alt={photo.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-graphite flex items-center justify-center">
            <span className="font-body text-white/10 tracking-widest text-xs uppercase">
              {photo.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <div className="absolute bottom-10 left-10 z-10">
          <p className="section-label mb-3">{photo.category} · {photo.location?.name}</p>
        </div>
      </motion.section>

      {/* Content */}
      <article className="max-w-[820px] mx-auto px-8 py-20">
        {/* Title */}
        <motion.h1
          className="font-display text-[clamp(56px,8vw,96px)] leading-none text-white mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {photo.title}
        </motion.h1>

        {/* Story sections from Portable Text */}
        {photo.story && (
          <div className="prose prose-invert max-w-none mb-16
            prose-p:font-body prose-p:text-[14px] prose-p:font-light prose-p:leading-[1.9] prose-p:text-white/60
            prose-h2:font-display prose-h2:text-[32px] prose-h2:tracking-wider prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6
            prose-strong:text-brand-amber prose-strong:font-normal">
            <PortableText value={photo.story} />
          </div>
        )}

        {/* EXIF Grid */}
        {Object.keys(exif).length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <p className="section-label">Camera Settings</p>
              <div className="flex-1 h-px bg-brand-amber/15" />
            </div>
            <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5">
              {[
                { label: 'Camera',   value: exif.camera },
                { label: 'Lens',     value: exif.lens },
                { label: 'Aperture', value: exif.aperture },
                { label: 'Shutter',  value: exif.shutterSpeed },
                { label: 'ISO',      value: exif.iso },
                { label: 'Focal',    value: exif.focalLength },
              ].filter((e) => e.value).map(({ label, value }) => (
                <div key={label} className="p-5 bg-brand-deep">
                  <p className="exif-label mb-2">{label}</p>
                  <p className={`font-display tracking-wider ${
                    ['Aperture', 'Shutter', 'ISO'].includes(label) ? 'text-3xl text-white' : 'text-base text-white/60'
                  }`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="border-t border-white/6 pt-14 text-center">
          <p className="section-label mb-5">Commission a similar series</p>
          <Link href="/?ai=open" className="btn-ghost">
            Talk to AI Concierge →
          </Link>
        </div>
      </article>
    </div>
  );
}
