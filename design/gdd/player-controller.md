# Player Controller

> **Status**: Designed 2026-11-17 (`/design-system`, guided, lean); not yet reviewed
> **Creative Director Review (CD-GDD-ALIGN)**: skipped — Lean mode
> **Author**: owner + Claude (design-system, lean review)
> **Last Updated**: 2026-11-17
> **Last Verified**: 2026-11-17
> **Implements Pillar**: Pillar 2 (Chill First, Never Punishing); Pillar 5 (Better With Friends, Whole Alone)

## Summary

Player Controller is the player's first-person body and camera: walking in the shack and on the dock, and paddling the kayak with free look on the pond. It turns the `move` and `look` inputs into calm, weighty movement copied from the browser sketch the owner played, gives every other system the one aim line it needs (where the player is looking), and places the player at wake-up and on a load. It owns the kayak's base speed and tip threshold that kayak gear adds to, and a soft, cost-free capsize for co-op bumps.

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `Settings & Input (hard); Gear & Item Database, Scene Flow & Loading, Multiplayer (soft)`

## Overview

Player Controller is the player's body and eyes. It turns the `move` and `look` values from Settings & Input into first-person walking in the shack and on the dock, and into paddling the kayak on the pond, and it places and aims the camera that every other system reads: the cast goes where the camera points, the interaction prompt reads what the camera faces, and the 3D world is drawn from it. It owns speed, acceleration, turning, the pitch limit, where the player may stand, where the bank stops the kayak, the camera's height and the field of view it applies, and the base `paddle_speed` and `tip_resistance` that kayak gear adds to. It does not decide what `fish`, `interact` or `smoke` do; the systems that own those actions do. Nothing here can fail the player: there is no stamina, falling, drowning or damage, and a wall or the bank only stops you (Pillar 2). It is the one system the player touches every second of play, so its job is to be calm and predictable and never get in the way of the next cast. In co-op every player has one, and the host decides where each player is (Pillar 5).

## Detailed Design

*Specialist lens: `game-designer`'s supporting roles for a Core movement system (`ux-designer`, `gameplay-programmer`) were not consulted. Lean mode. Review manually before production.*

Every number below is a **starting value, untuned**, defined with its range in Formulas. The kayak model and the capsize scope are owner decisions of 2026-11-17: free look with a turning kayak, walking with strafe, and tip and bump defined here provisionally.

### Core Rules

**Body and camera**

1. **One controller per player, two ways to move.** A player is either *on foot* (the shack, its porch and the dock) or *in the kayak* (the pond). Every other state in this document is a short stretch between those two or a reaction to a push (States and Transitions). The local player has exactly one camera, and this system owns it.

2. **Movement runs only in the Gameplay context** (Settings & Input rule 6). Outside it, `move` and `look` read as zero: the camera holds still, an on-foot body stops (Formula 1) and a coasting kayak slows under its own drag (Formula 4). Nothing is queued: a key held when Gameplay comes back counts from that moment. In solo, `game_time_paused` stops this system's physics step altogether (Settings & Input rule 17); the kayak freezes where it is and resumes at the same speed.

3. **The camera sits at eye height**: `eye_height_foot_m` on foot, `eye_height_kayak_m` above the water in the kayak (the sketch's 1.15 m, a seated paddler). It never clips into a wall or the kayak; on foot the body capsule keeps the eye `camera_wall_margin_m` from any wall.

4. **Field of view comes from Settings & Input** (60–100°, default 75°) and is **vertical**, the engine's default for a camera that keeps its height. A vertical value keeps the number of internal lines per degree the same at 16:9, 16:10 and 21:9, so the water band the player sees at casting range, which Retro Rendering's 3:1 shade gap is measured on, does not change with the window shape. It is applied on the frame the setting changes, in every context including Settings, so the player sees the change while choosing it. (The sketch used 72° vertical, about 105° horizontal at 16:9, and the owner said it felt great.)

5. **Look.** `look` already carries deadzone, curve, sensitivity, invert and swap (Settings & Input Formulas 2 and 3); this system turns it into angles (Formula 2) and clamps them. Pitch is clamped between `pitch_min` and `pitch_max`, which have one pair of values on foot (−80° to +80°) and another in the kayak (−40° to +30°, the sketch's −40° to +29°, rounded; Formula 2). The camera never rolls except for the kayak's sway (rule 12). Mouse or stick, the view never snaps or recentres by itself.

6. **`aim_ray` is the one thing other systems read from the camera.** It is the camera's position and its look direction **without** sway, bob or roll. Casting & Tangle casts along it ("straight ahead where you look", brief), Interaction casts it to find what the player faces, and nothing else needs the camera's transform. Sway therefore can never spoil a cast.

**On foot**

7. **Walking uses `move` as a strafe axis.** `move.y` walks forward and back, `move.x` sidesteps, both relative to the body's facing; `look` turns the body (yaw) and tilts the view (pitch). Speed is the length of `move` times `walk_speed`, so a half-tilted stick walks at half speed; backward and sideways are as fast as forward. Velocity eases toward the wanted velocity rather than jumping to it (Formula 1), so starting and stopping take a fraction of a second.

8. **There is no jump, sprint, crouch, climb or fall.** The brief lists none, nothing in the game asks for one, and each is a way to get stuck or hurt (Pillar 2). Gravity only holds the body to the floor.

9. **The walkable area is the home scene's own collision: the shack inside, the porch, the path and the dock.** Every edge that drops to the water or the bank beyond has a collider (a rail or an invisible wall), so a player on foot can never enter the water or leave the area. Walkable surfaces are authored with steps no taller than `step_height_m` and slopes no steeper than `floor_max_angle_deg`; the body climbs those without a jump. Level and art follow this; it is what lets the controller have no fall state.

**In the kayak**

10. **The kayak is paddled with `move`: forward and back, and turn.** `move.y` paddles toward the kayak's heading (back-paddling is slower, `reverse_ratio`); `move.x` turns the kayak's heading at `kayak_turn_rate_deg` per second at full tilt, even from a standstill. Speed does not depend on how hard the player holds a key beyond the length of `move`. The kayak's velocity eases toward the wanted velocity (Formula 4), so it carves through a turn and coasts to a stop after the paddle stops, rather than turning on the spot with a fixed speed. A diagonal key press (W with A) gives about 0.7 of each axis (Settings & Input Formula 1), so turning while paddling is slower and gentler than either alone; this is intended and is a playtest question (Open Questions).

11. **Free look in the kayak** (owner decision 2026-11-17). The camera's yaw is the kayak's heading plus a `head_yaw`. `look` changes only `head_yaw`, clamped to ±`head_turn_max_deg`; at the limit the view stops and the kayak does not follow. Turning the kayak (rule 10) carries the view with it, as the head is turned relative to the body. The player can therefore scan the shade to either side while the kayak drifts or holds, and cast where they look. `head_yaw` is 0 on boarding and is never recentred automatically (Open Questions).

12. **Sway.** The kayak's view rocks gently: a small slow bob on the water and a roll that grows with speed (Formula 7). Both are purely visual, never touch `aim_ray` (rule 6), and are multiplied by one `sway_scale` (1.0), a hook for the camera-bob accessibility slider that Settings & Input deferred.

13. **A line in the water holds the kayak still.** While any system holds the paddle (Casting & Tangle while a cast is charging, flying, waiting, on a bite, being reeled or tangled, and a capsize, each by name), thrust is ignored and the kayak coasts to a stop faster (Formula 4, `line_out_response_mult`). Turning and `look` stay live, because the player may still want to face the shade. A hold is keyed by who holds it, so one system letting go never frees another's hold. Nothing here decides when a line is out; Casting & Tangle does.

14. **The bank and the water's edge stop the kayak and never hurt it.** The pond's edge, the dock, its posts and rocks are collision; the kayak slides along them, losing the part of its speed that points into them and keeping the rest (Formula 5). There is no bounce, no damage and no stuck state. Lily pads and reeds have no collision.

**Boarding, disembarking and placing**

15. **Getting in.** On the dock the kayak waits at its berth. `interact` on it (Interaction owns the prompt) starts Scene Flow's push-off cutscene; at its end the player is in the kayak at the pond's `launch_point` facing the launch heading, with `head_yaw` 0 and velocity 0.

16. **Getting out.** `at_berth` is true when the kayak is within `berth_radius_m` of its berth and slower than `berth_max_speed_mps` (Formula 8). While it is true, Interaction offers "get out" on `interact` ("paddling back to the dock prompts E to get out", brief). Choosing it starts a short climb-out transition owned by Scene Flow; at its end the player is on foot at the dock's `disembark_point` and the kayak is tied at its berth.

17. **`place(point)` puts a player somewhere and resets them.** The point names a position and a facing. Placing zeroes velocity, `head_yaw`, any capsize, and every hold on the paddle; sets pitch to 0; and puts the player on foot, with the kayak at the berth. It is how the wake-in-bed routine (Day, Night & Sleep rule 9, also used by the 10-beer blackout), a Repack load (Save/Load rule 7: the pond's shack) and arrival in a new area (the new shack) place a player, from any state: a drift-off in the kayak, a capsize or the middle of a cutscene included. **Position is never saved** (Save/Load); every load is a placement.

**Pushes and tipping** (provisional until Multiplayer, Alpha; owner decision 2026-11-17)

18. **An outside push moves the kayak.** `apply_push(impulse_mps, source)` adds a velocity change, in metres per second, to the kayak. Only Multiplayer calls it (a friend's kayak bumping yours). A solo player is never pushed and so never tips; nothing in this system tips a kayak by itself.

19. **A push over the tip threshold capsizes the kayak.** The threshold is `tip_resistance_base` plus the equipped kayak's `tip_resistance` (Gear & Item Database; the Rental adds 0), through the same stacking as every stat (Formula 6). A push at or below it only moves the kayak.

20. **A capsize is a soft, funny setback and costs nothing** (Pillar 2). For `capsize_duration_s` the view dips to the waterline and input is ignored; then the player is righted where they are, heading kept, velocity 0, and **cannot be capsized again for `capsize_grace_s`**, so a friend cannot chain-tip. The fish on the stringer, the Cooler, the strains and the gear are untouched. A catch in progress is lost like any failed catch (Casting & Tangle and Reel-in Needle reel in and report it; their rules decide the rest). Multiplayer may change what a capsize looks like or adds, not that it costs nothing.

**Co-op**

21. **A player's controller is a small plain state**: mode, position, heading, `head_yaw`, pitch, velocity, capsize timer and the paddle holds' count. That is all another peer needs to show them. The player's own look is applied on their own machine the same frame (the camera never waits on the network); the host decides what happens between kayaks (rules 18 to 20). How the state is sent and predicted belongs to Multiplayer and its ADR (Open Questions).

### States and Transitions

| State | Entered by | Live actions | What the body does |
|---|---|---|---|
| **On foot** | `place(point)`; the end of Disembarking | `move`, `look` | Walks (rules 7 to 9) |
| **Boarding** | `interact` on the kayak at the dock | none (Cutscene / Loading context) | Held while Scene Flow plays the push-off; at its end placed at `launch_point` |
| **Kayak** | the end of Boarding; the end of Capsized | `move`, `look` | Paddles, turns, looks (rules 10 to 14) |
| **Capsized** | a push over the tip threshold while in the kayak | none | Dunked for `capsize_duration_s`, then righted |
| **Disembarking** | `interact` while `at_berth` | none (Cutscene / Loading context) | Held while Scene Flow plays the climb-out; at its end placed at `disembark_point` |

| From | To | Trigger |
|---|---|---|
| On foot | Boarding | `interact` on the kayak |
| Boarding | Kayak | Scene Flow finishes the push-off |
| Kayak | Disembarking | `interact` while `at_berth` |
| Disembarking | On foot | Scene Flow finishes the climb-out |
| Kayak | Capsized | `apply_push` over the tip threshold, and not within `capsize_grace_s` of the last capsize |
| Capsized | Kayak | `capsize_duration_s` has passed |
| Any | On foot | `place(point)` (rule 17) |

Phone, Settings and the other contexts do not change this system's state: they only stop its input (rule 2), so a kayak with the phone open coasts to rest and stays a kayak.

### Interactions with Other Systems

| System | Flows in | Flows out | Owner of the interface |
|---|---|---|---|
| Settings & Input | `move`, `look` (after deadzone, curve, sensitivity, invert, swap; Formulas 1 to 3), field of view, the active context, `game_time_paused` | — | Settings & Input owns the values; this system owns speeds, clamps and the camera |
| Gear & Item Database | The equipped kayak's `paddle_speed` and `tip_resistance` (flat; stat stacking, Gear Formula 1) | The two base values (`paddle_max_base`, `tip_resistance_base`) and their units: m/s and m/s | This system owns the bases and units; Gear owns each kayak's step |
| Interaction (E) *(not designed)* | `interact` on the kayak, and the "get out" choice | `aim_ray`; `at_berth`; the current state | Interaction owns prompts and reach; this system owns the ray and `at_berth` |
| Casting & Tangle *(not designed)* | A paddle hold, by name, while a line is out | `aim_ray` | Casting & Tangle owns when the line is out and the cast's distance |
| Retro Rendering | — | The camera transform (with sway) and the vertical field of view; `sway_scale` | This system owns the camera; Retro Rendering owns how the frame is drawn |
| Day, Night & Sleep | `place(point)` for the bed at wake-up and the blackout | Nothing: the drift-off only cancels input (Settings & Input rule 7) | Day, Night & Sleep owns when; this system owns where the player stands |
| Save/Load (Repack) | `place(point)` for the shack on a load | Nothing: position is not saved | Save/Load; this system keeps no saved state |
| Scene Flow & Loading *(not designed)* | The push-off and climb-out cutscene start and end; `place(point)` on a load or arrival | Requests the cutscene; reports Boarding / Disembarking | Scene Flow owns the cutscenes and fades |
| Multiplayer *(not designed)* | `apply_push(impulse_mps, source)` | The player state (rule 21) | Multiplayer owns who pushes whom, the netcode and the capsize's look |
| Audio *(not designed)* | — | State, speed and capsize events (footsteps, paddle, bump, splash) | Audio owns the sounds; this system exposes the events |

## Formulas

All `data file` values live in the player controller's config resource, not in code. Every easing below is exponential, `1 − e^(−k·Δt)`, which is between 0 and 1 for any step, so it never overshoots and gives the same motion at any frame rate. Δt is the physics step (1/60 s at the project default). Positive yaw turns right (clockwise seen from above); `pitch` is up-positive.

**Specialist lens:** the `systems-designer` lens was applied (every variable worked at its minimum, maximum and zero). Findings that shaped the formulas: speed and velocity never reach exactly 0 without a snap (Formulas 1 and 4); faster gear would grow the camera roll without a cap (Formula 7); an outside push is unbounded without a cap on the velocity it applies (Formula 6); there is no positive feedback loop anywhere in this system, because no output feeds back into a gain.

### Formula 1: Walk velocity

The walk_velocity formula is defined as:

`v_target = move × walk_speed` (the vector `move` rotated into the body's facing)
`v ← v + (v_target − v) × (1 − e^(−walk_response × Δt))`
`if |v| < walk_stop_epsilon and move = 0: v ← 0`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| move | Vector2 | length 0–1 | calculated (Settings & Input Formula 1) | Strafe axis: y forward, x right |
| walk_speed | float | 1.0–5.0 m/s | data file, default 2.5 | Speed at full tilt, in any direction |
| walk_response | float | 4–30 per s | data file, default 10 | How fast velocity follows the wanted velocity (time constant 1 / walk_response) |
| walk_stop_epsilon | float | 0.005–0.05 m/s | data file, default 0.01 | Below this with no input the body stops exactly |
| Δt | float | 0–0.1 s | calculated (physics step) | Time since the last step |

**Output Range:** `|v|` from 0 to `walk_speed`. It is exactly 0 at rest, because of the snap.
**Example:** full forward from rest: after 0.1 s, 2.5 × (1 − e^−1) = **1.58 m/s**; after 0.3 s, **2.38 m/s** (95%). Release at 2.5 m/s: after 0.1 s, **0.92 m/s**; the body travels 2.5 / 10 = **0.25 m** more and is exactly still after about 0.55 s. A 13 m dock (the sketch's) takes about 5.3 s.
**Boundaries:** `walk_response` 4 stops in 0.63 m (slidey on a 2.6 m dock, the lower limit); 30 stops in 8 cm (near instant). `walk_speed` 5 crosses the dock in about 2.7 s. `move` 0 decays to a stop; no input gives no division and no unbounded value.

### Formula 2: Look angles

The look_angles formula is defined as:

`pitch ← clamp(pitch − pitch_change_deg, pitch_min, pitch_max)`
On foot: `yaw ← wrap(yaw + yaw_change_deg)`
In the kayak: `head_yaw ← clamp(head_yaw + yaw_change_deg, −head_turn_max_deg, +head_turn_max_deg)`, and `camera_yaw = heading + head_yaw`

`yaw_change_deg` and `pitch_change_deg` are Settings & Input Formula 2 (mouse) or 3 (stick). A positive `pitch_change_deg` is the mouse moving down, so it lowers the view. Applied every rendered frame, not every physics step, so the view never lags the hand. A change that would pass a clamp is cut at the clamp and the excess is **discarded**, so reversing direction responds at once.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| yaw_change_deg, pitch_change_deg | float | any | calculated (Settings & Input) | This frame's turn |
| pitch_min, pitch_max | float | on foot −85 to −60 and +60 to +85°; in the kayak −60 to −20 and +15 to +45° | data file, defaults on foot −80 / +80°, in the kayak −40 / +30° | Pitch limits per mode (the kayak's are the sketch's −0.7 / +0.5 rad, rounded) |
| head_turn_max_deg | float | 45–120° | data file, default 90 | How far the head turns from the kayak's heading either way |
| heading | float | any, wrapped | calculated (Formula 3) | The kayak's heading |

**Output Range:** `pitch` within its mode's limits; `head_yaw` within ±`head_turn_max_deg`; on-foot `yaw` unlimited (wrapped to −180°…180°).
**Example:** in the kayak, `head_yaw` 70°, mouse moves 500 counts right at sensitivity 1.0: change = 500 × 0.07 = 35° → 105° → clamped to **90°**; moving 100 counts back (7°) gives 83° at once. On foot, pitch 0, mouse down 300 counts: change 21° → pitch **−21°**.
**Boundaries:** `head_turn_max_deg` below 45° makes free look too small to scan the shade (the lower limit); at 120° the player can look past their shoulder. Changing pitch limits to ±90° risks the camera flipping; the limits stop short of it.

### Formula 3: Kayak heading

The kayak_heading formula is defined as:

`heading ← wrap(heading + move.x × kayak_turn_rate_deg × Δt)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| move.x | float | −1 to 1 | calculated (Settings & Input) | Turn axis; positive turns right |
| kayak_turn_rate_deg | float | 30–180 °/s | data file, default 90 | Turn speed at full tilt, from a standstill or at speed (it does not depend on speed) |

**Output Range:** the heading is a wrapped angle; the turn rate is 0 to `kayak_turn_rate_deg`.
**Example:** A alone: 90°/s left, so a half turn takes **2.0 s**. W and A together: `move.x` is 0.707 (Settings & Input Formula 1), so **63.6°/s**. A stick pushed halfway (0.26 after Settings & Input Formula 1): **23°/s**.
**Boundaries:** at 30°/s a half turn takes 6 s (too slow to point at a bite); at 180°/s it takes 1 s (twitchy next to a 2.7 s speed-up).

### Formula 4: Kayak velocity

The kayak_velocity formula is defined as:

`v_max = stat_value(paddle_max_base, paddle_speed)` (Gear & Item Database Formula 1; one flat from the equipped kayak, no percent or factor)
`target_speed = move.y × v_max` if `move.y ≥ 0`; `move.y × reverse_ratio × v_max` if `move.y < 0`; `0` while any system holds the paddle (rule 13)
`v_target = target_speed × (unit vector along the heading)`
`k = paddle_response × (line_out_response_mult if the paddle is held, else 1)`
`v ← v + (v_target − v) × (1 − e^(−k × Δt))`
`if |v| < kayak_stop_epsilon and target_speed = 0: v ← 0`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| paddle_max_base | float | 2.5–8.0 m/s | data file, default 4.5 | Top speed of the Rental Kayak (the sketch's `paddle_max`) |
| paddle_speed | float | 0 to +3.0 m/s | Gear & Item Database, per kayak: Rental 0, Sit-on-Top +0.75, Pedal +1.5 (owner decision 2026-11-17) | Flat top-speed bonus of the equipped kayak |
| v_max | float | 4.5, 5.25, 6.0 m/s with shipped data | calculated | Top speed forward, never below 0 (`stat_value`) |
| move.y | float | −1 to 1 | calculated (Settings & Input) | Paddle axis |
| reverse_ratio | float | 0.3–1.0 | data file, default 0.6 | Back-paddling top speed as a share of forward (the sketch's 0.6) |
| paddle_response | float | 0.4–3.0 per s | data file, default 1.1 | How fast velocity follows the wanted velocity; also how quickly the kayak coasts to rest (the sketch's `paddle_drag`) |
| line_out_response_mult | float | 1–10 | data file, default 4 | Faster slowing while a line is out (the sketch's ×4) |
| kayak_stop_epsilon | float | 0.005–0.05 m/s | data file, default 0.01 | Below this with no thrust the kayak stops exactly |

**Output Range:** forward `|v|` from 0 to `v_max`; backward to `reverse_ratio × v_max`; exactly 0 at rest. A push (Formula 6) can briefly exceed `v_max` and the easing brings it back.
**Example (Rental, `v_max` 4.5):** full forward from rest: after 1 s, 4.5 × (1 − e^−1.1) = **3.00 m/s**; after 3 s, **4.33 m/s** (96%). Paddle released at 4.5 m/s: after 1 s **1.50 m/s**, and it coasts 4.5 / 1.1 = **4.09 m**. A line cast at 4.5 m/s: `k` = 4.4, after 0.5 s **0.50 m/s**, coasts **1.02 m**. Full reverse: **−2.7 m/s**. Pedal (`v_max` 6.0) crosses the 124 m pond in about 21 s, the Rental in about 28 s.
**Boundaries:** these are the sketch's dynamics exactly (acceleration 5, drag 1.1 gives 5 / 1.1 = 4.5 m/s), so what the owner played is preserved. `paddle_response` 0.4 coasts 11 m (sluggish, the lower limit); 3.0 coasts 1.5 m (snappy, the upper limit). `line_out_response_mult` 1 means a line does not slow the kayak faster than coasting; the hold still stops thrust. `v_max` is 0 only if `paddle_max_base` and the gear were both 0, which the ranges rule out.

### Formula 5: Bank slide

The bank_slide formula is defined as:

`v ← v − min(0, v · n) × n`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| v | Vector2 | any | calculated (Formula 4) | Kayak velocity before contact |
| n | Vector2 | unit length | calculated (the collision's normal) | Points from the bank, dock, post or rock into open water |

**Output Range:** `|v|` after is never above `|v|` before. The part of `v` pointing into the obstacle is removed; the part along it is kept.
**Example:** 4.5 m/s at 45° into the bank: the part into it is 3.18 m/s and is removed, leaving **3.18 m/s** along the bank. Head-on: **0**, with no bounce. With W held the kayak keeps pushing and slides along at the along-bank share of its speed. In a corner the slide is applied for each contact in turn and ends at a stop at worst.

### Formula 6: Push and tip

The push_tip formula is defined as:

`tip_threshold = stat_value(tip_resistance_base, tip_resistance)` (one flat from the equipped kayak)
`capsize if |impulse_mps| > tip_threshold, and the state is Kayak, and capsize_grace_s has passed since the last capsize ended`
`otherwise: v ← v + clamp_length(impulse, bump_velocity_cap_mps)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| impulse_mps | Vector2 | any | calculated (Multiplayer, provisional: the closing speed along the contact × 1.0) | Velocity change an outside push asks for |
| tip_resistance_base | float | 2–12 m/s | data file, default 5.0 | The Rental Kayak's tip threshold |
| tip_resistance | float | 0 to +4 m/s | Gear & Item Database, per kayak: Rental 0, Sit-on-Top +1.5, Pedal +3.0 (owner decision 2026-11-17) | Flat tip-threshold bonus of the equipped kayak |
| tip_threshold | float | 5.0, 6.5, 8.0 m/s with shipped data | calculated | Push at which the kayak capsizes |
| bump_velocity_cap_mps | float | 1–8 m/s | data file, default 4.0 | Most velocity change a non-tipping push may apply |
| capsize_duration_s | float | 1.5–6 s | data file, default 3.0 | How long the dunk lasts |
| capsize_grace_s | float | 2–10 s | data file, default 4.0 | Immunity after righting |

**Output Range:** a push either capsizes the kayak or changes its velocity by at most `bump_velocity_cap_mps`; a capsize sets velocity to 0.
**Example (provisional, impulse = closing speed):** a Rental at 4.5 m/s hits a stopped Rental: impulse 4.5 ≤ 5.0, **no capsize**; the other kayak is nudged 4.0 m/s (the cap). Two Rentals head-on at 4.5 m/s each: closing 9 > 5, **both capsize**. A Pedal at 6.0 hitting a stopped Rental: 6 > 5, **the Rental capsizes**; hitting a stopped Sit-on-Top: 6 ≤ 6.5, **no capsize**.
**Boundaries:** `tip_resistance_base` 12 makes the Rental untippable by bumping (the fastest two kayaks can close at with shipped data is 12, so this is the "off" setting for bumps); 2 makes any bump tip. An impulse of 0 changes nothing. A huge impulse capsizes and its size no longer matters; the cap exists so a bad value can never fling a kayak that does not tip. The numbers are provisional until Multiplayer defines how an impulse is computed.

### Formula 7: Kayak sway

The kayak_sway formula is defined as:

`bob_y = sway_scale × sway_bob_m × sin(sway_bob_rad_s × t)`
`roll = sway_scale × min(sway_roll_deg_per_mps × speed, sway_roll_max_deg) × sin(sway_roll_rad_s × t)`

`t` is game time in seconds since boarding (it stops when `game_time_paused` is true). On foot there is no bob and no roll. Neither value ever reaches `aim_ray` (rule 6).

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| sway_scale | float | 0–1 | data file, default 1.0 | Master multiplier; the hook for a camera-bob accessibility slider (Settings & Input Open Question 2) |
| sway_bob_m | float | 0–0.06 m | data file, default 0.03 | Vertical bob amplitude |
| sway_bob_rad_s | float | 0.5–3 rad/s | data file, default 1.7 | Bob rate (period 3.7 s) |
| sway_roll_deg_per_mps | float | 0–1.5 °/(m/s) | data file, default 0.69 | Roll per metre per second of speed (the sketch's 0.012 rad) |
| sway_roll_max_deg | float | 0–6° | data file, default 3.5 | Largest roll amplitude |
| sway_roll_rad_s | float | 0.5–5 rad/s | data file, default 3.1 | Roll rate (period 2.0 s) |
| speed | float | 0 to about 6 m/s | calculated (`|v|`) | Kayak speed |

**Output Range:** bob within ±0.03 m, roll within ±3.5°; both 0 at `sway_scale` 0.
**Example:** Rental at 4.5 m/s: roll amplitude 0.69 × 4.5 = **3.1°** (the sketch's value, inside the cap), swinging every 2.0 s; a Pedal at 6.0 m/s would give 4.1° and is held to **3.5°**. At rest the roll is 0 and only the 3 cm bob remains.
**Boundaries:** without the cap, faster gear would roll the view further than the sketch the owner played; the cap keeps the worst case within 0.4° of it.

### Formula 8: At the berth

The at_berth formula is defined as:

`at_berth becomes true when: state is Kayak, distance ≤ berth_radius_m, and |v| ≤ berth_max_speed_mps`
`at_berth becomes false when: distance > berth_radius_m × berth_exit_factor, or |v| > berth_max_speed_mps × berth_exit_factor, or the state leaves Kayak`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| distance | float | 0+ m | calculated | Horizontal distance from the kayak to its berth marker |
| berth_radius_m | float | 1.5–6 m | data file, default 3.0 | How close counts as at the berth |
| berth_max_speed_mps | float | 0.5–3 m/s | data file, default 1.5 | How slow counts as arriving |
| berth_exit_factor | float | 1.0–2.0 | data file, default 1.25 | The leave threshold is this much looser than the enter threshold, so the prompt does not flicker at the edge |

**Output Range:** a boolean that Interaction reads.
**Example:** a Rental at 4.5 m/s coasts after the paddle is released, `v = 4.5 − 1.1 × d` for `d` metres travelled, so it is down to 1.5 m/s after 2.7 m. Released **5.7 m** from the berth, it reads true 3.0 m out and stays true. Released at 4 m, it is still faster than 1.5 m/s at 3.0 m out, so it reads false until it has slowed to 1.5 m/s at 1.3 m out, then true; it would coast 4.1 m, so the dock's collision stops it first (Formula 5). Once true it stays true until the kayak is 3.75 m away or faster than 1.88 m/s.

### Reference values

Not formulas, but quantities Core Rules state. They live in the same config resource.

| Value | Default | Range | Used by |
|---|---|---|---|
| `eye_height_foot_m` | 1.6 m | 1.4–1.8 | Rule 3 |
| `eye_height_kayak_m` | 1.15 m above the water (the sketch's) | 0.8–1.5 | Rule 3 |
| `camera_wall_margin_m` | 0.15 m | 0.1–0.3 | Rule 3 |
| Body capsule | radius 0.3 m, height 1.7 m | radius 0.25–0.4 | Rules 7, 9 |
| `step_height_m` | 0.3 m | 0.2–0.4 | Rule 9 |
| `floor_max_angle_deg` | 40° | 30–50 | Rule 9 |
| `kayak_radius_m` | 0.8 m (a circle on the water plane) | 0.5–1.2 | Rule 14, Edge Cases |
| `stuck_timeout_s` | 2.0 s | 1–5 | Edge Cases (on foot) |

`launch_point`, `disembark_point`, the berth marker and the bed's `place` point are placed in each scene, not tuned.

## Edge Cases

*Specialist lens: the `systems-designer` edge-case pass was not run. Lean mode. Review manually before production.*

**Input and contexts**

- **If the phone, Settings or a cutscene opens while the player is walking**: `move` and `look` read zero; the body eases to a stop (Formula 1, about 0.25 m) and the camera holds. Nothing is queued.
- **If the phone opens while the kayak is moving**: the kayak coasts to rest under its own drag (Formula 4, about 4 m from full speed) and stays in the Kayak state. If it drifts into `at_berth` meanwhile, nothing happens until Gameplay returns, because `interact` is not live in the Phone context.
- **If a `move` key is still held when Gameplay returns**: it counts from that frame (rule 2); no movement from the time away is replayed.
- **If Gameplay returns after the mouse was released** (a context exit, regained window focus): the first frame of `look` after the return is discarded, so a cursor re-capture can never swing the view.
- **If the window loses focus or the gamepad disconnects in co-op**: no pause happens (Settings & Input rule 17), input reads zero, and the body stops or the kayak coasts as above.
- **If the field of view changes at 100°**: the camera's near plane (0.05 m) and `camera_wall_margin_m` keep walls from clipping at the widest setting. Changing the window's shape never changes the vertical field of view (rule 4).

**The kayak**

- **If the kayak is driven into a corner of the bank or between the dock and a rock**: Formula 5 is applied for each contact and the kayak stops at worst. It is never stuck: the kayak's collision is a circle of `kayak_radius_m` on the water plane, so turning in place never changes what it touches, and back-paddling or turning always frees it.
- **If a hold on the paddle outlives the state that raised it** (a system forgets to let go): every hold is cleared when a capsize ends, when the state leaves Kayak, and on `place`. A kayak that cannot be paddled for any other reason is impossible by construction.
- **If a capsize happens while a line is out**: the capsize adds its own hold, Casting & Tangle and Reel-in Needle end the cast or catch as a failure (rule 20), and every hold is cleared when the capsize ends, so the player paddles freely after righting.
- **If two pushes arrive in the same physics step**: they are added as vectors, and the tip test runs once on the sum (Formula 6). The host applies every push of a step together, so the order the pushes were sent in never matters.
- **If a push arrives during a capsize**: it is ignored completely.
- **If a push arrives during `capsize_grace_s`**: the velocity nudge applies (capped at `bump_velocity_cap_mps`), and it can never capsize.
- **If a push arrives while the player is on foot, boarding or disembarking**: it is ignored, not queued. Only a kayak can be pushed.
- **If a push throws the kayak faster than `v_max`**: the speed is kept for that moment and eases back to the wanted speed (Formula 4); the bank still stops it (Formula 5).
- **If the equipped kayak changes while the player is on the water** (impossible in the shipped game, because gear is changed on foot at the Tackle Box; a co-op sync or a debug command could do it): `v_max` and `tip_threshold` take the new values on the next step and velocity is not reset.
- **If the equipped kayak has no `paddle_speed` or `tip_resistance` entry**: it adds 0, so it behaves as the Rental.

**Boarding, getting out and placing**

- **If the midnight drift-off, a blackout or a load arrives during Boarding, Disembarking or a capsize**: `place` wins, Scene Flow cancels its cutscene, and the player wakes on foot in the bed with the kayak at its berth (rule 17).
- **If `interact` on the kayak and a `place` happen in the same frame**: `place` wins and the `interact` is dropped.
- **If two players in co-op paddle back to the dock**: every dock has four berth markers, one per player slot, and each player's kayak uses its own. In solo the first is used. Two kayaks never share a berth.
- **If a guest joins mid-day**: they are placed on foot at the shack's join point with their kayak at their own berth. Multiplayer decides when this happens (provisional: neither Save/Load nor any other GDD yet says where a joining guest stands).

**On foot**

- **If two players on foot meet**: they pass through each other. Bodies on foot do not collide, so nobody can block a doorway or the dock. Kayaks do collide, because the bump is the fun (rule 18).
- **If the body is wedged** (a bad collider, or an object a bug left in a doorway) **and `move` has been held for `stuck_timeout_s` without the body moving 0.05 m**: the player is placed at the scene's default place point (the shack door), so a player on foot can never be softlocked.
- **If a step is taller than `step_height_m` or a slope steeper than `floor_max_angle_deg`**: the body cannot climb it, so it is a wall. Scenes are authored so no walkable route needs one (rule 9); a scene check verifies it (Acceptance Criteria).
- **If the frame rate drops**: movement runs on the fixed physics step, so speeds and stopping distances do not change. At 6 m/s a step moves the kayak 0.1 m, less than `kayak_radius_m`, so it cannot pass through a post.

## Dependencies

**Upstream (this system reads from them):**

| System | Hard / Soft | Interface | Without it |
|---|---|---|---|
| Settings & Input (`design/gdd/settings-input.md`, Approved) | Hard | `move`, `look` (its Formulas 1 to 3); field of view; the active input context; `game_time_paused` | Nothing moves; there is no input |
| Gear & Item Database (`design/gdd/gear-item-database.md`, Approved) | Soft | The equipped kayak's `paddle_speed` and `tip_resistance`; `stat_value` (its Formula 1) | Every kayak behaves as the Rental |
| Scene Flow & Loading (Vertical Slice, not designed) | Soft | Plays the push-off and climb-out; calls `place` on a load or arrival | At MVP, Boarding and Disembarking are an instant fade and placement |
| Multiplayer (Alpha, not designed) | Soft | `apply_push(impulse_mps, source)`; when a guest is placed | Solo: nothing is pushed and nothing tips |

**Downstream (other systems depend on this):**

| System | Hard / Soft | What it relies on |
|---|---|---|
| Interaction (E) (MVP, not designed) | Hard | `aim_ray`, the current state, `at_berth` |
| Casting & Tangle (MVP, not designed) | Hard | `aim_ray`; the named paddle hold (rule 13) |
| Multiplayer (Alpha, not designed) | Hard | The player state (rule 21); the push and capsize rules (rules 18 to 20) |
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`, Approved) | Soft | `place` for the bed (its rule 9; also the blackout) |
| Save/Load (Repack) (`design/gdd/save-load.md`) | Soft | `place` for the shack on a load (its rule 7); this system saves nothing |
| Retro Rendering (`design/gdd/retro-rendering.md`, Approved) | Soft | The camera transform and the vertical field of view; `sway_scale` |
| Audio (Vertical Slice, not designed) | Soft | State, speed and capsize events |

**Not a dependency:** Bite Timing, Reel-in Needle, Shade Sweet Spots and Chill Meter & Smoking read nothing from this system. Shade is a place on the water; the player finds it by paddling, and Bite Timing asks Shade whether the bobber is in it, not where the player is. Hunger, Munchies & Drunk reaches this system only through Day, Night & Sleep's wake-in-bed routine. Nothing in this GDD lets Chill or Drunk change movement (Open Questions).

**Bidirectional check:**
- **Already listed correctly:** Settings & Input (hard downstream), Gear & Item Database (soft), Day, Night & Sleep (soft) and Retro Rendering (soft; it asked for this system to list it) all name this system.
- **Updated 2026-11-17 with the owner's approval:** Save/Load now lists Player Controller as a soft dependent (the load places the player and saves no position). Systems index row 1 now adds Scene Flow & Loading (soft) and Multiplayer (soft, `apply_push`). Gear & Item Database's kayak ladder now holds the step values decided here, and its Open Question 3 is closed.
- **Not designed yet:** Interaction (E), Casting & Tangle, Scene Flow & Loading, Multiplayer and Audio must each list this system when they are written.

## Visual/Audio Requirements

*Specialist lens: `art-director` not consulted. Lean mode, and this is a Core system whose view the player looks through rather than reads. Review manually before production.*

**In view**
- **In the kayak** the player sees the bow and the rod, as in the sketch, plus a chunky two-blade paddle that dips on alternating sides while there is thrust. Its stroke rate follows `target_speed`, and it is still while coasting or held. One shape, one memorable feature (art bible Principle 1).
- **Nothing in the kayak covers the water a cast can reach** (Principle 3, Read the Water First). At pitch 0 no part of the bow, rod or paddle is drawn higher than 15° below the centre of the view. The shortest cast lands 5 m out (the sketch's `cast_min`, Casting & Tangle's to confirm), which is 13° down from a 1.15 m eye, so the water from there outward is never covered.
- **On foot no body is drawn**: no hands, arms or feet. Other players see a body; that is Multiplayer and art bible Section 5 (deferred). Other kayaks follow the art bible's silhouette: a long lozenge hull, an upright torso and one diagonal rod line.
- **Capsize**: the view tips toward the water and dips below the waterline into flat pond colour for most of `capsize_duration_s`, then rises as the kayak rights. No flash, no red, nothing that reads as a failure (Pillar 2).
- **Sway and vertex wobble**: paddling makes the PS1 vertex shimmer show (Retro Rendering's edge case). That is the intended look; this system adds nothing on top.

**Events this system exposes for Audio** (Audio owns the sounds):
| Event | When | Carries |
|---|---|---|
| `footstep` | Every 0.7 m walked | The floor's surface (dock wood, shack floor, porch) |
| `paddle_stroke` | Each visible stroke | Side, `target_speed` |
| `hull_contact` | Formula 5 removes speed | The speed removed (a soft thunk, louder for more) |
| `bumped` | A push that does not capsize | Push size |
| `capsized`, `righted` | Start and end of a capsize | — |
| `boarded`, `got_out` | End of Boarding and Disembarking | — |

📌 **Asset Spec**: Visual/Audio requirements are defined. After the art bible is approved, run `/asset-spec system:player-controller` for the bow, paddle and capsize views.

## Game Feel

**The target is the sketch the owner played and said "felt great".** Formula 4 reproduces its kayak exactly: about 0.9 s to two-thirds speed, about 4 m of coast, and a quick 1 m stop when a line goes out. The kayak should feel like it has weight but never wander. The one deliberate change from the sketch is free look with A/D turning (owner decision 2026-11-17), so that is what the first playtest checks.

**Response budgets**
- **Look**: applied on the same rendered frame as the input, with no smoothing (Formula 2). Nothing in this system adds a frame.
- **Move**: responds on the next physics step (16.7 ms at 60 Hz). Walking reaches two-thirds speed in 0.1 s and stops in 0.25 m, so walking up to the fridge or the Tackle Box never overshoots.
- **No snap anywhere**: no state change moves the camera without a fade, except a capsize, which is a dip, not a cut.

**Comfort**: no head bob on foot; kayak roll capped at 3.5°; one `sway_scale` for the deferred camera-bob slider; the vertical field of view runs from 60° to 100°.

**Playtest questions** (first Godot playtest, with the owner)
1. Does free look with A/D turning feel as good as the sketch's "the kayak points where you look"?
2. With W and A held, is turning while paddling at 0.7 of each too sluggish?
3. Is 90°/s the right kayak turn rate, and is ±90° of head turn enough to scan the shade?
4. Is 2.5 m/s walking pleasant on the trips between shack and dock, or a chore by day 3?
5. Is the 3.1° roll comfortable over a 30-minute session?

## UI Requirements

None of its own. The "Kayak" and "Get out" prompts belong to Interaction (E), which reads `at_berth` and the current state. Any aiming mark or capsize banner belongs to HUD & Catch Banner, which can read `aim_ray`. The field of view row belongs to Settings & Input. This system draws no UI, so it carries no UX flag.

## Cross-References

| Document | Section | What this GDD uses |
|---|---|---|
| Settings & Input (`design/gdd/settings-input.md`) | Rules 1, 6, 7, 8, 17; States and Transitions; Formulas 1 to 3; Open Question 2 | `move`, `look`, the contexts, held-action cancelling, the field of view row, `game_time_paused`; the deferred camera-bob slider (`sway_scale`) |
| Gear & Item Database (`design/gdd/gear-item-database.md`) | Stat keys; Formula 1 (`stat_value`); the kayak ladder; Open Question 3 | `paddle_speed`, `tip_resistance`; the step values decided here (Sit-on-Top +0.75 / +1.5, Pedal +1.5 / +3.0) |
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`) | Rules 6 and 9; Interactions | The drift-off cancels input; wake in bed places the player and returns the kayak |
| Save/Load (Repack) (`design/gdd/save-load.md`) | Rule 7 | Position is never saved; a load places the player in the pond's shack |
| Retro Rendering (`design/gdd/retro-rendering.md`) | Interactions; Edge Cases (camera bob); Formula 4 (`cast_max_m`) | This system owns the camera and field of view; sway shows vertex wobble; casting range is why the field of view is vertical |
| Game brief (`design/game-brief.md`) | Controls; Home; The Pond | WASD to walk and paddle; E to get in and out at the dock; casting "straight ahead where you look"; the push-off cutscene; kayak bump and tip in co-op |
| Art bible (`design/art/art-bible.md`) | Principles 1 and 3; Section 3 (other kayaks) | One chunky paddle; nothing covers the water a cast can reach; the other-kayak silhouette |
| Browser sketch (`prototypes/catch-n-burn/config.js`, `index.html`) | Paddling and Look | `paddle_accel` 5, `paddle_max` 4.5, `paddle_drag` 1.1, reverse 0.6, the ×4 slowing with a line out, pitch −0.7 to +0.5 rad, eye height 1.15 m, the 72° field of view, the sway |

## Acceptance Criteria

Physics runs at the project's default 60 Hz. Numbers are checked to ±2% unless stated. Type tags follow the testing standards: **Logic** needs an automated unit test in `tests/unit/player_controller/`, **Integration** an integration test or documented playtest, **Visual** a retained screenshot in `production/qa/evidence/`. *Specialist lens: `qa-lead` applied (coverage, boundaries, cross-system, story type); its gaps are listed after the criteria.*

**Walking (rules 2, 7, 8; Formula 1)**

- **AC-1** (Logic, Formula 1) — **GIVEN** a player on foot at rest with defaults, **WHEN** `move` is (0, 1) for 0.1 s, **THEN** speed is 1.58 m/s; **WHEN** held for 0.3 s, **THEN** 2.38 m/s; **WHEN** held for 2 s, **THEN** 2.50 m/s and never more.
- **AC-2** (Logic, Formula 1) — **GIVEN** a player walking at 2.5 m/s, **WHEN** `move` becomes zero, **THEN** the body travels 0.25 m (±0.02) more and its speed is exactly 0 within 0.6 s.
- **AC-3** (Logic, rule 7) — **GIVEN** a player on foot, **WHEN** `move` is (1, 0), then (0, −1), then (0.707, 0.707), **THEN** each settles at 2.5 m/s, sideways, backward and diagonal respectively, relative to the body's facing; **WHEN** `move` is (0, 0.5), **THEN** it settles at 1.25 m/s.
- **AC-4** (Integration, rule 8) — **GIVEN** a player on foot on the dock, **WHEN** every Gameplay action in Settings & Input rule 1 is pressed and held in turn, **THEN** the body's height never changes and no state other than On foot is entered except by `interact` on the kayak.
- **AC-5** (Integration, rule 2) — **GIVEN** a player walking at 2.5 m/s, **WHEN** the phone opens, **THEN** the body stops within 0.27 m, the camera does not move while the mouse moves, and **WHEN** the phone closes with W still held, **THEN** walking resumes from that frame.

**Look and camera (rules 3 to 6, 11; Formula 2)**

- **AC-6** (Logic, Formula 2) — **GIVEN** a player on foot at pitch 0, **WHEN** the look input asks for 100° down, **THEN** pitch is −80°; **WHEN** the next frame asks for 5° up, **THEN** pitch is −75° at once (the excess was discarded). The same test in the kayak stops at −40° and +30°.
- **AC-7** (Logic, rule 11, Formula 2) — **GIVEN** a kayak with `head_yaw` 70°, **WHEN** look asks for +35°, **THEN** `head_yaw` is 90° and the kayak's heading has not changed; **WHEN** `move.x` is −1 for 1 s, **THEN** heading has turned 90° left and the camera's yaw turned with it, `head_yaw` still 90°.
- **AC-8** (Logic, rule 3) — **GIVEN** defaults, **WHEN** on foot on level floor, **THEN** the camera is 1.60 m (±0.01) above the floor; **WHEN** in the kayak at rest with `sway_scale` 0, **THEN** it is 1.15 m (±0.01) above the water.
- **AC-9** (Visual, rule 4) — **GIVEN** the Field of view setting at 90°, **WHEN** screenshots are captured at 16:9 and 21:9, **THEN** the same object at the same distance spans the same number of internal lines in both, and the camera reports a vertical field of view of 90°. **WHEN** the setting is changed with Settings open, **THEN** the next rendered frame uses the new value.
- **AC-10** (Logic, rule 6) — **GIVEN** a kayak at 4.5 m/s with sway on, **WHEN** `aim_ray` is sampled over 4 s, **THEN** its origin height stays at 1.15 m (±0.001) and its roll is 0 every frame, while the rendered camera's roll varies.
- **AC-11** (Integration, edge case) — **GIVEN** the window loses focus and the mouse is moved 2,000 counts while it is unfocused, **WHEN** the window regains focus and Gameplay resumes, **THEN** the view has not changed.

**Paddling (rules 10, 13, 14; Formulas 3 to 5)**

- **AC-12** (Logic, Formula 4) — **GIVEN** a Rental at rest, **WHEN** `move.y` is 1 for 1 s, **THEN** speed is 3.00 m/s; after 3 s, 4.33 m/s; it never exceeds 4.50 m/s. **WHEN** `move.y` is −1 long enough to settle, **THEN** it settles at 2.70 m/s backward.
- **AC-13** (Logic, Formula 4) — **GIVEN** a Rental at 4.5 m/s, **WHEN** `move` becomes zero, **THEN** it travels 4.09 m (±0.05) and stops exactly; **WHEN** instead a paddle hold is raised, **THEN** it travels 1.02 m (±0.05) and its speed is 0.50 m/s after 0.5 s.
- **AC-14** (Logic, Formula 4, Gear) — **GIVEN** the Sit-on-Top, then the Pedal, is equipped, **WHEN** `move.y` is 1 until speed settles, **THEN** it settles at 5.25 m/s, then 6.00 m/s. **GIVEN** a kayak with no `paddle_speed` entry, **THEN** 4.50 m/s.
- **AC-15** (Logic, Formula 3) — **GIVEN** a kayak at rest, **WHEN** `move.x` is −1 for 2 s, **THEN** the heading has turned 180° left and the position has not changed; **WHEN** `move` is (−0.707, 0.707), **THEN** the heading turns at 63.6°/s.
- **AC-16** (Logic, rule 13) — **GIVEN** Casting & Tangle and the capsize each hold the paddle, **WHEN** Casting & Tangle releases its hold, **THEN** thrust is still ignored; **WHEN** the capsize ends, **THEN** all holds are cleared and `move.y` 1 paddles. While any hold is up, `move.x` still turns the kayak and `look` still turns the view.
- **AC-17** (Logic, Formula 5) — **GIVEN** a kayak at 4.5 m/s, **WHEN** it meets the bank at 45°, **THEN** its speed after contact is 3.18 m/s along the bank; **WHEN** head-on, **THEN** 0, with no velocity away from the bank (no bounce).
- **AC-18** (Integration, edge case) — **GIVEN** a kayak paddled into the tightest corner of Lil' Puffin' Pond's bank and dock, **WHEN** `move.x` is held either way for 2 s, then `move.y` −1 for 3 s, **THEN** the kayak is free of every contact.
- **AC-19** (Logic, edge case) — **GIVEN** the frame cap at 30, 60 and Unlimited, **WHEN** the AC-12 and AC-13 runs are repeated, **THEN** the distances match within 1%.

**Getting in, out and placed (rules 15 to 17; Formula 8)**

- **AC-20** (Integration, rule 15) — **GIVEN** a player on foot facing the kayak at the dock, **WHEN** `interact` is pressed, **THEN** the state goes Boarding then Kayak, and the kayak is at `launch_point` facing the launch heading with `head_yaw` 0 and speed 0. (At MVP, before Scene Flow exists, Boarding is a fade of under 1 s.)
- **AC-21** (Logic, Formula 8) — **GIVEN** a Rental coasting from 4.5 m/s with the paddle released 5.7 m from its berth, **WHEN** it reaches 3.0 m out, **THEN** `at_berth` turns true; **WHEN** it then drifts to 3.5 m out at 1.0 m/s, **THEN** it stays true; at 3.8 m out, **THEN** false. A kayak at 2.0 m out moving at 2.0 m/s reads false.
- **AC-22** (Integration, rule 16) — **GIVEN** `at_berth` is true, **WHEN** `interact` is pressed, **THEN** the state goes Disembarking then On foot at `disembark_point`, and the kayak is at its berth.
- **AC-23** (Logic, rule 17) — **GIVEN** a capsized kayak at 3 m/s with two holds up and `head_yaw` 60°, **WHEN** `place(bed)` is called, **THEN** the player is On foot at the bed's point and facing, speed 0, pitch 0, `head_yaw` 0, no hold, no capsize, and the kayak is at its berth.
- **AC-24** (Integration, Day, Night & Sleep rule 9) — **GIVEN** a player paddling at 23:59, **WHEN** midnight arrives and the overnight runs, **THEN** they wake On foot in the shack bed and the kayak is at the dock. The same holds when the clock reaches midnight during Boarding.
- **AC-25** (Integration, Save/Load rule 7) — **GIVEN** a Turn & Burn save made while paddling, **WHEN** it is loaded, **THEN** the player stands On foot at the pond's shack point and the kayak is at its berth.

**Pushes and capsize (rules 18 to 20; Formula 6)**

- **AC-26** (Logic, Formula 6) — **GIVEN** a Rental at rest, **WHEN** `apply_push` is 4.5 m/s, **THEN** no capsize and its speed becomes 4.0 m/s (the cap); **WHEN** 5.0 m/s, **THEN** no capsize; **WHEN** 5.01 m/s, **THEN** it capsizes. With the Sit-on-Top the threshold is 6.5 m/s; with the Pedal, 8.0 m/s.
- **AC-27** (Logic, rule 20) — **GIVEN** a capsize begins, **WHEN** 3.0 s pass, **THEN** the player is back in Kayak at the same position and heading with speed 0, and the stringer, Cooler, strains and gear are unchanged item for item; **WHEN** a 20 m/s push arrives 3.9 s after righting, **THEN** no capsize (the nudge applies, capped at 4.0 m/s); at 4.1 s, **THEN** it capsizes.
- **AC-28** (Logic, edge cases) — **GIVEN** a Rental at rest, **WHEN** pushes of 3 m/s east and 3 m/s north arrive in the same step, **THEN** the tip test sees 4.24 m/s (no capsize); **WHEN** two pushes of 3 m/s east arrive together, **THEN** it sees 6 m/s and capsizes. Pushes during a capsize, on foot, boarding or disembarking change nothing.
- **AC-29** (Integration, rule 18) — **GIVEN** a solo game, **WHEN** a full day is played with the kayak rammed into every bank, post and rock, **THEN** no capsize ever happens.

**Visual (Formula 7)**

- **AC-30** (Visual, Formula 7) — **GIVEN** a Rental at a steady 4.5 m/s, **WHEN** 4 s of frames are captured, **THEN** the camera roll peaks at 3.1° (±0.1) every 2.0 s and the bob at 3 cm; **GIVEN** the Pedal at 6.0 m/s, **THEN** the roll peaks at 3.5°; **GIVEN** `sway_scale` 0, **THEN** roll and bob are 0. On foot, roll and bob are always 0.

**Scenes and safety (rule 9; edge cases)**

- **AC-31** (Integration, rule 9) — **GIVEN** the home scene, **WHEN** a scripted walker holds `move` into every edge of the shack, porch, path and dock for 10 s each, **THEN** the body never enters the water or leaves the walkable area, and every walkable route has no step over 0.3 m and no slope over 40°.
- **AC-32** (Integration, edge case) — **GIVEN** a player wedged so the body cannot move, **WHEN** `move` is held for 2.0 s, **THEN** they are placed at the shack door's point.
- **AC-33** (Integration, edge case) — **GIVEN** two players on foot in co-op, **WHEN** one walks into the other in the shack doorway, **THEN** they pass through each other.
- **AC-34** (Logic, performance) — **GIVEN** four players' controllers running on the host, **WHEN** profiled on the Steam Deck for 60 s of paddling, **THEN** this system's work averages under 0.2 ms per physics step (starting budget, to confirm in the first Godot profile).

**Gaps found by the `qa-lead` lens**
- Rule 21 (the co-op player state) has no criterion that can run before Multiplayer exists; AC-28 and AC-33 test the rules locally. Multiplayer's GDD must add the replicated version.
- Rule 13's real trigger is Casting & Tangle, which is not designed; AC-16 raises holds directly until it is.
- "Calm and predictable, never in the way" (Overview) is not testable. It goes to the playtest questions in Game Feel and Open Questions, not here.
- AC-31 needs a scene-check script, which `/test-setup` or the first Godot story must provide.

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **Free look or look-steers.** The owner chose free look with A/D turning (2026-11-17) over the sketch's model. Playtest questions 1 and 3 in Game Feel decide whether it stays. | Owner | First Godot playtest |
| 2 | **Recentring.** Should `head_yaw` drift back toward the bow while paddling forward? It never recentres now (rule 11). | Owner | First Godot playtest |
| 3 | **Diagonal keys in the kayak.** W with A gives 0.7 of each (Settings & Input Formula 1). Keep it, or let the kayak read its two keyboard axes unnormalised? The second option is a change to Settings & Input. | Owner, with Settings & Input | First Godot playtest |
| 4 | **The field of view is vertical** (rule 4). At 16:9 the Settings range of 60–100° is about 92–130° horizontal (the 75° default is about 108°), and players often expect horizontal numbers. Should the Settings row say "vertical", or change its range? | Owner, with Settings & Input | Before the Settings screen is built |
| 5 | **How the kayak is built.** A kinematic body on a flat water plane (what the formulas assume) or a physics body in Jolt; and whether to use the engine's 3D physics interpolation, which was rebuilt in 4.5 and is not in `docs/engine-reference/godot/`, so the camera is smooth on displays above 60 Hz. NOT SOURCEABLE from the engine reference. | Technical director (`/architecture-decision`) | Before the first Player Controller story |
| 6 | **Pushes and capsizes in co-op.** How an impulse is computed from a collision, a deliberate "tip a friend" action, and what a capsize looks like to others. Formula 6's numbers are provisional until then. | Multiplayer GDD | Multiplayer design (Alpha) |
| 7 | **Do Drunk or YAK LOCKED change movement?** This GDD gives neither a hook. If either wants one, it adds a named modifier here. | Hunger, Munchies & Drunk; Chill Meter & Smoking GDDs | When those GDDs are written |
| 8 | **Four berths per dock and a guest join point** (Edge Cases). Every dock needs four berth markers and a join point; no GDD places a joining guest yet. | Level design; Multiplayer | Before the Vertical Slice dock is built |
| 9 | **Is `sway_scale` exposed?** Settings & Input deferred a camera-bob slider (its Open Question 2). The hook exists here. | Owner, with Settings & Input | After the first playtest's comfort answer (Game Feel question 5) |
