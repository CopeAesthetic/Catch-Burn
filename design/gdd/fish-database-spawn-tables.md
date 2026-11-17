# Fish Database & Spawn Tables

> **Status**: Approved 2026-11-16 (fourth review, lean). Revised after approval the same day on owner decisions: Formula 1 gains a missing-rarity term, a new Formula 5 makes the YAK split a knob, rule 11 adds a reference check, AC-33 is resized, AC-45 to AC-49 are added, and Pond 1 has tags. **These changes have not been re-reviewed.**
> **Author**: owner + design-system skill
> **Last Updated**: 2026-11-16
> **Last Verified**: 2026-11-16
> **Implements Pillar**: Pillar 3 (Real Fish, Real Places, Pun Names); Pillar 1 (The High Is the Progression)
> **Creative Director Review (CD-GDD-ALIGN)**: SKIPPED 2026-11-16 — lean mode
> **Independent review**: 2026-11-16, lean, NEEDS REVISION (3 blockers, since fixed: random source as an input, catch result reports the flag spent, load checks and knob ranges). Recommended items fixed: ACs for tier 2, tier 4 and edge cases (AC-31 to AC-37). **Re-review 2026-11-16, lean, NEEDS REVISION** (2 blockers, since fixed: partial-data loading with AC-1 rewritten, closed species-tag list as rule 9). Also fixed: request contract (Bite Timing assembles it), co-op uses the guest's own inputs, four-state wording and refusal when not Ready, Straight Fire excludes Lost Legends (owner decision), AC-38 to AC-41. **Third review 2026-11-16, lean, NEEDS REVISION** (2 blockers, since fixed: a Pond record with an area and a load check as rule 10; the YAK LOCK bonus is paid only at effective tier 3 or 4, owner decision). Also fixed: the open rarity set is fixed and unopened weights are rejected (rule 6), draw order defined, a Lost Legend is never a trophy (rule 7, Formula 4), a request for an unknown pond is refused, AC-26 rewritten, AC-35 and AC-36 widened, AC-42 to AC-44. **Fourth review 2026-11-16, lean, APPROVED.** Since done: systems-index dependency rows (Pond & Area Travel, Lost Legends, HUD), the Gear doc's tag-list wording, the brief's Straight Fire wording, and a Tuning Knobs table (advisory).

## Summary

The catalogue of every fish and junk item in the game, and the rules that decide what a cast brings up. It gives the player a reason to get higher: a strain tier opens the next rarity, the Chill state improves the odds, and each catch rolls a weight that can be a trophy. It exists so that everything else (the log, the strains, prices, the needle) reads one shared answer to "what just bit".

> **Quick reference** — Layer: `Foundation` · Priority: `MVP` · Key deps: `None`

## Overview

The Fish Database is the game's catalogue of everything a cast can bring up: 320 fish across 32 ponds, plus junk. The Spawn Tables are the rules that turn one cast into one catch. Together they answer two questions for the rest of the game: *what exists in this pond*, and *what just bit*.

The player never sees this system directly. They feel it as the reason a Pumpkinseed turns up sober and a Landlocked Atlantic Salmon only turns up on Top Shelf, as the weight on the catch banner, and as the occasional old boot. Without it there is no collection to fill and nothing for a strain to unlock: it is where Pillar 1 ("which fish you can hook comes from the strain, never from money or gear") is enforced, and where Pillar 3's real fish and real places are stored.

It is a data-and-rules system. It holds no per-player state and draws nothing on screen. Whether the data ships as JSON or as Godot resource files is an architecture decision and is not settled here.

## Player Fantasy

*Drawn from the Overview and Pillars 1 and 3; no new design decision.*

The player should feel like a collector working through real waters. Each new strain opens fish they could not hook before; every catch has a real name and a real weight on the banner; a fish missing from the log turns up a little sooner than one already in it; and now and then the line brings up an old boot. Rarer fish come from smoking better, never from spending more or buying gear (Pillar 1), and every fish is a real species from a real place (Pillar 3).

## Detailed Design

### Core Rules

*`economy-designer`, `systems-designer` and `game-designer` not consulted — Lean mode. Review manually before production.*

**What the database holds**

- **Species.** The shared facts about one real fish: its name, a short name for tight UI, its real-world weight range in pounds, its tags (one or more, from the closed tag list: rule 9), and its art recipe from the parts kit (art bible, Section 3). A species is defined once and reused by every pond it lives in.
- **Pond.** One fishing pond: an id, its name, and the **area** it belongs to. Areas come from a single area list in the data (8 in the full game); the area is also the "region" that regional junk is tied to. Entries point to a pond by id.
- **Pond entry.** One species in one pond. It carries the pond, the species, the rarity in *that* pond, and an optional weight range that overrides the species' range (a Florida Largemouth runs bigger than a Maine one). **A pond entry is the unit the game counts** (owner decision 2026-11-16): a Bluegill at Lake Okee-CHOKE-obee and a Bluegill at Lake Hop-a-BONG are two entries, logged and unlocked separately. There are 320 entries.
- **Lost Legend entry.** A pond entry with rarity Lost Legend. It may be a one-off (Champ, El Rey Sábalo) with its own name, art and note, not a reused species.
- **Junk item.** A non-fish catch: name, art, and a value band in cents. Junk is either **shared** (in every pond) or **regional** (tied to one area, so it appears in that area's ponds only). A pond's junk pool is the shared list plus its area's list (owner decision 2026-11-16).
- **Rarity.** An ordered list: Common (0), Uncommon (1), Rare (2), Epic (3), Legendary (4), Lost Legend (5).

**Rules the data must obey**

0. The data lists at least 1 pond. The database loads whatever ponds the data lists, so the MVP can ship Lil' Puffin' Pond alone; the full game lists 32 (owner decision 2026-11-16). Rules 1–3 apply to each listed pond.
1. Every listed pond has exactly 10 entries: 3 Common, 2 Uncommon, 2 Rare, 1 Epic, 1 Legendary, 1 Lost Legend.
2. A species appears at most once per pond.
3. Every entry's weight range has a minimum above 0 and a maximum above its minimum.
4. The data is checked against rules 0–3 and 6–11 when it loads. Anything that breaks one is reported by name (the pond, entry, species, tier, knob, tag or area) and the game does not start with it; it is never silently repaired.
5. No fish, junk item, weight or rarity is written in code. All of it is data (coding standard: gameplay values are data-driven).
6. Every rarity a tier opens has a `base_weight` of at least 1 for that tier (Formula 1), and a rarity a tier does not open has none. **Which rarities a tier opens is fixed by the table under "How a cast becomes a catch"**: it is the Pillar 1 gate, so data cannot widen it. A tier with a 0 or missing weight for an opened rarity, or any weight for an unopened one, fails the check, naming the tier and rarity. Which opened rarities a tier boosts is data (a flag per tier and rarity: the bold cells in Formula 1's table).
7. The shared junk list holds at least one item, so no pond's junk pool is ever empty.
8. Every tuning knob is inside its safe range (Formulas 1–4): `state_bonus` 0.05–1.0, `new_entry_bias` 1–5, `lure_bias_cap` 1–4, `junk_chance` 0–0.8, `weight_skew` 1–3, `trophy_band` 0.01–0.20, `yak_legendary_share` 0.2–0.8, and every `base_weight` for an opened rarity 1–100. A knob outside its range fails the check, naming the knob. (Owner decision 2026-11-16: refuse to load, not clamp.) The caller-supplied inputs (tier, Chill state, lure bias) are not knobs: they are clamped at run time, as the Edge Cases say.
9. **Species tags come from one closed tag list.** The data holds a single tag list. Tags are **lure families**, broad groups that match how real lures are sold (owner decision 2026-11-16). The starting list is `bass`, `panfish`, `catfish`, `pike`, `trout`; other areas add families such as `sturgeon`, `carp` or `gar` as their content needs (Open Question 2). Every species carries at least 1 tag, and every tag on a species is on the list; a species with no tag, or a tag not on the list, fails the check, naming the species and the tag. A lure's tag is valid only if it is on this list: the Gear & Item Database checks its lures against the list this system supplies.
10. **Every pond names an area, and so does every regional junk item.** The data holds a single area list. A pond or a regional junk item whose area is missing or not on the list fails the check, naming the pond or item and the area. (The full game is 8 areas of 4 ponds. Four ponds per area is a fact of the full-game content, tested on the fixture in AC-1, not a load rule, so partial data such as the 1-pond MVP still loads.)
11. **Every reference resolves.** Every pond entry names a pond on the pond list and, unless it is a one-off Lost Legend, a species on the species list. A one-off Lost Legend (Champ, El Rey Sábalo) carries its own name, weight range, art and note instead, and is not a species, so it needs no tag. Lure bias cannot reach a Lost Legend anyway (rule 1 of the answer order). A Lost Legend that is a real species (the Silver Trout) points to its species like any entry. An entry that names an unknown pond or species, or a one-off without its own name, fails the check, naming the entry and the missing reference.

**How a cast becomes a catch**

The system is asked for a catch by Bite Timing at the moment a bite happens. **Bite Timing assembles the whole request** from the Strains, Chill Meter, Fishing Log, Gear and Lost Legends systems; this system never calls any of them and reads nothing but its own data and the request (the "Comes in" column below names where each input originates). It is told:

- the **pond**;
- the **effective tier**, 0 to 4: 0 when Sober, or when the strain in effect is from another pond; otherwise 1 Reggie, 2 Home Grown, 3 Top Shelf, 4 Straight Fire;
- the **Chill state**, 1 to 4 (Chill, High, Stoned, Zonked); YAK LOCKED counts as 4;
- the **logged set**: the ids of this pond's entries the requesting player has already logged (an unknown id is ignored; an empty set means nothing is logged);
- any **lure bias** from equipped gear: a tag from the closed tag list and a multiplier, or none;
- two flags other systems may raise: **Lost Legend due** and **YAK LOCK bonus due**;
- a **random source**, passed in with the request (dependency injection, per the coding standards). The system never creates its own dice. The game passes the live one and a test passes a fixed-seed one, which is what makes the "seeded" acceptance criteria repeatable.

It answers in this order, stopping at the first that applies:

1. **Lost Legend due** → the pond's Lost Legend entry.
2. **YAK LOCK bonus due, and the effective tier is 3 or 4** → the pond's Legendary with chance `yak_legendary_share`, otherwise its Epic (Formula 5; start 0.5, owner decision 2026-11-16: a tuning knob). At a lower tier (Sober, a strain from another pond, Reggie, Home Grown) the flag is ignored: the cast is rolled by the rules below and reported as not spent, so a bonus earned at Top Shelf can never hand out a rarity the strain in effect has not opened (owner decision 2026-11-16; Pillar 1). Whether and when such a flag lapses is the Chill Meter's rule.
3. **Tier 0 (Sober)** → a Common. If all three of the pond's Commons are logged, the catch is junk with probability `junk_chance`, otherwise a Common.
4. **Tier 1 to 4** → roll a rarity from the ones that tier opens, then an entry of that rarity:

   | Effective tier | Rarities that can bite |
   |---|---|
   | 1 Reggie | Common, Uncommon |
   | 2 Home Grown | Common, Uncommon, Rare |
   | 3 Top Shelf | Common, Uncommon, Rare, Epic, Legendary |
   | 4 Straight Fire | Common, Uncommon, Rare, Epic, Legendary, with boosted odds |

   Junk never bites under a strain. A Lost Legend never comes from this roll, **Straight Fire included**; it only comes from rule 1 (owner decision 2026-11-16). The brief's line "under a pond's Straight Fire, every rarity in that pond can bite" therefore means every rarity from Common to Legendary; the brief needs that wording updated.

Then, for a fish:

5. **Pick the entry** among the chosen rarity's entries. An entry not yet logged is more likely than a logged one, and a lure bias may make entries with a matching tag more likely. Neither can add an entry from a rarity the tier did not open.
6. **Roll the weight** inside the entry's range, skewed toward the small end.
7. **Check for a trophy** (owner decisions 2026-11-16): a catch whose weight lands in the top `trophy_band` of its range is a trophy and is flagged, except that a Lost Legend is never a trophy (it is photographed and released). There is no separate trophy roll, so a trophy is always among the heaviest of its kind.

The answer is a **catch result**: fish or junk, which entry or item, its rarity, its weight, how far up its range that weight sits (0 to 1), whether it is a trophy, and **which flag it spent**: Lost Legend due, YAK LOCK bonus due, or none. A flag that was raised but not spent (the YAK LOCK bonus when a Lost Legend takes the cast, or when the tier is below 3) is reported as not spent, so the system that owns the flag knows whether to lower it. This system does not decide what it is worth, how hard it is to land, or whether it is new to the log.

**Draws, in order.** The random source gives uniform draws from 0 to under 1. A cast takes them in a fixed order, one per step it passes through, and a step with only one possible outcome still takes its draw:

- Lost Legend due: entry, weight.
- YAK LOCK bonus paid: Epic-or-Legendary (Formula 5), entry, weight.
- Tier 0: junk (only when all three Commons are logged), then either the junk item, or entry and weight.
- Tier 1 to 4: rarity, entry, weight.

Where a draw picks among choices, the choices are taken in data order (rarities from Common upward, entries as the pond lists them, junk as the pool lists them) and the draw picks the first whose running share of the total passes it. This is what lets a test fix every draw and predict the catch (AC-26).

**What never changes which fish bites**

Time of day, shade, where in the pond the line lands, cast distance, and how much money or gear the player has. Shade changes how *fast* a bite comes (Bite Timing), never *what* bites. A lure can lean the pick inside an open rarity and nothing more (Pillar 1).

**Co-op**

The host makes every roll and tells the guests the result. A guest's game never rolls its own catch. **A guest's request carries the guest's own inputs** (owner decision 2026-11-16): the guest's effective tier, Chill state, logged set and lure bias, and the guest's flags. The host supplies only the random source. Each player's log and strain stay their own, so one player's smoking never changes another's odds.

### States and Transitions

The system keeps no state about the player and nothing changes between one roll and the next: the same inputs and the same dice give the same catch. Which entries are logged, hookable or locked is the Fishing Log's and the Strains system's state, not this one's.

The database itself has four states. A request made in any state but Ready is refused with an error naming the state; it never returns a catch.

| State | Meaning | Leaves when |
|---|---|---|
| Unloaded | Data not read yet | The game starts loading → Checking |
| Checking | Data is being tested against the data rules | Every rule passes → Ready. Any rule fails → Failed |
| Ready | Rolls can be asked for | Never, for the life of the session |
| Failed | The data broke a rule; the rule and what broke it (pond, entry, species, tier, knob, tag or area) are reported | Only by fixing the data and restarting |

### Interactions with Other Systems

None of these systems has a design doc yet, so every row is this system's side of a contract the other doc must confirm.

| System | Comes in | Goes out | Who owns the line between them |
|---|---|---|---|
| Bite Timing | A request for a catch, with the pond, effective tier, Chill state and flags | The catch result | Bite Timing decides *when*; this system decides *what* |
| Strains & Unlock Chain | — | The list of entries per pond and rarity, so it can tell when a rarity is fully logged | Strains owns which tier is in effect and what is unlocked |
| Chill Meter & Smoking | The Chill state; the YAK LOCK bonus flag (both arrive via Bite Timing's request) | — | Chill Meter owns the state and when the bonus is earned; this system only spends the flag. A contract, not a dependency: nothing is read from here |
| Fishing Log & Unc | Which entries are logged (the logged set, via Bite Timing) | Entry and species facts for the log's rows | The Log owns the record; this system never writes to it |
| Reel-in Needle | — | The catch's rarity (and trophy flag), which the needle uses to set its difficulty | The Needle owns every difficulty number |
| Economy | — | Rarity, weight, weight range and trophy flag, from which it prices the catch; junk value bands | Economy owns every dollar figure, including Appraise and the trophy bonus |
| Inventory & Storage | — | The catch result, to be held on the stringer | Inventory owns capacity |
| Gear & Item Database | Lure bias: a tag and a multiplier (via Bite Timing) | The closed tag list (rule 9) | Gear owns the multiplier's size; this system caps what it may touch |
| Lost Legends | The Lost Legend due flag (via Bite Timing) | The pond's Lost Legend entry | Lost Legends owns when the flag is raised and whether a Legend can be caught again |
| HUD & Catch Banner | — | Name, rarity, weight and trophy flag for the banner | The HUD owns how it is shown |

## Formulas

Every starting value below is the browser sketch's (`prototypes/catch-n-burn/config.js`), which the owner played once and approved as a starting point on 2026-11-16. They are guesses to tune, not balance.

### 1. Rarity odds

The rarity_chance formula is defined as:

`rarity_chance(r) = effective_weight(r) / sum of effective_weight over every rarity the tier opens`

`chill_mult = 1 + state_bonus × (chill_state − 1)`

`effective_weight(r) = base_weight[tier][r] × (chill_mult if the tier boosts r, else 1) × (chill_mult if r is missing, else 1)`

A rarity is **missing** when at least one of this pond's entries of that rarity is not in the request's logged set. **The Chill state lifts what the player still lacks as well as what the tier boosts** (owner decision 2026-11-16), so a higher state fills the log faster: without the missing term the boost went only to the one-entry Epic and Legendary and starved the three Commons, and completing a pond took *more* bites at Zonked than at Chill (see Game Feel). A rarity that is both boosted and missing gets `chill_mult` twice.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `base_weight[tier][r]` | float | 1–100 for an opened rarity | data file | How often rarity `r` bites under that tier before any bonus. Table below. |
| `state_bonus` | float | 0.05–1.0 (start 0.3) | data file | Extra weight per Chill state above the first, for boosted rarities and for missing ones. |
| `chill_state` | int | 1–4 | calculated (Chill Meter) | Chill 1, High 2, Stoned 3, Zonked 4. YAK LOCKED counts as 4. |
| `tier` | int | 1–4 | calculated (Strains) | Effective tier; tier 0 does not use this formula. |
| missing(`r`) | bool | true or false | calculated (the request's logged set) | Whether any of this pond's entries of rarity `r` is unlogged. Unknown ids in the logged set are ignored. |

Starting `base_weight` table. A dash means the tier does not open that rarity (a fixed rule, not data: rule 6). **Bold** marks the rarities the tier boosts (a data flag per tier and rarity): the ones it newly opens, and for Straight Fire everything from Rare up.

| Tier | Common | Uncommon | Rare | Epic | Legendary |
|---|---|---|---|---|---|
| 1 Reggie | 60 | **40** | — | — | — |
| 2 Home Grown | 40 | 30 | **30** | — | — |
| 3 Top Shelf | 30 | 22 | 22 | **16** | **10** |
| 4 Straight Fire | 15 | 20 | **25** | **22** | **18** |

**Output Range:** each chance is above 0 and below 1, and the chances for a tier sum to 1. When every opened rarity is missing, or none is, the missing term multiplies all of them alike and cancels, so these starting-value figures hold for an empty logged set and for a complete one: Uncommon under Reggie runs 40% (Chill) to 56% (Zonked); Rare under Home Grown 30% to 45%; Legendary under Top Shelf 10% to 15%; Legendary under Straight Fire 18% to 22%. In between, a missing rarity runs higher: under Top Shelf at Zonked with only the Legendary unlogged, the Legendary is 25.7%.

**Example 1:** Top Shelf, Zonked, every entry logged. `chill_mult` = 1 + 0.3 × 3 = 1.9. Weights: Common 30, Uncommon 22, Rare 22, Epic 16 × 1.9 = 30.4, Legendary 10 × 1.9 = 19. Sum 123.4. Legendary chance = 19 / 123.4 = 15.4%; Epic = 24.6%.

**Example 2:** Top Shelf, Zonked, everything logged but the Pumpkinseed (a Common is missing). Weights: Common 30 × 1.9 = 57, Uncommon 22, Rare 22, Epic 30.4, Legendary 19. Sum 150.4. Common = 37.9%, up from 24.3%.

**Boundaries checked:**
- `state_bonus` at 0 makes the Chill state do nothing to the odds, which contradicts the owner's rule that a higher state improves them. The floor is 0.05.
- If every `base_weight` for a tier were 0 the sum would be 0 and the chance undefined. The data check requires a weight of at least 1 for every rarity a tier opens.
- At `state_bonus` 1.0 and Zonked, Legendary under Top Shelf reaches 22.5% with the log empty or complete, and 53.7% at most, when it is the only missing rarity (Common 30, Uncommon 22, Rare 22, Epic 64, Legendary 160). It cannot reach 100%, and it falls back the moment the Legendary is logged.

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

**Boundaries checked:** at 1.0 a sober player with no weed and no cash could never catch anything worth selling and could not buy their way out. The cap is 0.8, and a data file above it fails to load (rule 8).

### 4. Weight and trophies

The catch_weight formula is defined as:

`weight_fraction = u ^ weight_skew`

`weight = weight_min + (weight_max − weight_min) × weight_fraction`

`is_trophy = (weight_fraction ≥ 1 − trophy_band) and (the entry is not a Lost Legend)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `weight_min`, `weight_max` | float | above 0; max above min | data file | The entry's weight range (its own, or its species'). |
| `weight_skew` | float | 1–3 (start 1.6) | data file | Above 1 pulls catches toward the small end. 1 is an even spread. |
| `trophy_band` | float | 0.01–0.20 (start 0.05) | data file | The top share of the range that counts as a trophy (owner decision 2026-11-16: by weight alone). |
| `u` | float | 0 to under 1 | calculated | A uniform random draw. |

**Output Range:** `weight` from `weight_min` up to just under `weight_max`; `weight_fraction` from 0 to just under 1. The average catch sits at 1 / (`weight_skew` + 1) of the way up the range: 38% at the starting skew.

**Example:** Yellow Perch, 0.3–1.4 lb, draw 0.5. Fraction = 0.5 ^ 1.6 = 0.33. Weight = 0.3 + 1.1 × 0.33 = 0.66 lb. Not a trophy (0.33 is below 0.95).

**Trophy rate:** for any entry except a Lost Legend, the chance of a trophy is `1 − (1 − trophy_band) ^ (1 / weight_skew)`. At the starting values that is 3.2%, about 1 catch in 32. The two settings interact: raising `weight_skew` makes trophies rarer.

**Boundaries checked:** a `weight_skew` of 0 would make every catch the maximum weight and every catch a trophy, so the floor is 1.

### 5. YAK LOCK bonus split

The yak_bonus formula is defined as:

`bonus_catch = Legendary if u ≥ 1 − yak_legendary_share, otherwise Epic`

(Epic comes first in data order, so it takes the low end of the draw, as every other pick does.)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `yak_legendary_share` | float | 0.2–0.8 (start 0.5) | data file | Share of paid YAK LOCK bonuses that bring the pond's Legendary (owner decision 2026-11-16: a knob, not a fixed 50/50). |
| `u` | float | 0 to under 1 | calculated | The bonus's first draw. |

**Output Range:** Epic or Legendary, only when the bonus is paid (tier 3 or 4, no Lost Legend due).

**Example:** share 0.5, draw 0.31 → Epic; draw 0.62 → Legendary. Share 0.8, draw 0.31 → Legendary.

**Boundaries checked:** at 0 or 1 the bonus would always bring the same fish, so it would stop being a gamble. The range keeps both outcomes at least 1 in 5.

## Edge Cases

*`systems-designer` not consulted — Lean mode. Review manually before production.*

- **If Lost Legend due and YAK LOCK bonus due are both raised**: the catch is the Lost Legend. The YAK LOCK bonus flag is not spent and applies to the next cast it is still raised for.
- **If YAK LOCK bonus due is raised and the effective tier is below 3** (Sober, a strain from another pond, Reggie or Home Grown): the flag is ignored, the cast is rolled by the ordinary rules for its tier, and the result reports the bonus as not spent. At tier 3 or 4 the bonus is paid. Whether and when the flag lapses is the Chill Meter's rule, not this system's.
- **If Lost Legend due is raised for a pond whose Lost Legend is already logged**: the Lost Legend is returned again. Whether the flag may be raised a second time is the Lost Legends system's rule.
- **If the strain in effect is from another pond**: the caller passes tier 0, so the sober rules apply in full, junk included.
- **If the effective tier is above 0 and the Chill state arrives as 0 or below**: it is treated as 1. If it arrives above 4, it is treated as 4.
- **If the effective tier arrives below 0 or above 4**: it is treated as 0 or 4.
- **If every entry of the chosen rarity is already logged**: one is picked by the same formula, in which the catch-up bias no longer separates them. Duplicates are normal and sellable.
- **If the equipped lure's tag matches no entry of the chosen rarity**: the lure has no effect on that cast.
- **If a lure bias arrives below 1 or above `lure_bias_cap`**: it is clamped to that range.
- **If the player is Sober and not all three Commons are logged**: junk never bites, whatever `junk_chance` is.
- **If `junk_chance` is set above 0.8 in the data file**: the data check fails at load and names the knob (rule 8). The 0.8 ceiling is a limit on the data, not a clamp applied at run time.
- **If a pond's junk pool is empty**: the data check fails at load (rule 7). The shared list must hold at least one item.
- **If the catch is a Lost Legend**: a weight is rolled, but it is never flagged a trophy. Lost Legends are photographed and released, so a trophy bonus would mean nothing.
- **If the catch is junk**: it has no weight, no weight fraction and no trophy flag.
- **If two players' bites resolve in the same step in co-op**: the host resolves them in order of bite time, and by player slot number if the times are equal. The rolls are independent.
- **If the data is changed while the game is running**: nothing happens until restart. The database stays Ready with what it loaded.
- **If a request names a pond that is not in the loaded data**: it is refused with an error naming the pond, as for a database that is not Ready, and no catch is returned. This is a real case in the MVP, whose data lists 1 pond.

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
| Gear & Item Database | Soft | The closed tag list (rule 9) that a lure may target, and the cap on lure bias |
| Chill Meter & Smoking | Contract only | Nothing read from here; it raises the YAK LOCK bonus flag this system spends, so it should not list this system as a dependency |
| Lost Legends | Hard | Each pond's Lost Legend entry; it raises the Lost Legend due flag |
| Pond & Area Travel | Soft | Each pond's area, and the count of non-Lost-Legend entries per pond (9) and per area (36) |
| HUD & Catch Banner | Soft | Name, rarity, weight and trophy flag to display |

**One-directional for now.** None of those systems has a design doc yet. Each must list this system among its dependencies when it is written, and confirm or contest the contract in "Interactions with Other Systems" above. Until then every row is provisional.

**Change to the systems index needed:** the index lists six systems depending on this one. This doc adds Lost Legends, Pond & Area Travel, Gear & Item Database (already listed) and the HUD as direct or soft dependents. Chill Meter & Smoking is a contract, not a dependency (above).

## Tuning Knobs

Every value below lives in the data file; none is written in code (data rule 5). A value outside its safe range fails the load check (data rule 8), naming the knob.

| Knob | Start | Safe range | What it changes | Source |
|---|---|---|---|---|
| `base_weight[tier][r]` | Formula 1 table | 1–100 for each opened rarity; none for an unopened one (rules 6 and 8) | How often each rarity bites under a tier before the Chill bonus | Formula 1; the browser sketch's values, untuned |
| Boost flag per tier and rarity | bold cells in Formula 1's table | on or off, opened rarities only | Which rarities the Chill state lifts | Formula 1 |
| `state_bonus` | 0.3 | 0.05–1.0 | Extra weight per Chill state above the first, for boosted rarities and for rarities the player is still missing | Formula 1; missing term owner decision 2026-11-16 |
| `yak_legendary_share` | 0.5 | 0.2–0.8 | Share of paid YAK LOCK bonuses that bring the Legendary rather than the Epic | Formula 5; owner decision 2026-11-16 |
| `new_entry_bias` | 2 | 1–5 | How much likelier an unlogged entry is (1 turns the catch-up rule off) | Formula 2; owner decision 2026-11-16 |
| `lure_bias_cap` | 3 | 1–4 | The most any lure may multiply an entry by; Gear sets each lure's bias under it | Formula 2 |
| `junk_chance` | 0.4 | 0–0.8 | Share of sober casts that bring up junk once the pond's Commons are logged | Formula 3 |
| `weight_skew` | 1.6 | 1–3 | How strongly catches lean to the small end of a range; also lowers the trophy rate | Formula 4 |
| `trophy_band` | 0.05 | 0.01–0.20 | The top share of a range that counts as a trophy (3.2% of catches at the starts) | Formula 4; owner decision 2026-11-16 |

## Visual/Audio Requirements

Optional for an Economy system; kept short. *`art-director` not consulted — Lean mode.*

This system draws and plays nothing. It places three requirements on the art and audio that others make:

- **Art per species, not per entry.** The draft content file has about 134 distinct species across its 288 ordinary entries (names compared with parenthetical notes such as "(sábalo)" stripped; 148 by exact string), plus 32 Lost Legends. That is about 166 fish to draw, not 320. Each follows the art bible, Section 3: built from the parts kit, one exaggerated "tell", readable as a black silhouette 32 px wide (Principle 1, Budget Charm, Built to Show).
- **Art per junk item.** One lumpy, asymmetric shape each, never streamlined like a fish (art bible, Section 3).
- **Rarity is never shown in the 3D world.** Rarity colours live in the UI only (art bible, Section 4, vibrance rule 4).

A trophy needs to be told apart on the banner and by ear. What that looks and sounds like belongs to the HUD & Catch Banner and Audio docs.

## Game Feel

Optional for an Economy system. This system has no input and no feedback of its own; what it shapes is pacing, through its odds. The targets the starting values aim at, all to be judged in play:

- About 22 bites at Top Shelf to log a pond's nine fish at Chill, falling to about 20 at High, 19 at Stoned and 18 at Zonked. This is a simulation of Formulas 1 and 2 at the starting values, 20,000 runs per state, from an empty log. Before the missing term it ran 22 rising to 25, the wrong way.
- Once a pond is complete, a Legendary once in every 6.5 to 10 Top Shelf bites (15.4% at Zonked down to 10% at Chill). Before it is logged, more often at higher states.
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

Checked against the QA lens (coverage of every core rule and formula, a measurable THEN, a boundary value per formula, one cross-system check). "Seeded" means the test fixes the random seed. Shares over many requests carry a tolerance of at least 4 standard deviations, so a correct build does not fail on chance. **Unless an AC names a logged set, the logged set is empty**: then every opened rarity is missing, Formula 1's missing term cancels, and the bands below match the all-logged figures.

**Data rules** — automated

- **AC-1** — **GIVEN** the shipped data, **WHEN** the database loads, **THEN** it reaches Ready and reports a pond count and an entry count equal to 10 times the pond count, each pond holding 3 Common, 2 Uncommon, 2 Rare, 1 Epic, 1 Legendary and 1 Lost Legend. **GIVEN** the full-game fixture (the draft content file converted to data), **THEN** the reported counts are 32 ponds in 8 areas of 4 ponds each, and 320 entries. (The shipped MVP data lists 1 pond.)
- **AC-2** — **GIVEN** test data in which one pond has 2 Commons, **WHEN** it loads, **THEN** the state is Failed and the report names that pond and the broken count.
- **AC-3** — **GIVEN** test data in which one species appears twice in a pond, **WHEN** it loads, **THEN** the state is Failed and the report names the pond and the species.
- **AC-4** — **GIVEN** test data with an entry whose minimum weight is 0, or whose maximum is not above its minimum, **WHEN** it loads, **THEN** the state is Failed and the report names the entry.
- **AC-5** — **GIVEN** test data with an empty shared junk list, **WHEN** it loads, **THEN** the state is Failed.
- **AC-6** — **GIVEN** the shipped data with one species renamed in the data file only, **WHEN** a catch of that species is requested, **THEN** the catch result carries the new name. (Proves nothing is written in code.)

**Order of answers** — automated, seeded

- **AC-7** — **GIVEN** Lost Legend due is raised at Lil' Puffin' Pond, at any tier, **WHEN** 100 catches are requested, **THEN** all 100 are the Silver Trout.
- **AC-8** — **GIVEN** tier 3, YAK LOCK bonus due is raised and Lost Legend due is not, **WHEN** 10,000 catches are requested, **THEN** every one is that pond's Epic or Legendary, and at the starting `yak_legendary_share` (0.5) each is between 48% and 52% of the total.
- **AC-9** — **GIVEN** both flags are raised, **WHEN** one catch is requested, **THEN** it is the Lost Legend and the system reports the YAK LOCK bonus as not spent.

**Sober and junk** — automated, seeded

- **AC-10** — **GIVEN** tier 0, none of the pond's Commons logged, and `junk_chance` 0.4, **WHEN** 10,000 catches are requested, **THEN** none is junk and every one is a Common of that pond.
- **AC-11** — **GIVEN** tier 0, all three Commons logged, and `junk_chance` 0.4, **WHEN** 10,000 catches are requested, **THEN** between 38% and 42% are junk and the rest are Commons of that pond.
- **AC-12** — **GIVEN** the same setup with `junk_chance` set to 0.8 (the ceiling), **WHEN** 10,000 catches are requested, **THEN** between 78% and 82% are junk. (A `junk_chance` above 0.8 fails to load: AC-35.)
- **AC-13** — (uses a test fixture with regional junk until the real lists exist: Open Question 3) **GIVEN** a pond whose area is North East, **WHEN** 10,000 junk catches are produced, **THEN** every item is from the shared list or the North East list, and no item from another region appears.

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
- **AC-22** — **GIVEN** tier 2 at a pond whose two Rares are both logged and only one carries the tag `trout`, with a `trout` lure at bias 3, **WHEN** catches are requested until 100,000 Rares have been produced (the rest are discarded), **THEN** the tagged Rare is between 74% and 76%; with the bias passed as 10 the share is the same (the cap); with the bias passed as 0.1 the share is between 49% and 51% (the floor).
- **AC-23** — **GIVEN** tier 1 and a lure whose tag matches only Rare entries of that pond, **WHEN** 10,000 catches are requested, **THEN** no Rare appears.

**Formula 4, weight and trophies** — automated, seeded

- **AC-24** — **GIVEN** an entry with range 0.3–1.4 lb, **WHEN** 100,000 catches of it are produced, **THEN** every weight is at least 0.3 and at most 1.4, the mean weight fraction is between 0.375 and 0.395, and between 2.9% and 3.5% are trophies.
- **AC-25** — **GIVEN** the same 100,000 catches, **WHEN** each is inspected, **THEN** every trophy has a weight fraction of 0.95 or more and no non-trophy does.
- **AC-26** — **GIVEN** a fixture random source that returns 0.5 for every draw, and tier 0 at Lil' Puffin' Pond with nothing logged and no lure, **WHEN** one catch is produced, **THEN** it is the Yellow Perch (the second Common in data order: Pumpkinseed, Yellow Perch, Brown Bullhead, each with a third of the pick weight) and its weight is 0.66 lb to the nearest 0.01 (range 0.3–1.4 lb, fraction 0.5 ^ 1.6 = 0.33).
- **AC-27** — **GIVEN** Lost Legend due is raised, **WHEN** 10,000 catches are requested, **THEN** none is flagged a trophy; and **GIVEN** junk catches, **THEN** none carries a weight or a trophy flag.

**Repeatability and co-op**

- **AC-28** — automated — **GIVEN** two random sources built from the same seed and the same sequence of requests, **WHEN** the sequence is run once with each, **THEN** the two lists of catch results are identical.
- **AC-29** — integration, **cannot be run until Multiplayer exists** — **GIVEN** a two-player session, **WHEN** a guest's line gets a bite, **THEN** the entry and weight shown on the guest's screen equal the host's roll.

**Across systems**

- **AC-30** — integration, retained screenshot — **GIVEN** a sober player at Lil' Puffin' Pond, **WHEN** a fish is landed, **THEN** the catch banner shows the same name, rarity and weight as the catch result. Cannot be run until Bite Timing, Reel-in Needle and the HUD exist.

**Added after the 2026-11-16 design review**

- **AC-31** — automated, seeded — **GIVEN** tier 2, **WHEN** 100,000 catches are requested at Chill state 1, **THEN** Rare is between 29% and 31%; and at Chill state 4, Rare is between 44% and 46%.
- **AC-32** — automated, seeded — **GIVEN** tier 4, **WHEN** 100,000 catches are requested at Chill state 1, **THEN** Legendary is between 17% and 19%; and at Chill state 4, Legendary is between 20.6% and 22.6%, Epic between 25.4% and 27.4% and Rare between 29% and 31%.
- **AC-33** — automated, seeded — **GIVEN** a request with tier −1, **WHEN** 10,000 catches are requested, **THEN** every one is a Common or junk, as for tier 0; and **GIVEN** tier 9 at Chill state 1, **WHEN** 100,000 catches are requested, **THEN** Legendary is between 17% and 19%, as for tier 4.
- **AC-34** — integration, **cannot be run until Multiplayer exists** — **GIVEN** two guests with different tiers, Chill states and logged sets whose bites resolve at the same instant, **WHEN** the host resolves them, **THEN** each catch is rolled from that guest's own inputs, the lower player slot's catch is rolled first, and each catch equals the one produced by resolving the two requests one after the other with the same random source.
- **AC-35** — automated — **GIVEN** test data in which exactly one knob is out of range (`state_bonus` 0.01, `new_entry_bias` 0.5, `lure_bias_cap` 5, `junk_chance` 1.0, `weight_skew` 0.5, `trophy_band` 0.5, `yak_legendary_share` 0.9, or an opened rarity's `base_weight` 101), **WHEN** it loads, **THEN** the state is Failed and the report names that knob (for `base_weight`, the tier and rarity).
- **AC-36** — automated — **GIVEN** test data in which a rarity that a tier opens has `base_weight` 0 or none, or a rarity that a tier does not open has a weight, **WHEN** it loads, **THEN** the state is Failed and the report names the tier and the rarity.
- **AC-37** — automated, seeded — **GIVEN** tier 3, YAK LOCK bonus due is raised and no Lost Legend is due, **WHEN** one catch is requested, **THEN** the catch result reports the YAK LOCK bonus as spent; and **GIVEN** neither flag, **THEN** it reports no flag spent.

**Added after the 2026-11-16 re-review**

- **AC-38** — automated — **GIVEN** test data listing exactly 1 valid pond, **WHEN** it loads, **THEN** the state is Ready and the report says 1 pond and 10 entries; **GIVEN** data listing 0 ponds, **THEN** the state is Failed and the report says no ponds.
- **AC-39** — automated — **GIVEN** test data in which one species has no tag, or carries a tag that is not on the tag list, **WHEN** it loads, **THEN** the state is Failed and the report names the species and (for an unlisted tag) the tag.
- **AC-40** — automated — **GIVEN** the database is Unloaded, Checking or Failed, **WHEN** a catch is requested, **THEN** the request is refused with an error naming the state and no catch is returned.
- **AC-41** — automated, seeded — **GIVEN** a request whose logged set contains an id that is not one of the pond's entries, **WHEN** 1,000 catches are requested, **THEN** the unknown id changes nothing: the shares equal those of the same request without it.

**Added after the 2026-11-16 third review**

- **AC-42** — automated — **GIVEN** test data in which a pond names an area that is not on the area list (or names none), or a regional junk item does, **WHEN** it loads, **THEN** the state is Failed and the report names the pond or item and the area.
- **AC-43** — automated, seeded — **GIVEN** YAK LOCK bonus due is raised and no Lost Legend is due, **WHEN** 10,000 catches are requested at each of tier 0, 1 and 2, **THEN** every catch is one that tier ordinarily produces (tier 0: Common or junk; tier 1: Common or Uncommon; tier 2: Common, Uncommon or Rare) and every result reports the bonus as not spent; and **GIVEN** tier 4, **THEN** every catch is an Epic or Legendary, each between 48% and 52%, and every result reports the bonus as spent.
- **AC-44** — automated — **GIVEN** a loaded database, **WHEN** a catch is requested for a pond that is not in the data, **THEN** the request is refused with an error naming the pond and no catch is returned.

**Added after the 2026-11-16 fourth review (owner decisions)**

- **AC-45** — automated, seeded — **GIVEN** tier 3 at Lil' Puffin' Pond, Chill state 4, and a logged set holding every entry but the Landlocked Atlantic Salmon (the Legendary), **WHEN** 100,000 catches are requested, **THEN** Legendary is between 25.0% and 26.4% and Epic between 21.0% and 22.3%; and at Chill state 1 with the same set, Legendary is between 9.5% and 10.5% (the missing term does nothing at state 1).
- **AC-46** — automated, seeded — **GIVEN** tier 3 at Lil' Puffin' Pond, Chill state 4, and a logged set holding every entry but the Pumpkinseed, **WHEN** 100,000 catches are requested, **THEN** Common is between 37.2% and 38.6%.
- **AC-47** — automated, seeded — **GIVEN** tier 3, YAK LOCK bonus due, no Lost Legend due and `yak_legendary_share` set to 0.8, **WHEN** 10,000 catches are requested, **THEN** Legendary is between 78% and 82% and the rest are the Epic; and **GIVEN** a fixture random source returning 0.31 for every draw at share 0.5, **THEN** the one catch is the Epic.
- **AC-48** — automated — **GIVEN** test data with a pond entry naming a species not on the species list, or a pond not on the pond list, or a one-off Lost Legend with no name, **WHEN** it loads, **THEN** the state is Failed and the report names the entry and the missing reference; and **GIVEN** a one-off Lost Legend with no tag, **THEN** the data loads.
- **AC-49** — automated, performance — **GIVEN** a Ready database with the full-game fixture, on the target hardware (Steam Deck; 60 fps, a 16.6 ms frame), **WHEN** 10,000 catch requests are made back to back, **THEN** they finish in under 1 second in all (0.1 ms each, under 1% of a frame).

**Not acceptance criteria: playtest questions**

These are feel judgments and cannot be passed or failed by a test: does junk on 40% of sober casts read as a nudge or as a punishment; does a trophy at about 1 catch in 32 feel special; does about 18 to 22 Top Shelf bites to finish a pond feel like the right length.

**Gaps found by the QA check**

- **Performance.** Covered by AC-49 since the owner set the budget (60 fps on Steam Deck, 2026-11-16). It can only run once there is a build on that hardware.
- **AC-29 and AC-30 wait on other systems.** Until then, co-op authority and the hand-off to the banner are untested.
- **AC-1 has been run once, by script, against the draft content file** (2026-11-16): 32 ponds, 320 entries, no rule broken. That is a check of the draft document, not of game data, which does not exist yet.

## Open Questions

| # | Question | Who settles it | By when |
|---|---|---|---|
| 1 | **Unit for very small fish.** A Delta Smelt, a Maryland Darter or a Mosquitofish weighs a fraction of an ounce. Proposed: each species names its display unit (pounds, ounces, or length in inches), with the roll unchanged. | Owner, in the HUD & Catch Banner doc | Before the Mid Atlantic content is written (Pond 2-3 has the first one) |
| 2 | **Weight ranges and tags for all 320 entries.** Lil' Puffin' Pond is done (owner 2026-11-16): ranges from the sketch, tags from the starting lure-family list, both in the content file under Pond 1-1. The other 310 entries list names and rarities only. | Owner and writer; North East's 40 first | Lil' Puffin' Pond before the MVP; the rest per area |
| 3 | **Regional junk.** The owner chose shared junk plus regional junk; no regional items are written yet. | Owner and writer | North East before the Vertical Slice |
| 4 | **Does a strain from another pond count as fully sober, junk included?** This doc assumes yes. | Strains & Unlock Chain doc | When that doc is written (10th) |
| 5 | **Can a Lost Legend be caught again?** Settled 2026-11-16: Straight Fire does not include Lost Legends (they come only from the due flag), and the brief's wording was updated the same day. Whether a Legend can be caught again is still the Lost Legends doc's. | Lost Legends doc; owner updates the brief | When that doc is written (28th) |
| 6 | **JSON or Godot resource files?** | Architecture decision | Technical Setup |
| 7 | **Feasibility is unchecked.** `docs/engine-reference/godot/modules/` has no scripting or data reference, so this design was not checked against the pinned engine. | Technical director | Technical Setup |
| 8 | ~~**No performance budget.**~~ **Closed 2026-11-16**: the owner set 60 fps on Steam Deck (a 16.6 ms frame); AC-49 tests a roll's cost against it. | Owner | Done |
| 9 | ~~**Nine Lost Legends are unverified folklore.**~~ **Closed 2026-11-16 (owner)**: web-checked. Three are real and stay: Champ, the Buford Dam Brown and Paul Bunyan's Walleye. Three are replaced with real records or reputations from the same water: the '78 Hopatcong Cat, the Okeechobee Lunker and the '74 Wilson Cat. Whiskey Barrel and El Rey Sábalo are resized to real reports. Abuelo Guavina stays as a stated invention. Each line in the content file says which. The sources are fishing and tourism sites, so check against agency record lists before any marketing use. | Owner | Done |
| 10 | **Is re-catching the Legendary for money acceptable?** | Economy doc | When that doc is written (18th) |
