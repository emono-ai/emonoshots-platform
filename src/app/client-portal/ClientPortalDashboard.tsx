'use client';
// src/app/client-portal/ClientPortalDashboard.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { Gallery, GalleryItem, Booking } from '@/types';
import toast from 'react-hot-toast';

type Tab = 'galleries' | 'bookings' | 'invoices';

export function ClientPortalDashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>('galleries');
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [galRes, bookRes] = await Promise.all([
        fetch('/api/client/galleries'),
        fetch('/api/client/bookings'),
      ]);
      const [galData, bookData] = await Promise.all([galRes.json(), bookRes.json()]);
      setGalleries(galData.galleries || []);
      setBookings(bookData.bookings || []);
    } catch {
      toast.error('Failed to load your data.');
    } finally {
      setLoading(false);
    }
  };

  const approvePhoto = async (galleryId: string, itemId: string, approved: boolean) => {
    await fetch(`/api/client/galleries/${galleryId}/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved }),
    });
    toast.success(approved ? 'Photo approved ✓' : 'Edit requested');
    fetchData();
  };

  const downloadGallery = async (galleryId: string) => {
    toast.success('Preparing download...');
    window.open(`/api/client/galleries/${galleryId}/download`, '_blank');
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'galleries', label: 'Proofs & Galleries' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'invoices', label: 'Invoices' },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-white">
      {/* Portal nav */}
      <nav className="border-b border-white/6 px-10 py-5 flex items-center justify-between">
        <div className="font-display text-[16px] tracking-[0.15em]">
          EMONO<span className="text-brand-amber">SHOTS</span>
          <span className="font-body text-[9px] tracking-[0.4em] uppercase text-white/30 ml-4">
            Client Portal
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-body text-[11px] text-white/40">{session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="font-body text-[9px] tracking-[0.3em] uppercase text-white/30 hover:text-brand-amber transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-10 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <p className="section-label mb-2">Welcome back</p>
          <h1 className="font-display text-[48px] tracking-wider text-white leading-none">
            {session.user?.name?.split(' ')[0] || 'Client'}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-px mb-10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-2.5 font-body text-[10px] tracking-[0.3em] uppercase transition-all duration-200
                ${tab === t.id
                  ? 'text-brand-amber bg-brand-amber/5 border border-brand-amber/30'
                  : 'text-white/35 border border-white/10 hover:text-white/60'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="font-body text-[10px] tracking-[0.4em] uppercase text-white/25 animate-pulse">
              Loading...
            </div>
          </div>
        ) : (
          <>
            {/* Galleries tab */}
            {tab === 'galleries' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {galleries.length === 0 ? (
                  <EmptyState
                    title="No galleries yet"
                    sub="Your proofs will appear here after your shoot."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {galleries.map((gallery) => (
                      <GalleryCard
                        key={gallery.id}
                        gallery={gallery}
                        onApprove={approvePhoto}
                        onDownload={downloadGallery}
                        onOpen={() => setActiveGallery(gallery)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Bookings tab */}
            {tab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {bookings.length === 0 ? (
                  <EmptyState
                    title="No bookings yet"
                    sub="Use the AI Concierge to plan your first shoot."
                  />
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <BookingRow key={b.id} booking={b} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Invoices tab */}
            {tab === 'invoices' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <EmptyState
                  title="No invoices yet"
                  sub="Invoices will appear here once your shoot is confirmed."
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Gallery Card ───────────────────────────────────────────
function GalleryCard({
  gallery,
  onApprove,
  onDownload,
  onOpen,
}: {
  gallery: Gallery;
  onApprove: (gid: string, iid: string, approved: boolean) => void;
  onDownload: (gid: string) => void;
  onOpen: () => void;
}) {
  const statusColor: Record<string, string> = {
    DRAFT:     'text-white/30',
    REVIEW:    'text-brand-amber',
    APPROVED:  'text-green-400',
    DELIVERED: 'text-blue-400',
  };

  const approved = gallery.items?.filter((i) => i.approved === true).length || 0;
  const pending  = gallery.items?.filter((i) => i.approved === null).length || 0;
  const total    = gallery.items?.length || 0;

  return (
    <div className="border border-white/8 p-6 hover:border-white/15 transition-colors">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-display text-[22px] tracking-wider text-white">{gallery.title}</h3>
          {gallery.description && (
            <p className="font-body text-[12px] font-light text-white/35 mt-1">{gallery.description}</p>
          )}
        </div>
        <span className={`font-body text-[9px] tracking-[0.35em] uppercase ${statusColor[gallery.status]}`}>
          {gallery.status}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between mb-2">
          <span className="font-body text-[10px] text-white/30">
            {approved}/{total} approved · {pending} pending
          </span>
        </div>
        <div className="w-full h-px bg-white/8">
          <div
            className="h-full bg-brand-amber transition-all duration-500"
            style={{ width: total > 0 ? `${(approved / total) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onOpen} className="btn-ghost text-xs">
          Review Proofs
        </button>
        {gallery.status === 'APPROVED' || gallery.status === 'DELIVERED' ? (
          <button onClick={() => onDownload(gallery.id)} className="btn-primary text-xs">
            Download Gallery
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ── Booking Row ────────────────────────────────────────────
function BookingRow({ booking }: { booking: Booking }) {
  const statusColors: Record<string, string> = {
    INQUIRY:       'text-white/40',
    PROPOSAL_SENT: 'text-brand-amber',
    CONFIRMED:     'text-green-400',
    DEPOSIT_PAID:  'text-green-400',
    IN_PROGRESS:   'text-blue-400',
    EDITING:       'text-purple-400',
    DELIVERED:     'text-green-400',
    COMPLETED:     'text-white/40',
    CANCELLED:     'text-red-400',
  };

  return (
    <div className="border border-white/8 p-5 flex items-center justify-between hover:border-white/15 transition-colors">
      <div>
        <p className="font-display text-[18px] tracking-wider text-white">{booking.title}</p>
        <p className="font-body text-[11px] text-white/30 mt-1">
          {booking.type} · {booking.locationName || 'TBC'} ·{' '}
          {booking.confirmedDate
            ? new Date(booking.confirmedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Date TBC'}
        </p>
      </div>
      <div className="text-right">
        <p className={`font-body text-[9px] tracking-[0.35em] uppercase ${statusColors[booking.status]}`}>
          {booking.status.replace(/_/g, ' ')}
        </p>
        {booking.finalPrice && (
          <p className="font-display text-[20px] text-white mt-1">
            {booking.finalPrice.toLocaleString()} {booking.currency}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────
function EmptyState({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center">
      <p className="font-display text-[24px] tracking-wider text-white/20 mb-3">{title}</p>
      <p className="font-body text-[12px] font-light text-white/20">{sub}</p>
    </div>
  );
}
