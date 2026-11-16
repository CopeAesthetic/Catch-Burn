# Catch n' Burn — Research Brief

Compiled 2026-11-15 for the Catch n' Burn kickoff. Everything here feeds `design/catch-n-burn/` and the kickoff prompt. Sources are listed at the bottom; figures are paraphrased.

---

## 1. Cannabis strains — what is actually on shelves (2025 data)

**National best-sellers.** Leafly's 2025 year-end list puts Blue Dream, Granddaddy Purple, Wedding Cake, Sour Diesel and Pineapple Express at the top nationally. Marijuana Herald's 2025 lists (built from Headset sales data, state regulators and Leafly) add Runtz, Ice Cream Cake, Jack Herer, Apple Fritter, OG Kush/Tahoe OG and Gelato as constant menu staples. Massachusetts alone had ~700 active strains on sale, so "real" strains are effectively unlimited — the game should pick recognizable names.

**Regional signal (top-selling strain by state, mid/late 2025, Headset + regulators):**

| Game area | States with data | Strains that topped sales in 2025 |
|---|---|---|
| North East | ME, VT, RI, MA, NY, CT | Runtz (ME/VT/RI), Kush Mintz, Bananas, Ice Cream, PK Crasher, Sour Diesel, Gelato (MA), Blue Dream, Garlicane, Memory Loss (NY), Blue Dream (CT); Devil Driver = Maine budtenders' pick |
| Mid Atlantic | NJ, MD, NY | Lemon Cherry Gelato, Orange Push Pop, Banana Daddy, Animal Face, Gelato (NJ); Animal Face (MD) |
| South East | FL (medical) | Pineapple Express (FL) |
| Mid West | MI, IL, OH, MO | Runtz (MI), Kush Mints, Animal Face, Pineapple Express (IL), GMO Cookies, Bananas, Skunk 1, Afternoon Delight (OH), Triple Burger, CAP Junky (MO) |
| Pacific NW | WA, OR, AK | Wedding Cake, Blue Dream (WA), Jack Herer, Blueberry Muffin (OR), Wedding Cake, Runtz (AK) |
| West Coast | CA | Blue Dream (top for 3 straight years in CA), Tahoe OG/OG Kush |
| South West | AZ, NV, NM, CO, OK | Permanent Marker, Vice City, Wedding Cake (AZ), Afternoon Delight, Jenny Kush, Black Label (NV), Sour Diesel, Blue Dream (NM), MAC (CO), Gelato (OK) |
| US Islands | HI, PR, Guam (medical/limited) | No sales tracker; use Hawaiian heritage names (Maui Wowie, Kona Gold, Puna Budder, Hawaiian Snow) |

**Design takeaway:** Reggie = cheap, everywhere (Blue Dream, Sour Diesel tier); Home Grown = regional/local favourite; Top Shelf = the current hype top-seller of that region; Straight Fire = fictional mythic strain (hidden tier, so it can be invented — avoids implying a real product).

## 2. Consumption methods — how people actually use it

- Federal NSDUH 2022–23 data (n≈17,000 current users): smoking ~77%, edibles ~37%, vaping ~35%, dabbing ~15%, topicals ~6%, sublingual ~5%, pills ~2%.
- CDC/BRFSS data reported by NORML (2025): ~79% smoke, ~41% edibles, under 15% dab; dabbing is concentrated in young adults.
- California CHIS 2022: joint/bong/pipe most common, then eating, vaping, blunts, dabbing, drinks.
- 57% of young adult users use 2+ methods.
- Retail: flower ~40% and pre-rolls ~16% of 2024 dispensary sales; vapes now outsell flower in California.

**Design takeaway:** The gear ladder in the brief (one-hitter → papers → blunt wrap → full leaf → pipe → bubbler → bongs → nectar collector → mini rig → dab rig → Puffco-style e-rig → gas mask) mirrors real usage: common, cheap smoking gear at the bottom; concentrates and dab gear (used by a minority) as late-game upgrades. Use the generic name "Puff-Go" (not the trademark "Puffco") in-game.

## 3. Late-2000s / early-2010s fishing games — look, feel, systems

Reference titles: **Rapala Tournament Fishing** (Wii, 2006), **Rapala Pro Bass Fishing** (2010, PS2/PS3/360/Wii/PSP/iOS, later Wii U), **Bass Pro Shops: The Strike** (2009, Wii/360/PC), **SEGA Bass Fishing** (Wii port 2008), the **Reel Fishing** series, plus the fishing in Animal Crossing / Zelda / Red Dead Redemption as the "fishing as a side-loop" bar.

What they had in common:
- **Presentation:** 7th-gen look — bloom, glossy water shaders, time-of-day lighting, "TV broadcast" overlays and voiced commentary (Rapala Pro Bass), speedboat intro cutscenes, long loading screens (a known complaint — we turn it into a feature with the kayak push-off cutscene).
- **Loop:** pick a spot → pick gear (The Strike had 111 lures; Rapala advertised 500+ accessories) → cast with a power meter / timing → wait for bite → hook-set on a prompt → fight using a **line-tension meter** → land fish → earn cash → buy better rods/reels/lures in an in-game store.
- **Structure:** a career/season mode across multiple real lakes unlocked in order (The Strike: 10 lakes, 11 species, legendary fish per lake; Rapala Pro Bass: 20 tournaments across 7 waters, 30+ species), plus free-fish and casting/boat mini-games. A fish encyclopedia ("Fish-o-pedia") and catch log were standard.
- **Criticisms to avoid:** repetitive waiting, unresponsive controls, too-easy fights, long loads, store menus that break flow.

**Design takeaway:** Keep the retro power-meter cast, bite prompt, store-and-upgrade loop, per-lake legendary fish and catch log; replace the tension bar with the BioShock 2-style needle minigame, and keep waits short.

### BioShock 2 hacking minigame (the reel-in model)
A needle sweeps back and forth across a gauge; stop it on **green** to pass a stage, on the smaller **blue** zone for a bonus; red/blank costs you. Harder hacks have more stages, a faster needle and smaller zones, and a sweep counter limits attempts. For Catch n' Burn: green = +1 pull, blue = +3, anything else = −1; pulls below 0 = fish escapes; rarer fish = faster needle, smaller zones, more pulls needed.

## 4. Fish — regional accuracy

Primary national dataset: **CreelCat** (USGS-led US Inland Creel and Angler Survey Catalog, 2023) — 235,015 records of catch/harvest metrics across all states including DC and Puerto Rico. Use it to sanity-check "common vs rare" per state. Supporting state surveys:
- NY DEC 2019 angler survey: largemouth/smallmouth bass are anglers' top choice; yellow perch, walleye and trout are the most-kept species.
- Iowa 2018: walleye, bass, catfish, crappie, bluegill most fished.
- Wisconsin: bluegill, yellow perch, crappie are by far the most caught (≈26M bluegill in one year).
- Nationally, black bass is the most-targeted freshwater gamefish (USFWS).
- Saltwater (NOAA via Salt Water Sportsman): Atlantic croaker most caught on the Atlantic; spotted seatrout in the Gulf.
- Hawaii: Lake Wilson / Wahiawā Reservoir is Oʻahu's main public freshwater fishery — peacock bass (tucunaré), largemouth, smallmouth, channel catfish, tilapia, bluegill, oscars; bass are catch-and-release.

**Rarity rule used in the content tables:** Common = abundant panfish/rough fish everyone catches; Uncommon = widespread but targeted; Rare = prized gamefish; Epic = trophy/limited-range species; Legendary = the water body's signature giant; Lost Legend = an extinct, near-extinct or folklore fish tied to that exact place (e.g., Silver Trout of Dublin Pond NH, Blue Pike of Lake Erie, Clear Lake Splittail). These are real, verifiable stories, which makes the hidden tier feel like history rather than fantasy.

## 5. Solo-dev pipeline (engine → GitHub → beta → Steam → multiplayer)

**Engine recommendation: Godot 4 (GDScript).** Free/MIT, light enough for a 7th-gen look, and the Game Studios kit ships Godot specialists (godot-specialist, godot-gdscript-specialist, godot-shader-specialist). Unity is the alternative if you want its asset store.

**Multiplayer:** Godot's high-level multiplayer gives transport and replication but no lobbies; **GodotSteam** wraps Steamworks (lobbies, friends, relay/NAT traversal, voice). Small co-op sessions of 2–8 players are its sweet spot. A Steam **lobby ID can be shown as the "session code"** in Jordan (Homie) — players paste it to join, exactly like several open-source Godot lobby templates do. Host-authoritative co-op, max 4 players to start.

**GitHub:** the Catch-Burn repo holds the Game Studios template + game. Use Git LFS for audio/models, a `main` + feature-branch flow, and GitHub Actions to export Windows/Linux builds (the kit has `/release-checklist`, `/launch-checklist`, `/day-one-patch`).

**Steam:**
- Steam Direct fee: $100 per game, recouped after $1,000 revenue; Valve's cut 30%.
- Before review you complete the **Content Survey**, including mature-content disclosure — drug use must be disclosed honestly; the game will carry a mature-content flag. Payment-processor-driven rules from 2025 mostly target sexual adult-only content, but plan for an 18+ store age gate and avoid real brand names.
- **Steam Playtest** (separate child App ID, own light review) is the closed-beta path; a free demo in **Steam Next Fest** is the biggest wishlist spike (median ~200 wishlists, top 5% ~7,000 in Feb 2026; pre-fest wishlists are the strongest predictor). Next editions: Feb 22 and Jun 14, 2027.
- Indie rule of thumb: 7,000–10,000 wishlists for a healthy launch.

**Suggested order:** core loop vertical slice (home + one pond, cast/reel/smoke) → content pipeline (fish/strains as data files) → full North East area → Steam page + wishlists → Playtest beta → multiplayer (GodotSteam lobby) → Next Fest demo → 1.0.

## 6. Friendslop — what it means

Slang that took off in 2025 (Lethal Company, R.E.P.O., Content Warning, PEAK) for low-budget, low-stakes, often silly co-op games built to be played with your friend group: cheap price, low skill floor, low-fi 3D, physics comedy, proximity/voice chat, and a shared goal. Among Us and Phasmophobia are cited as forerunners. Some devs dislike the term; it is not a formal genre. For Catch n' Burn: drop-in co-op on the same pond, shared smoke sessions, ragdolly kayak tips, proximity voice, being able to see your friends' screen-blur "YAK LOCKED" moments, a cheap price.

## 7. The fishing shack (Home)

Modeled on the **Maine sporting-camp** tradition (1870s–1940s, Rangeley Lakes, Moosehead): small rustic log or board-and-batten cabins on a pond or lake, exposed interior beams, a stone fireplace or woodstove, trophy fish and deer heads on the walls, a screened front porch with a rod rack and Adirondack chairs, a wood dock with canoes/kayaks, and spruce/birch/white-pine shoreline. Many ponds are stocked with brook trout and are motor-free and quiet.

---

## Sources
- Leafly — The best-selling weed strains of 2025: https://www.leafly.com/news/strains-products/best-selling-weed-strains
- Marijuana Herald — 50 Most Popular Strains of 2025: https://themarijuanaherald.com/2025/11/the-50-most-popular-cannabis-strains-of-2025-u-s-edition/
- Marijuana Herald — Best-selling strain in every recreational state (Dec 2025): https://themarijuanaherald.com/2025/12/the-best-selling-cannabis-strains-in-every-recreational-state-as-of-december-2025/
- Marijuana Herald — Top-selling strain by state (Sep 2025): https://themarijuanaherald.com/2025/09/every-legal-cannabis-states-top-selling-strain-as-of-september-2025/
- Marijuana Herald — Headset top strains, 15 states (May 2025): https://themarijuanaherald.com/2025/05/research-firm-details-most-purchased-marijuana-strains-in-15-u-s-states-and-four-canadian-provinces/
- Diaby et al., Journal of Cannabis Research 2025 (NSDUH modalities): https://doi.org/10.1186/s42238-025-00283-x
- NORML — Smoking remains most popular method (2025): https://norml.org/news/2025/04/24/survey-smoking-remains-most-popular-method-for-consuming-cannabis/
- UCLA Center for Health Policy Research — Modes of Cannabis Consumption (2025): https://healthpolicy.ucla.edu/our-work/publications/m32-modes-cannabis-consumption-results-california-statewide-survey
- Cova — Most popular dispensary products: https://www.covasoftware.com/cova-blog-2025/blog/most-popular-cannabis-products-every-dispensary-should-stock
- GameSpot — Rapala Tournament Fishing review: https://www.gamespot.com/reviews/rapala-tournament-fishing-review/1900-6162746/
- Gamepressure — Rapala Pro Bass Fishing: https://www.gamepressure.com/games/game_score.asp?ID=12967
- TouchArcade — Rapala Pro Bass Fishing review: https://toucharcade.com/2010/10/04/rapala-pro-bass-fishing-review-universal-fishing-from-activision/
- Push Square — Rapala Pro Bass Fishing PS3 review: https://www.pushsquare.com/reviews/2010/11/rapala_pro_bass_fishing_ps3
- Gamepressure — Bass Pro Shops: The Strike: https://gamepressure.com/games/the-strike/z2819
- Wikipedia — BioShock 2 (hacking): https://wikipedia.com/wiki/BioShock2
- Prima Games — BioShock 2 hacking: https://primagames.com/eguides/bioshock-the-collection-eguide/bioshock-2/into-the-dive-suit/beyond-the-basics
- CreelCat angler survey database: https://storymaps.arcgis.com/stories/3effd29faf3a4adda3afabf8434b2619
- NY DEC Angler Survey 2019: https://extapps.dec.ny.gov/docs/fish_marine_pdf/nyas17rpt2.pdf
- Iowa DNR Angler Survey 2018: https://iowadnr.gov/media/1515/download
- Salt Water Sportsman — most caught fish by coast: https://www.saltwatersportsman.com/?p=51697
- Hawaii DAR — Wahiawā Public Fishing Area: https://dar.hawaii.gov/?p=30848
- Ziva — Godot multiplayer in 2026: https://ziva.sh/blogs/godot-multiplayer
- GodotSteam lobby template (Godot asset library): https://godotengine.org/asset-library/asset/edit/23207
- Summer Engine — publishing to Steam: https://www.summerengine.com/blog/how-to-publish-game-on-steam
- Steamworks — Content Survey: https://partner.steamgames.com/doc/gettingstarted/contentsurvey
- Playio — Steam Playtest guide: https://blog.playio.co/steam-playtest-guide
- Ziva — Publish a game on Steam: https://ziva.sh/blogs/publish-game-steam
- Wikipedia — Friendslop: https://en.wikipedia.org/wiki/Friendslop
- AppMagic — Friendslop on Steam 2025: https://appmagic.rocks/blog/friendslop-steam-games-2025
- SAH Archipedia — Lakewood Camps (Maine sporting camp): https://sah-archipedia.org/node/14561
- Maine Boats — Rangeley Lakes camps: https://maineboats.com/print/issue-135/rangeley-lakes-camps
- Claude Code Game Studios: https://github.com/donchitos/claude-code-game-studios
