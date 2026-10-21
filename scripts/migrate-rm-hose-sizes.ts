import { getPayload } from 'payload'
import config from '../payload.config'
import { rmHoseSeries } from './rm-hose-size-data'

const payload = await getPayload({ config })
const findOne = async (collection: 'categories' | 'manufacturers' | 'product-families' | 'products', slug: string) =>
 (await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
const category = await findOne('categories', 'csevelodobos')
const manufacturer = await findOne('manufacturers', 'rm')
if (!category || !manufacturer) throw new Error('Run the existing catalog migration first.')
await payload.update({ collection: 'categories', id: category.id, overrideAccess: true, data: { name: 'RM csévélődobok' } } as any)
let former = await findOne('product-families', 'rm-nagy-teljesitmenyu')
if (former) {
 await payload.update({ collection: 'product-families', id: former.id, overrideAccess: true, data: { name: 'RM Magnum', slug: 'rm-magnum', sortOrder: 30, summary: 'RM Magnum csévélődobos öntözőgépek.' } } as any)
}
let created = 0, updated = 0
for (const series of rmHoseSeries) {
 let family = await findOne('product-families', series.familySlug)
 if (!family) family = await payload.create({ collection: 'product-families', overrideAccess: true, data: { slug: series.familySlug, name: series.familyName, category: category.id, manufacturer: manufacturer.id, sortOrder: series.sortOrder, status: 'published' } } as any)
 else family = await payload.update({ collection: 'product-families', id: family.id, overrideAccess: true, data: { name: series.familyName, sortOrder: series.sortOrder, category: category.id, status: 'published' } } as any)
 for (const item of series.products) {
  const existing = await findOne('products', item.slug)
  const data = {
   name: item.name, brand: 'RM', manufacturer: manufacturer.id, family: family.id,
   category: [category.id], productKind: 'model', reviewState: 'specs-missing',
   reviewNote: 'A méretek a felhasználó 2026-10-21-i katalóguslistájából származnak. Nem igazolt aktuális gyári készlet- vagy rendelhetőségi lista; a további műszaki adatok ellenőrizendők.',
   hoseSizes: item.hoseSizes, status: 'published',
  }
  if (existing) { await payload.update({ collection: 'products', id: existing.id, overrideAccess: true, data } as any); updated++ }
  else { await payload.create({ collection: 'products', overrideAccess: true, data: { ...data, slug: item.slug, modelCode: item.name.replace(/^RM /, '') } } as any); created++ }
 }
}
const canonical = new Set(rmHoseSeries.flatMap(series => series.products.map(item => item.slug)))
const oldProducts = (await payload.find({ collection: 'products', where: { productKind: { equals: 'model' } }, limit: 500, depth: 0, overrideAccess: true })).docs as any[]
let archived = 0
for (const product of oldProducts) {
 const categories = Array.isArray(product.category) ? product.category : []
 if (!categories.some((value: any) => String(typeof value === 'object' ? value.id : value) === String(category.id)) || canonical.has(product.slug)) continue
 await payload.update({ collection: 'products', id: product.id, overrideAccess: true, data: {
  status: 'archived', reviewNote: 'A 2026-10-21-i felhasználói 23 típusos méretlistában nem szerepel. Korábbi forrásadatként megőrizve; a terméktípust külön kell ellenőrizni.'
 } } as any)
 archived++
}
console.log(JSON.stringify({ series: rmHoseSeries.length, models: canonical.size, sizes: rmHoseSeries.reduce((n, series) => n + series.products.reduce((m, product) => m + product.hoseSizes.length, 0), 0), created, updated, archived }, null, 2))
await payload.destroy()
