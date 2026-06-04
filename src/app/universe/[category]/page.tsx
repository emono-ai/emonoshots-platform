// src/app/universe/[category]/page.tsx
import { Suspense } from 'next';
import { notFound } from 'next/navigation';
import type { Category } from '@/types';
import { CategoryGallery } from '@/components/universe/CategoryGallery';

const VALID_CATEGORIES: Category[] = ['AUTOMOTIVE','DRIFT','MOTORSPORTS','ARCHITECTURE','STREET','MACRO','PORTRAIT','CINEMATIC'];

export async function generateMetadata({ params }: { params: { category: string } }) {
  const cat = params.category.toUpperCase() as Category;
  return {
    title: `${cat.charAt(0) + cat.toLowerCase().slice(1)} Photography | EMONOSHOTS`,
    description: `EMONOSHOTS ${cat.toLowerCase()} photography from Casablanca, Morocco.`,
  };
}

export default function UniverseCategoryPage({ params }: { params: { category: string } }) {
  const cat = params.category.toUpperCase() as Category;
  if (!VALID_CATEGORIES.includes(cat)) notFound();
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryGallery category={cat} />
    </Suspense>
  );
}

function CategorySkeleton() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="font-body text-[9px] tracking-[0.5em] uppercase text-white/30 animate-pulse">Loading...</div>
    </div>
  );
}
