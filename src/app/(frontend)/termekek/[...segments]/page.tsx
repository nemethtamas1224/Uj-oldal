import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import config from '@payload-config'
import { categoryHref, familyHref, productHref } from '@/lib/catalog'

export const dynamic='force-dynamic'
type Props={params:Promise<{segments:string[]}>}
const idOf=(x:any)=>String(typeof x==='object'&&x?x.id:x||'')
const photo=(x:any)=>x&&typeof x==='object'&&x.url?x:null

export default async function CatalogRoute({params}:Props){
 const {segments}=await params
 const payload=await getPayload({config})
 const [catResult,familyResult,productResult]=await Promise.all([
  payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:200,sort:'sortOrder',depth:1}),
  payload.find({collection:'product-families',where:{status:{equals:'published'}},limit:100,sort:'sortOrder',depth:1}),
  payload.find({collection:'products',where:{status:{equals:'published'}},limit:500,depth:1}),
 ])
 const categories=catResult.docs as any[]
 const families=familyResult.docs as any[]
 const products=(productResult.docs as any[]).filter(p=>p.productKind!=='legacy')
 const [rootSlug,subSlug,third,fourth]=segments
 const root=categories.find(c=>c.slug===rootSlug&&!c.parent)
 if(segments.length===1){
  if(root){
   const children=categories.filter(c=>idOf(c.parent)===String(root.id))
   return <main className="plain-page wrap"><p className="eyebrow"><Link href="/termekek">Termékek</Link></p><h1>{root.name}</h1><div className="category-card-grid">{children.map(c=><Link className="category-card" href={categoryHref(c,categories)} key={c.id}><span>{c.name}</span></Link>)}</div></main>
  }
  const old=(await payload.find({collection:'products',where:{slug:{equals:rootSlug}},limit:1,depth:0,overrideAccess:true})).docs[0] as any
  if(old){
   if(old.productKind==='legacy'){
    const map=(await payload.find({collection:'legacy-mappings',where:{legacyKey:{equals:String(old.legacyKey)}},limit:1,overrideAccess:true})).docs[0] as any
    if(map?.targetPath)permanentRedirect(map.targetPath)
   }
   if(old.status==='published')permanentRedirect(productHref(old,categories,families))
  }
  notFound()
 }
 const sub=root&&categories.find(c=>c.slug===subSlug&&idOf(c.parent)===String(root.id))
 if(!sub)notFound()
 if(segments.length===2){
  const familyItems=families.filter(f=>idOf(f.category)===String(sub.id))
  const productItems=products.filter(p=>(p.category||[]).some((c:any)=>idOf(c)===String(sub.id)))
  const oldMappings=(await payload.find({collection:'legacy-mappings',limit:50,depth:0,overrideAccess:true})).docs as any[]
  const sourceMappings=oldMappings.filter(m=>idOf(m.targetCategory)===String(sub.id)||(m.additionalCategories||[]).some((c:any)=>idOf(c)===String(sub.id)))
  return <main className="plain-page wrap"><p className="eyebrow"><Link href="/termekek">Termékek</Link>　/　<Link href={categoryHref(root,categories)}>{root.name}</Link></p><h1>{sub.name}</h1>{sub.description&&<p className="lead">{sub.description}</p>}{familyItems.length>0&&<section className="catalog-section"><h2>Termékcsaládok</h2><div className="category-card-grid">{familyItems.map(f=><Link className="category-card" href={familyHref(f,categories)} key={f.id}><span>{f.name}</span></Link>)}</div></section>}{sub.slug!=='csevelodobos'&&<section className="catalog-section"><h2>Termékek</h2>{productItems.length?<div className="catalog-grid">{productItems.map(p=><ProductCard key={p.id} product={p} href={productHref(p,categories,families)}/>)}</div>:<p>Az adott alkategóriában a termékadatok ellenőrzése folyamatban van.</p>}</section>}{sourceMappings.length>0&&<section className="catalog-section"><h2>Eredeti oldalak tartalma</h2><p>A korábbi honlap teljes kategóriaszövege, képei és dokumentumai itt is elérhetők.</p><ul>{sourceMappings.map(m=><li key={m.id}><Link className="text-link" href={`/eredeti-termekoldalak/${m.legacyKey}`}>{m.sourceName}</Link></li>)}</ul></section>}</main>
 }
 if(segments.length===3&&third==='rm-nagy-teljesitmenyu'&&sub.slug==='csevelodobos')permanentRedirect(`/termekek/${root.slug}/${sub.slug}/rm-magnum`)
 const family=families.find(f=>f.slug===third&&idOf(f.category)===String(sub.id))
 if(segments.length===3&&family){
  const familyProducts=products.filter(p=>idOf(p.family)===String(family.id))
  return <main className="plain-page wrap"><p className="eyebrow"><Link href={categoryHref(sub,categories)}>{sub.name}</Link></p><h1>{family.name}</h1>{family.summary&&<p className="lead">{family.summary}</p>}{familyProducts.length>0&&<div className="catalog-grid">{familyProducts.map(p=><ProductCard key={p.id} product={p} href={productHref(p,categories,families)}/>)}</div>}{family.sourceDetails&&family.slug!=='rm-magnum'&&<section className="source-content source-preserved"><h2>Eredeti termékcsoport leírása</h2>{family.sourceDetails}</section>}</main>
 }
 const slug=segments.length===4?fourth:third
 const result=await payload.find({collection:'products',where:{and:[{slug:{equals:slug}},{status:{equals:'published'}}]},limit:1,depth:2})
 const p=result.docs[0] as any
 if(!p||p.productKind==='legacy')notFound()
 const canonical=productHref(p,categories,families)
 if(canonical!==`/termekek/${segments.join('/')}`)permanentRedirect(canonical)
 const image=photo(p.image)
 const gallery=(p.gallery||[]).map(photo).filter(Boolean)
 const documents=(p.documents||[]).map(photo).filter(Boolean)
 return <main className="plain-page wrap"><p className="eyebrow"><Link href="/termekek">Termékek</Link>　/　<Link href={categoryHref(sub,categories)}>{sub.name}</Link>{family&&<>　/　<Link href={familyHref(family,categories)}>{family.name}</Link></>}</p><section className="product-detail"><div className="detail-image">{image?<Image src={image.url} alt={image.alt||p.name} fill sizes="(max-width: 700px) 100vw, 52vw"/>:<span>RM</span>}</div><div><p className="eyebrow">{p.manufacturer&&typeof p.manufacturer==='object'?p.manufacturer.name:p.brand||'RM Hajdú Hungary'}</p><h1>{p.name}</h1>{p.summary&&<p className="lead">{p.summary}</p>}{p.reviewState==='specs-missing'&&<p className="source-note">A részletes műszaki adatok egyeztetése folyamatban van.</p>}<Link className="button button-red" href={`/ajanlatkeres?termek=${encodeURIComponent(p.slug)}`}>Ajánlatot kérek</Link></div></section>{p.hoseSizes?.length>0&&<section className="hose-size-panel"><div className="hose-size-heading"><div><p className="eyebrow">RM csévélődobok</p><h2>Katalógus szerinti méretek</h2></div><span>{p.hoseSizes.length} változat</span></div><p className="hose-size-legend">Átmérő (mm) / tömlőhossz (m) — például 110/450: 110 mm átmérő, 450 m hossz.</p><div className="hose-size-grid">{p.hoseSizes.map((size:any,i:number)=><span key={size.id||i}>{size.diameterMm}/{size.lengthM}</span>)}</div><p className="hose-size-caveat">A lista katalógusadat; az aktuális készletet és rendelhetőséget ajánlatkéréskor egyeztetjük.</p></section>}{p.description&&<section className="source-content"><RichText data={p.description as any}/></section>}{p.sourceDetails&&<section className="spec-section"><h2>Részletek</h2><p className="source-content source-preserved">{p.sourceDetails}</p></section>}{p.specifications?.length>0&&<section className="spec-section"><h2>Műszaki adatok</h2><dl>{p.specifications.map((s:any,i:number)=><div key={i}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl></section>}{p.configurations?.length>0&&<section className="spec-section"><h2>Választható kivitelek</h2><dl>{p.configurations.map((c:any,i:number)=><div key={i}><dt>{c.name}</dt><dd>{c.value||'Érdeklődésre'}</dd></div>)}</dl></section>}{gallery.length>1&&<section className="media-gallery">{gallery.map((m:any)=><div key={m.id}><Image src={m.url} alt={m.alt||''} fill sizes="(max-width:700px) 70vw, 24vw"/></div>)}</section>}{documents.length>0&&<section className="spec-section"><h2>Dokumentumok</h2><ul>{documents.map((d:any)=><li key={d.id}><a href={d.url}>{d.alt||d.filename||'Dokumentum'}</a></li>)}</ul></section>}</main>
}
function ProductCard({product,href}:{product:any;href:string}){
 const image=photo(product.image)
 return <Link className="product-card" href={href}><div className="product-picture">{image?<Image src={image.url} alt={image.alt||product.name} fill sizes="(max-width: 800px) 80vw, 26vw"/>:<span className="product-placeholder">RM</span>}</div><div className="product-card-meta"><span>{product.manufacturer&&typeof product.manufacturer==='object'?product.manufacturer.name:product.brand||'RM'}</span></div><h3>{product.name}</h3>{product.summary&&<p>{product.summary}</p>}</Link>
}
