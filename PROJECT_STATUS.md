# RM Hungary website rebuild — status (2026-10-21)

- **Goal:** Rebuild the Hungarian RM website and migrate its full product catalog into editable records without losing the original content. Production remains untouched.
- **Workspace:** `work/rm-hungary-website/`. The parent project's `sources/` mirror and `/Users/nemethtamas/Projects/RM/` remain read-only.
- **Source and audit:** User-approved taxonomy in `audit/catalog-structure-user-2026-10-21.md`; original crawl in `audit/site-crawl.json`; itemized migration in `audit/catalog-migration-report.md`. A recoverable database backup was made before migration under `backups/`.
- **Catalog:** 7 root categories, 35 subcategories, 11 manufacturers, 14 families, 90 new product records, 20 legacy URL mappings. The original 25 category and 20 product records are preserved. Sixteen new records remain draft pending source verification; 41 new records have source-matched images. All 20 old category pages retain their source text, available image galleries and documents in noindex source-archive routes.
- **Frontend:** Nested category → family → model routes, manufacturer and used-machine pages, category navigation, search, sitemap, legacy redirects and an inquiry form. Homepage About scroll, CMS category selector/carousel, animated hover menu and click-open search remain in place. Brand colors: `#C5212E`, `#FBD809`, accent `#529A62`, white.
- **Inquiry handling:** Valid requests save into the authenticated Payload `inquiries` collection; anonymous API reads return 403. A synthetic local request was saved and then deleted. There is no configured email notification or external delivery.
- **Verified:** Production build succeeds. All 35 subcategory, 14 family, 74 published model, 11 manufacturer and 20 source-archive pages returned 200 locally; the main pages and inquiry route did too. All 20 old `index.php?alkat=` keys have local 301 mappings. The report found only two unavailable original images (`540-gx_1_2.png`, `1000gx_1_1.png`). The production-mode local preview is running at `http://127.0.0.1:3000`.
- **Open:** Model specifications, some image-to-model links, and documents need editorial verification before production. No verified individual used-machine listings exist. Hosting, SMTP, production credentials and publication approval remain outstanding. First admin user must be created by the site owner; no credentials are stored here.
- **Next:** Review the 16 draft models and `specs-missing` records against manufacturer documents; supply verified used-machine listings; configure notification/delivery and hosting; complete editorial and legal review before any production release.

## Homepage design update (2026-10-21)

- The catalog selector now starts with only the seven icon-and-text root cards. Selecting one reveals its subcategories; selecting a subcategory reveals only its own product carousel. This was inspected in the local browser in mobile view.
- The hero includes five linked, source-transparent logo cards: RM, Rovatti, Starpower, Giunti and De Cloet. The About section uses the user-supplied Tépe site photo in a floating frame, three structured introductory paragraphs from the CMS, and Bartalis Levente's portrait from the original RM website. The full text stays on `/rolunk`.
- The homepage Contact strip uses yellow `#FBD809` and a red button. Both assets added for this change are in `public/images/`.

## RM hose reel size catalog (2026-10-21)

- User-provided catalog imported under Products → Öntözőgépek és öntözőrendszerek → RM csévélődobok → GX, XJ, Magnum, XJM. The original category slug stays stable; the former large-machine family route redirects to Magnum.
- There are 23 published model records with 234 individually editable `hoseSizes` rows (9/97, 6/86, 3/23, 5/28 by family). Two models were added, 21 updated, three older nonmatching records archived and retained. Images and source relations were preserved.
- The public model page shows a floating size panel with mm/m legend and a catalog-only availability caveat. Source is the user's table in this chat, stored in `scripts/rm-hose-size-data.ts`, not an independently verified current factory availability list.
- SQLite/media backup: `backups/rm-hungary-20261021-150414.zip`. Types and production build were generated successfully. The local preview is running at `http://127.0.0.1:3000`; production is unchanged.

## Homepage adjustment (2026-10-21)

- The seven root choices and progressive subcategory selector remain on the homepage. Only the RM csévélődobok selection now reveals four linked series cards (GX, XJ, Magnum/FX, XJM) instead of the 23-model carousel; other subcategories retain their carousel.
- The user-provided Google Maps embed sits beneath the site photo inside the same floating white-card treatment. Public buttons and linked cards have no decorative arrow glyphs; carousel controls use words.
- Production build completed successfully. No production deployment.
