// src/app/api/photos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { groq } from 'next-sanity';

const photosQuery = groq`
  *[_type == "photo" && published == true
    && ($category == "" || category == $category)
    && ($featured == false || featured == true)
  ] | order(takenAt desc) [$start...$end] {
    _id, title,
    "slug": slug.current,
    category, description, featured, takenAt, views,
    "imageUrl": image.asset->url,
    "thumbnailUrl": image.asset->url + "?w=800&h=600&fit=crop&auto=format",
    exif, "location": location.name, tags
  }
`;

const countQuery = groq`count(*[_type == "photo" && published == true && ($category == "" || category == $category)])`;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category') ?? '';
    const featured  = searchParams.get('featured') === 'true';
    const page      = parseInt(searchParams.get('page') ?? '1', 10);
    const limit     = parseInt(searchParams.get('limit') ?? '20', 10);
    const start     = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      sanityClient.fetch(photosQuery, { category, featured, start, end: start + limit }),
      sanityClient.fetch(countQuery, { category }),
    ]);

    return NextResponse.json({
      photos,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('[Photos API]', err);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}
