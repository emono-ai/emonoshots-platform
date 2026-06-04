'use client';
// src/components/camera/CameraMode.tsx
// Full DSLR viewfinder overlay with live aperture wheel, bokeh, EXIF readout

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmonoStore, selectCameraSettings } from '@/store/emonoStore';

const FOCUS_MODES = ['AF-S', 'AF-C', 'MF'] as const;
const SHOOT_MODES = ['M', 'A', 'S', 'P'] as const;

export function CameraMode() {
  const {
    cameraMode, setCameraMode,
    apertureIndex, apertureStops,
    incrementAperture, decrementAperture,
    currentAperture,
    setCursorVariant,
  } = useEmonoStore();

  const settings = useEmonoStore(selectCameraSettings);

  // Wheel to adjust aperture
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!cameraMode) return;
      e.preventDefault();
      if (e.deltaY > 0) incrementAperture();
      else decrementAperture();
    },
    [cameraMode, incrementAperture, decrementAperture]
  );

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    if (cameraMode) setCursorVariant('camera');
    else setCursorVariant('default');
  }, [cameraMode, setCursorVariant]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cameraMode) setCameraMode(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cameraMode, setCameraMode]);

  // Bokeh blur on canvas
  useEffect(() => {
    const canvas = document.getElementById('threejs-canvas') as HTMLDivElement;
    if (!canvas) return;
    const blur = currentAperture.bokeh > 0.9 ? '2px' : '0px';
    canvas.style.filter = `blur(${blur})`;
    canvas.style.transition = 'filter 0.5s ease';
  }, [currentAperture]);

  const bokeh = currentAperture.bokeh;

  return (
    <AnimatePresence>
      {cameraMode && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Header */}
          <div className="absolute top-7 left-10 z-10">
            <span className="section-label text-brand-amber">CAMERA MODE</span>
          </div>
          <button
            onClick={() => setCameraMode(false)}
            className="absolute top-7 right-10 z-10 nav-link hover:text-brand-amber"
          >
            ESC · EXIT
          </button>

          {/* Viewfinder frame */}
          <div className="relative w-[min(720px,90vw)] h-[min(500px,70vh)]">
            {/* Outer border */}
            <div className="absolute inset-0 border border-brand-amber/25" />

            {/* Corner marks */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-brand-amber/90" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-brand-amber/90" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-brand-amber/90" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-brand-amber/90" />

            {/* Rule-of-thirds grid */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 right-0 h-px bg-brand-amber/12" style={{ top: '33.33%' }} />
              <div className="absolute left-0 right-0 h-px bg-brand-amber/12" style={{ top: '66.66%' }} />
              <div className="absolute top-0 bottom-0 w-px bg-brand-amber/12" style={{ left: '33.33%' }} />
              <div className="absolute top-0 bottom-0 w-px bg-brand-amber/12" style={{ left: '66.66%' }} />
            </div>

            {/* Center focus indicator */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 0.96, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-20 h-20 border border-brand-amber/60 relative">
                {/* Focus cross */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-px bg-brand-amber/60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-4 bg-brand-amber/60" />
              </div>
            </motion.div>

            {/* Bokeh depth-of-field visualization dots */}
            {bokeh > 0.3 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 12 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-brand-amber"
                    style={{
                      width: 4 + bokeh * 20,
                      height: 4 + bokeh * 20,
                      left: `${15 + (i % 4) * 22}%`,
                      top: `${10 + Math.floor(i / 4) * 35}%`,
                      opacity: bokeh * 0.12,
                      filter: `blur(${bokeh * 8}px)`,
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                  />
                ))}
              </div>
            )}

            {/* EXIF readout strip */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <ExifItem label="ISO" value={String(settings.iso)} />
              <ExifItem label="Shutter" value={settings.shutterSpeed} />
              <ExifItem label="Aperture" value={settings.aperture} highlight />
              <ExifItem label="Focus" value={settings.focusMode} />
              <ExifItem label="Mode" value={settings.shootingMode} />
            </div>
          </div>

          {/* Aperture wheel indicator */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-center">
            <div className="font-body text-[8px] tracking-[0.4em] uppercase text-white/30 mb-2">
              Aperture
            </div>
            {apertureStops.map((stop, i) => (
              <motion.button
                key={stop.value}
                onClick={() => useEmonoStore.getState().setApertureIndex(i)}
                className={`font-display text-[13px] tracking-wider transition-all duration-200 cursor-none ${
                  i === apertureIndex
                    ? 'text-brand-amber scale-125'
                    : Math.abs(i - apertureIndex) === 1
                    ? 'text-white/50'
                    : 'text-white/15'
                }`}
              >
                {stop.value}
              </motion.button>
            ))}
            <div className="font-body text-[8px] tracking-[0.3em] uppercase text-white/20 mt-2">
              Scroll ↕
            </div>
          </div>

          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute left-0 w-full h-px bg-brand-amber/8"
              animate={{ y: ['-2%', '102%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Bottom hint */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2">
            <p className="font-body text-[9px] tracking-[0.4em] uppercase text-white/25">
              Scroll to adjust aperture · Live depth of field
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Sub-component: EXIF item ───────────────────────────────
function ExifItem({ label, value, highlight = false }: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <span className="exif-label">{label}</span>
      <span className={`exif-readout ${highlight ? 'text-brand-amber' : 'text-white/80'}`}>
        {value}
      </span>
    </div>
  );
}
