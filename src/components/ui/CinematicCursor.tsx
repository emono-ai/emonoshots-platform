'use client';
// src/components/ui/CinematicCursor.tsx

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEmonoStore } from '@/store/emonoStore';

export function CinematicCursor() {
  const { cursorVariant, cameraMode } = useEmonoStore();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX  = useMotionValue(-100);
  const ringY  = useMotionValue(-100);

  // Lagging ring
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  const dotVariants = {
    default:  { width: 8,  height: 8,  backgroundColor: 'rgba(255,138,0,0.9)', borderRadius: '50%' },
    camera:   { width: 4,  height: 4,  backgroundColor: 'rgba(255,138,0,1)',   borderRadius: '50%' },
    drag:     { width: 48, height: 48, backgroundColor: 'rgba(255,138,0,0.15)',borderRadius: '50%' },
    expand:   { width: 60, height: 60, backgroundColor: 'rgba(255,138,0,0.1)', borderRadius: '50%' },
    play:     { width: 56, height: 56, backgroundColor: 'rgba(255,138,0,0.2)', borderRadius: '50%' },
  };

  const ringVariants = {
    default:  { width: 36, height: 36, borderColor: 'rgba(255,138,0,0.35)' },
    camera:   { width: 56, height: 56, borderColor: 'rgba(255,138,0,0.8)'  },
    drag:     { width: 12, height: 12, borderColor: 'rgba(255,138,0,0.8)'  },
    expand:   { width: 12, height: 12, borderColor: 'rgba(255,138,0,0.6)'  },
    play:     { width: 12, height: 12, borderColor: 'rgba(255,138,0,0.6)'  },
  };

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[200]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
        animate={dotVariants[cursorVariant]}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Camera mode crosshair */}
        {cameraMode && (
          <>
            <div className="absolute top-1/2 left-0 w-full h-px bg-brand-amber/60" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-brand-amber/60" />
          </>
        )}
      </motion.div>

      {/* Lagging outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[199] rounded-full border"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        animate={ringVariants[cursorVariant]}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
      />
    </>
  );
}
