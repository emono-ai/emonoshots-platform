'use client';
// src/app/admin/AdminDashboard.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import type { Photo, Booking, Gallery } from '@/types';

type AdminTab = 'overview' | 'photos' | 'bookings' | 'clients' | 'analytics';

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState({
    totalPhotos: 0, totalBookings: 0, totalClients: 0,
    pendingProofs: 0, revenue: 0, thisMonthBookings: 0,
  });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats).catch(() => {});
    fetch('/api/admin/photos').then((r) => r.json()).then((d) => setPhotos(d.photos || [])).catch(() => {});
    fetch('/api/admin/bookings').then((r) => r.json()).then((d) => setBookings(d.bookings || [])).catch(() => {});
  }, []);

  const TABS: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'photos', label: 'Photos' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'clients', label: 'Clients' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-white">
      {/* Admin nav */}
      <nav className="border-b border-white/6 px-10 py-5 flex items-center justify-between">
        <div className="font-display text-[16px] tracking-[0.15em]">
          EMONO<span className="text-brand-amber">SHOTS</span>
          <span className="font-body text-[9px] tracking-[0.4em] uppercase text-brand-amber/50 ml-4">
            Admin
          </span>
        </div>
        <a href="/" className="nav-link">← Site</a>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 border-r border-white/6 min-h-[calc(100vh-57px)] pt-8 px-4">
          <nav className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-3 py-2 font-body text-[10px] tracking-[0.3em] uppercase transition-all
                  ${tab === t.id ? 'text-brand-amber bg-brand-amber/5' : 'text-white/30 hover:text-white/60'}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-10">
          {tab === 'overview' && <OverviewTab stats={stats} />}
          {tab === 'photos' && <PhotosTab photos={photos} onRefresh={() => {}} />}
          {tab === 'bookings' && <BookingsTab bookings={bookings} />}
          {tab === 'clients' && <ClientsTab />}
          {tab === 'analytics' && <AnalyticsTab />}
        </main>
      </div>
    </div>
  );
}

// ── Overview ───────────────────────────────────────────────
function OverviewTab({ stats }: { stats: Record<string, number> }) {
  const cards = [
    { label: 'Total Photos', value: stats.totalPhotos, color: 'text-white' },
    { label: 'Active Bookings', value: stats.totalBookings, color: 'text-brand-amber' },
    { label: 'Total Clients', value: stats.totalClients, color: 'text-white' },
    { label: 'Pending Proofs', value: stats.pendingProofs, color: 'text-yellow-400' },
    { label: 'This Month', value: stats.thisMonthBookings, color: 'text-green-400' },
    { label: 'Revenue (MAD)', value: stats.revenue?.toLocaleString(), color: 'text-brand-amber' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <p className="section-label mb-1">Studio Overview</p>
        <h1 className="font-display text-[40px] tracking-wider">Dashboard</h1>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-brand-graphite p-5">
            <p className="exif-label mb-3">{c.label}</p>
            <p className={`font-display text-[36px] tracking-wider ${c.color}`}>{c.value || '0'}</p>
          </div>
        ))}
      </div>

      {/* Quick links to Sanity CMS */}
      <div className="border border-white/8 p-6">
        <p className="section-label mb-4">CMS Quick Links</p>
        <div className="flex gap-3">
          <a
            href={`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            Open Sanity Studio →
          </a>
          <a href="/admin/upload" className="btn-primary text-xs">Upload Photos</a>
        </div>
      </div>
    </motion.div>
  );
}

// ── Photos ─────────────────────────────────────────────────
function PhotosTab({ photos, onRefresh }: { photos: Photo[]; onRefresh: () => void }) {
  const togglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/admin/photos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    });
    toast.success(published ? 'Photo unpublished' : 'Photo published ✓');
    onRefresh();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">Library</p>
          <h2 className="font-display text-[32px] tracking-wider">
            {photos.length} Photos
          </h2>
        </div>
        <a href="/admin/upload" className="btn-primary">Upload New</a>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-20 text-white/20 font-body text-sm">
          No photos yet. Upload from Sanity Studio or use the upload tool.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative">
              <div className="aspect-[4/3] bg-brand-graphite relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => togglePublish(photo.id, photo.published)}
                    className={`w-full font-body text-[8px] tracking-[0.3em] uppercase py-1.5 transition-colors
                      ${photo.published ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}
                  >
                    {photo.published ? 'Published' : 'Draft'}
                  </button>
                </div>
              </div>
              <p className="font-body text-[10px] text-white/50 mt-2 truncate">{photo.title}</p>
              <p className="font-body text-[9px] text-white/25">{photo.category}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Bookings ───────────────────────────────────────────────
function BookingsTab({ bookings }: { bookings: Booking[] }) {
  const STATUS_COLORS: Record<string, string> = {
    INQUIRY: 'text-white/40', CONFIRMED: 'text-green-400',
    IN_PROGRESS: 'text-blue-400', DELIVERED: 'text-brand-amber',
    CANCELLED: 'text-red-400', COMPLETED: 'text-white/30',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <p className="section-label mb-1">Pipeline</p>
        <h2 className="font-display text-[32px] tracking-wider">Bookings</h2>
      </div>
      <div className="space-y-3">
        {bookings.length === 0 && (
          <p className="text-white/20 font-body text-sm text-center py-12">No bookings yet.</p>
        )}
        {bookings.map((b) => (
          <div key={b.id} className="border border-white/8 p-5 flex items-center justify-between hover:border-white/15 transition-colors">
            <div>
              <p className="font-display text-[18px] tracking-wider">{b.title}</p>
              <p className="font-body text-[11px] text-white/30 mt-1">
                {b.type} · {b.locationName || 'Location TBC'}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-body text-[9px] tracking-[0.3em] uppercase ${STATUS_COLORS[b.status] || 'text-white/40'}`}>
                {b.status.replace(/_/g, ' ')}
              </p>
              {b.finalPrice && (
                <p className="font-display text-[18px] text-white mt-1">
                  {b.finalPrice.toLocaleString()} {b.currency}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Clients ────────────────────────────────────────────────
function ClientsTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <p className="section-label mb-1">CRM</p>
        <h2 className="font-display text-[32px] tracking-wider">Clients</h2>
      </div>
      <p className="text-white/20 font-body text-sm text-center py-12">
        Client management coming soon. For now, manage via Prisma Studio.
      </p>
    </motion.div>
  );
}

// ── Analytics ──────────────────────────────────────────────
function AnalyticsTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <p className="section-label mb-1">Insights</p>
        <h2 className="font-display text-[32px] tracking-wider">Analytics</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['Top photo views', 'Concierge conversions', 'Booking pipeline'].map((label) => (
          <div key={label} className="bg-brand-graphite p-6">
            <p className="exif-label mb-4">{label}</p>
            <div className="h-24 flex items-center justify-center">
              <span className="text-white/15 font-body text-xs">Coming soon</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
