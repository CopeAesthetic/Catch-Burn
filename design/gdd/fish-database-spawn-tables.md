# Fish Database & Spawn Tables

> **Status**: Designed (pending review)
> **Author**: owner + design-system skill
> **Last Updated**: 2026-11-16
> **Last Verified**: 2026-11-16
> **Implements Pillar**: Pillar 3 (Real Fish, Real Places, Pun Names); Pillar 1 (The High Is the Progression)
> **Creative Director Review (CD-GDD-ALIGN)**: SKIPPED 2026-11-16 — lean mode
> **Independent review**: not done. Run `/design-review design/gdd/fish-database-spawn-tables.md` in a fresh session.

## Summary

The catalogue of every fish and junk item in the game, and the rules that decide what a cast brings up. It gives the player a reason to get higher: a strain tier opens the next rarity, the Chill state improves the odds, and each catch rolls a weight that can be a trophy. It exists so that everything else (the log, the strains, prices, the needle) reads one shared answer to "what just bit".

> **Quick reference** — Layer: `Foundation` · Priority: `MVP` · Key deps: `None`

## Overview

The Fish Database is the game's catalogue of everything a cast can bring up: 320 fish across 32 ponds, plus junk. The Spawn Tables are the rules that turn one cast into one catch. Together they answer two questions for the rest of the game: *what exists in this pond*, and *what just bit*.

The player never sees this system directly. They feel it as the reason a Pumpkinseed turns up sober and a Landlocked Atlantic Salmon only turns up on Top Shelf, as the weight on the catch banner, and as the occasional old boot. Without it there is no collection to fill and nothing for a strain to unlock: it is where Pillar 1 ("which fish you can hook comes from the strain, never from money or gear") is enforced, and where Pillar 3's real fish and real places are stored.

It is a data-and-rules system. It holds no per-player state and draws nothing on screen. Whether the data ships as JSON or as Godot resource files is an architecture decision and is not settled here.

## Detailed Design

### Core Rules

*`economy-designer`, `systems-designer` and `game-designer` not consulted — Lean mode. Review manually before production.*

**What the database holds**

- **Species.** The shared facts about one real fish: its name, a short name for tight UI, its real-world weight range in pounds, its tags (for example `bass`, `panfish`, `catfish`, `trout`, `pike`), and its art recipe from the parts kit (art bible, Section 3). A species is defined once and reused by every pond it lives in.
- **Pond entry.** One species in one pond. It carries the pond, the species, the rarity in *that* pond, and an optional weight range that overrides the species' range (a Florida Largemouth runs bigger than a Maine one). **A pond entry is the unit the game counts** (owner decision 2026-11-16): a Bluegill at Lake Okee-CHOKE-obee and a Bluegill at Lake Hop-a-BONG are two entries, logged and unlocked separately. There are 320 entries.
- **Lost Legend entry.** A pond entry with rarity Lost Legend. It may be a one-off (Champ, El Rey Sábalo) with its own name, art and note, not a reused species.
- **Junk item.** A non-fish catch: name, art, and a value band in cents. Junk is either **shared** (in every pond) or **regional** (in one area's ponds). A pond's junk pool is the shared list plus its region's list (owner decision 2026-11-16).
- **Rarity.** An ordered list: Common (0), Uncommon (1), Rare (2), Epic (3), Legendary (4), Lost Legend (5).

**Rules the data must obey**

1. Every pond has exactly 10 entries: 3 Common, 2 Uncommon, 2 Rare, 1 Epic, 1 Legendary, 1 Lost Legend.
2. A species appears at most once per pond.
3. Every entry's weight range has a minimum above 0 and a maximum above its minimum.
4. The data is checked against rules 1–3 when it loads. A pond that breaks one is reported by name and the game does not start with it; it is never silently repaired.
5. No fish, junk item, weight or rarity is written in code. All of it is data (coding standard: gameplay values are data-driven).

**How a cast becomes a catch**

The system is asked for a catch by Bite Timing at the moment a bite happens. It is told:

- the **pond**;
- the **effective tier**, 0 to 4: 0 when Sober, or when the strain in effect is from another pond; otherwise 1 Reggie, 2 Home Grown, 3 Top Shelf, 4 Straight Fire;
- the **Chill state**, 1 to 4 (Chill, High, Stoned, Zonked); YAK LOCKED counts as 4;
- which of the pond's entries are **already logged** (from the Fishing Log);
- any **lure bias** from equipped gear;
- two flags other systems may raise: **Lost Legend due** and **YAK LOCK bonus due**.

It answers in this order, stopping at the first that applies:

1. **Lost Legend due** → the pond's Lost Legend entry.
2. **YAK LOCK bonus due** → the pond's Epic or its Legendary, 50/50.
3. **Tier 0 (Sober)** → a Common. If all three of the pond's Commons are logged, the catch is junk with probability `junk_chance`, otherwise a Common.
4. **Tier 1 to 4** → roll a rarity from the ones that tier opens, then an entry of that rarity:

   | Effective tier | Rarities that can bite |
   |---|---|
   | 1 Reggie | Common, Uncommon |
   | 2 Home Grown | Common, Uncommon, Rare |
   | 3 Top Shelf | Common, Uncommon, Rare, Epic, Legendary |
   | 4 Straight Fire | Common, Uncommon, Rare, Epic, Legendary, with boosted odds |

   Junk never bites under a strain. A Lost Legend never comes from this roll; it only comes from rule 1.

Then, for a fish:

5. **Pick the entry** among the chosen rarity's entries. An entry not yet logged is more likely than a logged one, and a lure bias may make entries with a matching tag more likely. Neither can add an entry from a rarity the tier did not open.
6. **Roll the weight** inside the entry's range, skewed toward the small end.
7. **Check for a trophy** (owner decisions 2026-11-16): a catch whose weight lands in the top `trophy_band` of its range is a trophy and is flagged. There is no separate trophy roll, so a trophy is always among the heaviest of its kind.

The answer is a **catch result**: fish or junk, which entry or item, its rarity, its weight, how far up its range that weight sits (0 to 1), and whether it is a trophy. This system does not decide what it is worth, how hard it is to land, or whether it is new to the log.

**What never changes which fish bites**

Time of day, shade, where in the pond the line lands, cast distance, and how much money or gear the player has. Shade changes how *fast* a bite comes (Bite Timing), never *what* bites. A lure can lean the pick inside an open rarity and nothing more (Pillar 1).

**Co-op**

The host makes every roll and tells the guests the result. A guest's game never rolls its own catch.

### States and Transitions

The system keeps no state about the player and nothing changes between one roll and the next: the same inputs and the same dice give the same catch. Which entries are logged, hookable or locked is the Fishing Log's and the Strains system's state, not this one's.

The database itself has three states:

| State | Meaning | Leaves when |
|---|---|---|
| Unloaded | Data not read yet | The game starts loading → Checking |
| Checking | Data is being tested against the data rules | All ponds pass → Ready. Any pond fails → Failed |
| Ready | Rolls can be asked for | Never, for the life of the session |
| Failed | A pond broke a rule; its name and the broken rule are reported | Only by fixing the data and restarting |

### Interactions with Other Systems

None of these systems has a design doc yet, so every row is this system's side of a contract the other doc must confirm.

| System | Comes in | Goes out | Who owns the line between them |
|---|---|---|---|
| Bite Timing | A request for a catch, with the pond, effective tier, Chill state and flags | The catch result | Bite Timing decides *when*; this system decides *what* |
| Strains & Unlock Chain | — | The list of entries per pond and rarity, so it can tell when a rarity is fully logged | Strains owns which tier is in effect and what is unlocked |
| Chill Meter & Smoking | The Chill state; the YAK LOCK bonus flag | — | Chill Meter owns the state and when the bonus is earned; this system only spends the flag |
| Fishing Log & Unc | Which entries are logged | Entry and species facts for the log's rows | The Log owns the record; this system never writes to it |
| Reel-in Needle | — | The catch's rarity (and trophy flag), which the needle uses to set its difficulty | The Needle owns every difficulty number |
| Economy | — | Rarity, weight, weight range and trophy flag, from which it prices the catch; junk value bands | Economy owns every dollar figure, including Appraise and the trophy bonus |
| Inventory & Storage | — | The catch result, to be held on the stringer | Inventory owns capacity |
| Gear & Item Database | Lure bias: a tag and a multiplier | The list of valid tags | Gear owns the multiplier's size; this system caps what it may touch |
| Lost Legends | The Lost Legend due flag | The pond's Lost Legend entry | Lost Legends owns when the flag is raised and whether a Legend can be caught again |
| HUD & Catch Banner | — | Name, rarity, weight and trophy flag for the banner | The HUD owns how it is shown |

## Formulas

Every starting value below is the browser sketch's (`prototypes/catch-n-burn/config.js`), which the owner played once and approved as a starting point on 2026-11-16. They are guesses to tune, not balance.

### 1. Rarity odds

The rarity_chance formula is defined as:

`rarity_chance(r) = effective_weight(r) / sum of effective_weight over every rarity the tier opens`

`effective_weight(r) = base_weight[tier][r] × (1 + state_bonus × (chill_state − 1))` when rarity `r` is one the tier boosts, otherwise `base_weight[tier][r]`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `base_weight[tier][r]` | float | 1–100 for an opened rarity | data file | How often rarity `r` bites under that tier before any bonus. Table below. |
| `state_bonus` | float | 0.05–1.0 (start 0.3) | data file | Extra weight per Chill state above the first, for boosted rarities only. |
| `chill_state` | int | 1–4 | calculated (Chill Meter) | Chill 1, High 2, Stoned 3, Zonked 4. YAK LOCKED counts as 4. |
| `tier` | int | 1–4 | calculated (Strains) | Effective tier; tier 0 does not use this formula. |

Starting `base_weight` table. A dash means the tier does not open that rarity. **Bold** marks the rarities the tier boosts: the ones it newly opens, and for Straight Fire everything from Rare up.

| Tier | Common | Uncommon | Rare | Epic | Legendary |
|---|---|---|---|---|---|
| 1 Reggie | 60 | **40** | — | — | — |
| 2 Home Grown | 40 | 30 | **30** | — | — |
| 3 Top Shelf | 30 | 22 | 22 | **16** | **10** |
| 4 Straight Fire | 15 | 20 | **25** | **22** | **18** |

**Output Range:** each chance is above 0 and below 1, and the chances for a tier sum to 1. With the starting values: Uncommon under Reggie runs 40% (Chill) to 56% (Zonked); Rare under Home Grown 30% to 45%; Legendary under Top Shelf 10% to 15%; Legendary under Straight Fire 18% to 22%.

**Example:** Top Shelf, Zonked (`chill_state` 4). Bonus = 1 + 0.3 × 3 = 1.9. Weights: Common 30, Uncommon 22, Rare 22, Epic 16 × 1.9 = 30.4, Legendary 10 × 1.9 = 19. Sum 123.4. Legendary chance = 19 / 123.4 = 15.4%; Epic = 24.6%.

**Boundaries checked:**
- `state_bonus` at 0 makes the Chill state do nothing to the odds, which contradicts the owner's rule that a higher state improves them. The floor is 0.05.
- If every `base_weight` for a tier were 0 the sum would be 0 and the chance undefined. The data check requires a weight of at least 1 for every rarity a tier opens.
- At `state_bonus` 1.0 and Zonked, Legendary under Top Shelf reaches 22.5%. It cannot reach 100%.

**Loop check:** higher Chill gives better odds, which gives rarer fish and more money for more weed. That is the intended loop (Pillar 1). It is damped outside this system by the Chill Meter draining and by Hunger and Munchies.

### 2. Which entry within a rarity

The entry_chance formula is defined as:

`entry_chance(e) = pick_weight(e) / sum of pick_weight over the pond's entries of the chosen rarity`

`pick_weight(e) = (new_entry_bias if e is not logged, else 1) × lure_bias(e)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `new_entry_bias` | float | 1–5 (start 2) | data file | How much likelier an unlogged entry is (owner decision 2026-11-16: twice). 1 turns the catch-up rule off. |
| `lure_bias(e)` | float | 1 to `lure_bias_cap` | calculated (Gear & Item Database) | A multiplier when the equipped lure's tag matches the entry's species tags; 1 when it does not. Never below 1. |
| `lure_bias_cap` | float | 1–4 (start 3) | data file | The most any lure may multiply an entry by. |

**Output Range:** above 0 and at most 1. Epic and Legendary have one entry each, so their chance is always 1 and both biases do nothing there.

**Example:** Sober at Lil' Puffin' Pond, Pumpkinseed logged, Yellow Perch and Brown Bullhead not, no lure bias. Weights 1, 2, 2. Yellow Perch chance = 2 / 5 = 40%.

**What it does to pacing:** with the bias at 2, logging all three Commons takes 4.25 sober bites on average (1 + 1.25 + 2); without it, 5.5. The bias favours what the player lacks, so it is a catch-up rule and cannot run away.

**Boundaries checked:** a `lure_bias` below 1 could make a fish nearly uncatchable, so the input is clamped to 1 at the bottom and `lure_bias_cap` at the top.

### 3. Junk

The junk_roll formula is defined as:

`is_junk = (tier is 0) and (all three Commons logged) and (u < junk_chance)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `junk_chance` | float | 0–0.8 (start 0.4) | data file | Share of sober casts that bring up junk once the pond's Commons are logged. |
| `u` | float | 0 to under 1 | calculated | A uniform random draw. |

**Output Range:** true or false. When true, the junk item is picked with equal chance from the pond's pool (shared items plus the region's).

**Example:** `junk_chance` 0.4, draw 0.31 → junk. Draw 0.62 → a Common.

**Boundaries checked:** at 1.0 a sober player with no weed and no cash could never catch anything worth selling and could not buy their way out. The cap is 0.8.

### 4. Weight and trophies

The catch_weight formula is defined as:

`weight_fraction = u ^ weight_skew`

`weight = weight_min + (weight_max − weight_min) × weight_fraction`

`is_trophy = weight_fraction ≥ 1 − trophy_band`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `weight_min`, `weight_max` | float | above 0; max above min | data file | The entry's weight range (its own, or its species'). |
| `weight_skew` | float | 1–3 (start 1.6) | data file | Above 1 pulls catches toward the small end. 1 is an even spread. |
| `trophy_band` | float | 0.01–0.20 (start 0.05) | data file | The top share of the range that counts as a trophy (owner decision 2026-11-16: by weight alone). |
| `u` | float | 0 to under 1 | calculated | A uniform random draw. |

**Output Range:** `weight` from `weight_min` up to just under `weight_max`; `weight_fraction` from 0 to just under 1. The average catch sits at 1 / (`weight_skew` + 1) of the way up the range: 38% at the starting skew.

**Example:** Yellow Perch, 0.3–1.4 lb, draw 0.5. Fraction = 0.5 ^ 1.6 = 0.33. Weight = 0.3 + 1.1 × 0.33 = 0.66 lb. Not a trophy (0.33 is below 0.95).

**Trophy rate:** the chance of a trophy is `1 − (1 − trophy_band) ^ (1 / weight_skew)`. At the starting values that is 3.2%, about 1 catch in 32. The two settings interact: raising `weight_skew` makes trophies rarer.

**Boundaries checked:** a `weight_skew` of 0 would make every catch the maximum weight and every catch a trophy, so the floor is 1.

## Edge Cases

*`systems-designer` not consulted — Lean mode. Review manually before production.*

- **If Lost Legend due and YAK LOCK bonus due are both raised**: the catch is the Lost Legend. The YAK LOCK bonus flag is not spent and applies to the next cast it is still raised for.
- **If YAK LOCK bonus due is raised but the effective tier is no longer 3 when the bite happens**: the bonus is still paid (Epic or Legendary, 50/50). Whether the flag should have been lowered is the Chill Meter's rule, not this system's.
- **If Lost Legend due is raised for a pond whose Lost Legend is already logged**: the Lost Legend is returned again. Whether the flag may be raised a second time is the Lost Legends system's rule.
- **If the strain in effect is from another pond**: the caller passes tier 0, so the sober rules apply in full, junk included.
- **If the effective tier is above 0 and the Chill state arrives as 0 or below**: it is treated as 1. If it arrives above 4, it is treated as 4.
- **If the effective tier arrives below 0 or above 4**: it is treated as 0 or 4.
- **If every entry of the chosen rarity is already logged**: one is picked by the same formula, in which the catch-up bias no longer separates them. Duplicates are normal and sellable.
- **If the equipped lure's tag matches no entry of the chosen rarity**: the lure has no effect on that cast.
- **If a lure bias arrives below 1 or above `lure_bias_cap`**: it is clamped to that range.
- **If the player is Sober and not all three Commons are logged**: junk never bites, whatever `junk_chance` is.
- **If `junk_chance` is set above 0.8**: it is treated as 0.8.
- **If a pond's junk pool is empty**: the data check fails at load. The shared list must hold at least one item.
- **If the catch is a Lost Legend**: a weight is rolled, but it is never flagged a trophy. Lost Legends are photographed and released, so a trophy bonus would mean nothing.
- **If the catch is junk**: it has no weight, no weight fraction and no trophy flag.
- **If two players' bites resolve in the same step in co-op**: the host resolves them in order of bite time, and by player slot number if the times are equal. The rolls are independent.
- **If the data is changed while the game is running**: nothing happens until restart. The database stays Ready with what it loaded.

**Things a player could lean on, and why each is bounded**

- **Re-catching the Legendary for money.** Under Top Shelf the Legendary can bite again at 10–15% a cast. It costs weed and Munchies every time, and what it pays is Economy's to set. Flagged for the Economy doc.
- **Picking a lure to chase the best fish of a rarity.** Bounded by `lure_bias_cap`, and it cannot reach a rarity the tier has not opened.
- **Staying sober to farm Commons.** Possible and low-paying by design; junk at 40% is the nudge to smoke.

## Dependencies

**This system depends on:** nothing. It is the first Foundation system and can be designed, built and tested alone.

**Systems that depend on this one:**

| System | Hard or soft | What it needs from here |
|---|---|---|
| Bite Timing | Hard | A catch result for every bite |
| Strains & Unlock Chain | Hard | The entries of each pond by rarity, to know when a rarity is fully logged |
| Fishing Log & Unc | Hard | Entry and species facts for its 320 rows; the definition of "an entry" |
| Reel-in Needle | Hard | The rarity (and trophy flag) of the fish on the line |
| Economy | Hard | Rarity, weight fraction and trophy flag to price a catch; junk value bands |
| Inventory & Storage | Hard | The catch result, as the thing a stringer slot holds |
| Gear & Item Database | Soft | The list of species tags a lure may target, and the cap on lure bias |
| Chill Meter & Smoking | Soft | Nothing read; it raises the YAK LOCK bonus flag this system spends |
| Lost Legends | Hard | Each pond's Lost Legend entry; it raises the Lost Legend due flag |
| Pond & Area Travel | Soft | The count of non-Lost-Legend entries per pond (9) and per area (36) |
| HUD & Catch Banner | Soft | Name, rarity, weight and trophy flag to display |

**One-directional for now.** None of those systems has a design doc yet. Each must list this system among its dependencies when it is written, and confirm or contest the contract in "Interactions with Other Systems" above. Until then every row is provisional.

**Change to the systems index needed:** the index lists six systems depending on this one. This doc adds Lost Legends, Pond & Area Travel, Chill Meter & Smoking, Gear & Item Database and the HUD as direct or soft dependents.

## Visual/Audio Requirements

Optional for an Economy system; kept short. *`art-director` not consulted — Lean mode.*

This system draws and plays nothing. It places three requirements on the art and audio that others make:

- **Art per species, not per entry.** The draft content file has 134 distinct species across its 288 ordinary entries, plus 32 Lost Legends. That is 166 fish to draw, not 320. Each follows the art bible, Section 3: built from the parts kit, one exaggerated "tell", readable as a black silhouette 32 px wide (Principle 1, Budget Charm, Built to Show).
- **Art per junk item.** One lumpy, asymmetric shape each, never streamlined like a fish (art bible, Section 3).
- **Rarity is never shown in the 3D world.** Rarity colours live in the UI only (art bible, Section 4, vibrance rule 4).

A trophy needs to be told apart on the banner and by ear. What that looks and sounds like belongs to the HUD & Catch Banner and Audio docs.

## Game Feel

Optional for an Economy system. This system has no input and no feedback of its own; what it shapes is pacing, through its odds. The targets the starting values aim at, all to be judged in play:

- About 31 bites to log a pond's nine fish at the lowest Chill state, fewer when higher.
- A Legendary once in every 7 to 10 Top Shelf bites.
- A trophy about once in 32 fish.
- Junk on 4 in 10 sober casts once the Commons are logged: enough to nudge, not enough to starve.

## UI Requirements

This system has no screen. It must supply, for every fish, what the screens need:

- A full name and a **short name** that fits a log row on the flip phone's small screen ("Landlocked Atlantic Salmon" → "Landlocked Salmon").
- The rarity, as a number and a word.
- The weight and its place in the range, for the banner, the log's personal best and Appraise.
- A note line for Lost Legends (for example "Extinct; last known from Dublin Pond, NH").

How weight is displayed, and in what unit for very small fish, is an open question below.

## Cross-References

| This document says | It relies on | Where | State |
|---|---|---|---|
| Tier 0–4 decides which rarities can bite | The strain tiers and "effective tier" | Strains & Unlock Chain | Not written |
| Chill state lifts the odds; the YAK LOCK bonus is a flag | Chill states; when the bonus is earned | Chill Meter & Smoking | Not written |
| "Already logged" entries | The caught-entries record | Fishing Log & Unc | Not written |
| The catch is requested at a bite | Bite timing | Bite Timing | Not written |
| Rarity and trophy flag set the fight's difficulty | Needle difficulty by rarity | Reel-in Needle | Not written |
| Weight fraction and trophy flag are priced elsewhere | Fish prices, Appraise, trophy bonus, junk payout | Economy | Not written |
| A lure may lean the pick within a rarity | Lure tags and bias sizes | Gear & Item Database | Not written |
| Lost Legend due flag | When a Lost Legend can be hooked | Lost Legends | Not written |
| 9 entries per pond, 36 per area, gate travel | Pond and area unlock rules | Pond & Area Travel | Not written |
| Pillar 1 and Pillar 3 | Game pillars | `design/gdd/game-concept.md`, Game Pillars | Written, In Review |
| Parts-kit fish, UI-only rarity colours | Shape language, colour system | `design/art/art-bible.md`, Sections 3 and 4 | Written |
| The 320 entries and the junk list | Fish and junk content | `design/catch-n-burn/content-areas-fish-strains.md` | Draft v0.2 |
| Starting values | The sketch's tuning | `prototypes/catch-n-burn/config.js` | Tagged `one-shot/catch-n-burn` |

## Acceptance Criteria

Checked against the QA lens (coverage of every core rule and formula, a measurable THEN, a boundary value per formula, one cross-system check). "Seeded" means the test fixes the random seed. Shares over many requests carry a tolerance so a correct build does not fail on chance.

**Data rules** — automated

- **AC-1** — **GIVEN** the shipped data, **WHEN** the database loads, **THEN** it reaches Ready and reports 32 ponds and 320 entries, each pond holding 3 Common, 2 Uncommon, 2 Rare, 1 Epic, 1 Legendary and 1 Lost Legend.
- **AC-2** — **GIVEN** test data in which one pond has 2 Commons, **WHEN** it loads, **THEN** the state is Failed and the report names that pond and the broken count.
- **AC-3** — **GIVEN** test data in which one species appears twice in a pond, **WHEN** it loads, **THEN** the state is Failed and the report names the pond and the species.
- **AC-4** — **GIVEN** test data with an entry whose minimum weight is 0, or whose maximum is not above its minimum, **WHEN** it loads, **THEN** the state is Failed and the report names the entry.
- **AC-5** — **GIVEN** test data with an empty shared junk list, **WHEN** it loads, **THEN** the state is Failed.
- **AC-6** — **GIVEN** the shipped data with one species renamed in the data file only, **WHEN** a catch of that species is requested, **THEN** the catch result carries the new name. (Proves nothing is written in code.)

**Order of answers** — automated, seeded

- **AC-7** — **GIVEN** Lost Legend due is raised at Lil' Puffin' Pond, at any tier, **WHEN** 100 catches are requested, **THEN** all 100 are the Silver Trout.
- **AC-8** — **GIVEN** YAK LOCK bonus due is raised and Lost Legend due is not, **WHEN** 10,000 catches are requested, **THEN** every one is that pond's Epic or Legendary, and each is between 48% and 52% of the total.
- **AC-9** — **GIVEN** both flags are raised, **WHEN** one catch is requested, **THEN** it is the Lost Legend and the system reports the YAK LOCK bonus as not spent.

**Sober and junk** — automated, seeded

- **AC-10** — **GIVEN** tier 0, none of the pond's Commons logged, and `junk_chance` 0.4, **WHEN** 10,000 catches are requested, **THEN** none is junk and every one is a Common of that pond.
- **AC-11** — **GIVEN** tier 0, all three Commons logged, and `junk_chance` 0.4, **WHEN** 10,000 catches are requested, **THEN** between 38% and 42% are junk and the rest are Commons of that pond.
- **AC-12** — **GIVEN** the same setup with `junk_chance` set to 1.0, **WHEN** 10,000 catches are requested, **THEN** between 78% and 82% are junk. (The 0.8 cap.)
- **AC-13** — **GIVEN** a North East pond, **WHEN** 10,000 junk catches are produced, **THEN** every item is from the shared list or the North East list, and no item from another region appears.

**What each tier opens** — automated, seeded

- **AC-14** — **GIVEN** tier 1 at any Chill state, **WHEN** 10,000 catches are requested, **THEN** every one is Common or Uncommon, with no junk and no Lost Legend.
- **AC-15** — **GIVEN** tier 2, **WHEN** 10,000 catches are requested, **THEN** every one is Common, Uncommon or Rare.
- **AC-16** — **GIVEN** tier 3 or tier 4, **WHEN** 10,000 catches are requested, **THEN** every rarity from Common to Legendary appears at least once and no Lost Legend appears.

**Formula 1, rarity odds** — automated, seeded, starting values

- **AC-17** — **GIVEN** tier 3 and Chill state 1, **WHEN** 100,000 catches are requested, **THEN** Legendary is between 9.5% and 10.5% and Epic between 15.4% and 16.6%.
- **AC-18** — **GIVEN** tier 3 and Chill state 4, **WHEN** 100,000 catches are requested, **THEN** Legendary is between 14.9% and 15.9% and Epic between 24.0% and 25.2%.
- **AC-19** — **GIVEN** tier 1 with the Chill state passed as 0, **WHEN** 100,000 catches are requested, **THEN** Uncommon is between 39% and 41% (treated as state 1); and with the state passed as 9, between 55% and 57% (treated as state 4).

**Formula 2, which entry** — automated, seeded

- **AC-20** — **GIVEN** tier 0 at Lil' Puffin' Pond with only the Pumpkinseed logged and no lure, **WHEN** 100,000 catches are requested, **THEN** Yellow Perch and Brown Bullhead are each between 39% and 41% and Pumpkinseed between 19% and 21%.
- **AC-21** — **GIVEN** the same setup with `new_entry_bias` set to 1, **WHEN** 100,000 catches are requested, **THEN** each of the three is between 32.3% and 34.3%.
- **AC-22** — **GIVEN** tier 2 at a pond whose two Rares are both logged and only one carries the tag `trout`, with a `trout` lure at bias 3, **WHEN** 100,000 Rare catches are produced, **THEN** the tagged Rare is between 74% and 76%; with the bias passed as 10 the share is the same (the cap); with the bias passed as 0.1 the share is between 49% and 51% (the floor).
- **AC-23** — **GIVEN** tier 1 and a lure whose tag matches only Rare entries of that pond, **WHEN** 10,000 catches are requested, **THEN** no Rare appears.

**Formula 4, weight and trophies** — automated, seeded

- **AC-24** — **GIVEN** an entry with range 0.3–1.4 lb, **WHEN** 100,000 catches of it are produced, **THEN** every weight is at least 0.3 and at most 1.4, the mean weight fraction is between 0.375 and 0.395, and between 2.9% and 3.5% are trophies.
- **AC-25** — **GIVEN** the same 100,000 catches, **WHEN** each is inspected, **THEN** every trophy has a weight fraction of 0.95 or more and no non-trophy does.
- **AC-26** — **GIVEN** that entry and a forced draw of 0.5, **WHEN** one catch is produced, **THEN** its weight is 0.66 lb to the nearest 0.01.
- **AC-27** — **GIVEN** Lost Legend due is raised, **WHEN** 10,000 catches are requested, **THEN** none is flagged a trophy; and **GIVEN** junk catches, **THEN** none carries a weight or a trophy flag.

**Repeatability and co-op**

- **AC-28** — automated — **GIVEN** the same seed and the same sequence of requests, **WHEN** the sequence is run twice, **THEN** the two lists of catch results are identical.
- **AC-29** — integration, **cannot be run until Multiplayer exists** — **GIVEN** a two-player session, **WHEN** a guest's line gets a bite, **THEN** the entry and weight shown on the guest's screen equal the host's roll.

**Across systems**

- **AC-30** — integration, retained screenshot — **GIVEN** a sober player at Lil' Puffin' Pond, **WHEN** a fish is landed, **THEN** the catch banner shows the same name, rarity and weight as the catch result. Cannot be run until Bite Timing, Reel-in Needle and the HUD exist.

**Not acceptance criteria: playtest questions**

These are feel judgments and cannot be passed or failed by a test: does junk on 40% of sober casts read as a nudge or as a punishment; does a trophy at about 1 catch in 32 feel special; does about 31 bites to finish a pond feel like the right length.

**Gaps found by the QA check**

- **No performance criterion.** The project has no performance budget set, so there is nothing to test a roll's cost against. Listed under Open Questions.
- **AC-29 and AC-30 wait on other systems.** Until then, co-op authority and the hand-off to the banner are untested.
- **AC-1 has been run once, by script, against the draft content file** (2026-11-16): 32 ponds, 320 entries, no rule broken. That is a check of the draft document, not of game data, which does not exist yet.

## Open Questions

| # | Question | Who settles it | By when |
|---|---|---|---|
| 1 | **Unit for very small fish.** A Delta Smelt, a Maryland Darter or a Mosquitofish weighs a fraction of an ounce. Proposed: each species names its display unit (pounds, ounces, or length in inches), with the roll unchanged. | Owner, in the HUD & Catch Banner doc | Before the Mid Atlantic content is written (Pond 2-3 has the first one) |
| 2 | **Weight ranges and tags for all 320 entries.** The content file lists names and rarities only. Only Lil' Puffin' Pond has ranges, in the sketch. | Owner and writer; North East's 40 first | Lil' Puffin' Pond before the MVP; the rest per area |
| 3 | **Regional junk.** The owner chose shared junk plus regional junk; no regional items are written yet. | Owner and writer | North East before the Vertical Slice |
| 4 | **Does a strain from another pond count as fully sober, junk included?** This doc assumes yes. | Strains & Unlock Chain doc | When that doc is written (10th) |
| 5 | **Can a Lost Legend be caught again, and does Straight Fire's "every rarity" include it?** This doc keeps Lost Legends out of every ordinary roll. | Lost Legends doc | When that doc is written (28th) |
| 6 | **JSON or Godot resource files?** | Architecture decision | Technical Setup |
| 7 | **Feasibility is unchecked.** `docs/engine-reference/godot/modules/` has no scripting or data reference, so this design was not checked against the pinned engine. | Technical director | Technical Setup |
| 8 | **No performance budget.** There is nothing to test a roll's cost against. | Owner, via `/project-settings` | Before the first build |
| 9 | **Nine Lost Legends are unverified folklore** (from the concept review). Pillar 3 requires each to be verified or replaced. | Owner | Before each area's content is locked |
| 10 | **Is re-catching the Legendary for money acceptable?** | Economy doc | When that doc is written (18th) |
