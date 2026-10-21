import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic='force-dynamic'
export default async function ManufacturersPage(){
 const payload=await getPayload({config})
 const result=await payload.find({collection:'manufacturers',where:{status:{equals:'published'}},limit:100,sort:'name'})
 return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>Gyártók</h1><div className="category-card-grid">{result.docs.map(m=><Link className="category-card" href={`/gyartok/${m.slug}`} key={m.id}><span>{m.name}</span></Link>)}</div></main>
}
