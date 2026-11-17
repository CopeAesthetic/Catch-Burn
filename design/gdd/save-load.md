# Save/Load (Repack)

> **Status**: Approved 2026-11-17 (second `/design-review`, lean, 0 blockers; first review was NEEDS REVISION, 3 blockers, fixed the same day with the recommended items; the second review's 8 recommended items applied the same day, owner decisions included; third `/design-review` 2026-11-17, lean: APPROVED, 0 blockers, all 8 verified applied, 4 recommended items open)
> **Creative Director Review (CD-GDD-ALIGN)**: skipped — Lean mode
> **Author**: owner + Claude (design-system, lean review)
> **Last Updated**: 2026-11-17
> **Last Verified**: 2026-11-17
> **Implements Pillar**: Pillar 2 (Chill First, Never Punishing); Pillar 5 (Better With Friends, Whole Alone)

## Summary

Save/Load (Repack) keeps the game between sessions: three save slots, a save when each new day starts and on Turn & Burn (closing the window counts as Turn & Burn), and writes that can never leave a half-written save. It also holds the co-op state rules: everything made in a session goes into the host's save, each guest keeps their own player record there under their Steam ID, and a guest's own saves are never touched. Read it for anything about what a save holds, when it is written, New Sesh and Repack, or whose progress is whose in co-op.

> **Quick reference** — Layer: `Foundation` · Priority: `Vertical Slice` · Key deps: `Day, Night & Sleep` (soft: Gear & Item Database, Settings & Input)

## Overview

Save/Load (Repack) keeps a player's game between sessions. It owns three save slots, decides when a save is written (when a new day starts, on Turn & Burn, and when the window is closed), writes each save so that a crash or a full disk can never leave a half-written one, and loads a save back with Repack. It owns the save file's envelope (version, slot summary, backups) and its two kinds of content: world sections, one per save, and player records, one per player. Each stateful system decides what goes into its own section. It also owns the co-op state rule from the brief: everything made in a co-op session belongs to the host's save. Each guest gets their own player record inside that save, kept under their Steam ID, and the guest's own saves are never touched. Players meet it as New Sesh, Repack and Turn & Burn, and they notice it only if it fails. Without it, nothing in the game outlasts a session, and co-op would have no rule for whose progress is whose.

## Detailed Design

### Core Rules

*`systems-designer`, `gameplay-programmer` and `engine-programmer` not consulted for this section — Lean mode. Review manually before production.*

**Slots**

1. **Three slots** (owner decision 2026-11-17). Each slot is empty or holds one save. Slots live in the user's data folder, under the signed-in Steam user, so two Steam accounts on one machine never see each other's saves. Settings are never in a save (Settings & Input rule 15).
2. **New Sesh** asks for a slot. An empty slot starts at once. A used slot first asks "Replace Day N at [area]?", and the old save is replaced only when the new game's first save is written (rule 5). If the player backs out before then, the old save stays. When the first save is written, the old save **and its backup are deleted**, not kept as the new game's backup (owner decision 2026-11-17), so a damaged new save can never load another game.
3. **Repack** shows the used slots, each with its summary (rule 8), and loads the one picked behind a loading screen of its area (Scene Flow & Loading). It never shows the intro.
4. **Delete** is offered on a used slot from the slot list and asks for confirmation. It removes the save and its backup permanently.

**When a save is written** (owner decision 2026-11-17: wake-up and Turn & Burn)

5. A save is written at these moments and no others:
   - **Wake-up.** The **last act of the overnight handover** (Day, Night & Sleep rule 8): it runs after step 4 (new day) has finished, `day_started` handlers and every system's daily reset included, and before step 5 fades up into Gameplay. So it is always written before the player can act. Day 1 after the New Sesh intro is the new game's first save.
   - **Turn & Burn** (the Flip Phone's Save & Quit). The game saves, then goes to the main menu.
   - **A quit request** (window close, Steam's Exit Game). In a solo or host game it works exactly like Turn & Burn: Settings & Input rule 20's steps run first, then the save, then the game exits (owner decision 2026-11-17). One that arrives during the overnight or a scene load is queued (rule 6). With no save in memory (the main menu, a slot still Loading, the New Sesh intro before its first save) there is nothing to save and the game exits at once. A guest's quit request leaves the session (rule 17).
6. **No other save is written during the overnight or a scene load, and a quit request that arrives in either is queued, not lost** (owner decision 2026-11-17, second review). The wake-up save is part of the handover, so it is the one exception. **Overnight:** the handover finishes, the wake-up save is written, and then the game exits without fading up. That one save is the quit's save, and the next Repack loads the new morning. A quit never lands inside the handover, so it is never half-applied (Day, Night & Sleep edge case). **Scene load:** the load finishes, then the quit runs as in rule 5 (rule 20's steps, the save, the exit), saving the area and pond the player arrived in. **Not trapped:** a queued quit waits at most `quit_wait_cap_s`. Past it the game exits without saving, so a stuck load never makes the close button dead.
7. **What a mid-day save keeps and drops.** A Turn & Burn save keeps the exact `time_of_day` and everything each system puts in its section. It drops what cannot be resumed: a catch in progress (Day, Night & Sleep: a catch in progress is not saved), held actions, an open phone or menu, the player's position and the kayak's position. Loading it puts each player in **the shack of the saved area** at the saved time, with the kayak at the dock: the same place the wake-up uses (Day, Night & Sleep rule 9, owner decision 2026-11-17). The saved pond does not place the player, because only the area's home pond has a shack (brief: each pond is its own level, reached from the shack Map). It is kept for the slot summary and for Pond & Area Travel. A wake-up save starts there anyway. **Accepted on purpose** (owner decision 2026-11-17): Turn & Burn then Repack is a free trip home, so a player far out at 23:50 can reload and drop their fish in The Drop Box before midnight. It costs a trip through the menus and a loading screen, and midnight spoilage is a soft failure (Pillar 2).

**What a save holds**

8. **One envelope per slot:**
   - **Header:** the save format version, the game version that wrote it, and the slot summary shown by Repack (day number, current area and pond, play time from Formula 2, date and time last saved). It holds no host ID: the host is whoever loads the save, and the host's record is the one flagged as the host's, not matched by Steam ID.
   - **World sections**, one each per save: state shared by everyone on that save, such as the clock and the current pond.
   - **Player records:** the host's own record, and one guest record per Steam ID that has played on this save (rule 12). Each holds one player section per stateful system: that player's own state, such as their inventory and fishing log.
9. **Each stateful system owns its section's contents and whether it is world or player state.** This system owns the envelope, the slots, when to write, the format version and the co-op rule. A system adds a section by registering its name, whether it is world or player state, a version of its own, and an upgrade step from each older version (rule 11). It saves only stable ids and plain values, never references to scene objects (Gear & Item Database: stable ids only). The provisional section list is in Interactions below. Each owning GDD confirms its row.

**Writing and loading safely**

10. **A save is never half-written.** The game writes the new save beside the old one, reads it back to check it, and only then replaces the old one. The save it replaces is kept as the slot's one **backup** (except at New Sesh, rule 2). If any step fails (full disk, no permission), the old save is untouched and the player sees "Couldn't save". On Turn & Burn and on a quit request, the notice offers **Try again** and **Quit without saving**. A wake-up save that fails shows the notice and play continues, and the next save retries. **Budget:** a save at Formula 1's cap stays under 2 MB, finishes within 1 s, and never pushes a frame past 16.67 ms on the Steam Deck (project 60 fps target). How the write avoids a hitch, for example off the main thread, goes to an ADR.
11. **Loading checks before it trusts.** A save carries a checksum. A save that fails it, cannot be read, or passes it but cannot be loaded (a section that does not parse, or an upgrade step that errors) is replaced by its backup with the notice "Loaded the backup from Day N". The backup is **promoted at once**: after it loads, it is copied over the damaged save, so the slot holds a good save and the next write demotes a good file to the backup, never the damaged one. If both fail, the slot shows as **Damaged**: Repack cannot load it, and New Sesh or Delete can clear it. A save with an older format version is upgraded on load, and each section with an older version has its owner's upgrade steps run in order, oldest first. A save from a newer format version, or holding a section version the game does not know, is refused with "This save is from a newer version of the game". An item id marked retired loads as an inert item (Gear & Item Database), and any other unknown id in a section is ignored and kept as written. **A section the save does not have** (a system added by an update, or a section added to guest records) is created with that system's new-game values, as rule 13 does for a guest, and the next save writes it. **A section no system has registered** is ignored and kept as written. An upgrade runs in memory only: the file changes at the next save.

**Co-op state rules** (brief, Multiplayer; owner decision 2026-11-17: guest records in the host's save)

12. **The host's save holds the session.** In co-op only the host's game writes a save, to the host's loaded slot, at the moments in rule 5. World sections are the host's. Every player in the session has a player record in that save, and a guest's record is found by their Steam ID.
13. **A guest's first join** to a save creates their record with the starting kit (Gear & Item Database), an empty fishing log and the starting values each system sets for a new game, as New Sesh does without the intro (owner decision 2026-11-17). Nothing is read from the guest's own saves.
14. **A returning guest** gets their record back as the host's last save left it.
15. **A guest's own saves are never touched.** While in a session a guest's game writes no save and reads none of its own slots. **Joining a session is offered only from the main menu** (No Save Loaded, owner decision 2026-11-17), so a player never leaves unsaved solo progress behind: Turn & Burn comes first. Joining, fishing, leaving or the host ending the session changes nothing in the guest's three slots (brief: "A guest's own save is untouched").
16. **A guest who leaves mid-session.** Their record is copied as they leave, without a catch in progress or their position, and written at the host's next save. If the host's game ends without saving, that copy is lost with the rest of the host's unsaved day.
17. **Turn & Burn, a quit request or a lost connection by a guest** leaves the session (rule 16) and returns that guest to the main menu (or closes their game) without writing anything. **Turn & Burn by the host** saves every record, the guests' included, and ends the session for everyone (Multiplayer owns the session end).
18. **Guest records are capped** at `guest_record_cap` per save (Formula 1). When a new guest would exceed it, the guest records not in the current session that were seen least recently are removed, as many as it takes to fit the newcomer, so a lowered cap is enforced at the next first join. The host's own record is never removed.

### States and Transitions

| State | Meaning | → Next |
|---|---|---|
| **No Save Loaded** | Main menu; nothing in memory | → Loading on Repack (host or solo); → In Play on New Sesh after the intro has written the first save; → In Play (as guest) on joining a session (offered only from here, rule 15) |
| **Loading** | Reading, checking and upgrading a slot (rule 11) | → In Play on success; → No Save Loaded on a Damaged slot or a newer-version refusal, with the notice |
| **In Play** | A save is in memory and play runs. As a guest: the record lives in the host's memory, and nothing is written locally | → Saving at a rule 5 moment (host or solo only); → No Save Loaded when a guest leaves |
| **Saving** | Writing, checking and replacing (rule 10). Game time does not run during a Turn & Burn or quit save | → In Play after a wake-up save; → No Save Loaded after Turn & Burn; → exit after a quit request; → the failure notice on an error |

A save request while Saving is already running joins the running save. It never starts a second write. A scene load and the overnight are not states of this table: play time keeps counting through them (Formula 2), and the only save inside the overnight is the wake-up save (rules 5 and 6). A quit request during either waits for it to finish (rule 6).

### Interactions with Other Systems

| System | Flows in | Flows out | Owner of the interface |
|---|---|---|---|
| Day, Night & Sleep | `day_number`, `time_of_day` (world section); the overnight handover, whose last act (between steps 4 and 5) is the wake-up save; the overnight's start and end | On load: the saved `day_number` and `time_of_day` (it clamps a bad value itself) | Day, Night & Sleep owns its values; this system owns when they are written |
| Gear & Item Database | Stable item ids; the retired flag; the starting kit for a new record | — | Gear owns ids and retirement; this system stores ids only |
| Inventory & Storage (not designed) | Provisional: player sections for carried fish, Cooler, stash and loadout; a world section for The Drop Box | Restored contents on load | Inventory decides which are world and which are player state |
| Economy (not designed) | Provisional: each player's cash (player section) | — | Economy owns cash |
| Fishing Log & Unc; Strains & Unlock Chain; Chill Meter & Smoking; Hunger, Munchies & Drunk (not designed) | Provisional: per-player sections | — | Each owns its section. A daily reset happens at the new-day step, before the wake-up save |
| Deliveries & Drop Box (not designed) | Provisional: pending orders (world section) | — | Deliveries owns orders |
| Pond & Area Travel; Scene Flow & Loading (not designed) | The current area and pond (world section); when a load starts and ends (a queued quit waits for the end, rule 6) | On Repack: the saved area's home level and its shack, where players start (the saved pond does not place them, rule 7) | Scene Flow owns loading and the loading screen |
| Main Menu & Intro (not designed) | New Sesh, Repack and Delete requests | Slot list with summaries; Damaged and newer-version states | Main Menu owns the screens; this system owns what they show |
| Flip Phone & FishMail (not designed) | Turn & Burn | "Couldn't save" notice with Try again / Quit without saving | The phone owns the button |
| Settings & Input | A quit request (its rule 20 forced exit runs first) | — | Settings never enter a save (its rule 15) |
| Multiplayer (Alpha, not designed) | Joins (offered only from the main menu) and leaves with Steam IDs; the host's end of session | Guest records, sent to the host's game on join | Multiplayer owns the session and transport; this system owns where guest progress lives |

## Formulas

All `data file` values live in the save config resource, not in code.

### Formula 1: Guest record retention

The guest_record_evict formula is defined as:

`while guest_count + 1 > guest_record_cap: remove argmin(last_seen_s) over guests not in the current session, ties to the lower Steam ID`

It runs when a guest with no record joins, before their new record is created (rule 18). It removes as many records as it takes, which is one in normal play and several only after a data update lowers the cap, and it logs one warning naming how many.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| guest_count | int | 0+ (above `guest_record_cap` only right after the cap is lowered) | calculated | Guest records in this save now, saved and in memory. The host's own record is not counted and is never removed |
| guest_record_cap | int | 3–64 | data file, default 24 (owner decision 2026-11-17) | Most guest records one save keeps. A configured value outside 3–64 is refused and 24 is used, with one warning |
| last_seen_s | float | 0+ | calculated | The save's `play_time_s` (Formula 2) when that guest last left the session or was last saved while present. Measured in the save's own time, not the computer's clock, so a wrong system clock cannot decide who is removed |

**Output Range:** after a join the save holds the host's record plus 0 to `guest_record_cap` guest records. Enough guests are always removable, because a session holds at most 3 guests (2–4 players), so at most 2 are present when a third joins, and the lower bound of 3 leaves at least one that is not. Under the cap nothing is removed. A removed guest who returns starts over as a first join (rule 13).

**Example:** a save with 24 guest records and two guests on the pond. A third friend joins for the first time. Of the 22 guests not present, the one with the lowest `last_seen_s` (say 3,600 s, from the first evening) is removed, and the newcomer gets a fresh record. At about 20 KB per record (a 320-entry log plus inventory), 24 records add about 0.5 MB to the save. **After a lowered cap:** 20 records, cap 10, a newcomer joins: `guest_count + 1` is 21 > 10, so 11 records go (the 11 least recently seen, none of them present) and 9 + 1 = 10 remain.

### Formula 2: Play time

The play_time formula is defined as:

`play_time_s ← play_time_s + min(dt_real, play_dt_cap_s)`, each frame while In Play and `game_time_paused` is false. In Play includes the overnight, scene loads and cutscenes: it is running time

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| play_time_s | float | 0+ | calculated, saved in the header | Running time spent on this save. Repack shows it in hours and minutes |
| dt_real | float | 0+ s | calculated (engine frame time) | Real time since the last frame |
| play_dt_cap_s | float | 1.0 | constant | Most one frame can add, so a laptop sleep or a debugger stop never adds hours |
| game_time_paused | bool | — | Day, Night & Sleep rule 2 (the solo pause) | Paused time is not play time (owner decision 2026-11-17) |

**Output Range:** `play_time_s` only grows. At `dt_real` 0 it does not move, and above 1 s a frame adds 1 s. In co-op there is no pause, so it counts all session time. Only the host's save counts it, because a guest's game writes nothing (rule 15).

**Example:** a solo player fishes for 50 minutes, pauses for 10 minutes with Settings open, and fishes for 20 more: play time grows by 70 minutes. A laptop closed for an hour mid-day adds 1 s.

## Edge Cases

*`systems-designer` not consulted for this section — Lean mode. Review manually before production.*

**Files and slots**

- **If the save folder is missing or emptied**: all three slots show as empty, and only New Sesh is offered. Nothing is recreated until the first save.
- **If a write fails** (full disk, read-only folder, permission): the old save and backup are untouched, and rule 10's notice shows. A wake-up failure lets play continue and retries at the next save moment. It shows the notice once per failing moment, never every frame.
- **If the game crashes or loses power mid-write**: the half-written file is never the save, because the old one is replaced only after the new one checks out (rule 10). The next start deletes any leftover partial file without reading it.
- **If the save is damaged but the backup is fine**: the backup loads with "Loaded the backup from Day N". The player loses at most the progress between the two saves, usually one day. The backup is copied over the damaged save as soon as it loads (rule 11), so the next write demotes a good file to the backup.
- **If a save's current pond no longer exists** (removed in an update) but its area does: it loads in that area's shack as usual (rule 7) and the pond falls back to the area's home pond. **If its area no longer exists**: it loads in the North East shack at Lil' Puffin' Pond. Either logs one warning.
- **If a save folder is copied to another Steam account**: it loads like any save and the signed-in player is the host. The host's record is the one flagged as the host's, so no ID has to match.
- **If the signed-in host's Steam ID matches a guest record in the loaded save** (a copied save folder, for example): that guest record is dropped with one warning, so one ID never has two records. The host's own record is untouched.
- **If the guest record cap was lowered by an update**: the next first join removes the least recently seen records until the newcomer fits (Formula 1), with one warning logged.
- **If no Steam user is signed in**: slots live under a local "offline" profile folder, and co-op is unavailable. Steam's offline mode is Multiplayer's and release's call (Open Question 2).

**Timing**

- **If Turn & Burn or a quit request comes during Midnight Grace**: the catch in progress is dropped and `time_of_day` 24.0 is saved. Loading it starts the overnight at once (Day, Night & Sleep edge case).
- **If Turn & Burn comes mid-day during a catch** (from the bite to landed or lost): the catch is dropped as if the fish got away, and nothing from it is saved.
- **If a quit request comes during the overnight, before or after the wake-up save has started**: it is queued, the handover finishes with its wake-up save, and the game exits without fading up (rule 6). The next Repack loads the new morning. **If that wake-up save fails**: the "Couldn't save" notice offers Try again and Quit without saving, because a quit is waiting. **If it comes during a scene load**: the load finishes, then the quit saves and exits as in rule 5. **If the wait passes `quit_wait_cap_s`**: the game exits without saving, and the next Repack loads the last save.
- **If a quit request comes while a save is running**: the game finishes that save, then exits. **If it comes while a "Couldn't save" notice that offers Try again and Quit without saving is up**: it counts as Quit without saving. A failed wake-up save with no quit waiting shows a notice with no buttons and play continues, so a later quit request simply saves again (rule 5).
- **If the player backs out of New Sesh during the intro, or quits then**: no save was written, so the replaced slot still holds its old save (rule 2).
- **If Settings is open when the wake-up save runs**: the save runs as normal. Settings are written to their own file by Settings & Input, never to the save.
- **If the player force-kills the game to undo a bad day** (not a quit request, so nothing saves): the next Repack loads the last wake-up or Turn & Burn save, losing everything since. This cannot gain anything, because a lost fish costs seconds and the reload costs the whole day, so it is accepted.

**Co-op**

- **If the host's game crashes or the host loses connection**: the session ends for everyone (Multiplayer). Everything since the host's last save is lost for every player, guests included. No guest's own slots change.
- **If a guest leaves mid-day and the host then plays on**: the guest's record copy (rule 16) is written at the host's next save. If the guest rejoins first, they continue from that copy, not from the older saved record.
- **If a guest joins during the overnight**: they wait on the black screen (Day, Night & Sleep), and their record is created or restored at once, so it is in the wake-up save.
- **If a player in a solo game wants to join a friend**: joining is offered only from the main menu (rule 15), so they Turn & Burn first and the solo save is safe.
- **If a player tries to join with the host's own Steam ID**: the join is refused with "You're already in this game". One Steam ID never has two records in one save.
- **If a guest's game is a different version from the host's**: the join is refused by Multiplayer's version check, so no record is ever written by mismatched code.
- **If the host loads a save in which a returning guest's record was removed** (Formula 1): that guest starts over as a first join (rule 13). The cap and the least-recently-seen rule make this rare.
- **If a guest's record holds a retired item or an unknown id**: it loads as rule 11 says for any save, with an inert item or an ignored id.

## Dependencies

**Upstream (this system reads from them):**

| System | Hard / Soft | Interface | Without it |
|---|---|---|---|
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`, Approved) | Hard | `day_number`, `time_of_day` (its rule 10); the new-day step that triggers the wake-up save; the overnight's start and end (rule 6); `game_time_paused` (Formula 2) | No wake-up save and no clock to save |
| Gear & Item Database (`design/gdd/gear-item-database.md`, Approved) | Soft | Stable item ids, the retired flag, the starting kit (rule 13) | Item sections cannot be checked for retired ids |
| Settings & Input (`design/gdd/settings-input.md`) | Soft | Quit requests and its rule 20 forced exit, which runs first, then the save (rule 5) | Window close exits without the forced-exit steps |

**Downstream (other systems depend on this):**

| System | Hard / Soft | What it relies on |
|---|---|---|
| Scene Flow & Loading (not designed) | Hard | Which area Repack loads (rule 3); "no save during a load", and a queued quit that waits for the load to finish (rule 6) |
| Main Menu & Intro (not designed) | Hard | Slots, summaries, New Sesh / Repack / Delete (rules 1–4), Damaged and newer-version states |
| Multiplayer (Alpha, not designed) | Hard | The co-op state rules (rules 12–18): the host's save holds the session; guest records by Steam ID |
| Inventory & Storage; Economy; Fishing Log & Unc; Strains & Unlock Chain; Chill Meter & Smoking; Hunger, Munchies & Drunk; Deliveries & Drop Box; Pond & Area Travel (not designed) | Hard | Register a world or player section (rule 9); stable ids only |
| Flip Phone & FishMail (not designed) | Soft | Turn & Burn's save and its failure notice (rules 5, 10) |
| Player Controller (`design/gdd/player-controller.md`, Designed) | Soft | Rule 7: no position is saved, so every load places the player in the pond's shack with the kayak at its berth (its `place`, rule 17). Added 2026-11-17 with the owner's approval, from the Player Controller doc's bidirectional check |

**Bidirectional check** (2026-11-17):
- Day, Night & Sleep lists Save/Load as a hard dependent for `day_number` and `time_of_day` (its Dependencies and rule 10), and that matches. It names Save/Load as owning "when a save can be made", which rules 5–7 now define.
- Gear & Item Database lists Save/Load as a soft dependent for stable ids, and that matches.
- Settings & Input now lists Save/Load as a soft dependent: its rule 20 says a quit request runs the save after step 5, and its interactions table and Dependencies say so (edited 2026-11-17 after this GDD's first review, with the owner's approval). Settings never enter a save, so it does not depend on this system.
- **Day, Night & Sleep now names the wake-up save** (edited 2026-11-17 after this GDD's second review, with the owner's approval): a note after rule 8 step 4, the quit-during-overnight edge case, AC-17, the overnight's time budget and AC-22 (now 4.25 s, with the 1 s save), and its interactions and Dependencies rows.
- The systems index's row 24 lists Gear & Item Database (soft) and Day, Night & Sleep. Rows 5 (Scene Flow), 27 (Main Menu) and 30 (Multiplayer) list Save/Load. Every not-yet-designed system in the table above must list Save/Load when written.

## Visual/Audio Requirements

*`art-director` not consulted — Lean mode, and Visual/Audio is optional for a `Persistence` system. Review manually before production.*

- **Saving indicator:** a small spinning-reel icon in the UI layer's corner while a wake-up save runs (art bible UI palette, on a Plate). It never covers the HUD's meters and is gone within 1 s (rule 10 budget). Turn & Burn and quit saves show it on the fade to the main menu.
- **Notices** ("Couldn't save", "Loaded the backup from Day N", newer-version refusal) use the shared notice style from Settings & Input's UI Requirements.
- **Audio:** none of its own. The wake-up save is silent, because the wake-up already carries Day, Night & Sleep's morning cues.

## Game Feel

- **Saving never interrupts.** The wake-up save happens behind the wake-up and never freezes a frame (rule 10 budget). The player notices only the reel icon.
- **Quitting is safe by default.** Turn & Burn, the window's close button and Steam's Exit Game all keep the day (rule 5), even when the close lands mid-overnight or mid-load (rule 6), so a player who just closes the game loses nothing. Only a crash, a forced kill or a load stuck past `quit_wait_cap_s` costs progress, and then only back to the last save, usually that morning.

## Tuning Knobs

All live in the save config resource, never in code.

| Knob | Default | Safe range | What it affects |
|---|---|---|---|
| `guest_record_cap` | 24 | 3–64 (outside it the config is refused and the default is used with one warning) | How many friends' progress one save remembers before the least recently seen is removed. File size: about 20 KB a record, so 64 records are about 1.3 MB of the 2 MB budget; re-run AC-25 if the cap goes above 24 |
| `save_slot_count` | 3 | Fixed by the owner for 1.0 | How many saves a Steam user has. Changing it changes the Main Menu slot layout (registry `save_slot_count`) |
| `play_dt_cap_s` | 1.0 | Constant: 0.25–5.0 if ever tuned | How much one frame can add to play time (Formula 2); AC-24 uses 1.0 |
| `quit_wait_cap_s` | 10 | 5–30 | How long a quit request that lands in the overnight or a scene load waits before the game gives up and exits unsaved (rule 6). Below 5 a slow Steam Deck load could lose the day; above 30 a stuck load feels like a dead close button. See Open Question 5 |

The write budget (under 2 MB, within 1 s, no frame past 16.67 ms on the Steam Deck) is a project target, not a knob. A save that misses it is a bug. **Record budget:** each player record, the host's included, stays within 20 KB (a 320-entry log plus inventory). Each section owner fits its section inside what is left (Open Question 1), and AC-25 checks it.

## UI Requirements

This system has no screens of its own. It supplies content to screens other systems own:
- **Main Menu & Intro:** the slot list for New Sesh (empty slots first, used slots with a "Replace Day N at [area]?" confirmation) and Repack (used slots, each with its summary from rule 8; a Damaged slot is listed and marked Damaged but cannot be picked), Delete with confirmation, and the Damaged and "newer version" slot states. With no used slot, Repack is hidden (brief: first launch shows only New Sesh).
- **Flip Phone & FishMail:** Turn & Burn's "Couldn't save" notice with Try again / Quit without saving.
- **HUD layer:** the saving indicator.

> **📌 UX Flag — Save/Load (Repack)**: This system has UI requirements. In Phase 4 (Pre-Production), run `/ux-design` for the slot list (New Sesh / Repack / Delete) and the save notices **before** writing epics. Stories that reference this UI should cite `design/ux/[screen].md`, not the GDD directly.

## Cross-References

| Document | Section | What this GDD uses |
|---|---|---|
| Game brief (`design/game-brief.md`) | First minute; Menus (Turn & Burn); Fail states; Multiplayer | New Sesh / Repack, the intro never on Repack, the loading screen of the current area; Save & Quit; "nothing ends the save"; progress belongs to the host's save, a guest's own save untouched |
| Game concept (`design/gdd/game-concept.md`) | Pillars 2 and 5; Technical Considerations (Networking); Risks | Soft failure; co-op adds and never requires; host-authoritative; the co-op state rules are written here to stop single-player state being retrofitted |
| Systems index (`design/gdd/systems-index.md`) | Row 24; the design-order note on Save/Load; High-Risk Systems | Designed 6th for the co-op state rules; who owns a save |
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`) | Rule 2 (`game_time_paused`), rule 8 (the overnight and new-day step), rule 10 (saving); edge cases on Midnight Grace, closing during the overnight, clamping a loaded clock; AC-16, AC-17 | What it saves, when the wake-up save fires, what a mid-grace or mid-overnight quit does |
| Gear & Item Database (`design/gdd/gear-item-database.md`) | Stable ids; retired items (edge case, AC-32); starting kit (AC-16) | Ids only; inert retired items; a new guest's kit |
| Fish Database & Spawn Tables (`design/gdd/fish-database-spawn-tables.md`) | Co-op ("each player's log and strain stay their own"); AC-41 (unknown ids ignored) | Why guests need their own player records; unknown ids are harmless |
| Settings & Input (`design/gdd/settings-input.md`) | Rule 15 (settings never in a save); rule 20 (forced exits); its state table (Turn & Burn to the main menu) | Settings stay out; the quit request path |

## Acceptance Criteria

Test types: **Logic** needs an automated unit test in `tests/unit/save_load/`; **Integration** is an automated test or documented playtest with the named system; **UI** needs a retained screenshot in `production/qa/evidence/`; **Check** is an automated scan or a measured run whose output is retained. Systems that do not exist yet are stood in by fake sections: one world section and one player section holding a few ids and numbers. Criteria marked *waits on* need that system for their final run.

**Slots**

- **AC-1** (Logic, rule 1) — **GIVEN** two Steam users on one machine, **WHEN** user A saves to slot 1, **THEN** user B's slot list shows three empty slots, and no file under B's folder changed.
- **AC-2** (Logic, rule 2) — **GIVEN** slot 2 holding Day 5, **WHEN** New Sesh picks slot 2, confirms, and the game exits during the intro, **THEN** slot 2 still holds Day 5 byte for byte. **WHEN** New Sesh is run again and the intro finishes, **THEN** slot 2 holds Day 1 and has no backup file (rule 2), so damaging the Day 1 save makes the slot Damaged instead of loading Day 5.
- **AC-3** (UI, rules 3 and 8) — **GIVEN** three used slots, **WHEN** Repack opens, **THEN** each shows its day number, area and pond, play time in hours and minutes, and last-saved date, and picking one loads it with no intro. Screenshot retained. *Waits on Main Menu & Intro.*
- **AC-4** (Logic, rule 4) — **GIVEN** a used slot, **WHEN** Delete is confirmed, **THEN** the save and its backup no longer exist and the slot is empty. **WHEN** Delete is cancelled, **THEN** both files are unchanged.

**When a save is written**

- **AC-5** (Integration, rule 5; Day, Night & Sleep) — **GIVEN** a solo game at day 3, **WHEN** the overnight finishes, **THEN** exactly one save is written, holding `day_number` 4 and `time_of_day` equal to `sunrise_hour` (6.0), after `day_started` handlers have run and before the fade-up and the first frame that accepts input. **WHEN** an hour of in-game time then passes with no Turn & Burn, **THEN** no further save is written.
- **AC-6** (Logic, rules 5 and 7) — **GIVEN** a solo game at 14:30, **WHEN** Turn & Burn is used, **THEN** a save holding `time_of_day` 14.5 is written and the main menu shows. **WHEN** it is loaded, **THEN** the player stands in the saved area's shack at 14:30 with the kayak at the dock. **GIVEN** a save made on a non-home pond, **THEN** the same, and the slot summary names that pond. *The non-home case waits on Pond & Area Travel.*
- **AC-7** (Logic, rule 5) — **GIVEN** a solo game at 10:00, **WHEN** the window receives a close request, **THEN** a save holding 10.0 is written before the process exits.
- **AC-8** (Logic, rule 6) — **GIVEN** the overnight running before its wake-up save starts, **WHEN** a quit request arrives, **THEN** the handover finishes, exactly one save is written (the wake-up save), the game exits without fading up, and the next load gives the new morning (`day_number` + 1, `time_of_day` `sunrise_hour`; meets Day, Night & Sleep AC-17). **GIVEN** the same request after the wake-up save has started, **THEN** the same result. **GIVEN** a scene load running (a fake slow load), **WHEN** a quit request arrives, **THEN** the load finishes, then Settings & Input rule 20's steps, one save and the exit run in that order. **GIVEN** a fake load that never finishes, **WHEN** a quit request arrives, **THEN** the game exits at `quit_wait_cap_s` (10 s) with no file written. **GIVEN** the main menu, or a slot still Loading, **WHEN** a quit request arrives, **THEN** the game exits at once with no file written.
- **AC-9** (Logic, rule 7, edge cases) — **GIVEN** a fake catch in progress (raised flag), **WHEN** Turn & Burn is used, **THEN** the saved state holds no fish from that catch. **GIVEN** the clock held at 24.0 in Midnight Grace, **THEN** the save holds 24.0, and loading it starts the overnight at once.

**What a save holds**

- **AC-10** (Logic, rules 8 and 9) — **GIVEN** a fake world section and a fake player section, a host and two guests, **WHEN** the host saves and the save is loaded, **THEN** the header holds the format version, game version and slot summary (and no host ID); the world section appears once; the host's record is flagged as the host's; each of the three player records holds its own copy of the player section with its own values.
- **AC-11** (Check, rule 9) — **GIVEN** every registered section, **WHEN** a save is written, **THEN** it contains no engine object references or scene paths, only ids and plain values. The check lists each section and field it inspected.

**Writing and loading safely**

- **AC-12** (Logic, rule 10) — **GIVEN** a save folder made read-only, **WHEN** Turn & Burn is used, **THEN** the previous save and backup are unchanged, the "Couldn't save" notice offers Try again and Quit without saving, and Try again after the folder is made writable succeeds. **GIVEN** the same at a wake-up, **THEN** the notice shows once and play continues.
- **AC-13** (Logic, rule 10, edge case) — **GIVEN** a write interrupted after half the new file is written (test hook), **WHEN** the game restarts and the slot is loaded, **THEN** the old save loads intact and the partial file has been deleted.
- **AC-14** (Logic, rule 11) — **GIVEN** a save with one byte changed, **WHEN** it is loaded, **THEN** the backup loads with "Loaded the backup from Day N" naming the backup's day, and the backup has been copied over the damaged file, so both files then pass the checksum and the next write leaves a good file as the backup. **GIVEN** both files changed, **THEN** the slot shows Damaged, Repack cannot load it, and New Sesh can overwrite it.
- **AC-15** (Logic, rule 11) — **GIVEN** a save written at format version 1 and the game at version 2 with an upgrade step, **WHEN** it loads, **THEN** the upgrade runs and the next save is version 2. **GIVEN** a fake section saved at its version 1 and registered at version 2 with an upgrade step, **THEN** that step runs once and the next save holds version 2. **GIVEN** a save marked version 3, or holding a section version the game does not know, **THEN** it is refused with "This save is from a newer version of the game", and the file is unchanged. **GIVEN** a save with no section for a registered fake system, **THEN** that section loads with its new-game values and the next save holds it. **GIVEN** a section no system registers, **THEN** it is ignored and still in the file after the next save. **GIVEN** a fake upgrade step that throws, or a section that does not parse, in a save that passes its checksum, **THEN** it is handled as in AC-14: the backup loads and is promoted, or the slot shows Damaged if the backup fails too.
- **AC-16** (Integration, rule 11; Gear & Item Database AC-32) — **GIVEN** a save holding a retired item id and an unknown fish id, **WHEN** it loads, **THEN** the game starts, the item is held inert, the unknown id is ignored, and both ids are still in the file after the next save.

**Co-op state rules** *(waits on Multiplayer for the final run; until then a fake session supplies Steam IDs, joins and leaves)*

- **AC-17** (Integration, rules 12 and 15) — **GIVEN** a guest whose own three slots are hashed before joining, **WHEN** they join, fish, catch, earn and leave, **THEN** their slot hashes are unchanged and their game wrote no file. The host's save holds a record under the guest's Steam ID with the catch and the cash.
- **AC-18** (Logic, rule 13) — **GIVEN** a guest with no record, **WHEN** they join, **THEN** their record equals a New Sesh player state: the starting kit (Gear & Item Database AC-16), an empty log and each system's new-game values.
- **AC-19** (Logic, rule 14) — **GIVEN** a guest who left with 3 fish logged, and a host save written after, **WHEN** the guest rejoins after a reload, **THEN** their record shows those 3 entries and the same inventory.
- **AC-20** (Logic, rule 16, edge case) — **GIVEN** a guest who leaves at 12:00 with a catch in progress, **WHEN** the host plays on and Turn & Burns at 15:00, **THEN** the guest's saved record is their 12:00 state without that catch. **GIVEN** the host's game killed before saving, **THEN** the file on disk is byte for byte the last save written, with neither the guest's 12:00 copy nor the host's unsaved day. **GIVEN** the guest rejoins before the host's next save, **THEN** they continue from the 12:00 copy, not from the older saved record.
- **AC-21** (Logic, rule 17) — **GIVEN** a host and two guests, **WHEN** the host uses Turn & Burn, **THEN** one save is written holding all three records, and the session ends for all three. **WHEN** a guest uses Turn & Burn instead, **THEN** that guest returns to the main menu and no file changes on their machine. **WHEN** a guest's window gets a quit request, or their connection is lost, **THEN** the same: they leave (rule 16) and write no file.
- **AC-22** (Logic, edge case) — **GIVEN** a join attempt with the host's own Steam ID, **THEN** it is refused with "You're already in this game", and the save never holds two records for one ID.

**Formulas**

- **AC-23** (Logic, Formula 1) — **GIVEN** `guest_record_cap` 24 and 24 guest records with distinct `last_seen_s`, two of them in the session, **WHEN** a new guest joins, **THEN** the not-present guest with the lowest `last_seen_s` is removed and the count stays 24. **GIVEN** two not-present guests tied on lowest `last_seen_s`, **THEN** the lower Steam ID is removed. **GIVEN** 23 records, **THEN** nothing is removed. **GIVEN** 20 records and a cap lowered to 10, **WHEN** a new guest joins, **THEN** the 11 least recently seen not-present records are removed, 10 remain with the newcomer, and one warning is logged. **GIVEN** a save config with `guest_record_cap` 2, and separately 65, **THEN** each config is refused with a message naming the key, and the default 24 is used. The host's record is never removed in any case.
- **AC-24** (Logic, Formula 2) — **GIVEN** frames of 0.016 s for 60 s, **THEN** `play_time_s` grows by 60 (± 0.05). **GIVEN** one frame of 3,600 s, **THEN** it grows by 1.0. **GIVEN** `game_time_paused` true for 600 s, **THEN** it does not grow. **GIVEN** a frame of 0 s, **THEN** it does not change.

**Performance**

- **AC-25** (Check, performance) — **GIVEN** a save with the host's record and 24 guest records, each filled to the 20 KB record budget, plus 100 KB of world sections (a stand-in until their owners state a size), **WHEN** a wake-up save is written on a Steam Deck, **THEN** no frame during it exceeds 16.67 ms, the write finishes within 1 s, and the file is under 2 MB. The check also fails if any registered player section set exceeds the record budget.

**States and edge cases**

- **AC-26** (Logic, States table, edge case) — **GIVEN** a wake-up save running, **WHEN** a Turn & Burn request arrives, **THEN** one file write happens in total (the request joins the running save). **GIVEN** a quit request while a save runs, **THEN** the save finishes, then the game exits. **GIVEN** the "Couldn't save" notice up, **WHEN** a quit request arrives, **THEN** it counts as Quit without saving and nothing is written.
- **AC-27** (Logic, edge case) — **GIVEN** the save folder deleted, **WHEN** the game starts, **THEN** all three slots show empty, only New Sesh is offered, and no file or folder is created until the first save.
- **AC-28** (Integration, rule 7, edge case) — **GIVEN** a save whose pond was removed from the data but whose area remains, **WHEN** it loads, **THEN** the player is in that area's shack and one warning is logged. **GIVEN** a save whose area was removed, **THEN** it loads in the North East shack at Lil' Puffin' Pond with one warning. *Waits on Pond & Area Travel; a fake pond list until then.*
- **AC-29** (Logic, edge case) — **GIVEN** no signed-in Steam user, **WHEN** the game starts, **THEN** slots are read from and written to the local "offline" profile folder, and joining a session is unavailable.
- **AC-30** (Logic, rule 15) — **GIVEN** a solo game In Play, **THEN** the join action is not offered. **GIVEN** the main menu (No Save Loaded), **THEN** it is.
- **AC-31** (Logic, rule 2) — **GIVEN** a used slot with a backup, **WHEN** New Sesh replaces it and the first save is written, **THEN** the old save and its backup are both gone, and a new game's save and backup (after its second save) hold only the new game.
- **AC-32** (Logic, edge case) — **GIVEN** a save holding a guest record under Steam ID X, **WHEN** it is loaded by a host signed in as X, **THEN** that guest record is dropped with one warning, the host's record is unchanged, and the next save no longer holds it.

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **Which sections are world and which are player state?** The Interactions table is provisional. The big ones are cash (one wallet per player or shared), The Drop Box and pending deliveries (shared or per player), and unlocked areas and ponds (host's or per player). | Inventory & Storage, Economy, Deliveries & Drop Box, Pond & Area Travel GDDs | When each is written (Inventory is 12th, Economy 18th) |
| 2 | **Steam Cloud and offline play.** Should slots sync through Steam Cloud, and what happens with no Steam user (the edge case uses a local "offline" folder)? | Owner with Multiplayer / release | Before the Vertical Slice build |
| 3 | **Can a guest ever take progress home?** The brief lists "cross-save of guest progress" as a 1.0 proposal. If it ships, it needs a rule for copying a guest record into one of the guest's own slots without breaking rule 15. | Owner | 1.0 planning |
| 4 | **Save format and write method** (text or binary, the checksum, writing off the main thread for rule 10's budget). | lead-programmer / engine-programmer: an ADR | Before the first Save/Load story |
| 5 | **Does Steam's Exit Game or the Steam Deck's overlay kill the process before `quit_wait_cap_s` (10 s)?** If so the cap must sit below that limit, or a queued quit loses the day anyway. | lead-programmer: test on the Deck | Before the first Save/Load story |
