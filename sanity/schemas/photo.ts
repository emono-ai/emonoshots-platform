// sanity/schemas/photo.ts
import { defineField, defineType } from 'sanity';

export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({ name: 'title',    type: 'string', title: 'Title', validation: (R) => R.required() }),
    defineField({ name: 'slug',     type: 'slug',   title: 'Slug', options: { source: 'title' }, validation: (R) => R.required() }),
    defineField({
      name: 'category', type: 'string', title: 'Category',
      options: { list: ['AUTOMOTIVE','DRIFT','MOTORSPORTS','ARCHITECTURE','STREET','MACRO','PORTRAIT','CINEMATIC'] },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'image',    type: 'image',  title: 'Photo', options: { hotspot: true }, validation: (R) => R.required() }),
    defineField({ name: 'rawImage', type: 'image',  title: 'RAW version (for before/after)' }),
    defineField({ name: 'description', type: 'array', title: 'Description', of: [{ type: 'block' }] }),
    defineField({ name: 'story',       type: 'array', title: 'Story',       of: [{ type: 'block' }] }),
    defineField({
      name: 'exif', type: 'object', title: 'Camera Settings (EXIF)',
      fields: [
        defineField({ name: 'camera',       type: 'string', title: 'Camera' }),
        defineField({ name: 'lens',         type: 'string', title: 'Lens' }),
        defineField({ name: 'aperture',     type: 'string', title: 'Aperture' }),
        defineField({ name: 'shutterSpeed', type: 'string', title: 'Shutter Speed' }),
        defineField({ name: 'iso',          type: 'number', title: 'ISO' }),
        defineField({ name: 'focalLength',  type: 'string', title: 'Focal Length' }),
        defineField({ name: 'shootingMode', type: 'string', title: 'Shooting Mode' }),
      ],
    }),
    defineField({
      name: 'location', type: 'object', title: 'Location',
      fields: [
        defineField({ name: 'name', type: 'string', title: 'Location Name' }),
        defineField({ name: 'lat',  type: 'number', title: 'Latitude' }),
        defineField({ name: 'lng',  type: 'number', title: 'Longitude' }),
      ],
    }),
    defineField({ name: 'takenAt',  type: 'datetime', title: 'Date Taken' }),
    defineField({ name: 'featured', type: 'boolean',  title: 'Featured',   initialValue: false }),
    defineField({ name: 'published',type: 'boolean',  title: 'Published',  initialValue: false }),
    defineField({ name: 'tags',     type: 'array',    title: 'Tags', of: [{ type: 'string' }], options: { layout: 'tags' } }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'image' },
  },
  orderings: [
    { title: 'Date Taken (Newest)', name: 'takenAtDesc', by: [{ field: 'takenAt', direction: 'desc' }] },
    { title: 'Category',           name: 'categoryAsc',  by: [{ field: 'category', direction: 'asc' }] },
  ],
});
