import type { CollectionConfig } from 'payload'
import { contentEditor } from './access'

export const LegacyMappings: CollectionConfig = {
  slug: 'legacy-mappings', labels: { singular: 'Régi URL megfeleltetés', plural: 'Régi URL megfeleltetések' },
  admin: { useAsTitle: 'sourceName', defaultColumns: ['legacyKey','sourceName','targetCategory'] },
  access: { create: contentEditor, delete: contentEditor, read: contentEditor, update: contentEditor },
  fields: [
    { name: 'legacyKey', type: 'text', required: true, unique: true },
    { name: 'sourceName', type: 'text', required: true },
    { name: 'sourceUrl', type: 'text', required: true },
    { name: 'legacyCategory', type: 'relationship', relationTo: 'categories' },
    { name: 'targetCategory', type: 'relationship', relationTo: 'categories' },
    { name: 'targetPath', type: 'text', required: true },
    { name: 'additionalCategories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'sourceProduct', type: 'relationship', relationTo: 'products' },
    { name: 'reviewNote', type: 'textarea' },
  ],
}
