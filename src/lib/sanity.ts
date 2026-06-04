// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token:     process.env.SANITY_API_TOKEN,
  useCdn:    process.env.NODE_ENV === 'production',
  perspective: 'published',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ── Convenience image helpers ─────────────────────────────
export function getImageUrl(source: SanityImageSource, width = 1920, height = 1080): string {
  return urlFor(source).width(width).height(height).fit('crop').auto('format').url();
}

export function getThumbnailUrl(source: SanityImageSource): string {
  return urlFor(source).width(800).height(600).fit('crop').auto('format').quality(80).url();
}

export function getBlurUrl(source: SanityImageSource): string {
  return urlFor(source).width(40).height(30).fit('crop').auto('format').quality(20).url();
}
