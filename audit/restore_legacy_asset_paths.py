from pathlib import Path
from urllib.parse import urlsplit
from collections import defaultdict
from shutil import copy2
import hashlib,json
root=Path(__file__).resolve().parent.parent
manifest=json.load(open(root/'audit/asset-manifest.json'))
groups=defaultdict(list)
for a in manifest['assets']:
 if a.get('status')!=200 or not a.get('localPath'):continue
 original=Path(root/'public'/a['localPath'].lstrip('/'))
 target=Path(root/'public'/urlsplit(a['url']).path.lstrip('/'))
 if original.exists():groups[target].append((original,a['url']))
conflicts=[];copied=0
for target,items in groups.items():
 hashes={hashlib.sha256(src.read_bytes()).hexdigest() for src,_ in items}
 if len(hashes)>1:conflicts.append({'path':'/'+str(target.relative_to(root/'public')),'urls':[u for _,u in items]})
 target.parent.mkdir(parents=True,exist_ok=True)
 source=max(items,key=lambda x:x[0].stat().st_size)[0]
 if not target.exists():copy2(source,target);copied+=1
json.dump({'copied':copied,'conflicts':conflicts},open(root/'audit/legacy-asset-paths.json','w'),ensure_ascii=False,indent=2)
print('copied',copied,'legacy asset URLs; path conflicts',len(conflicts))
for item in conflicts:print(item['path'],*item['urls'],sep='\n  ')
