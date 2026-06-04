// EMONOSHOTS — Global Type Definitions

export type Category =
  | 'AUTOMOTIVE'
  | 'DRIFT'
  | 'MOTORSPORTS'
  | 'ARCHITECTURE'
  | 'STREET'
  | 'MACRO'
  | 'PORTRAIT'
  | 'CINEMATIC';

export type ShootType = Category | 'COMMERCIAL' | 'EVENT';

export type BookingStatus =
  | 'INQUIRY'
  | 'PROPOSAL_SENT'
  | 'CONFIRMED'
  | 'DEPOSIT_PAID'
  | 'IN_PROGRESS'
  | 'EDITING'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

// ── Photo ─────────────────────────────────────────────────
export interface Photo {
  id: string;
  title: string;
  slug: string;
  category: Category;
  description?: string;
  story?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  imageUrl: string;
  thumbnailUrl?: string;
  rawUrl?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  takenAt?: string;
  featured: boolean;
  published: boolean;
  views: number;
  tags?: string[];
  createdAt: string;
}

// ── Gallery ───────────────────────────────────────────────
export interface GalleryItem {
  id: string;
  photo: Photo;
  approved: boolean | null;
  editRequest?: string;
  sortOrder: number;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'DELIVERED';
  items: GalleryItem[];
  downloadCount: number;
  createdAt: string;
}

// ── Booking ───────────────────────────────────────────────
export interface Booking {
  id: string;
  type: ShootType;
  title: string;
  description?: string;
  status: BookingStatus;
  proposedDate?: string;
  confirmedDate?: string;
  duration?: number;
  locationName?: string;
  estimatedPrice?: number;
  finalPrice?: number;
  currency: string;
  moodboard?: AIMoodboard;
  notes?: string;
  createdAt: string;
}

// ── AI Concierge ──────────────────────────────────────────
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIMoodboard {
  type: ShootType;
  mood: string;
  locations: string[];
  timeOfDay: 'golden_hour' | 'blue_hour' | 'night' | 'daytime';
  estimatedBudget: { min: number; max: number; currency: string };
  duration: number; // hours
  deliverables: string[];
  equipment: string[];
  references: string[];
  notes: string;
}

// ── Universe / 3D ─────────────────────────────────────────
export interface Cluster {
  id: string;
  category: Category;
  label: string;
  color: string;
  position: [number, number, number];
  radius: number;
  photos: Photo[];
}

export interface ParticleConfig {
  count: number;
  spread: number;
  speed: number;
  opacity: number;
}

// ── Camera Mode ───────────────────────────────────────────
export interface CameraSettings {
  aperture: string;
  shutterSpeed: string;
  iso: number;
  focalLength: string;
  focusMode: 'AF-S' | 'AF-C' | 'MF';
  shootingMode: 'M' | 'A' | 'S' | 'P';
  bokehIntensity: number; // 0-1
}

export interface ApertureStop {
  value: string;
  numeric: number;
  bokeh: number;
  iso: number;
  shutter: string;
}

// ── Sanity CMS Types ──────────────────────────────────────
export interface SanityPhoto {
  _id: string;
  _type: 'photo';
  title: string;
  slug: { current: string };
  category: Category;
  description?: any[]; // PortableText
  story?: any[]; // PortableText
  image: { asset: { _ref: string } };
  rawImage?: { asset: { _ref: string } };
  exif?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
    shootingMode?: string;
  };
  location?: {
    name?: string;
    lat?: number;
    lng?: number;
  };
  takenAt?: string;
  featured?: boolean;
  published?: boolean;
  tags?: string[];
}

export interface SanityCollection {
  _id: string;
  _type: 'collection';
  title: string;
  slug: { current: string };
  description?: any[];
  coverImage?: { asset: { _ref: string } };
  photos: SanityPhoto[];
  featured: boolean;
}
