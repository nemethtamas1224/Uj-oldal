import type { CollectionConfig } from 'payload'
import { contentEditor } from './access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries', labels: { singular: 'Ajánlatkérés', plural: 'Ajánlatkérések' },
  admin: { useAsTitle: 'name', defaultColumns: ['name','email','product','createdAt'] },
  access: { create: contentEditor, delete: contentEditor, read: contentEditor, update: contentEditor },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'product', type: 'relationship', relationTo: 'products' },
    { name: 'usedMachine', type: 'relationship', relationTo: 'used-machines' },
    { name: 'privacyConsent', type: 'checkbox', required: true },
    { name: 'handled', type: 'checkbox', defaultValue: false },
  ],
}
