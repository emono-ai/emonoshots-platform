'use client';
// src/components/ai/AIConcierge.tsx
// AI Photography Producer powered by Anthropic Claude

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmonoStore } from '@/store/emonoStore';
import type { ConversationMessage, AIMoodboard } from '@/types';

const INTRO: ConversationMessage = {
  role: 'assistant',
  content: `Hello. I'm the EMONOSHOTS AI Concierge — your personal photography producer in Casablanca.\n\nTell me about your vision. A car, a location, a mood, a project. I'll design the shoot around you.`,
  timestamp: new Date().toISOString(),
};

export function AIConcierge() {
  const { aiOpen, setAIOpen, aiSessionId } = useEmonoStore();
  const [messages, setMessages] = useState<ConversationMessage[]>([INTRO]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [moodboard, setMoodboard] = useState<AIMoodboard | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aiOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [aiOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: ConversationMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sessionId: aiSessionId,
        }),
      });

      const data = await res.json();
      const aiMsg: ConversationMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (data.moodboard) setMoodboard(data.moodboard);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Connection interrupted. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, aiSessionId]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {aiOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/92 backdrop-blur-[10px]"
            onClick={() => setAIOpen(false)}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 flex flex-col w-full max-w-[560px] h-[min(640px,85vh)] mx-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display text-[28px] tracking-[0.08em] text-brand-amber">
                  AI Concierge
                </h2>
                <p className="font-body text-[9px] tracking-[0.4em] uppercase text-white/35 mt-1">
                  Photography Producer · EMONOSHOTS
                </p>
              </div>
              <button
                onClick={() => setAIOpen(false)}
                className="font-body text-[9px] tracking-[0.3em] uppercase text-white/35 hover:text-brand-amber transition-colors pt-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4 pr-1 scrollbar-thin scrollbar-thumb-brand-amber/20">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1 max-w-[82%] ${
                    msg.role === 'user' ? 'self-end items-end' : 'self-start'
                  }`}
                >
                  <span className="font-body text-[8px] tracking-[0.35em] uppercase text-white/25">
                    {msg.role === 'user' ? 'YOU' : 'EMONOSHOTS AI'}
                  </span>
                  <div
                    className={`font-body text-[13px] font-light leading-[1.75] ${
                      msg.role === 'user'
                        ? 'text-brand-amber text-right'
                        : 'text-white/75 border-l-2 border-brand-amber/60 pl-3'
                    }`}
                  >
                    {msg.content.split('\n').map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="self-start border-l-2 border-brand-amber/60 pl-3 py-1">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-brand-amber"
                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Moodboard preview */}
            <AnimatePresence>
              {moodboard && (
                <motion.div
                  className="border border-brand-amber/20 bg-brand-amber/5 p-4 mb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="section-label mb-3">Production Brief Generated</p>
                  <div className="grid grid-cols-2 gap-3">
                    <MoodboardStat label="Duration" value={`${moodboard.duration}h`} />
                    <MoodboardStat
                      label="Budget"
                      value={`${moodboard.estimatedBudget.min}–${moodboard.estimatedBudget.max} ${moodboard.estimatedBudget.currency}`}
                    />
                    <MoodboardStat label="Time" value={moodboard.timeOfDay.replace('_', ' ')} />
                    <MoodboardStat label="Locations" value={moodboard.locations.length + ' scouted'} />
                  </div>
                  <button
                    onClick={() => {
                      setAIOpen(false);
                      // Navigate to booking form
                      window.location.href = `/booking?session=${aiSessionId}`;
                    }}
                    className="btn-primary mt-4 w-full justify-center"
                  >
                    Request Full Proposal →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="border-t border-white/10 pt-4 flex gap-3 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Describe your vision, vehicle, or project..."
                className="flex-1 bg-transparent border-none outline-none font-body text-[13px] font-light text-white placeholder:text-white/25 caret-brand-amber"
              />
              <motion.button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-brand-amber flex items-center justify-center flex-shrink-0 disabled:opacity-40 cursor-none"
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Moodboard stat ─────────────────────────────────────────
function MoodboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="exif-label">{label}</p>
      <p className="font-body text-[12px] text-white/70 mt-0.5">{value}</p>
    </div>
  );
}
