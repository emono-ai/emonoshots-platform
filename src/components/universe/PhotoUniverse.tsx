'use client';
// src/components/universe/PhotoUniverse.tsx
import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmonoStore } from '@/store/emonoStore';
import type { Category } from '@/types';

interface ConstellationDef {
  id: Category; label: string; color: string;
  x: number; y: number; size: number; count: number; desc: string;
}

const CONSTELLATIONS: ConstellationDef[] = [
  { id: 'AUTOMOTIVE',   label: 'Automotive',   color: '#FF8A00', x: 18, y: 22, size: 6, count: 18, desc: 'Speed. Metal. Light.' },
  { id: 'ARCHITECTURE', label: 'Architecture', color: '#4488FF', x: 72, y: 30, size: 5, count: 14, desc: 'Form. Silence. Structure.' },
  { id: 'STREET',       label: 'Street',       color: '#FF6644', x: 25, y: 65, size: 5, count: 16, desc: 'Real. Raw. Casablanca.' },
  { id: 'MACRO',        label: 'Macro',        color: '#44DD88', x: 68, y: 68, size: 4, count: 12, desc: 'Invisible worlds revealed.' },
  { id: 'PORTRAIT',     label: 'Portraits',    color: '#AA44FF', x: 45, y: 82, size: 5, count: 10, desc: 'A face. A story. A second.' },
  { id: 'DRIFT',        label: 'Drift',        color: '#FF2244', x: 55, y: 18, size: 4, count: 8,  desc: 'Smoke. Angle. Precision.' },
];

function buildStars(cx: number, cy: number, count: number, color: string) {
  return Array.from({ length: count }, (_, i) => {
    const angle  = (i / count) * Math.PI * 2 + i * 0.9;
    const radius = 3 + ((i * 17) % 7) * 1.5;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, size: 1 + ((i * 7) % 3) * 0.7, opacity: 0.3 + ((i * 11) % 6) * 0.1, color };
  });
}
function buildLines(stars: ReturnType<typeof buildStars>) {
  const lines = [];
  for (let i = 0; i < Math.min(stars.length - 1, 8); i++) {
    if (i % 2 === 0) lines.push({ x1: stars[i].x, y1: stars[i].y, x2: stars[i+1].x, y2: stars[i+1].y });
  }
  return lines;
}

export function PhotoUniverse() {
  const { universeMode, setUniverseMode, setActiveCategory } = useEmonoStore();
  const [hovered, setHovered] = useState<Category | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tempOffset, setTempOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = false;
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;
    isDragging.current = true;
    setTempOffset({ x: (e.clientX - dragStart.x) * 0.15, y: (e.clientY - dragStart.y) * 0.08 });
  };
  const handleMouseUp = () => {
    if (isDragging.current) setOffset((p) => ({ x: p.x + tempOffset.x, y: p.y + tempOffset.y }));
    setTempOffset({ x: 0, y: 0 });
    setDragStart(null);
  };
  const handleClusterClick = useCallback((cat: Category) => {
    if (isDragging.current) return;
    setActiveCategory(cat);
    setUniverseMode(false);
  }, [setActiveCategory, setUniverseMode]);

  return (
    <AnimatePresence>
      {universeMode && (
        <motion.div
          className="fixed inset-0 z-30 overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          style={{ cursor: dragStart ? 'grabbing' : 'grab' }}
        >
          <div className="absolute top-0 left-0 right-0 z-10 px-10 py-7 flex justify-between items-center pointer-events-none">
            <span className="section-label">Photo Universe</span>
            <button className="nav-link pointer-events-auto cursor-none" onClick={() => setUniverseMode(false)}>← Back</button>
          </div>

          <motion.p
            className="absolute bottom-20 left-1/2 -translate-x-1/2 font-body text-[9px] tracking-[0.4em] uppercase text-white/25 text-center pointer-events-none z-10"
            animate={{ opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 4, repeat: Infinity }}
          >
            Drag to explore · Click a constellation to enter
          </motion.p>

          <motion.div className="absolute inset-0" style={{ x: offset.x + tempOffset.x, y: offset.y + tempOffset.y }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
              {Array.from({ length: 120 }, (_, i) => (
                <circle key={`bg-${i}`} cx={(i * 37 + 11) % 100} cy={(i * 53 + 7) % 100}
                  r={0.08 + ((i * 3) % 4) * 0.06} fill="white" opacity={0.1 + ((i * 7) % 4) * 0.07} />
              ))}
              {CONSTELLATIONS.map((cl) => {
                const stars = buildStars(cl.x, cl.y, cl.count, cl.color);
                const lines = buildLines(stars);
                const isHov = hovered === cl.id;
                return (
                  <g key={cl.id} onClick={() => handleClusterClick(cl.id)}
                    onMouseEnter={() => setHovered(cl.id)} onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}>
                    {lines.map((ln, i) => (
                      <line key={i} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
                        stroke={cl.color} strokeWidth={0.08} opacity={isHov ? 0.5 : 0.15}
                        style={{ transition: 'opacity 0.4s' }} />
                    ))}
                    {stars.map((s, i) => (
                      <circle key={i} cx={s.x} cy={s.y} r={isHov ? s.size * 0.18 : s.size * 0.12}
                        fill={s.color} opacity={isHov ? Math.min(s.opacity * 2, 1) : s.opacity}
                        style={{ transition: 'all 0.4s' }} />
                    ))}
                    <circle cx={cl.x} cy={cl.y} r={isHov ? cl.size * 0.22 : cl.size * 0.14}
                      fill={cl.color} opacity={isHov ? 0.9 : 0.6}
                      style={{ transition: 'all 0.3s', filter: isHov ? `drop-shadow(0 0 2px ${cl.color})` : 'none' }} />
                    {isHov && <circle cx={cl.x} cy={cl.y} r={cl.size * 0.9} fill={cl.color} opacity={0.06} />}
                    <text x={cl.x} y={cl.y + cl.size * 0.6 + 2.5} textAnchor="middle"
                      fontSize="2.2" fontFamily="var(--font-dm-sans),sans-serif" fontWeight="300"
                      letterSpacing="0.5" fill={cl.color} opacity={isHov ? 0.9 : 0.45}
                      style={{ transition: 'opacity 0.3s' }}>
                      {cl.label.toUpperCase()}
                    </text>
                    {isHov && (
                      <text x={cl.x} y={cl.y + cl.size * 0.6 + 5.5} textAnchor="middle"
                        fontSize="1.6" fontFamily="var(--font-dm-sans),sans-serif"
                        fontWeight="300" fill="white" opacity={0.4}>{cl.desc}</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </motion.div>

          <AnimatePresence>
            {hovered && (() => {
              const cl = CONSTELLATIONS.find((c) => c.id === hovered)!;
              return (
                <motion.div className="absolute bottom-10 left-10 pointer-events-none"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
                  <p className="section-label mb-1" style={{ color: cl.color }}>{cl.label}</p>
                  <p className="font-display text-[40px] tracking-wider text-white/80 leading-none">{cl.desc}</p>
                  <p className="font-body text-[9px] tracking-[0.4em] uppercase text-white/30 mt-2">Click to enter constellation</p>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
