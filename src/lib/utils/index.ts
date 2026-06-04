// src/lib/utils/index.ts

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatMAD(amount: number): string {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    AUTOMOTIVE: '#FF8A00', DRIFT: '#FF2244', MOTORSPORTS: '#FF4400',
    ARCHITECTURE: '#4488FF', STREET: '#FF6644', MACRO: '#44DD88',
    PORTRAIT: '#AA44FF', CINEMATIC: '#FFDD44',
  };
  return map[category] ?? '#FF8A00';
}

export function truncate(str: string, length: number): string {
  return str.length <= length ? str : str.slice(0, length) + '…';
}
