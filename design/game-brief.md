# Game Brief: Catch n' Burn

Status: **approved by the owner 2026-11-15** · built from the kickoff prompt v0.2 plus the owner's 14 decisions of 2026-11-15 and the five prototype answers below.
Sources of truth: `docs/research/catch-n-burn-research.md` and `design/catch-n-burn/content-areas-fish-strains.md`.

How to read this: plain text is the owner's wording from the kickoff prompt. **[DECIDED]** marks a rule the owner confirmed on 2026-11-15 that changes or adds to the prompt. **[PROPOSED]** marks something the studio added that the owner has not confirmed yet.

**Pitch:** A first-person, retro fishing collect-a-thon with heavy stoner comedy and drop-in co-op. A late-2000s / early-2010s fishing sim (think *Rapala Pro Bass Fishing* 2010, *Bass Pro Shops: The Strike* 2009, *Rapala Tournament Fishing* on Wii) crossed with **friendslop** co-op (low-stakes, silly, cheap, best with friends — *Lethal Company*, *R.E.P.O.*, *PEAK*).

**Genre:** First-person fishing sim / collect-a-thon / friendslop co-op comedy. Mature (drug use), 18+.

**Controls:** **WASD** move and paddle · **E** interact · hold **Space** to charge a cast, release to cast; **Space** to set the hook and stop the needle · **F** smoke · **Tab** Flip Phone · mouse to look and to click the phone. **[PROPOSED]** all input goes through named actions from day one so a gamepad layout (needed for the Steam Deck stretch goal) is a mapping, not a rewrite.

**Question:** **[PROPOSED]** Is the cast → bite → needle → smoke loop fun enough on its own to carry 320 fish, and does the Chill / Munchies push-pull make smoking a decision instead of a button to spam?

**Hooks:**
- Getting high is the progression system: each strain tier opens the next rarity of fish.
- The BioShock 2-style needle replaces the tension bar every old fishing game used.
- Real fish, real lakes, real regional strains — all pun-named. The hidden tier is real extinct and folklore fish, so it reads as history rather than fantasy.
- PS1–PS2 look with "TV broadcast" catch banners and a working 2008 flip phone as the whole menu system.
- Friendslop moments: passing a joint between kayaks, tipping a friend, watching them get YAK LOCKED.

**Intent:** Sell on Steam (PC first). Solo dev. Charm over fidelity, friendslop-grade budget.

## In your words

The core loop: **catch fish → sell fish → buy weed → smoke weed → unlock rarer fish → unlock better weed → repeat** across 8 regions of the USA.

**Story:** a guy whose dream is to be the top fisherman in the USA moves into a fishing shack on a pond in the North East. That is where the game begins.

Title **"Catch n' Burn"**, subtitle **"High Times = High Tips"**.

Comedy is chill and goofy, never mean. Puns on pond and strain names, real names for fish. No real people, no real brands. Treat the culturally significant Lost Legends (e.g., the Lost River Sucker / C'waam) respectfully.

After the brief was approved, the owner's answers for the browser sketch (`prototypes/catch-n-burn/`, its own brief beside it):
1. View: "3D."
2. Casting: "move around"
3. Money: "quick menu is available but less convenient and rewarding than The Drop Box."
4. End: "Fish as long as you like but once you catch the legendary you can buy the pictures on the map to the next pond in that area"
5. Difficulty: "yeah i like that" (Commons easy, the Legendary takes a few tries)

**[DECIDED]** Three real names stay as respectful tributes, each with a true story told by Unc: **Jack Herer** (Jack Herring), **Jenny Kush** (Jenny Kush Jig) and **Les Anderson** (Les Anderson's King). No jokes at their expense. No living real people and no real people as characters. Brand-derived names in the content file were replaced on 2026-11-15.

## Look and references

**PS1–PS2 era graphics** with late-2000s fishing-game structure.

- Low-poly models, low-res textures (64–256 px) with nearest-neighbour filtering.
- PS1-style vertex snapping and affine texture wobble (toggleable in Graphics settings).
- Ordered dithering, distance fog to hide draw distance.
- Simple vertex lighting with a warm time-of-day tint.
- Chunky early-2000s UI.
- Low internal resolution scaled up, with a CRT/scanline filter as an option.
- Keep the fishing-game presentation: "TV broadcast" catch banners and cheesy voiced lines.

**Reference games:** *Rapala Pro Bass Fishing* (2010), *Bass Pro Shops: The Strike* (2009), *Rapala Tournament Fishing* (Wii), *BioShock 2* (hacking minigame only), *Lethal Company*, *R.E.P.O.*, *PEAK*.

**Home reference:** a Maine sporting-camp style cabin — small, rustic, dark-stained log or board-and-batten walls, green tin roof, screened front porch with a rod rack and two Adirondack chairs, stone chimney, woodstove inside, exposed beams, knotty-pine interior, a mounted brook trout and a deer head, flannel blanket on a creaky bed, fish-print curtains, a beer-sign glow, an old CRT computer, a dented fridge. Outside: spruce, birch and white pine, a small sandy front beach, a weathered wood dock out into a calm, misty pond with a rowboat tied up.

**Audio reference:** a North-Eastern pond at dusk (loons, peepers, lapping water, wind in pines); ambient ponds per region; retro UI sounds; flip-phone ringtones.

## First minute

1. Main menu. Title, subtitle, dusk-pond audio. First launch, no save: one option, **"New Sesh"**. With an existing save, **"Repack"** (continue) appears as well. Lower-right **settings icon** → Audio, Graphics, Controls.
2. **New Sesh** → short **placeholder intro cutscene** telling the backstory and explaining the mechanics. Never shown on Repack. (**Repack** → **loading screen of the player's current area**, then load the save.)
3. You wake up in the shack at Lil' Puffin' Pond. Walk with WASD, press E on things.
4. Walk out to the dock. **Tackle Box** → "Smoke & Tackle". **Cooler** → "Stash". **Kayak** → cutscene of climbing in and pushing off the dock.
5. Paddle to a patch of shade, hold Space, cast. **"FISH ON"**. Hit Space, land the needle on green. First Pumpkinseed, with a broadcast banner.

## Challenge

- **The 1.5 s hook-set.** On open water, after a **5 s** wait "FISH ON" pops up; you have **1.5 s** to press Space or the fish is lost. In a sweet spot the 5 s wait drops to **2 s**; the 1.5 s window stays the same. **[DECIDED]** 5 s and 2 s are averages with about ±1 s of jitter, so the bite cannot be counted out; tuned in the prototype.
- **The needle.** Stop on **green** = +1 pull closer, **blue** (smaller, harder) = +3, anything else = −1 (fish pulls away). Pull total below 0 = fish escapes. Rarer fish = faster needle, smaller zones, more pulls required. Gear modifies all of these.
- **Tangles.** A cast that lands on shore tangles the line → button-mashing mini-game to free it.
- **Managing the high.** Smoking opens rarer fish but drains Hunger faster. When Munchies is maxed you cannot fish or smoke until you eat. This is the anti-spam balance on smoking.
- **Reading the pond.** Shade moves with the sun; sweet spots move with it.
- **The beer.** 10 beers = screen goes black, you wake up with 0 fish and 0 weed in your inventory. **[DECIDED]** You lose only the fish you are carrying and what is in the Cooler; cash, The Drop Box and weed stored at home are safe.

## Core loop

**Catch fish → sell fish → buy weed → smoke weed → unlock rarer fish → unlock better weed → repeat.**

| Timescale | What happens |
|---|---|
| Seconds | Charge cast → wait → FISH ON → hook-set → needle stops → catch (rainbow flash) or escape |
| Minutes | Paddle to shade, smoke (F), watch the Chill Meter, eat before Munchies max out |
| A day | Fish → drop the catch in The Drop Box → order from The Guy and Jane → sleep → collect cash and deliveries from The Drop Box → load the Cooler |
| A pond | Commons → Reggie → Uncommons → Home Grown → Rares → Top Shelf → Epic + Legendary → next pond pinned on the shack Map |
| An area | 4 ponds → 4th pond's Legendary → buy a ticket from Joe → new shack, dock and Map |
| The game | 8 areas, 288 fish → Lost Legends → Straight Fire victory laps |

## Goal & fail state

**Goal:** become the top fisherman in the USA. Fill Unc's fishing log: all **320** fish across 8 areas and 32 ponds, ending with the 32 Lost Legends. The last fish in the game is El Rey Sábalo at Laguna San JOINT-sé.

**Fail states (all soft — nothing ends the save):**
- Miss the 1.5 s window → fish lost.
- Needle pull total below 0 → fish escapes.
- Cast lands on shore → tangle.
- Munchies maxed → cannot fish or smoke until you eat.
- 10 beers → blackout, wake up with 0 fish and 0 weed in your inventory (carried fish and Cooler contents only).
- Broke → Quick Sell at a decreased value.

## Features

### Menus

**Main menu** — as in *First minute*.

**In-game Flip Phone (Tab)** — a clickable flip-phone HUD that looks and behaves like a 2008 flip phone (opening animation, keypad, tiny LCD, ringtones).

- **Menu** → quit menu with 3 options:
  1. **Turn & Burn** — Save & Quit
  2. **Tackle-box** — Options
  3. **Weather Report** — Help: current controls and useful tips
- **Speed Dial** → contacts:
  1. **The Guy** — the dealer. Buy grams of strains with cash. Orders arrive in **The Drop Box** inside the shack **after you sleep**. Once collected, load them into the Cooler to smoke on the water.
  2. **Jimmy (Fish Guy)** — sell fish for cash. **Appraise** caught fish for a fee to see their value; **Quick Sell** for instant (lower) cash when you're broke or don't want to end the day. **[DECIDED]** To sell at full value you have to drop the fish in **The Drop Box**; Jimmy pays overnight, while you sleep. Quick Sell is instant and pays a decreased value (**[PROPOSED]** about 60%, to tune).
  3. **Joe (Travel Guy)** — buy plane tickets with cash to newly unlocked areas, and pick which area to fish. **[DECIDED]** Joe handles areas only; ponds inside an area are reached from the shack **Map**.
  4. **Jane (Yo Puff Delivery)** — shop with tabs: **Fishing Items**, **Smoking Items**, **Food Items** (catalogue in the content file). Items scale by rarity.
  5. **John (Unc)** — fishing log: every species caught, how many caught and sold. Button at the bottom: **"Ask Unc"** → random inspirational fishing quote or useful tip. **[DECIDED]** Unc also tells **Unc's stories**: the true story behind a tribute name once you have caught or bought it (drafts in the content file). Lost Legends appear in the log as trophy photos.
  6. **Jordan (Homie)** — multiplayer: shows **your session code**; below it a field to **enter a friend's code**; below that a **"Go Fishin'?"** button that joins that session.

### Home (North East — Lil' Puffin' Pond)

First-person, **WASD** to move, **E** to interact.

Inside the shack:
1. **Bed** — sleep to skip the night (deliveries arrive while you sleep).
2. **Fridge** — food and beer. Food lowers munchies. Beer makes you drunk; **10 beers = screen goes black, you wake up with 0 fish and 0 weed** in your inventory.
3. **Computer** — opens Speed Dial, re-skinned as a Gmail-style webmail called **"FishMail"**.
4. **The Drop Box** — collect all deliveries. **[DECIDED]** It works both ways: drop fish in to sell them to Jimmy overnight, and collect the cash with your deliveries after you sleep.
5. **Map** **[DECIDED]** — a wall map of the area. It shows the area's 4 ponds as pictures, pins each one as it unlocks, and is how you travel to them. Once you catch a pond's Legendary you can buy the picture of the next pond in that area on the Map; buying it is what opens that pond.

On the dock:
- **Tackle Box** → **"Smoke & Tackle"** menu to equip fishing and smoking items.
- **Cooler** → **"Stash"** menu to choose which strains and food to bring on the water. Limited slots; bigger coolers from Jane.
- **Kayak** → starts fishing. Loading screen = **cutscene of climbing into the kayak and pushing off the dock**.

**Every area has its own home base:** when you fly to a new area you get a **new shack and dock** there, styled for the region (e.g., a Florida stilt fish camp, a Midwest A-frame, a PNW cedar cabin, a Southwest adobe casita, an Island plantation-style cottage), with the same interactables (bed, fridge, computer, Drop Box, Map, tackle box, cooler, kayak). Pond 1 of each area is the home pond. **[DECIDED]** The other 3 ponds are reached from the **Map** in the shack, which replaces the dock travel menu and paddling between ponds; each pond is its own level.

### The Pond (fishing)

- First-person in the kayak, **WASD** to paddle. The pond is one continuous space with Home; paddling back to the dock prompts **E** to get out.
- **Sweet spots:** as the sun moves, trees and brush on the bank cast shadows onto the water; shaded water is a sweet spot where bites come faster and more often. Day/night cycle drives this.
- **Casting:** hold **Space** to charge, release to cast straight ahead where you look; hold time = distance.
- **Tangles:** a cast that lands on shore tangles the line → **button-mashing mini-game** to free it.
- **Bite:** on open water, after a **5 s** wait **"FISH ON"** pops up; you have **1.5 s** to press Space or the fish is lost. In a sweet spot the 5 s wait drops to **2 s**; the 1.5 s reaction window stays the same. **[DECIDED]** Both waits are averages with about ±1 s of jitter.
- **Nothing left to catch sober:** once a pond's 3 Commons are all logged and you're Sober, casts keep landing Commons (sellable duplicates) **mixed with junk catches** — old boots, beer cans, a tire, a soggy pizza box, a lost lighter (junk sells for pennies or is just funny). After a few of these the **flip phone buzzes** with a text: **"go smoke somethin' -The Guy"**.
- **Reel-in mini-game — modeled on BioShock 2's hacking:** a needle sweeps across a gauge.
  - Stop on **green** = +1 pull closer, **blue** (smaller, harder) = +3, anything else = −1 (fish pulls away).
  - Pull total below 0 = fish escapes.
  - "FISH ON" text starts **red** and shifts through the colours to **green** as the fish gets closer; on a catch it **flashes rainbow**.
  - Rarer fish = faster needle, smaller zones, more pulls required. Gear modifies all of these.

### Progression

**Fish rarities per pond (10 fish):** 3 Common · 2 Uncommon · 2 Rare · 1 Epic · 1 Legendary · 1 Lost Legend.
**Strain tiers per pond (4 strains), lowest to highest:** **Reggie** → **Home Grown** → **Top Shelf** → **Straight Fire** (hidden). Each tier is stronger and rarer than the one before it.

**Unlock chain (same in every pond):**
1. Sober, you can only hook that pond's **Commons**. Catch all 3 → **Reggie** unlocks at The Guy.
2. While under a **Reggie** strain from that pond you can hook its **Uncommons**. Catch both → **Home Grown** unlocks.
3. While under **Home Grown** you can hook its **Rares**. Catch both → **Top Shelf** unlocks.
4. While under **Top Shelf** you can hook its **Epic** and **Legendary**. Catch both → the **next pond** unlocks. **[DECIDED]** The unlock is bought: once the Legendary is caught, the next pond's picture goes on sale on the shack Map.
5. Catching the 4th pond's Legendary unlocks the **next area** (buy the ticket from Joe).
6. **Top Shelf YAK LOCK bonus:** smoke a pond's Top Shelf until the Chill Meter hits 100% → your next cast is a guaranteed 50/50 Epic-or-Legendary from that pond. **[DECIDED]** The bonus needs the extra hit: reach 100%, then smoke once more to go YAK LOCKED.

**[DECIDED] What each tier lets you hook:**
- A tier opens everything up to its rarity, not only the top one: under Top Shelf, casts can land Commons through Legendary, weighted.
- A higher Chill state (Chill → High → Stoned → Zonked) improves the odds of the rarer fish.
- The strain has to be from that pond. A strain from another pond gives the Chill visuals but opens no rarity. The one exception is the Lost Legend rule below.

**Areas, in difficulty order:** North East → Mid Atlantic → South East → Mid West → Pacific Northwest → West Coast → South West → US Islands. Every area has real regional fish, real popular lakes, and regional strains — all pun-named (see the content file).

**Lost Legends (endgame):** hidden until all **288** non-Lost-Legend fish (8 areas × 4 ponds × 9) are caught. There is **one Lost Legend per pond (32 total)**. To hook a pond's Lost Legend, smoke the **Top Shelf of the next pond in the same area** (Pond 1 → needs Pond 2's Top Shelf, Pond 2 → Pond 3's, Pond 3 → Pond 4's); **each area's Pond 4 needs the Top Shelf from Pond 1 of that same area**. Your next cast hooks the Lost Legend. Catching it unlocks that pond's **Straight Fire** strain. Lost Legends are photographed and released, not sold. **[DECIDED]** Confirmed; the reward is the Straight Fire unlock plus a trophy photo in Unc's log.

**[DECIDED] Straight Fire is the victory-lap strain:** under a pond's Straight Fire, every rarity in that pond can bite, with boosted odds and boosted sale value.

### Smoking & the Chill Meter

- Press **F** while fishing to smoke — only if the Cooler holds cannabis **and** a smoking item is equipped from the Tackle Box.
- Strength by tier: Reggie fills the Chill Meter least, Straight Fire most. Gear multiplies it (gas mask = ×2 of any item).
- **Chill Meter** = HUD bar showing how much strain effect is left; it drains over time.

| Meter | State | Effect |
|---|---|---|
| 0% | **Sober** | none |
| 1–24% | **Chill** | strain tier effect; colour vibrance +15% |
| 25–49% | **High** | strain tier effect; vibrance +30% |
| 50–74% | **Stoned** | strain tier effect; vibrance +45% |
| 75–100% | **Zonked** | strain tier effect; vibrance +60% |
| smoke again at 100% | **YAK LOCKED** | screen blurs, "YAK LOCKED" text; vibrance +100% |

**[DECIDED]** Band edges adjusted so each percentage sits in one state (the prompt had 25, 50 and 75 in two).

**Hunger → Munchies meter (one meter, two phases):**
- It starts as **Hunger**, full, and depletes over time. **Smoking drains it faster** — this is the anti-spam balance on smoking.
- When Hunger hits 0 the same bar flips to **Munchies** and starts **filling up**; smoking fills it faster.
- **When Munchies is maxed you cannot fish or smoke until you eat.** Food from the Cooler (on the water) or the Fridge (at home) lowers Munchies, and once it is back to 0, refills Hunger. Stronger foods do more (see the Food table in the content file).
- **Drunk meter** from fridge beer (10 = blackout; you lose carried fish and Cooler contents only).

### Multiplayer (friendslop)

- **2–4 players**, host-authoritative drop-in co-op on the host's pond.
- Session code = the host's **Steam lobby ID** shown in Jordan (Homie); "Go Fishin'?" joins via GodotSteam.
- Friendslop moments to design for: proximity voice chat, passing a joint between kayaks, seeing a friend YAK LOCKED, kayak bump/tip physics, shouting "FISH ON" emotes.
- Progression is **session/save specific**: catches, cash and unlocks made in a session belong to that session's save (the host's). A guest's own save is untouched by fishing in a friend's session.
- Build single-player first; architect for networking from day one (no singleton state that can't be replicated).

### Content

8 areas · 32 ponds · 320 fish · 128 strains · shop catalogue (fishing items, smoking items, food) — all in `design/catch-n-burn/content-areas-fish-strains.md`.

All fish, strains, gear and food must live in **data files** (JSON or Godot Resources), never hard-coded.

## Your systems

One `/design-system` GDD each:

1. Player controller (walk/paddle)
2. Interaction (E)
3. Day/night & shadow sweet spots
4. Casting & tangle mini-game
5. Bite timing
6. Reel-in needle mini-game
7. Fish database & spawn tables (data-driven from the content file)
8. Strain database & unlock chain
9. Chill Meter & visual effects
10. Munchies, hunger & drunk meters
11. Inventory, Cooler & Tackle Box
12. Economy (fish prices, appraisal, quick sell, strain prices, tickets)
13. Shop (Jane)
14. Deliveries & Drop Box
15. Fishing log & Ask Unc quotes
16. Flip Phone & FishMail UI
17. Save/load (Repack)
18. Area travel (Joe) and pond travel (shack Map)
19. Lost Legends
20. Multiplayer
21. Audio (ambient ponds per region, retro UI sounds)

## Keep

From the 2000s fishing games (research brief §3):
- The retro power-meter cast and the bite prompt.
- The store-and-upgrade loop.
- Per-lake legendary fish and a catch log.
- "TV broadcast" overlays and voiced commentary.
- The long loading screen — turned into a feature with the kayak push-off cutscene.

From friendslop (research brief §6): cheap price, low skill floor, low-fi 3D, physics comedy, proximity/voice chat, a shared goal.

## Avoid

- Repetitive waiting, unresponsive controls, too-easy fights, long loads, store menus that break flow (the known complaints about the reference games).
- The line-tension meter — replaced by the needle.
- Real brand names or logos (use "Puff-Go", generic snack names, etc.). No real people, apart from the three tribute names with Unc stories.
- Mean comedy. Jokes on culturally significant entries (the C'waam entry has no puns).
- Hard-coded content.
- Singleton state that can't be replicated.

## Out of scope

**For the first milestone (vertical slice):** multiplayer; every pond except Lil' Puffin' Pond; every area except North East; Joe, Jane and Jordan on the phone; the regional shacks; final cutscene art (the intro is a placeholder).

**For 1.0 [PROPOSED]:** competitive modes and tournaments; motorboats; fish fights beyond the needle; growing or crafting weed; consoles and mobile; more than 4 players; cross-save of guest progress.

## Build order

**First milestone — vertical slice.** Home + Lil' Puffin' Pond only: main menu (New Sesh / Repack / settings), placeholder intro, shack interactables, dock objects, kayak push-off cutscene, paddling, cast + tangle, bite timing, needle reel-in, the pond's 10 fish and 4 strains, F to smoke, Chill Meter states, Flip Phone with The Guy, Jimmy and Unc working, save/load. No multiplayer yet. Use `/prototype` to sketch the cast → bite → needle → smoke loop first so we can tune the feel before building the 3D slice in Godot.

**[DECIDED] Slice adjustments:**
- You start with a **One Hitter**, because Jane's shop is not in the slice and smoking needs a smoking item.
- Nine fish and three strains are reachable by the real rules. The 10th fish (Silver Trout) and the 4th strain (Silver Smoke) need 288 fish and Pond 2, so in the slice they sit behind a **debug toggle**.
- The prototype is a double-click browser build of the loop, made with the template's `/prototype`; the Godot work starts after it is tuned.
- **[PROPOSED]** The shack Map is in the slice with only Lil' Puffin' Pond pinned and the other three shown locked.

**Release path.** Vertical slice → full North East → Steam page + wishlists ($100 Steam Direct fee) → **Steam Playtest** closed beta → multiplayer → Steam Next Fest demo → 1.0. Answer the **Steam Content Survey** honestly (drug-use content, mature, 18+).

**Studio path.** `/brainstorm` (this file) → `/prototype` → `/art-bible` → `/map-systems` → `/gate-check`, then `/design-system` for each system above.

**Tech.** Godot 4 (latest stable), GDScript, 3D, Forward+ renderer. Steam integration via **GodotSteam** (GDExtension). PC (Windows + Linux) first, Steam Deck verified as a stretch. Commit per feature, Git LFS for audio/models/textures, GitHub Actions for Windows/Linux exports later.

---

**Kill condition:** **[PROPOSED — owner to set]** If the prototype's cast → bite → needle → smoke loop is not fun for 15 minutes on one pond after two tuning passes, stop and redesign the needle and the Chill / Munchies balance before any 3D work.

**Who it's for / what they feel:** Friend groups who play friendslop, and anyone with a soft spot for 2000s budget fishing games. They should feel chill, a bit silly, and quietly hooked on filling the log. **[PROPOSED]**

**Games you love / don't:** Love — *Rapala Pro Bass Fishing* (2010), *Bass Pro Shops: The Strike* (2009), *Rapala Tournament Fishing* (Wii), *Lethal Company*, *R.E.P.O.*, *PEAK*, the BioShock 2 hacking needle. Don't — the waiting, the tension bar and the load times in those same fishing games.
