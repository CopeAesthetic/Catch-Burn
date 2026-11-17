# Gear & Item Database

> **Status**: Designed (pending review)
> **Author**: owner + design-system skill
> **Last Updated**: 2026-11-16
> **Last Verified**: 2026-11-16
> **Implements Pillar**: Pillar 1 (The High Is the Progression); Pillar 2 (Chill First, Never Punishing); Pillar 4 (Budget Charm)
> **Creative Director Review (CD-GDD-ALIGN)**: SKIPPED 2026-11-16 — lean mode
> **Independent review**: not done. Run `/design-review design/gdd/gear-item-database.md` in a fresh session.

## Summary

The catalogue of every rod, line, lure, smoking item, mask, cooler, stringer, kayak, food and beer, and the single rule for how gear changes the numbers other systems own: flats add, percents add (held between half and double), smoking factors multiply. It makes upgrading feel like getting better at fishing while Pillar 1 holds: no item opens a fish, a rarity or a place.

> **Quick reference** — Layer: `Foundation` · Priority: `MVP` · Key deps: `Fish Database & Spawn Tables (soft)`

## Overview

The Gear & Item Database is the catalogue of everything the player can own or eat that is not a fish, a strain or a cosmetic: rods, lines, lures, smoking items, the gas mask, coolers, stringers, kayaks, food and beer. It also defines the **stat keys** gear may change (cast distance, bite wait, needle speed and the rest) and the one rule for how several items' changes combine. Each gameplay system owns its own base values; this system owns what gear does to them (systems index, "Gear & Item Database ↔ the systems gear modifies").

The player meets it in the Smoke & Tackle menu, on item cards in the shop, and as the difference a new rod makes on the water. It is where Pillar 1's line is held for gear: an item can make a fish easier to land, faster to bite, or a little likelier within a rarity the strain has already opened, and never anything more. Prices are Economy's; what the player owns and has equipped is Inventory's.
## Detailed Design

### Core Rules

*`economy-designer`, `systems-designer` and `game-designer` not consulted — Lean mode. Review manually before production.*

**Item kinds**

| Kind | Where it lives | How it is used | Starter (brief, starting kit) |
|---|---|---|---|
| Rod | Tackle Box, rod slot | Equipped; one at a time; the slot is never empty | Grandpa's Cane Pole |
| Line | Tackle Box, line slot | Equipped; may be empty | none |
| Lure | Tackle Box, lure slot | Equipped; may be empty | none |
| Smoking item | Tackle Box, smoking slot | Equipped; may be empty, but smoking needs one (brief) | One Hitter |
| Mask | Tackle Box, mask slot | Equipped; may be empty; only the Gas Mask for now | none |
| Cooler | Ladder | The best one owned is used automatically | Lunchbox |
| Stringer | Ladder | The best one owned is used automatically | Rope Stringer (content file; see Open Questions) |
| Kayak | Ladder | The best one owned is used automatically | Rental Kayak |
| Food | Fridge or Cooler | Eaten; used up | none |
| Beer | Fridge only | Drunk; used up | none |

Strains (and their concentrate versions) belong to Strains & Unlock Chain. Cosmetic skins belong to Cosmetics and change no stat.

**What an item record holds**

An id that is never reused; a name and a short name; its kind; its rarity (Common to Legendary); its ladder step, for ladder kinds; a region, for regional foods; a list of **modifiers**; for a lure, a species **tag** and a **bias**; a few **flags** (for example *usable while paddling*, *needs concentrate*, *shareable in co-op*); and its art reference. It holds no price.

**Rarity is a label, never a gate.** An item's rarity sets its colour on cards and is a hint for Economy's pricing and the shop's stock. Owning or equipping any item never opens a fish, a rarity, a pond or an area (Pillar 1).

**Modifiers and stat keys**

A modifier is a stat key, a kind and an amount. There are three kinds:

- **flat** — added to the base (a rod's hook-set window +0.2 s);
- **percent** — a share of the base (a lure's bite wait −15%);
- **factor** — a multiplier, used only by smoking items and the mask (the Gas Mask ×2).

The stat keys are this system's list, and a modifier naming any other key fails the data check. Each key names the system that owns its base value:

| Stat key | Kinds allowed | Base owned by | What it changes |
|---|---|---|---|
| `cast_distance` | percent | Casting & Tangle | How far a full charge throws |
| `tangle_escape` | percent | Casting & Tangle | How fast mashing frees a tangle |
| `bite_wait` | percent | Bite Timing | The average wait before FISH ON (5 s open, 2 s shade) |
| `sweet_spot_bonus` | percent | Bite Timing | How much shade shortens the wait |
| `hookset_window` | flat | Bite Timing | The 1.5 s window to hit Space on FISH ON |
| `needle_speed` | percent | Reel-in Needle | How fast the needle sweeps (negative is slower, easier) |
| `green_zone` | percent | Reel-in Needle | Width of the green (+1) zone |
| `blue_zone` | percent | Reel-in Needle | Width of the blue (+3) zone |
| `line_forgiveness` | flat | Reel-in Needle | Misses absorbed before a miss costs −1 |
| `chill_per_hit` | factor | Chill Meter & Smoking | Meter gained per hit of a strain |
| `grams_per_hit` | factor | Chill Meter & Smoking | Weed used per hit |
| `chill_drain` | percent | Chill Meter & Smoking | How fast the meter drains (negative lasts longer) |
| `paddle_speed` | percent | Player Controller | Kayak speed |
| `tip_resistance` | percent | Player Controller | How hard the kayak is to tip in co-op |
| `stash_slots` | flat | Inventory & Storage | Cooler capacity |
| `stringer_slots` | flat | Inventory & Storage | Fish carried on the water |
| `munchies` | flat | Hunger, Munchies & Drunk | Change to Munchies when eaten (negative lowers it) |
| `hunger` | flat | Hunger, Munchies & Drunk | Change to Hunger when eaten |
| `drunk` | flat | Hunger, Munchies & Drunk | Change to the Drunk meter (beer +10%) |

No stat key reads or changes rarity odds, which entries are open, or anything in Fish Database Formula 1. Adding one is a Pillar 1 change for the owner, not a data edit.

**The lure's bias** is not a stat key. A lure carries one species tag from the Fish Database's tag list and a bias from 1 to `lure_bias_cap` (3, owned by the Fish Database). The Fish Database reads it when it picks an entry within an open rarity.

**Rules the data must obey**, checked when it loads; anything that breaks one is reported by name and the game does not start with it (the same rule as the Fish Database):

1. Every id is unique.
2. Every modifier uses a listed stat key and a kind that key allows.
3. A factor is between 0.25 and 4.
4. A lure's tag is on the Fish Database's tag list, and its bias is between 1 and `lure_bias_cap`.
5. Each ladder has exactly one starter, and each step's ladder values are higher than the step below on every stat it changes (a ladder is strictly better step by step).
6. Every starting-kit item exists and is the right kind.
7. No item, modifier or amount is written in code.
8. The stacking knobs are in range: `pct_floor` from −0.9 to 0, `pct_cap` from 0 to 3 (Formula 1).

**Equipping and owning (decided 2026-11-16)**

- Tackle Box slots hold one item each. The rod slot can be swapped but never emptied; the others can be emptied.
- Ladders need no equipping: the highest step owned is in use. Buying a step replaces the one below in effect.
- **Gear never wears out and is never lost.** A blackout or a drift-off touches fish and Cooler contents only (brief), never gear.
- **MVP:** the player has the starting kit only. A debug toggle equips any item, so the stat contract can be tested before Jane's shop (Alpha).

**How a gameplay system gets a value**

When Bite Timing needs the bite wait, or the Needle its speed, it asks this system for the stat with its own base value and the player's current loadout (equipped Tackle Box items plus the best of each ladder, from Inventory). This system answers with the resolved value from Formula 1. It keeps nothing between asks. In co-op each player's loadout is resolved for that player only.

### States and Transitions

The system holds no player state. Which items are owned and equipped is Inventory's state. The database itself has four states, as the Fish Database's does:

| State | Meaning | Leaves when |
|---|---|---|
| Unloaded | Data not read yet | The game starts loading → Checking |
| Checking | Data tested against the data rules | All pass → Ready; any fails → Failed |
| Ready | Values can be asked for | Never, for the life of the session |
| Failed | A rule broke; the item, ladder or key is named | Only by fixing the data and restarting |

### Interactions with Other Systems

None of these systems has a design doc yet except the Fish Database, so every other row is this system's side of a contract the other doc must confirm.

| System | Comes in | Goes out | Who owns the line between them |
|---|---|---|---|
| Inventory & Storage | The loadout: equipped items, owned ladder steps | Item records, slot rules, the starting kit, ladder order, `stash_slots`, `stringer_slots` | Inventory owns ownership and capacity rules; this system owns what each item is |
| Casting & Tangle | A base value and a loadout | Resolved `cast_distance`, `tangle_escape` | Casting owns the base |
| Bite Timing | A base value and a loadout | Resolved `bite_wait`, `sweet_spot_bonus`, `hookset_window` | Bite Timing owns the base |
| Reel-in Needle | A base value and a loadout | Resolved `needle_speed`, `green_zone`, `blue_zone`, `line_forgiveness` | The Needle owns the base and every per-rarity number |
| Chill Meter & Smoking | A base value and a loadout | Resolved `chill_per_hit`, `grams_per_hit`, `chill_drain`; the smoking item's flags | Chill Meter owns each strain's base chill and grams |
| Hunger, Munchies & Drunk | — | Each food's and beer's `munchies`, `hunger`, `drunk` amounts | Hunger owns the meters and what eating does at 0 or full |
| Fish Database & Spawn Tables | The tag list; `lure_bias_cap` | The equipped lure's tag and bias | The Fish Database owns the cap and what the bias may touch |
| Player Controller | A base value and a loadout | Resolved `paddle_speed`, `tip_resistance` | The Controller owns the base |
| Economy | — | Each item's kind and rarity | Economy owns every price |
| Shop (Jane) | — | The catalogue | The shop owns what is stocked and when |
| Cosmetics | — | Which items can wear a skin | Cosmetics owns skins; a skin changes no stat |
| Save/Load (Repack) | — | Stable item ids | Save/Load stores ids only |

## Formulas

Starting values are proposals approved by the owner on 2026-11-16 as a place to start tuning, not balance. Where the content file gives a number (Spincast Combo +10% cast distance), it is used as written.

### 1. Resolving a stat

The stat_value formula is defined as:

`stat_value = max(0, base + Σflat) × clamp(1 + Σpercent, 1 + pct_floor, 1 + pct_cap) × Πfactor`

The sums and the product run over every modifier on that stat key in the player's loadout: the equipped Tackle Box items and the best owned step of each ladder. With no modifiers, the sums are 0 and the product is 1, so the value is the base.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| `base` | float | ≥ 0 | data file of the owning system | The value with no gear, owned by the system that asks (for example Bite Timing's 5 s wait). |
| `flat` | float | any; each item's amount | data file | Flat modifiers, added to the base (a rod's hook-set +0.2 s). |
| `percent` | float | −0.5 to +1.0 per modifier | data file | Percent modifiers as fractions (−0.15 is −15%). Summed, not multiplied (owner decision 2026-11-16). |
| `pct_floor` | float | −0.9 to 0 (start −0.5) | data file | The lowest the summed percent may reach. |
| `pct_cap` | float | 0 to 3 (start +1.0) | data file | The highest the summed percent may reach. |
| `factor` | float | 0.25 to 4 | data file | Multipliers, from the smoking item and the mask only. |

`pct_floor` and `pct_cap` are global, and a stat key may carry its own pair in the data to override them.

**Output Range:** from half the base to twice the base before factors, at the starting floor and cap (owner decision 2026-11-16: no gear combination more than halves or doubles a stat). Never below 0. With the shipped smoking data, factors reach at most ×6 (Dab Rig 3.0 × Gas Mask 2).

**Examples:**
- Bite wait, open water, Spincast Combo (no `bite_wait` modifier) and a lure at −15%: 5 × (1 − 0.15) = 4.25 s.
- Hook-set window with the Ultralight Spinner (+0.2 s flat): (1.5 + 0.2) × 1 = 1.7 s.
- Needle speed with three items at −30%, −25% and −20% (sum −75%): clamped to −50%, so the needle runs at half its base speed.
- Chill per hit, Dab Rig and Gas Mask: strain base × 3.0 × 2 = 6 times the strain's base, against the One Hitter's 1.0.

**Boundaries checked:**
- A summed percent of −100% or less would make a stat 0 or negative (an instant bite, a frozen needle). The floor of −50% prevents it, and `pct_floor` cannot be set below −0.9.
- A negative flat larger than the base would go below 0. The `max(0, …)` holds it at 0.
- A factor of 0 would turn smoking off without saying so. Factors are at least 0.25.
- `base` at 0 stays 0 under any percent or factor. A system that wants gear to matter must not use a base of 0.

**Loop check:** a stronger smoking item fills the meter faster, which reaches better rarity odds sooner (Fish Database Formula 1), which earns more money for better smoking items. That is the intended loop (Pillar 1). It is damped by grams per hit (more weed bought), by smoking draining Hunger faster, and by YAK LOCKED making fishing harder. Gear cannot open a rarity, so the loop speeds progress up but cannot skip it.

**Costs check:** gear is bought once and kept, so each ladder's top step is the dominant purchase for that ladder, a one-time sink Economy must price. Rods trade one stat for another (the Baitcaster: further casts, slower needle) except The Unc Stick, which is better at everything; that is acceptable only if its price is late-game (Economy, and Open Questions).

### 2. Smoking item starting values

Not a new formula: the `chill_per_hit` and `grams_per_hit` factors that Formula 1 multiplies the strain's base by. The content file rates them in words; the owner approved this scale on 2026-11-16 as a starting point.

| Word in the content file | `chill_per_hit` factor | | Word | `grams_per_hit` factor |
|---|---|---|---|---|
| low | 1.0 | | very low | 0.5 |
| low-med | 1.25 | | low | 0.75 |
| med | 1.5 | | med | 1.0 |
| med-high | 1.75 | | high | 1.5 |
| high | 2.0 | | | |
| very high | 2.5 | | | |
| max | 3.0 | | | |

| Item | Chill | Grams | Other (proposed) |
|---|---|---|---|
| One Hitter (starter) | 1.0 | 0.5 | — |
| Rolling Papers | 1.25 | 1.0 | shareable in co-op |
| Glass Pipe | 1.5 | 0.75 | — |
| Blunt Wrap | 1.5 | 1.5 | `chill_drain` −10% ("long-lasting session") |
| Full Leaf | 1.75 | 1.5 | `chill_drain` −20% ("slow burn") |
| Bubbler | 1.75 | 1.0 | — |
| Beaker Bong | 2.0 | 1.0 | — |
| Scientific Bong | 2.0 | 1.0 | reduces cough stun (see Open Questions) |
| Heady Bong | 2.5 | 1.0 | cosmetic glow |
| Nectar Collector | 2.0 | 1.0 of concentrate | needs concentrate |
| Mini Rig | 2.5 | 1.0 of concentrate | needs concentrate |
| Dab Rig | 3.0 | 1.0 of concentrate | needs concentrate |
| Puff-Go | 3.0 | 1.0 of concentrate | needs concentrate; usable while paddling |
| Gas Mask (mask slot) | ×2 | ×2 | doubles whatever item is equipped (brief) |

### 3. Ladder values

Not a formula: each ladder step sets one flat value outright, and the best owned step is the one used.

| Ladder | Steps and values | State |
|---|---|---|
| Cooler `stash_slots` | Lunchbox 4 → Hard-Side 6 → Marine 9 → "Big Chill" 12 | Content file |
| Stringer `stringer_slots` | Rope 5 → Chain 8 → Wire Fish Basket 12 → Floating Livewell 18 | **Proposed in the content file, not confirmed by the owner** |
| Kayak `paddle_speed`, `tip_resistance` | Rental → Sit-on-Top → Pedal | No numbers yet |

## Edge Cases

*`systems-designer` not consulted for this section — Lean mode. Review manually before production.*

- **If the player tries to empty the rod slot**: it cannot be emptied, only swapped for another owned rod. Casting always has a rod.
- **If the smoking slot is empty**: the player cannot smoke (brief: smoking needs a smoking item equipped). The mask, if equipped, does nothing.
- **If a mask is equipped with no smoking item**: no effect, and nothing is used up.
- **If two or more items change the same stat**: their modifiers combine by Formula 1: flats add, percents add, factors multiply.
- **If the summed percent passes the floor or the cap**: it is held at the limit. This is a clamp at run time, not a data error, because each item on its own is legal.
- **If a stat is asked for with no modifiers in the loadout**: the base is returned unchanged.
- **If the data names an unknown stat key, a kind the key does not allow, a factor outside 0.25–4, or a lure tag the Fish Database does not list**: the data check fails at load and names the item.
- **If a lure's bias is above `lure_bias_cap`**: the data check fails at load. (The Fish Database also clamps at run time, so a bad value never reaches a roll.)
- **If the player is given a lower ladder step than one they own** (debug, or a future gift): they own it, but the best step stays in use.
- **If a bigger stringer is bought while fish are on the stringer**: capacity only grows, so nothing is dropped. Ladders never step down, so capacity never shrinks.
- **If the player blacks out or drifts off**: gear is untouched. Fish and Cooler contents follow the brief's rules (Inventory and Day, Night & Sleep).
- **If a smoking item needs concentrate and the Cooler holds none of the current strain's concentrate**: the player cannot smoke with it. Whether concentrate is a separate item is the Strains doc's (Open Questions).
- **If the player tries to smoke while paddling**: only an item flagged *usable while paddling* (the Puff-Go) allows it. When smoking is allowed belongs to Chill Meter & Smoking; this system supplies the flag.
- **If an item is removed from the game after release**: its id is marked retired and never reused. A save holding a retired id keeps it as an inert item. How the save shows it is Save/Load's.
- **In co-op**: each player's stats resolve from their own loadout. One player's gear never changes another's numbers. Sharing a smoke ("puff puff pass") is Multiplayer's rule; this system only flags which items are shareable.

**Things a player could lean on, and why each is bounded**

- **Stacking every bite-wait modifier.** Held at half the base wait by the floor.
- **Dab Rig + Gas Mask for instant YAK LOCK.** Intended per the content file ("easy to YAK LOCK"). It costs double concentrate per hit and drains Hunger faster, and YAK LOCKED makes fishing harder.
- **Buying the top rod and never choosing.** The Unc Stick is better at everything by design; its price has to make it a late reward (Economy).

## Dependencies

**This system depends on:**

| System | Hard or soft | What it needs |
|---|---|---|
| Fish Database & Spawn Tables | Soft | The species tag list, to check lure tags, and `lure_bias_cap`. Designed; its doc already lists this system as a soft dependent. |

**Systems that depend on this one:**

| System | Hard or soft | What it needs from here |
|---|---|---|
| Inventory & Storage | Hard | Item records, slots, ladders, the starting kit, `stash_slots`, `stringer_slots` |
| Casting & Tangle | Hard | `cast_distance`, `tangle_escape` |
| Bite Timing | Hard | `bite_wait`, `sweet_spot_bonus`, `hookset_window` |
| Reel-in Needle | Hard | `needle_speed`, `green_zone`, `blue_zone`, `line_forgiveness` |
| Chill Meter & Smoking | Hard | `chill_per_hit`, `grams_per_hit`, `chill_drain`, smoking item flags |
| Hunger, Munchies & Drunk | Hard | Food and beer amounts |
| Fish Database & Spawn Tables | Soft | The equipped lure's tag and bias |
| Economy | Hard | Item kind and rarity, to price items |
| Shop (Jane) | Hard | The catalogue |
| Player Controller | Soft | `paddle_speed`, `tip_resistance` |
| Cosmetics | Soft | Which items can wear a skin |
| Save/Load (Repack) | Soft | Stable item ids |
| Multiplayer | Soft | The shareable flag; per-player resolution |

**One-directional for now.** Apart from the Fish Database, none of these has a design doc. Each must list this system among its dependencies when it is written and confirm the stat keys it owns.

**Change to the systems index needed:** the index shows this system depending on nothing, and lists only Casting, Needle, Chill Meter, Inventory, Economy and Shop as dependents. This doc adds the Fish Database as a soft dependency, and Bite Timing, Hunger, Player Controller, Cosmetics, Save/Load and Multiplayer as dependents.

## Visual/Audio Requirements

Optional for an Economy system; kept short. *`art-director` not consulted — Lean mode.*

- **One model per item** that appears in the world (rods, lures on the line, smoking items in hand, coolers, stringers, kayaks), built to the art bible, Section 3: chunky, one memorable feature, readable small (Principle 1, Budget Charm, Built to Show).
- **Food and beer** need an icon each, and a model only if they are held in first person (to be decided by the HUD and Hunger docs).
- **Gear rarity colours** follow the fish ladder in the UI only (content file; art bible, Section 4). Gold stays Legendary only.
- **The Heady Bong's glow** is cosmetic and changes no stat.

## Game Feel

Optional for an Economy system. Gear has no input of its own; the targets are how upgrades should read in play, judged by playtest, not tests:

- A new rod, line or lure should be noticeable within a few catches of equipping it. A +10% change is the smallest step the starting data uses.
- Upgrading should feel like getting better at fishing, never like unlocking fish (Pillar 1).
- The Dab Rig with the Gas Mask should feel like a big, funny jump in the Chill Meter, with the cost visible in grams.

## UI Requirements

This system has no screen. It must supply what the Smoke & Tackle menu, the Stash menu, item cards and the shop need:

- Name, short name, kind, slot or ladder, and rarity (as a word and a colour).
- Each modifier as a readable line ("+10% cast distance", "+0.2 s hook-set window", "×2 chill per hit"), built from the stat key and amount, never typed by hand.
- For a lure, its target tag as a word ("bass", "trout").
- Flags as short tags ("Needs concentrate", "Use while paddling", "Shareable").

> **📌 UX Flag — Gear & Item Database**: this system has UI requirements. In Pre-Production, run `/ux-design` for the Smoke & Tackle menu and the item card before writing epics.

## Cross-References

| This document says | It relies on | Where | State |
|---|---|---|---|
| A lure carries a tag and a bias up to `lure_bias_cap` | The tag list, the cap, what bias may touch | `design/gdd/fish-database-spawn-tables.md`, Formula 2 | Designed, In Review |
| No stat key touches rarity odds | Rarity odds | `design/gdd/fish-database-spawn-tables.md`, Formula 1 | Designed, In Review |
| Each stat key's base value | Base values | Casting, Bite Timing, Reel-in Needle, Chill Meter, Hunger, Player Controller, Inventory | Not written |
| Item prices | Pricing | Economy | Not written |
| What is owned and equipped; capacity rules | Ownership | Inventory & Storage | Not written |
| Starting kit; five Tackle Box slots; gas mask ×2; no lost gear in a blackout | Owner decisions | `design/game-brief.md`, Home and Smoking sections | Approved |
| Item list, rarities, stat words, ladder values | Content | `design/catch-n-burn/content-areas-fish-strains.md`, Shop catalogue | Draft v0.2 |
| Gear makes fish easier, never available | Pillar 1 | `design/gdd/game-concept.md`, Game Pillars | Approved 2026-11-16 |
| Item models and rarity colours | Shape language, colour | `design/art/art-bible.md`, Sections 3 and 4 | Written |

## Acceptance Criteria

Checked against the QA lens: every core rule and formula has a criterion, each THEN is measurable, the formula is tested at its floor, cap and zero, and at least one criterion crosses into another system. Formula 2 and the ladder table are data, covered through Formula 1 and the load checks.

**Data rules** — automated

- **AC-1** — **GIVEN** the shipped data, **WHEN** the database loads, **THEN** it reaches Ready and every item named in the content file's shop catalogue is present with the kind and rarity listed there.
- **AC-2** — **GIVEN** test data with two items sharing an id, **WHEN** it loads, **THEN** the state is Failed and the report names the id.
- **AC-3** — **GIVEN** test data with a modifier on an unknown stat key, or a percent modifier on `hookset_window`, **WHEN** it loads, **THEN** the state is Failed and the report names the item and the key.
- **AC-4** — **GIVEN** test data with a factor of 0.1 or of 5, **WHEN** it loads, **THEN** the state is Failed and the report names the item.
- **AC-5** — **GIVEN** test data with a lure tagged `marlin` (not on the Fish Database's list), or with a bias of 3.5, **WHEN** it loads, **THEN** the state is Failed and the report names the lure.
- **AC-6** — **GIVEN** test data in which the Hard-Side Cooler has 4 stash slots (not above the Lunchbox), or a ladder has two starters, **WHEN** it loads, **THEN** the state is Failed and the report names the ladder.
- **AC-7** — **GIVEN** test data with `pct_floor` −1.0 or `pct_cap` 4, **WHEN** it loads, **THEN** the state is Failed and the report names the knob.
- **AC-8** — **GIVEN** the shipped data with one item renamed in the data file only, **WHEN** that item's record is read, **THEN** it carries the new name. (Proves nothing is written in code.)

**Formula 1, resolving a stat** — automated, unit

- **AC-9** — **GIVEN** `bite_wait` base 5 and a loadout with one −15% `bite_wait` modifier, **WHEN** the stat is resolved, **THEN** the value is 4.25.
- **AC-10** — **GIVEN** `hookset_window` base 1.5 and a +0.2 flat modifier, **WHEN** it is resolved, **THEN** the value is 1.7.
- **AC-11** — **GIVEN** a +10% and a +15% modifier on one stat with base 1, **WHEN** it is resolved, **THEN** the value is 1.25 (added, not 1.265 multiplied).
- **AC-12** — **GIVEN** base 1 and percents of −30%, −25% and −20%, **WHEN** resolved, **THEN** the value is 0.5 (the floor); and **GIVEN** +60% and +60%, **THEN** 2.0 (the cap).
- **AC-13** — **GIVEN** base 1.5 and a flat modifier of −3, **WHEN** resolved, **THEN** the value is 0.
- **AC-14** — **GIVEN** an empty loadout, **WHEN** every stat key is resolved with base 7, **THEN** each value is exactly 7.
- **AC-15** — **GIVEN** base 1 and the Dab Rig with the Gas Mask, **WHEN** `chill_per_hit` and `grams_per_hit` are resolved, **THEN** they are 6.0 and 2.0; and with the One Hitter alone, 1.0 and 0.5.

**Slots, ladders and ownership**

- **AC-16** — automated — **GIVEN** a new game, **WHEN** the starting loadout is read, **THEN** it holds Grandpa's Cane Pole and the One Hitter equipped, the line, lure and mask slots empty, and the Lunchbox (4 stash slots), Rope Stringer (5) and Rental Kayak in use.
- **AC-17** — automated — **GIVEN** a player owning the Lunchbox and the Marine Cooler, **WHEN** `stash_slots` is resolved, **THEN** it is 9; and after the Hard-Side Cooler is also given, still 9.
- **AC-18** — integration, needs Inventory — **GIVEN** the rod slot holds a rod, **WHEN** the player tries to empty it, **THEN** the request is refused and the same rod stays equipped.
- **AC-19** — integration, needs Chill Meter & Smoking — **GIVEN** the smoking slot is empty and the Cooler holds weed, **WHEN** the player presses F on the water, **THEN** no hit happens and no weed is used.
- **AC-20** — integration, needs Hunger and Inventory — **GIVEN** a player with non-starter gear owned and equipped, **WHEN** they drink a 10th beer and black out, **THEN** owned and equipped gear is identical before and after.
- **AC-21** — automated — **GIVEN** two loadouts, one with the Baitcaster and one with Grandpa's Cane Pole, **WHEN** `needle_speed` is resolved for each with the same base, **THEN** the Baitcaster's is 10% lower and the Cane Pole's equals the base. (Co-op resolves per player.)
- **AC-22** — automated — **GIVEN** the debug toggle is on, **WHEN** the Graphite Pro Rod is equipped through it, **THEN** `green_zone` resolves to 1.2 × base.

**Across systems**

- **AC-23** — automated, integration with the Fish Database, seeded — **GIVEN** tier 3 and Chill state 1 at Lil' Puffin' Pond, **WHEN** 100,000 catches are requested once with no gear and once with each rod and each lure in the data in turn, **THEN** Legendary stays between 9.5% and 10.5% and Epic between 15.4% and 16.6% every time. (Pillar 1: gear never changes rarity odds.)
- **AC-24** — automated — **GIVEN** a `trout` lure with bias 3 equipped, **WHEN** the Fish Database asks for the lure bias, **THEN** it receives tag `trout` and bias 3.
- **AC-25** — UI, retained screenshot, needs the Smoke & Tackle menu — **GIVEN** the Spincast Combo, **WHEN** its card is shown, **THEN** it reads "+10% cast distance", generated from the data.

**Not acceptance criteria: playtest questions**

Is a +10% step noticeable within a few catches; does the Dab Rig with the Gas Mask feel funny rather than broken; does buying gear feel like getting better at fishing rather than unlocking fish.

**Gaps found by the QA check**

- **No performance criterion**: the project has no budget set. A stat resolve is a few additions, but there is nothing to test it against.
- **AC-1 cannot pass yet**: lines, most lures, The Unc Stick, kayaks and foods have words, not numbers (Open Questions 2–4 and 6).
- **AC-18 to AC-20 and AC-25 wait on other systems.**

## Open Questions

| # | Question | Who settles it | By when |
|---|---|---|---|
| 1 | **Stringer slots 5 → 8 → 12 → 18, and the Rope Stringer as a starter.** The content file proposes both; the brief's starting kit does not list a stringer. | Owner | Before Inventory & Storage is designed (MVP) |
| 2 | **Numbers for lines, lures and The Unc Stick.** The content file gives words ("line strength", "species bias", "all rod stats"). Lures also need their tags; only Topwater = bass is named. | Owner and content work | Starter items before the MVP; the rest before Jane (Alpha) |
| 3 | **Kayak numbers** for `paddle_speed` and `tip_resistance`. | Owner, with the Player Controller doc | Rental Kayak before the MVP |
| 4 | **Concentrate**: is it a separate item, or a version of each strain? Four smoking items need it. | Strains & Unlock Chain doc | When that doc is written (10th) |
| 5 | **Cough stun**: the Scientific Bong reduces it, but the brief has no cough mechanic. Add one, or drop the line. | Owner, in the Chill Meter doc | When that doc is written |
| 6 | **Food amounts**: small, medium, large and "full reset" need numbers. | Hunger, Munchies & Drunk doc | When that doc is written |
| 7 | **Regional legendary snacks**: sold only in their region, or everywhere once that region is open? | Shop and Economy docs | Alpha |
| 8 | **JSON or Godot resource files?** Shared with the Fish Database. | Architecture decision | Technical Setup |
| 9 | **Feasibility is unchecked**: `docs/engine-reference/godot/modules/` has no scripting reference. | Technical director | Technical Setup |
| 10 | **No performance budget.** | Owner, via `/project-settings` | Before the first build |
| 11 | **Item prices**, including The Unc Stick's late-game price. | Economy doc | When that doc is written (20th) |
