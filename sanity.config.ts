// sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool }    from '@sanity/vision';
import { photo, collection } from './sanity/schemas';

export default defineConfig({
  name:      'emonoshots',
  title:     'EMONOSHOTS CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('EMONOSHOTS')
          .items([
            S.listItem().title('📷 Photos').schemaType('photo').child(
              S.documentTypeList('photo').title('All Photos')
            ),
            S.listItem().title('🗂 Collections').schemaType('collection').child(
              S.documentTypeList('collection').title('Collections')
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: [photo, collection] },
});
