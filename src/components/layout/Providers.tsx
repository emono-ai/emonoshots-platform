'use client';
// src/components/layout/Providers.tsx
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid rgba(255,138,0,0.3)',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '12px',
            letterSpacing: '0.05em',
          },
        }}
      />
    </SessionProvider>
  );
}
