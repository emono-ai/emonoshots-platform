// src/lib/hooks/usePhotos.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Photo, Category } from '@/types';

interface UsePhotosOptions {
  category?: Category;
  featured?: boolean;
  limit?: number;
  page?: number;
}

export function usePhotos({ category, featured, limit = 20, page = 1 }: UsePhotosOptions = {}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ total: 0, pages: 1, page: 1 });

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (featured)  params.set('featured', 'true');
    params.set('limit', String(limit));
    params.set('page', String(page));

    const res = await fetch(`/api/photos?${params}`).catch(() => null);
    if (!res?.ok) { setError('Failed to fetch'); setLoading(false); return; }
    const data = await res.json();
    setPhotos(data.photos ?? []);
    setMeta(data.meta ?? { total: 0, pages: 1, page: 1 });
    setLoading(false);
  }, [category, featured, limit, page]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  return { photos, loading, error, meta, refetch: fetchPhotos };
}
