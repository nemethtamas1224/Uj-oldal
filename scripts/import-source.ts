import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const crawl=JSON.parse(await (await import('node:fs/promises')).readFile(path.join(root,'audit/site-crawl.json'),'utf8'))
const manifest=JSON.parse(await (await import('node:fs/promises')).readFile(path.join(root,'audit/asset-manifest.json'),'utf8'))
const payload=await getPayload({config})
const slugify=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)||'oldal'
const byUrl=new Map<string,any>((crawl.pages as any[]).map((p:any)=>[p.url,p]))
const rootPage:any=crawl.pages.find((p:any)=>p.url==='https://www.rmhungary.hu/')
const htmlPages:any[]=crawl.pages.filter((p:any)=>p.type?.includes('text/html')&&p.text)
const assets:any[]=manifest.assets.filter((a:any)=>a.status===200&&a.localPath)
const sourceMedia=new Map<string,any>()
const existingMedia=await payload.find({collection:'media',limit:500,depth:0,overrideAccess:true})
for(const doc of existingMedia.docs as any[])if(doc.sourceUrl)sourceMedia.set(doc.sourceUrl,doc)
let mediaAdded=0,mediaFailed=0
for(const asset of assets){
 if(sourceMedia.has(asset.url))continue
 const local=path.join(root,'public',asset.localPath.replace(/^\//,''))
 if(!existsSync(local)){mediaFailed++;continue}
 try{
  const doc=await payload.create({collection:'media',overrideAccess:true,data:{alt:asset.alt||path.basename(local),sourceUrl:asset.url,credit:'RM Hungary eredeti honlap'},filePath:local} as any)
  sourceMedia.set(asset.url,doc);mediaAdded++
 }catch(e){mediaFailed++;console.error('Media upload failed:',asset.url,String(e).slice(0,180))}
}
const localMedia=new Map<string,any>()
const localFiles=[
 ['logo','rm-logo.svg','RM Hajdú Hungary logó','local:rm-logo.svg'],
 ['hero','rm-reel-field.png','Öntöződobos berendezés szántóföldön','local:rm-reel-field.png'],
 ['reel','rm-reel-red.jpg','RM csévélődob','local:rm-reel-red.jpg'],
 ['boom','rm-boom.jpg','Öntözőkonzollal felszerelt csévélődob','local:rm-boom.jpg'],
 ['vodar','vodar-field.webp','VODAR öntözőrendszer szántóföldön','local:vodar-field.webp'],
 ['rovatti','rovatti-pump.jpg','Rovatti szivattyú','local:rovatti-pump.jpg'],
 ['pump','rm-motor-pump.jpeg','RM motoros szivattyú gépegység','local:rm-motor-pump.jpeg'],
 ['generator','starpower-generator.jpg','Starpower áramfejlesztő','local:starpower-generator.jpg'],
] as const
for(const [key,file,alt,sourceUrl] of localFiles){
 if(localMedia.has(key))continue
 const local=path.join(root,'public/images',file)
 if(!existsSync(local)){console.error('Missing local source asset',file);continue}
 const old=(existingMedia.docs as any[]).find((x:any)=>x.sourceUrl===sourceUrl)
 if(old){localMedia.set(key,old);continue}
 try{const doc=await payload.create({collection:'media',overrideAccess:true,data:{alt,sourceUrl,credit:'RM Hungary helyi eredeti képanyag'},filePath:local} as any);localMedia.set(key,doc);mediaAdded++}
 catch(e){mediaFailed++;console.error('Local media upload failed:',file,String(e).slice(0,180))}
}
for(const doc of existingMedia.docs as any[])if(doc.sourceUrl?.startsWith('local:')){const key=localFiles.find(x=>x[3]===doc.sourceUrl)?.[0];if(key)localMedia.set(key,doc)}
for(const a of assets){const m=sourceMedia.get(a.url);if(m)sourceMedia.set(a.url,m)}
const mediaForUrl=(url:string)=>sourceMedia.get(url)
const mediaBySourcePath=(url:string)=>{try{return mediaForUrl(new URL(url,'https://www.rmhungary.hu/').href)}catch{return undefined}}
const categoryById=new Map<string,any>()
const rootLinks=(rootPage?.links||[]).filter((l:any)=>l.attr==='href'&&l.url.includes('alkat='))
const groupRows=[
 {slug:'mezogazdasagi-ontozes-gepei',name:'MEZŐGAZDASÁGI ÖNTÖZÉS GÉPEI, BERENDEZÉSEI',ids:['10','48','37','11','13','14','15','16']},
 {slug:'dohanytermesztes-gepei',name:'Dohánytermesztés és gyógynövény szárítás speciális gépei: Da Ros, De Cloet, Mantovani, Oliveragro gyártmányok',ids:['9','5','44','8','7','6','38','39','40']},
 {slug:'arokaso-gepek',name:'Árokásó gépek',ids:['42']},
 {slug:'mezogazdasagi-iv-sator',name:'Mezőgazdasági ívsátor',ids:['47']},
 {slug:'hasznalt-gepek',name:'Használt gépek',ids:['43']},
]
const existingCats=await payload.find({collection:'categories',limit:200,depth:0,overrideAccess:true})
const catBySlug=new Map((existingCats.docs as any[]).map((x:any)=>[x.slug,x]))
let categoriesAdded=0
for(let i=0;i<groupRows.length;i++){
 const row=groupRows[i];let doc=catBySlug.get(row.slug)
 if(!doc){doc=await payload.create({collection:'categories',overrideAccess:true,data:{name:row.name,slug:row.slug,sortOrder:i*100,description:'',originalUrl:'https://www.rmhungary.hu/'}} as any);categoriesAdded++}
 catBySlug.set(row.slug,doc)
 for(const id of row.ids){
  const l=rootLinks.find((x:any)=>new URL(x.url).searchParams.get('alkat')===id)
  if(!l)continue
  const name=String(l.text||'').trim().replace(/\s+/g,' ');if(!name)continue
  const slug=slugify(name);let child=catBySlug.get(slug)
  const page:any=byUrl.get(l.url)
  const sourceImages=(page?.mainBlocks||[]).flatMap((b:any)=>b.images||[])
  const image=sourceImages.map((im:any)=>mediaBySourcePath(im.src)).find(Boolean)
  const data={name,slug,parent:doc.id,sortOrder:categoriesAdded+categoryById.size+1,originalUrl:l.url,image:image?.id}
  if(!child){child=await payload.create({collection:'categories',overrideAccess:true,data} as any);categoriesAdded++}
  else await payload.update({collection:'categories',id:child.id,overrideAccess:true,data} as any)
  catBySlug.set(slug,child);categoryById.set(id,{doc:child,name,slug,page,group:row.slug})
 }
}
let productsAdded=0
const localProductImage:Record<string,string>={'10':'hero','48':'boom','37':'reel','11':'vodar','14':'rovatti','15':'pump','16':'generator'}
for(const [id,entry] of categoryById){
 const page=entry.page;const block=(page?.mainBlocks||[]).find((b:any)=>b.kind==='termek_tar')
 const details=String(block?.text||'').replace(/\s+/g,' ').trim()
 const clean=details.replace(new RegExp('^'+entry.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),'').trim()
 const summary=clean.slice(0,360).trim()
 const brand=/^Rovatti/i.test(entry.name)?'Rovatti':/^Vodar/i.test(entry.name)?'Vodar':/^Giunti/i.test(entry.name)?'Giunti':/Starpower/i.test(entry.name)?'Starpower':/^RM mobil/i.test(entry.name)?'RM':undefined
 const image=localMedia.get(localProductImage[id]||'')|| (block?.images||[]).map((im:any)=>mediaBySourcePath(im.src)).find(Boolean)
 const gallery=(block?.images||[]).map((im:any)=>mediaBySourcePath(im.src)).filter(Boolean).map((m:any)=>m.id).filter((v:any,i:number,a:any[])=>a.indexOf(v)===i)
 const docs=assets.filter((a:any)=>a.url.toLowerCase().endsWith('.pdf')&&(a.pages||[]).includes(page?.url)).map((a:any)=>mediaForUrl(a.url)?.id).filter(Boolean)
 const data:any={name:entry.name,slug:entry.slug,brand,summary,sourceDetails:details,category:[entry.doc.id],image:image?.id,gallery,documents:docs,originalUrl:page?.url,legacyKey:id,sortOrder:Number(id),status:'published'}
 const exists=await payload.find({collection:'products',where:{slug:{equals:entry.slug}},limit:1,overrideAccess:true});
 if(exists.docs[0])await payload.update({collection:'products',id:(exists.docs[0] as any).id,overrideAccess:true,data} as any)
 else{await payload.create({collection:'products',overrideAccess:true,data} as any);productsAdded++}
}
const fixedPages=[
 {file:'rolunk.php',slug:'rolunk',title:'Rólunk',type:'page'},
 {file:'szolgaltatasok.php',slug:'szolgaltatasok',title:'Szolgáltatások',type:'page'},
 {file:'referenciak.php',slug:'referenciak',title:'Referenciák',type:'page'},
 {file:'hirek.php',slug:'hirek',title:'Hírek',type:'page'},
 {file:'palyazat.php',slug:'palyazat',title:'Pályázat',type:'page'},
 {file:'kapcsolat.php',slug:'kapcsolat',title:'Kapcsolat',type:'page'},
]
let pagesAdded=0
for(const item of fixedPages){
 const url=`https://www.rmhungary.hu/${item.file}`;const page:any=byUrl.get(url);if(!page)continue
 const content=(page.mainBlocks||[]).map((b:any)=>String(b.text||'').replace(/\s+/g,' ').trim()).filter(Boolean).join('\n\n')
 const data={title:item.title,slug:item.slug,pageType:item.type,content,sourceText:content,sourceHeadings:page.headings||[],sourceLinks:(page.links||[]).filter((l:any)=>l.attr==='href').map((l:any)=>({url:l.url,label:l.text||l.alt||''})),originalUrl:url,legacyKey:item.file,seoTitle:item.title,seoDescription:content.slice(0,300),status:'published'}
 const exists=await payload.find({collection:'pages',where:{slug:{equals:item.slug}},limit:1,overrideAccess:true})
 if(exists.docs[0])await payload.update({collection:'pages',id:(exists.docs[0] as any).id,overrideAccess:true,data} as any)
 else{await payload.create({collection:'pages',overrideAccess:true,data} as any);pagesAdded++}
}
const articlePage=(slug:string)=>htmlPages.find((p:any)=>p.url.endsWith('/'+slug+'.php'))
const addArticles=async(kind:'news'|'references',page:any)=>{
 if(!page)return 0
 const blocks=page.mainBlocks||[];const text=blocks.map((b:any)=>String(b.text||'')).join(' ')
 const titles=(page.headings||[]).filter((h:any)=>h.level==='h3'&&!['Termékeink','Elérhetőségek','Térkép'].includes(h.text)).map((h:any)=>String(h.text).trim())
 let added=0;let cursor=0
 for(let i=0;i<titles.length;i++){
  const title=titles[i];const at=text.indexOf(title,cursor);const end=titles.slice(i+1).map((t:string)=>text.indexOf(t,Math.max(at,0))).filter((n:number)=>n>at).sort((a:number,b:number)=>a-b)[0]??text.length
  const excerpt=at>=0?text.slice(at+title.length,end).replace(/\s+/g,' ').trim().slice(0,1800):''
  if(at>=0)cursor=at+title.length
  const slug=slugify(title);const image=blocks.flatMap((b:any)=>b.images||[]).map((im:any)=>mediaBySourcePath(im.src)).find(Boolean)
  const data:any=kind==='news'?{title,slug,excerpt,coverImage:image?.id,originalUrl:page.url,status:'published'}:{title,slug,summary:excerpt,gallery:blocks.flatMap((b:any)=>b.images||[]).map((im:any)=>mediaBySourcePath(im.src)).filter(Boolean).map((m:any)=>m.id).filter((v:any,n:number,a:any[])=>a.indexOf(v)===n),originalUrl:page.url,status:'published'}
  const old=await payload.find({collection:kind,where:{slug:{equals:slug}},limit:1,overrideAccess:true})
  if(old.docs[0])await payload.update({collection:kind,id:(old.docs[0] as any).id,overrideAccess:true,data} as any)
  else{await payload.create({collection:kind,overrideAccess:true,data} as any);added++}
 }
 return added
}
const newsAdded=await addArticles('news',articlePage('hirek'))
const referencesAdded=await addArticles('references',articlePage('referenciak'))
const assetByEnds=(part:string)=>assets.find((a:any)=>a.url.endsWith(part))
const legalPrivacy=assetByEnds('adatvedelmiadatkezelesiszab.pdf');const legalProcessing=assetByEnds('adatfeldolgozasiszerz.pdf')
const mapLink=(byUrl.get('https://www.rmhungary.hu/kapcsolat.php')?.links||[]).find((x:any)=>x.tag==='iframe'&&x.attr==='src'&&x.url.includes('google.com/maps/embed'))
const email='rmhajduhungary@gmail.com'
const nav=[{label:'Rólunk',href:'/rolunk'},{label:'Termékeink',href:'/termekek'},{label:'Szolgáltatások',href:'/szolgaltatasok'},{label:'Referenciák',href:'/referenciak'},{label:'Hírek',href:'/hirek'},{label:'Pályázat',href:'/palyazat'},{label:'Kapcsolat',href:'/kapcsolat'}]
const footer=[{label:'Termékeink',href:'/termekek'},...nav.slice(2),...(legalPrivacy?[{label:'ADATVÉDELMI ÉS ADATKEZELÉSI SZABÁLYZAT',href:new URL(legalPrivacy.url).pathname}]:[]),...(legalProcessing?[{label:'ADATFELDOLGOZÁSI MEGBÍZÁSI SZERZŐDÉS',href:new URL(legalProcessing.url).pathname}]:[])]
const settingsData:any={companyName:'RM Hajdú Hungary Kft.',address:'4132 Tépe, Rákóczi u. 8.',mailingAddress:'4132 Tépe, Fő u. 8.',phone:'+36 30/2780944',email,emailSourceUrl:'https://www.rmhungary.hu/index.php?alkat=47',seoTitle:'RM Hajdú Hungary',seoDescription:'Öntözőgépek, dohánytermesztés gépei, talajművelő gépek.',heroHeadline:'forgalmazott termékeink',heroSubhead:'Öntözőgépek, dohánytermesztés gépei, talajművelő gépek',heroImage:localMedia.get('hero')?.id,logo:localMedia.get('logo')?.id,serviceImage:localMedia.get('boom')?.id,mapEmbedUrl:mapLink?.url,navigation:nav,footerNavigation:footer}
await payload.updateGlobal({slug:'site-settings',overrideAccess:true,data:settingsData} as any)
console.log(JSON.stringify({sourcePages:htmlPages.length,categoriesAdded,productsAdded,pagesAdded,newsAdded,referencesAdded,mediaAdded,mediaFailed,totalDownloaded:assets.length,knownSourceFailures:crawl.failures},null,2))
await payload.destroy()
