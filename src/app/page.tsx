// src/app/page.tsx — Home / Cinematic Entry
import { Suspense } from 'react';
import { CinematicEntry } from '@/components/layout/CinematicEntry';
import { HeroExperience } from '@/components/three/HeroExperience';
import { HeroUI } from '@/components/ui/HeroUI';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { SecretFeatures } from '@/components/ui/SecretFeatures';

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-brand-black">
      {/* Three.js fullscreen particle galaxy */}
      <Suspense fallback={null}>
        <HeroExperience />
      </Suspense>

      {/* Cinematic loading + reveal sequence */}
      <CinematicEntry />

      {/* Loading screen (overlays until ready) */}
      <LoadingScreen />

      {/* Main UI — nav, hero text, mode bar */}
      <HeroUI />

      {/* Secret features: Konami, dev mode, night drive, etc. */}
      <SecretFeatures />
    </main>
  );
}
