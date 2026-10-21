import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import QuoteForm from '../ajanlatkeres/quote-form'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic='force-dynamic'
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const payload=await getPayload({config});const r=await payload.find({collection:'pages',where:{slug:{equals:slug},status:{equals:'published'}},limit:1});const p=r.docs[0];return p?{title:p.seoTitle||p.title,description:p.seoDescription||''}:{}}
export default async function ContentPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const payload=await getPayload({config})
 const r=await payload.find({collection:'pages',where:{slug:{equals:slug},status:{equals:'published'}},limit:1,depth:1})
 const page=r.docs[0]; if(!page)notFound()
 if(slug==='hirek'){
  const list=await payload.find({collection:'news',where:{status:{equals:'published'}},limit:100,sort:'publishedAt',depth:1})
  return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>{page.title}</h1><div className="article-list">{list.docs.map(item=>{const image=item.coverImage&&typeof item.coverImage==='object'?item.coverImage:null;return <article key={item.id}>{image?.url&&<div className="article-photo"><Image src={image.url} alt={image.alt||''} fill sizes="(max-width: 700px) 90vw, 42vw"/></div>}<h2>{item.title}</h2>{item.excerpt&&<p>{item.excerpt}</p>}{item.body&&<div className="source-content"><RichText data={item.body as any}/></div>}</article>})}</div></main>
 }
 if(slug==='referenciak'){
  const list=await payload.find({collection:'references',where:{status:{equals:'published'}},limit:100,depth:1})
  return <main className="plain-page wrap"><p className="eyebrow">RM Hajdú Hungary</p><h1>{page.title}</h1><div className="article-list reference-list">{list.docs.map(item=>{const gallery=Array.isArray(item.gallery)?item.gallery.filter((x):x is Exclude<typeof x,number>=>typeof x==='object'):[];return <article key={item.id}><h2>{item.title}</h2>{item.summary&&<p>{item.summary}</p>}{item.body&&<div className="source-content"><RichText data={item.body as any}/></div>}{gallery.length>0&&<div className="media-gallery">{gallery.map((img,i)=>img.url&&<div key={`${img.url}-${i}`}><Image src={img.url} alt={img.alt||''} fill sizes="(max-width: 700px) 60vw, 24vw"/></div>)}</div>}</article>})}</div></main>
 }
 if(slug==='kapcsolat'){
  const settings=await payload.findGlobal({slug:'site-settings'})
  return <main className="plain-page wrap contact-page"><p className="eyebrow">RM Hajdú Hungary</p><h1>{page.title}</h1><div className="contact-columns"><div><h2>{settings.companyName}</h2><p>{settings.address}</p><p>Levelezési cím:<br/>{settings.mailingAddress}</p><p><a href={`tel:${String(settings.phone||'').replaceAll(' ','')}`}>{settings.phone}</a></p>{settings.email&&<p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>}<QuoteForm/></div>{settings.mapEmbedUrl&&<iframe className="contact-map" src={settings.mapEmbedUrl} title="RM Hajdú Hungary térkép" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>}</div></main>
 }
 const blocks=Array.isArray(page.layout)?page.layout as any[]:[]
 const hasVisualLayout=blocks.length>0
 return <main className="plain-page wrap page-content"><p className="eyebrow">RM Hajdú Hungary</p><h1>{page.title}</h1>{hasVisualLayout?blocks.map((block,i)=>block.blockType==='text'?<section className="source-content source-preserved" key={block.id||i}>{block.heading&&<h2>{block.heading}</h2>}{block.body&&<p>{block.body}</p>}</section>:block.blockType==='media-gallery'?<div className="media-gallery" key={block.id||i}>{(block.images||[]).map((img:any,j:number)=>img&&typeof img==='object'&&img.url&&<div key={img.id||j}><Image src={img.url} alt={img.alt||''} fill sizes="(max-width: 700px) 60vw, 24vw"/></div>)}</div>:null):page.content&&<div className="source-content source-preserved">{page.content}</div>}</main>
}
