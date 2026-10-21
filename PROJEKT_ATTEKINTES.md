# RM Hungary weboldal — projektáttekintés (2026. 10. 21.)

- **Cél:** A rmhungary.hu magyar tartalmának és termékkatalógusának modern, mobilbarát újraépítése Payload adminnal, az eredeti tartalom és URL-ek megőrzésével.
- **Munkamappa:** `work/rm-hungary-website/`; a szinkronizált `sources/` és `/Users/nemethtamas/Projects/RM/` csak olvasható forrás.
- **Elfogadott döntés:** 7 főkategória és 35 alkategória a `audit/catalog-structure-user-2026-10-21.md` dokumentum alapján. Külön gyártói és használtgép-oldalak, család- és modellszintű termékoldalak, 20 régi URL átirányítása.
- **Helyi állapot:** 11 gyártó, 14 termékcsalád, 90 új termékrekord; 16 tervezet, 41 igazolt képkapcsolat. A korábbi 20 termékoldal szövege, elérhető képei és dokumentumai külön archív oldalon megmaradtak. A részletes tételes jegyzőkönyv: `audit/catalog-migration-report.md`.
- **Kezdőlap és fejléc:** Rólunk részre görgetés, CMS-ből betöltött kategóriaválasztó és termékkártya-vetítés; animált hover/fókusz menü, ikonról nyíló kerek kereső. Színek: `#C5212E`, `#FBD809`, kevés `#529A62`, fehér alap.
- **Ajánlatkérés:** A helyi űrlap az adminban tárolja a kérelmet; nincs még email-értesítés. Használt gépből nincs ellenőrzött egyedi hirdetés. Az admin első felhasználóját a tulajdonos hozza létre; jelszó nincs a projektfájlokban.
- **Ellenőrzött:** A build, mind a 35 alkategória-, 14 termékcsalád-, 74 publikált termék-, 11 gyártói és 20 forrásarchív oldal sikeres. A 20 régi URL-hez van 301 átirányítás; 2 eredeti kép a forrásból sem volt letölthető. A próba-ajánlatkérés mentése sikeres, a tesztrekord törölve. Az előnézet: `http://127.0.0.1:3000`.
- **Bizonytalanság:** Sok modell műszaki adata és több kép pontos termékhez rendelése még ellenőrzendő. Az érintett rekordok `draft` vagy `specs-missing` jelölést kaptak; ez nem kész éles termékkatalógus.
- **Engedélyezési korlát:** Az éles webhelyhez nem nyúltunk. Éles telepítéshez külön, kifejezett jóváhagyás és környezeti adatok szükségesek.
- **Következő lépés:** Gyártói adatlapok és eredeti PDF-ek alapján modellszintű lektorálás, új használtgép-adatok felvétele, értesítés és tárhely beállítása, majd publikálás előtti szerkesztői/jogi ellenőrzés.

## Kezdőlapi arculati frissítés (2026. 10. 21.)

- A hét főkategória ikon + szöveg kártyaként látható. Alaphelyzetben sem alkategória, sem termék nem jelenik meg; a kiválasztott főcsoport után az alkategóriák, majd az alkategória után a hozzá tartozó termékkártyák nyílnak meg.
- Az első szekcióban öt kattintható, átlátszó eredeti márkalogó látható. A Rólunk részhez a felhasználó telephelyfotója és az eredeti RM oldalról származó Bartalis Levente-portré került; a rövidített kezdőlapi szöveg teljes változata a Rólunk oldalon van.
- A Kapcsolat sáv sárga, piros gombbal. A mobilnézetben a kezdőlap vizuálisan átnézve; az új változat helyi előnézetben marad, éles publikálás nélkül.

## RM csévélődob méretkatalógus (2026. 10. 21.)

- **Elfogadott szerkezet:** Termékek → Öntözőgépek és öntözőrendszerek → RM csévélődobok → RM GX / XJ / Magnum / XJM → típusadatlap. A korábbi `csevelodobos` URL megmaradt; a régi `rm-nagy-teljesitmenyu` család-URL az új `rm-magnum` oldalra irányít.
- **Bevitt adatok:** 23 típus, 234 soronként szerkeszthető méretváltozat: GX 9/97, XJ 6/86, Magnum 3/23, XJM 5/28. A forrás a felhasználó 2026-10-21-i táblázata; nem külön ellenőrzött aktuális gyári készlet vagy rendelhetőségi lista.
- **Adatkezelés:** A Payload terméklap `Öntözőcső méretváltozatok` tömbjében az átmérő mm-ben, a hossz méterben külön mező. A termékoldal lebegő méretkártyán jelzi a jelölést és a készletadat hiányát. `scripts/rm-hose-size-data.ts` tartalmazza a tételes listát, `scripts/migrate-rm-hose-sizes.ts` az ismételhető betöltést.
- **Korábbi rekordok:** A 890 GX EVO, 1000 GX és Major EVO megőrizve, archivált állapotban; nem összevonva a felhasználó új listájával. 1100 GX és Major XJ EVO külön rekord. A meglévő képek és forráskapcsolatok megmaradtak.
- **Helyi állapot:** A migráció 2 új és 21 frissített típusrekordot, 3 archiválást eredményezett. Adatbázismentés: `backups/rm-hungary-20261021-150414.zip`. A build sikeres; az előnézet helyben fut. Éles telepítés nem történt.
- **Nyitott:** A típusok további műszaki adatai, rendelhetősége és az új típusok termékfotói forrásellenőrzést igényelnek.

## Kezdőlapi finomítás (2026. 10. 21.)

- A hét főkategória és az alkategóriák lépcsőzetes kezdőlapi kiválasztása megmaradt. Egyedül az `RM csévélődobok` alkategória nyit négy sorozatkártyát (GX, XJ, Magnum/FX, XJM) a típusok vetítése helyett; a kártyák a megfelelő sorozatoldalra mutatnak.
- A Rólunk részben a telephelyfotó alatt a felhasználó által megadott Google Maps beágyazás szerepel azonos, lebegő fehér kártyastílusban.
- A nyilak lekerültek a nyilvános gombokról és kattintható kártyákról; a többi alkategória termékválasztójának előző/következő vezérlői szövegesek. A build sikeres. Éles telepítés nem történt.
