# Interaction (E)

> **Status**: Designed 2026-11-17 (`/design-system`, guided, lean); not yet reviewed
> **Creative Director Review (CD-GDD-ALIGN)**: skipped — Lean mode
> **Author**: owner + Claude (design-system, lean review)
> **Last Updated**: 2026-11-17
> **Last Verified**: 2026-11-17
> **Implements Pillar**: Pillar 2 (Chill First, Never Punishing); Pillar 4 (Budget Charm); Pillar 5 (Better With Friends, Whole Alone)

## Summary

Interaction (E) is how the player uses the shack and the dock: the game finds the one object the player is looking at within arm's reach, shows what E will do with a glyph, a verb and a name, tints the object, and sends the use to whichever system owns it. It exists so every bed, fridge, Tackle Box, Cooler and kayak behaves the same way and so no object can punish the player for pressing it.

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `Player Controller (hard); Settings & Input (hard); Day, Night & Sleep, Retro Rendering (soft)`

## Overview

Interaction (E) is the one way the player uses the world. While the player is in the Gameplay context, on foot or in the kayak, it reads Player Controller's `aim_ray`, finds the interactable the player is facing within reach, shows that object's prompt with the glyph of the device in use, and, when `interact` is pressed, asks the object's owner to carry out the use. It owns finding and choosing the target, the prompt and the use request. It does not own what any object does: the bed's sleep belongs to Day, Night & Sleep, the Tackle Box, Cooler, fridge, dresser and Map menus to Home & Dock Menus and Inventory & Storage, the Drop Box to Deliveries & Drop Box, and boarding and getting out of the kayak to Player Controller. It is the one system that makes the shack and the dock feel like places you can use, and its job is to be calm and obvious: you look at a thing, you see what E does, you press E. Nothing here can fail the player; an object that cannot be used right now says so plainly and costs nothing (Pillar 2). Every player in co-op has their own target and prompt (Pillar 5).

## Detailed Design

*Specialist lens: `game-designer`'s supporting roles for a Core controls system (`ux-designer`, `gameplay-programmer`) were not consulted. Lean mode. Review manually before production.*

Every number below is a **starting value, untuned**, defined with its range in Formulas. Four design decisions were made by the owner on 2026-11-17 and are marked in the rules: the target is found with a thin sphere along the view, the reach is 2.0 m, the prompt is a glyph, a verb and a name plus a tint on the object, and the owner of each object decides whether it is usable.

### Core Rules

**Finding the target**

1. **One target per player, at most.** Each player's Interaction runs on their own machine. At any moment a player has either no target or exactly one, and the prompt shows only that one. There is no list, no cycling and no second prompt.

2. **Interaction is live in the Gameplay context only, and only while the player's Player Controller state is On foot or Kayak.** In the Phone, Settings, Cutscene / Loading and every other context, and while the state is Boarding, Disembarking or Capsized, the target is cleared and the prompt hidden. Nothing is queued: a press that arrives when Interaction is not live is dropped, as Settings & Input rule 6 says. A binding held when Gameplay begins does not count as pressed (Settings & Input Edge Cases), so closing a menu with `interact` held never uses the object behind it.

3. **On foot, the target is found with a sphere cast along `aim_ray`** (owner decision 2026-11-17). Once per physics step, a sphere of radius `target_radius_m` is swept from the origin of `aim_ray` along its direction for `reach_m` (2.0 m, owner decision 2026-11-17). The cast hits the **first** of two things: an interactable, or anything solid (walls, furniture, the dock edge). A wall in front of an object hides it; an object behind a wall is never targeted. If the first hit is an interactable, it is the target; otherwise there is none. `aim_ray` carries no sway, bob or roll (Player Controller rule 6), so the kayak's rocking and the walk can never make the prompt flicker.

4. **A held target gets a little extra reach.** While an object is the target, it stays the target out to `reach_m × reach_exit_factor`, so standing right at the edge of reach does not blink the prompt. A different object must be inside `reach_m` to take over. The object nearest along the ray always wins; there is no priority list.

5. **In the kayak there is no aiming.** The cast is not made on the water. The one thing the kayak can use is the dock: while Player Controller reports `at_berth`, the prompt "Get out" is the target, whatever the player is looking at, because the player may have the view turned away (free look, Player Controller rule 11) and the berth is 3 m or more from the dock's objects. When `at_berth` is false there is no target in the kayak. "Get up" works the same way: in co-op, while Day, Night & Sleep reports this player In Bed (waiting), the prompt "Get up" is the target with no aiming, because the lying player's view is not the player's to aim. Player Controller has no In Bed state, so who holds the body and the camera there is open (Open Questions).

**The interactable**

6. **Every interactable is a scene object that carries a fixed set of facts and two answers.** Facts: a stable `id`, a `verb`, a `name`, and its owner system. The two answers come from the owner, never from Interaction: `query(player)` returns `usable` (true or false) and optional `text`; `use(player)` carries out the use. The verb and the name are data (a content file, one row per object), not code, so the writer can change them without touching a script. Interaction knows nothing about what a bed or a Tackle Box does.

7. **The MVP interactables** (verb and name text are provisional until the writer and the UX spec; the owner of each is the system that carries out the use):

| Object | Where | Verb (starting text) | Owner of `query` and `use` |
|---|---|---|---|
| Bed | Shack | "Sleep" (solo), "Go to bed" (co-op, others still up), "Get up" (waiting) | Day, Night & Sleep (its rules 5 and 7; the prompt text is from its Visual/Audio) |
| Fridge | Shack | "Open" | Inventory & Storage and Hunger, Munchies & Drunk, through Home & Dock Menus |
| Dresser | Shack | "Open" | Inventory & Storage, through Home & Dock Menus |
| Computer | Shack | "Check FishMail" | Flip Phone & FishMail |
| The Drop Box | Shack | "Open" | Deliveries & Drop Box |
| Map | Shack | "Open" | Pond & Area Travel |
| Tackle Box | Dock | "Smoke & Tackle" (the brief's menu name) | Home & Dock Menus, with Inventory & Storage |
| Cooler | Dock | "Stash" (the brief's menu name) | Home & Dock Menus, with Inventory & Storage |
| Kayak (at its berth) | Dock | "Get in" | Player Controller (rule 15: starts Boarding) |
| "Get out" (not an object: rule 5) | On the water at the berth | "Get out" | Player Controller (rule 16: starts Disembarking) |

   The list is the set the systems index names. A system added later adds a row, not a rule.

**The prompt**

8. **When there is a target, the player sees a prompt and the object takes a tint** (owner decision 2026-11-17). The prompt is drawn on the UI layer at native resolution (Retro Rendering rule 1, step 4), so it receives no fog, dither or tint. It shows three things: the glyph of the active device (Settings & Input rule 5: a keycap for keyboard and mouse, a face button for gamepad), the verb, and the name. It sits at a fixed point just below the view centre, not on the object, because a prompt fixed to the world would swim with the view and shimmer with vertex wobble. The object takes a flat tint of `highlight_strength` toward the highlight colour, so in a cluttered shack the player can tell which object the prompt means. The tint is on the object, so it is fogged and shaded like the object. The art for the glyph plate, the verb and the tint colour belong to the UX spec and the art bible (Visual/Audio Requirements).

9. **The owner decides whether an object is usable** (owner decision 2026-11-17). When an object becomes the target, and again whenever its owner signals that its answer changed, Interaction asks the owner `query(player)` and keeps the answer until then (so a shared object's answer is not fetched every step). If `usable` is true the prompt is shown normally with the tint. If it is false the prompt is shown **dimmed**, with no tint, and with the owner's `text` in place of the verb if the owner gave one (the bed in a cutscene, or "Waiting for [names]" in co-op). Nothing is locked: Interaction never stops a second player from using an object the owner says is usable, so one friend standing in a menu can never block another (Pillar 5).

**Using**

10. **A use is one press.** When `interact` is pressed (Settings & Input, a press edge: never held, never released) and the target is usable, Interaction sends `use(player)` to the owner once and does nothing more. There is no hold-to-confirm, no charge and no second step: nothing an interactable does can lose the player anything on its own (Pillar 2); an owner that needs a confirmation, such as the Cooler's "Stash", asks inside its own menu. The press is spent: no other system sees it.

11. **A press on a dimmed prompt does nothing** except raise a `use_refused` event for Audio. It never shakes the view, shows a message or counts as a failure.

12. **A short lockout stops double uses.** After Interaction sends a `use` for an object, it ignores `interact` for that object and that player for `use_lockout_s`. A quick double press therefore uses the bed once, not "Sleep" then "Get up", and does not re-open a menu that has just closed. The lockout is per player and per object.

13. **Interaction never moves the player or the camera.** The player walks and looks freely while a prompt is up; the prompt follows the target, which follows the view.

**Co-op**

14. **Each player's target, prompt and tint are local to that player.** They are decided on that player's machine the same frame, so the prompt never waits on the network (Player Controller rule 21 says the same for the camera). A friend facing the same object has their own prompt and tint; one player's tint is not shown to others.

15. **`query` and `use` go to wherever the object's state lives.** Shared objects (the bed, The Drop Box, the Map) are answered by the host. Personal ones (the Tackle Box and Cooler loadouts) are answered locally. The prompt's `usable` and `text` can therefore be one round trip old; if the answer has changed when the press arrives, the owner refuses it and the player sees the dimmed prompt (Edge Cases). How the answer is sent belongs to Multiplayer and its ADR.

### States and Transitions

Each player has one Interaction state, local to their machine.

| State | Entered by | Prompt | Tint |
|---|---|---|---|
| **Suspended** | the context is not Gameplay, or Player Controller's state is Boarding, Disembarking or Capsized | none | none |
| **Idle** | Gameplay is live and the state is On foot or Kayak, and there is no target | none | none |
| **Ready** | there is a target and `query` says usable | glyph, verb, name | on (the target object) |
| **Refused** | there is a target and `query` says not usable | dimmed glyph, name and the owner's text (or the verb) | off |

| From | To | Trigger |
|---|---|---|
| Idle | Ready | the cast hits a usable interactable within `reach_m`, or (in the kayak) `at_berth` becomes true, or (in co-op) Day, Night & Sleep reports the player In Bed (waiting) |
| Idle | Refused | as above, and `query` says not usable |
| Ready, Refused | Idle | the cast no longer hits the target within `reach_m × reach_exit_factor`, or `at_berth` becomes false |
| Ready | Refused | `query` for the target changes to not usable |
| Refused | Ready | `query` for the target changes to usable |
| Ready, Refused | Ready, Refused (other object) | a different interactable is the nearest hit within `reach_m` |
| Any | Suspended | the context leaves Gameplay, or Player Controller enters Boarding, Disembarking or Capsized |
| Suspended | Idle | Gameplay is live again and the state is On foot or Kayak |

A press moves no state: Interaction sends `use` and the owner decides what changes. A `place` (Player Controller rule 17) lands the player On foot and the state follows from the rows above.

### Interactions with Other Systems

| System | Flows in | Flows out | Owner of the interface |
|---|---|---|---|
| Player Controller (`design/gdd/player-controller.md`) | `aim_ray`; the current state; `at_berth` | `use` for the kayak (start Boarding) and for "Get out" (start Disembarking) | Player Controller owns the ray, the state, `at_berth` and what boarding does; this system owns the prompt and the request |
| Settings & Input (`design/gdd/settings-input.md`) | `interact` presses; the active device (for the glyph); the active context | — | Settings & Input owns the action and the glyph set; this system owns what the press does |
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`) | The bed's `usable` and `text` ("Waiting for [names]") | `use` for the bed | Day, Night & Sleep owns whether the bed can be used and its words |
| Deliveries & Drop Box *(not designed)* | `usable`, `text` for the Drop Box | `use` | Deliveries & Drop Box |
| Home & Dock Menus *(not designed)*; Inventory & Storage *(not designed)* | `usable`, `text` for the fridge, dresser, Tackle Box and Cooler | `use` | Those systems own the menus and their contents |
| Flip Phone & FishMail *(not designed)* | `usable`, `text` for the Computer | `use` | Flip Phone & FishMail |
| Pond & Area Travel *(not designed)* | `usable`, `text` for the Map | `use` | Pond & Area Travel |
| Retro Rendering (`design/gdd/retro-rendering.md`) | — | The prompt on the UI layer; the object tint (a per-object parameter) | Retro Rendering owns how the frame is drawn; **it defines no per-object tint yet** (Open Questions) |
| Audio *(not designed)* | — | `target_gained`, `use_sent`, `use_refused` events | Audio owns the sounds |
| Multiplayer *(not designed)* | Whose machine answers `query` and `use` for each shared object | Each player's `use` request | Multiplayer owns the netcode; this system defines the request |

## Formulas

All `data file` values live in the interaction config resource, not in code. Δt is the physics step (1/60 s at the project default) unless a formula says otherwise.

**Specialist lens:** the `systems-designer` lens was applied (every variable worked at its minimum, maximum and zero). Findings that shaped the formulas: a sphere as thick as the reach gives a zero-length cast, so `target_radius_m` is tied to `reach_m` (Formula 1); with no extra held reach the prompt blinks at the edge of range (Formula 1, `reach_exit_factor` 1.0); with no lockout a double press toggles the bed twice (Formula 2); a tint of 0 is invisible and a tint of 1 erases the object's own colour (Formula 3). There is no feedback loop anywhere in this system, because no output feeds back into a gain.

### Formula 1: Target cast

The target_cast formula is defined as:

`reach_eff = reach_m × reach_exit_factor` if an object is the held target, else `reach_m`
`L = reach_eff − target_radius_m`
`hit = first contact of a sphere of radius target_radius_m swept from aim_ray.origin along aim_ray.direction for L, against the solid layer and the interactable layer`
`target = hit.object` if `hit` is an interactable, else none

(`t_hit` is the distance the sphere's centre has travelled at first contact; the sphere's leading edge has then travelled `t_hit + target_radius_m`, so no surface is farther than `reach_eff` along the view.)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| reach_m | float | 1.0–3.0 m, default 2.0 | data file (owner decision 2026-11-17) | How far a fresh target can be along the view |
| target_radius_m | float | 0–0.25 m, default 0.12 | data file (owner decision 2026-11-17); constraint `target_radius_m ≤ reach_m / 4` | Thickness of the cast; 0 is a strict thin ray |
| reach_exit_factor | float | 1.0–1.5, default 1.1 | data file | A held target is kept out to this multiple of `reach_m` |
| aim_ray | origin and direction | origin at the camera, no sway | calculated (Player Controller rule 6) | Where the player is looking |
| held | object or none | — | calculated | The target of the previous step |
| L | float | 0.75–4.5 m | calculated | Length the sphere's centre is swept |

**Output Range:** the target is none or one interactable. The farthest surface that can be targeted is 2.0 m from the eye along the view (2.2 m for a held target) with the defaults. An object off the view centre line counts if it is within `target_radius_m` of the line, about 3.4° either way at 2.0 m.
**Example:** the Tackle Box's front face is 1.9 m ahead, head-on. Fresh: `L` = 2.0 − 0.12 = 1.88, `t_hit` = 1.78, so it is the target. The player backs away to 2.1 m: it is held, `L` = 2.2 − 0.12 = 2.08, `t_hit` = 1.98, so it stays the target; at 2.3 m, `t_hit` = 2.18 > 2.08, so it is dropped. After looking away and back at 2.1 m it is not held: `L` = 1.88 < 1.98, so there is no target until the player steps 0.1 m closer. The lunchbox's edge 0.10 m off the centre line at 1.5 m is hit; at 0.15 m it is missed. A wall 1.0 m ahead with the Map 1.5 m behind it: the first contact is the wall, so there is no target.
**Boundaries:** `reach_m` 1.0 asks the player to stand at the object (the camera is already 0.3 m from any wall, Player Controller rule 3); 3.0 puts several objects in range of the small shack and the prompt jumps between them. `target_radius_m` 0 needs a steady hand on small objects; at the 0.25 limit the cast picks an object about 7° off the view, which in the shack can take the fridge when the player means the Drop Box. `reach_exit_factor` 1.0 gives no held reach and the prompt blinks at the edge; 1.5 keeps a target 3 m away. `L` never reaches 0 because `target_radius_m ≤ reach_m / 4`. A load check refuses a config that breaks the constraint.

### Formula 2: Use lockout

The use_lockout formula is defined as:

`use_allowed = (t_now − t_last_use[player, object]) ≥ use_lockout_s`

`t_last_use` is set when Interaction sends `use` for that player and object. A press while `use_allowed` is false is dropped without a `use_refused` event.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| t_now | float | 0+ s | calculated | Real time in seconds; it does not stop with `game_time_paused`, because the lockout only matters while Gameplay is live |
| t_last_use | float | 0+ s, or never | calculated | When this player last used this object; never means the first use is always allowed |
| use_lockout_s | float | 0–1.0 s, default 0.25 | data file | How long the same object ignores the same player after a use |

**Output Range:** a boolean. The lockout is per player and per object, so using one object never delays the next.
**Example:** the bed is used at t = 10.00 s. A second press at 10.10 s is dropped; one at 10.30 s is sent. In co-op that is the difference between "Go to bed" followed by "Get up" from one double press, and one use.
**Boundaries:** 0 allows a double press to toggle twice; 1.0 makes a deliberate second use feel ignored. 0.25 s is longer than a quick double tap (the gap between two presses is usually 0.1 to 0.2 s) and shorter than a deliberate second press.

### Formula 3: Object tint

The object_tint formula is defined as:

`a ← clamp(a + (±1) × Δt_frame / highlight_fade_s, 0, 1)` with `+1` while the object is the target and usable, `−1` otherwise
`shown = base + (highlight_colour − base) × highlight_strength × a`

Applied per rendered frame (`Δt_frame` is the frame's time), per channel, to the object's lit colour.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| a | float | 0–1 | calculated | How far the tint has faded in |
| highlight_fade_s | float | 0–0.5 s, default 0.1 | data file | Time to fade the tint in or out; 0 is a pop |
| highlight_strength | float | 0.1–0.5, default 0.25 | data file | Share of the way from the object's own colour to the highlight colour at full tint |
| base | float per channel | 0–1 | calculated (Retro Rendering's lit object colour) | The object's colour before the tint |
| highlight_colour | colour | — | data file (art bible's UI palette to choose) | The tint's colour |

**Output Range:** `shown` is between `base` and `base + (highlight_colour − base) × highlight_strength`; it is never beyond `highlight_colour`.
**Example:** a channel at 0.40 with a highlight of 1.0 at strength 0.25: 0.40 at `a` 0, 0.475 at `a` 0.5 (0.05 s in) and **0.55** at `a` 1, a rise of 0.15, about 4.8 of the 32 levels a 5-bit channel has (Retro Rendering Formula 8's dither moves a pixel by under half a level).
**Boundaries:** at strength 0.1 the full tint rises about 1.9 levels, near the dither's noise, so it is the lower limit; at 0.5 the object is half its own colour and half the highlight, which hides its texture, so that is the upper limit. `highlight_fade_s` 0 pops on and off as the view crosses a shelf; above 0.5 s the tint lags a moving view. A dimmed (unusable) target gets no tint (rule 9), so `a` fades to 0.

### Reference values

Not formulas, but quantities Core Rules state. They live in the same config resource.

| Value | Default | Range | Used by |
|---|---|---|---|
| `prompt_dim_alpha` | 0.5 | 0.3–0.7 | Rule 9 (the dimmed prompt's opacity) |
| `prompt_y_frac` | 0.62 (of the window height from the top) | 0.55–0.75 | Rule 8 (the prompt sits just below the view centre) |

## Edge Cases

*Specialist lens: the `systems-designer` edge-case pass was not run. Lean mode. Review manually before production.*

**Input and contexts**

- **If the phone, Settings or a cutscene opens while a prompt is showing**: Interaction goes to Suspended the same step and the prompt and tint fade out (the tint over `highlight_fade_s`). Nothing is queued. When Gameplay returns it is Idle, and the next step finds the target again.
- **If `interact` is still held when Gameplay returns** (closing a menu with E): it does not count as pressed until it is released and pressed again (Settings & Input Edge Cases), so the object behind the menu is not used.
- **If `interact` is pressed in the same frame as the context leaves Gameplay**: it is dropped (Settings & Input rule 6).
- **If `interact` and a `place` arrive in the same frame** (a midnight drift-off, a blackout, a load): the `place` wins and the press is dropped, as Player Controller's Edge Cases say.
- **If the active device changes while a prompt is showing**: the glyph changes on the next frame and nothing else does (Settings & Input rule 5).
- **If `interact` is rebound**: the glyph follows the new binding. Settings & Input does not let the player leave the rebinding list with `interact` unbound, so a prompt never shows a glyph for nothing.

**Choosing the target**

- **If two interactables touch the sphere's path at the same distance**: the one with the lower `id` (plain string order) is first, so the choice never varies between runs.
- **If an interactable already overlaps the sphere at the start**: it is the first contact at distance 0 (the player is pressed against it). The camera's capsule keeps the eye 0.3 m from walls, so the sphere never starts inside a wall.
- **If the player looks straight up or down** (the pitch limit is ±80° on foot): the cast is made as usual; there is nothing special about the vertical.
- **If the target is removed or hidden while targeted** (a delivery collected, a scene change): the next step does not find it and the state goes to Idle. No `use` is sent for it.
- **If the player walks a moving object out of reach**: it is dropped at `reach_m × reach_exit_factor` (Formula 1), however it moved.
- **If a solid thing, such as another player's kayak or a prop, moves between the eye and the target**: it is the first contact, so the target is lost for as long as it is in the way.
- **If a player on foot stands in a doorway with interactables on both sides**: only the one the view centre cast hits is the target. Looking left or right changes it; there is no list to cycle.

**Using**

- **If the player presses `interact` on a dimmed prompt**: nothing happens except a `use_refused` event (rule 11). It is not an error and no message is shown.
- **If the owner's answer has changed between the prompt and the press**: the owner decides when it receives `use`, and refuses it if it is no longer usable. The player sees the prompt go dim, and Interaction raises `use_refused`.
- **If the owner has not answered yet** (a shared object whose answer is on its way from the host): the prompt is shown dimmed, with no text, as if unusable, and a press is dropped. When the answer arrives the prompt updates. A press never queues.
- **If an object's owner system is not present** (not built yet, or not loaded): the object is dimmed with no text and a warning is logged at load; the game does not stop.
- **If the owner's text is longer than the prompt's width**: it is cut with an ellipsis at the prompt's width, never wrapped. The names in "Waiting for [names]" are the owner's to shorten.
- **If the player presses twice quickly**: the second press is dropped by the lockout (Formula 2). The player is never sent to a different object by the second press, since the lockout is per object.
- **If the use makes the player's state change at once** (the kayak's `use` starts Boarding): Interaction is Suspended from the next step, so the prompt is gone before the fade and no second `use` is sent.
- **If the use opens a menu**: the context leaves Gameplay, so Interaction is Suspended. The menu closes through Settings & Input's back rules and the player is Idle again.

**The kayak and the bed**

- **If the kayak drifts through `at_berth` without the player wanting to get out**: "Get out" shows while `at_berth` is true and goes when it is false (Player Controller Formula 8's hysteresis keeps it from flickering). Nothing happens unless the player presses `interact`.
- **If the view is turned 90° away from the dock when `at_berth` becomes true**: "Get out" still shows, because it does not depend on aiming (rule 5).
- **If the player is capsized when `at_berth` is true**: Interaction is Suspended (Player Controller state Capsized) and `at_berth` is false while the state is not Kayak, so "Get out" is gone until the player is righted.
- **If a co-op player is In Bed and the overnight starts**: the context becomes Cutscene / Loading and Interaction is Suspended; "Get up" has no effect once the overnight has begun.

**Co-op**

- **If two players use the same shared object in the same step**: both `use` requests go to the owner, which handles them in the order the host receives them. Interaction does not order them and does not lock the object (rule 9).
- **If a friend uses the bed and the prompt text changes while the player is looking at it**: the owner signals the change and the prompt text updates on the next step.
- **If a guest joins mid-day**: their Interaction starts Idle, with no target, until the first step in Gameplay.
- **If another player's tint would show on a shared object**: it does not; tint is local to the player who is looking at the object (rule 14).

**Other systems**

- **If Munchies is maxed**: nothing changes here. `interact` stays live, and the fridge, where the player recovers, is a normal interactable (brief).
- **If the YAK LOCKED blur or the Chill vibrance is active**: the prompt is on the UI layer and is not blurred or tinted (Retro Rendering rule 1, step 4); the object's tint is on the world pass and is.
- **If the frame rate drops**: the cast runs on the fixed physics step, so the target can be up to one step (16.7 ms at 60 Hz) behind the view; a press uses the target of the latest step. The view and the prompt both update at most once per rendered frame, so at 30 fps the prompt is at most one frame (33 ms) behind the view.

## Dependencies

**Upstream (this system reads from them):**

| System | Hard / Soft | Interface | Without it |
|---|---|---|---|
| Player Controller (`design/gdd/player-controller.md`, Approved) | Hard | `aim_ray`; the state (On foot, Boarding, Kayak, Capsized, Disembarking); `at_berth` | No target, no prompt: the player can use nothing |
| Settings & Input (`design/gdd/settings-input.md`, Approved) | Hard | `interact` pressed; the active device (glyph); the active context | Nothing can be used |
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`, Approved) | Soft | The bed's `usable` and `text`; the In Bed (waiting) state for "Get up" (its rules 5 and 7) | The bed is not an interactable; every other object still works (DNS lists Interaction as a *hard* dependent; here it is soft, because the one object is not the system. Settle with the owner) |
| Retro Rendering (`design/gdd/retro-rendering.md`, Approved) | Soft | The UI layer for the prompt; a per-object tint parameter (it defines none yet: Open Questions) | Without the parameter, the prompt shows and the object is not tinted |

**Downstream (other systems depend on this):**

| System | Hard / Soft | What it relies on |
|---|---|---|
| Deliveries & Drop Box (MVP, not designed) | Hard | The Drop Box as an interactable: `query`, `use`, the prompt |
| Home & Dock Menus (Vertical Slice, not designed) | Hard | The fridge, dresser, Tackle Box and Cooler as interactables |
| Inventory & Storage (MVP, not designed) | Soft | The same objects' `use`; it owns what the menus hold |
| Flip Phone & FishMail (MVP, not designed) | Soft | The Computer as an interactable |
| Pond & Area Travel (not designed) | Soft | The Map as an interactable |
| Player Controller | Soft | The kayak and "Get out" prompts that start Boarding and Disembarking (it works without them only if another way to board exists) |
| Day, Night & Sleep | Soft | The bed prompt and "Get up" |
| Audio (Vertical Slice, not designed) | Soft | `target_gained`, `use_sent`, `use_refused` |
| Multiplayer (Alpha, not designed) | Soft | The request shape; whose machine answers each shared object |

**Not a dependency:** Casting & Tangle, Bite Timing, Reel-in Needle and Chill Meter & Smoking read nothing from this system: `fish` and `smoke` are separate actions that do not pass through Interaction. Interaction does not read them either.

**Bidirectional check:**
- **Already listed correctly:** Player Controller (its Interactions and Dependencies tables name Interaction as a hard dependent: `aim_ray`, the state, `at_berth`), Settings & Input (Hard), Day, Night & Sleep (listed as Hard; see above) and the systems index rows for Deliveries & Drop Box and Home & Dock Menus.
- **Needs updating:** Inventory & Storage, Flip Phone & FishMail and Pond & Area Travel are not listed as dependents in the systems index and must list this system when written. Retro Rendering needs a per-object tint parameter. Player Controller needs an In Bed answer and should pass its state to Casting & Tangle (its own review, recommended item 4).
- **Not designed yet:** Deliveries & Drop Box, Home & Dock Menus, Inventory & Storage, Flip Phone & FishMail, Pond & Area Travel, Audio and Multiplayer must each list this system when they are written.

## Visual/Audio Requirements

*Specialist lens: `art-director` and `audio-director` not consulted. Lean mode. Review manually before production.*

**In view**
- **The prompt** is a chunky plate (Settings & Input's glyph rules: a Plate backing, legible at UI scale 80%) holding the device's glyph, the verb in the larger line and the name in the smaller one. One shape, one memorable feature (art bible Principle 1). It fades in and out over `highlight_fade_s` with the tint, so a sweep across a shelf does not strobe.
- **The tint** is a flat blend toward the highlight colour on the object's lit colour (Formula 3), with no outline and no glow: an outline pass is more than the budget look needs (Pillar 4), and a flat blend survives the dither. The colour is chosen from the art bible's UI palette when the art bible is built on. The tint is never applied to water, so it can never disturb the lit and shade contrast that Principle 3 protects.
- **Dimmed** (an unusable target) is the same prompt at `prompt_dim_alpha`, with the owner's text in place of the verb and no tint. Colour is never the only carrier: the words say what the prompt means, and the tint is a second cue.
- **Nothing is drawn for "Get out" or "Get up" except the prompt.** There is no dock marker and no bed highlight, because neither is aimed at.

**Events this system exposes for Audio** (Audio owns the sounds):
| Event | When | Carries |
|---|---|---|
| `target_gained` | A new object becomes the target | The object `id` |
| `use_sent` | Interaction sends a `use` | The object `id`, the player |
| `use_refused` | A press on a dimmed prompt, or the owner refuses a `use` | The object `id` |

Audio is asked to keep `target_gained` soft and rate-limited (at most one per 0.1 s), so sweeping the view across the shack does not rattle.

📌 **Asset Spec**: Visual/Audio requirements are defined. After the art bible is approved, run `/asset-spec system:interaction` for the prompt plate and the three sounds.

## Game Feel

**The target is calm and obvious: look at a thing, see what E does, press E.** There is no sketch to match; the feel target is that the prompt never surprises (it never appears for something behind a wall, never blinks at the edge of reach, never changes under the player's thumb).

**Response budgets**
- **Prompt**: appears within one physics step of the view settling on a usable object (16.7 ms at 60 Hz), then fades in over `highlight_fade_s`.
- **Press**: `interact` reaches Interaction in the same frame (Settings & Input AC-41), and the `use` is sent that frame. The owner's response time is the owner's budget; the prompt does not wait on it.
- **No snap**: the prompt and the tint fade; nothing moves the camera or the body.
- **Calm**: the prompt sits at a fixed point and does not follow the object, bob or wobble (rule 8).

**Playtest questions** (first Godot playtest, with the owner)
1. Is 2.0 m the right reach in the shack and on the dock, or does the player find themselves stepping in for every object?
2. In the shack, does the 0.12 m sphere ever pick the fridge when the player means the Drop Box, or the other way round?
3. At 0.25, is the tint visible and calm under the dither and the fog, and does it make the object read as "this one"?
4. Is the 0.25 s lockout ever noticed, as a press that did nothing?
5. When fishing close to the dock, does "Get out" show too often or get in the way of the view? (It shows whenever the kayak is within 3 m of the berth and slower than 1.5 m/s.)

## UI Requirements

This system draws one UI element, the **interaction prompt**: the glyph, the verb and the name on a plate, in a usable and a dimmed state, with an optional owner text line; the same element serves "Get out" and "Get up". It sits on the UI layer at native resolution, at `prompt_y_frac` of the window height, centred. It must stay legible at UI scale 80% and at 16:9, 16:10 and 21:9, and it must show the active device's glyph. The tint on the object is not UI: it is a world effect (Visual/Audio Requirements). The HUD & Catch Banner may draw other marks at the view centre (an aiming mark); the UX spec decides whether the prompt and any aiming mark share a layout.

> **📌 UX Flag — Interaction (E)**: This system has UI requirements. In Phase 4 (Pre-Production), run `/ux-design` to create a UX spec for the interaction prompt before writing epics. Stories that reference it should cite `design/ux/[screen].md`, not the GDD directly.

## Cross-References

| Document | Section | What this GDD uses |
|---|---|---|
| Player Controller (`design/gdd/player-controller.md`) | Rules 6, 11, 15, 16, 17; Formula 8; Edge Cases (`interact` and `place`) | `aim_ray` (no sway); free look (why "Get out" needs no aim); boarding and getting out; `at_berth`; `place` beats a press |
| Settings & Input (`design/gdd/settings-input.md`) | Rules 5 and 6; Edge Cases (a binding already held when Gameplay begins); the glyph rules (Visual/Audio); AC-41 | The active device and glyph; the Gameplay-only context; a held press does not count; the Plate backing and UI scale 80%; same-frame input |
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`) | Rules 5, 7 and 9; the In Bed (waiting) state; Visual/Audio (bed prompt) | The bed as an interactable, its three verbs, "Waiting for [names]", getting up |
| Retro Rendering (`design/gdd/retro-rendering.md`) | Rule 1, step 4; Formula 8 (dither) | The prompt on the UI layer with no world effects; the dither the tint must survive |
| Game brief (`design/game-brief.md`) | Controls; Home (the shack's six objects); the dock | WASD and E; the object list; the kayak "paddling back to the dock prompts E to get out" |
| Art bible (`design/art/art-bible.md`) | Principles 1 and 3 | One chunky plate with one memorable feature; the water's lit and shade contrast is never tinted |

## Acceptance Criteria

Physics runs at the project's default 60 Hz. Type tags follow the testing standards: **Logic** needs an automated unit test in `tests/unit/interaction/`, **Integration** an integration test or documented playtest, **Visual** a retained screenshot in `production/qa/evidence/`. *Specialist lens: `qa-lead` applied (coverage, boundaries, cross-system, story type); its gaps are listed after the criteria.* Fixtures use test interactables with stub owners until the real owners exist.

**Choosing the target (rules 1 to 5; Formula 1)**

- **AC-1** (Logic, rule 1) — **GIVEN** two interactables on the view line, one 1.2 m and one 1.7 m ahead, **WHEN** the cast runs, **THEN** the target is the one at 1.2 m and exactly one prompt exists; **WHEN** the nearer one is removed, **THEN** the target is the one at 1.7 m on the next step.
- **AC-2** (Logic, Formula 1) — **GIVEN** defaults (`reach_m` 2.0, `target_radius_m` 0.12), a player on foot and an interactable with a flat front face facing the player, **WHEN** the face is 1.9 m ahead, **THEN** it is the target; **WHEN** 2.1 m ahead (not held), **THEN** there is no target; **WHEN** 1.99 m, **THEN** it is the target (the limit is tested just inside it, not on it).
- **AC-3** (Logic, Formula 1, boundary) — **GIVEN** the same setup at 1.5 m, **WHEN** the interactable's edge is 0.10 m off the view centre line, **THEN** it is the target; **WHEN** 0.15 m off, **THEN** none. **GIVEN** `target_radius_m` 0, **WHEN** the edge is 0.10 m off, **THEN** none.
- **AC-4** (Logic, rule 4, Formula 1) — **GIVEN** a target held at 1.9 m, **WHEN** the player backs away to 2.1 m, **THEN** it stays the target; **WHEN** to 2.3 m, **THEN** it is dropped. **GIVEN** the player then looks away and back at 2.1 m, **THEN** there is no target until 2.0 m or closer. **GIVEN** `reach_exit_factor` 1.0, **WHEN** the held target passes 2.0 m, **THEN** it is dropped at once.
- **AC-5** (Logic, rule 3) — **GIVEN** a wall 1.0 m ahead and an interactable 1.5 m ahead behind it, **WHEN** the cast runs, **THEN** there is no target. **GIVEN** a solid prop that moves between the eye and a target, **THEN** the target is lost while it is in the way and returns when it moves.
- **AC-6** (Logic, edge case) — **GIVEN** two interactables `id` "bed" and "fridge" at the same distance on the sphere's path, **WHEN** the cast runs 100 times, **THEN** the target is "bed" every time.
- **AC-7** (Integration, rule 5) — **GIVEN** a player in the kayak with `at_berth` true and `head_yaw` 90°, **WHEN** a step runs, **THEN** the target is "Get out" and the prompt shows. **GIVEN** `at_berth` false and a Tackle Box on the aim line at 1.5 m, **THEN** there is no target (no cast is made on the water). **GIVEN** `at_berth` true and the state Capsized, **THEN** none.
- **AC-8** (Integration, rule 5) — **GIVEN** a co-op player reported In Bed (waiting) by a stub Day, Night & Sleep, **WHEN** a step runs, **THEN** the target is "Get up" whatever the view faces; **WHEN** the stub reports the overnight has begun, **THEN** Interaction is Suspended and a press sends nothing.

**Contexts and presses (rules 2, 10 to 12; Formula 2)**

- **AC-9** (Integration, rule 2) — **GIVEN** a prompt showing, **WHEN** the phone opens (then Settings, then a Cutscene / Loading context, in separate runs), **THEN** the state is Suspended the same step, the target is none, and a press sends no `use`. **WHEN** Player Controller enters Boarding, Disembarking or Capsized, **THEN** the same.
- **AC-10** (Integration, rule 2) — **GIVEN** `interact` held while the phone closes with a usable object in view, **WHEN** Gameplay begins, **THEN** no `use` is sent; **WHEN** `interact` is released and pressed again, **THEN** exactly one `use` is sent.
- **AC-11** (Logic, rule 10) — **GIVEN** a usable target, **WHEN** `interact` is pressed once and held for 2 s, **THEN** exactly one `use(player, id)` is sent and none on release.
- **AC-12** (Logic, rule 11) — **GIVEN** a target the stub owner reports not usable, **WHEN** `interact` is pressed, **THEN** no `use` is sent, one `use_refused` event is raised, and the camera and the state do not change.
- **AC-13** (Logic, Formula 2) — **GIVEN** `use_lockout_s` 0.25 and a use at 10.00 s, **WHEN** presses arrive at 10.10 s, 10.24 s and 10.25 s, **THEN** the first two are dropped with no event and the one at 10.25 s is sent. **GIVEN** `use_lockout_s` 0, **THEN** all are sent. **GIVEN** a use of the bed at 10.00 s, **WHEN** the Tackle Box is pressed at 10.05 s, **THEN** it is sent (the lockout is per object).
- **AC-14** (Logic, edge case) — **GIVEN** a press and a `place` in the same frame, **THEN** no `use` is sent. **GIVEN** the kayak's `use`, **WHEN** it starts Boarding, **THEN** the next step is Suspended and a second press sends nothing.

**The prompt and the tint (rules 6 to 9; Formula 3)**

- **AC-15** (Integration, rule 6, rule 7) — **GIVEN** the home scene, **WHEN** it loads, **THEN** each interactable in the rule 7 table exists with a verb and a name from the data file; **GIVEN** an interactable whose owner is absent, **THEN** it loads dimmed with no text, a warning is logged naming its `id`, and the game continues.
- **AC-16** (Logic, rule 9) — **GIVEN** a stub owner, **WHEN** it answers usable, **THEN** the state is Ready; **WHEN** it answers not usable with the text "Waiting for Sam", **THEN** Refused with that text; **WHEN** it has not answered, **THEN** Refused with no text and a press is dropped; **WHEN** the answer arrives, **THEN** the state updates on the next step. The owner's answer is asked once per target change, not every step.
- **AC-17** (Visual, rule 8) — **GIVEN** a usable target, **WHEN** screenshots are captured at 16:9 and 21:9 with keyboard and mouse, then gamepad active, **THEN** the prompt shows the glyph E, then A, the verb and the name, at the same fraction of the window height (0.62 ±0.02); **GIVEN** UI scale 80%, **THEN** it is still legible (the three items do not overlap or clip). **GIVEN** the YAK LOCKED blur on, then off, **THEN** the prompt's pixels are identical.
- **AC-18** (Visual, rule 9) — **GIVEN** a dimmed prompt, **THEN** its opacity is 0.5 (±0.02 of the usable prompt) and the object has no tint.
- **AC-19** (Logic, Formula 3) — **GIVEN** `highlight_strength` 0.25, `highlight_fade_s` 0.1 and a channel at 0.40 with a highlight of 1.0, **WHEN** the object becomes the target, **THEN** the shown channel is 0.475 (±0.005) after 0.05 s and 0.55 (±0.005) from 0.1 s on; **WHEN** the target is lost, **THEN** it returns to 0.40 over 0.1 s. **GIVEN** `highlight_fade_s` 0, **THEN** the tint is at full on the next frame. **GIVEN** `highlight_strength` 0.5, **THEN** the full value is 0.70.
- **AC-20** (Logic, edge case) — **GIVEN** a text of 80 characters from the owner, **THEN** the prompt shows one line cut with an ellipsis at the prompt's width and never wraps.

**Co-op and safety (rules 13 to 15)**

- **AC-21** (Integration, rule 13) — **GIVEN** a player walking at 2.5 m/s with a prompt showing, **THEN** the body's speed and the camera are the same as with no prompt.
- **AC-22** (Integration, rule 9, rule 14) — **GIVEN** two players on foot, both facing the Drop Box (a stub owner answering usable), **WHEN** one presses `interact`, **THEN** one `use` is sent and the other's prompt is still Ready; **WHEN** both press in the same step, **THEN** two `use` requests reach the owner. Tint and prompt show only on the machine of the player who faces the object.
- **AC-23** (Logic, config) — **GIVEN** a config with `target_radius_m` 0.3 and `reach_m` 1.0, **WHEN** it loads, **THEN** the load is refused, naming `target_radius_m`; **GIVEN** `reach_m` 0.5, **THEN** refused, naming `reach_m`.
- **AC-24** (Logic, performance) — **GIVEN** one local player on the Steam Deck, **WHEN** profiled for 60 s of walking in the shack, **THEN** this system's work averages under 0.1 ms per physics step (starting budget, to confirm in the first Godot profile).

**Gaps found by the `qa-lead` lens**
- Rules 14 and 15 (co-op) are tested locally with stubs (AC-22); Multiplayer's GDD must add the networked version, including the stale-answer case in Edge Cases.
- AC-8 and the In Bed state need Player Controller or Day, Night & Sleep to define the state; the stub stands in until then (Open Questions).
- Rule 8's object tint needs Retro Rendering to provide a per-object parameter; AC-19 tests the formula, not the shader, until then.
- The verb and name text is provisional, so no criterion tests the wording, only that each exists in the data.
- "Calm and obvious" (Overview) is not testable. It goes to the playtest questions in Game Feel.

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **A per-object tint.** Retro Rendering defines no per-object highlight parameter. Without one, rule 8's tint cannot be drawn and the prompt stands alone. Does the world pass take a tint on the object's lit colour, and is it cheap enough on the Steam Deck? | Retro Rendering; technical-artist | Before the first Interaction story |
| 2 | **Lying in bed in co-op.** Player Controller has no In Bed state: who holds the body and the camera while a player waits in bed, where the view is, and whether the waiting player can look around. "Get up" (rule 5) assumes the answer. | Day, Night & Sleep; Player Controller | Before the co-op bed is built (Alpha) |
| 3 | **"Get out" while fishing near the dock.** It shows whenever `at_berth` is true, which is a 3 m radius and under 1.5 m/s. Should it also need the player to have been moving toward the dock, or to be facing it? Playtest question 5 decides. | Owner | First Godot playtest |
| 4 | **Verb and name text** (rule 7) is provisional. "Check FishMail", "Open" and the menu names need the writer; the wording of "Go to bed" and "Get up" is already in Day, Night & Sleep. | Writer; UX spec | With the UX spec |
| 5 | **Prompt layout with the HUD.** Where the prompt sits against any aiming mark and the catch banner, and whether it is owned here or by HUD & Catch Banner. | UX spec; HUD & Catch Banner | With the UX spec |
| 6 | **The request over the network.** How `query` and `use` reach the host, how an answer that is a round trip old is refused (Edge Cases), and whether guests can use shared objects while the host is in a menu. | Multiplayer; its ADR | Multiplayer design (Alpha) |
| 7 | **Hard or soft on Day, Night & Sleep.** Its GDD lists Interaction as a hard dependent; here it is soft (every object but the bed works without it). | Owner, with Day, Night & Sleep | When Day, Night & Sleep is next edited |
| 8 | **Index rows.** Inventory & Storage, Flip Phone & FishMail and Pond & Area Travel do not list Interaction in the systems index. | `/map-systems` update | After this GDD is approved |
