# RM Hungary katalógusmigráció – ellenőrzési jegyzőkönyv

Forrás: az eredeti RM honlap helyi mentése (`site-crawl.json`) és a helyi Payload CMS.
A táblázat az eredeti 20 termékoldal megőrzését méri; a modell–kép és műszakiadat megfeleltetés külön ellenőrizendő.

| Régi oldal | Új cél | Forrásképek | Mentett képek | CMS galéria | Dokumentumok | Szöveg |
|---|---|---:|---:|---:|---:|---:|
| [5](https://www.rmhungary.hu/index.php?alkat=5) | `/termekek/dohanytermesztes/talajelokeszites` | 6 | 6 | 6 | 2 | igen |
| [6](https://www.rmhungary.hu/index.php?alkat=6) | `/termekek/dohanytermesztes/dohanytetejezes` | 2 | 2 | 2 | 2 | igen |
| [7](https://www.rmhungary.hu/index.php?alkat=7) | `/termekek/dohanytermesztes/permetezogepek` | 4 | 4 | 4 | 2 | igen |
| [8](https://www.rmhungary.hu/index.php?alkat=8) | `/termekek/dohanytermesztes/palantaulteto-gepek` | 3 | 3 | 3 | 2 | igen |
| [9](https://www.rmhungary.hu/index.php?alkat=9) | `/termekek/dohanytermesztes/magveto-gepek` | 2 | 2 | 2 | 2 | igen |
| [10](https://www.rmhungary.hu/index.php?alkat=10) | `/termekek/ontozogepek/csevelodobos` | 19 | 17 | 17 | 2 | igen |
| [11](https://www.rmhungary.hu/index.php?alkat=11) | `/termekek/ontozogepek/linearis` | 7 | 7 | 7 | 2 | igen |
| [13](https://www.rmhungary.hu/index.php?alkat=13) | `/termekek/ontozogepek/csepegteto-mikro` | 34 | 34 | 34 | 3 | igen |
| [14](https://www.rmhungary.hu/index.php?alkat=14) | `/termekek/szivattyuk/kutszivattyuk` | 13 | 13 | 13 | 2 | igen |
| [15](https://www.rmhungary.hu/index.php?alkat=15) | `/termekek/szivattyuk/motoros-szivattyuegysegek` | 4 | 4 | 4 | 2 | igen |
| [16](https://www.rmhungary.hu/index.php?alkat=16) | `/termekek/energiaellatas/dizel-aramfejlesztok` | 7 | 7 | 7 | 2 | igen |
| [37](https://www.rmhungary.hu/index.php?alkat=37) | `/termekek/ontozogepek/csevelodobos` | 6 | 6 | 6 | 2 | igen |
| [38](https://www.rmhungary.hu/index.php?alkat=38) | `/termekek/dohanytermesztes/dohanybetakaritas` | 5 | 5 | 5 | 2 | igen |
| [39](https://www.rmhungary.hu/index.php?alkat=39) | `/termekek/dohanytermesztes/dohany-szaritas` | 3 | 3 | 3 | 2 | igen |
| [40](https://www.rmhungary.hu/index.php?alkat=40) | `/termekek/dohanytermesztes/zold-dohany-feldolgozas` | 2 | 2 | 2 | 2 | igen |
| [42](https://www.rmhungary.hu/index.php?alkat=42) | `/termekek/arokaso/arokaso-arokmaro` | 8 | 8 | 8 | 2 | igen |
| [43](https://www.rmhungary.hu/index.php?alkat=43) | `/hasznalt-gepek` | 3 | 3 | 3 | 2 | igen |
| [44](https://www.rmhungary.hu/index.php?alkat=44) | `/termekek/dohanytermesztes/novenyapolas` | 16 | 16 | 16 | 2 | igen |
| [47](https://www.rmhungary.hu/index.php?alkat=47) | `/termekek/mezogazdasagi-tarolok/ivsatrak` | 12 | 12 | 12 | 2 | igen |
| [48](https://www.rmhungary.hu/index.php?alkat=48) | `/termekek/ontozogepek/ontozoszarnyak` | 7 | 7 | 7 | 2 | igen |

- Régi oldalak: **20**; forráskép-hiányok: **2**.
- Új kategóriák: **42** (7 fő- és 35 alkategória).
- Új termékrekordok: **90**; képhez kötött: **41**.
- Tervezet, forrásellenőrzésre váró termékek: **16**.

## Hiányzó forrásképek

- `10`: https://www.rmhungary.hu/tartalom/termek/1000gx_1_1.png
- `10`: https://www.rmhungary.hu/tartalom/termek/540-gx_1_2.png

## Nyitott tartalmi ellenőrzések

- A publikus helyi modellek műszaki adatlapjai többnyire hiányoznak; a CMS ezt `specs-missing` státusszal jelöli.
- Az eredeti 20 oldal szövege, mentett képei és dokumentumai külön, keresőből kizárt forrásoldalon megmaradnak.
- Egyes modellnevek csak fájlnévből vagy a felhasználó struktúrajavaslatából származnak; ezek tervezetként maradnak.
- A használt gépeknél nincs ellenőrzött, egyedi eladó gép; a korábbi gyűjtőoldal archívuma elérhető.
- Éles közzététel előtt modelladatok, képmegfeleltetés, termékdokumentumok, jogi és elérhetőségi adatok szerkesztői ellenőrzése szükséges.
