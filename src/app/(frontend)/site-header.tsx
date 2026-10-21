'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { categoryHref } from '@/lib/catalog'

type Category = { id: number | string; name: string; slug: string; parent?: number | string | { id: number | string } | null }
type NavItem = { label: string; href: string }
type Media = { url?: string | null; alt?: string | null } | number | null

export default function SiteHeader({ companyName, phone, email, logo, navigation, categories }: { companyName: string; phone?: string | null; email?: string | null; logo: Media; navigation: NavItem[]; categories: Category[] }) {
 const [searchOpen, setSearchOpen] = useState(false)
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
 const roots = categories.filter(category => !category.parent)
 const children = categories.filter(category => Boolean(category.parent))
 const parentId = (category: Category) => String(typeof category.parent === 'object' ? category.parent?.id : category.parent)
 return <>
  <header className="topbar"><div className="wrap topbar-inner"><div className="topbar-note">{companyName}</div><div className="topbar-contact">{phone&&<a href={`tel:${String(phone).replaceAll(' ','')}`}>{phone}</a>}{email&&<a href={`mailto:${email}`}>{email}</a>}</div></div></header>
  <header className="header wrap"><Link href="/" aria-label="RM Hajdú Hungary főoldal" className="brand">{logo&&typeof logo==='object'&&logo.url?<Image src={logo.url} alt={logo.alt||''} width={202} height={68} priority/>:<span>{companyName}</span>}</Link>
   <button className="mobile-menu-toggle" aria-label="Menü" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
   <nav className={`nav ${mobileMenuOpen?'nav-open':''}`} aria-label="Fő navigáció">{navigation.map((item,i)=>{
    if(['termékeink','termékek'].includes(item.label.toLocaleLowerCase('hu'))) return <div className="nav-item has-dropdown" key={`${item.href}-${i}`}><Link href="/termekek" className="nav-trigger">{item.label}</Link><div className="nav-dropdown"><div className="dropdown-grid">{roots.map(root=><div className="dropdown-group" key={root.id}><Link className="dropdown-title" href={categoryHref(root,categories)}>{root.name}</Link>{children.filter(child=>parentId(child)===String(root.id)).map(child=><Link href={categoryHref(child,categories)} key={child.id}>{child.name}</Link>)}</div>)}</div></div></div>
    if(item.label.toLocaleLowerCase('hu')==='rólunk') return <div className="nav-item has-dropdown" key={`${item.href}-${i}`}><Link className="nav-trigger" href="/#rolunk">Rólunk</Link><div className="nav-dropdown small-dropdown"><Link href="/#rolunk">Bemutatkozás</Link><Link href="/#termekek">Termékkategóriák</Link><Link href="/szolgaltatasok">Szolgáltatásaink</Link></div></div>
    return <div className="nav-item" key={`${item.href}-${i}`}><Link href={item.href}>{item.label}</Link></div>
   })}</nav>
   <form className={`site-search ${searchOpen?'search-open':''}`} action="/kereses"><label className="sr-only" htmlFor="site-search-input">Keresés</label><input id="site-search-input" name="q" placeholder="Keresés..." tabIndex={searchOpen?0:-1} aria-hidden={!searchOpen}/><button aria-label={searchOpen?'Keresés indítása':'Kereső megnyitása'} type={searchOpen?'submit':'button'} onClick={event=>{if(!searchOpen){event.preventDefault();setSearchOpen(true);requestAnimationFrame(()=>document.getElementById('site-search-input')?.focus())}}}>⌕</button></form>
  </header>
 </>
}
