import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const ProductFamilies: CollectionConfig = {
  slug: 'product-families', labels: { singular: 'Termékcsalád', plural: 'Termékcsaládok' },
  admin: { useAsTitle: 'name', defaultColumns: ['name','category','manufacturer','status'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'sortOrder', type: 'number', label: 'Sorrend', defaultValue: 0 },
    { name: 'summary', type: 'textarea' },
    { name: 'sourceDetails', type: 'textarea', admin: {description:'Az eredeti termékcsoport oldalon megőrzött szöveg.'} },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'manufacturer', type: 'relationship', relationTo: 'manufacturers' },
    { name: 'image', type: 'relationship', relationTo: 'media' },
    { name: 'sourceUrl', type: 'text' },
    { name: 'reviewNote', type: 'textarea' },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [{label:'Piszkozat',value:'draft'},{label:'Publikált',value:'published'}] },
  ],
}
