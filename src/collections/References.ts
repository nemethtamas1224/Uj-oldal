import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const References: CollectionConfig = {
  slug: 'references',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'location', 'status'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'location', type: 'text' },
    { name: 'summary', type: 'textarea' },
    { name: 'body', type: 'richText' },
    { name: 'gallery', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'originalUrl', type: 'text' },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [{ label: 'Piszkozat', value: 'draft' }, { label: 'Publikált', value: 'published' }] },
  ],
}
