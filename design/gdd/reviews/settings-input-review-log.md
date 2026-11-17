# Review Log — Settings & Input

## Review — 2026-11-16 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 2 | Recommended: 9
Summary: A precise Foundation doc. Every formula example and AC number recomputes correctly, the two owned registry values (assist_mash_rate 5, ui_max_panel_height 480) match the registry, and the owner decisions fit Pillars 2 and 5. The 2 blockers were precision gaps, not design problems: the UI-scale fit rule claimed an overflow that Formula 5 makes impossible while missing width and full-screen panels, and Tangle Hold mode let a habitual masher make zero progress, with no clear owner for the count. Both were fixed the same day with owner decisions; the target document was edited afterwards, so it carries no content hash here and the next /design-review runs in full.
Prior verdict resolved: First review
Findings:
- [BLOCKING] Formulas / Edge Cases / AC-44: Formula 5's min() fit means a 480 px panel at 150% always fits, so the "scaled down below 1280×720" edge case could not occur and AC-44's 960×540 case was an exact fit; width and the full-screen Settings screen could overflow. Fixed (owner choice): scaled panels authored within 853 × 480 px; full-screen screens fill the window and scroll their rows; edge case, AC-37 and AC-44 rewritten.
- [BLOCKING] Rule 9 / Formula 6 / AC-17: whether real presses count in Hold mode was undefined (a masher in Hold mode got 0), and AC-17 needed tangle state this system cannot know. Fixed (owner choices): real presses always count and holding adds; this system owns Formula 6 as a pure function plus assist_mash_rate, and Casting & Tangle owns the timer, reset and count; AC-17 is now a pure-function test, AC-45 added.
- [RECOMMENDED] AC-1: search list left out mouse-button, mouse-motion and joypad-axis reads. Fixed.
- [RECOMMENDED] Formula 1: engine per-action deadzone could stack with the player deadzone. Fixed: Formula 1 is the only deadzone; engine default to be verified (not in the engine reference).
- [RECOMMENDED] Formulas 2 and 4: mouse motion units mixed (counts vs px) and could scale with the window. Fixed: unscaled screen pixels (screen_relative); to be verified against the engine.
- [RECOMMENDED] Rule 1 / rule 3: Godot's built-in ui_* defaults (Space on ui_accept) and left click as a ui_accept binding. Fixed: defaults replaced; left click on an item is pointer input, not a binding; AC-2 checks it.
- [RECOMMENDED] States / Phone: Esc opens the phone's Menu page but may only go back a level on the next press; ui_cancel at the phone's top level unspecified. Open (needs an owner decision).
- [RECOMMENDED] Rebinding: no "clear slot" operation though AC-23 assumes one; Swap from an empty slot leaves the other action unbound; the input that opened capture could be captured; a stick direction on a ui_* gamepad secondary cannot be re-captured. Open (needs owner decisions).
- [RECOMMENDED] Acceptance Criteria: no ACs for Swap sticks, Invert stick Y, Vibration off, the one-time save-failure notice, newer-version keys kept, Toggle-charge cancel. Fixed: AC-46 to AC-50; rule 7 now cancels a Toggle charge on a context change.
- [RECOMMENDED] Rule 15: settings not written if the game quits with Settings open. Fixed: also written on a quit request; AC-51.
- [RECOMMENDED] Dependencies: "Platform (Steam)" is not a system. Fixed in the doc (GodotSteam, under Multiplayer). Open: Day, Night & Sleep and Hunger index rows do not list the soft solo-pause dependency.
- [NICE] Tuning Knobs and Player Fantasy absent (advisory at standard); trigger load check refuses only release ≥ press though the range implies a 0.1 gap; AC-11 adds an "opens on Audio" requirement no rule states; no LB/RB tab switching in Settings; no keyboard look keys; Window size meaningless in Borderless fullscreen. AC-17's fragile 0.20 s boundary fixed (now 0.21 s).
- [FOLLOW-UP] Registry: no entry for the new 853 px panel-width limit, and ui_max_panel_height's note should mention it. Not changed by this review (outside its scope).
Reviewed-Content-Hash: design/registry/entities.yaml 890bb277c04659d6548d4d4eef71bb29886d3fc3
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647
Reviewed-Content-Hash: design/gdd/gear-item-database.md 6a79e0d13d6c0c35587ef5e32c5b7617bb807428
Reviewed-Content-Hash: design/gdd/systems-index.md bdce00a22caa3b4874899c3c7c6f8ac62a0ad2b6

## Review — 2026-11-16 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 1 | Recommended: 6
Summary: Both prior blockers are resolved; every formula example and AC number recomputes correctly (Formula 5 fit checked at 1280×720, 2560×1080, 960×540 and 1024×768), the two owned registry values match, and the owner decisions still fit Pillars 2 and 5. One precision gap blocks: menu navigation from a stick is undefined (no press or release point, no diagonal rule, no repeat on a held direction) while line 194 sets the engine's stick deadzone to 0. Two owner-decision items from the first review remain open. The hashes below are of the version reviewed; the blocker was fixed straight after this entry with an owner decision, so the next /design-review runs in full.
Prior verdict resolved: Yes (both prior blockers fixed; two prior recommended items still open)
Findings:
- [BLOCKING] Rule 1 / Formula 1 / Formula 4: `ui_*` on the left stick has no press/release threshold, no diagonal rule and no held-direction repeat (D-pad and stick never repeat; keyboard repeats only through OS echo). Fixed (owner choice "adopt as proposed"): Formula 4 gains ui_stick_press 0.5 / ui_stick_release 0.3 on the stronger axis, one stick direction at a time, and a uniform repeat for held directions on every device (ui_repeat_delay 0.4 s, ui_repeat_interval 0.1 s; OS echo ignored); rule 1 note, Formula 1 note and AC-52 added.
- [RECOMMENDED] States / Phone: Esc/`menu` close behaviour, `ui_cancel` at the phone's top level, and B vs Menu out of Settings on a gamepad. Still open from the first review.
- [RECOMMENDED] Rebinding: no clear-slot operation (AC-23 assumes one), Swap from an empty slot, the input that opened capture being captured, stick directions on `ui_*` secondaries not re-capturable, capture prompt says Esc for the gamepad family. Still open from the first review.
- [RECOMMENDED] Rule 16: no rule for a loaded file whose bindings break rules 10, 12 or 13, or for a newer version adding an action whose default the player already uses.
- [RECOMMENDED] AC-1: a custom `_gui_input` checking `InputEventMouseButton` (e.g. the clickable flip-phone keypad) would fail the search; exempt GUI pointer handling or say how the phone gets clicks.
- [RECOMMENDED] Dependencies: the "Bidirectional check" paragraph is stale (the index now lists S&I in 9 rows); index rows 3 (Day, Night & Sleep) and 12 (Hunger) still lack the soft solo-pause dependency.
- [RECOMMENDED] Formula 5: the per-panel limit does not stop HUD elements overlapping each other at 150% on 1280×720; name HUD as owner of that layout check.
- [NICE] Tuning Knobs and Player Fantasy absent (advisory); Formula 6 example "about 2.1 s" is 2.0 s; trigger load check refuses only release ≥ press; AC-11's Audio-tab requirement has no rule; Window size in borderless fullscreen; AC-44's script needs a scaled-panel marker; rule 16 silent on keeping unknown-action bindings in the file; Formula 2's 16 cm assumes no pointer acceleration; Swap sticks vs menu navigation stick unstated.
- [FOLLOW-UP] Registry: still no entry for the 853 px panel-width limit (outside this review's scope).
Reviewed-Content-Hash: design/gdd/settings-input.md e770c004b2ef7647e6b70dcd0f05abd71d42053a
Reviewed-Content-Hash: design/registry/entities.yaml 890bb277c04659d6548d4d4eef71bb29886d3fc3
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647
Reviewed-Content-Hash: design/gdd/gear-item-database.md 6a79e0d13d6c0c35587ef5e32c5b7617bb807428
Reviewed-Content-Hash: design/gdd/systems-index.md bdce00a22caa3b4874899c3c7c6f8ac62a0ad2b6

## Review — 2026-11-16 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 3 | Recommended: 8
Summary: The second-review blocker (stick menu navigation) is resolved, and every formula and AC number recomputes (Formulas 1–7, AC-13, AC-32 to AC-38, AC-52), with both owned registry values matching. Three precision gaps in the system's own flows blocked: what `menu` and `ui_cancel` do at each level of the phone, Settings and main menu; the rebinding operations rules 12–13 and AC-23 depend on (clear, swap from an empty slot, the opening input being captured); and who sends `fish` cancelled in Toggle mode when no key is held. All three were fixed straight after this entry with owner decisions, together with five recommended items; the document was edited afterwards, so it carries no content hash here and the next /design-review runs in full.
Prior verdict resolved: Yes (review 2 blocker fixed; its open recommended items on Esc/`ui_cancel` and rebinding were escalated to blockers and fixed)
Findings:
- [BLOCKING] Rule 1 / States: `menu` and `ui_cancel` both meant "back" with no level, close or top-level behaviour (Esc could need two or three presses to close the phone; B vs Menu on gamepad; no AC for closing). Fixed (owner choice "both go back, then close"): new rule 19, States transitions, AC-10 and AC-53.
- [BLOCKING] Rules 11–13 / AC-23: no Clear operation, Swap from an empty slot could leave an action unbound, the input that opened capture could be bound, stick directions on `ui_*` secondaries could not be recaptured, the capture prompt named Esc for the gamepad family. Fixed: Clear on every slot, Swap as a slot exchange, opening input ignored, sticks never captured, per-family prompts; AC-23 and AC-54.
- [BLOCKING] Rule 7 / rule 9 / AC-50: Toggle-mode cancel needed this system to see a charge Casting & Tangle owns. Fixed: `fish` cancelled is sent on every context exit while Cast charge is Toggle, and Casting & Tangle ignores it when no charge is under way; AC-50 split into Logic and Integration parts.
- [RECOMMENDED] Rule 16: no rule for loaded bindings that break rules 10, 12, 13 or collide with a newer action's default. Fixed (owner choice "repair only the broken actions"): `menu` forced to default, unbound actions restored, shared-input conflicts reset both; one notice; AC-55.
- [RECOMMENDED] AC-1: a clickable phone keypad using `_gui_input` would fail the raw-read search. Fixed: `_gui_input` handlers of UI Control scenes are exempt and listed.
- [RECOMMENDED] AC-18 and the mash edge case tested tangle state this system does not own. Fixed: now test delivery of one pressed signal per press.
- [RECOMMENDED] Formula 4: same-frame release/press order unspecified; Godot's own Control focus navigation may add its own `ui_*` repeat. Fixed: releases before presses, AC-56; engine check added for implementation (engine reference does not cover it).
- [RECOMMENDED] Rule 17: the solo-pause mechanism was unnamed. Fixed in part: `game_time_paused` state and signal named; the carrying-out mechanism is left to an ADR.
- [RECOMMENDED] Formula 5: per-panel limit does not stop HUD elements overlapping at 150%. Fixed: HUD & Catch Banner named as owner of the check.
- [RECOMMENDED] Dependencies: stale "Bidirectional check" paragraph. Fixed in the doc. Open: index rows 3 (Day, Night & Sleep) and 12 (Hunger) still lack the soft solo-pause dependency, and the index's line 267 still says "not yet reviewed".
- [NICE] Tuning Knobs and Player Fantasy absent (advisory); hitch cap 45° holds only at the default `stick_deg_per_s` (fixed in the doc); trigger load check refuses only release ≥ press; AC-11's "opens on Audio" has no rule; Window size in borderless fullscreen; AC-16's "0.8 s later" is ambiguous; held axes across a context change and mouse-wheel capture unstated; Swap sticks vs the menu-navigation stick; Frame cap and VSync interplay.
- [FOLLOW-UP] Registry: no entry for the 853 px panel-width limit, and the GDD never names `ui_max_panel_height` (it writes 480). Not changed by this review.
Reviewed-Content-Hash: design/registry/entities.yaml 890bb277c04659d6548d4d4eef71bb29886d3fc3
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647
Reviewed-Content-Hash: design/gdd/gear-item-database.md 6a79e0d13d6c0c35587ef5e32c5b7617bb807428
Reviewed-Content-Hash: design/gdd/systems-index.md bdce00a22caa3b4874899c3c7c6f8ac62a0ad2b6
Reviewed-Content-Hash: design/art/art-bible.md 4acf62dd6dd561cdd0470a8d195238df1c7f39e3

## Review — 2026-11-17 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 2 | Recommended: 11
Summary: The three third-review blockers (back and close, rebinding operations, Toggle-cancel ownership) are confirmed fixed, and every formula and AC number recomputes. Two new blockers: the rebinding list's rows were undefined for `move`, `look` and `menu` (rule 10 said any action rebinds), and forced exits (the midnight overnight in co-op, a scene load, quit) had no transition rows and conflicted with rule 13's refusal to leave with an action unbound. Both were fixed straight after this entry with owner decisions, together with all recommended items; the document, the registry and the index were edited afterwards, so the hashes below are of the revised files and the next /design-review runs in full.
Prior verdict resolved: Yes (all three third-review blockers fixed)
Findings:
- [BLOCKING] Rules 3, 10, 13 / UI Requirements: `look` cannot be rebound, `move` has four keys, `menu` must not be cleared; the slot model and the unbound test were undefined. Fixed (owner choice "move: 4 rows; look fixed"): rule 10 rows, rules 13 and 16, AC-57.
- [BLOCKING] States / rules 13, 15: no Phone, Settings or Rebind Capture → Cutscene / Loading transition, though Day, Night & Sleep needs it; forced closes hit rule 13's refusal. Fixed (owner choice "restore defaults, show notice"): rule 20, States rows, edge case, AC-58.
- [RECOMMENDED] Rule 9 vs Formula 6: "never slower than pressing" contradicted "slower than a keen masher". Fixed in the doc.
- [RECOMMENDED] Formula 6 example and AC-45: exact boundary 2.8 s fragile with summed frame times. Fixed: 2.85 s.
- [RECOMMENDED] Rule 7: Toggle cancel did not cover focus loss or pad disconnect. Fixed; AC-31 extended.
- [RECOMMENDED] Rule 17: current input context not exposed though Day, Night & Sleep reads it. Fixed; AC-59.
- [RECOMMENDED] Stale Dependencies paragraph, index line 267 and Layer (Foundation vs Core). Fixed.
- [RECOMMENDED] Steam Deck trackpad motion could flip the active device. Added to Open Question 1 (owner choice).
- [RECOMMENDED] AC-16 ambiguous timing; AC-11 had no rule for the Audio tab. Fixed.
- [RECOMMENDED] 853 px panel width unregistered. Fixed: `ui_max_panel_width` added, constants named in Formula 5.
- [RECOMMENDED] "About 1.5 s" list-crossing figure; load checks enforced only release ≥ press, not the 0.1 gap. Fixed.
- [NICE] Tuning Knobs and Player Fantasy absent (advisory); Swap sticks vs menu-navigation stick; Window size in borderless; Frame cap and VSync; held axes across a context change; mouse-wheel capture; same input on one action's primary and secondary; Formula 7's −40 dB holds only at curve 2.
Reviewed-Content-Hash: design/gdd/settings-input.md fd61fc07df24b4d53768cf21a00e1a700f2a2800
Reviewed-Content-Hash: design/registry/entities.yaml 6d69f176ab1984e2db7ff77ad031cc11559dfc9c
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647
Reviewed-Content-Hash: design/gdd/gear-item-database.md 6a79e0d13d6c0c35587ef5e32c5b7617bb807428
Reviewed-Content-Hash: design/gdd/systems-index.md 5a22e7c745da6238732529ad31451ea4b981e869
Reviewed-Content-Hash: design/art/art-bible.md 4acf62dd6dd561cdd0470a8d195238df1c7f39e3
Reviewed-Content-Hash: design/gdd/day-night-sleep.md f67d4bd3ec83e4a6e13c8e101395dcc48d083cf7

## Review — 2026-11-17 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 1 | Recommended: 6
Summary: Both fourth-review blockers (rebinding rows for `move`, `look` and `menu`; forced exits) are confirmed fixed, and every formula and AC number recomputes (Formulas 1–7, AC-13, AC-17, AC-32 to AC-38, AC-52, AC-56). Registry values match (5, 480, 853). One new blocker: rule 8's 10-second display revert has no rule for a quit, a forced exit or backing out during the countdown, and rules 15 and 20 write the settings file on those exits, so an unconfirmed (possibly unreadable) display mode could be saved and the next launch has no countdown to recover. The previous entry's hashes were taken after its revisions, so this review read text that had not been reviewed before; the hashes below are of the text reviewed now.
Prior verdict resolved: Yes (both fourth-review blockers fixed)
Findings:
- [BLOCKING] Rules 8, 15, 20 / Edge Cases: unconfirmed display mode or window size can be written to the settings file; countdown clock, dialog context and exits during it are unspecified; no AC.
- [RECOMMENDED] Rule 11: "keys the operating system reserves" unnamed; modifier-only keys and combinations unaddressed.
- [RECOMMENDED] Summary and Overview: "rebind all except `menu` and `look`" contradicts rule 10 (`move` has no gamepad row; stick `ui_*` secondaries are not capturable).
- [RECOMMENDED] Dependencies and Cross-References call this a Foundation system; the Quick reference and index say Core.
- [RECOMMENDED] Formula 4: a held `ui_right` keeps repeating and blocks `ui_down` while the thumb rolls toward down, until the x component falls below `ui_stick_release`; AC-56 covers only the clean flick.
- [RECOMMENDED] Rule 16: no AC for a newer version adding an action whose default collides with a custom binding.
- [RECOMMENDED] Header: Last Verified (2026-11-16) is older than Last Updated (2026-11-17).
- [NICE] Tuning Knobs and Player Fantasy absent (advisory; 13 data-file values are scattered across the formulas); Swap sticks vs the menu-navigation stick; Frame cap and VSync; `move` held across a context change; mouse-wheel capture.
Reviewed-Content-Hash: design/gdd/settings-input.md fd61fc07df24b4d53768cf21a00e1a700f2a2800
Reviewed-Content-Hash: design/registry/entities.yaml 6d69f176ab1984e2db7ff77ad031cc11559dfc9c
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647
Reviewed-Content-Hash: design/gdd/gear-item-database.md 6a79e0d13d6c0c35587ef5e32c5b7617bb807428
Reviewed-Content-Hash: design/gdd/systems-index.md 80ee3f1b4f4879e9c77fcb4ab33636caae806bb6
Reviewed-Content-Hash: design/art/art-bible.md 4acf62dd6dd561cdd0470a8d195238df1c7f39e3
Reviewed-Content-Hash: design/gdd/day-night-sleep.md f67d4bd3ec83e4a6e13c8e101395dcc48d083cf7
