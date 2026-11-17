# Review Log — Day, Night & Sleep

## Review — 2026-11-17 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean mode)
Blocking items: 4 | Recommended: 10
Summary: The design is sound and consistent with the brief, the concept, Settings & Input, Fish Database and Gear. The four blockers were specification defects: wrong numbers in Formula 2 and AC-4, a grace rule written against an interface (`time_until_catch_ends`) that no upstream system can supply, a state machine with no Paused-during-grace path, and contradictory overnight timing. All four were revised the same day, so the document differs from the version reviewed.
Prior verdict resolved: First review
Findings:
- [BLOCKING] Formula 2 / AC-4: `warn2_hour` at `day_length_s` 1440 is 23.25, not 23.5; the `night_start_hour` (16.5–22.5) and `warn2_hour` (21.0–23.625) ranges were wrong, so some in-range knob pairs are refused by the load check. Fixed: AC-4, both ranges, the load-check paragraph, and AC-5 (720 / 300 refusal).
- [BLOCKING] Rule 6 / Formula 3 / AC-9: `time_until_catch_ends` is not supplied by any upstream system and was not in the Interactions table; a catch began at the hook-set, so a bite inside the 1.5 s FISH ON window at midnight got no grace. Fixed (owner choice "from the bite"): per-player `catch_in_progress` flag plus a game-time grace timer; Formula 3, Interactions, Dependencies, AC-9.
- [BLOCKING] States / rule 6: a solo Settings pause during Midnight Grace was unspecified, so a real-time grace timer could cancel a frozen catch. Fixed: the grace runs on game time; Midnight Grace ↔ Paused rows, an edge case, and an AC-9 clause.
- [BLOCKING] Game Feel / AC-22: the parts sum to 3.25 s but the cap said 4.0 s, and "fully black" included the fades. Fixed (owner choice "cap at 3.25 s"): Game Feel wording (steps 1–4 under the hold, step 5 during the fade up) and AC-22 rewritten.
- [RECOMMENDED] Rule 4 / co-op: a player in bed gets neither warning and can get up after Night with no warning; show the latest missed warning once on getting up.
- [RECOMMENDED] Dependencies: a Core system reads `catch_in_progress` from Gameplay systems while Bite Timing reads `is_night` back, a soft loop; invert so the catch systems push a flag, and update index row 3's soft links.
- [RECOMMENDED] Rule 2 / co-op: whose Cutscene / Loading context stops the host clock (the kayak push-off) is unstated; a guest's context should never stop it.
- [RECOMMENDED] Warnings vs travel: ponds 2–4 are separate levels and The Drop Box is in the shack; require `warn1_lead_s` to cover the worst-case return trip and assign it to Scene Flow and level design as an Open Question.
- [RECOMMENDED] Cross-document drift: Settings & Input rule 17 and its dependency table list "spoilage" as running on game time (here it happens only at the overnight); the concept (line 270) and the brief still mark night-without-shade, slower bites and bed-at-any-hour as PROPOSED.
- [RECOMMENDED] Formula 1 example: at `day_length_s` 1440 an in-game hour is 80 s, not 75 s.
- [RECOMMENDED] Registry and index: register `day_length_s`, `warn1_lead_s`, `warn2_lead_s`, `midnight_grace_s`; set the index estimate (S) against the L scope signal; add this system to the rows for Chill, Retro Rendering, HUD, Flip Phone and Player Controller; update the progress tracker.
- [RECOMMENDED] Rule 10: state that no save is written during the overnight (AC-17 relies on it), and whether `phase_changed` fires on load.
- [RECOMMENDED] Visual/Audio: the "two in-game hours" Dawn and Dusk blend holds only at the defaults (Dusk is 0.5 to 2.75 hours across the day-length range); define the blend by fraction of the phase.
- [RECOMMENDED] Tuning Knobs and Player Fantasy sections absent (advisory at `standard`); a Tuning Knobs section is the place for the interplay constraints (warn lead vs return time, grace vs needle length, day length vs economy).
- [NICE] AC-21 "differ" could be a colour-delta threshold; ask Bite Timing to cap its night multiplier so the last three minutes are not also the slowest bites.
Note: the GDD's own hash is deliberately not stamped below. The file was revised after this review, so the next `/design-review` must read it as NEW and run in full.
Reviewed-Content-Hash: design/registry/entities.yaml 6d69f176ab1984e2db7ff77ad031cc11559dfc9c
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647
Reviewed-Content-Hash: design/gdd/settings-input.md fd61fc07df24b4d53768cf21a00e1a700f2a2800
Reviewed-Content-Hash: design/gdd/fish-database-spawn-tables.md 3cf03b69015cd1a77a878f22618d49d29c5fd4c7
Reviewed-Content-Hash: design/gdd/gear-item-database.md 6a79e0d13d6c0c35587ef5e32c5b7617bb807428
Reviewed-Content-Hash: design/art/art-bible.md 4acf62dd6dd561cdd0470a8d195238df1c7f39e3
Reviewed-Content-Hash: design/gdd/systems-index.md 80ee3f1b4f4879e9c77fcb4ab33636caae806bb6
