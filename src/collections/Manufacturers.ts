import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const Manufacturers: CollectionConfig = {
  slug: 'manufacturers', labels: { singular: 'Gyártó', plural: 'Gyártók' },
  admin: { useAsTitle: 'name', defaultColumns: ['name','status','updatedAt'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'logo', type: 'relationship', relationTo: 'media' },
    { name: 'sourceUrl', type: 'text' },
    { name: 'reviewNote', type: 'textarea', admin: { description: 'Belső ellenőrzési megjegyzés.' } },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [{label:'Piszkozat',value:'draft'},{label:'Publikált',value:'published'}] },
  ],
}
