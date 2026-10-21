import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { productHref } from '@/lib/catalog'

export const dynamic='force-dynamic'
export default async function ManufacturerPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const payload=await getPayload({config})
 const m=(await payload.find({collection:'manufacturers',where:{and:[{slug:{equals:slug}},{status:{equals:'published'}}]},limit:1})).docs[0]
 if(!m)notFound()
 const [productResult,catResult,familyResult]=await Promise.all([
  payload.find({collection:'products',where:{and:[{manufacturer:{equals:m.id}},{status:{equals:'published'}}]},limit:200,depth:1}),
  payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:100,depth:1}),
  payload.find({collection:'product-families',where:{status:{equals:'published'}},limit:100,depth:1}),
 ])
 const products=productResult.docs.filter(p=>p.productKind!=='legacy')
 return <main className="plain-page wrap"><p className="eyebrow"><Link href="/gyartok">Gyártók</Link></p><h1>{m.name}</h1>{m.description&&<p className="lead">{m.description}</p>}<div className="catalog-grid">{products.map(p=>{const image=p.image&&typeof p.image==='object'?p.image:null;return <Link className="product-card" href={productHref(p as any,catResult.docs as any[],familyResult.docs as any[])} key={p.id}><div className="product-picture">{image?.url?<Image src={image.url} alt={image.alt||p.name} fill sizes="(max-width: 800px) 80vw, 26vw"/>:<span className="product-placeholder">RM</span>}</div><h3>{p.name}</h3></Link>})}</div>{!products.length&&<p>Ehhez a gyártóhoz még nincs közzétett termékadatlap.</p>}</main>
}
