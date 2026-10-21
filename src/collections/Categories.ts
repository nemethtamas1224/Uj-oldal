import type { CollectionConfig } from 'payload'
import { contentEditor, publicRead } from './access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'parent', 'catalogRole', 'sortOrder'] },
  access: { create: contentEditor, delete: contentEditor, read: publicRead, update: contentEditor },
  fields: [
    { name: 'name', type: 'text', required: true, index: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    { name: 'parent', type: 'relationship', relationTo: 'categories' },
    { name: 'catalogRole', type: 'select', required: true, defaultValue: 'legacy', options: [{label:'Új katalógus',value:'catalog'},{label:'Régi forráskategória',value:'legacy'}] },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'originalUrl', type: 'text' },
    { name: 'image', type: 'relationship', relationTo: 'media' },
  ],
}
