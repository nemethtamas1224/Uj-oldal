'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Media = { url?: string | null; alt?: string | null } | number | null
type Category = { id: number | string; name: string; slug: string; parent?: number | string | { id: number | string } | null }
type Product = { id: number | string; name: string; slug: string; href: string; brand?: string | null; summary?: string | null; image?: Media; category?: (number | { id: number | string })[] | null }
type Family = { id: number | string; name: string; slug: string }

const reelSeries = [
  { slug: 'rm-gx', code: 'GX', detail: '9 típus' },
  { slug: 'rm-xj', code: 'XJ', detail: '6 típus' },
  { slug: 'rm-magnum', code: 'Magnum / FX', detail: '3 típus' },
  { slug: 'rm-xjm', code: 'XJM', detail: '5 típus' },
]

function CategoryIcon({ slug }: { slug: string }) {
  const shared = { width: 52, height: 52, viewBox: '0 0 64 64', fill: 'none', stroke: 'currentColor', strokeWidth: 2.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  switch (slug) {
    case 'ontozogepek': return <svg {...shared}><path d="M9 48h46M19 48V31h26v17M32 31V14M20 24c2-6 6-9 12-10 6 1 10 4 12 10M12 27l-3 6m43-6 3 6M23 39h18"/><circle cx="19" cy="49" r="4"/><circle cx="45" cy="49" r="4"/></svg>
    case 'szivattyuk': return <svg {...shared}><path d="M8 38h13m22 0h13M17 30v16m30-16v16M21 25h22v26H21zM32 25v-9h13M21 38c0-6 5-11 11-11s11 5 11 11-5 11-11 11-11-5-11-11Z"/><path d="m30 32 7 6-7 6"/></svg>
    case 'energiaellatas': return <svg {...shared}><path d="M36 7 18 35h13l-3 22 18-30H33l3-20Z"/><path d="M11 52h10m26 0h6"/></svg>
    case 'ontozesi-tartozekok': return <svg {...shared}><path d="M10 20h18v12H10zM36 32h18v12H36zM28 26h8v12M12 45h15m-7-7v15M44 13c0 5-5 9-5 13a5 5 0 0 0 10 0c0-4-5-8-5-13Z"/></svg>
    case 'dohanytermesztes': return <svg {...shared}><path d="M32 55V24M32 37C19 36 15 26 16 15c12 0 19 6 16 22ZM32 44c13-1 18-10 17-21-12 0-19 6-17 21ZM23 55h18"/><path d="M23 24c3 2 6 5 9 11m9-2-9 10"/></svg>
    case 'arokaso': return <svg {...shared}><path d="M7 49h51M15 44h27l5-9-10-4-8 8H15zM21 28h17l8 8M33 29V14h9l8 10-6 5M42 14l4-5"/><circle cx="20" cy="49" r="4"/><circle cx="40" cy="49" r="4"/></svg>
    default: return <svg {...shared}><path d="M7 52h50M12 52V28l20-15 20 15v24M20 52V35h24v17M12 29h40M25 35v17m14-17v17"/></svg>
  }
}

export default function HomeCatalog({ categories, products, families }: { categories: Category[]; products: Product[]; families: Family[] }) {
  const groups = categories.filter(category => !category.parent)
  const children = categories.filter(category => Boolean(category.parent))
  const [groupId, setGroupId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [offset, setOffset] = useState(0)
  const activeGroup = groups.find(group => String(group.id) === groupId)
  const activeChildren = children.filter(category => String(typeof category.parent === 'object' ? category.parent?.id : category.parent) === groupId)
  const chosenCategory = activeChildren.find(category => String(category.id) === categoryId)
  const items = useMemo(() => chosenCategory ? products.filter(product =>
    (product.category || []).some(value => String(typeof value === 'object' ? value.id : value) === String(chosenCategory.id))
  ) : [], [products, chosenCategory])
  const visible = items.length ? Array.from({ length: Math.min(3, items.length) }, (_, index) => items[(offset + index) % items.length]) : []
  const availableReelSeries = reelSeries.flatMap(series => {
    const family = families.find(item => item.slug === series.slug)
    return family ? [{ ...series, family }] : []
  })
  const selectGroup = (id: string) => { setGroupId(current => current === id ? '' : id); setCategoryId(''); setOffset(0) }
  useEffect(() => {
    if (!groupId) return
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    document.getElementById('home-subcategories')?.scrollIntoView({ behavior, block: 'start' })
  }, [groupId])
  useEffect(() => {
    if (!categoryId) return
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    document.getElementById('home-selected-products')?.scrollIntoView({ behavior, block: 'start' })
  }, [categoryId])

  return <section className="home-products section" id="termekek">
    <div className="wrap">
      <div className="section-heading"><div><p className="eyebrow">Termékkatalógus</p><h2>Válasszon termékkategóriát</h2><p className="catalog-intro">Először válasszon főkategóriát, majd alkategóriát a termékek megtekintéséhez.</p></div><Link className="text-link" href="/termekek">Teljes katalógus</Link></div>
      <div className="category-choice-grid" aria-label="Termékfőkategóriák">{groups.map(group => {
        const active = String(group.id) === groupId
        return <button className={`category-choice${active ? ' active' : ''}`} key={group.id} onClick={() => selectGroup(String(group.id))} aria-expanded={active} type="button"><span className="category-choice-icon"><CategoryIcon slug={group.slug}/></span><span className="category-choice-name">{group.name}</span></button>
      })}</div>
      {activeGroup && <div className="home-subcategory-panel" id="home-subcategories"><div className="subcategory-panel-head"><div><p className="eyebrow">{activeGroup.name}</p><h3>Melyik típust keresi?</h3></div><Link href={`/termekek/${activeGroup.slug}`}>Összes alkategória</Link></div><div className="subcategory-choice-grid" aria-label="Alkategóriák">{activeChildren.map(category => <button className={String(category.id) === categoryId ? 'active' : ''} key={category.id} onClick={() => { setCategoryId(String(category.id)); setOffset(0) }} type="button" aria-pressed={String(category.id) === categoryId}><span>{category.name}</span></button>)}</div></div>}
      {chosenCategory && <div className="selected-products" id="home-selected-products"><div className="selected-products-heading"><div><p className="eyebrow">Kiválasztott alkategória</p><h3>{chosenCategory.name}</h3></div>{activeGroup && <Link className="text-link" href={`/termekek/${activeGroup.slug}/${chosenCategory.slug}`}>Alkategória megnyitása</Link>}</div>
        {chosenCategory.slug === 'csevelodobos' ? <div className="reel-series-grid" aria-label="RM csévélődob sorozatok">{availableReelSeries.map(({ slug, code, detail, family }, index) => <Link className="reel-series-card" href={`/termekek/ontozogepek/csevelodobos/${slug}`} key={family.id}><span className="reel-series-index">{String(index + 1).padStart(2, '0')}</span><span className="reel-series-monogram" aria-hidden="true">RM</span><strong>{code}</strong><span className="reel-series-count">{detail}</span></Link>)}</div>
        : visible.length ? <div className="catalog-showcase"><button className="slide-arrow" aria-label="Előző termékek" onClick={() => setOffset((offset + items.length - 1) % items.length)}>Előző</button><div className="showcase-track">{visible.map((product, index) => { const image = product.image && typeof product.image === 'object' ? product.image : null; return <Link className="showcase-card" href={product.href} key={`${product.id}-${index}`}><div className="showcase-image">{image?.url && <Image src={image.url} alt={image.alt || product.name} fill sizes="(max-width: 700px) 80vw, 28vw"/>}</div><span>{product.brand || 'RM Hajdú Hungary'}</span><h3>{product.name}</h3>{product.summary && <p>{product.summary}</p>}</Link> })}</div><button className="slide-arrow" aria-label="Következő termékek" onClick={() => setOffset((offset + 1) % items.length)}>Következő</button></div>
        : <div className="catalog-empty"><p>Ebben az alkategóriában még nincsenek ellenőrzött, közzétett termékek.</p><Link href={`/termekek/${activeGroup?.slug}/${chosenCategory.slug}`}>Alkategória megnyitása</Link></div>}
      </div>}
    </div>
  </section>
}
