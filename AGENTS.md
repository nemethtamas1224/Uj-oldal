# RM Hungary website rebuild

- This isolated project implements the approved Phase A rebuild from `goal-objective.md`.
- Keep `sources/` in the parent project and `/Users/nemethtamas/Projects/RM/` read-only; copy only selected media into this project.
- Preserve Hungarian copy, specifications, URLs, image and download relationships. Never fill gaps with invented product facts.
- Never edit or deploy to the production website. Keep deployment private/staging unless the user explicitly approves production.
- Keep `/admin` authenticated; never commit credentials or expose secrets in status documents.
- Update `PROJECT_STATUS.md` at each meaningful milestone. Clearly label unknown or inaccessible source material.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Homepage and navigation direction (2026-10-21)

- Homepage has a scroll-to `#rolunk` introduction and a CMS-backed product-category selector with product-card carousel.
- Product categories and products must come from Payload; preserve source naming and avoid invented products.
- Header product navigation opens an animated category dropdown on hover/focus; search expands only after its icon is clicked.
- RM palette: red `#C5212E`, yellow `#FBD809`, small accent green `#529A62`, white base.

## Catalog migration direction (2026-10-21)

- The approved 7-root, 35-subcategory structure is recorded in `audit/catalog-structure-user-2026-10-21.md` and seeded by `scripts/catalog-data.ts` / `scripts/migrate-catalog.ts`.
- Keep the original 20 product records, images and documents accessible via `/eredeti-termekoldalak/[key]`; maintain all 20 `index.php?alkat=` mappings. Use `scripts/audit-catalog.py` to refresh the preservation report after material changes.
- New products belong to a nested category, optionally a family, with explicit `reviewState`. Unknown model facts stay draft or marked `specs-missing`; never infer specifications or assign ambiguous images.
- Keep manufacturer, used-machine and inquiry records CMS-managed. Inquiry data is private; public requests only enter through the validated form API. No email delivery is configured yet.
- Local development SQLite can attempt a schema push on startup; avoid simultaneous schema-changing scripts and the dev server. Run data-only migration with `NODE_ENV=production` after schema exists.

## Homepage visual behavior (2026-10-21)

- Keep the progressive catalog choice: no subcategories or products before a root selection, and no products until a subcategory selection.
- Featured logos use the five original transparent `public/elemek/rolunk_*.png` files and link to the corresponding manufacturer page.
- The user-supplied site photo and official source portrait live in `public/images/`. Preserve their source identity and avoid altering people or logos.
- Keep the Contact strip yellow with a red action button. The About excerpt comes from the CMS; `/rolunk` retains the full source copy.

## RM csévélődob méretek (2026-10-21)

- A felhasználó által megadott 23 típus és 234 átmérő/tömlőhossz kombináció forrása `scripts/rm-hose-size-data.ts`; a betöltés `scripts/migrate-rm-hose-sizes.ts`.
- A méret Payload `hoseSizes` soronként szerkeszthető; minden pár mm/m. Ez katalógusadat, nem igazolt aktuális gyári készlet vagy rendelhetőség. A nyilvános oldalon mindig jelenjen meg ez a korlát.
- A csévélődob kategória slugja `csevelodobos` marad, a publikus neve `RM csévélődobok`. Négy család sorrendben: GX, XJ, Magnum, XJM. A korábbi család URL-je átirányítandó.
- Az eredeti, a 23 típusos listában nem szereplő három modell archiválva marad, nem törlendő. Ne azonosítsd az RM Major EVO-t az RM Major XJ EVO-val.
