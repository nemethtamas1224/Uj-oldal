import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeCatalog from './home-catalog'
import { productHref } from '@/lib/catalog'

export const dynamic = 'force-dynamic'
type MediaRef = { url?: string | null; alt?: string | null } | number | string | null | undefined
const media = (value: MediaRef): value is { url?: string | null; alt?: string | null } => Boolean(value && typeof value === 'object')
const featuredLogoPaths: Record<string,string> = {
  rm:'/elemek/rolunk_rm.png', rovatti:'/elemek/rolunk_rovatti.png', starpower:'/elemek/rolunk_starpower.png',
  giunti:'/elemek/rolunk_giunti.png', 'de-cloet':'/elemek/rolunk_decloet.png',
}

export default async function HomePage() {
  const payload = await getPayload({ config })
  const [categories, products, families, brands, settings, servicePage, aboutPage] = await Promise.all([
    payload.find({ collection: 'categories', where:{catalogRole:{equals:'catalog'}}, limit: 100, sort: 'sortOrder', depth: 1 }),
    payload.find({ collection: 'products', where: { and:[{status: { equals: 'published' }},{productKind:{not_equals:'legacy'}}] }, limit: 200, sort: 'name', depth: 1 }),
    payload.find({ collection: 'product-families', where:{status:{equals:'published'}},limit:100,depth:1 }),
    payload.find({ collection: 'manufacturers', where:{status:{equals:'published'}},limit:100,depth:0 }),
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    payload.find({ collection: 'pages', where: { slug: { equals: 'szolgaltatasok' } }, limit: 1 }),
    payload.find({ collection: 'pages', where: { slug: { equals: 'rolunk' } }, limit: 1 }),
  ])
  const hero = media(settings.heroImage) ? settings.heroImage : null
  const servicePhoto = media(settings.serviceImage) ? settings.serviceImage : null
  const about = aboutPage.docs[0]
  const aboutParagraphs = String(about?.content || '').replace(/Bartalis LeventeÜgyvezető\s*$/,'').split(/(?=Cégünk öntözőtelepek|Az évek folyamán|Termékpalettánk:|Minthogy a klímaváltozás)/).map(part=>part.trim()).filter(Boolean)
  const featuredBrands = ['rm','rovatti','starpower','giunti','de-cloet'].map(slug=>brands.docs.find(brand=>brand.slug===slug)).filter((brand):brand is NonNullable<typeof brand>=>Boolean(brand))
  return <main>
      <section className="hero wrap"><div className="hero-image">{hero?.url ? <Image src={hero.url} alt={hero.alt || ''} fill priority sizes="(max-width: 800px) 100vw, 58vw" /> : null}</div><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-mark" />RM Hajdú Hungary</p><h1>{settings.heroHeadline}</h1><p className="lead">{settings.heroSubhead}</p><div className="hero-actions"><Link className="button button-red" href="/#termekek">Termékkategóriák</Link><Link className="text-link" href="/#rolunk">Rólunk</Link></div></div><div className="featured-brands"><div className="featured-brands-heading"><span className="eyebrow">Partnereink</span><h2>Az általunk forgalmazott márkák</h2></div><div className="featured-brand-grid">{featuredBrands.map(brand=><Link className="featured-brand" href={`/gyartok/${brand.slug}`} key={brand.id} aria-label={`${brand.name} termékei`}><span className="featured-brand-logo"><Image src={featuredLogoPaths[brand.slug]} alt={`${brand.name} logó`} fill sizes="(max-width: 700px) 42vw, 16vw"/></span><span className="featured-brand-name">{brand.name}</span></Link>)}</div></div></section>
      <section className="about-section wrap" id="rolunk"><div className="about-visual"><div className="about-picture-box"><Image src="/images/rm-telephely-2026-10-21.png" alt="Az RM Hajdú Hungary telephelye Tépén" fill sizes="(max-width: 800px) 100vw, 44vw"/><span className="about-picture-caption">Telephelyünk · Tépe</span></div><div className="about-map-box"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3025.1210531934!2d21.56745307652962!3d47.321207107641484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4747019250d9e8d5%3A0xafa0e756a65ee69!2sRm%20Hajd%C3%BA%20Hungary%20Kft!5e1!3m2!1shu!2shu!4v1792588534397!5m2!1shu!2shu" title="RM Hajdú Hungary Kft. – Tépe térkép" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div></div><div className="about-story"><p className="eyebrow">{about?.title || 'Rólunk'}</p><h2>Az öntözéstechnikától a teljes gazdaságig</h2><div className="about-paragraphs">{aboutParagraphs.length ? aboutParagraphs.slice(0,3).map((paragraph,index)=><p key={index}>{paragraph}</p>) : <p>Az RM Hajdú Hungary mezőgazdasági gépek, öntözéstechnikai berendezések és kapcsolódó szolgáltatások forgalmazásával foglalkozik.</p>}</div><div className="about-person"><div className="about-person-photo"><Image src="/images/bartalis-levente-source.png" alt="Bartalis Levente" fill sizes="92px"/></div><div><strong>Bartalis Levente</strong><span>Ügyvezető</span></div></div><Link className="text-link" href="/rolunk">Részletes bemutatkozás</Link></div></section>
      <HomeCatalog categories={categories.docs.map(c=>({id:c.id,name:c.name,slug:c.slug,parent:typeof c.parent==='object'?c.parent?.id:c.parent}))} products={products.docs.map(p=>({id:p.id,name:p.name,slug:p.slug,href:productHref(p as any,categories.docs as any[],families.docs as any[]),brand:p.brand,summary:p.summary,image:p.image as any,category:p.category as any}))} families={families.docs.map(family => ({ id: family.id, name: family.name, slug: family.slug }))}/>
      <section className="service-panel wrap"><div className="service-photo">{servicePhoto?.url&&<Image src={servicePhoto.url} alt={servicePhoto.alt||''} fill sizes="(max-width: 800px) 100vw, 50vw" />}</div><div className="service-copy"><p className="eyebrow">Szolgáltatások</p><h2>{servicePage.docs[0]?.title}</h2><p>{servicePage.docs[0]?.content?.slice(0,240)}</p><Link className="button button-dark" href="/szolgaltatasok">Szolgáltatások</Link></div></section>
      <section className="contact-strip"><div className="wrap contact-inner"><h2>Kapcsolat</h2><Link className="button button-light" href="/kapcsolat">Kapcsolat</Link></div></section>
    </main>
}
