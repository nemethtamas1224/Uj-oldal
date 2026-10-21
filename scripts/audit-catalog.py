"""Report source-to-CMS preservation for the 20 legacy catalog pages."""
import json
import sqlite3
from pathlib import Path
from urllib.parse import urljoin

root = Path(__file__).resolve().parent.parent
crawl = json.loads((root / 'audit/site-crawl.json').read_text())
db = sqlite3.connect(root / 'data/rm-hungary.db')
db.row_factory = sqlite3.Row
pages = {p['url']: p for p in crawl['pages']}
media_urls = {r['source_url'] for r in db.execute('select source_url from media')}
mappings = list(db.execute('select * from legacy_mappings order by cast(legacy_key as integer)'))
assert len(mappings) == 20, f'Expected 20 mappings, found {len(mappings)}'
lines = [
    '# RM Hungary katalógusmigráció – ellenőrzési jegyzőkönyv',
    '',
    'Forrás: az eredeti RM honlap helyi mentése (`site-crawl.json`) és a helyi Payload CMS.',
    'A táblázat az eredeti 20 termékoldal megőrzését méri; a modell–kép és műszakiadat megfeleltetés külön ellenőrizendő.',
    '',
    '| Régi oldal | Új cél | Forrásképek | Mentett képek | CMS galéria | Dokumentumok | Szöveg |',
    '|---|---|---:|---:|---:|---:|---:|',
]
missing = []
for mapping in mappings:
    key = mapping['legacy_key']
    url = mapping['source_url']
    page = pages.get(url)
    assert page, f'Missing crawl page {url}'
    images = {urljoin(url, img['src']) for block in page['mainBlocks'] for img in block.get('images', [])}
    saved = images & media_urls
    absent = sorted(images - media_urls)
    missing.extend((key, image) for image in absent)
    product = db.execute('select id,source_details from products where legacy_key=?', (key,)).fetchone()
    assert product, f'Missing old product {key}'
    relations = dict(db.execute("select path,count(*) from products_rels where parent_id=? and path in ('gallery','documents') group by path", (product['id'],)))
    text_len = len(product['source_details'] or '')
    lines.append(f"| [{key}]({url}) | `{mapping['target_path']}` | {len(images)} | {len(saved)} | {relations.get('gallery',0)} | {relations.get('documents',0)} | {'igen' if text_len else 'nincs'} |")
category_count = db.execute("select count(*) from categories where catalog_role='catalog'").fetchone()[0]
product_count = db.execute("select count(*) from products where product_kind!='legacy'").fetchone()[0]
pictured_count = db.execute("select count(*) from products where product_kind!='legacy' and image_id is not null").fetchone()[0]
draft_count = db.execute("select count(*) from products where product_kind!='legacy' and status='draft'").fetchone()[0]
lines.extend([
    '',
    f"- Régi oldalak: **{len(mappings)}**; forráskép-hiányok: **{len(missing)}**.",
    f'- Új kategóriák: **{category_count}** (7 fő- és 35 alkategória).',
    f'- Új termékrekordok: **{product_count}**; képhez kötött: **{pictured_count}**.',
    f'- Tervezet, forrásellenőrzésre váró termékek: **{draft_count}**.',
    '',
    '## Hiányzó forrásképek',
    '',
])
lines.extend(f'- `{key}`: {url}' for key, url in missing)
lines.extend([
    '',
    '## Nyitott tartalmi ellenőrzések',
    '',
    '- A publikus helyi modellek műszaki adatlapjai többnyire hiányoznak; a CMS ezt `specs-missing` státusszal jelöli.',
    '- Az eredeti 20 oldal szövege, mentett képei és dokumentumai külön, keresőből kizárt forrásoldalon megmaradnak.',
    '- Egyes modellnevek csak fájlnévből vagy a felhasználó struktúrajavaslatából származnak; ezek tervezetként maradnak.',
    '- A használt gépeknél nincs ellenőrzött, egyedi eladó gép; a korábbi gyűjtőoldal archívuma elérhető.',
    '- Éles közzététel előtt modelladatok, képmegfeleltetés, termékdokumentumok, jogi és elérhetőségi adatok szerkesztői ellenőrzése szükséges.',
    '',
])
(root / 'audit/catalog-migration-report.md').write_text('\n'.join(lines))
print(f'{len(mappings)} old pages; {len(missing)} unsaved source images')
