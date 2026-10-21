import type { CollectionConfig } from 'payload'
import { contentEditor, publishedOrAdmin } from './access'

export const UsedMachines: CollectionConfig = {
  slug: 'used-machines', labels: { singular: 'Használt gép', plural: 'Használt gépek' },
  admin: { useAsTitle: 'title', defaultColumns: ['title','condition','status','updatedAt'] },
  access: { create: contentEditor, delete: contentEditor, read: publishedOrAdmin, update: contentEditor },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'listingCode', type: 'text', required: true, unique: true },
    { name: 'manufacturer', type: 'relationship', relationTo: 'manufacturers' },
    { name: 'model', type: 'text' },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'year', type: 'number', min: 1900 },
    { name: 'condition', type: 'select', options: [{label:'Nem megadott',value:'unknown'},{label:'Használt',value:'used'},{label:'Felújított',value:'refurbished'}], defaultValue:'unknown' },
    { name: 'operatingHours', type: 'number', min: 0 },
    { name: 'priceText', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'gallery', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'availability', type: 'select', options: [{label:'Érdeklődésre',value:'ask'},{label:'Elérhető',value:'available'},{label:'Elkelt',value:'sold'}], defaultValue:'ask' },
    { name: 'sourceUrl', type: 'text' },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [{label:'Piszkozat',value:'draft'},{label:'Publikált',value:'published'}] },
  ],
}
