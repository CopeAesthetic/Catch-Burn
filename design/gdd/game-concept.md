# Game Concept: Catch n' Burn

*Created: 2026-11-16*
*Status: In Review — written from the owner-approved brief; reviewed with `/design-review` on 2026-11-16 (lean; verdict NEEDS REVISION) and revised the same day; the revision has not been re-reviewed*

This document restates the approved one-page brief, `design/game-brief.md`, in the studio's concept format. The brief stays the detailed record of the owner's wording and every tagged decision; where the two disagree, the brief wins. New decisions are recorded in the brief first and this document is updated to match. Lines tagged **[PROPOSED]** are the studio's reading and have not been confirmed by the owner.

---

## Elevator Pitch

> It's a first-person, retro fishing collect-a-thon where you paddle a kayak, hook fish with a needle mini-game, and get higher to hook rarer ones, across 8 regions of the USA, to become the top fisherman in the country. Heavy stoner comedy, drop-in co-op.

A late-2000s / early-2010s fishing sim (*Rapala Pro Bass Fishing* 2010, *Bass Pro Shops: The Strike* 2009, *Rapala Tournament Fishing* on Wii) crossed with friendslop co-op (*Lethal Company*, *R.E.P.O.*, *PEAK*).

---

## Core Identity

| Aspect | Detail |
| ---- | ---- |
| **Genre** | First-person fishing sim / collect-a-thon / friendslop co-op comedy |
| **Platform** | PC (Windows + Linux) first; Steam Deck verified as a stretch |
| **Target Audience** | See Target Player Profile |
| **Player Count** | Single-player, with 2–4 player drop-in co-op added after the single-player game |
| **Session Length** | **[PROPOSED]** 30–60 minutes: two or three in-game days. A day lasts about 15–20 minutes from sunrise to midnight (owner decision 2026-11-16; a starting value to tune) |
| **Monetization** | Premium on Steam, cheap (friendslop pricing). Price not set |
| **Estimated Scope** | **[PROPOSED]** Large (9+ months) for a solo developer: 30 systems, 32 ponds, 320 fish. Only the MVP has a date: target 2027-02-14 (see Scope Tiers) |
| **Comparable Titles** | *Rapala Pro Bass Fishing* (2010), *Bass Pro Shops: The Strike* (2009), *Lethal Company*, *R.E.P.O.*, *PEAK*. Sales figures not researched |

Mature content: drug use, 18+. The Steam Content Survey is answered honestly.

---

## Core Fantasy

A guy whose dream is to be the top fisherman in the USA moves into a fishing shack on a pond in the North East. You are that guy: on calm water at sunrise with a cooler, a rod and nowhere to be, working your way from a Maine pond to a Puerto Rico lagoon one species at a time.

The feeling is chill, a bit silly, and quietly hooked on filling the log.

---

## Unique Hook

It's like a 2000s budget fishing game, **and also** getting high is the progression system: each strain tier opens the next rarity of fish, the world gets more vivid the higher you are, and a hunger bar is the only thing stopping you from smoking all day.

Supporting hooks:

- The BioShock 2-style needle gauge replaces the line-tension bar every old fishing game used.
- Real fish, real lakes and real regional strains, all pun-named; the hidden tier is real extinct fish and local legends (nine of the legends are not yet verified; see Open Questions).
- A working 2008 flip phone is the whole menu system.

---

## Player Experience Analysis (MDA Framework)

### Target Aesthetics (What the player FEELS)

Rankings are **[PROPOSED]**.

| Aesthetic | Priority | How We Deliver It |
| ---- | ---- | ---- |
| **Submission** (relaxation, comfort zone) | 1 | Calm water, short waits, soft failures, a day that ends by drifting off |
| **Discovery** (exploration, secrets) | 2 | 320 fish across 32 ponds, strains that reveal the next rarity, Lost Legends |
| **Fellowship** (social connection) | 3 | Drop-in co-op: passing a joint, tipping a friend's kayak, proximity voice |
| **Sensation** (sensory pleasure) | 4 | The PS1–PS2 look, vibrance rising with the Chill Meter, regional pond ambience |
| **Challenge** (obstacle course, mastery) | 5 | The 1.5 s hook-set and the needle, harder for rarer fish |
| **Fantasy** (make-believe, role-playing) | 6 | A shack of your own in every region |
| **Expression** (self-expression, creativity) | 7 | Gear loadouts; earned cosmetics for yourself, your kayak, your shack and your smoking gear |
| **Narrative** (drama, story arc) | N/A | A premise and Unc's stories, no plot |

### Key Dynamics (Emergent player behaviors)

- Players read the shade and follow it across the pond as the sun moves.
- Players weigh one more hit against the Munchies, and pack snacks before a long session.
- Players choose between Quick Sell now and The Drop Box overnight, and race midnight to get the catch in the box before it spoils.
- In co-op, players share smoke sessions and show off a YAK LOCKED moment.

### Core Mechanics (Systems we build)

1. Cast, bite and reel: hold-to-charge cast, a timed hook-set, and the needle gauge (green +1, blue +3, miss −1).
2. The Chill Meter: strain tiers that open fish rarities, five states, and YAK LOCKED.
3. Hunger → Munchies: one bar, two phases, that limits smoking and fishing until you eat.
4. Shade sweet spots on a day and night clock that ends at midnight.
5. A day-based economy: fish in The Drop Box, paid overnight; orders delivered overnight.

The full list of 30 systems is in `design/gdd/systems-index.md`.

---

## Player Motivation Profile

### Primary Psychological Needs Served

Strengths are **[PROPOSED]**. Relaxation leads this game (see the aesthetics table), so no single need is marked Core.

| Need | How This Game Satisfies It | Strength |
| ---- | ---- | ---- |
| **Autonomy** (freedom, meaningful choice) | Where to cast, when to smoke, when to sell, which pond to work | Supporting |
| **Competence** (mastery, skill growth) | The needle gets faster and tighter with rarity; gear and reading shade make you better | Supporting |
| **Relatedness** (connection, belonging) | Co-op on a friend's pond; the phone contacts (The Guy, Jimmy, Unc) | Supporting |

### Player Type Appeal (Bartle Taxonomy)

- [x] **Achievers** (goal completion, collection, progression) — How: the fishing log, 320 entries, pond and area unlocks.
- [x] **Explorers** (discovery, understanding systems, finding secrets) — How: which strain opens which fish, Lost Legends, 8 regions.
- [x] **Socializers** (relationships, cooperation, community) — How: drop-in co-op built for silly shared moments.
- [ ] **Killers/Competitors** (domination, PvP, leaderboards) — Not served, by design (see anti-pillars).

### Flow State Design

- **Onboarding curve**: taught by doing. **[PROPOSED]** The first minute ends on a guaranteed first catch, as the browser sketch did. The first strain arrives after the first sleep.
- **Difficulty scaling**: rarer fish mean a faster needle, smaller zones and more pulls. Gear modifies all of these.
- **Feedback clarity**: FISH ON runs red to green as the fish comes in; the log fills; new strains and ponds unlock by name.
- **Recovery from failure**: every failure is soft. A lost fish costs seconds; a drift-off at midnight spoils whatever is not in The Drop Box to the Quick Sell price; a blackout loses the carried fish and the Cooler. Neither ever costs the save.

---

## Core Loop

### Moment-to-Moment (30 seconds)
Paddle to shade, hold Space to cast, wait about 2–5 s, hit Space inside 1.5 s on FISH ON, stop the needle on green or blue until the fish is in. The owner played this in the browser sketch and said it "felt great".

### Short-Term (5-15 minutes)
A day on the water: fish, smoke to reach the next rarity, eat before the Munchies max out, and get the catch into The Drop Box before midnight.

### Session-Level (30-120 minutes)
A pond: Commons → Reggie → Uncommons → Home Grown → Rares → Top Shelf → Epic and Legendary. With all nine of the pond's fish logged, buy the next pond's picture on the shack Map. (A log entry is one species in one pond, so a Bluegill in two ponds is two entries: see `design/gdd/fish-database-spawn-tables.md`.)

### Long-Term Progression
Four ponds make an area; all 36 log entries in an area unlock the next area's plane ticket from Joe. Completing an area also opens that area's four Lost Legends as a victory lap, each unlocking a Straight Fire strain (owner decision 2026-11-16; this replaces waiting for all 288). Eight areas in all.

### Retention Hooks
- **Curiosity**: the next rarity, the next pond's fish, the "???" rows in Unc's log.
- **Investment**: the log, the gear, a shack in every region.
- **Social**: friends dropping into your pond.
- **Mastery**: landing a Legendary on a faster needle.

---

## Game Pillars

Approved by the owner 2026-11-16; Pillars 1 and 3 reworded with the owner's approval the same day, after `/design-review`.

### Pillar 1: The High Is the Progression
Which fish you can hook comes from the strain, never from money or gear.

*Design test*: If a new fish could be reached by paying, by better gear or by a strain, it is the strain. Money buys travel and gear; gear makes a fish easier to land, never available.

### Pillar 2: Chill First, Never Punishing
Every failure is soft and a bit funny; nothing ends the save.

*Design test*: Between losing progress and a comic setback (the blackout, drifting off at midnight), choose the setback.

### Pillar 3: Real Fish, Real Places, Pun Names
Real species, real lakes, real regional strains. The hidden tier is real extinct fish and real local legends. Invented only where stated: the home pond and the Straight Fire strains.

*Design test*: Between inventing something and using the real thing with a pun, use the real thing.

### Pillar 4: Budget Charm
PS1–PS2 look, friendslop budget, makeable by one person.

*Design test*: Between more detail and a chunkier shape with one memorable feature, choose the chunky one.

### Pillar 5: Better With Friends, Whole Alone
Every system works solo; co-op adds moments, never requirements.

*Design test*: If a feature needs two players to function, make it optional.

### Anti-Pillars (What This Game Is NOT)

- **NOT a simulation**: no line tension, no tackle physics, no licences. Realism would trade away the chill (Pillar 2) and the budget (Pillar 4).
- **NOT competitive**: no tournaments, leaderboards or PvP. Competition turns a soft failure into a loss.
- **NOT a growing or crafting game**: you buy weed, you don't grow it. A second production loop would compete with fishing for the player's time.
- **NOT mean or edgy**: no real brands, no jokes at anyone's expense. Three real names stay as respectful tributes (see the brief).

---

## Visual Identity Anchor

From `design/art/art-bible.md`, section 1, approved by the owner 2026-11-16.

**Visual rule: The world is a calm, misty pond; the high is what happens to it. Keep the base world quiet and low-fi, and let colour, never clutter, carry the joke.**

Supporting principles:

1. **Budget Charm, Built to Show.** Low-poly, 64–256 px nearest-neighbour textures, dithering and chunky UI are the style. When an asset could carry more detail, choose the readable, chunky shape with one memorable feature.
2. **Muted Until Moved.** Sober palettes are earthy and misty so the vibrance climb reads as a reward. When a colour could be punchier in the base world, choose the muted one.
3. **Read the Water First.** Fog, dither and set dressing never hide shaded-versus-lit water or a gameplay cue. When atmosphere competes with legibility, choose legibility.

---

## Inspiration and References

| Reference | What We Take From It | What We Do Differently | Why It Matters |
| ---- | ---- | ---- | ---- |
| *Rapala Pro Bass Fishing* (2010) | "TV broadcast" overlays, voiced commentary, career across real waters | Short waits; a needle gauge in place of line tension | Shows the presentation the nostalgia depends on |
| *Bass Pro Shops: The Strike* (2009) | Per-lake legendary fish, lakes unlocked in order | Strains gate rarities; hidden tier is real extinct fish | Shows a per-lake collection structure works |
| *BioShock 2* (hacking) | A needle that scores on green, more on blue | Zones move every stop; pulls add up; a miss takes one back | The reel-in model the owner named |
| *Lethal Company*, *R.E.P.O.*, *PEAK* | Cheap, low-stakes, silly co-op with proximity voice and physics comedy | No threat; the shared goal is a fishing log | Defines the co-op tone and price point |

Names, art and logos of these references cannot ship; they are direction only.

**Non-game inspirations**: Maine sporting camps (Rangeley Lakes, Moosehead) for the first shack; 2008 flip phones for the menus; late-2000s TV fishing broadcasts.

---

## Target Player Profile

Everything in this table except the first row's lower bound is **[PROPOSED]**.

| Attribute | Detail |
| ---- | ---- |
| **Age range** | 18+ (required by the content); likely 18–40 |
| **Gaming experience** | Casual to mid-core |
| **Time availability** | An hour with friends in the evening; short solo sessions |
| **Platform preference** | PC through Steam; Steam Deck |
| **Current games they play** | *Lethal Company*, *R.E.P.O.*, *PEAK* |
| **What they're looking for** | A low-stakes game to hang out in with friends, with something to collect |
| **What would turn them away** | Long waits, punishing failure, a high price, needing friends to progress |

Also: anyone with a soft spot for 2000s budget fishing games.

---

## Technical Considerations

| Consideration | Assessment |
| ---- | ---- |
| **Recommended Engine** | Godot 4.7 (4.7.2 installed), GDScript, Forward+ renderer. Free, light enough for the look, and the studio has Godot specialists |
| **Key Technical Challenges** | Host-authoritative co-op through GodotSteam; shade that reads at low resolution and is identical for every player; the PS1 look (vertex wobble, dithering, vibrance pass) in Forward+ |
| **Art Style** | 3D stylized: PS1–PS2 era low-poly at a low internal resolution |
| **Art Pipeline Complexity** | Medium (custom low-poly 3D), kept down by a parts kit for the 320 fish |
| **Audio Needs** | Moderate: ambient ponds per region, retro UI sounds, ringtones, voiced banner lines |
| **Networking** | P2P through Steam lobbies and relay, host-authoritative, 2–4 players. Single-player is built first, architected for networking from day one |
| **Content Volume** | 8 areas, 32 ponds, 320 fish, 128 strains, 8 regional shacks. Hours of gameplay not estimated |
| **Procedural Systems** | None. Catches are rolled from data tables |

All fish, strains, gear and food live in data files, never hard-coded.

---

## Risks and Open Questions

### Design Risks
- The loop was fun for one pond in the sketch; whether it holds across 32 is unproven.
- The Chill and Munchies balance is tuned on guessed numbers.
- The midnight drift-off and spoiling fish put a daily deadline on a game whose first aim is relaxation (Pillar 2, "nowhere to be"). The owner chose both rules; the Day, Night & Sleep and Economy docs must tune them so midnight rarely surprises a player, with a clear warning before it.
- Cosmetics are defined in kind (clothes, kayak and rod skins, shack decorations, smoking gear skins; all earned by fishing, never bought) but not yet mapped to milestones.

### Technical Risks
- Retrofitting co-op onto single-player state. Mitigation: the co-op state rules are written in the Save/Load design doc, 6th in the design order and ahead of every system that stores state (`design/gdd/systems-index.md`).
- The retro look and the art bible's 3:1 shade gap are unproven in Godot.
- GodotSteam on Godot 4.7: the GodotSteam release notes read on 2026-11-15 (codeberg.org/godotsteam/godotsteam/releases) say GDExtension 4.24 works on Godot 4.4 and up. Not tested here, and not in `docs/engine-reference/godot/`.

### Market Risks
- Drug-use content means an 18+ store gate and a mature-content flag (source: research brief, Steamworks Content Survey).
- Fishing and friendslop audiences overlapping enough to matter: not researched.
- Names: strain and item names that leaned on trademarks were replaced on 2026-11-15, and three real people are named as tributes. No legal review has been done.
- Wishlist targets: the research brief cites 7,000–10,000 as an indie rule of thumb; not independently verified.

### Scope Risks
- 320 fish and 8 regional shacks for one developer.
- 30 design documents before production.
- The MVP target (2027-02-14, about 13 weeks at 20 hours a week) has to cover 18 more MVP design documents as well as the Godot build. Only one MVP system (Fish Database) is designed so far.

### Open Questions
- Nine of the 32 Lost Legends are labelled folklore in the content file and none has been verified as an existing local legend. Pillar 3 requires each to be verified or replaced.
- Which milestone gives which cosmetic?
- Night fishing details (no shade, slower bites), bed at any hour, and stringer slot counts are still proposals. Day length is set at about 15–20 minutes as a starting value.
- Full list: every **[PROPOSED]** and **[OPEN]** tag in `design/game-brief.md`.

---

## MVP Definition

**Core hypothesis**: Cast → bite → needle → smoke is fun on its own, and Chill versus Munchies makes smoking a decision. The browser sketch tested this on 2026-11-16; the owner said it "felt great". The MVP re-proves it in Godot.

**Pass or fail** (the brief's kill condition, still tagged as a studio proposal there): if the loop is not fun for 15 minutes on one pond after two tuning passes, stop and redesign the needle and the Chill and Munchies balance before any further Godot work.

**Required for MVP** (19 systems, per the systems index):
1. Paddling, casting, bite timing and the needle on one pond.
2. Shade sweet spots on a day and night clock.
3. Strains, the Chill Meter, and Hunger → Munchies.
4. Fish and gear data, inventory, prices, and The Drop Box with overnight payout.
5. The record of which log entries you have caught, which the strain unlocks read.
6. A stand-in order screen at the dock for buying from The Guy and for Quick Sell (owner decision 2026-11-16). It is a placeholder; the Flip Phone replaces it in the Vertical Slice.
7. The HUD and catch banner, in the retro look.

**Explicitly NOT in MVP** (defer to later):
- The shack interior, the Flip Phone (including Unc's log screen and stories), main menu, intro, save/load and audio (Vertical Slice).
- Other ponds and areas, Jane's shop, Lost Legends, multiplayer (Alpha).
- Cosmetics (Full Vision).

### Scope Tiers (if budget/time shrinks)

Only the MVP has a target date. The later tiers are not set.

| Tier | Content | Features | Timeline |
| ---- | ---- | ---- | ---- |
| **MVP** | Lil' Puffin' Pond, greybox | The core loop, 19 systems | Target 2027-02-14 (about 13 weeks at 20 hours a week; set by the owner 2026-11-16) |
| **Vertical Slice** | Home + Lil' Puffin' Pond, finished | Adds the shack, phone (The Guy, Jimmy, Unc), menus, save/load, audio | Not set |
| **Alpha** | Full North East, then all areas with placeholder art | Adds travel, Jane, Lost Legends, co-op | Not set |
| **Full Vision** | 8 areas, 32 ponds, 320 fish | Everything, polished, plus cosmetics | Not set |

---

## Next Steps

- [x] Engine set up (Godot 4.7, GDScript)
- [x] Prototype the core idea (`prototypes/catch-n-burn/`, played by the owner)
- [x] Art bible sections 1–4 (`design/art/art-bible.md`)
- [x] Decompose the concept into systems (`design/gdd/systems-index.md`)
- [x] Review this concept (`/design-review`, 2026-11-16: NEEDS REVISION, revised the same day)
- [x] Re-review the revision (`/design-review`, 2026-11-16: APPROVED; six wording fixes applied after)
- [ ] Re-run `/gate-check systems-design`
- [ ] Design each system (`/design-system [system-name]`). Fish Database & Spawn Tables is designed and In Review; Gear & Item Database is next
- [ ] Build the vertical slice in Pre-Production (`/vertical-slice`)
