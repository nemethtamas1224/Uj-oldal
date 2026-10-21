import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import SiteHeader from './site-header'

type MediaRef = {url?:string|null;alt?:string|null}|number|string|null|undefined
const media=(v:MediaRef):v is {url?:string|null;alt?:string|null}=>Boolean(v&&typeof v==='object')
export const dynamic='force-dynamic'
export default async function FrontendLayout({children}:{children:React.ReactNode}){
 const payload=await getPayload({config}); const [settings,categories]=await Promise.all([payload.findGlobal({slug:'site-settings',depth:1}),payload.find({collection:'categories',where:{catalogRole:{equals:'catalog'}},limit:100,sort:'sortOrder',depth:0})])
 const logo=media(settings.logo)?settings.logo:null
 const nav=settings.navigation||[]; const footer=settings.footerNavigation||[]
 return <>
  <SiteHeader companyName={settings.companyName||'RM Hajdú Hungary'} phone={settings.phone} email={settings.email} logo={settings.logo as any} navigation={nav} categories={categories.docs.map(c=>({id:c.id,name:c.name,slug:c.slug,parent:typeof c.parent==='object'?c.parent?.id:c.parent}))}/>
  {children}
  <footer className="footer"><div className="wrap footer-grid"><div>{logo?.url&&<Image src={logo.url} alt={logo.alt||''} width={185} height={62}/>}<p>{settings.companyName}<br/>{settings.address}</p></div><div><b>Termékeink</b>{footer.map((item,i)=><Link href={item.href} key={`${item.href}-${i}`}>{item.label}</Link>)}</div><div><b>Kapcsolat</b>{settings.email&&<a href={`mailto:${settings.email}`}>{settings.email}</a>}<a href={`tel:${String(settings.phone||'').replaceAll(' ','')}`}>{settings.phone}</a><span>{settings.mailingAddress}</span></div></div><div className="wrap footer-bottom"><span>{settings.companyName}</span><Link href="/admin">Adminisztráció</Link></div></footer>
 </>
}
