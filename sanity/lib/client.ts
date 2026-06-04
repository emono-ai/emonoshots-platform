// sanity/lib/client.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn:    process.env.NODE_ENV === 'production',
  token:     process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// ── GROQ Queries ──────────────────────────────────────────
export const queries = {
  allPhotos: `*[_type == "photo" && published == true] | order(takenAt desc) {
    _id, title, "slug": slug.current, category,
    "imageUrl": image.asset->url,
    "thumbnailUrl": image.asset->url + "?w=600&q=75",
    description, featured, takenAt, tags,
    exif { camera, lens, aperture, shutterSpeed, iso, focalLength },
    location { name, lat, lng }
  }`,

  photoBySlug: `*[_type == "photo" && slug.current == $slug && published == true][0] {
    _id, title, "slug": slug.current, category,
    "imageUrl": image.asset->url,
    "rawUrl": rawImage.asset->url,
    story, description, featured, takenAt, tags,
    exif { camera, lens, aperture, shutterSpeed, iso, focalLength, shootingMode },
    location { name, lat, lng }
  }`,

  featuredPhotos: `*[_type == "photo" && published == true && featured == true][0...12] | order(takenAt desc) {
    _id, title, "slug": slug.current, category,
    "imageUrl": image.asset->url,
    "thumbnailUrl": image.asset->url + "?w=800&q=80"
  }`,

  photosByCategory: `*[_type == "photo" && published == true && category == $category] | order(takenAt desc) {
    _id, title, "slug": slug.current, category,
    "imageUrl": image.asset->url,
    "thumbnailUrl": image.asset->url + "?w=600&q=75",
    featured, takenAt
  }`,

  collections: `*[_type == "collection" && featured == true] | order(_createdAt desc) {
    _id, title, "slug": slug.current,
    "coverUrl": coverImage.asset->url,
    description, "photoCount": count(photos)
  }`,
};
