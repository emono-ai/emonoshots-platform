// src/app/story/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { sanityClient } from '@/lib/sanity';
import { groq } from 'next-sanity';
import { StoryPageClient } from '@/components/story/StoryPageClient';

async function getPhoto(slug: string) {
  return sanityClient.fetch(
    groq`*[_type == "photo" && slug.current == $slug && published == true][0]{
      _id, title, "slug": slug.current, category,
      description, story, takenAt, featured,
      "imageUrl": image.asset->url,
      "rawUrl": rawImage.asset->url,
      exif, location, tags
    }`,
    { slug }
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const photo = await getPhoto(params.slug);
  if (!photo) return { title: 'Photo Not Found' };
  return {
    title: `${photo.title} | EMONOSHOTS`,
    description: `Cinematic ${photo.category.toLowerCase()} photography from Casablanca.`,
    openGraph: { images: [photo.imageUrl] },
  };
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const photo = await getPhoto(params.slug).catch(() => null);
  // Demo fallback
  const data = photo ?? {
    _id: 'demo', title: 'Smoke & Precision', slug: params.slug,
    category: 'AUTOMOTIVE', description: null, story: null,
    takenAt: null, featured: true, imageUrl: '', rawUrl: '',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.8', shutterSpeed: '1/500', iso: 3200 },
    location: { name: 'Port de Casablanca' }, tags: ['automotive','night'],
  };
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <StoryPageClient photo={data} />
    </Suspense>
  );
}
