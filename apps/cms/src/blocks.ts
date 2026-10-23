import type { Block } from 'payload'
import type { IconName } from '@landing/types'

const icons: IconName[] = ['box', 'cart', 'tag', 'chart', 'shield', 'alert']

export const Hero: Block = {
  slug: 'hero',
  fields: [
    { name: 'pill', type: 'text', label: 'Мітка' },
    { name: 'heading', type: 'text', required: true, label: 'Заголовок' },
    { name: 'lead', type: 'textarea', required: true, label: 'Підзаголовок' },
    { name: 'ctaLabel', type: 'text', required: true, defaultValue: 'Дізнатись більше' },
    { name: 'ctaHref', type: 'text', required: true, defaultValue: '#block-1' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Зображення' },
    {
      name: 'facts', type: 'array', maxRows: 4, label: 'Цифри',
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const Features: Block = {
  slug: 'features',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    {
      name: 'items', type: 'array', required: true, minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        { name: 'icon', type: 'select', defaultValue: 'box', options: icons },
      ],
    },
  ],
}

export const Steps: Block = {
  slug: 'steps',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'steps', type: 'array', required: true, minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
  ],
}

export const Faq: Block = {
  slug: 'faq',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'questions', type: 'array', required: true, minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}
