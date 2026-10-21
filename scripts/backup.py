#!/usr/bin/env python3
"""Create a consistent SQLite or PostgreSQL database plus media backup."""
from pathlib import Path
from urllib.parse import urlparse,parse_qs,unquote
from datetime import datetime
import os,sqlite3,subprocess,tempfile,zipfile,json,shutil,sys
root=Path(__file__).resolve().parent.parent
# Match the local app environment without ever echoing secret values.
env_file=root/'.env.local'
if env_file.exists():
 for line in env_file.read_text().splitlines():
  if '=' in line and not line.lstrip().startswith('#'):
   key,value=line.split('=',1);os.environ.setdefault(key.strip(),value.strip().strip('"').strip("'"))
adapter=os.getenv('DATABASE_ADAPTER','sqlite')
database_url=os.getenv('DATABASE_URL','file:./data/rm-hungary.db')
stamp=datetime.now().strftime('%Y%m%d-%H%M%S')
backup_dir=root/'backups';backup_dir.mkdir(exist_ok=True)
out=backup_dir/f'rm-hungary-{stamp}.zip'
with tempfile.TemporaryDirectory(prefix='rm-hungary-backup-') as temp:
 temp=Path(temp)
 if adapter=='postgres':
  pg_dump=shutil.which('pg_dump')
  if not pg_dump:sys.exit('PostgreSQL backup needs pg_dump in PATH.')
  u=urlparse(database_url)
  if u.scheme not in ('postgres','postgresql'):sys.exit('DATABASE_URL must be a PostgreSQL connection URL.')
  dump=temp/'database.dump'
  child_env=os.environ.copy();child_env['PGHOST']=u.hostname or '';child_env['PGPORT']=str(u.port or 5432);child_env['PGUSER']=unquote(u.username or '');child_env['PGPASSWORD']=unquote(u.password or '')
  params=parse_qs(u.query)
  if params.get('sslmode'):child_env['PGSSLMODE']=params['sslmode'][0]
  subprocess.run([pg_dump,'--format=custom','--no-owner','--file',str(dump),'--dbname',unquote(u.path.lstrip('/'))],env=child_env,check=True)
  dbname='database.dump'
 elif adapter=='sqlite':
  filename=database_url.split('?',1)[0]
  if filename.startswith('file:'):filename=filename[5:]
  db=root/filename
  if not db.exists():sys.exit('SQLite database is not present yet.')
  snapshot=temp/'database.sqlite'
  with sqlite3.connect(db) as src,sqlite3.connect(snapshot) as dst:src.backup(dst)
  dbname='database.sqlite'
 else:sys.exit('Unknown DATABASE_ADAPTER. Expected sqlite or postgres.')
 media=root/'public/uploads'
 manifest={'createdAt':datetime.now().astimezone().isoformat(timespec='seconds'),'adapter':adapter,'databaseFile':dbname,'mediaFiles':sum(1 for p in media.rglob('*') if p.is_file()) if media.exists() else 0}
 with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  z.write(temp/dbname,dbname)
  if media.exists():
   for file in media.rglob('*'):
    if file.is_file():z.write(file,file.relative_to(root))
  z.writestr('backup-manifest.json',json.dumps(manifest,indent=2))
print(out)
