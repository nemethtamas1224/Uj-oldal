import type { CollectionConfig } from 'payload'
import { adminOnly } from './access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600_000 },
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'role', 'updatedAt'] },
  access: { admin: adminOnly, create: adminOnly, delete: adminOnly, read: adminOnly, update: adminOnly },
  fields: [{ name: 'role', type: 'select', required: true, defaultValue: 'admin', options: [{ label: 'Adminisztrátor', value: 'admin' }, { label: 'Szerkesztő', value: 'editor' }] }],
}
