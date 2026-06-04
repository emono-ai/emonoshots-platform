// src/app/error.tsx
'use client';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-center px-6">
      <p className="section-label mb-4">Something went wrong</p>
      <h1 className="font-display text-[56px] text-white/20 mb-6 tracking-wider">System Error</h1>
      <p className="font-body text-[12px] font-light text-white/35 mb-8 max-w-xs">{error.message}</p>
      <button onClick={reset} className="btn-ghost cursor-none">Try Again</button>
    </div>
  );
}
