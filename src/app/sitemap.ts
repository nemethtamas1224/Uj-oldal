import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { categoryHref, familyHref, productHref } from '@/lib/catalog'

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const payload=await getPayload({config})
 const [pages,products,categories,families,manufacturers,used]=await Promise.all([
  payload.find({collection:'pages',where:{status:{equals:'published'}},limit:1000}),
  payload.find({collection:'products',where:{and:[{status:{equals:'published'}},{productKind:{not_equals:'legacy'}}]},limit:1000,depth:1}),
  payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:100,depth:1}),
  payload.find({collection:'product-families',where:{status:{equals:'published'}},limit:100,depth:1}),
  payload.find({collection:'manufacturers',where:{status:{equals:'published'}},limit:100}),
  payload.find({collection:'used-machines',where:{status:{equals:'published'}},limit:100}),
 ])
 const base='https://www.rmhungary.hu'
 const item=(path:string,date?:string)=>({url:base+path,lastModified:date?new Date(date):new Date()})
 return [item('/'),item('/termekek'),item('/gyartok'),item('/hasznalt-gepek'),item('/ajanlatkeres'),
  ...pages.docs.map(p=>item(`/${p.slug}`,p.updatedAt)),
  ...categories.docs.map(c=>item(categoryHref(c as any,categories.docs as any[]),c.updatedAt)),
  ...families.docs.map(f=>item(familyHref(f as any,categories.docs as any[]),f.updatedAt)),
  ...products.docs.map(p=>item(productHref(p as any,categories.docs as any[],families.docs as any[]),p.updatedAt)),
  ...manufacturers.docs.map(m=>item(`/gyartok/${m.slug}`,m.updatedAt)),
  ...used.docs.map(u=>item(`/hasznalt-gepek/${u.slug}`,u.updatedAt)),
 ]
}
