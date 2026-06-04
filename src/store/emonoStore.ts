// EMONOSHOTS — Global State (Zustand)
'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CameraSettings, Photo, Category, ApertureStop } from '@/types';

// ── Aperture stops ─────────────────────────────────────────
const APERTURE_STOPS: ApertureStop[] = [
  { value: 'f/1.2', numeric: 1.2, bokeh: 1.0,  iso: 12800, shutter: '1/30'   },
  { value: 'f/1.4', numeric: 1.4, bokeh: 0.92, iso: 6400,  shutter: '1/60'   },
  { value: 'f/1.8', numeric: 1.8, bokeh: 0.82, iso: 6400,  shutter: '1/125'  },
  { value: 'f/2.0', numeric: 2.0, bokeh: 0.72, iso: 3200,  shutter: '1/250'  },
  { value: 'f/2.8', numeric: 2.8, bokeh: 0.55, iso: 3200,  shutter: '1/500'  },
  { value: 'f/4.0', numeric: 4.0, bokeh: 0.38, iso: 1600,  shutter: '1/1000' },
  { value: 'f/5.6', numeric: 5.6, bokeh: 0.22, iso: 800,   shutter: '1/2000' },
  { value: 'f/8.0', numeric: 8.0, bokeh: 0.10, iso: 400,   shutter: '1/4000' },
  { value: 'f/11',  numeric: 11,  bokeh: 0.04, iso: 200,   shutter: '1/8000' },
  { value: 'f/16',  numeric: 16,  bokeh: 0.0,  iso: 100,   shutter: '1/8000' },
];

// ── App Phase ─────────────────────────────────────────────
type AppPhase = 'loading' | 'reveal' | 'main' | 'camera' | 'universe' | 'story' | 'ai' | 'portal';

// ── Store Interface ───────────────────────────────────────
interface EmonoStore {
  // Phase / Navigation
  phase: AppPhase;
  setPhase: (p: AppPhase) => void;
  previousPhase: AppPhase | null;
  
  // Camera Mode
  cameraMode: boolean;
  setCameraMode: (v: boolean) => void;
  apertureIndex: number;
  setApertureIndex: (i: number) => void;
  apertureStops: ApertureStop[];
  currentAperture: ApertureStop;
  incrementAperture: () => void;
  decrementAperture: () => void;
  cameraSettings: CameraSettings;
  setCameraSettings: (s: Partial<CameraSettings>) => void;
  
  // Universe
  universeMode: boolean;
  setUniverseMode: (v: boolean) => void;
  activeCategory: Category | null;
  setActiveCategory: (c: Category | null) => void;
  activeClusterPhoto: Photo | null;
  setActiveClusterPhoto: (p: Photo | null) => void;
  
  // Story
  activeStoryPhoto: Photo | null;
  setActiveStoryPhoto: (p: Photo | null) => void;
  
  // AI Concierge
  aiOpen: boolean;
  setAIOpen: (v: boolean) => void;
  aiSessionId: string;
  
  // Night Drive (secret mode)
  nightDriveMode: boolean;
  setNightDriveMode: (v: boolean) => void;
  
  // Developer Mode (Konami)
  devMode: boolean;
  setDevMode: (v: boolean) => void;
  
  // Loading progress
  loadProgress: number;
  setLoadProgress: (v: number) => void;
  
  // Cursor state
  cursorVariant: 'default' | 'camera' | 'drag' | 'expand' | 'play';
  setCursorVariant: (v: 'default' | 'camera' | 'drag' | 'expand' | 'play') => void;
  
  // UI
  navVisible: boolean;
  setNavVisible: (v: boolean) => void;
  
  // Secret features unlocked
  secrets: Set<string>;
  unlockSecret: (name: string) => void;
}

export const useEmonoStore = create<EmonoStore>()(
  devtools(
    (set, get) => ({
      // Phase
      phase: 'loading',
      previousPhase: null,
      setPhase: (phase) =>
        set((s) => ({ phase, previousPhase: s.phase })),

      // Camera Mode
      cameraMode: false,
      setCameraMode: (cameraMode) => {
        set({ cameraMode });
        set({ phase: cameraMode ? 'camera' : 'main' });
        set({ cursorVariant: cameraMode ? 'camera' : 'default' });
      },
      apertureIndex: 4, // default f/2.8
      apertureStops: APERTURE_STOPS,
      currentAperture: APERTURE_STOPS[4],
      setApertureIndex: (i) => {
        const clamped = Math.max(0, Math.min(i, APERTURE_STOPS.length - 1));
        set({
          apertureIndex: clamped,
          currentAperture: APERTURE_STOPS[clamped],
        });
      },
      incrementAperture: () => {
        const { apertureIndex } = get();
        const next = Math.min(apertureIndex + 1, APERTURE_STOPS.length - 1);
        set({ apertureIndex: next, currentAperture: APERTURE_STOPS[next] });
      },
      decrementAperture: () => {
        const { apertureIndex } = get();
        const prev = Math.max(apertureIndex - 1, 0);
        set({ apertureIndex: prev, currentAperture: APERTURE_STOPS[prev] });
      },
      cameraSettings: {
        aperture: 'f/2.8',
        shutterSpeed: '1/500',
        iso: 3200,
        focalLength: '85mm',
        focusMode: 'AF-C',
        shootingMode: 'M',
        bokehIntensity: 0.55,
      },
      setCameraSettings: (s) =>
        set((state) => ({ cameraSettings: { ...state.cameraSettings, ...s } })),

      // Universe
      universeMode: false,
      setUniverseMode: (universeMode) => {
        set({ universeMode });
        set({ phase: universeMode ? 'universe' : 'main' });
      },
      activeCategory: null,
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      activeClusterPhoto: null,
      setActiveClusterPhoto: (activeClusterPhoto) => set({ activeClusterPhoto }),

      // Story
      activeStoryPhoto: null,
      setActiveStoryPhoto: (activeStoryPhoto) => {
        set({ activeStoryPhoto });
        set({ phase: activeStoryPhoto ? 'story' : 'main' });
      },

      // AI
      aiOpen: false,
      setAIOpen: (aiOpen) => set({ aiOpen }),
      aiSessionId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),

      // Secret modes
      nightDriveMode: false,
      setNightDriveMode: (nightDriveMode) => set({ nightDriveMode }),
      devMode: false,
      setDevMode: (devMode) => set({ devMode }),

      // Loading
      loadProgress: 0,
      setLoadProgress: (loadProgress) => set({ loadProgress }),

      // Cursor
      cursorVariant: 'default',
      setCursorVariant: (cursorVariant) => set({ cursorVariant }),

      // Nav
      navVisible: false,
      setNavVisible: (navVisible) => set({ navVisible }),

      // Secrets
      secrets: new Set(),
      unlockSecret: (name) =>
        set((s) => ({ secrets: new Set([...s.secrets, name]) })),
    }),
    { name: 'emonoshots-store' }
  )
);

// ── Selectors ─────────────────────────────────────────────
export const selectCameraSettings = (s: EmonoStore) => ({
  ...s.cameraSettings,
  aperture: s.currentAperture.value,
  iso: s.currentAperture.iso,
  shutterSpeed: s.currentAperture.shutter,
  bokehIntensity: s.currentAperture.bokeh,
});
