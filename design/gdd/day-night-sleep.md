# Day, Night & Sleep

> **Status**: Approved (second `/design-review` 2026-11-17, lean, 0 blockers; 11 recommended items open, see `design/gdd/reviews/day-night-sleep-review-log.md`)
> **Creative Director Review (CD-GDD-ALIGN)**: skipped — Lean mode
> **Author**: owner + Claude (design-system, lean review)
> **Last Updated**: 2026-11-17
> **Last Verified**: 2026-11-17
> **Implements Pillar**: Pillar 2 (Chill First, Never Punishing); Pillar 5 (Better With Friends, Whole Alone)

## Summary

Day, Night & Sleep is the game's clock and its bed: an in-game day of about 18 real minutes from sunrise to midnight, two warnings before it ends, and a bed the player can use at any hour. When a day ends, by bed or by drifting off at midnight, one overnight handover pays Jimmy for the fish in The Drop Box, delivers the orders, spoils every fish left out and starts the next sunrise. It gives the game a gentle daily rhythm and a soft deadline, in solo and in co-op where everyone sleeps together. Read it for anything that depends on the time of day, the overnight, or spoilage.

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `None` (soft: Settings & Input, Scene Flow & Loading, Multiplayer, and catch state from Casting & Tangle, Bite Timing and Reel-in Needle)

## Overview

Day, Night & Sleep is the game's clock and its bed. It runs one in-game day from sunrise to midnight in about 15 to 20 real minutes, tells every other system what time of day it is, and ends the day in one of two ways: the player goes to bed, or at midnight they drift off and wake up in the bed. It then owns the overnight handover, the single moment when Jimmy's payout for the fish in The Drop Box, The Guy's deliveries and the spoiling of everything left out all take effect before the next sunrise. It does not own the rules behind any of those: Economy sets what a fish is worth, Deliveries & Drop Box sets what arrives, and Inventory & Storage sets what spoils. Players meet it as the light changing over the water, a warning that the day is nearly over, and the bed in the shack. Shade Sweet Spots, Bite Timing, Retro Rendering's lighting, the HUD and Audio all read its clock. Without it the day has no shape: no deadline to race, no morning payout, and nothing that makes an overnight delivery mean anything.

## Detailed Design

### Core Rules

1. **One clock, one day.** The game has one in-game clock. It runs from sunrise (06:00) to midnight (24:00) once per day, and a day takes `day_length_s` real seconds of running time (Formula 1, about 18 minutes, a starting value to tune). At the default one real second is one in-game minute. Days are counted from 1. A new game starts on day 1 at sunrise.

2. **When the clock runs.** It advances only in the Gameplay and Phone contexts and only while `game_time_paused` (Settings & Input rule 17) is false. It keeps running while the phone is open (brief). It stops in the Main Menu, in Settings in solo, and during the overnight (rule 8). It also stops during Cutscene / Loading unless Scene Flow says otherwise, so loading or a cutscene never takes time from the day (Pillar 2). In co-op the clock never stops for one player's menu.

3. **Phases and what this system publishes.** The phase is derived from the clock, never stored: **Dawn** 06:00–08:00, **Day** 08:00–19:00, **Dusk** 19:00–21:00, **Night** 21:00–24:00 (the Dawn and Dusk boundaries are data, and Night begins when the first warning fires, Formula 2). This system publishes `time_of_day` (hours, 6.0 to 24.0), `phase`, `is_night`, `seconds_to_midnight` and `day_number`, and emits `phase_changed`. Dawn and Dusk change the light only. **Night is the one phase with a rule effect** (owner decision 2026-11-17, kept from the brief): while `is_night` is true, Shade Sweet Spots offers no sweet spots and Bite Timing lengthens waits. Those two systems own the numbers; this system owns only when night begins.

4. **Two warnings before midnight** (owner decision 2026-11-17). **"Getting late"** at `warn1_lead_s` (180 s) before midnight and **"Last call"** at `warn2_lead_s` (60 s) before. They are set in real seconds, so they hold if the day length changes. Each shows a banner (HUD & Catch Banner) with a phone chime (Audio). Neither takes input or interrupts play. Night begins at the first warning (owner decision 2026-11-17), so the chime, the banner and the loss of shade spots land together at any day length. At the defaults the first falls at 21:00 and the second at 23:00. Each fires once a day. A player who is already in bed gets neither.

5. **Going to bed** (owner decision 2026-11-17: any hour). The bed is an `interact` object in the shack (Interaction owns the prompt). A player can use it at any hour, and sleeping early skips the rest of the day, so a player with nothing left to do can move on. In solo the overnight starts at once. In co-op, rule 7 applies. The bed cannot be used in the Cutscene / Loading context.

6. **Midnight.** When the clock reaches 24:00 each player drifts off wherever they are, and the overnight starts (reason: midnight). If a catch is in progress at that moment (from the bite, when FISH ON shows, until the fish is landed or lost, including a tangle), the drift-off waits for it to end, for at most `midnight_grace_s` (20 s, Formula 3). The clock stays at 24:00 meanwhile. The grace is counted in game time, so it stops while `game_time_paused` is true (rule 2). A fish landed in that time is kept and, like every fish outside The Drop Box, spoils overnight. In co-op the overnight starts when no player has a catch in progress, or after 20 s. Casting & Tangle, Bite Timing and Reel-in Needle each report a per-player `catch_in_progress` flag, raised at the bite and cleared when the fish is landed or lost (provisional: none is designed yet). This system reads only the flag and never asks how long a catch has left.

7. **Co-op: everyone sleeps together** (owner decision 2026-11-17). There is one clock, the host's. A player who uses the bed while another is still up lies in bed and waits; the world runs on around them. The overnight starts when every connected player is in bed, or at midnight for everyone. A waiting player can get up with `interact`. Everyone in bed sees who is still up. A player who disconnects stops counting. A player who joins counts as up. A joiner who arrives during the overnight waits for it to finish. In co-op nothing here ever pauses (Pillar 5).

8. **The overnight handover** runs once whenever a day ends, by bed or by midnight. The screen fades to black and the Cutscene / Loading context begins (held actions are cancelled, Settings & Input rule 7). The steps run in this fixed order, each finishing before the next starts:
   1. **Spoilage.** Every fish the player holds outside The Drop Box is marked spoiled (Inventory & Storage carries it out). A spoiled fish stays in the inventory and sells only at the Quick Sell price, even in The Drop Box (brief). Only fish are touched: gear, weed, food and the Cooler's other contents are unchanged.
   2. **Payout.** Every fish in The Drop Box is sold to Jimmy, and the cash is placed in the box (Economy sets the value, Deliveries & Drop Box moves the cash).
   3. **Deliveries.** Every order now due arrives in the box (The Guy's and Jane's). The first strain arrives after the first sleep.
   4. **New day.** `day_number` goes up by 1, the clock returns to sunrise, and `day_started` is emitted. Hunger, Chill and any other system with a daily reset decides its own reset.
   After step 4 and before step 5, **Save/Load's wake-up save** is written (Save/Load rule 5). It is not a numbered step: it changes no game state, and step 5 waits for it. If a quit request is waiting, the game exits after the save without waking the player (Save/Load rule 6).
   5. **Wake.** The player is placed in the shack bed (rule 9) and the screen fades up into Gameplay.

9. **Wake in bed** is one routine: fade, place the player in the bed of the current area's shack (the kayak returns to its dock), restore Gameplay input. The overnight uses it, and so does the 10-beer blackout. The blackout does not run the handover and does not change the clock; Hunger, Munchies & Drunk owns it and calls this routine (provisional, Open Question 2).

10. **Saving.** `day_number` and `time_of_day` are part of a save, so a save made mid-day resumes at the same time of day. Save/Load (Repack) decides when a save can be made.

### States and Transitions

| State | The clock | What the player sees |
|---|---|---|
| **Running** | Advances | Normal play. The sky follows the phase. |
| **Paused** | Stopped | Settings in solo, Cutscene / Loading, the Main Menu. Entered and left through `game_time_paused` and the input context. |
| **Midnight Grace** | Held at 24:00 | Play continues for at most `midnight_grace_s` of game time while a catch finishes. |
| **In Bed (waiting)** | Advances | Co-op only: this player is lying in bed, others are up. |
| **Overnight** | Stopped | Black screen while rule 8's steps run. |

| From | To | Trigger |
|---|---|---|
| Running | Paused | `game_time_paused` becomes true, or the context becomes Cutscene / Loading, Settings (solo) or Main Menu |
| Paused | Running | `game_time_paused` false and the context is Gameplay or Phone |
| Running | Overnight | The bed used in solo, or every connected player in bed in co-op (reason: bed) |
| Running | In Bed (waiting) | The bed used in co-op while another player is up |
| In Bed (waiting) | Running | That player gets up with `interact` |
| In Bed (waiting) | Overnight | The last player gets into bed, or midnight |
| Running | Midnight Grace | The clock reaches 24:00 while a player has a catch in progress |
| Running | Overnight | The clock reaches 24:00 with no catch in progress (reason: midnight) |
| Midnight Grace | Overnight | No player has a catch in progress, or `midnight_grace_s` of game time has passed |
| Midnight Grace | Paused | `game_time_paused` becomes true (solo): the grace timer and the catch both stop |
| Paused | Midnight Grace | `game_time_paused` false again: the grace timer resumes where it stopped |
| Overnight | Running | Rule 8 step 5 finishes (day `n+1`, sunrise) |

The clock reads 06:00 to 24:00 only. There is no 00:00 to 06:00 state, because the night is the overnight handover, not a stretch of play.

### Interactions with Other Systems

| System | Flows in | Flows out | Owner of the interface |
|---|---|---|---|
| Settings & Input | `game_time_paused` (solo pause, rule 17); the active input context | — | Settings & Input owns the flag; this system stops its clock on it |
| Interaction (E) | `interact` on the bed (and to get up) | Whether the bed is usable; "Waiting for [names]" text | Interaction owns the prompt |
| Player Controller | — | Wake placement in the bed; the drift-off (input cancelled) | Player Controller owns movement |
| Scene Flow & Loading | Starts and ends the Cutscene / Loading context | Requests the fade and the shack placement; reports whether time runs in a cutscene | Scene Flow |
| Shade Sweet Spots | — | `time_of_day`, `phase`, `is_night` | Shade Sweet Spots owns where shade is; none at night |
| Bite Timing, Reel-in Needle, Casting & Tangle | Per-player `catch_in_progress` flag, raised at the bite | `is_night` (Bite Timing lengthens waits) | Bite Timing owns the wait; the others report their state |
| Economy (Jimmy) | The payout total | Rule 8 step 2 trigger | Economy owns fish value and the Quick Sell price |
| Deliveries & Drop Box | The delivered items and cash | Rule 8 steps 2 and 3 triggers; `day_number` | Deliveries & Drop Box owns the box |
| Inventory & Storage | The spoiled flag on fish | Rule 8 step 1 trigger | Inventory & Storage owns which fish are held where |
| Hunger, Munchies & Drunk; Chill Meter & Smoking | — | `day_started`; the wake-in-bed routine for the blackout | Each owns its own daily reset |
| Retro Rendering | — | `time_of_day`, `phase` (sun direction, tint and fog colour, never fog density); the phase-boundary hours `dawn_end_hour`, `dusk_start_hour`, `night_start_hour` (Formula 2), so its light keys and sun path line up with the phases (added 2026-11-17 for `design/gdd/retro-rendering.md`) | Retro Rendering draws it and owns the sun's path |
| Audio | — | `phase_changed`, the two warnings, sleep and wake cues | Audio owns the mix |
| HUD & Catch Banner; Flip Phone & FishMail | — | The warnings, `seconds_to_midnight`, who is still up in co-op; the phone LCD shows the time and day number (provisional) | The HUD and the phone draw them |
| Multiplayer (Alpha) | Players connected, who is in bed | The host-authoritative clock; the overnight start | Multiplayer carries the sync |
| Save/Load (Repack) | — | `day_number`, `time_of_day`; the wake-up save as the handover's last act, between steps 4 and 5 (Save/Load rule 5) | Save/Load owns the file |
| Main Menu & Intro | New Sesh | Starts day 1 at sunrise | Main Menu |

## Formulas

All `data file` values below live in the day-clock config resource, not in code. Time of day is in in-game hours (06:00 is 6.0, midnight is 24.0).

### Formula 1: Clock advance

The clock_advance formula is defined as:

`clock_rate = (24 − sunrise_hour) / day_length_s`
`time_of_day = min(24, time_of_day + clock_rate × dt)` on each frame the clock is running (rule 2)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| sunrise_hour | float | 6.0 | constant | The hour a day starts. Fixed: the art bible's sunrise and the brief's "sunrise to midnight" |
| day_length_s | float | 720–1440 | data file, default 1080 | Real seconds of running time from sunrise to midnight (12–24 min; the brief's start is 15–20) |
| clock_rate | float | 0.0125–0.025 | calculated | In-game hours per real second: 1/60 at the default, one in-game minute per real second |
| dt | float | 0–0.1 s | calculated (frame time, capped at 0.1 s) | Time since the last frame. The cap stops a hitch from eating a stretch of the day |
| time_of_day | float | 6.0–24.0 | calculated | The clock. Set to `sunrise_hour` at the new-day step (rule 8) and never goes past 24 |

**Output Range:** 6.0 to 24.0. At `dt` = 0 the clock does not move. `day_length_s` is never 0 because the load check refuses a value under 720. A frame longer than 0.1 s counts as 0.1 s, so a long stall slightly slows the day instead of skipping it.

**Example:** at the defaults, `clock_rate` = 18 / 1080 = 1/60 h/s. After 540 s of running time `time_of_day` = 6 + 540/60 = **15.0**. At 1080 s it is **24.0**. At the maximum `day_length_s` of 1440 the rate is 0.0125 h/s (75 s per in-game hour), at the minimum of 720 it is 0.025 (40 s per hour).

### Formula 2: Phases, night start and warnings

The day_phase formula is defined as:

`night_start_hour = 24 − warn1_lead_s × clock_rate`
`warn2_hour = 24 − warn2_lead_s × clock_rate`
`seconds_to_midnight = (24 − time_of_day) / clock_rate`
`phase = Dawn if time_of_day < dawn_end_hour; Day if < dusk_start_hour; Dusk if < night_start_hour; else Night`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| warn1_lead_s | float | 120–300 | data file, default 180 | Real seconds before midnight of "Getting late". Night begins at this moment (owner decision 2026-11-17) |
| warn2_lead_s | float | 30–120 | data file, default 60 | Real seconds before midnight of "Last call"; must be less than `warn1_lead_s` |
| dawn_end_hour | float | 7.0–10.0 | data file, default 8.0 | Hour Dawn ends and Day begins |
| dusk_start_hour | float | 17.0–20.0 | data file, default 19.0 | Hour Day ends and Dusk begins |
| night_start_hour | float | 16.5–22.5 | calculated | Hour Night begins; the first warning fires here |
| warn2_hour | float | 21.0–23.625 | calculated | Hour "Last call" fires |
| seconds_to_midnight | float | 0–`day_length_s` | calculated | Real seconds of running time left in the day |

The load check refuses a config unless `dawn_end_hour` < `dusk_start_hour` < `night_start_hour` and `warn2_lead_s` < `warn1_lead_s`, naming the first rule broken. Not every pair of in-range knobs is valid together: `day_length_s` 720 with `warn1_lead_s` 300 puts `night_start_hour` at 16.5, below the lowest `dusk_start_hour` (17.0), and `day_length_s` 720 with `warn1_lead_s` 240 puts it at 18.0, below the default 19.0. The load check decides, and its message names the rule broken.

**Output Range:** the four phases tile 6.0 to 24.0 with no gap or overlap. `is_night` is true from `night_start_hour` until the new-day step.

**Example:** at the defaults `night_start_hour` = 24 − 180/60 = **21.0** and `warn2_hour` = 24 − 60/60 = **23.0**. Dawn is 6–8, Day 8–19, Dusk 19–21, Night 21–24: the player gets 3 real minutes of Night and 2 of Dusk. At `day_length_s` = 1440 (rate 0.0125): `night_start_hour` = 24 − 2.25 = 21.75, so the chime and the loss of shade spots still land together, and Dusk is 2.75 hours long.

### Formula 3: Midnight grace

The drift_off rule is defined as:

`midnight_hold_s` = game-time seconds since the clock reached 24:00
`drift_off = (no player has catch_in_progress) OR (midnight_hold_s >= midnight_grace_s)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| catch_in_progress | bool, per player | true / false | Casting & Tangle, Bite Timing, Reel-in Needle | True from the bite (FISH ON) until the fish is landed or lost; false when no catch is under way |
| midnight_grace_s | float | 5–45 | data file, default 20 | The longest the overnight waits for catches to finish |
| midnight_hold_s | float | 0–`midnight_grace_s` | calculated | Game-time seconds the overnight has waited since 24:00; stops while `game_time_paused` is true |

**Output Range:** the overnight starts after 0 to `midnight_grace_s` of game time. With no catch in progress it is 0, so midnight is instant. A catch that is still going at 20 s is cut off by the drift-off like any other action (held actions are cancelled), and the fish is lost as in any failed catch.

**Example:** two players in co-op, one whose flag clears 8 s after midnight and one with none: the rule turns true when that flag clears, at `midnight_hold_s` = **8 s**. A needle fight still going at 20 s: true at **20 s**, and the catch is cancelled. Solo, Settings opened 5 s into the grace and closed 10 s later: the overnight starts 20 s of game time after midnight, which is 30 s of real time.

### Formula 4: Overnight start

The overnight_start rule is defined as:

`overnight_starts = (players_in_bed == players_connected) OR (time_of_day == 24 AND drift_off)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| players_connected | int | 1–4 | calculated (Multiplayer; 1 in solo) | Players currently in the game, the host included |
| players_in_bed | int | 0–`players_connected` | calculated | Players currently lying in the bed (rule 7) |

**Output Range:** boolean, evaluated every frame while Running. `players_connected` is never 0, since the host is always connected, so "everyone in bed" cannot be true of an empty room. If a player disconnects while the others are in bed, `players_connected` drops and the overnight starts that frame.

**Example:** four players, three in bed at 14:00: false, the fourth is still up. The fourth goes to bed: **true**, the overnight starts, and day 2 begins at sunrise for everyone. Solo at 07:00 with the bed used: 1 == 1, **true** at once.

**Feedback loops:** none. The clock depends on nothing the player does. `day_length_s` is the one number the whole economy's per-day cadence hangs on: changing it changes income, hunger and spoilage per real minute, so Economy, Hunger and Chill must tune against it and re-check when it moves.

## Edge Cases

`game-designer`, `systems-designer` and `ux-designer` were not consulted for Detailed Design and this section (Lean mode). Review manually before production.

**The clock and pausing**

- **If the Settings screen is open in solo when midnight would arrive**: it does not arrive. The clock is stopped (rule 2), so midnight waits until Settings closes.
- **If Settings is open in co-op when the clock reaches 24:00**: the clock never stopped, so the drift-off happens. Settings closes as for any context exit and its file is written (Settings & Input rule 15).
- **If the phone is open at midnight**: it closes with the drift-off, and held actions are cancelled (Settings & Input rule 7).
- **If the gamepad disconnects or the window loses focus during the overnight**: the handover continues, because it runs on no game time. The notice shows when Gameplay resumes.
- **If a frame hitch lasts longer than 0.1 s**: the clock advances by 0.1 s only (Formula 1), so a stall slightly slows the day and never skips a warning or midnight.
- **If the clock would show an earlier time than it did a moment ago on a co-op client**: it never runs backwards. A correction from the host that would move it back holds the client's clock until the host catches up.

**Midnight, the bed and the warnings**

- **If the bed is used on the same frame as midnight**: the result is the same overnight. The reason is recorded as midnight, with no other difference.
- **If the player is on the kayak, or on any pond, at midnight**: they drift off there and wake in the current area's shack bed, and the kayak returns to its dock (rule 9). Nothing is lost beyond rule 8.
- **If a catch is still going when `midnight_grace_s` runs out**: the drift-off cancels it like any other held action, and the fish is lost as in a failed catch (Formula 3).
- **If FISH ON shows before midnight and the hook-set comes after it**: the catch counts as in progress from the bite, so the drift-off waits for it, up to `midnight_grace_s` (rule 6).
- **If Settings opens in solo during Midnight Grace**: the grace timer stops with the catch and resumes when Settings closes, so opening Settings never costs the fish (rule 6, Formula 3).
- **If a fish is placed in The Drop Box before the overnight starts, including during the grace seconds**: it counts as in the box at rule 8 step 2. Step 2 reads the box at that moment.
- **If a save is made during Midnight Grace**: a catch in progress is not saved, so loading it starts the overnight at once.
- **If a save is loaded, or a player joins, after a warning's hour has passed**: that warning is not replayed. A later warning still fires when its hour arrives.
- **If the loaded `time_of_day` is above 24 or below 6**: it is clamped into 6.0 to 24.0. A save at exactly 24.0 starts the overnight on load.
- **If `day_length_s` changes between a save and its load**: `time_of_day` is saved in in-game hours, so it stays valid, and only the speed changes.

**Spoilage and the overnight**

- **If a fish is in the Cooler, on the stringer or carried when the overnight starts**: it spoils. Only The Drop Box protects a fish (brief). Whether a better Cooler could keep fish fresh is Open Question 4.
- **If the player sleeps with nothing to sell and no orders due**: the overnight still runs, and the day number still goes up. Nothing else changes.
- **If the player sleeps at 06:00, again and again**: each sleep is a full day. No limit applies (Pillar 2). Any daily reset in Hunger or Chill would be available on demand, so those systems must not make sleep a free refill (Open Question 3).
- **If the game is closed during the overnight**: the quit is queued (Save/Load rule 6). The handover finishes, the wake-up save is written, and the game exits without fading up. The next load is the new morning, with every step applied. The handover is never half-applied.

**Co-op**

- **If a player disconnects while the others are in bed**: they stop counting (Formula 4), and the overnight starts that frame if everyone left is in bed.
- **If a player joins while everyone else is in bed**: they count as up, so the overnight waits for them or for midnight.
- **If a player joins during the overnight**: they wait on a black screen and wake with the others at sunrise (Multiplayer owns the join).
- **If two players use the bed on the same frame**: both count, and the order does not matter.
- **If the host leaves**: the session ends (Multiplayer owns it, Open Question 5). This system keeps no clock of its own for a guest.

## Dependencies

**Upstream (this system depends on):** none that are hard. It works with nothing else built, and each link below degrades to a simpler day.

| System | Hard / soft | What it needs | Without it |
|---|---|---|---|
| Settings & Input | Soft | `game_time_paused` and the input context (rule 2) | The clock never pauses for Settings, the pad disconnect or focus loss |
| Scene Flow & Loading (VS) | Soft | The Cutscene / Loading context; the fade and shack placement for the wake (rule 9) | The wake is a hard cut and the clock keeps running while loading |
| Multiplayer (Alpha) | Soft | Players connected; who is in bed; the host-authoritative clock (rule 7, Formula 4) | Treated as solo: one player, no waiting in bed |
| Casting & Tangle, Bite Timing, Reel-in Needle | Soft | A per-player `catch_in_progress` flag, raised at the bite (rule 6, Formula 3) | No grace: midnight cuts in at once |

**Downstream (depends on this system):**

| System | Hard / soft | Interface |
|---|---|---|
| Shade Sweet Spots | Hard | `time_of_day`, `phase`, `is_night`; no sweet spots at night |
| Deliveries & Drop Box | Hard | Rule 8 steps 2 and 3; `day_number`; the box as the one place fish are safe |
| Economy (Jimmy) | Hard | Rule 8 step 2: the payout runs inside the handover |
| Inventory & Storage | Hard | Rule 8 step 1: the spoiled flag on every fish outside the box |
| Interaction (E) | Hard | The bed as an `interact` object, and getting up |
| Save/Load (Repack) | Hard | `day_number` and `time_of_day` are saved (rule 10); the wake-up save runs inside the handover after step 4 (rule 8) |
| Main Menu & Intro | Hard | New Sesh starts day 1 at sunrise |
| Bite Timing | Soft | `is_night` (longer waits) |
| Retro Rendering | Soft | `time_of_day`, `phase` and the three phase-boundary hours, for light direction, tint and fog colour |
| Audio | Soft | `phase_changed`, the two warnings, sleep and wake cues |
| HUD & Catch Banner; Flip Phone & FishMail | Soft | The warnings; `seconds_to_midnight`; who is still up; the phone LCD shows time and day |
| Hunger, Munchies & Drunk; Chill Meter & Smoking | Soft | `day_started`; the wake-in-bed routine (blackout) |
| Player Controller | Soft | Wake placement in the bed |

**Not a dependency:** Fish Database & Spawn Tables. It states that time of day never changes which fish bites (its "What never changes which fish bites"), so this system never feeds a pool. Gear & Item Database: gear is never lost to a drift-off.

**Bidirectional check.** The systems index listed Day, Night & Sleep as a dependency of only Shade Sweet Spots (row 7), Deliveries & Drop Box (row 22) and Audio (row 29). Since this GDD was written the index also lists it on the rows for Interaction (E), Bite Timing, Hunger, Inventory & Storage, Economy, Save/Load and Main Menu & Intro, and row 3 now shows its soft upstream links. Retro Rendering's row (6) and GDD list it too (2026-11-17). Chill Meter & Smoking, HUD & Catch Banner, Flip Phone & FishMail and Player Controller (all soft dependents) are not on the index yet. Each dependent's GDD must list Day, Night & Sleep as a dependency when it is written.

## Visual/Audio Requirements

Optional for a Core system; kept short. `art-director` and `audio-director` were not consulted (Lean mode).

- **Light follows the phase** and only the light. Time of day changes light direction, tint and fog colour, **never fog density** (art bible). Dusk carries the Ember sun (`#E08A3C`), and Night is the art bible's cool indigo-slate with top-down moonlight and flat, low-contrast water. Dawn and Dusk blend smoothly across their two in-game hours, with no pop at a phase boundary. Retro Rendering owns the look.
- **The 3:1 shade gap is checked at every time of day** (art bible, Open risk), so the sweet spots stay readable through Dusk and are gone, not merely faint, at Night.
- **The two warnings** are a banner on a Plate backing (HUD & Catch Banner) with a flip-phone chime (Audio). "Last call" is a little more insistent than "Getting late" but never an alarm (Pillar 2). A banner always accompanies the chime, so the warning never depends on hearing it.
- **Ambience follows the phase** (Audio owns it): dawn birdsong, daytime pond, dusk loons and peepers (the brief's dusk-pond reference), night crickets and lapping water.
- **Sleep and wake:** a fade to black, a "Day N" card, a fade up on the bed. A drift-off at midnight uses the same fade, so it reads as nodding off, never as a game over. It never uses a flash.

> 📌 **Asset Spec** — Visual/Audio requirements are defined. After the art bible is approved, run `/asset-spec system:day-night-sleep` to produce per-asset visual descriptions, dimensions, and generation prompts from this section.

## Game Feel

Optional for a Core system. The day's pace and the overnight's brevity are what the player feels.

- **Pace:** one real minute is one in-game hour at the default, so the three real minutes of Night are felt as a short, quiet last stretch. The day length is judged in the first Godot playtest (Open Question 6).
- **Warnings never startle:** no sound above the ambience's own level, no screen shake, no input taken.
- **The overnight is short.** At the defaults the overnight takes at most 4.25 s from the start of the fade out to the end of the fade up: a 0.75 s fade out, a black hold of 1.5 s or less while steps 1 to 4 of rule 8 run plus up to 1.0 s for Save/Load's wake-up save (its write budget, Save/Load rule 10), and a 1.0 s fade up during which step 5 (the wake) places the player (AC-22). The three systems whose steps take time (Inventory & Storage, Economy, Deliveries & Drop Box) share a combined budget of 1.5 s for them, so waiting overnight never feels like a loading screen.
- **Waking gives control back at once:** the player can move as soon as the fade up ends.

## UI Requirements

- **Phone LCD:** shows the in-game time (12-hour, "6:00 AM") and "Day N" (provisional, Open Question 7).
- **HUD:** no permanent clock; the sky is the clock. It shows the two warning banners, and in co-op a small list of who is still up while this player lies in bed ("Waiting for Sam, Alex").
- **Bed prompt (Interaction):** "Sleep" in solo, "Go to bed" in co-op while others are up, "Get up" while waiting.
- **Overnight card:** "Day N" on black, for the length of the hold.

> **📌 UX Flag — Day, Night & Sleep**: This system has UI requirements. In Pre-Production, run `/ux-design` for the warning banners, the co-op waiting list and the overnight card **before** writing epics. Stories that touch these screens should cite `design/ux/` specs, not this GDD.

## Cross-References

| This document references | Where | What |
|---|---|---|
| Game brief (`design/game-brief.md`) | Timescale; Fail states; Features, Inside the shack (Bed, Drop Box); Jimmy | A day lasts about 15–20 minutes, sunrise to midnight; midnight drift-off; fish outside The Drop Box spoil to the Quick Sell price; Jimmy pays and deliveries arrive overnight; proposed: night has no shade and slower bites, bed at any hour |
| Game concept (`design/gdd/game-concept.md`) | Pillars 2 and 5; Risks (the midnight deadline) | A deadline in a "nowhere to be" game must rarely surprise a player and warn clearly; co-op never pauses |
| Settings & Input (`design/gdd/settings-input.md`) | Rule 17; rule 7; the context table | `game_time_paused`; held actions cancelled on a context change; the Phone and Gameplay contexts run game time |
| Fish Database & Spawn Tables (`design/gdd/fish-database-spawn-tables.md`) | "What never changes which fish bites" | Time of day never changes which fish bites, only how fast (Bite Timing), so this system feeds no pool |
| Gear & Item Database (`design/gdd/gear-item-database.md`) | Edge cases | Gear is never lost to a drift-off. Its "fish and Cooler contents only" is an upper bound covering the blackout too, and its edge case defers to this GDD for what a drift-off does (checked by /consistency-check 2026-11-17: not a conflict) |
| Art bible (`design/art/art-bible.md`) | Time of day; Night water; the 3:1 shade gap | Light direction, tint and fog colour change, never fog density; night water is flat; the shade check holds at every time of day |

## Acceptance Criteria

Test types: **Logic** = automated unit test in `tests/unit/day_night_sleep/`. **Integration** = automated test or documented playtest with the named system. **UI** = retained screenshot in `production/qa/evidence/`. **Check** = a scripted or profiler check. Criteria marked *waits on* cannot run until that system exists. Until then, Logic tests may stand in a fake consumer for it. Defaults below are `day_length_s` 1080, `warn1_lead_s` 180, `warn2_lead_s` 60, `dawn_end_hour` 8, `dusk_start_hour` 19, `midnight_grace_s` 20.

**The clock**

- **AC-1** (Logic, rule 1, Formula 1) — **GIVEN** a new game, **THEN** `day_number` is 1 and `time_of_day` is 6.0. **WHEN** 540 s of running time pass at 60 fps, **THEN** `time_of_day` is 15.0 (± 0.01). **WHEN** 1080 s have passed, **THEN** it is 24.0 and never exceeds 24.0 after that.
- **AC-2** (Logic, Formula 1 boundaries) — **GIVEN** `day_length_s` = 720, **WHEN** 360 s pass, **THEN** `time_of_day` is 15.0 (± 0.01). **GIVEN** `day_length_s` = 1440, **WHEN** 720 s pass, **THEN** it is 15.0 (± 0.01). **WHEN** a frame has `dt` = 0, **THEN** the clock does not move. **WHEN** a frame has `dt` = 0.5, **THEN** it advances as if `dt` were 0.1. **GIVEN** a config with `day_length_s` = 600, **WHEN** it loads, **THEN** the load is refused, naming `day_length_s`.
- **AC-3** (Logic, rule 2) — **GIVEN** solo with `game_time_paused` true, **WHEN** 10 s pass, **THEN** `time_of_day` is unchanged (± one frame). **GIVEN** the Phone context, **WHEN** 10 s pass, **THEN** it has advanced 0.1667 h (10 in-game minutes, ± 0.01). **GIVEN** the Cutscene / Loading context, **WHEN** 10 s pass, **THEN** it is unchanged. **GIVEN** co-op with Settings open for 10 s, **THEN** it has advanced 0.1667 h. *The co-op part waits on Multiplayer.*

**Phases and warnings**

- **AC-4** (Logic, rule 3, Formula 2) — **GIVEN** the defaults, **WHEN** `time_of_day` is 7.99, 8.0, 18.99, 19.0, 20.99 and 21.0, **THEN** `phase` is Dawn, Day, Day, Dusk, Dusk and Night, and `is_night` is true only at 21.0. **THEN** `phase_changed` is emitted exactly once at each of 8.0, 19.0 and 21.0. **GIVEN** `day_length_s` = 1440, **THEN** `night_start_hour` is 21.75 and `warn2_hour` is 23.25 (± 0.01).
- **AC-5** (Logic, Formula 2 load check) — **GIVEN** a config with `warn2_lead_s` = 200 and `warn1_lead_s` = 180, **WHEN** it loads, **THEN** the load is refused, naming `warn2_lead_s`. **GIVEN** `dusk_start_hour` = 22, **THEN** it is refused, naming `dusk_start_hour`. **GIVEN** `day_length_s` = 720 with the other defaults, **THEN** it loads, with `night_start_hour` 19.5. **GIVEN** `day_length_s` = 720 and `warn1_lead_s` = 300, **THEN** it is refused, naming `dusk_start_hour`.
- **AC-6** (Logic + UI, rule 4) — **GIVEN** a day running at the defaults, **WHEN** `time_of_day` reaches 21.0, **THEN** "Getting late" is shown once with its chime, and at 23.0 "Last call" once. Neither takes input or pauses the clock. **GIVEN** a player in bed at 21.0, **THEN** neither is shown. **GIVEN** a save loaded at 22.5, **THEN** "Getting late" is not shown, and "Last call" is shown at 23.0. Screenshots of both banners retained. *The banner part waits on HUD & Catch Banner.*
- **AC-7** (Integration, rule 3) — **GIVEN** `is_night` is true, **WHEN** Shade Sweet Spots is queried, **THEN** it reports no sweet spots, and Bite Timing's wait is longer than at `is_night` false. *Waits on Shade Sweet Spots and Bite Timing* (a fake consumer until then).

**Bed and midnight**

- **AC-8** (Logic, rule 5, Formula 4) — **GIVEN** solo at 07:00, **WHEN** the bed is used, **THEN** the overnight starts in the same frame. **GIVEN** the Cutscene / Loading context, **THEN** the bed cannot be used.
- **AC-9** (Logic, rule 6, Formula 3) — **GIVEN** no catch in progress, **WHEN** the clock reaches 24.0, **THEN** the overnight starts at once. **GIVEN** a fake `catch_in_progress` flag that clears 8 s after midnight, **THEN** it starts 8.0 s later, with the clock held at 24.0. **GIVEN** a flag that never clears, **THEN** it starts 20.0 s later and the catch is cancelled. **GIVEN** the flag raised 0.5 s before midnight (FISH ON shown, hook not yet set), **THEN** midnight waits for the catch like any other. **GIVEN** co-op where one player's flag clears at 8 s and another has none, **THEN** it starts 8.0 s later. **GIVEN** solo, a flag that never clears, and Settings opened 5 s into the grace for 10 s, **THEN** the overnight starts 20.0 s of game time after midnight (30 s of real time) and the catch is not cancelled earlier.
- **AC-10** (Integration, rule 6) — **GIVEN** a fish landed 5 s into the grace, **WHEN** the overnight runs, **THEN** the fish is kept and marked spoiled. *Waits on Casting & Tangle and Inventory & Storage* (fakes until then).
- **AC-11** (Logic, rule 7, Formula 4) — **GIVEN** four connected players, three in bed, **THEN** the overnight has not started. **WHEN** the fourth gets into bed, **THEN** it starts that frame. **GIVEN** three in bed and the fourth disconnects, **THEN** it starts that frame. **GIVEN** a waiting player presses `interact`, **THEN** `players_in_bed` drops by 1 and the player is up. **GIVEN** a player joins while the others are in bed, **THEN** it does not start until they get in bed or midnight. *Waits on Multiplayer* (a fake player count until then).

**The overnight**

- **AC-12** (Logic + Integration, rule 8) — **GIVEN** fakes for Inventory, Economy and Deliveries, each logging its call and taking 1 s, **WHEN** the overnight runs, **THEN** the log reads spoilage, payout, deliveries, new day, wake, each beginning only after the one before has finished.
- **AC-13** (Integration, rule 8 step 1) — **GIVEN** one fish in The Drop Box and one each carried, in the Cooler and on the stringer, **WHEN** the overnight runs, **THEN** the three outside the box are spoiled and the one in the box is not. **THEN** gear, weed, food and the Cooler's other contents are unchanged. **WHEN** a spoiled fish is later dropped in the box, **THEN** it is paid at the Quick Sell price. *Waits on Inventory & Storage and Economy.*
- **AC-14** (Logic, rule 8 step 4) — **GIVEN** day 1 at the overnight's end, **THEN** `day_number` is 2, `time_of_day` is 6.0, and `day_started` is emitted exactly once.
- **AC-15** (Integration, rule 9) — **GIVEN** the player on the kayak at midnight, **WHEN** the overnight ends, **THEN** the player is in the shack bed, the kayak is at its dock, and Gameplay input is live. **GIVEN** a blackout, **WHEN** the wake routine runs, **THEN** none of rule 8's steps run and `time_of_day` is unchanged. *Waits on Scene Flow & Loading and Hunger, Munchies & Drunk* (fakes until then).

**Saving and edge cases**

- **AC-16** (Logic, rule 10, edge cases) — **GIVEN** a save at day 3, 15.5, **WHEN** it loads, **THEN** `day_number` is 3 and `time_of_day` is 15.5. **GIVEN** a save with `time_of_day` 30.0, **THEN** it loads as 24.0 and the overnight starts. **GIVEN** 2.0, **THEN** it loads as 6.0. **GIVEN** `day_length_s` changed between save and load, **THEN** `time_of_day` is unchanged.
- **AC-17** (Integration, edge case) — **GIVEN** a quit request during the overnight, **WHEN** the game restarts and the last save is loaded, **THEN** it is the wake-up save of that overnight: `day_number` is one higher, `time_of_day` is `sunrise_hour`, and steps 1 to 4 are all applied (fish spoiled, payout in the box, orders arrived), with no step half-applied. **GIVEN** the request arrives before step 1 has started, **THEN** the same.
- **AC-18** (Logic, edge case) — **GIVEN** a co-op client whose clock is ahead of the host's by 0.5 s, **WHEN** it receives the host's time over 1000 frames of simulated jitter, **THEN** its `time_of_day` never decreases between frames. *Waits on Multiplayer.*
- **AC-19** (Integration, edge case) — **GIVEN** the phone open and `fish` held at midnight, **WHEN** the clock reaches 24.0, **THEN** the phone closes and `fish` sends *cancelled* (Settings & Input rule 7). **GIVEN** Settings open in co-op at midnight, **THEN** it closes and the settings file is written.

**Performance and look**

- **AC-20** (Check, performance) — **GIVEN** a day running at 60 fps on a Steam Deck, **WHEN** profiled for 60 s, **THEN** this system's own processing averages ≤ 0.05 ms per frame.
- **AC-21** (UI, rule 3) — **GIVEN** a day on the home pond, **WHEN** `time_of_day` is 6.0, 12.0, 19.5, 21.0 and 23.9, **THEN** the sky, light direction and tint differ at each, and fog density is identical at all five (screenshots retained). *Waits on Retro Rendering.*
- **AC-22** (Check, Game Feel) — **GIVEN** the defaults and fakes that each take 0.5 s, **WHEN** the overnight runs, **THEN** the time from the start of the fade out to the end of the fade up is no more than 4.25 s (0.75 + 1.5 + 1.0 for the save + 1.0), and the player can move on the frame the fade up ends. The fakes also include a wake-up save that takes 1.0 s. *The fakes stand in for Inventory & Storage, Economy and Deliveries & Drop Box until they exist.*

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **Beds in a shared shack.** The brief names one bed. With 2–4 players, where does each lie and wake? | Multiplayer with Scene Flow & Loading | When Multiplayer is designed |
| 2 | **The blackout's wake** (provisional here): it wakes the player in bed at the same time of day, runs none of the overnight steps, and loses carried fish and the Cooler's contents. Confirm, or make it end the day. | Hunger, Munchies & Drunk | When that GDD is written |
| 3 | **Sleep on demand.** Bed at any hour means any daily reset (Munchies, Chill) is available whenever the player likes. These systems must not make sleep a free refill. | Hunger, Munchies & Drunk; Chill Meter & Smoking | When those GDDs are written |
| 4 | **Does a better Cooler or stringer keep fish fresh?** The brief says only The Drop Box protects a fish, and this GDD follows it. | Owner, with Gear & Item Database and Inventory & Storage | When Inventory & Storage is designed |
| 5 | **The host leaves.** What happens to the clock and the overnight for the guests? | Multiplayer | When Multiplayer is designed |
| 6 | **Day length and "rarely a surprise".** 1080 s (18 min) is a starting value inside the brief's 15–20. Playtest question: how often does a day end by drift-off with fish still outside the box that the player did not choose to leave there? | Owner | After the first Godot playtest |
| 7 | **Where the time shows.** The phone LCD shows time and day, the HUD shows none. Confirm in the two GDDs. | Flip Phone & FishMail; HUD & Catch Banner | When those GDDs are written |
