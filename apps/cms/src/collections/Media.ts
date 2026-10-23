import type { CollectionConfig } from 'payload'
export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: { mimeTypes: ['image/*'], imageSizes: [{ name: 'card', width: 800 }] },
  fields: [{ name: 'alt', type: 'text', required: true, label: 'Alt-текст' }],
}
