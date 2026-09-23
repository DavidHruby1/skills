---
name: code-conventions
description: Use ONLY when writing or reviewing code, never otherwise. Applies code conventions for TypeScript, JavaScript, Vue 3, Python, FastAPI, Pydantic, and SQLAlchemy.
metadata:
  based_on: software-philosophy
---

# Konvence pro AI asistované programování

Stack: TypeScript / JavaScript, Vue 3, Python, FastAPI, Pydantic, SQLAlchemy.

## Rozsah a priority

Pracuj s verzemi a architekturou skutečně používanými v repozitáři. Před změnou pochop relevantní implementaci, kontrakty a existující testy. Konfiguraci, dependency metadata a lockfile kontroluj tehdy, když změna závisí na verzi, API, konfiguraci nebo dostupné knihovně. Nerozšiřuj průzkum repozitáře bez konkrétního důvodu. Příklady níže předpokládají Pydantic 2 a SQLAlchemy 2; neprováděj kvůli nim nevyžádanou migraci.

Pořadí priorit: správnost a bezpečnost → srozumitelnost → konzistence projektu → stručnost. Menší počet řádků není samostatný cíl. Pravidla o čitelnosti jsou týmová rozhodnutí; nenahrazují požadavky runtime, bezpečnosti nebo datové integrity.

## 1. Abstrakce a rozsah změny

- Každá nová abstrakce musí skrývat skutečnou složitost, vynucovat konkrétní pravidlo nebo tvořit záměrnou hranici. „Best practice“, „clean architecture“ a „pro budoucnost“ nejsou samy o sobě odůvodnění.
- Nevytvářej funkce, které pouze předávají stejné argumenty jiné funkci a nepřidávají význam. Preferuj přímé volání. Výjimkou je potřebný adaptér, frameworkový vstup, stabilní veřejné rozhraní nebo jasně pojmenovaný doménový koncept.
- Nepoužívej počet řádků ani počet volajících jako jediný test oprávněnosti funkce. Krátký predikát, computed nebo endpoint může být správně. Delší funkci rozděl, když obsahuje několik nezávislých odpovědností.
- Nevytvářej BaseService, GenericRepository, factory, registry, vlastní DI kontejner ani konfigurovatelný miniframework bez konkrétní potřeby. Zachovej již existující, odůvodněnou architekturu projektu.
- Neslučuj podobně vypadající kód, který představuje různá pravidla. Abstrakce vyžadující přibývající boolean přepínače a výjimky musí být přehodnocena.
- Nepřidávej hypotetické backendy, nevyžádané režimy, kompatibilitu s nepodporovanými verzemi ani závislosti pro triviální operace.
- Nevyráběj nový soubor pro každý drobný krok. Související kód drž pohromadě; odděluj skutečné odpovědnosti.
- Komentáře vysvětlují důvod, invariant nebo neobvyklé omezení. Nepopisují doslova následující řádek. Jména mají popisovat doménu a skutečné účinky, nikoli pouze data, manager nebo processor.
- Měň pouze zadání, jeho přímé předpoklady a dotčenou cestu. Neprováděj plošný reformat, přejmenování ani nesouvisející refaktor. Malé lokální zlepšení v přímo měněné cestě je vhodné, pokud odstraňuje současnou designovou komplikaci a nezvětšuje scope neúměrně požadavku.

## 2. Validace, chyby a fallbacky

- Neověřená externí data validuj na hranici, kde vstupují do systému. Typová deklarace ani as T nejsou runtime validace. Využij existující schéma nebo parser projektu.
- Uvnitř aplikace pracuj s konkrétními validovanými typy. Nepřidávej opakované isRecord, typeof, isinstance, hasattr nebo kontroly téhož schématu bez nové hranice důvěry či změny dat.
- Nezakazuj isRecord podle názvu. V parseru hodnoty unknown může mít smysl; sám však nedokazuje správnost doménového objektu.
- Povinné chybějící údaje nezakrývej ?., ?? '', ?? [], .get(..., default) nebo náhradním úspěchem. Fallback musí být součástí skutečného kontraktu.
- Rozlišuj nepřítomnost, null/None, prázdný řetězec, nulu a false. Nepřepisuj platné falsy hodnoty jen kvůli pohodlnému defaultu.
- Zachytávej chyby tam, kde je lze vyřešit, doplnit o potřebný kontext nebo převést na veřejný kontrakt. Neobaluj každou funkci try/catch či try/except.
- Nevracej prázdný seznam, None nebo úspěšný stav po neočekávaném selhání. Neignoruj výjimky a neloguj tutéž chybu bez přidaného kontextu v každé vrstvě.
- Normalizuj jen výslovně povolené varianty vstupu. Neopravuj automaticky libovolný neplatný vstup na hodnotu, která náhodou projde validací.
- Retry vyžaduje známé přechodné chyby, bezpečné opakování, limit a časový rozpočet. Nedubluj retry mechanismus použitého klienta a neopakuj ne-idempotentní operace naslepo.

## 3. TypeScript / JavaScript

- Nepoužívej any, as unknown as T, non-null assertion ani vypnutí kontroly typů jako náhradu opravy kontraktu. Nezbytnou výjimku omez na konkrétní místo a vysvětli.
- unknown patří k neznámým vstupům, Record ke skutečným slovníkům. Pro známé entity používej jejich konkrétní typy, ne `Record<string, unknown>`.
- Nevytvářej univerzální model se vším optional. Odlišné stavy vyjádři vhodnými typy, případně diskriminovanou unií. `Partial<T>` používej pouze pro skutečně částečná data.
- Generické parametry musí vyjadřovat skutečný vztah mezi typy. Nezaváděj složité conditional/mapped typy tam, kde postačí konkrétní typ. Neopisuj zjevnou lokální inferenci bez důvodu.
- Nepřeváděj objekty opakovaně přes JSON nebo mezi identickými DTO. Transformace musí měnit skutečný kontrakt, reprezentaci či vlastnictví dat.
- Jednoduché map, filter a reduce jsou v pořádku. Vícekrokové větvení, vedlejší účinky nebo opakované kopírování rostoucího akumulátoru přepiš na přehledný postup.
- Nepoužívej forEach(async ...) k čekání na operace. Každý Promise musí mít záměrné čekání, předání volajícímu nebo správu chyb a životnosti. Samotné void rejection nezpracuje.
- U souběhu rozlišuj nezávislé operace a operace vyžadující pořadí. Concurrency limit přidávej jen při skutečném nebo požadavkem doloženém riziku vyčerpání zdrojů, rate limitu či nadměrné zátěže. Nevymýšlej limity ani throttling pro hypotetický růst.
- U fetch zpracuj HTTP status, očekávané tělo, zrušení a síťové selhání podle kontraktu. Nevytvářej univerzální wrapper, který chyby potichu převádí na undefined.

## 4. Vue 3

- Odvozené hodnoty vyjadřuj pomocí computed, ne pomocí dalšího ref synchronizovaného watcherem. computed getter nesmí provádět I/O ani měnit stav.
- watch používej pro skutečné vedlejší účinky. Preferuj konkrétní zdroj před plošným deep: true. U watchEffect musí být zřejmé, které synchronně čtené závislosti jej spouštějí.
- Zachovávej reaktivitu při předávání a destrukturování. Zohledni verzi: destrukturování defineProps je od Vue 3.5 ve stejném `<script setup>` reaktivní díky transformaci kompilátoru; nejde o obecnou vlastnost destrukturování.
- Neměň props. Kopii do lokálního formuláře vytvářej jen jako záměrný draft s pravidly pro uložení, reset a změnu vstupu, ne jako automatickou druhou autoritu.
- Composable musí zapouzdřovat související logiku. Nevytvářej pass-through use* obaly ani univerzální composable pro vše. Čistá utility funkce nemusí být composable.
- Stav drž v nejmenším potřebném rozsahu. Neumisťuj lokální formulář nebo otevření dialogu automaticky do globálního storu. Při SSR nesdílej uživatelský mutable stav mezi requesty.
- Async načítání musí zabránit přepsání novějšího výsledku starší odpovědí. Registruj odpovídající cleanup; onWatcherCleanup vyžaduje Vue 3.5+ a synchronní registraci před await.
- U vlastních timerů, listenerů, subscription a ručně vytvořených watcherů řeš životnost a úklid. Rozlišuj je od zdrojů, které framework spravuje automaticky.
- Pro položky s identitou používej stabilní key. Nepoužívej náhodný klíč ani index pro přeuspořádávané stavové položky.
- Neopravuj chybný datový tok pomocí náhodného setTimeout, změny key nebo vynuceného renderu. nextTick použij jen pro skutečné čekání na aktualizaci DOM.

## 5. Python a čitelnost

- Comprehension používej pro jednoduchou transformaci s jedním for a nejvýše jedním jednoduchým filtrem. Více vnořených průchodů, složité větvení, opakované parsování a vedlejší účinky patří do normálního for cyklu.
- Počet fyzických řádků není kritériem složitosti. Jednoduchá comprehension může být zalomená přes několik řádků a stále být čitelná.
- Nevytvářej seznam jen kvůli vedlejším účinkům, například [send(item) for item in items], pokud seznam výsledků nepotřebuješ.
- Nepoužívej map/lambda, vnořené ternární výrazy, reduce nebo walrus jen pro zkrácení kódu. Pojmenuj mezivýsledky, pokud vysvětlují postup.
- U známých modelů používej atributy; nepřeváděj je na dictionary kvůli get, getattr nebo hasattr.
- U funkcí nepoužívej mutable výchozí argumenty. Toto pravidlo mechanicky nepřenášej na Pydantic: ten nehashovatelné modelové defaulty kopíruje. default_factory lze preferovat pro explicitní záměr.
- Async úlohy musí mít vlastníka, zpracování chyb a ukončení. Nepotlačuj cancellation bez výslovného důvodu.

## 6. FastAPI a Pydantic

- Nesměšuj API různých major verzí Pydantic. Používej API odpovídající skutečným závislostem repozitáře.
- V async def neprováděj blokující I/O přímo. Sync route/dependency FastAPI může spustit ve thread poolu; obyčejná synchronní pomocná funkce volaná z async kódu se automaticky nepřesune.
- Pro běžné strukturované requesty a response používej deklarované modely. Ruční čtení JSON nebo vlastní Response musí mít konkrétní důvod, například streaming či ověření podpisu raw body.
- Odděl vstupní a veřejná výstupní pole podle kontraktu. Jeden univerzální optional model nesmí umožnit zápis serverových polí ani únik tajných údajů.
- Preferuj typy a Field constraints před jejich ručním přepisem ve validátorech. DB dotazy, autorizace a síťové operace nepatří do běžných validátorů tvaru dat.
- Nepoužívej model_construct() nebo nevalidující aktualizaci modelu jako zkratku kolem chyb. U defaultů záměrně stanov, zda potřebují validaci. Pro nezbytnou validaci vstupu nespoléhej na assert vypínatelné optimalizací Pythonu.
- U PATCH zachovej rozdíl mezi nepřítomným polem a explicitním null. Pro dodaná pole používej podle kontraktu model_dump(exclude_unset=True); exclude_none=True není totéž.
- V Pydantic 2 T | None znamená nullable, nikoli automaticky nepovinné pole. Výchozí hodnota a povinnost pole jsou samostatná rozhodnutí.
- HTTPException vyhazuj a zachovej záměrné statusy. Neočekávané chyby nemaskuj jako 200/404 a neposílej klientovi interní str(exc).
- Sdílené prostředky spravuj na úrovni aplikace, requestové prostředky na úrovni requestu. Background task musí získat vlastní prostředky a nespoléhat na životnost requestové session. Pro nové lifecycle řešení preferuj podporovaný lifespan podle verze projektu.

## 7. SQLAlchemy a integrita dat

- Session/AsyncSession není globální singleton pro souběžné requesty. Jednu AsyncSession nesdílej mezi paralelními tasky. Samostatné sessions zároveň neznamenají společnou atomickou transakci.
- Vlastnictví transakce musí být explicitní. Neskrývej commit() v obecných CRUD helperech, které musí jít skládat do jedné operace. Částečné commity jsou přípustné jen jako záměrný kontrakt.
- flush, refresh, commit a rollback nejsou univerzální rituál. Použij je podle požadovaných dat a stavu transakce; po selhaném flush session před dalším použitím správně vrať do použitelného stavu nebo ji ukonči.
- Navrhni loading potřebných vztahů. Neprováděj neplánované lazy I/O při serializaci; u async ORM je implicitní I/O zvlášť problematické.
- Nepřidávej joinedload všech vztahů ani unique() všude. Strategii načítání a zpracování výsledku odvoď od konkrétního dotazu.
- Filtraci, agregaci a stránkování velkých dat prováděj v SQL, ne až po načtení celé tabulky do Pythonu. Výjimkou je záměrné zpracování malé, již potřebné kolekce.
- Unikátnost a další databázové invarianty zajisti odpovídajícími constraints. Kontrola existence před zápisem sama neřeší souběh. Rozlišuj konkrétní databázové chyby; ne každé IntegrityError znamená duplicitu.
- SQL hodnoty předávej parametry, nikdy je nevkládej přes f-string. Dynamické názvy sloupců a řazení vybírej z povolených možností.
- Hromadně přiřazuj pouze pole explicitně povoleného vstupního schématu. role, owner_id a tenant_id nepřebírej nekontrolovaně od klienta.
- Ověř oprávnění ke konkrétnímu objektu a tenantovi na serveru. Validní ID ani přihlášení nejsou autorizace ke všem záznamům.
- Nevytvářej engine pro každý request a neprodlužuj transakce zbytečným čekáním na externí služby.
- Změna ORM modelu není nasazená migrace. Generované Alembic migrace zkontroluj, zvlášť rename, drop, data backfill a zpětnou kompatibilitu.

## 8. Testy a dokončení práce

- Ověř existenci použitých API, importů a závislostí. Nepřidávej imaginární metodu ani novou knihovnu jen proto, že zní pravděpodobně.
- Testuj pozorovatelné chování a pravidla, ne pouze hodnotu předem nastavenou na mocku. Nekopíruj implementaci do výpočtu očekávaného výsledku.
- Mockuj záměrné externí hranice. Potřebné integrační testy nenahrazuj řetězcem mocků; vhodně použij spec/autospec.
- Ověř změněné chování a konkrétní rizika změny. Přidej chybové, autorizační, missing/null, rollback, concurrency nebo jiné edge-case testy pouze tehdy, když představují odlišné relevantní chování. Nevytvářej testovou matici jen kvůli úplnosti. Samotné status_code == 200 nemusí ověřit požadované chování.
- Neoslabuj testy, lint ani typecheck, aby změna prošla. Výjimky a změny kontraktu vysvětli; neuklízej chybu pod skip, noqa nebo typový cast.
- Odstraň vlastní nepoužívané importy, mrtvé větve, provizorní logy a nahrazené implementace. Nezasahuj přitom nevyžádaně do nesouvisejícího kódu.
- Spusť dostupné relevantní kontroly a uveď skutečné výsledky. Rozlišuj „spuštěno a prošlo“, „spuštěno a selhalo“ a „nespuštěno“. Neprezentuj odhad jako ověření.

## Rozhodovací test před přidáním kódu

- Před netriviální novou vrstvou, guardem, fallbackem, závislostí nebo extension pointem pojmenuj konkrétní současný problém, který řeší. Jestli jeho odstranění při zachování požadavků nezmění srozumitelnost, kontrakt, bezpečnost ani životnost prostředků, zvaž, zda je vůbec potřeba. Neodstraňuj kvůli tomuto testu skutečné bezpečnostní a integrační hranice.
- Pokud je důvod neobvyklý nebo jde o vědomou výjimku z těchto konvencí, stručně jej uveď v PR nebo vysvětlení změny. Nevytvářej dokumentační ceremonii pro běžná lokální rozhodnutí a nepřidávej obhajovací komentář ke každému řádku.
