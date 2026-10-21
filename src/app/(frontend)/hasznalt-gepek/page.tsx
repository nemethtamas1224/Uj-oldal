import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic='force-dynamic'
export default async function UsedMachinesPage(){
 const payload=await getPayload({config})
 const list=await payload.find({collection:'used-machines',where:{status:{equals:'published'}},limit:100,sort:'-createdAt',depth:1})
 return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>Használt gépek</h1><p className="lead">Az aktuálisan elérhető gépek egyedi hirdetései.</p>{list.docs.length?<div className="catalog-grid">{list.docs.map(machine=>{const first=Array.isArray(machine.gallery)?machine.gallery.find(x=>typeof x==='object'):null;return <Link className="product-card" href={`/hasznalt-gepek/${machine.slug}`} key={machine.id}><div className="product-picture">{first&&typeof first==='object'&&first.url?<Image src={first.url} alt={first.alt||machine.title} fill sizes="(max-width:800px) 80vw, 26vw"/>:<span className="product-placeholder">RM</span>}</div><h3>{machine.title}</h3>{machine.priceText&&<p>{machine.priceText}</p>}</Link>})}</div>:<div className="catalog-empty"><p>Jelenleg nincs ellenőrzött, közzétett géphirdetés.</p><Link href="/ajanlatkeres">Érdeklődés használt gépről</Link></div>}<p className="source-note"><Link href="/eredeti-termekoldalak/43">A korábbi használtgép-oldal tartalma</Link></p></main>
}
