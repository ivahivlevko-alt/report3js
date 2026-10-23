import type { CollectionConfig } from 'payload'
import { Faq, Features, Hero, Steps } from '../blocks'
import { pageBySlug } from '../endpoints/pageBySlug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  endpoints: [pageBySlug],
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'footer', type: 'text', label: 'Текст футера' },
    { name: 'blocks', type: 'blocks', required: true, minRows: 1, blocks: [Hero, Features, Steps, Faq] },
  ],
}
