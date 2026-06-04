# EMONOSHOTS

**"Frames That Hit Different."**

Cinematic automotive, drift, architecture, street, macro, and portrait photography studio from Casablanca, Morocco.

## Stack
- **Next.js 15** App Router + TypeScript
- **Three.js / R3F** — particle galaxy, post-processing
- **Framer Motion + GSAP** — cinematic animations
- **Zustand** — global state
- **Sanity CMS** — photo management
- **Prisma + PostgreSQL** — bookings, clients, galleries
- **Anthropic Claude** — AI Photography Concierge
- **NextAuth** — client portal authentication
- **Stripe** — invoice payments

## Setup

```bash
cp .env.example .env.local
# Fill in all environment variables

npm install
npm run db:push      # Push Prisma schema
npm run db:seed      # Seed demo data
npm run dev          # Start development server
```

## Secret Features
- **Konami Code** (↑↑↓↓←→←→BA) → Night Drive Mode
- **Ctrl+Shift+D** → Developer Mode overlay
- Seasonal ambient particles (winter)

## Architecture

```
src/
├── app/                   # Next.js App Router pages
│   ├── api/               # REST API routes
│   ├── universe/[cat]/    # Category gallery pages
│   ├── story/[slug]/      # Cinematic story pages
│   ├── client-portal/     # Authenticated client area
│   └── admin/             # Admin dashboard
├── components/
│   ├── three/             # Three.js / R3F components
│   ├── camera/            # DSLR viewfinder mode
│   ├── ai/                # AI Concierge chat
│   ├── universe/          # Constellation browser
│   ├── story/             # Documentary story viewer
│   ├── client/            # Client portal UI
│   ├── admin/             # Admin UI
│   ├── layout/            # Providers, Nav, CinematicEntry
│   └── ui/                # Cursor, LoadingScreen, SecretFeatures
├── lib/
│   ├── prisma.ts          # DB client
│   ├── sanity.ts          # CMS client
│   ├── auth.ts            # NextAuth config
│   ├── hooks/             # usePhotos, useGSAP
│   └── utils/             # cn, formatMAD, etc.
├── store/
│   └── emonoStore.ts      # Zustand global state
├── types/
│   └── index.ts           # All TypeScript types
└── styles/
    └── globals.css        # Design system CSS

prisma/
├── schema.prisma          # Full DB schema
└── seed.ts                # Demo data seeder

sanity/
├── schemas/               # Photo + Collection schemas
└── lib/

sanity.config.ts           # Sanity Studio config
```

## Replacing Placeholder Images
All placeholder images in the CategoryGallery component are flagged with comments.
To replace: upload your EMONOSHOTS photography to Sanity CMS and the API will serve them automatically.

## Deployment
Recommended: **Vercel** for Next.js + **Supabase** for PostgreSQL + **Sanity** cloud.

```bash
npm run build
vercel deploy
```
