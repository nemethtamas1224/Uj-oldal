from urllib.request import Request,urlopen
from urllib.parse import urlsplit
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
import hashlib,json,mimetypes
D=Path(__file__).resolve().parent.parent
crawl=json.load(open(D/'audit/site-crawl.json'))
out=D/'public/source-media';out.mkdir(parents=True,exist_ok=True)
def get(a):
 url=a['url']; name=Path(urlsplit(url).path).name or 'asset'
 ext=Path(name).suffix.lower() or mimetypes.guess_extension('application/octet-stream') or '.bin'
 short=hashlib.sha1(url.encode()).hexdigest()[:12]
 dest=out/(short+'-'+name)
 if dest.exists() and dest.stat().st_size:
  return {**a,'status':200,'contentType':'cached','bytes':dest.stat().st_size,'localPath':'/source-media/'+dest.name}
 try:
  req=Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; RM-Hungary-content-audit/1.0)','Referer':'https://www.rmhungary.hu/'})
  with urlopen(req,timeout=30) as r:
   body=r.read(25_000_001); ct=r.headers.get('Content-Type','')
   if len(body)>25_000_000: return {**a,'status':'too_large','contentType':ct,'bytes':len(body)}
   if r.status!=200: return {**a,'status':r.status,'contentType':ct}
   dest.write_bytes(body)
   return {**a,'status':200,'contentType':ct,'bytes':len(body),'localPath':'/source-media/'+dest.name}
 except Exception as e: return {**a,'status':'error','error':repr(e)}
res=[]
with ThreadPoolExecutor(max_workers=8) as ex:
 for f in as_completed([ex.submit(get,a) for a in crawl['assets']]): res.append(f.result())
res.sort(key=lambda x:x['url'])
json.dump({'source':'https://www.rmhungary.hu/','assets':res,'downloaded':sum(x.get('status')==200 for x in res)},open(D/'audit/asset-manifest.json','w'),ensure_ascii=False,indent=2)
print('downloaded',sum(x.get('status')==200 for x in res),'/',len(res),'failures',sum(x.get('status')!=200 for x in res))
for x in res:
 if x.get('status')!=200: print(x['status'],x['url'],x.get('error',''))
