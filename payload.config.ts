import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'
import { contentEditor } from './src/collections/access'
import { Categories } from './src/collections/Categories'
import { Manufacturers } from './src/collections/Manufacturers'
import { ProductFamilies } from './src/collections/ProductFamilies'
import { LegacyMappings } from './src/collections/LegacyMappings'
import { UsedMachines } from './src/collections/UsedMachines'
import { Inquiries } from './src/collections/Inquiries'
import { Media } from './src/collections/Media'
import { News } from './src/collections/News'
import { Pages } from './src/collections/Pages'
import { Products } from './src/collections/Products'
import { References } from './src/collections/References'
import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const usePostgres = process.env.DATABASE_ADAPTER === 'postgres'
const payloadSecret = process.env.PAYLOAD_SECRET || (process.env.NODE_ENV === 'development' ? 'local-development-only-secret-not-for-deployment' : '')
if (!payloadSecret) throw new Error('PAYLOAD_SECRET must be set before production use.')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users, Categories, ProductFamilies, Manufacturers, Products, UsedMachines, Inquiries, LegacyMappings, News, References, Pages, Media],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  db: usePostgres
    ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' } })
    : sqliteAdapter({ client: { url: process.env.DATABASE_URL || 'file:./data/rm-hungary.db' } }),
  upload: { limits: { fileSize: 20_000_000 } },
  globals: [
    {
      slug: 'site-settings',
      label: 'Webhely beállításai',
      access: { read: () => true, update: contentEditor },
      fields: [
        { name: 'companyName', type: 'text', defaultValue: 'RM Hajdú Hungary Kft.' },
        { name: 'address', type: 'text', defaultValue: '4132 Tépe, Rákóczi u. 8.' },
        { name: 'mailingAddress', type: 'text', defaultValue: '4132 Tépe, Fő u. 8.' },
        { name: 'phone', type: 'text', defaultValue: '+36 30/2780944' },
        { name: 'email', type: 'email' },
        { name: 'seoTitle', type: 'text' },
        { name: 'seoDescription', type: 'textarea' },
        { name: 'mapEmbedUrl', type: 'text' },
        { name: 'emailSourceUrl', type: 'text' },
        { name: 'heroHeadline', type: 'text' },
        { name: 'heroSubhead', type: 'text' },
        { name: 'heroImage', type: 'relationship', relationTo: 'media' },
        { name: 'logo', type: 'relationship', relationTo: 'media' },
        { name: 'serviceImage', type: 'relationship', relationTo: 'media' },
        { name: 'navigation', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'href', type: 'text', required: true }] },
        { name: 'footerNavigation', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'href', type: 'text', required: true }] },
      ],
    },
  ],
})
