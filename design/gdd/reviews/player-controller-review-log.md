# Review Log — Player Controller

## Review — 2026-11-17 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 1 | Recommended: 9
Summary: A precise Core doc. Every formula example and AC number recomputes (walk, look, heading, velocity, coast, berth, bank slide, push and tip, sway), the registry values (paddle_max_base 4.5, tip_resistance_base 5.0, field_of_view_deg 75 vertical) match, and the sketch values it cites match the sketch files. The one blocker was a design contradiction: the stuck rule fired on any 2 s of `move` held against a wall or rail, so it would teleport a player leaning on the dock rail and contradicted AC-31. The nine recommended items were cross-document and testability gaps. The blocker and eight recommended items were fixed the same day with two owner decisions; the target document was edited afterwards, so it carries no content hash here and the next /design-review runs in full.
Prior verdict resolved: First review
Findings:
- [BLOCKING] Edge Cases (wedged body) / AC-31 / AC-32 / Game Feel: "move held 2 s without moving 0.05 m" teleports a player leaning on a rail or wall, contradicts AC-31's 10 s walker, and is a camera snap against "No snap anywhere". Fixed: wedged means overlap or all four directions blocked; the timer resets when the test fails; the placement fades (`placeholder_fade_s` 0.5 s); AC-32 rewritten with the leaning case.
- [RECOMMENDED] Rules 15 and 16 / Formula 8: `launch_point` within the berth radius makes `at_berth` true the moment boarding ends. Fixed: launch authored more than 3.75 m from the berth; AC-20 and the AC-31 scene check.
- [RECOMMENDED] Rule 11 / Visual: nothing shows the kayak's heading when the head is turned away from the bow. Fixed (owner choice): hull and bow drawn on the kayak, rod and paddle follow the view; AC-35; playtest question 6; OQ2 updated.
- [RECOMMENDED] Rules 5 and 11 / Formula 3 / OQ5: heading steps at 60 Hz while the camera must be smooth on faster displays; OQ5 said the engine reference had no interpolation note (it notes the rework, API unchanged). Fixed: Game Feel requirement, AC-36, OQ5 reworded.
- [RECOMMENDED] Rule 20 vs Pillar 2: "costs nothing" vs "a catch in progress is lost". Fixed (owner choice): the loss stands; wording now "no items and no money"; AC-37.
- [RECOMMENDED] Rule 15 / States / Dependencies: MVP Boarding had no owner for its input lock or fade (no Cutscene context without Scene Flow; "instant fade" vs "under 1 s"). Fixed: this system owns a 0.5 s placeholder fade and drops input itself until Scene Flow exists.
- [RECOMMENDED] Rule 3 / Reference values: `camera_wall_margin_m` was redundant with the capsule radius and its range exceeded it. Fixed: removed; the capsule radius is the margin, with the 21:9 near-plane check worked.
- [RECOMMENDED] Acceptance Criteria: AC-29 not reproducible; AC-4 and AC-18 loosely worded; no AC for lily pads and reeds, footsteps, at_berth at launch or smoothness. Fixed: AC-4, AC-18, AC-29 rewritten; AC-35 to AC-39 added.
- [RECOMMENDED] Formula 6: the "12 = off" claim holds only for shipped data. Fixed: reworded.
- [RECOMMENDED] Dependencies: Settings & Input is labelled Approved here and in the systems index, but its own header says In Review, re-review pending. Open: noted in Dependencies; reconcile in Settings & Input or the index.
- [NICE] Player Fantasy and Tuning Knobs absent (advisory at standard; ranges sit in Formulas and Reference values); register capsize_duration_s, capsize_grace_s and bump_velocity_cap_mps when Multiplayer is designed; say whether capsize and grace timers run on game time; "2.6 m dock" in Formula 1 Boundaries is the dock's width.
Reviewed-Content-Hash: design/registry/entities.yaml 5b3f643852b53ba064bb4a5e38ab9a0b7a6b6abf
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/settings-input.md f73341f3c98b31abfbabfca698b7a12ec80c9b6f
Reviewed-Content-Hash: design/gdd/gear-item-database.md f9d9b9f73b1190e8a437c8834d85179cce575957
Reviewed-Content-Hash: design/gdd/day-night-sleep.md d1cb6f473bab9174ff38dd428610c191aaefd203
Reviewed-Content-Hash: design/gdd/save-load.md a45ffeb3848986459010d95696027ac9fac7c1a7
Reviewed-Content-Hash: design/gdd/retro-rendering.md 681d8deebf030d3fb3f51cd19185b91d465ef184
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647

## Review — 2026-11-17 — Verdict: APPROVED
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 0 | Recommended: 8
Summary: A full re-review of the revised document. The first review's blocker (the stuck rule) and eight recommended items are verified fixed in the text. Every formula example and numeric AC recomputes, and the registry values (paddle_max_base 4.5, tip_resistance_base 5.0, field_of_view_deg 75 vertical, range 60-100) and the Gear kayak ladder match everywhere they appear (58 lines searched). No new blocker. The eight recommended items are cross-document clarifications and test tolerances: none changes the design.
Prior verdict resolved: Yes
Findings:
- [RECOMMENDED] Dependencies / header: Settings & Input is described as In Review "reconcile"; it is now Approved in its header and the index. Update the wording.
- [RECOMMENDED] Rule 2 / Edge Cases / AC-5 vs Settings & Input Edge Cases ("a binding already held when Gameplay begins"): read literally it covers W held across a phone close, which this system requires to resume walking that frame. Settings & Input's sixth review logged it open. State that the rule covers button actions only and axes read their current value, in Settings & Input, before the input story.
- [RECOMMENDED] AC-2 / AC-21: at 60 Hz the walk stop is 0.2290 m (velocity updated before the move, Godot's order) or 0.2705 m (after), against 0.25 +/- 0.02, so the natural implementation fails by 0.0003 m; AC-13's 4.04 to 4.12 m passes by 0.005. AC-21 tests exactly at 3.0 m and 1.5 m/s. Widen AC-2 to +/- 0.03 and name the integration order; release AC-21 at 5.5 m.
- [RECOMMENDED] Interactions / Dependencies (Casting & Tangle): only `aim_ray` and the hold are passed; nothing stops a cast on foot, during Boarding or while Capsized, and `fish` and `smoke` stay live (only `move`, `look` and `interact` are dropped). Pass the current state and say who gates the other actions.
- [RECOMMENDED] Reference values: `eye_height_foot_m` ranges to 1.8 m but the capsule is 1.7 m with no stated range; the eye can sit above the capsule and clip a low lintel. Constrain it to at least 0.05 m below the capsule top.
- [RECOMMENDED] Rule 17 / Edge Cases (wedged body): the stuck placement uses "the same fade as a place", but Day, Night & Sleep and Scene Flow own the fade for their placements. Say `place` never fades and callers do; add the stuck placement to the transition table.
- [RECOMMENDED] Edge Cases (wedged body): "blocked" has no probe distance and AC-32 tests only the overlap case. Define a probe value and test the four-way-blocked case.
- [RECOMMENDED] Open Question 4: the field-of-view label. Settings & Input is Approved without stating the unit (its sixth review asks for an owner decision). Decide before the Settings screen is built.
- [NICE] Say whether the capsize and grace timers run on game time; register capsize_duration_s, capsize_grace_s and bump_velocity_cap_mps when Multiplayer is designed; the document is 64 KB; Player Fantasy and Tuning Knobs remain advisory gaps.
Reviewed-Content-Hash: design/gdd/player-controller.md 793585eaf318d56602d430d3398fa3e2557daa51
Reviewed-Content-Hash: design/registry/entities.yaml 5b3f643852b53ba064bb4a5e38ab9a0b7a6b6abf
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/settings-input.md 0f032a90fc24a0a36d05b600229aa6faf9bcc60f
Reviewed-Content-Hash: design/gdd/gear-item-database.md f9d9b9f73b1190e8a437c8834d85179cce575957
Reviewed-Content-Hash: design/gdd/day-night-sleep.md d1cb6f473bab9174ff38dd428610c191aaefd203
Reviewed-Content-Hash: design/gdd/save-load.md a45ffeb3848986459010d95696027ac9fac7c1a7
Reviewed-Content-Hash: design/gdd/retro-rendering.md 681d8deebf030d3fb3f51cd19185b91d465ef184
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647
Reviewed-Content-Hash: design/art/art-bible.md c672bb8db5ffd7853f2ae61cd9ea87fccffe2492
