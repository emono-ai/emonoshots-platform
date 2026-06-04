// sanity/schemas/collection.ts
import { defineField, defineType } from 'sanity';

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({ name: 'title',       type: 'string', title: 'Title',        validation: (R) => R.required() }),
    defineField({ name: 'slug',        type: 'slug',   title: 'Slug',         options: { source: 'title' } }),
    defineField({ name: 'description', type: 'array',  title: 'Description',  of: [{ type: 'block' }] }),
    defineField({ name: 'coverImage',  type: 'image',  title: 'Cover Image',  options: { hotspot: true } }),
    defineField({ name: 'featured',    type: 'boolean',title: 'Featured',     initialValue: false }),
    defineField({ name: 'photos',      type: 'array',  title: 'Photos',       of: [{ type: 'reference', to: [{ type: 'photo' }] }] }),
  ],
  preview: { select: { title: 'title', media: 'coverImage' } },
});
