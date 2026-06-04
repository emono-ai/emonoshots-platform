// src/app/auth/signin/page.tsx
'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/client-portal';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn('credentials', { email, password, callbackUrl });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-6">
      <motion.div className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <a href="/" className="block font-display text-[22px] tracking-[0.15em] text-white text-center mb-12">
          EMONO<span className="text-brand-amber">SHOTS</span>
        </a>
        <p className="section-label text-center mb-8">Client Portal Access</p>

        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="w-full border border-white/15 bg-brand-deep text-white/70 font-body text-[10px] tracking-[0.35em] uppercase py-3.5 mb-6 hover:border-white/30 hover:text-white transition-all cursor-none"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-white/25">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            placeholder="Email address"
            className="w-full bg-brand-deep border border-white/10 text-white font-body text-[13px] px-4 py-3.5 outline-none focus:border-brand-amber/50 placeholder:text-white/25 transition-colors" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            placeholder="Password"
            className="w-full bg-brand-deep border border-white/10 text-white font-body text-[13px] px-4 py-3.5 outline-none focus:border-brand-amber/50 placeholder:text-white/25 transition-colors" />
          <button type="submit" disabled={loading} className="btn-primary justify-center mt-2 disabled:opacity-50 cursor-none">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="font-body text-[10px] text-center text-white/25 mt-8">
          New client?{' '}
          <a href="/?ai=open" className="text-brand-amber/70 hover:text-brand-amber transition-colors">
            Start with AI Concierge →
          </a>
        </p>
      </motion.div>
    </div>
  );
}
