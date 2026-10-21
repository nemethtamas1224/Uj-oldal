import { readFile } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '../payload.config'
import { roots, subcategories, brands, families, products, legacyMap } from './catalog-data'

const payload = await getPayload({ config })
const crawl = JSON.parse(await readFile(new URL('../audit/site-crawl.json', import.meta.url), 'utf8'))
const sourcePage=(key:string)=>crawl.pages.find((p:any)=>p.url===`https://www.rmhungary.hu/index.php?alkat=${key}`)
const sourceUrl=(key:string)=>`https://www.rmhungary.hu/index.php?alkat=${key}`
const oldCats=(await payload.find({collection:'categories',limit:300,depth:0,overrideAccess:true})).docs as any[]
const oldProducts=(await payload.find({collection:'products',limit:500,depth:0,overrideAccess:true})).docs as any[]
const media=(await payload.find({collection:'media',limit:500,depth:0,overrideAccess:true})).docs as any[]
const byLegacyCat=new Map(oldCats.filter(c=>c.originalUrl?.includes('alkat=')).map(c=>[String(new URL(c.originalUrl).searchParams.get('alkat')),c]))
const byLegacyProduct=new Map(oldProducts.filter(p=>p.legacyKey).map(p=>[String(p.legacyKey),p]))
let updatedLegacy=0,createdCategories=0,createdBrands=0,createdFamilies=0,createdProducts=0,createdMappings=0
for(const c of oldCats.filter(c=>c.originalUrl?.includes('alkat=')))if(c.catalogRole!=='legacy'){await payload.update({collection:'categories',id:c.id,overrideAccess:true,data:{catalogRole:'legacy'}} as any);updatedLegacy++}
for(const p of oldProducts)if(p.legacyKey&&p.productKind!=='legacy'){await payload.update({collection:'products',id:p.id,overrideAccess:true,data:{productKind:'legacy',reviewState:'identified'}} as any);updatedLegacy++}
const categories=new Map<string,any>()
const findCategory=async(slug:string)=>{
 const r=await payload.find({collection:'categories',where:{slug:{equals:slug}},limit:1,depth:0,overrideAccess:true});return r.docs[0] as any
}
for(let i=0;i<roots.length;i++){
 const [slug,name]=roots[i];let doc=await findCategory(slug)
 if(!doc){doc=await payload.create({collection:'categories',overrideAccess:true,data:{name,slug,catalogRole:'catalog',sortOrder:(i+1)*100}} as any);createdCategories++}
 else if(doc.catalogRole!=='catalog')doc=await payload.update({collection:'categories',id:doc.id,overrideAccess:true,data:{catalogRole:'catalog'}} as any)
 categories.set(slug,doc)
}
for(let i=0;i<subcategories.length;i++){
 const [parent,slug,name]=subcategories[i];let doc=await findCategory(slug)
 if(!doc){doc=await payload.create({collection:'categories',overrideAccess:true,data:{name,slug,parent:categories.get(parent).id,catalogRole:'catalog',sortOrder:i+1}} as any);createdCategories++}
 else if(doc.catalogRole!=='catalog')doc=await payload.update({collection:'categories',id:doc.id,overrideAccess:true,data:{catalogRole:'catalog'}} as any)
 categories.set(slug,doc)
}
const brandDocs=new Map<string,any>()
for(const [slug,name,key] of brands){
 const r=await payload.find({collection:'manufacturers',where:{slug:{equals:slug}},limit:1,depth:0,overrideAccess:true});let doc=r.docs[0] as any
 if(!doc){doc=await payload.create({collection:'manufacturers',overrideAccess:true,data:{name,slug,sourceUrl:sourceUrl(key),status:'published',reviewNote:slug==='valducci'?'A Giunti oldalon vállalatcsoportként említett; pontos termékkapcsolat ellenőrizendő.':undefined}} as any);createdBrands++}
 brandDocs.set(slug,doc)
}
const familyDocs=new Map<string,any>()
for(const [slug,name,category,brand,key] of families){
 const r=await payload.find({collection:'product-families',where:{slug:{equals:slug}},limit:1,depth:0,overrideAccess:true});let doc=r.docs[0] as any
 if(!doc){const original=byLegacyProduct.get(key);doc=await payload.create({collection:'product-families',overrideAccess:true,data:{name,slug,category:categories.get(category).id,manufacturer:brandDocs.get(brand)?.id,sourceUrl:sourceUrl(key),sourceDetails:original?.sourceDetails||'',status:'published'}} as any);createdFamilies++}
 familyDocs.set(slug,doc)
}
const modelDocs=new Map<string,any>()
for(const item of products){
 const r=await payload.find({collection:'products',where:{slug:{equals:item.slug}},limit:1,depth:0,overrideAccess:true});let doc=r.docs[0] as any
 if(!doc){
  const page=sourcePage(item.source)
  const im=page?.mainBlocks?.flatMap((b:any)=>b.images||[]).find((x:any)=>x.src?.split('/').pop()===item.image)
  const foundMedia=im?media.find(m=>m.sourceUrl===new URL(im.src,sourceUrl(item.source)).href):undefined
  const note=item.review==='source-check'?'A pontos modelljelölés vagy modellkapcsolat további forrásellenőrzést igényel.':item.review==='specs-missing'?'A modell vagy terméktípus neve azonosított; teljes műszaki adatlap még nincs ellenőrizve.':undefined
  doc=await payload.create({collection:'products',overrideAccess:true,data:{name:item.name,slug:item.slug,brand:item.brand?brandDocs.get(item.brand)?.name:undefined,manufacturer:item.brand?brandDocs.get(item.brand)?.id:undefined,family:item.family?familyDocs.get(item.family)?.id:undefined,category:[categories.get(item.category).id],image:foundMedia?.id,gallery:foundMedia?[foundMedia.id]:[],productKind:item.kind||'model',reviewState:item.review||'identified',reviewNote:note,modelCode:item.modelCode,originalUrl:sourceUrl(item.source),sourceEvidence:[{url:sourceUrl(item.source),note:item.image?`Eredeti oldali képfájl: ${item.image}`:'Eredeti kategóriaoldal; konkrét kép hozzárendelése nem igazolt.',media:foundMedia?.id}],status:item.draft?'draft':'published'}} as any)
  createdProducts++
 }
 else if(item.image&&!doc.image){
  const page=sourcePage(item.source)
  const im=page?.mainBlocks?.flatMap((b:any)=>b.images||[]).find((x:any)=>x.src?.split('/').pop()===item.image)
  const foundMedia=im?media.find(m=>m.sourceUrl===new URL(im.src,sourceUrl(item.source)).href):undefined
  if(foundMedia){
   doc=await payload.update({collection:'products',id:doc.id,overrideAccess:true,data:{image:foundMedia.id,gallery:[foundMedia.id],sourceEvidence:[{url:sourceUrl(item.source),note:`Eredeti oldali képfájl: ${item.image}`,media:foundMedia.id}]}} as any)
  }
 }
 modelDocs.set(item.slug,doc)
}
for(const [key,primary,additional] of legacyMap){
 const source=byLegacyCat.get(key);const target=primary==='used'?undefined:categories.get(primary)
 const parent=target?.parent?categories.get(subcategories.find(row=>row[1]===primary)?.[0]||''):undefined
 const targetPath=primary==='used'?'/hasznalt-gepek':`/termekek/${parent?.slug||primary}/${primary}`
 const r=await payload.find({collection:'legacy-mappings',where:{legacyKey:{equals:key}},limit:1,depth:0,overrideAccess:true});let doc=r.docs[0]
 const data={legacyKey:key,sourceName:source?.name||`Régi kategória ${key}`,sourceUrl:sourceUrl(key),legacyCategory:source?.id,targetCategory:target?.id,targetPath,additionalCategories:additional.map(slug=>categories.get(slug)?.id).filter(Boolean),sourceProduct:byLegacyProduct.get(key)?.id}
 if(!doc){await payload.create({collection:'legacy-mappings',overrideAccess:true,data} as any);createdMappings++}
 else await payload.update({collection:'legacy-mappings',id:doc.id,overrideAccess:true,data} as any)
}
const settings=await payload.findGlobal({slug:'site-settings',overrideAccess:true})
await payload.updateGlobal({slug:'site-settings',overrideAccess:true,data:{navigation:[
 {label:'Főoldal',href:'/'},{label:'Termékek',href:'/termekek'},{label:'Gyártók',href:'/gyartok'},
 {label:'Használt gépek',href:'/hasznalt-gepek'},{label:'Referenciák',href:'/referenciak'},
 {label:'Szolgáltatások',href:'/szolgaltatasok'},{label:'Hírek és pályázatok',href:'/hirek'},
 {label:'Kapcsolat',href:'/kapcsolat'}],footerNavigation:[
 ...(settings.footerNavigation||[]).filter((item:any)=>String(item.href||'').endsWith('.pdf')),
 {label:'Rólunk',href:'/rolunk'},{label:'Termékek',href:'/termekek'},{label:'Gyártók',href:'/gyartok'},
 {label:'Használt gépek',href:'/hasznalt-gepek'},{label:'Referenciák',href:'/referenciak'},
 {label:'Szolgáltatások',href:'/szolgaltatasok'},{label:'Hírek',href:'/hirek'},
 {label:'Pályázatok',href:'/palyazat'},{label:'Kapcsolat',href:'/kapcsolat'}]}} as any)
console.log(JSON.stringify({updatedLegacy,createdCategories,createdBrands,createdFamilies,createdProducts,createdMappings,legacyCount:legacyMap.length,draftModels:products.filter(p=>p.draft).length},null,2))
await payload.destroy()
