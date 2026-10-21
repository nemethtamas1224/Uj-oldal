import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic='force-dynamic'
export default async function UsedMachinePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const payload=await getPayload({config})
 const p=(await payload.find({collection:'used-machines',where:{and:[{slug:{equals:slug}},{status:{equals:'published'}}]},limit:1,depth:1})).docs[0]
 if(!p)notFound()
 const gallery=(p.gallery||[]).filter((x):x is Exclude<typeof x,number>=>typeof x==='object')
 return <main className="plain-page wrap"><p className="eyebrow"><Link href="/hasznalt-gepek">Használt gépek</Link></p><h1>{p.title}</h1>{p.description&&<p className="lead">{p.description}</p>}<dl className="listing-data"><div><dt>Hirdetésazonosító</dt><dd>{p.listingCode}</dd></div>{p.year&&<div><dt>Évjárat</dt><dd>{p.year}</dd></div>}{p.operatingHours&&<div><dt>Üzemóra</dt><dd>{p.operatingHours}</dd></div>}{p.priceText&&<div><dt>Ár</dt><dd>{p.priceText}</dd></div>}</dl>{gallery.length>0&&<div className="media-gallery">{gallery.map((m,i)=>m.url&&<div key={i}><Image src={m.url} alt={m.alt||p.title} fill sizes="(max-width:700px) 80vw, 24vw"/></div>)}</div>}<Link className="button button-red" href={`/ajanlatkeres?hasznalt=${encodeURIComponent(p.slug)}`}>Érdeklődöm</Link></main>
}
