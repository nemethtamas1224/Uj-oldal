import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { categoryHref, productHref } from '@/lib/catalog'

export const dynamic='force-dynamic'
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}){
 const {q=''}=await searchParams;const term=q.trim();const payload=await getPayload({config})
 if(!term)return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>Keresés</h1><form className="search-large" action="/kereses"><input name="q" aria-label="Keresés" placeholder="Keresés..."/><button className="button button-red">Keresés</button></form></main>
 const [products,pages,news,categories,allCategories,families,manufacturers]=await Promise.all([
  payload.find({collection:'products',where:{and:[{status:{equals:'published'}},{productKind:{not_equals:'legacy'}},{or:[{name:{contains:term}},{summary:{contains:term}},{sourceDetails:{contains:term}}]}]},limit:50,depth:1}),
  payload.find({collection:'pages',where:{and:[{status:{equals:'published'}},{or:[{title:{contains:term}},{content:{contains:term}}]}]},limit:30}),
  payload.find({collection:'news',where:{and:[{status:{equals:'published'}},{or:[{title:{contains:term}},{excerpt:{contains:term}}]}]},limit:30}),
  payload.find({collection:'categories',where:{and:[{catalogRole:{equals:'catalog'}},{name:{contains:term}}]},limit:50,depth:1}),
  payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:100,depth:1}),
  payload.find({collection:'product-families',where:{status:{equals:'published'}},limit:100,depth:1}),
  payload.find({collection:'manufacturers',where:{and:[{status:{equals:'published'}},{name:{contains:term}}]},limit:30}),
 ])
 const total=products.docs.length+categories.docs.length+manufacturers.docs.length+news.docs.length+pages.docs.length
 return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>Keresés</h1><form className="search-large" action="/kereses"><input name="q" aria-label="Keresés" defaultValue={term}/><button className="button button-red">Keresés</button></form><div className="search-results">{products.docs.map(p=><Link key={`p-${p.id}`} href={productHref(p as any,allCategories.docs as any[],families.docs as any[])}><span>Termék</span><b>{p.name}</b></Link>)}{categories.docs.map(c=><Link key={`c-${c.id}`} href={categoryHref(c as any,allCategories.docs as any[])}><span>Kategória</span><b>{c.name}</b></Link>)}{manufacturers.docs.map(m=><Link key={`m-${m.id}`} href={`/gyartok/${m.slug}`}><span>Gyártó</span><b>{m.name}</b></Link>)}{news.docs.map(n=><Link key={`n-${n.id}`} href="/hirek"><span>Hír</span><b>{n.title}</b></Link>)}{pages.docs.map(p=><Link key={`pg-${p.id}`} href={`/${p.slug}`}><span>Oldal</span><b>{p.title}</b></Link>)}{!total&&<p>Nincs találat.</p>}</div></main>
}
