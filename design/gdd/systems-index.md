# Systems Index: Catch n' Burn

> **Status**: Draft
> **Created**: 2026-11-16
> **Last Updated**: 2026-11-17 (Player Controller designed; Day, Night & Sleep dependency rows added; Retro Rendering designed)
> **Source Concept**: design/gdd/game-concept.md (written from design/game-brief.md, which remains the detailed record)

Review gates: TD-SYSTEM-BOUNDARY, PR-SCOPE and CD-SYSTEMS were skipped (lean review mode). They are not approvals.

---

## Overview

Catch n' Burn is a first-person fishing collect-a-thon whose core loop is catch fish → sell fish → buy weed → smoke weed → unlock rarer fish → unlock better weed → repeat, across 8 regions and 32 ponds. The mechanical scope is 30 systems. A small fishing core (cast, bite, needle) sits on two data foundations (fish and gear), and is gated by a consumable progression layer (strains and the Chill Meter) that a second meter (Hunger and Munchies) holds in check. Around that sit a day-based economy that pays out overnight, a flip phone that is the whole menu system, and late-arriving co-op.

This index was written before the game's five pillars were defined (they are now in `design/gdd/game-concept.md`), so its priority reasoning cites the brief's pitch and its "what they feel" line (chill, a bit silly, quietly hooked on filling the log). Nothing in it conflicts with the pillars.

**Core**

- **Player Controller.** Walking in the shack and on the dock, paddling the kayak, and first-person look. Everything the player does starts here, so it is designed early even though it is simple.
- **Interaction (E).** Prompts and "use" for every interactable: bed, fridge, dresser, computer, Drop Box, Map, Tackle Box, Cooler, kayak.
- **Day, Night & Sleep.** The clock from sunrise to midnight, the midnight drift-off, the bed, and what happens overnight: Jimmy's payout, deliveries, and fish spoiling. It was split from shade because these rules grew.
- **Settings & Input** *(inferred)*. Named input actions for keys, mouse and gamepad, plus the Audio, Graphics, Controls and Accessibility tabs. The brief's menus name them; a gamepad layout ships at MVP (owner decision 2026-11-16, for the 60 fps Steam Deck target); accessibility options live here and in the HUD. Designed 2026-11-16: `design/gdd/settings-input.md`.
- **Scene Flow & Loading** *(inferred)*. Menu → shack → pond → other ponds and areas, with the kayak push-off cutscene and area loading screens. Each pond is its own level.
- **Retro Rendering** *(inferred)*. Low internal resolution, vertex wobble, ordered dithering, fog, the CRT option, and the vibrance and blur pass the Chill Meter drives. The art bible fixes the look; this system owns making it work in Godot. Designed 2026-11-17: `design/gdd/retro-rendering.md`. It also owns the sun's path, which Shade Sweet Spots reads, and the 3:1 shade-gap guarantee.

**Gameplay**

- **Shade Sweet Spots.** Tree shadows that move with the sun and mark where bites come fast. It is the game's one spatial decision, so it must stay readable (art bible Principle 3).
- **Casting & Tangle.** Hold-to-charge cast and the mash-to-free tangle on the bank.
- **Bite Timing.** The wait (about 5 s open, 2 s in shade, with jitter), FISH ON, the 1.5 s hook-set, and which fish bites.
- **Reel-in Needle.** The gauge: green +1, blue +3, miss −1, below 0 escapes. This is where the loop's skill lives; the owner played it in the sketch and said it "felt great".
- **Chill Meter & Smoking.** F to smoke, the five states, YAK LOCKED, and what each state does to odds and to the screen. It is the progression gate and the comedy at once.
- **Hunger, Munchies & Drunk.** The two-phase bar that limits smoking, eating, and beer with its blackout. Without it smoking is a button to spam.

**Progression**

- **Strains & Unlock Chain.** The four tiers per pond and what unlocks each.
- **Pond & Area Travel.** The shack Map's pictures, Joe's tickets, and the rule that every non-Lost-Legend species must be caught to buy the next pond.
- **Lost Legends.** The victory-lap fish, how they are hooked, and Straight Fire. An area's four open when that area's 36 other fish are caught (owner decision 2026-11-16).
- **Fishing Log & Unc.** The log of every species, Ask Unc, and Unc's stories. This is the "quietly hooked on filling the log" payoff. **It owns the record of which species have been caught** (changed 2026-11-16 after `/design-review`): strains, pond and area unlocks, and Lost Legends all read that one record. The record is MVP; the phone screen and Unc's stories arrive with the Flip Phone in the Vertical Slice.

**Economy**

- **Fish Database & Spawn Tables.** All 320 fish, junk catches, weights, and what bites where under which tier.
- **Gear & Item Database** *(inferred)*. Rods, lines, lures, smoking items, food, coolers, stringers and kayaks, and the stats each one changes. The catalogue exists in the content file, but nothing defined how gear modifies the cast, bite and needle.
- **Inventory & Storage.** Stringer, Cooler and Tackle Box slots on the water; fridge and dresser at home.
- **Economy.** Fish prices, Appraise, Quick Sell, spoilage, strain prices, tickets and pictures. The player must understand what a fish is worth before the Drop Box versus Quick Sell choice means anything.
- **Shop (Jane).** Yo Puff Delivery's three tabs.
- **Deliveries & Drop Box.** Orders, overnight delivery, and selling fish through the box. In the MVP it also owns a stand-in order screen at the dock for buying from The Guy and for Quick Sell (owner decision 2026-11-16), until the Flip Phone replaces it.
- **Cosmetics** *(inferred)*. What the dresser stores: four kinds, all earned by fishing, never bought (owner decision 2026-11-16): clothes for your fisherman, kayak and rod skins, shack decorations, and smoking gear skins. They come from milestones such as finishing a pond or an area, landing a trophy, or a Lost Legend. Because they are earned, not bought, this system depends on the Fishing Log's milestones, not on Jane's shop.

**Persistence**

- **Save/Load (Repack).** Saving, continuing, and what a save holds, including the rule that progress belongs to the host's save in co-op.

**UI**

- **Flip Phone & FishMail.** The phone, its six contacts, texts, and the computer skin.
- **HUD & Catch Banner** *(inferred)*. Meters, FISH ON, the gauge, cash, prompts, and the "TV broadcast" banner with its voiced lines.
- **Main Menu & Intro** *(inferred)*. Title, New Sesh, Repack, the placeholder intro, and the Weather Report help.
- **Home & Dock Menus** *(inferred)*. "Smoke & Tackle", "Stash", and the Drop Box, Map, fridge and dresser screens.

**Audio**

- **Audio.** Ambient ponds per region, retro UI sounds, flip-phone ringtones, voiced banner lines.

**Network**

- **Multiplayer.** Session code, host-authoritative drop-in co-op for 2–4, proximity voice, passing a joint, emotes, kayak bump and tip, and Steam start-up.

---

## Systems Enumeration

| # | System Name | Category | Priority | Status | Design Doc | Depends On |
|---|-------------|----------|----------|--------|------------|------------|
| 1 | Player Controller | Core | MVP | Designed | design/gdd/player-controller.md | Settings & Input; Gear & Item Database (soft); Scene Flow & Loading (soft); Multiplayer (soft) |
| 2 | Interaction (E) | Core | MVP | Not Started | — | Player Controller; Settings & Input; Day, Night & Sleep |
| 3 | Day, Night & Sleep | Core | MVP | Approved | design/gdd/day-night-sleep.md | — (soft: Settings & Input; Scene Flow & Loading; Multiplayer) |
| 4 | Settings & Input (inferred) | Core | MVP | Approved | design/gdd/settings-input.md | — (soft: Multiplayer; Scene Flow & Loading) |
| 5 | Scene Flow & Loading (inferred) | Core | Vertical Slice | Not Started | — | Save/Load (Repack) |
| 6 | Retro Rendering (inferred) | Core | MVP | Approved | design/gdd/retro-rendering.md | — (soft: Settings & Input; Day, Night & Sleep; Casting & Tangle) |
| 7 | Shade Sweet Spots | Gameplay | MVP | Not Started | — | Day, Night & Sleep; Retro Rendering |
| 8 | Casting & Tangle | Gameplay | MVP | Not Started | — | Player Controller; Gear & Item Database; Settings & Input |
| 9 | Bite Timing | Gameplay | MVP | Not Started | — | Casting & Tangle; Shade Sweet Spots; Fish Database & Spawn Tables; Strains & Unlock Chain; Chill Meter & Smoking; Gear & Item Database; Settings & Input; Day, Night & Sleep (soft) |
| 10 | Reel-in Needle | Gameplay | MVP | Not Started | — | Bite Timing; Fish Database & Spawn Tables; Gear & Item Database; Settings & Input |
| 11 | Chill Meter & Smoking | Gameplay | MVP | Not Started | — | Strains & Unlock Chain; Inventory & Storage; Gear & Item Database; Retro Rendering; Settings & Input |
| 12 | Hunger, Munchies & Drunk | Gameplay | MVP | Not Started | — | Chill Meter & Smoking; Inventory & Storage; Gear & Item Database; Settings & Input (soft); Day, Night & Sleep (soft) |
| 13 | Strains & Unlock Chain | Progression | MVP | Not Started | — | Fish Database & Spawn Tables; Fishing Log & Unc |
| 14 | Pond & Area Travel | Progression | Alpha | Not Started | — | Fishing Log & Unc; Economy; Scene Flow & Loading; Fish Database & Spawn Tables (soft) |
| 15 | Lost Legends | Progression | Alpha | Not Started | — | Strains & Unlock Chain; Fishing Log & Unc; Pond & Area Travel; Bite Timing; Fish Database & Spawn Tables |
| 16 | Fishing Log & Unc | Progression | MVP | Not Started | — | Fish Database & Spawn Tables |
| 17 | Fish Database & Spawn Tables | Economy | MVP | Approved | design/gdd/fish-database-spawn-tables.md | — |
| 18 | Gear & Item Database (inferred) | Economy | MVP | Approved | design/gdd/gear-item-database.md | Fish Database & Spawn Tables (soft) |
| 19 | Inventory & Storage | Economy | MVP | Not Started | — | Gear & Item Database; Fish Database & Spawn Tables; Day, Night & Sleep |
| 20 | Economy | Economy | MVP | Not Started | — | Fish Database & Spawn Tables; Gear & Item Database; Strains & Unlock Chain; Day, Night & Sleep |
| 21 | Shop (Jane) | Economy | Alpha | Not Started | — | Economy; Gear & Item Database; Inventory & Storage; Deliveries & Drop Box |
| 22 | Deliveries & Drop Box | Economy | MVP | Not Started | — | Day, Night & Sleep; Economy; Inventory & Storage; Interaction (E) |
| 23 | Cosmetics (inferred) | Progression | Full Vision | Not Started | — | Inventory & Storage; Fishing Log & Unc; Gear & Item Database (soft) |
| 24 | Save/Load (Repack) | Persistence | Vertical Slice | Approved | design/gdd/save-load.md | Gear & Item Database (soft); Settings & Input (soft); Day, Night & Sleep |
| 25 | Flip Phone & FishMail | UI | Vertical Slice | Not Started | — | Economy; Shop (Jane); Deliveries & Drop Box; Fishing Log & Unc; Pond & Area Travel; Multiplayer; Settings & Input |
| 26 | HUD & Catch Banner (inferred) | UI | MVP | Not Started | — | Chill Meter & Smoking; Hunger, Munchies & Drunk; Casting & Tangle; Bite Timing; Reel-in Needle; Economy; Fish Database & Spawn Tables (soft); Settings & Input (soft) |
| 27 | Main Menu & Intro (inferred) | UI | Vertical Slice | Not Started | — | Save/Load (Repack); Settings & Input; Scene Flow & Loading; Day, Night & Sleep |
| 28 | Home & Dock Menus (inferred) | UI | Vertical Slice | Not Started | — | Inventory & Storage; Deliveries & Drop Box; Pond & Area Travel; Interaction (E) |
| 29 | Audio | Audio | Vertical Slice | Not Started | — | Scene Flow & Loading; Day, Night & Sleep; Settings & Input (soft) |
| 30 | Multiplayer | Network | Alpha | Not Started | — | Player Controller; Save/Load (Repack); every gameplay system |

---

## Categories

| Category | Description | Systems here |
|----------|-------------|--------------|
| **Core** | Foundation systems everything depends on | Player Controller, Interaction, Day/Night & Sleep, Settings & Input, Scene Flow, Retro Rendering |
| **Gameplay** | The systems that make the game fun | Shade, Casting, Bite Timing, Needle, Chill Meter, Hunger |
| **Progression** | How the player grows over time | Strains, Travel, Lost Legends, Fishing Log |
| **Economy** | Resource creation and consumption | Fish Database, Gear Database, Inventory, Economy, Shop, Deliveries, Cosmetics |
| **Persistence** | Save state and continuity | Save/Load |
| **UI** | Player-facing information displays | Flip Phone, HUD, Main Menu, Home & Dock Menus |
| **Audio** | Sound and music systems | Audio |
| **Network** | Co-op and platform (custom category) | Multiplayer |

Narrative and Meta are not used: the intro sits with Main Menu & Intro, and accessibility sits with Settings & Input and the HUD.

---

## Priority Tiers

| Tier | Definition | Target Milestone | Design Urgency |
|------|------------|------------------|----------------|
| **MVP** | Required for the core loop to function. Without these, you can't test "is this fun?" | The loop from the browser sketch, rebuilt in Godot | Design FIRST |
| **Vertical Slice** | Required for one complete, polished area. Demonstrates the full experience. | Home + Lil' Puffin' Pond (kickoff §9) | Design SECOND |
| **Alpha** | All features present in rough form. Complete mechanical scope, placeholder content OK. | Full North East, then co-op | Design THIRD |
| **Full Vision** | Polish, edge cases, nice-to-haves, and content-complete features. | Beta / 1.0 | Design as needed |

Counts: 19 MVP · 6 Vertical Slice · 4 Alpha · 1 Full Vision.

---

## Dependency Map

### Foundation Layer (no hard dependencies)

1. Fish Database & Spawn Tables — every catch, price, log entry and unlock reads it.
2. Gear & Item Database — defines the stat-modifier contract that cast, bite, needle and meters read.
3. Settings & Input — every control goes through its named actions. Its GDD (2026-11-16) names the hard dependents: Player Controller, Interaction, Casting & Tangle, Bite Timing, Reel-in Needle, Chill Meter & Smoking, Flip Phone & FishMail, Main Menu & Intro; soft: HUD, Retro Rendering, Audio, and every system on game time (the solo pause).
4. Day, Night & Sleep — the clock that shade, payouts, deliveries and spoilage hang on.
5. Retro Rendering — the frame every visual system is drawn through.
6. Save/Load (Repack) — defines what a save is, including whose save co-op progress belongs to. (Soft: stores Gear & Item Database ids.)

### Core Layer (depends on foundation)

1. Player Controller — depends on: Settings & Input; Gear (soft); Scene Flow & Loading (soft: the push-off and climb-out); Multiplayer (soft: pushes)
2. Interaction (E) — depends on: Player Controller
3. Scene Flow & Loading — depends on: Save/Load
4. Shade Sweet Spots — depends on: Day, Night & Sleep; Retro Rendering
5. Fishing Log & Unc — depends on: Fish Database (it hears "fish landed" as an event, so it does not depend on the needle)
6. Inventory & Storage — depends on: Gear & Item Database; Fish Database

### Feature Layer (depends on core)

1. Strains & Unlock Chain — depends on: Fish Database; Fishing Log & Unc
1. Casting & Tangle — depends on: Player Controller; Gear & Item Database
2. Chill Meter & Smoking — depends on: Strains; Inventory; Gear; Retro Rendering
3. Hunger, Munchies & Drunk — depends on: Chill Meter; Inventory; Gear
4. Bite Timing — depends on: Casting; Shade; Fish Database; Strains; Chill Meter; Gear
5. Reel-in Needle — depends on: Bite Timing; Fish Database; Gear
6. Economy — depends on: Fish Database; Gear; Strains
7. Deliveries & Drop Box — depends on: Day, Night & Sleep; Economy; Inventory; Interaction
9. Shop (Jane) — depends on: Economy; Gear; Inventory; Deliveries
10. Pond & Area Travel — depends on: Fishing Log; Economy; Scene Flow; Fish Database (soft)
11. Lost Legends — depends on: Strains; Fishing Log; Pond & Area Travel; Bite Timing; Fish Database
12. Multiplayer — depends on: Player Controller; Save/Load; every gameplay system

### Presentation Layer (depends on features)

1. HUD & Catch Banner — depends on: Chill Meter; Hunger; Casting; Bite Timing; Needle; Economy; Fish Database (soft)
2. Flip Phone & FishMail — depends on: Economy; Shop; Deliveries; Fishing Log; Travel; Multiplayer
3. Home & Dock Menus — depends on: Inventory; Deliveries; Travel; Interaction
4. Main Menu & Intro — depends on: Save/Load; Settings & Input; Scene Flow
5. Audio — depends on: Scene Flow; Day, Night & Sleep

### Polish Layer (depends on everything)

1. Cosmetics — depends on: Inventory; Fishing Log & Unc; Gear (soft)

**Bottlenecks.** Fish Database (eleven systems lean on it; its doc, written 2026-11-16, added Lost Legends, Pond & Area Travel, Chill Meter & Smoking, Gear & Item Database and the HUD as direct or soft dependents beyond the six this index first listed) and Gear & Item Database (eleven, plus Multiplayer; its doc, re-reviewed 2026-11-16, added Player Controller, Bite Timing, Hunger, Cosmetics and Save/Load). Multiplayer has the opposite shape: it is designed late, but it constrains how every system holds state from the first line of code ("no singleton state that can't be replicated").

**Leaf systems.** Cosmetics, Lost Legends, Audio, Main Menu & Intro: nothing depends on them, so they can be designed late.

---

## Recommended Design Order

| Order | System | Priority | Layer | Agent(s) | Est. Effort |
|-------|--------|----------|-------|----------|-------------|
| 1 | Fish Database & Spawn Tables | MVP | Foundation | systems-designer, economy-designer | M |
| 2 | Gear & Item Database | MVP | Foundation | systems-designer, economy-designer | M |
| 3 | Settings & Input | MVP | Foundation | ux-designer, godot-specialist | S |
| 4 | Day, Night & Sleep | MVP | Foundation | game-designer | S |
| 5 | Retro Rendering | MVP | Foundation | technical-artist, godot-shader-specialist | M |
| 6 | Save/Load (Repack) | Vertical Slice | Foundation | lead-programmer, game-designer | M |
| 7 | Player Controller | MVP | Core | game-designer | S |
| 8 | Interaction (E) | MVP | Core | game-designer, ux-designer | S |
| 9 | Fishing Log & Unc | MVP | Core | game-designer, writer | S |
| 10 | Strains & Unlock Chain | MVP | Feature | game-designer | S |
| 11 | Shade Sweet Spots | MVP | Core | game-designer, technical-artist | M |
| 12 | Inventory & Storage | MVP | Core | systems-designer | M |
| 13 | Casting & Tangle | MVP | Feature | game-designer | S |
| 14 | Chill Meter & Smoking | MVP | Feature | game-designer, systems-designer | M |
| 15 | Hunger, Munchies & Drunk | MVP | Feature | systems-designer | S |
| 16 | Bite Timing | MVP | Feature | game-designer, systems-designer | S |
| 17 | Reel-in Needle | MVP | Feature | game-designer | M |
| 18 | Economy | MVP | Feature | economy-designer | L |
| 19 | Deliveries & Drop Box | MVP | Feature | game-designer, economy-designer | S |
| 20 | HUD & Catch Banner | MVP | Presentation | ux-designer, art-director | M |
| 21 | Scene Flow & Loading | Vertical Slice | Core | game-designer, godot-specialist | S |
| 22 | Flip Phone & FishMail | Vertical Slice | Presentation | ux-designer | L |
| 23 | Home & Dock Menus | Vertical Slice | Presentation | ux-designer | M |
| 24 | Main Menu & Intro | Vertical Slice | Presentation | ux-designer, narrative-director | S |
| 25 | Audio | Vertical Slice | Presentation | audio-director, sound-designer | M |
| 26 | Pond & Area Travel | Alpha | Feature | game-designer | S |
| 27 | Shop (Jane) | Alpha | Feature | economy-designer, ux-designer | S |
| 28 | Lost Legends | Alpha | Feature | game-designer | S |
| 29 | Multiplayer | Alpha | Feature | network-programmer, technical-director | L |
| 30 | Cosmetics | Full Vision | Polish | game-designer | S |

Effort: S = 1 session, M = 2–3 sessions, L = 4+ sessions. These are estimates, not measurements.

Chill Meter & Smoking (14) and Hunger, Munchies & Drunk (15) are designed back to back because of the cycle below.

**Save/Load is designed 6th although it is a Vertical Slice system** (changed 2026-11-16 after the producer's gate finding). Its design doc decides who owns a save, and it must carry a short "co-op state rules" section: what the host holds, what replicates, and what a guest keeps. Inventory (12th) and Economy (18th) store state, so those rules have to exist before their docs fix a shape for it. Building Save/Load still waits for the Vertical Slice; only the design moves up.

---

## Circular Dependencies

- **Chill Meter & Smoking ↔ Hunger, Munchies & Drunk.** Smoking speeds up Hunger and Munchies, and maxed Munchies blocks smoking and fishing. Resolution: a two-line contract. Chill Meter announces "smoked" with the hit's size; Hunger exposes "can act". Neither reads the other's internals, and the two GDDs are written back to back.
- **Avoided: Strains → Fishing Log → Reel-in Needle → Bite Timing → Strains.** Strains read the caught-species record, and bites read the strain tier. The loop is cut by having the needle announce "fish landed" as an event that the Fishing Log hears; the log depends only on the Fish Database.
- **Gear & Item Database ↔ the systems gear modifies** (Casting, Bite Timing, Needle, Chill Meter, Hunger, Inventory). Gear changes their numbers, and they define the numbers. Resolution: the Gear database owns the list of stat keys and how modifiers stack; each gameplay system owns its base values. This is why Gear is designed second.

---

## High-Risk Systems

| System | Risk Type | Risk Description | Mitigation |
|--------|-----------|-----------------|------------|
| Multiplayer | Technical / Scope | Host-authoritative co-op through GodotSteam touches every system. Retrofitting it onto single-player state is the classic failure. A local build cannot show how it feels with latency. GodotSteam on Godot 4.7 is not covered by `docs/engine-reference/godot/`. | The co-op state rules are written in the Save/Load GDD (6th). Check GodotSteam against Godot 4.7 before the Multiplayer GDD. Test with real peers. |
| Fish Database & Spawn Tables | Scope | 320 fish need data and recognisable art. A solo developer cannot hand-draw 320 unique models. | The art bible's parts-kit rule for fish. Build North East's 40 first and measure the cost per fish. |
| Shade Sweet Spots | Technical / Design | Shade must read at low resolution through fog and dither, and must be the same for every player in co-op. | Compute shade from sun and tree positions, not from the renderer. Check the art bible's 3:1 shade gap in engine. |
| Retro Rendering | Technical | The sketch's look was built in three.js. Vertex wobble, dithering and the vibrance pass are unproven in Godot 4.7 Forward+. | An engine prototype (`/prototype --path engine`) for the look and the shade gap before art production. |
| Economy | Design | Prices must stay meaningful across 32 ponds, 128 strains and two ways to sell, with spoilage. | Model it with `/balance-check` once the Fish and Gear databases exist. The sketch's numbers are guesses. |
| Save/Load (Repack) | Technical / Design | Co-op progress belongs to the host's save and a guest's save is untouched. That rule shapes the save format. | Its GDD is 6th in the design order, ahead of every system that stores state, and includes the co-op state rules. |
| Cosmetics | Scope | Four kinds of earned cosmetic is a lot of art for one developer, and clothes only show in co-op. | Stay at Full Vision; start with kayak and rod skins, which the player always sees. |

---

## Progress Tracker

| Metric | Count |
|--------|-------|
| Total systems identified | 30 |
| Design docs started | 7 |
| Design docs reviewed | 6 |
| Design docs approved | 6 |
| MVP systems designed | 6/19 (Player Controller: Designed 2026-11-17, lean, not yet reviewed; owner decisions: free look in the kayak with A/D turning, strafe on foot, co-op tip and bump defined provisionally, kayak steps Sit-on-Top +0.75 m/s / +1.5 and Pedal +1.5 m/s / +3.0; counts corrected 2026-11-17 to include Day, Night & Sleep; Day, Night & Sleep: Designed 2026-11-17, lean; first design review 2026-11-17 NEEDS REVISION, 4 blockers (Formula 2 and AC-4 numbers, the grace's missing catch interface, no Paused path in the grace, the overnight cap), fixed the same day; Approved at the second review, 2026-11-17, lean, 0 blockers, 11 recommended items open (none of the first review's ten was applied); Retro Rendering: Designed 2026-11-17, lean; first design review 2026-11-17 NEEDS REVISION, 1 blocker (CRT darkening counted in the wrong colour space), fixed the same day with all 9 recommended items; Approved at the second review, 2026-11-17, lean, 0 blockers; its 3 recommended items (dither margin on the load check, AC-12 capture times, rule 15 gap match) applied after approval, not re-reviewed; Settings & Input: Designed 2026-11-16, lean; five design reviews, all NEEDS REVISION (the fifth, 2026-11-17, found 1 blocker, the unconfirmed display mode being saved; fixed the same day with six recommended items); Approved at the sixth review, 2026-11-17, lean, 0 blockers, 8 recommended items open (review log entry not yet written); Fish Database: Approved at the fourth review, 2026-11-16, lean, 0 blockers; index rows, brief wording and Tuning Knobs done after approval; later the same day, owner decisions added a missing-rarity Chill term, the YAK split knob, rule 11 and AC-45 to AC-49, not re-reviewed; Gear & Item Database: Approved at the third review, 2026-11-16, lean, 0 blockers; recommended items 1–4 and Open Question 1 settled after approval) |
| Vertical Slice systems designed | 1/6 (Save/Load (Repack): Designed 2026-11-17, lean; first design review 2026-11-17 NEEDS REVISION, 3 blockers (wake-up save timing, shack vs pond, Settings quit path), fixed the same day with the recommended items; Approved at the second review, 2026-11-17, lean, 0 blockers, its 8 recommended items applied the same day with owner decisions; third review 2026-11-17, lean: Approved, 0 blockers, all 8 verified, 4 recommended items open; owner decisions: 3 slots, saves at wake-up and Turn & Burn (window close counts), guest records by Steam ID in the host's save) |

---

## Next Steps

- [x] Review and approve this systems enumeration (owner, 2026-11-16)
- [ ] Review the concept (`/design-review design/gdd/game-concept.md`) before the first system doc
- [ ] Design MVP-tier systems first (use `/design-system [system-name]`)
- [ ] Prove the retro look and the 3:1 shade gap in Godot (`/prototype --path engine`) before or alongside the Retro Rendering (5th) and Shade Sweet Spots (11th) docs, and before any art production
- [x] MVP target date set: 2027-02-14, at about 20 hours a week (owner, 2026-11-16)
- [ ] Test GodotSteam on Godot 4.7 and add it to `docs/engine-reference/godot/` before the Multiplayer doc (29th)
- [ ] Re-review the revised concept in a fresh session (`/design-review design/gdd/game-concept.md`) before the first system doc
- [ ] Run `/design-review` on each completed GDD
- [ ] Run `/gate-check technical-setup` when MVP systems are designed
- [ ] Validate the highest-risk systems with `/vertical-slice` before committing to Production
