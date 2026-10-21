import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const News: CollectionConfig = {
  slug: 'news',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publishedAt', 'status'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 25 },
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'body', type: 'richText' },
    { name: 'coverImage', type: 'relationship', relationTo: 'media' },
    { name: 'publishedAt', type: 'date' },
    { name: 'originalUrl', type: 'text' },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [{ label: 'Piszkozat', value: 'draft' }, { label: 'Publikált', value: 'published' }] },
  ],
}
