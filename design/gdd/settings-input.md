# Settings & Input

> **Status**: In Review (first `/design-review` 2026-11-16: NEEDS REVISION, 2 blockers, both fixed; second `/design-review` 2026-11-16: NEEDS REVISION, 1 blocker (menu navigation from a stick), fixed the same day; third `/design-review` 2026-11-16: NEEDS REVISION, 3 blockers (back and close, rebinding operations, Toggle-cancel ownership), fixed the same day; fourth `/design-review` 2026-11-17: NEEDS REVISION, 2 blockers (rebinding rows for `move`, `look` and `menu`; forced exits), fixed the same day; fifth `/design-review` 2026-11-17: NEEDS REVISION, 1 blocker (an unconfirmed display mode could be saved), fixed the same day; re-review pending)
> **Creative Director Review (CD-GDD-ALIGN)**: skipped — Lean mode
> **Author**: owner + Claude (design-system, lean review)
> **Last Updated**: 2026-11-17
> **Last Verified**: 2026-11-17
> **Implements Pillar**: Pillar 2 (Chill First, Never Punishing); Pillar 5 (Better With Friends, Whole Alone)

## Summary

Settings & Input turns keys, mouse and gamepad into 13 named actions (one `fish` action covers cast, hook-set, needle and tangle), lets the player rebind every action except `menu`, `look` and the gamepad's `move` stick (which only Swap sticks changes), and owns the four-tab Settings screen (Audio, Graphics, Controls, Accessibility) with its per-machine settings file. It makes the gamepad and Steam Deck a mapping from the MVP onward, pauses only in solo, and carries the MVP accessibility options: toggle cast charge, hold-to-free tangles, subtitles and UI scale. Read it for any system that reads input, shows a button prompt, or applies a player setting.

> **Quick reference** — Layer: `Core` · Priority: `MVP` · Key deps: `None` (soft: Multiplayer, Scene Flow & Loading)

## Overview

Settings & Input is the layer between the player's hands and every other system. It defines the game's named input actions (move, look, fish, interact, smoke, phone, menu and the rest) with default bindings for keyboard and mouse and for gamepad. The player can rebind every action except `menu`, `look` and the gamepad's `move` stick, which only Swap sticks changes (rule 10). It also owns the menus the brief names (Audio, Graphics, Controls) and the accessibility options, and it remembers every choice on this machine, apart from any save. No gameplay system ever reads a raw key or button. Each one asks whether an action was pressed, is held or was released, so the Steam Deck is a mapping, not a rewrite. Players touch this system directly only when they open Settings. The rest of the time they feel it as controls that respond the way they expect on whatever they are holding, and as a game that remembers how loud, how bright and how sensitive they like it. Without it, every system would hard-code keys, gamepad support would be a retrofit across a dozen systems, and Pillar 2's "never punishing" would fail for any player who cannot mash, hold or see what the defaults assume.

## Detailed Design

### Core Rules

#### Actions

1. **Every input the game reads is a named action.** No system outside Settings & Input reads a key, mouse button, stick or pad button directly. Each asks whether an action was just pressed, is held, or was just released, or (for an axis) what its value is now. The MVP actions are:

   | Action | Kind | What it does | Keyboard & mouse | Gamepad |
   |---|---|---|---|---|
   | `move` | 2D axis | Walk on foot; paddle the kayak | W A S D | Left stick |
   | `look` | 2D axis | First-person look | Mouse motion | Right stick |
   | `fish` | Button (press and hold) | Hold to charge a cast, release to cast; press to set the hook; press to stop the needle; repeated presses free a tangle | Space | Right trigger |
   | `interact` | Button | Use the prompted object (bed, fridge, Tackle Box, kayak, getting out at the dock) | E | A (bottom face) |
   | `smoke` | Button | Smoke the equipped smoking item | F | Y (top face) |
   | `phone` | Button | Open or close the Flip Phone | Tab | View |
   | `menu` | Button | In play, open the Flip Phone on its Menu page; in the phone, Settings and the main menu, back one level, then close (rule 19) | Esc | Menu |
   | `ui_up` / `ui_down` / `ui_left` / `ui_right` | Button | Move the highlight in the phone and menus | Arrow keys | D-pad and left stick |
   | `ui_accept` | Button | Choose the highlighted item | Enter (left click on an item is pointer input, rule 3) | A |
   | `ui_cancel` | Button | Back one level, then close, as `menu` does (rule 19) | Backspace, right click | B |

   **`fish` is one action** (owner decision 2026-11-16). The fishing systems decide what a press means in their state, so a rebind moves the cast, the hook-set, the needle and the tangle together, as Space does in the brief.

   **Menu navigation from a stick, and held directions** (owner decision 2026-11-16, second design review). A stick presses a `ui_*` direction only past `ui_stick_press`, on its stronger axis, one direction at a time, so drift and diagonals never move the highlight twice. A held `ui_up` / `ui_down` / `ui_left` / `ui_right` repeats at the same rate from a key, the D-pad or a stick (Formula 4). `ui_accept` and `ui_cancel` never repeat.

2. **Adding an action.** Another GDD that needs a new input (for example `emote` and `push_to_talk` for Multiplayer at Alpha) adds a row to the table in rule 1, with defaults for both device families, in the same change. An action outside this table does not exist.

3. **Bindings.** Each action has up to two bindings, primary and secondary, in each of two device families: keyboard & mouse, and gamepad. Where rule 1 lists one default for a family, it is the primary and the secondary starts empty. Where it lists two (for example Backspace and right click for `ui_cancel`), the first is the primary and the second is the secondary. These defaults replace the engine's built-in `ui_*` bindings (Godot binds Space to `ui_accept` by default); no engine default survives into the input map. Left click on a menu item is the GUI's own pointer handling, not a binding of `ui_accept`, so a click away from any item does nothing; it is not rebindable. The Steam Deck is a gamepad; its trackpads drive the mouse cursor as the operating system provides.

4. **Both families are live at once.** An action is *pressed* when any of its bindings goes down, *held* while any of them is down, and *released* when the last one comes up. An axis takes the stronger of its keyboard and stick inputs (Formula 1).

5. **Active device.** The active family is the one that produced the most recent input past the switch threshold (Formula 4). It decides which glyphs prompts show (E or A), whether the mouse cursor shows in menus, and which bindings the Weather Report lists. Switching never changes what an action does.

#### Input contexts

6. **Exactly one input context is active at a time**, and it decides which actions reach gameplay (States and Transitions). Input for an action that is not live in the current context is dropped, never queued.

7. **Leaving a context cancels holds.** Any action held when its context ends sends a *cancelled* signal, not a *released* one. A cast being charged when the phone opens is cancelled, not thrown. In Toggle mode (rule 9) a charge started by a press counts as a hold for this rule, but no key is down, so this system cannot see it. Instead, on every context exit while Cast charge is Toggle, this system sends `fish` *cancelled* whether or not `fish` is held, and Casting & Tangle ignores it when no charge is under way (third design review). The same goes for the other two events that cancel holds, a loss of window focus and a gamepad disconnect (Edge Cases): while Cast charge is Toggle, each also sends `fish` *cancelled* whether or not `fish` is held (fourth design review).

#### Settings

8. **The Settings screen has four tabs**: the brief's Audio, Graphics and Controls, plus Accessibility. Each change takes effect at once, so the player hears the new volume or feels the new sensitivity while still on the screen. Display mode and window size changes revert after 10 seconds unless the player confirms them (Display confirmation, below the table).

   | Tab | Setting | Values | Default | Who applies it |
   |---|---|---|---|---|
   | Audio | Master | 0–100 | 100 | Audio |
   | Audio | Ambient | 0–100 | 80 | Audio |
   | Audio | Sound effects | 0–100 | 80 | Audio |
   | Audio | Voice (banner lines) | 0–100 | 90 | Audio |
   | Audio | Phone & UI | 0–100 | 70 | Audio |
   | Audio | Mute when the window loses focus | On / Off | On | Audio |
   | Graphics | Display mode | Windowed / Borderless fullscreen / Fullscreen | Borderless fullscreen | This system |
   | Graphics | Window size | the display's sizes | the display's size | This system |
   | Graphics | VSync | On / Off | On | This system |
   | Graphics | Frame cap | 30 / 60 / Unlimited | 60 | This system |
   | Graphics | Field of view | 60–100° | 75° | Player Controller |
   | Graphics | Brightness | 0.8–1.2 | 1.0 | Retro Rendering |
   | Graphics | Vertex wobble | On / Off | On | Retro Rendering |
   | Graphics | CRT filter | On / Off | Off | Retro Rendering |
   | Controls | Mouse sensitivity | 0.1–3.0 | 1.0 | This system (Formula 2) |
   | Controls | Invert mouse Y | On / Off | Off | This system |
   | Controls | Stick look sensitivity | 0.1–3.0 | 1.0 | This system (Formula 3) |
   | Controls | Invert stick Y | On / Off | Off | This system |
   | Controls | Stick deadzone | 0.05–0.40 | 0.15 | This system (Formula 1) |
   | Controls | Swap sticks | On / Off | Off | This system |
   | Controls | Vibration | On / Off | On | Each system that rumbles |
   | Controls | Rebind controls | opens the rebinding list | — | This system |
   | Accessibility | Cast charge | Hold / Toggle | Hold | Casting & Tangle |
   | Accessibility | Tangle | Mash / Hold | Mash | Casting & Tangle |
   | Accessibility | Subtitles | On / Off | On | HUD & Catch Banner |
   | Accessibility | Subtitle size | Small / Medium / Large | Medium | HUD & Catch Banner |
   | Accessibility | UI scale | 80–150% | 100% (125% on a Steam Deck's first run) | HUD, Flip Phone, menus (Formula 5) |

   The internal render resolution is not a setting: the art bible fixes it, and Retro Rendering owns it. The colourblind backups in the art bible are always on, so they are not settings either.

   **Display confirmation** (owner decision 2026-11-17, fifth design review). A change to Display mode or Window size is applied at once and starts a countdown dialog, "Keep these settings? Reverting in 10…", with **Keep** and **Revert**.
   - The dialog is modal and part of the Settings context. Its live actions are `ui_*` and `menu`. The highlight starts on Revert, so only a deliberate choice of Keep confirms. `menu` and `ui_cancel` choose Revert.
   - The 10 seconds run on real time, not game time, so the solo pause, a loss of window focus and a gamepad disconnect never stop or extend it. If the screen is unreadable, nothing needs to be seen or pressed: it reverts on its own.
   - **Only a confirmed display mode or window size is ever written to the settings file.** Until Keep is chosen, the file holds the last confirmed values. Every other way out of the countdown reverts first: leaving Settings by choice, a quit request, and a forced exit (rule 20 step 1). A crash during the countdown also leaves the confirmed values in the file.
   - A second display change during a countdown replaces the pending change and restarts the countdown. The revert target stays the last confirmed value, not the replaced one.

9. **Accessibility modes (owner decision 2026-11-16: these two and subtitles and UI scale at MVP).** This system stores the modes; Casting & Tangle carries them out.
   - **Cast charge: Toggle.** The first `fish` press starts the charge and the next press releases the cast. Nothing else about the cast changes.
   - **Tangle: Hold.** Every real `fish` press still counts as one press, and holding `fish` adds presses at `assist_mash_rate` (Formula 6), so Hold is never slower than Mash mode for the same presses (owner decision 2026-11-16, design review). A player who only holds can be slower than a keen masher (Formula 6). This system owns Formula 6 and `assist_mash_rate`; Casting & Tangle owns the tangle, the hold timer, the running count and how many presses a tangle needs.

#### Rebinding

10. **Rebinding rows** (owner decision 2026-11-17, fourth design review). The rebinding list shows the rows for the family being edited, and every slot in a row is one of the two bindings of rule 3.
    - Every action in rule 1 has one row with a primary and a secondary slot, except the three below.
    - **`move`** has no row on gamepad: its stick can only be traded with `look`'s (Swap sticks). On keyboard & mouse it has four rows, Up, Down, Left and Right (W, S, A, D by default), each with its own primary and secondary slot. For rules 13 and 16, each of the four counts as an action of its own.
    - **`look`** cannot be rebound. Its row, in both families, shows its input ("Mouse motion", "Right stick") as read-only, with no capture and no Clear. On gamepad the only change is Swap sticks.
    - **`menu`** stays on Esc and the gamepad's Menu button so no player can lock themselves out of the menus. Its row shows those inputs, with no capture and no Clear.

11. **Capturing a binding.** The rebinding list waits for the next input from the family being edited. It accepts keys, mouse buttons, pad buttons and triggers. It refuses mouse motion, stick directions, the Steam and Guide buttons, the Windows, Super and Command keys, and Print Screen. A shortcut the operating system handles itself (Alt+Tab, Alt+F4, Command+Q) never reaches the game, so it cannot be captured either (owner decision 2026-11-17, fifth design review). A binding is one input, never a combination: Shift, Ctrl and Alt can be bound on their own, and a combination such as Ctrl+E binds the first accepted input that goes down (Ctrl), because capture binds on the first input and then ends. `menu` cancels the capture, and only `menu` does: `ui_cancel`'s inputs (Backspace, right click, B) are ordinary inputs to capture. The input that opened capture (a click, Enter or A on the slot) and any input still held when capture starts are ignored until released, so choosing a slot never binds that choice. The prompt names the family's own cancel input: "Press a key, or Esc to cancel" for keyboard & mouse, "Press a button, or Menu to cancel" for gamepad.

12. **Conflicts.** If the new input is already bound to another action that is live in a context the two actions share, the screen says "Also used by [action]" and offers **Swap** or **Cancel**. Swap exchanges the two slots: the other action's slot that held the input takes whatever the edited slot held, which may be nothing. Actions that never share a context may share an input: W can move and also move a highlight in the phone.

13. **Clearing, and no action left unbound.** Every binding slot has a **Clear** command, except those of `menu` and `look` (rule 10). Clearing a slot, or a Swap started from an empty slot, can leave an action with no binding in the family being edited. The player cannot leave the rebinding list (back, `menu`, or another tab) while an action from rule 1 has no binding in that family (for `move` on keyboard & mouse, while any of its four directions has none). The screen names the action (for `move`, the direction, for example "Move: Left") and offers to restore its default. A forced exit is the one way out that skips this refusal (rule 20). The left stick's `ui_*` directions (the gamepad secondaries of the four `ui_*` actions) can be cleared and restored the same way, but are never captured as another input.

14. **Reset.** "Reset to defaults" is per family and asks for confirmation.

#### Persistence

15. **Settings belong to the machine, not the save.** All settings and bindings live in one settings file in the user's data folder, separate from every save slot. They never travel with a save, and in co-op each player keeps their own. The file is written when the Settings screen closes (a forced exit, rule 20, included), and again when the game gets a quit request (window close, Steam's Exit Game) while Settings is open. A display mode or window size still waiting for confirmation is never written: the file holds the last confirmed one (rule 8). It carries a version number.

16. **Loading the file.** A missing file gives the defaults. A value outside its range is clamped into it, and the rest of the file is kept. A binding to an unknown action is ignored. Then the bindings are checked, per device family, against rules 10, 12 and 13 (owner decision 2026-11-16, third design review): `menu` is forced back to Esc and the Menu button; an action with no binding gets its default (each of `move`'s four keyboard directions counts as an action, rule 10); and when two actions that share a context hold the same input, both are reset to their defaults (the defaults in rule 1 never collide). Every other binding is kept, and the player sees one "Some controls were reset" notice naming the actions. A newer version that adds an action gives it its default through the same check, so a custom binding already on that input is reset along with it. A file that cannot be read is set aside as a backup, and the defaults are used.

#### Pause and entry points

17. **Settings pauses only in solo** (owner decision 2026-11-16). With no other player connected, the Settings screen pauses everything that runs on game time: the clock, bites, the needle, the meters and spoilage. With another player connected it never pauses. The player's character stands idle and the world runs on. The Flip Phone itself never pauses (brief). The same solo pause applies when the gamepad disconnects and when the window loses focus (Edge Cases). This system exposes one `game_time_paused` state and a change signal, which each system that runs on game time reads. It also exposes the current input context (one of the six in States and Transitions) as a readable value with a change signal, because some systems, such as Day, Night & Sleep, stop their clock by context as well (fourth design review). How the pause is carried out (the engine's tree pause, or each system stopping its own clock) is an architecture decision for an ADR, recorded before Casting & Tangle and Bite Timing are built.

18. **Ways in.** From the main menu, the settings icon opens Settings. During play, `menu` opens the Flip Phone on its Menu page (owner decision 2026-11-16), and **Tackle-box — Options** opens Settings. Leaving Settings returns to the phone's Menu page. The phone's **Weather Report** lists the current bindings for the active device.

19. **Back and close** (owner decision 2026-11-16, third design review). In the phone, Settings and the main menu, `menu` and `ui_cancel` do the same thing: each press goes back one level, and at the first page the context opened on, it closes. Closing means: the phone returns to Gameplay; Settings returns to where it was opened from (the phone's Menu page in play, the main menu from the title); on the main menu's own top level neither does anything. A phone opened with `phone` starts on its home screen, so `menu` there closes it. A phone opened with `menu` starts on the Menu page, so the next `menu` closes it. `phone` closes the phone from any depth. Settings' first page is its tab bar, and it always opens with the Audio tab selected. The rebinding list is one level below the Controls tab, and going back out of it is refused while an action is unbound (rule 13). While the display countdown shows (rule 8), `menu` and `ui_cancel` choose Revert and nothing else leaves Settings. In Gameplay `ui_cancel` is not live and does nothing. In Rebind Capture only `menu` cancels (rule 11).

20. **Forced exits** (owner decision 2026-11-17, fourth design review). Some events end the current context without the player choosing: the overnight or a scene load starts Cutscene / Loading (Day, Night & Sleep rule 8; Scene Flow), Turn & Burn sends the game to the main menu, and a quit request arrives. A forced exit overrides the refusal in rule 13 and does the following, in this order:
    1. Any open capture is cancelled and binds nothing, and any display-change countdown is reverted (rule 8).
    2. Rule 7 applies: held actions are cancelled.
    3. If the player was on the rebinding list with an action unbound in the family being edited, each such action is restored to its default for that family.
    4. The Phone or Settings closes. No return to the phone's Menu page happens; the next context is the one the event names.
    5. The settings file is written (rule 15).

    If step 3 restored anything, the "Some controls were reset" notice (rule 16) names those actions and shows the next time Gameplay or the main menu is on screen. A quit request runs Save/Load's save after step 5 (Save/Load rule 5, which can offer Try again or Quit without saving), then ends the game. The overnight in co-op closes every player's Phone and Settings this way, whatever each player was doing.

### States and Transitions

The input contexts. Gameplay systems still decide whether a live action does anything in their own state (for example, Chill Meter refuses `smoke` while Munchies is maxed).

| Context | Live actions | Cursor | Game time |
|---|---|---|---|
| **Main Menu** | `ui_*`, `menu` | Shown on keyboard & mouse | — |
| **Gameplay** | `move`, `look`, `fish`, `interact`, `smoke`, `phone`, `menu` | Captured | Runs |
| **Phone** | `ui_*`, `phone` (close), `menu` (back, then close; rule 19) | Shown on keyboard & mouse | Runs; the character stands idle (owner decision 2026-11-16) |
| **Settings** | `ui_*`, `menu` (back) | Shown on keyboard & mouse | Paused in solo, runs in co-op |
| **Rebind Capture** | raw input from the family being edited; `menu` cancels | Hidden | As Settings |
| **Cutscene / Loading** | only actions Scene Flow registers (for example a skip) | Hidden | Scene Flow decides |

| From | To | Trigger |
|---|---|---|
| Main Menu | Settings | settings icon |
| Main Menu | Cutscene / Loading | New Sesh or Repack |
| Cutscene / Loading | Gameplay | Scene Flow finishes |
| Gameplay | Phone | `phone` (opens on the home screen) or `menu` (opens on the Menu page) |
| Phone | Gameplay | `phone`, or `menu` / `ui_cancel` at the first page the phone opened on (rule 19) |
| Phone | Settings | Menu → Tackle-box — Options |
| Settings | Phone | `menu` or `ui_cancel` at Settings' first page (in play) |
| Settings | Main Menu | `menu` or `ui_cancel` at Settings' first page (from the title) |
| Settings | Rebind Capture | choosing a binding slot |
| Rebind Capture | Settings | an accepted input, or `menu` |
| Gameplay | Cutscene / Loading | Scene Flow starts a cutscene or load (for example the kayak push-off) |
| Phone, Settings or Rebind Capture | Cutscene / Loading | A forced exit (rule 20): the midnight overnight (Day, Night & Sleep), or a Scene Flow load |
| Any | Main Menu | Turn & Burn (save and quit), a forced exit (rule 20) |

Every transition out of a context applies rule 7: held actions are cancelled.

### Interactions with Other Systems

| System | Flows in | Flows out | Owner of the interface |
|---|---|---|---|
| Player Controller | — | `move` and `look` values after deadzone, curve, sensitivity, invert and swap (Formulas 1–3); field of view | This system owns the values; Player Controller owns speed and paddling |
| Casting & Tangle | — | `fish` pressed / held / released / cancelled; Cast charge and Tangle modes; `assist_mash_rate` and the Formula 6 function | Casting & Tangle carries out the modes and keeps the tangle's hold timer and count |
| Bite Timing | — | `fish` pressed (the hook-set) | Bite Timing |
| Reel-in Needle | — | `fish` pressed (stop the needle) | Reel-in Needle |
| Chill Meter & Smoking | — | `smoke` pressed | Chill Meter decides whether it is allowed |
| Interaction (E) | — | `interact` pressed; the active device, for the prompt glyph | Interaction owns the prompts |
| Flip Phone & FishMail | Opens Settings from Menu → Tackle-box | `phone`, `menu`, `ui_*`; the Phone context; current bindings for the Weather Report | The phone owns its screens |
| HUD & Catch Banner | — | Active device (glyphs), Subtitles and size, UI scale | The HUD draws them |
| Main Menu & Intro | Opens Settings from the settings icon | — | Main Menu |
| Retro Rendering | — | Brightness, Vertex wobble, CRT filter | Retro Rendering draws them |
| Audio | — | The five volumes, Mute when unfocused | Audio owns the mix |
| Scene Flow & Loading | Starts and ends the Cutscene / Loading context; registers a skip action if it has one | — | Scene Flow |
| Every system that runs on game time | — | The solo pause while Settings is open (`game_time_paused`); the current input context | Each system stops its own clock |
| Multiplayer (Alpha) | "another player is connected" (turns the pause off); later adds `emote` and `push_to_talk` | — | Multiplayer |
| Save/Load (Repack) | A quit request (its rule 5): the save runs after rule 20 step 5, then the game exits | Nothing: settings are never in a save | Save/Load owns the save; this system owns the forced-exit steps before it |

## Formulas

All `data file` values below live in the input config resource, not in code. Player settings (sensitivity, deadzone, volumes, UI scale) come from the settings file (rule 15) and are clamped to the ranges in rule 8.

### Formula 1: Stick response

The stick_response formula is defined as:

`r = min(|v|, 1)`
`stick_response = 0 if r ≤ dz, else ((r − dz) / (1 − dz)) ^ γ × (v / |v|)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| v | Vector2 | each axis −1 to 1 | calculated (engine stick reading) | The raw stick position |
| r | float | 0–1 | calculated | Stick distance from centre, capped at 1 (some pads report slightly over 1 on diagonals) |
| dz | float | 0.05–0.40 | player setting (Stick deadzone), default 0.15 | Radial deadzone: below it the stick reads as centred |
| γ | float | 1.0–3.0 | data file (`stick_curve_exponent`), default 1.5 | Response curve: 1 is linear; higher gives finer control near the centre |

**Output Range:** a vector of length 0 to 1. It is 0 inside the deadzone, and exactly 1 at full deflection for any dz and γ, because (1 − dz) / (1 − dz) = 1. The rescale means the first movement past the deadzone starts from 0, not from a jump. dz never reaches 1, so there is no division by zero.

**Keyboard on the same axis:** W A S D give a vector with components of −1, 0 or 1, normalised to length 1 so diagonals are not faster. `move` takes whichever of the keyboard vector and stick_response is longer. Swap sticks exchanges which stick feeds `move` and which feeds `look`.

**The only stick deadzone.** Formula 1 is the only deadzone on a stick. The engine's own per-action deadzone on stick axes is set to 0, so the two never stack (if they did, AC-32 would fail). The engine reference does not cover the engine's default yet; check it at implementation. Menu navigation from a stick also reads this formula's output, through the `ui_stick_press` and `ui_stick_release` thresholds in Formula 4, never through the engine's deadzone.

**Example:** dz = 0.15, γ = 1.5, stick pushed halfway (r = 0.5): (0.35 / 0.85) ^ 1.5 = 0.412 ^ 1.5 ≈ **0.26**. At r = 0.9: (0.75 / 0.85) ^ 1.5 ≈ **0.83**.

**Why 0.15 and 1.5:** 0.15 hides the drift of worn pads, Deck sticks included, without a dead feeling. A 1.5 curve gives fine aim when lining up a cast at shade and still turns fully at full tilt. Both are starting points for the gamepad playtest.

### Formula 2: Mouse look

The mouse_look formula is defined as:

`yaw_change_deg = mouse_dx × mouse_sensitivity × mouse_deg_per_count`
`pitch_change_deg = mouse_dy × mouse_sensitivity × mouse_deg_per_count × invert_mouse`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| mouse_dx, mouse_dy | float | any | calculated (engine relative mouse motion) | Mouse movement since the last frame, in counts: unscaled screen pixels, read before any viewport stretch, so sensitivity does not change with window size or UI scale (Godot's `InputEventMouseMotion.screen_relative`, not `relative`; not in the engine reference yet, so check it at implementation) |
| mouse_sensitivity | float | 0.1–3.0 | player setting, default 1.0 | Player multiplier |
| mouse_deg_per_count | float | 0.02–0.20 | data file, default 0.07 | Degrees of turn per unit of mouse motion at sensitivity 1.0 |
| invert_mouse | int | −1 or 1 | player setting (Invert mouse Y), default 1 | −1 flips vertical look |

**Output Range:** proportional to movement, never zero for a moving mouse (sensitivity has a 0.1 floor). Player Controller clamps pitch; this formula never does.

**Example:** at sensitivity 1.0 a full turn takes 360 / 0.07 ≈ 5,140 counts, about 16 cm on an 800-DPI mouse. That is unhurried, to suit a chill game. At 0.1 a full turn takes about 1.6 m of mouse travel; at 3.0, about 5 cm.

### Formula 3: Stick look

The stick_look formula is defined as:

`yaw_change_deg = look.x × stick_sensitivity × stick_deg_per_s × Δt`
`pitch_change_deg = look.y × stick_sensitivity × stick_deg_per_s × Δt × invert_stick`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| look | Vector2 | length 0–1 | calculated (Formula 1 on the look stick) | Processed stick position |
| stick_sensitivity | float | 0.1–3.0 | player setting, default 1.0 | Player multiplier |
| stick_deg_per_s | float | 60–300 | data file, default 150 | Turn speed at full tilt and sensitivity 1.0 |
| Δt | float | 0–0.1 s | calculated (frame time, capped at 0.1 s) | Time since the last frame (1/60 s at the target); the cap stops a hitch from swinging the camera |
| invert_stick | int | −1 or 1 | player setting (Invert stick Y), default 1 | −1 flips vertical look |

**Output Range:** at full tilt, from 15°/s (sensitivity 0.1) to 450°/s (3.0). Multiplying by Δt keeps the turn speed the same at any frame rate.

**Example:** full tilt at 1.0 gives 150°/s, a full turn in 2.4 s, or 2.5° per frame at 60 fps. Half tilt (look length 0.26 after Formula 1) gives about 39°/s, for lining up a cast.

### Formula 4: Active-device switch, trigger press and menu navigation

The device_switch rule is defined as:

`switch_to_keyboard_mouse = any key or mouse button pressed OR |mouse motion in one frame| ≥ mouse_switch_px`
`switch_to_gamepad = any pad button pressed OR trigger ≥ trigger_press OR stick_response length > 0`

The trigger_as_button formula (for `fish` on the right trigger) is defined as:

`pressed when trigger ≥ trigger_press; released when trigger < trigger_release`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| mouse_switch_px | float | 2–20 | data file, default 6 | Mouse motion (in counts, as in Formula 2) needed in one frame to switch to keyboard & mouse; filters a bumped desk |
| trigger | float | 0–1 | calculated (engine trigger reading) | Right trigger travel |
| trigger_press | float | 0.3–0.8 | data file, default 0.5 | Travel at which the trigger counts as pressed |
| trigger_release | float | 0.1–(trigger_press − 0.1) | data file, default 0.3 | Travel below which a held trigger counts as released |

**Output Range:** the active device is one of two families. A drifting stick never switches device, because Formula 1 reads drift inside the deadzone as 0.

**Why the gap between press and release:** a trigger held half-way while charging a cast wobbles. With one threshold, the wobble would release the cast early. With a 0.2 gap, the hold survives a wobble of up to 0.2. The load check refuses a `trigger_release` above `trigger_press − 0.1` (so any value at or above `trigger_press` is refused too).

**Example:** a player charging a cast eases the trigger from 0.7 down to 0.4. The cast keeps charging, because 0.4 is above trigger_release (0.3). Letting go to 0.1 releases the cast.

**Menu navigation** (owner decision 2026-11-16, second design review). The ui_stick_direction rule, for a `ui_*` direction bound to a stick (the left stick by default), is defined as:

`s = stick_response (Formula 1) of that stick`
`a direction is pressed when its component of s ≥ ui_stick_press, its axis is the stronger one (|s.x| against |s.y|; a tie goes to horizontal), and no other stick direction is held`
`a held direction is released when its component of s < ui_stick_release`

The ui_repeat rule, for `ui_up`, `ui_down`, `ui_left` and `ui_right` from any binding (key, D-pad or stick), is defined as:

`while a direction stays held, it is pressed again at ui_repeat_delay after its first press, then every ui_repeat_interval`

The operating system's key-repeat (echo) events are ignored for `ui_*`, so a held arrow key, D-pad and stick all repeat at the same rate. `ui_accept` and `ui_cancel` never repeat.

**Order within a frame:** releases are applied before presses, so a thumb rolling from right to down releases `ui_right` and can press `ui_down` in the same frame. Each direction keeps its own repeat timer, and a new press starts its own delay. Godot's Control focus navigation does its own handling of held `ui_*` inputs, and the engine reference does not cover it. At implementation, check that all `ui_*` movement goes through this rule (for example by consuming the engine's echo events) and that two steps are never taken for one press.

| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| s | Vector2 | length 0–1 | calculated (Formula 1) | The processed stick position; drift inside the deadzone is already 0 |
| ui_stick_press | float | 0.3–0.9 | data file, default 0.5 | Component at which a stick direction counts as pressed |
| ui_stick_release | float | 0.1–(ui_stick_press − 0.1) | data file, default 0.3 | Component below which a held stick direction counts as released |
| ui_repeat_delay | float | 0.2–0.8 s | data file, default 0.4 | Time a direction is held before it starts repeating |
| ui_repeat_interval | float | 0.05–0.3 s | data file, default 0.1 | Time between repeats once repeating |

The load check refuses a `ui_stick_release` above `ui_stick_press − 0.1`, as it does for the trigger.

**Rolling the thumb to another axis** (owner decision 2026-11-17, fifth design review). A held direction is released only when its own component falls below `ui_stick_release`, not when the other axis becomes stronger. While it is held, no other stick direction can press, so a roll from right toward down presses `ui_down` once the right component is below 0.3. Until then `ui_right` keeps repeating. This is deliberate: it keeps a drifting thumb from stepping two ways at once.

**Why these values:** at the default deadzone and curve, a stick direction presses at about 0.69 of raw travel, a deliberate push that a resting thumb or a worn stick never reaches. The 0.2 hysteresis gap stops a wobbling thumb from double-stepping, as on the trigger. A 0.4 s delay lets a tap move one row; a 0.1 s repeat crosses a long list (the rebinding list's 13 or more rows) in about 1.6 s (0.4 + 12 × 0.1).

**Example:** on the Controls tab, the stick pushed fully down presses `ui_down` at once. Held for 1.05 s, it presses at 0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9 and 1.0 s: 8 rows. Easing it back to a raw length of 0.6 (s ≈ 0.39) keeps it held with no new press except the repeats; letting it fall to 0.4 (s ≈ 0.16) releases it. The stick at full tilt on the down-right diagonal presses only `ui_right`.

### Formula 5: UI scale

The ui_draw_size formula is defined as:

`content_scale = min(window_width / 1280, window_height / 720)`
`drawn_size = authored_size × content_scale × ui_scale`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| authored_size | float | px | data file (each UI asset) | Size of a UI element as authored at the 1280×720 reference |
| window_width, window_height | int | px | calculated | The game window |
| content_scale | float | > 0 | calculated | Fit to the window, keeping the aspect ratio |
| ui_scale | float | 0.8–1.5 | player setting (UI scale), default 1.0; 1.25 on a Steam Deck's first run | Player multiplier |

**Output Range:** 0.8× to 1.5× the fitted size. **Authoring rules that follow** (owner decision 2026-11-16, design review):

- **Scaled panels** (HUD elements, the open Flip Phone, dialogs and notices) are authored within 1280 / 1.5 ≈ 853 px wide (`ui_max_panel_width`) and 720 / 1.5 = 480 px tall (`ui_max_panel_height`). content_scale never exceeds either window ratio, so a panel within these limits fits any window at any UI scale up to 150%.
- **Full-screen screens** (Settings, the main menu) are not scaled as one panel. Their frame fills the window. Their text, rows and controls draw at `authored_size × content_scale × ui_scale`, and a list whose rows do not fit scrolls, keeping the highlighted row in view.
- **Overlap between panels.** The per-panel limit guarantees each panel fits alone, not that two HUD elements avoid each other. HUD & Catch Banner owns checking its layout at 150% on 1280×720 and 1280×800.

**Example:** Steam Deck, 1280×800: content_scale = min(1.0, 1.11) = 1.0. At the Deck default of 125%, a 32 px button glyph draws at 40 px. On a 1920×1080 monitor at 100%: content_scale = 1.5, so the same glyph draws at 48 px.

### Formula 6: Tangle assist (Hold mode)

The assist_presses and tangle_presses formulas are defined as:

`assist_presses = floor(time_held_s × assist_mash_rate)`
`tangle_presses = real_presses + Σ assist_presses over each hold in the tangle (Hold mode only)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| time_held_s | float | ≥ 0 | calculated (Casting & Tangle) | Seconds the current hold of `fish` has lasted during the tangle; resets to 0 on release |
| real_presses | int | ≥ 0 | calculated (Casting & Tangle) | `fish` presses during the current tangle; each counts as one, in either mode |
| assist_mash_rate | float | 3–8 | data file, default 5 | Presses per second a hold counts as |

**Ownership** (owner decision 2026-11-16, design review): this system owns `assist_presses` as a pure function, and `assist_mash_rate`. Casting & Tangle owns the tangle, the hold timer, the reset, the running `tangle_presses` count and how many presses a tangle needs, and calls the function. In Mash mode only `real_presses` count.

**Output Range:** 0 upward. The press that starts a hold counts at once; holding adds one more every 0.2 s at the default. Casting & Tangle treats each counted press exactly like a real one, so gear's `tangle_escape` applies the same way (Gear & Item Database).

**Why 5:** most players mash at 5–8 presses a second. At 5, Hold is a bit slower than a keen masher, so it is a comfortable choice, not the fastest one, and Mash stays worth doing for players who enjoy it. At 8, Hold would beat nearly everyone. Because a real press always counts, a player in Hold mode who mashes out of habit progresses exactly as in Mash mode: Hold can only add.

**Example:** a tangle that needs 15 presses frees after one press held for 2.85 s (1 + floor(2.85 × 5) = 1 + 14 = 15). The exact boundary is 2.8 s, but a hold timer built from summed frame times can land a hair under it, so tests use 2.85 s. A player mashing at 7 per second frees it in about 2.1 s, in either mode.

### Formula 7: Volume

The bus_volume_db formula is defined as:

`bus_volume_db = −∞ (muted) if slider = 0, else 20 × log10((slider / 100) ^ volume_curve)`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| slider | int | 0–100 | player setting (each Audio row) | Slider position |
| volume_curve | float | 1.0–3.0 | data file, default 2.0 | How fast the bottom of the slider falls off. 2 makes the slider's halfway point sound about half as loud |

**Output Range:** 0 dB at 100, down to −40 dB at 10, and muted at 0 (the log of 0 is never taken). The Master slider gives the master bus its dB. Each other slider sets its own bus, under Master; Audio owns the buses.

**Example:** slider 80: 20 × log10(0.64) ≈ **−3.9 dB**. Slider 50: 20 × log10(0.25) ≈ **−12 dB**. With a curve of 1 (a straight line in amplitude), 50 would be only −6 dB, and the bottom half of the slider would barely change anything.

**Feedback loops:** none. No formula here feeds its own input.

## Edge Cases

`systems-designer` was not consulted for this section (Lean mode). Review it manually before production.

**Devices**

- **If the gamepad disconnects during Gameplay or the Phone while it is the active device**: in solo the game pauses as for Settings and shows "Controller disconnected: reconnect it or press any key" (owner decision 2026-11-16). Reconnecting resumes play; any keyboard or mouse input switches the active device and resumes play. In co-op nothing pauses: the character stands idle and the same message shows. Held actions are cancelled (rule 7). A dead battery never costs a bite in solo.
- **If the gamepad disconnects while keyboard & mouse is the active device**: nothing happens beyond a brief notice. Play goes on.
- **If two or more gamepads are connected**: all of them drive the one player, like a second keyboard. Co-op is online only, so a second pad is never a second player.
- **If the keyboard and the stick both push `move` at once**: the longer vector wins (Formula 1). They are not added together, so a diagonal from both is never faster than one.
- **If a pad reports a stick length over 1**: it is capped at 1 before the deadzone (Formula 1).
- **If a stick drifts inside the deadzone**: it reads as 0, does not move the camera, and does not switch the active device (Formula 4).

**Focus, pause and co-op**

- **If the window loses focus** (alt-tab, or the Steam overlay on a Deck): held actions are cancelled. In solo the game pauses as for Settings until focus returns (owner decision 2026-11-16). With "Mute when the window loses focus" on, sound mutes too. In co-op nothing pauses.
- **If another player joins while Settings is open in solo**: the pause ends at once and the world runs on, with the Settings screen still open. If the last other player leaves while Settings is open, the game does not pause until Settings is reopened.
- **If the player opens Settings during the needle to stop it and study it (solo)**: this is allowed. The needle resumes from where it stopped, with no grace period and no penalty. Pausing is a slow, three-input detour (phone, Menu, Tackle-box) that gains little, and Pillar 2 prefers allowing it to punishing it.
- **If the phone opens while a bite is pending**: the bite runs on in the world, and a hook-set window that closes while the phone is open is missed (owner decision 2026-11-16: the phone blocks gameplay input). It is a soft cost; Bite Timing owns what a missed hook-set does.

**Holds and presses**

- **If a binding is already held when the Gameplay context begins** (for example Space held while closing Settings): it does not count as pressed until it is released and pressed again. Leaving a menu never fires a cast.
- **If the player leaves a context while charging a cast in Toggle mode**: this system sends `fish` *cancelled* on every context exit in Toggle mode, and Casting & Tangle cancels the charge (rule 7), as in Hold mode. Casting & Tangle owns what a charge held at full does.
- **If the player presses faster than the frame rate**: this system delivers one *pressed* signal per press event, not one per frame, so no press in a tangle mash is lost or merged, even two inside one frame. Casting & Tangle counts them (AC-18, AC-45).
- **If a frame hitch makes Δt very long**: Formula 3 uses Δt capped at 0.1 s, so a hitch never swings the camera more than 45° at full tilt and sensitivity 3.0 with the default `stick_deg_per_s` of 150 (90° at its maximum of 300).
- **If `fish` is bound to the right trigger and the trigger wobbles mid-hold**: the hold survives any wobble that stays above `trigger_release` (Formula 4).

**Rebinding**

- **If the player binds `fish` to the left mouse button**: allowed. Left click also chooses phone items, but `fish` and `ui_accept` never share a context (rule 12).
- **If the player tries to bind a refused input** (mouse motion, a stick direction, the Steam or Guide button, the Windows, Super or Command key, Print Screen, the input that opened capture): capture ignores it and keeps waiting. `menu` cancels.
- **If the player presses a key combination during capture** (for example Ctrl+E): the first accepted input down is bound (Ctrl), and capture ends (rule 11).
- **If the player tries to leave the rebinding list with an action unbound in the family being edited**: they cannot (rule 13). The screen names the action and offers its default. This covers a cleared slot and a Swap started from an empty slot.
- **If a forced exit arrives while the rebinding list shows an unbound action, or while capture is waiting** (midnight in co-op, a scene load, quit): rule 20 applies. Capture binds nothing, each unbound action is restored to its default, the file is written, and the "Some controls were reset" notice shows later.
- **If the player opens a `look` row or a `menu` row**: nothing is captured and no Clear is offered (rule 10).

**The settings file**

- **If the file comes from a newer version of the game**: keys this version does not know are ignored and kept in the file, and known keys are used.
- **If writing the file fails** (full disk, read-only folder): the settings stay in effect for this session, and the player sees "Couldn't save settings" once.
- **If a display mode leaves the screen unreadable**: the 10-second revert (rule 8) restores the previous mode with no input needed. The unconfirmed mode was never written, so quitting at once (Alt+F4 on a black screen), a crash or a forced exit during the countdown all leave the last confirmed mode in the file, and the next launch starts readable.
- **If the player leaves Settings, or the window loses focus, during the display countdown**: leaving by choice reverts. A loss of focus does not stop the countdown, which runs on real time (rule 8).

**Display**

- **If a full-screen screen's rows do not fit at the chosen UI scale** (for example the Controls tab at 150% on a Steam Deck): the row list scrolls, and moving the highlight with `ui_*` scrolls the highlighted row into view. Nothing is clipped or left off-screen. A scaled panel within the 853 × 480 px authoring limit never overflows (Formula 5); one authored past the limit is a content bug, caught by AC-44's scripted check.

## Dependencies

**Upstream (this system depends on):** none that are hard. It is a Core-layer system, designed in the Foundation tier of the design order, and works with nothing else built.

| System | Hard / soft | What it needs | Without it |
|---|---|---|---|
| Multiplayer (Alpha) | Soft | "Another player is connected" | Treated as never connected: every pause is a solo pause |
| Scene Flow & Loading (VS) | Soft | Starts and ends the Cutscene / Loading context | No cutscene context; play goes from the Main Menu straight to Gameplay |
| GodotSteam (Steam start-up, under Multiplayer) | Soft | "Running on a Steam Deck", for the first-run UI scale | 100% UI scale on every machine |

**Downstream (depends on this system):**

| System | Hard / soft | Interface |
|---|---|---|
| Player Controller | Hard | `move`, `look` (Formulas 1–3); field of view |
| Interaction (E) | Hard | `interact`; the active device, for prompt glyphs |
| Casting & Tangle | Hard | `fish` pressed / held / released / cancelled; Cast charge and Tangle modes; `assist_mash_rate` and the Formula 6 function (Casting & Tangle keeps the hold timer and count) |
| Bite Timing | Hard | `fish` pressed (the hook-set) |
| Reel-in Needle | Hard | `fish` pressed (stop the needle) |
| Chill Meter & Smoking | Hard | `smoke` pressed |
| Flip Phone & FishMail | Hard | `phone`, `menu`, `ui_*`; the Phone context; the Settings screen behind Menu → Tackle-box; current bindings for the Weather Report |
| Main Menu & Intro | Hard | The Settings screen behind the settings icon; `ui_*` |
| HUD & Catch Banner | Soft | The active device (glyphs), Subtitles and size, UI scale (Formula 5). With defaults, the HUD still works |
| Retro Rendering | Soft | Brightness, Vertex wobble, CRT filter. With defaults, the look still works |
| Audio | Soft | The five volumes (Formula 7), Mute when unfocused |
| Every system that runs on game time (Day, Night & Sleep; Bite Timing; Reel-in Needle; Chill Meter; Hunger; spoilage) | Soft | The solo pause (rule 17); the current input context (rule 17) |
| Multiplayer (Alpha) | Soft | Adds `emote` and `push_to_talk` to the action table (rule 2) |

**Soft dependent:** Save/Load (Repack) runs its quit-request save after rule 20 step 5 (added 2026-11-17, from the Save/Load design review). Settings are never in a save (rule 15), so this system does not depend on it. **Not a dependency:** Gear & Item Database: gear changes the numbers behind an input (for example `tangle_escape`), never the input itself.

**Bidirectional check** (verified 2026-11-17). The systems index lists Settings & Input as a dependency on rows 1, 2, 3, 6, 8–12, 25, 26, 27 and 29, which covers every hard dependent above and the soft ones for HUD, Retro Rendering, Audio, Day, Night & Sleep and Hunger. Day, Night & Sleep's GDD exists and lists Settings & Input as a soft dependency (its rules 2 and 8 rely on rules 7, 17 and 20 here). The other dependents' GDDs do not exist yet. Each must list Settings & Input as a dependency when it is written.

## Visual/Audio Requirements

Optional for a Core system; kept short. `art-director` and `audio-director` were not consulted (Lean mode).

- **Button glyphs.** Prompts show the active device's glyph (rule 5): a keycap for keyboard & mouse, and a face, trigger or stick glyph for gamepad. Glyphs follow the art bible's chunky UI style (Principle 1), sit on a Plate backing, and stay legible at UI scale 80%. At MVP the gamepad set is Xbox-style (A, B, X, Y, RT); other sets are Open Question 4.
- **Sounds.** The Settings screen and rebinding use the game's retro UI sounds (Audio owns them): move, accept, back, a tick when a binding is captured, and a short buzz when a conflict shows. Volume changes play a sample on that bus as the slider moves, so the player hears the level they are choosing.
- **Settings is a full-screen panel**, not drawn on the phone's tiny LCD, because 27 rows do not fit there. Its look is the UX spec's call (Open Question 3).

## Game Feel

Optional for a Core system, but the input chain is where "unresponsive controls" (a known complaint about the reference games, per the brief) would start.

- **No added latency.** An input event reaches gameplay in the same frame it arrives (AC-41). The target for the whole chain, from pressing `fish` to the needle visibly stopping, is 3 frames or less at 60 fps (50 ms); the needle and the HUD own the rest of that budget.
- **Hold-to-charge on the trigger** should feel like a squeeze, not a click: the trigger's press and release thresholds (Formula 4) are judged in the gamepad playtest.
- **Look** defaults are unhurried (Formulas 2–3), to suit a chill fishing game, not a shooter. The owner kept them as playtest starting points (2026-11-16).
- **Vibration** belongs to the system that causes it (for example a bite or a catch). This system only switches it on or off.

## UI Requirements

- **Settings screen**: four tabs (Audio, Graphics, Controls, Accessibility) with every row in rule 8; changes apply at once. It can be operated entirely by mouse, entirely by keyboard, and entirely by gamepad. Mouse focus and keyboard / gamepad focus are separate in Godot 4.6+, so both paths are tested.
- **Rebinding list**: the rows in rule 10 for the family being edited (every action with primary and secondary slots; `move` as four direction rows on keyboard & mouse; `look` and `menu` read-only), a Clear command on every slot except those of `look` and `menu`, a capture prompt ("Press a key, or Esc to cancel" on keyboard & mouse, "Press a button, or Menu to cancel" on gamepad), the conflict dialog (Swap / Cancel), the unbound-action block, and Reset to defaults per family.
- **Display confirmation**: a modal "Keep these settings? Reverting in 10…" countdown with Keep and Revert, the highlight starting on Revert (rule 8).
- **Notices**: "Controller disconnected: reconnect it or press any key"; "Couldn't save settings"; "Some controls were reset".
- **Prompts**: every on-screen input prompt in the game takes its glyph from the active device and the current binding, never from a hard-coded key name.
- **Weather Report** (in the Flip Phone): lists the current bindings for the active device.

> **📌 UX Flag — Settings & Input**: This system has UI requirements. In Pre-Production, run `/ux-design` for the Settings screen (with its rebinding list) **before** writing epics. Stories that touch these screens should cite `design/ux/settings.md`, not this GDD.

## Cross-References

| This document references | Where | What |
|---|---|---|
| Game brief (`design/game-brief.md`) | Controls; Menus; Tech | The default keys (WASD, E, hold Space, Space, F, Tab); the main menu's settings icon; the phone's Menu → Tackle-box — Options and Weather Report; the world runs while the phone is open; Steam Deck |
| Game concept (`design/gdd/game-concept.md`) | Pillars 2 and 5 | Pause and assist choices (never punishing); every system works solo, co-op never pauses |
| Art bible (`design/art/art-bible.md`) | Principle 1; Colourblind backups; Vibrance rule | Chunky UI style for glyphs; colourblind backups are always on, not settings; the internal resolution is fixed |
| Gear & Item Database (`design/gdd/gear-item-database.md`) | Stat keys | `tangle_escape` applies to Hold-mode presses exactly as to real ones (Formula 6) |
| Systems index (`design/gdd/systems-index.md`) | Rows 1, 27 and the dependents in Dependencies | Settings & Input is a Foundation-tier (Core-layer) dependency |
| `project.yaml` | `performance` | 60 fps on Steam Deck, the 16.67 ms frame behind AC-41 |

## Acceptance Criteria

Test types: **Logic** = automated unit test in `tests/unit/settings_input/`. **UI** = retained screenshot in `production/qa/evidence/`. **Integration** = automated test or documented playtest with the named system. **Check** = a scripted source or profiler check. Criteria marked *waits on* cannot run until that system exists. Until then, Logic tests may stand in a fake consumer for it.

**Actions and devices**

- **AC-1** (Check, rule 1) — **GIVEN** the project source, **WHEN** it is searched for raw key, mouse-button or joypad reads (`InputEventKey`, `InputEventMouseButton`, `InputEventMouseMotion`, `InputEventJoypadButton`, `InputEventJoypadMotion`, `is_key_pressed`, `is_mouse_button_pressed`, `is_joy_button_pressed`, `get_joy_axis`) outside Settings & Input's own files and outside the `_gui_input` handlers of UI Control scenes (pointer clicks on the phone's keypad, menu items and Settings rows are GUI input, rule 3), **THEN** there are 0 matches. The check lists every exempt handler so a reviewer can confirm none reads a gameplay input.
- **AC-2** (Logic, rules 1–3) — **GIVEN** no settings file, **WHEN** the input map loads, **THEN** it holds exactly the 13 actions in rule 1 (`ui_up/down/left/right` counted separately), each with the listed keyboard & mouse and gamepad defaults as primary and secondary per rule 3, every other secondary empty, and no engine-default binding left (Space is bound to no `ui_*` action).
- **AC-3** (Logic, rule 4) — **GIVEN** `fish` bound to Space and the right trigger, **WHEN** Space goes down, the trigger goes to 1.0, Space comes up, then the trigger goes to 0, **THEN** exactly one *pressed* is sent (at Space down), `fish` reads held throughout, and exactly one *released* is sent (when the trigger falls below 0.3).
- **AC-4** (Logic + UI, rule 5, Formula 4) — **GIVEN** keyboard & mouse active and a deadzone of 0.15, **WHEN** the right stick moves to length 0.10, **THEN** the active device does not change. **WHEN** it moves to 0.5, **THEN** the active device is gamepad and the next frame's interact prompt shows the A glyph (screenshot of both prompts retained).
- **AC-5** (Logic, Formula 4) — **GIVEN** gamepad active and `mouse_switch_px` = 6, **WHEN** the mouse moves 5 px in one frame, **THEN** gamepad stays active. **WHEN** it moves 6 px in one frame, **THEN** keyboard & mouse becomes active.
- **AC-6** (Logic, edge case) — **GIVEN** two gamepads connected in solo, **WHEN** `fish` is pressed on either, **THEN** the same player receives one *pressed*.

**Contexts**

- **AC-7** (Logic, rule 6) — **GIVEN** the Phone context, **WHEN** Space, F, E, W A S D and mouse motion are input, **THEN** no `fish`, `smoke`, `interact`, `move` or `look` signal reaches gameplay, and `ui_accept` on Enter is delivered.
- **AC-8** (Logic, rule 7) — **GIVEN** Gameplay with `fish` held for 0.5 s, **WHEN** the phone opens, **THEN** a *cancelled* signal is sent for `fish` and no *released*.
- **AC-9** (Logic, edge case) — **GIVEN** Space held while Settings closes to Gameplay, **WHEN** Space stays held for 1 s, **THEN** no `fish` *pressed* is sent. **WHEN** Space is released and pressed again, **THEN** exactly one *pressed* is sent.
- **AC-10** (Integration, rule 18) — **GIVEN** Gameplay, **WHEN** Esc is pressed, **THEN** the Flip Phone opens on its Menu page. **WHEN** Tackle-box — Options is chosen, **THEN** Settings opens. **WHEN** `menu` is pressed at Settings' first page, **THEN** the phone's Menu page shows again. **WHEN** `menu` is pressed once more, **THEN** the phone closes and play resumes (rule 19). Screenshot of each step retained. *Waits on Flip Phone & FishMail.*
- **AC-11** (UI, rule 18) — **GIVEN** the main menu, **WHEN** the settings icon is chosen, **THEN** Settings opens on the Audio tab, and `menu` returns to the main menu.

**Settings**

- **AC-12** (UI, rule 8) — **GIVEN** no settings file, **WHEN** Settings opens, **THEN** it shows four tabs (Audio, Graphics, Controls, Accessibility) containing every row in rule 8 at its listed default (one screenshot per tab retained).
- **AC-13** (Logic, rule 8) — **GIVEN** Settings open with mouse sensitivity 1.0, **WHEN** it is set to 2.0 and the mouse moves 100 units before Settings closes, **THEN** the turn computed is 14.0° (Formula 2 at 2.0).
- **AC-14** (Integration, rule 8) — **GIVEN** Windowed mode, **WHEN** Fullscreen is chosen and not confirmed for 10 s, **THEN** the window returns to Windowed with no input.
- **AC-15** (Logic, rule 8) — **GIVEN** no settings file on a Steam Deck, **WHEN** the game first starts, **THEN** UI scale is 125%. On a desktop it is 100%.

**Accessibility modes**

- **AC-16** (Integration, rule 9) — **GIVEN** Cast charge set to Toggle, **WHEN** `fish` is pressed and released, then pressed again 0.8 s after the first press, **THEN** Casting & Tangle charges for 0.8 s (first press to second) and throws once, as if `fish` had been held for 0.8 s. *Waits on Casting & Tangle.*
- **AC-17** (Logic, Formula 6) — **GIVEN** `assist_mash_rate` = 5, **WHEN** `assist_presses` is called with time_held_s = 0, 0.19, 0.21 and 3.0, **THEN** it returns 0, 0, 1 and 15. (The hold timer, the reset and the running count are Casting & Tangle's: AC-45.)
- **AC-18** (Logic, edge case) — **GIVEN** a fake consumer, **WHEN** two `fish` presses arrive inside one frame, **THEN** two *pressed* signals are delivered, none dropped or merged. (How a tangle counts them is Casting & Tangle's: AC-45.)

**Rebinding**

- **AC-19** (Logic, rule 10) — **GIVEN** the rebinding list, **WHEN** the player chooses `menu`, **THEN** no capture starts, and Esc and the Menu button still open the phone's Menu page.
- **AC-20** (Logic, rule 11) — **GIVEN** capture waiting in the keyboard & mouse family, **WHEN** the mouse moves 200 px and then G is pressed, **THEN** the motion is ignored and the action is bound to G.
- **AC-21** (Logic, rule 12) — **GIVEN** defaults, **WHEN** `smoke` is rebound to E, **THEN** the screen shows "Also used by interact". **WHEN** Swap is chosen, **THEN** `smoke` = E and `interact` = F. **WHEN** Cancel is chosen instead, **THEN** both are unchanged.
- **AC-22** (Logic, rule 12) — **GIVEN** defaults, **WHEN** `ui_up` is bound to W, **THEN** no conflict is shown and both `move` and `ui_up` keep W.
- **AC-23** (Logic, rule 13) — **GIVEN** `interact`'s only keyboard binding cleared with its Clear command, **WHEN** the player tries to leave the rebinding list, **THEN** leaving is refused, the screen names `interact`, and offers E.
- **AC-24** (Logic, rule 14) — **GIVEN** three keyboard rebinds and one gamepad rebind, **WHEN** "Reset to defaults" for keyboard & mouse is confirmed, **THEN** the keyboard defaults are restored and the gamepad rebind is kept.

**Persistence**

- **AC-25** (Integration, rule 15) — **GIVEN** changed volumes, sensitivity and one rebind, **WHEN** Settings closes and the game restarts, **THEN** all of them are as set. **WHEN** a different save is loaded, **THEN** none of them change.
- **AC-26** (Logic, rule 16) — **GIVEN** a settings file with mouse sensitivity 9.0, stick deadzone 0.10 and a binding for an action named `jump`, **WHEN** it loads, **THEN** sensitivity is 3.0, deadzone is 0.10, and `jump` is ignored without error.
- **AC-27** (Logic, rule 16) — **GIVEN** an unreadable settings file, **WHEN** the game starts, **THEN** every setting is at its default and the old file is kept as a backup beside it.

**Pause**

- **AC-28** (Integration, rule 17) — **GIVEN** solo with a game-time consumer at 3.0 s remaining, **WHEN** Settings is open for 10 s and then closed, **THEN** it still has 3.0 s remaining (± one frame). Run first with a fake consumer; rerun with Bite Timing and Day, Night & Sleep when they exist.
- **AC-29** (Integration, rule 17) — **GIVEN** another player connected, **WHEN** Settings is open for 10 s, **THEN** the game clock has advanced 10 s. *Waits on Multiplayer.*
- **AC-30** (Integration, edge case) — **GIVEN** solo with the gamepad active and the needle moving, **WHEN** the gamepad disconnects, **THEN** the game pauses and shows "Controller disconnected". **WHEN** it reconnects, **THEN** the needle resumes from the same position. *Waits on Reel-in Needle* (fake consumer until then).
- **AC-31** (Integration, edge case) — **GIVEN** solo with "Mute when the window loses focus" on, **WHEN** the window loses focus while `fish` is held, **THEN** `fish` is cancelled, game time stops and sound mutes. **WHEN** focus returns, **THEN** game time and sound resume. **GIVEN** Cast charge set to Toggle and `fish` not held, **WHEN** the window loses focus, or the gamepad disconnects, **THEN** exactly one `fish` *cancelled* is sent for each event (rule 7).

**Formulas**

- **AC-32** (Logic, Formula 1) — **GIVEN** dz = 0.15 and γ = 1.5, **WHEN** the raw stick length is 0.15, 0.5, 1.0 and 1.2, **THEN** the output length is 0, 0.26 (± 0.01), 1.0 and 1.0. **GIVEN** dz = 0.40, **WHEN** the length is 1.0, **THEN** the output is 1.0.
- **AC-33** (Logic, Formula 1) — **GIVEN** W and D held, **WHEN** `move` is read, **THEN** its length is 1.0 (± 0.001). **GIVEN** W held and the left stick at length 0.3 to the side, **WHEN** `move` is read, **THEN** it equals the keyboard vector.
- **AC-34** (Logic, Formula 2) — **GIVEN** `mouse_deg_per_count` = 0.07, **WHEN** the mouse moves 100 units horizontally at sensitivity 1.0, 0.1 and 3.0, **THEN** yaw changes 7.0°, 0.7° and 21.0°. **WHEN** it moves 100 units vertically with Invert mouse Y on at 1.0, **THEN** pitch changes −7.0°.
- **AC-35** (Logic, Formula 3) — **GIVEN** full tilt and `stick_deg_per_s` = 150, **WHEN** Δt = 1/60 s at sensitivity 1.0, **THEN** yaw changes 2.5°. **WHEN** Δt = 0.5 s, **THEN** yaw changes 15.0° (Δt capped at 0.1). **WHEN** Δt = 0.1 s at sensitivity 3.0, **THEN** yaw changes 45.0°.
- **AC-36** (Logic, Formula 4) — **GIVEN** `trigger_press` = 0.5 and `trigger_release` = 0.3, **WHEN** the trigger reads 0.49, **THEN** `fish` is not pressed. **WHEN** it reaches 0.5, **THEN** `fish` is pressed. **WHEN** it falls to 0.31, **THEN** `fish` is still held. **WHEN** it falls to 0.29, **THEN** `fish` is released. **GIVEN** a config with `trigger_release` = 0.5 and `trigger_press` = 0.5, **WHEN** it loads, **THEN** the load is refused, naming `trigger_release`.
- **AC-37** (Logic, Formula 5) — **GIVEN** a 1280×800 window and UI scale 1.25, **WHEN** a 32 px element is drawn, **THEN** it is 40 px. **GIVEN** 1920×1080 at 1.0, **THEN** it is 48 px. **GIVEN** 1280×720 at 1.5, **WHEN** an 853 × 480 px panel is drawn, **THEN** it is 1279.5 × 720 px and fits. **GIVEN** 2560×1080 and 960×540, each at 1.5, **WHEN** the same panel is drawn, **THEN** it fits inside the window in both.
- **AC-38** (Logic, Formula 7) — **GIVEN** `volume_curve` = 2.0, **WHEN** a slider is set to 100, 80, 50, 10 and 0, **THEN** its bus is at 0 dB, −3.88 dB, −12.04 dB, −40.0 dB (each ± 0.05) and muted.

**Cross-system and performance**

- **AC-39** (Integration) — **GIVEN** `interact` rebound to G and keyboard & mouse active, **WHEN** the Weather Report is opened, **THEN** it lists G for interact. **WHEN** the gamepad becomes active, **THEN** it lists A. *Waits on Flip Phone & FishMail.*
- **AC-40** (Integration) — **GIVEN** Subtitles on at size Large, **WHEN** a voiced catch-banner line plays, **THEN** its text shows at the Large size for the length of the line (screenshot retained). *Waits on HUD & Catch Banner.*
- **AC-41** (Check, performance) — **GIVEN** Gameplay at 60 fps on a Steam Deck with continuous gamepad input, **WHEN** profiled for 60 s, **THEN** Settings & Input's own processing averages ≤ 0.1 ms per frame, and an input event reaches gameplay in the same frame it arrives (this system adds no frame of delay).

**Added after the QA-lens check (owner, 2026-11-16)**

- **AC-42** (Logic, rule 11) — **GIVEN** capture waiting in the gamepad family, **WHEN** the Guide button is pressed and then X, **THEN** the Guide press is ignored, capture keeps waiting, and the action is bound to X.
- **AC-43** (Integration, edge case) — **GIVEN** solo with Settings open and game time paused, **WHEN** another player joins, **THEN** game time resumes within one frame of the join, with Settings still open. **WHEN** that player leaves, **THEN** game time keeps running until Settings is closed and reopened. *Waits on Multiplayer.*
- **AC-44** (UI + Check, Formula 5, edge case) — **GIVEN** a 1280×800 window at UI scale 1.5, **WHEN** Settings opens on the Controls tab, **THEN** its frame fills the window, its rows draw at 1.5×, and moving the highlight with `ui_down` to the last row (Rebind controls) scrolls that row into view, with nothing clipped (screenshots of the top and of the last row retained). **AND** a scripted check of every scaled panel scene finds none authored wider than 853 px or taller than 480 px.

**Added after the design review (owner, 2026-11-16)**

- **AC-45** (Integration, rule 9, Formula 6) — **GIVEN** Tangle set to Hold, `assist_mash_rate` = 5 and a tangle that needs 15 presses, **WHEN** `fish` is pressed once and held for 2.85 s, **THEN** the tangle frees (1 + 14). **GIVEN** a fresh tangle in Hold mode, **WHEN** `fish` is pressed 7 times a second with each press held under 0.2 s, **THEN** it frees on the 15th press, as in Mash mode. **WHEN** a hold is released and `fish` is pressed again, **THEN** the new press counts 1 and its hold time starts from 0. *Waits on Casting & Tangle* (a fake tangle until then).
- **AC-46** (Logic, rule 8, Formulas 1 and 3) — **GIVEN** Swap sticks on, **WHEN** the right stick is at full tilt and the left stick centred, **THEN** `move` has length 1.0 and `look` is 0. **GIVEN** Invert stick Y on, `stick_deg_per_s` = 150 and sensitivity 1.0, **WHEN** the look stick is held fully up for Δt = 1/60 s, **THEN** pitch changes 2.5° with the opposite sign to the same input with Invert stick Y off.
- **AC-47** (Integration, rule 8) — **GIVEN** Vibration off, **WHEN** a system asks for a rumble, **THEN** no pad vibrates. *Waits on the first system that rumbles* (a fake requester until then).
- **AC-48** (Logic, edge case) — **GIVEN** a settings folder that cannot be written, **WHEN** Settings is changed and closed twice, **THEN** both changes stay in effect for the session and "Couldn't save settings" shows exactly once.
- **AC-49** (Logic, edge case, rule 16) — **GIVEN** a settings file holding a key `future_option` this version does not know, **WHEN** it loads and Settings is then closed, **THEN** the rewritten file still holds `future_option` with its value unchanged.
- **AC-50** (Logic + Integration, rule 7, edge case) — **GIVEN** Cast charge set to Toggle and `fish` not held, **WHEN** any context ends, **THEN** exactly one `fish` *cancelled* is sent. **GIVEN** Cast charge set to Hold and `fish` not held, **THEN** none is sent. **GIVEN** Toggle and a charge started by one `fish` press, **WHEN** the phone opens, **THEN** Casting & Tangle cancels the charge, and after the phone closes no cast is thrown and the next press starts a new charge. *The integration part waits on Casting & Tangle* (a fake consumer until then).
- **AC-51** (Integration, rule 15) — **GIVEN** Settings open with the Master volume changed to 40, **WHEN** the window gets a quit request, **THEN** the next launch starts with Master at 40.

**Added after the second design review (owner, 2026-11-16)**

- **AC-52** (Logic, rule 1, Formula 4) — **GIVEN** the defaults (dz 0.15, γ 1.5, `ui_stick_press` 0.5, `ui_stick_release` 0.3, `ui_repeat_delay` 0.4 s, `ui_repeat_interval` 0.1 s) in the Settings context, **WHEN** the left stick is pushed straight down to a raw length of 0.6, **THEN** no `ui_down` is pressed. **WHEN** it reaches 1.0, **THEN** `ui_down` is pressed once. **WHEN** it is held at 1.0 for 1.05 s in all, **THEN** `ui_down` has been pressed 8 times. **WHEN** it falls to 0.6, **THEN** it stays held; **WHEN** it falls to 0.4, **THEN** it is released. **GIVEN** the stick at full tilt on the down-right diagonal with equal components, **THEN** only `ui_right` is pressed. **GIVEN** the Down arrow held for 1.05 s while the operating system sends key-repeat events, **THEN** `ui_down` is pressed exactly 8 times. **GIVEN** a config with `ui_stick_release` = 0.5 and `ui_stick_press` = 0.5, **WHEN** it loads, **THEN** the load is refused, naming `ui_stick_release`.

**Added after the third design review (owner, 2026-11-16)**

- **AC-53** (Logic + Integration, rule 19) — **GIVEN** Gameplay, **WHEN** `menu` is pressed, **THEN** the phone opens on its Menu page. **WHEN** `menu` is pressed again, **THEN** the phone closes. **GIVEN** the phone opened with `phone`, **WHEN** `ui_cancel` is pressed on the home screen, **THEN** the phone closes. **GIVEN** the phone two levels below its first page, **WHEN** `menu` is pressed, **THEN** it goes back one level, not out. **GIVEN** Settings opened from the title, **WHEN** `ui_cancel` is pressed at its first page, **THEN** the main menu shows. **GIVEN** the main menu's top level or Gameplay, **WHEN** `ui_cancel` is pressed, **THEN** nothing happens. Screenshots of the phone and Settings steps retained. *The phone steps wait on Flip Phone & FishMail* (a fake phone until then).
- **AC-54** (Logic, rules 11–13) — **GIVEN** the keyboard & mouse list, **WHEN** a slot is cleared with Clear, **THEN** it reads empty, and if that leaves an action unbound, going back out of the list is refused naming it. **GIVEN** `interact` on E (primary) and `smoke`'s secondary empty, **WHEN** that secondary is captured as E and Swap is chosen, **THEN** `smoke`'s secondary is E, `interact`'s E slot is empty, and the unbound block applies if `interact` has no other keyboard binding. **GIVEN** a slot chosen with Enter or a click, **WHEN** capture starts, **THEN** that Enter or click is not bound and the next different input is. **GIVEN** capture waiting in the gamepad family, **WHEN** the left stick is pushed fully down, **THEN** it is ignored. **THEN** the keyboard & mouse prompt reads "Press a key, or Esc to cancel" and the gamepad prompt reads "Press a button, or Menu to cancel". **GIVEN** the left stick cleared from `ui_down`'s secondary, **WHEN** "restore its default" is chosen, **THEN** the stick binding is back.
- **AC-55** (Logic, rule 16) — **GIVEN** a settings file with `menu` unbound, `fish` with no keyboard binding, and `interact` and `smoke` both on E, **WHEN** it loads, **THEN** `menu` is Esc, `fish` is Space, `interact` is E and `smoke` is F, every other binding is as in the file, and one "Some controls were reset" notice shows.
- **AC-56** (Logic, Formula 4) — **GIVEN** `ui_right` held from the left stick, **WHEN** the stick moves in one frame to straight down (right component 0, down component 0.9), **THEN** `ui_right` is released and `ui_down` is pressed once in that frame, and `ui_down`'s repeat delay starts from that press.

**Added after the fourth design review (owner, 2026-11-17)**

- **AC-57** (Logic + UI, rules 10 and 13) — **GIVEN** the keyboard & mouse list, **THEN** `move` shows four rows (Up, Down, Left, Right) each with a primary and a secondary slot, `look` shows "Mouse motion" read-only with no capture or Clear, and `menu` shows Esc read-only with no capture or Clear. **GIVEN** the gamepad list, **THEN** `move` has no row and `look` shows "Right stick" read-only. **GIVEN** `move: Left`'s only key cleared, **WHEN** the player tries to leave the list, **THEN** leaving is refused, the screen reads "Move: Left", and offers A. Screenshots of both lists retained.
- **AC-58** (Logic + Integration, rule 20, edge case) — **GIVEN** the rebinding list with `interact` unbound on keyboard & mouse and a capture waiting on another row, **WHEN** a forced exit arrives (a Scene Flow load, or in co-op the midnight overnight), **THEN** the capture binds nothing, `interact` is back on E, the settings file holds E, held actions are cancelled, and the context is Cutscene / Loading. **WHEN** Gameplay is next on screen, **THEN** one "Some controls were reset" notice names `interact`. **GIVEN** the Phone open, **WHEN** the same exit arrives, **THEN** the phone closes with no return to its Menu page. *The midnight case waits on Day, Night & Sleep and Multiplayer* (a fake exit until then).
- **AC-59** (Logic, rule 17) — **GIVEN** any context change, **THEN** the readable current input context equals the new context and its change signal is sent exactly once. **GIVEN** the Phone context, **THEN** `game_time_paused` is false; **GIVEN** Settings in solo, **THEN** it is true.

**Added after the fifth design review (owner, 2026-11-17)**

- **AC-60** (Logic + Integration, rules 8, 15, 20) — **GIVEN** Windowed mode confirmed, **WHEN** Fullscreen is chosen, **THEN** the countdown dialog shows with the highlight on Revert, and the settings file still holds Windowed. **WHEN** the window gets a quit request during the countdown, **THEN** the file holds Windowed and the next launch starts Windowed. **GIVEN** a fresh countdown, **WHEN** `menu` is pressed, **THEN** Windowed is restored and the dialog closes. **WHEN** Keep is chosen instead, **THEN** the file holds Fullscreen after Settings closes. **GIVEN** a countdown in solo with game time paused, **WHEN** 10 s of real time pass with no input, **THEN** Windowed is restored. **GIVEN** a countdown and a forced exit (rule 20), **THEN** the previous mode is restored before the context changes. **GIVEN** a second display change during a countdown, **THEN** the countdown restarts at 10 s and a revert returns to the last confirmed mode.
- **AC-61** (Logic, rule 11) — **GIVEN** capture waiting in the keyboard & mouse family, **WHEN** the Windows, Super or Command key and then Print Screen are pressed, **THEN** both are ignored and capture keeps waiting. **WHEN** Left Shift is pressed, **THEN** the action is bound to Left Shift alone. **GIVEN** a fresh capture, **WHEN** Ctrl goes down and then E, **THEN** the action is bound to Ctrl and capture has ended.
- **AC-62** (Logic, Formula 4) — **GIVEN** `ui_right` held from the left stick at s = (0.9, 0), **WHEN** the stick moves to s = (0.5, 0.7), **THEN** `ui_right` stays held and repeats, and `ui_down` is not pressed. **WHEN** it then moves to s = (0.25, 0.7), **THEN** `ui_right` is released and `ui_down` is pressed once in that frame.
- **AC-63** (Logic, rule 16) — **GIVEN** a settings file written by a version without a Gameplay action `emote` (default X) and holding `interact` custom-bound to X, **WHEN** it loads in a version that adds `emote`, **THEN** `emote` is X, `interact` is E, every other binding is as in the file, and one "Some controls were reset" notice names both.

## Open Questions

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 1 | **Steam Input on the Deck.** Steam Input can remap buttons before the game sees them, and then the in-game glyphs show the game's binding, not the button pressed. Check on Deck hardware whether to read Steam Input's controller type and glyphs (through GodotSteam), or to ship a Steam Input default config. This is a knowledge gap: the engine reference does not cover it. Also check on the Deck that a brushed trackpad does not flip the active device to keyboard & mouse (6 px of mouse motion switches it, Formula 4), which would change glyphs and show the cursor mid-play; if it does, add a Deck-specific `mouse_switch_px` (fourth design review). | godot-specialist with the owner | Before the Vertical Slice (target 2027-01-31) |
| 2 | **Deferred accessibility options**: a screen-effect intensity slider (Chill vibrance, YAK LOCKED blur, vertex wobble, camera bob) and a timing assist (longer hook-set window, slower needle). The owner kept them out of the MVP on 2026-11-16. Revisit after the first Godot playtest; a timing assist would need Bite Timing and Reel-in Needle to honour it. | Owner | After the first Godot playtest |
| 3 | **Settings screen presentation and naming.** The phone's "Tackle-box — Options" shares a name with the dock's Tackle Box ("Smoke & Tackle"), which may confuse players. Decide the name and the full-screen look in the UX spec. | ux-designer with the owner | At `/ux-design` for Settings |
| 4 | **Gamepad glyph sets** beyond Xbox-style (PlayStation, Steam Deck). Tied to Open Question 1. | Owner | Vertical Slice |
| 5 | **Gyro aiming** (available in Godot 4.7) for look on the Deck. | Owner | Post-MVP |
| 6 | **Language setting.** No localization scope is set yet. | Owner | Before Alpha |
| 7 | **Eating on the water**: which action eats from the Cooler, an existing one (`interact`, the phone) or a new one? Belongs to Hunger, Munchies & Drunk; a new action would be added here under rule 2. | Hunger, Munchies & Drunk GDD | When that GDD is written |
| 8 | **Phone keypad shortcuts**: should number keys pick phone items, flip-phone style? Belongs to Flip Phone & FishMail; new actions would be added here under rule 2. | Flip Phone & FishMail GDD | When that GDD is written |
