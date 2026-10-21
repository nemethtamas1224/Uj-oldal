from html.parser import HTMLParser
from urllib.request import Request,urlopen
from urllib.parse import urlsplit
import json,re,time
BASE='https://www.rmhungary.hu/'
TARGETS=('termek_tar','rolunk_cont','szolgaltatasok_szoveg','ref_tar','hir_tar','elerhetosegek_cont')
class Extract(HTMLParser):
 def __init__(self):
  super().__init__(); self.blocks=[]; self.active=[]; self.heading=None; self.headings=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs); cls=a.get('class','')
  if tag in ('h1','h2','h3','h4'): self.heading=[tag,'']
  kind=next((k for k in TARGETS if k in cls.split()),None)
  if kind:
   b={'kind':kind,'text':'','images':[],'_depth':1}; self.blocks.append(b); self.active.append(b)
  else:
   for b in self.active: b['_depth']+=1
  for b in self.active:
   if tag=='img' and a.get('src'): b['images'].append({'src':a['src'],'alt':a.get('alt','')})
 def handle_endtag(self,tag):
  if self.heading and tag==self.heading[0]:
   self.headings.append({'level':self.heading[0],'text':re.sub(r'\s+',' ',self.heading[1]).strip()}); self.heading=None
  for b in list(self.active):
   b['_depth']-=1
   if b['_depth']<=0: self.active.remove(b)
 def handle_data(self,d):
  if self.heading: self.heading[1]+=d
  for b in self.active: b['text']+=d

def main():
 p='audit/site-crawl.json'; data=json.load(open(p)); pages=[x for x in data['pages'] if x.get('type','').startswith('text/html')]
 for i,x in enumerate(pages,1):
  try:
   r=urlopen(Request(x['url'],headers={'User-Agent':'Mozilla/5.0'}),timeout=20)
   s=r.read(6_000_000).decode(r.headers.get_content_charset() or 'utf-8','replace')
   q=Extract();q.feed(s)
   for b in q.blocks: del b['_depth']
   x['mainBlocks']=[{**b,'text':re.sub(r'\s+',' ',b['text']).strip()} for b in q.blocks]
   x['headings']=q.headings
   print(f'{i}/{len(pages)} {x["url"]} {len(q.blocks)} content blocks')
  except Exception as e: x['extractError']=repr(e)
  time.sleep(.08)
 data['mainContentCoverage']=sum(bool(x.get('mainBlocks')) for x in pages)
 json.dump(data,open(p,'w'),ensure_ascii=False,indent=2)
 print('content block pages',data['mainContentCoverage'],'/',len(pages))
if __name__=='__main__':main()
