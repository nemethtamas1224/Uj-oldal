import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { categoryHref } from '@/lib/catalog'

export const dynamic='force-dynamic'
export default async function ProductsPage(){
 const payload=await getPayload({config})
 const result=await payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:100,sort:'sortOrder',depth:1})
 const categories=result.docs as any[]
 const roots=categories.filter(c=>!c.parent)
 return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>Termékek</h1><p className="lead">Válasszon a hét termékterület közül, majd böngésszen az alkategóriák és gépek között.</p><div className="catalog-root-grid">{roots.map((root,i)=><section className="catalog-root-panel" key={root.id}><Link href={categoryHref(root,categories)}><span className="catalog-root-index">{String(i+1).padStart(2,'0')}</span><h2>{root.name}</h2></Link><div className="catalog-root-children">{categories.filter(c=>String(typeof c.parent==='object'?c.parent?.id:c.parent)===String(root.id)).map(child=><Link key={child.id} href={categoryHref(child,categories)}>{child.name}</Link>)}</div></section>)}</div></main>
}
