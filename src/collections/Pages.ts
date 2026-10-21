import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'pageType', 'status'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  versions: { drafts: { autosave: true, schedulePublish: true }, maxPerDoc: 25 },
  fields: [
    { name: 'title', type: 'text', required: true, index: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'pageType', type: 'select', required: true, options: [{ label: 'Oldal', value: 'page' }, { label: 'Kategória', value: 'category' }, { label: 'Forrásoldal', value: 'source' }] },
    { name: 'content', type: 'textarea' },
    { name: 'sourceText', type: 'textarea', admin: { description: 'Az eredeti oldal hozzáférhető teljes szövege.' } },
    { name: 'layout', type: 'blocks', blocks: [
      { slug: 'text', labels: { singular: 'Szövegblokk', plural: 'Szövegblokkok' }, fields: [{ name: 'heading', type: 'text' }, { name: 'body', type: 'textarea' }] },
      { slug: 'media-gallery', labels: { singular: 'Képgaléria', plural: 'Képgalériák' }, fields: [{ name: 'images', type: 'relationship', relationTo: 'media', hasMany: true }] },
    ] },
    { name: 'sourceHeadings', type: 'json' },
    { name: 'sourceLinks', type: 'json' },
    { name: 'originalUrl', type: 'text' },
    { name: 'legacyKey', type: 'text', index: true },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoDescription', type: 'textarea' },
    { name: 'status', type: 'select', required: true, defaultValue: 'published', options: [{ label: 'Piszkozat', value: 'draft' }, { label: 'Publikált', value: 'published' }] },
  ],
}
