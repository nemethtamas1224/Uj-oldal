#!/usr/bin/env python3
"""Read-only same-origin crawler and media inventory for RM Hungary."""
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, urldefrag
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor, as_completed
import json,re,time
BASE='https://www.rmhungary.hu/'; HOST='www.rmhungary.hu'
class Parser(HTMLParser):
 def __init__(self): super().__init__(); self.links=[]; self.title=''; self.headings=[]; self._title=False; self._heading=None; self._link=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='title': self._title=True
  if tag in ('h1','h2','h3','h4'): self._heading=[tag,'']
  if tag=='a' and a.get('href'): self._link={'tag':tag,'attr':'href','value':a['href'],'alt':a.get('title',''),'text':''}
  for k in ('src','data-src'):
   if a.get(k): self.links.append({'tag':tag,'attr':k,'value':a[k],'alt':a.get('alt',''),'text':''})
  if a.get('srcset'):
   for candidate in a['srcset'].split(','):
    value=candidate.strip().split()[0] if candidate.strip() else ''
    if value: self.links.append({'tag':tag,'attr':'srcset','value':value,'alt':a.get('alt',''),'text':''})
 def handle_endtag(self,tag):
  if tag=='title': self._title=False
  if tag=='a' and self._link:
   self.links.append(self._link); self._link=None
  if self._heading and tag==self._heading[0]: self.headings.append({'level':tag,'text':re.sub(r'\s+',' ',self._heading[1]).strip()}); self._heading=None
 def handle_data(self,d):
  if self._title: self.title+=d
  if self._heading: self._heading[1]+=d
  if self._link: self._link['text']+=d

def norm(u):
 u=urldefrag(u)[0]; p=urlsplit(u)
 if p.scheme not in ('http','https') or p.hostname not in (HOST,'rmhungary.hu'): return None
 path=p.path or '/'; return f'https://{HOST}{path}'+(('?'+p.query) if p.query else '')
def fetch(u):
 try:
  with urlopen(Request(u,headers={'User-Agent':'Mozilla/5.0 (compatible; RM-Hungary-content-audit/1.0)'}),timeout=20) as r:
   ct=r.headers.get('Content-Type',''); body=r.read(6_000_000)
   if 'text/html' not in ct: return {'url':u,'status':r.status,'type':ct,'bytes':len(body),'links':[]}
   html=body.decode(r.headers.get_content_charset() or 'utf-8','replace'); pa=Parser(); pa.feed(html)
   text=re.sub(r'<[^>]+>',' ',html); text=re.sub(r'\s+',' ',text)
   links=[]
   for l in pa.links:
    target=norm(urljoin(u,l['value']))
    if target: links.append({**l,'url':target})
   return {'url':u,'status':r.status,'type':ct,'bytes':len(body),'title':re.sub(r'\s+',' ',pa.title).strip(),'headings':pa.headings,'links':links,'text':text[:100_000]}
 except Exception as e: return {'url':u,'error':repr(e),'links':[]}
def main():
 seen=set(); queue=[BASE]; records=[]
 while queue and len(seen)<600:
  batch=[]
  while queue and len(batch)<20 and len(seen)<600:
   u=queue.pop(0)
   if u not in seen: seen.add(u); batch.append(u)
  with ThreadPoolExecutor(max_workers=6) as ex:
   for f in as_completed([ex.submit(fetch,u) for u in batch]):
    r=f.result(); records.append(r)
    for l in r.get('links',[]):
     u=l['url']; path=urlsplit(u).path.lower()
     is_asset=bool(re.search(r'\.(?:css|js|jpg|jpeg|png|gif|webp|svg|pdf|docx?|xlsx?|zip|mp4|webm|woff2?)$',path))
     if not is_asset and u not in seen and u not in queue: queue.append(u)
  print(f'visited {len(seen)}; queued {len(queue)}'); time.sleep(.1)
 assets={}
 for p in records:
  for l in p.get('links',[]):
   if re.search(r'\.(?:jpg|jpeg|png|gif|webp|svg|pdf|docx?|xlsx?|zip|mp4|webm|woff2?)$',urlsplit(l['url']).path.lower()):
    assets.setdefault(l['url'],{'url':l['url'],'alt':l.get('alt',''),'pages':[]})['pages'].append(p['url'])
 out={'base':BASE,'pages':records,'pageCount':sum('text' in x for x in records),'assetCount':len(assets),'assets':list(assets.values()),'failures':[{'url':x['url'],'error':x.get('error')} for x in records if x.get('error')]}
 with open('work/rm-hungary-website/audit/site-crawl.json','w') as f: json.dump(out,f,ensure_ascii=False,indent=2)
 print('saved',len(records),'records; html',out['pageCount'],'unique assets',len(assets),'failures',len(out['failures']))
if __name__=='__main__': main()
