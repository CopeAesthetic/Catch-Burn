# Active Session State — Catch-Burn (setup/studio-template)

<!--
  HOW THIS FILE WORKS. Read this before editing it.

  This file has TWO regions and they are not interchangeable:

    1. The CHECKPOINT region below (STATUS + CHECKPOINT blocks) is the part
       machines read. session-start.sh shows it verbatim in the context, so it is
       BOUNDED BY CONSTRUCTION: keep it under ~25 lines. It is OVERWRITTEN on
       every update, never appended to.

    2. Everything after the closing CHECKPOINT marker is free-form narrative for
       humans and for a returning agent that wants detail. No hook ever injects
       it, so it may grow — but see Rotation below.

  Why the split exists: one append-only file doing both jobs grows without
  bound, and every consumer then reads a different slice of it: the top, the
  bottom, or a block nothing writes. They disagree because there is no contract
  to agree on. With the named regions, every consumer reads the same part.

  ROTATION. When the narrative below grows past ~200 lines, move it to
  `production/session-logs/` and start it fresh:
      bash .claude/scripts/rotate-session-state.sh
  Nothing is lost — and the commit history already records most of what the
  narrative repeats.
-->

<!-- STATUS -->
Epic:
Feature:
Task:
<!-- /STATUS -->

<!-- CHECKPOINT -->
- Task: Player Controller GDD, 2026-11-17 (/design-system, guided, lean, standard workflow; 7th in design order)
- Status: Complete, Designed (CD-GDD-ALIGN skipped, lean); NOT yet reviewed -> /design-review design/gdd/player-controller.md in a FRESH session
- Sections: Summary, Overview, Detailed Design (rules 1-21, states, interactions), Formulas (8 + reference values), Edge Cases, Dependencies, Visual/Audio, Game Feel, UI Requirements (none), Cross-References, Acceptance Criteria (AC-1..34 + 4 qa gaps), Open Questions (9)
- Done 2026-11-17 (owner-approved): registry +2 (paddle_max_base 4.5, tip_resistance_base 5.0) + stat_value referenced_by, validate clean (36); index row 1 Designed + soft deps Scene Flow, Multiplayer, tracker 7 started / MVP 6/19; Gear kayak ladder filled + its OQ3 closed; Save/Load downstream row for PC
- Open: OQ4 FOV vertical vs Settings row wording; OQ5 kayak body + physics interpolation ADR before first story; OQ6 impulse/capsize (Multiplayer); OQ8 four berths + guest join point. Next in design order: Interaction (E) (8th)
- Owner decisions 2026-11-17: kayak = free look (head_yaw +-90, A/D turns kayak 90 deg/s); on foot strafe, no jump/sprint/crouch; tip/bump here, provisional (capsize 3 s, nothing lost, 4 s grace); kayak steps Sit-on-Top +0.75 m/s / +1.5 tip, Pedal +1.5 / +3.0 (base 4.5 m/s, tip 5.0). FOV is vertical
- Context read: S&I (move/look/FOV contracts, pitch clamp is ours), Gear (paddle_speed, tip_resistance bases are ours; Gear OQ3 wants numbers), DNS (wake in bed, kayak back to dock), Save/Load (position never saved), RR (camera + FOV are ours; cast_max 30 m provisional), sketch (accel 5, max 4.5 m/s, drag 1.1, turn 1.7 rad/s). Engine gaps: kayak-on-water physics not sourceable (ADR flag), interpolation 4.5 (MEDIUM)
- Task: Save/Load (Repack) GDD, 2026-11-17 (/design-system, guided, lean; same session as the RR re-review)
- Status: Complete, Designed (CD-GDD-ALIGN skipped, lean); NOT yet reviewed -> /design-review design/gdd/save-load.md in a FRESH session
- File: design/gdd/save-load.md. Sections: Summary, Overview, Detailed Design (rules 1-18, states, interactions), Formulas (2), Edge Cases, Dependencies, Visual/Audio, Game Feel, UI Requirements, Cross-References, Acceptance Criteria (AC-1..25), Open Questions (4)
- Owner decisions 2026-11-17: 3 slots; saves only at wake-up + Turn & Burn (quit request outside overnight/load = Turn & Burn); load mid-day saves into the pond's shack; guest records by Steam ID in host's save, first join = starting kit + empty log; guest_record_cap 24 (least-recent last_seen_s removed); play time = running time, 1 s/frame cap
- Done: registry +2 (save_slot_count 3, guest_record_cap 24; validate clean); index row 24 Designed + tracker (6 started, VS 1/6)
- Open: OQ1 world vs player sections (Inventory, Economy, Deliveries, Travel); OQ2 Steam Cloud/offline; OQ3 guest progress home (1.0); OQ4 save format ADR. Settings & Input should list Save/Load as soft dependent (quit requests). UX flag: slot list + save notices
- Task: second /design-review of Retro Rendering, 2026-11-17 (lean, guided; fresh session; branch setup/studio-template)
- Verdict: APPROVED, 0 blockers, 3 recommended; all 10 first-review findings verified resolved; every worked number recomputed and reproduces
- Recommended (3), applied AFTER approval, not re-reviewed: load check C >= 3.03 (quant_margin 0.03), AC-12 capture times, rule 15 gap match. Nice-to-haves and detail: retro-rendering.md review log
- Files: retro-rendering.md (Approved + 3 fixes), review log, systems-index row 6 Approved + tracker, registry shade_gap_min note
- Mismatch noticed: settings-input.md header says In Review, index row 4 says Approved (S&I session's call)
- Still open in GDD: OQ2 (engine prototype + ADR), 4, 6, 7, 8. sunrise_hour / night_start_hour still unregistered (DNS's job)
- Next, in FRESH sessions: pending re-reviews of settings-input.md and day-night-sleep.md; then /design-system Save/Load (Repack) (6th)
- Gate: Concept -> Systems Design is CONCERNS; stage still Concept
- Git: nothing committed. Uncommitted: retro-rendering.md (+review log), settings-input.md (+log), day-night-sleep.md (+log), art-bible.md, engine-reference rendering.md, systems index, registry, this file
<!-- /CHECKPOINT -->

---

## Notes

### 2026-11-17 — Retro Rendering first-review checkpoint (replaced by the re-review session)

- Task: /design-review of Retro Rendering, 2026-11-17 (lean, guided; fresh session; branch setup/studio-template)
- Verdict: NEEDS REVISION, 1 blocker + 9 recommended, all applied same day; GDD status In Review, re-review pending in a FRESH session
- Blocker: CRT scanlines darkened sRGB-encoded values but Formula 5 counted m=0.92 as linear (real ~0.85) -> Sunrise/Sunset 2.94/2.95 at Brightness 0.8 + CRT on. Owner fix: CRT darkens in linear light (decode, darken, re-encode); worst case back to 3.05/3.12/3.06; scanlines subtler on screen (~12% Deck, ~16% 1080p, cap ~21%)
- Recommended applied: post-pass order now blur > Brightness > vibrance > dither; CRT max(scale,1); h4 range 23.4; Formula 1 integer W_int + scale_x fill (no crop); rule 15 region Lit/Shade Y match NE within 0.005 (art bible "identical gap"); AC-1 opaque-pixel mask; AC-25 4.5:1 label contrast; blur kernel + yak_blur_taps; unbiased Bayer offset; ACs 4, 11, 12, 17, 18, 23 updated
- Registry: sun_direction (+sunrise_hour) and shade_gap (vars f_c, b, m; linear CRT note) revised; validate clean. sunrise_hour / night_start_hour still unregistered (DNS's job)
- Files: design/gdd/retro-rendering.md, design/gdd/reviews/retro-rendering-review-log.md (new; GDD hash deliberately not stamped), systems-index row 6 In Review + tracker 5 reviewed, registry
- Not done (nice-to-have): vibrance hue drift ~6 deg untested; AC-19 "waits on Multiplayer"; Player Fantasy / Tuning Knobs sections; Dependencies' S&I status label
- Still open in GDD: OQ2 (engine prototype + ADR), 4, 6, 7, 8
- Next, in FRESH sessions: /design-review design/gdd/retro-rendering.md (owner's pick); pending re-reviews of settings-input.md and day-night-sleep.md; then /design-system Save/Load (Repack) (6th)
- Gate: Concept -> Systems Design is CONCERNS; stage still Concept
- Git: nothing committed. Uncommitted: retro-rendering.md (+review log), settings-input.md (+log), day-night-sleep.md (+log), art-bible.md, engine-reference rendering.md, systems index, registry, this file

### 2026-11-17 — Retro Rendering design checkpoint (replaced by the review session)

- Task: Retro Rendering GDD, 2026-11-17 (/design-system, guided, lean; branch setup/studio-template)
- Status: Complete, Designed (CD-GDD-ALIGN skipped, lean); NOT yet reviewed
- File: design/gdd/retro-rendering.md
- Sections: Summary, Overview, Detailed Design (rules 1-16, states, interactions), Formulas (8), Edge Cases, Dependencies, Visual/Audio, Game Feel, UI Requirements, Cross-References, Acceptance Criteria (AC-1..31), Open Questions (9)
- Owner decisions 2026-11-17: shade = Shade Sweet Spots' shapes filled with Shade Water under the same light (no engine shadows); 3:1 gap = contrast ratio (Y1+0.05)/(Y2+0.05); 270 lines tall, width follows aspect, nearest fill; sun path owned here (Shade reads it); CRT over whole frame; gap holds at every Brightness and CRT state, so water light >= 0.90 of noon while shade exists
- Key consequence: fog must start past the longest cast (fog_start 32 m vs provisional cast_max 30 m)
- Done: registry +6 (sun_direction, shade_gap, internal_height, shade_gap_min, fog_start_m, max_local_lights; validate clean); index row 6 Designed + soft deps DNS, Casting; tracker counts corrected to 5 started / 4 reviewed / 5 of 19 MVP
- Open items handled 2026-11-17: OQ1 closed (DNS Interactions + Dependencies now publish dawn_end/dusk_start/night_start hours); OQ3 closed (owner: sky keys 10-15% sat; art bible Fog Pale note); OQ5 closed (owner: rule 17 Deck fallback, blur taps then lights); OQ9 closed (NE starting keys in Visual/Audio, worst-case C 3.05); OQ2 narrowed (4.7 docs verified, added to engine-reference rendering.md; Forward+ vertex shading, scaling_3d range, Compositor resolution still need the prototype). Still open: OQ2, 4, 6, 7, 8
- Next: /design-review of retro-rendering.md started in a fresh session 2026-11-17; pending re-reviews of settings-input.md and day-night-sleep.md; then /design-system Save/Load (Repack) (6th)
- Day, Night & Sleep (prev task): reviewed 2026-11-17 NEEDS REVISION, 4 blockers fixed, re-review pending; its registry values still unregistered; HUD, Flip Phone, Player Controller, Chill index rows still lack it
- Gate: Concept -> Systems Design is CONCERNS; stage still Concept
- Git: uncommitted: retro-rendering.md (new), settings-input.md (+review log), day-night-sleep.md (+review log; Retro Rendering interface rows edited), art-bible.md (Fog Pale note), engine-reference rendering.md, systems index, registry, this file

### 2026-11-17 — Day, Night & Sleep checkpoint (moved here by the Retro Rendering session)

- Task: Day, Night & Sleep GDD, 2026-11-17 (branch setup/studio-template)
- Status: Complete, Designed (lean; CD-GDD-ALIGN skipped); NOT yet reviewed
- File: design/gdd/day-night-sleep.md
- Sections: Summary, Overview, Detailed Design (rules 1-10, states, interactions), Formulas (4), Edge Cases, Dependencies, Visual/Audio, Game Feel, UI Requirements, Cross-References, Acceptance Criteria (AC-1..22), Open Questions (8)
- Owner decisions 2026-11-17: co-op everyone sleeps together (shared host clock); two warnings 180 s / 60 s before midnight; bed at any hour; night = no shade + slower bites and begins at the first warning. My picks to confirm: day_length_s 1080, grace 20 s, overnight order spoil>payout>deliveries>new day>wake
- Not done: registry (day_length_s, warn1_lead_s, warn2_lead_s, midnight_grace_s NOT registered); index row 3 still Not Started and tracker not updated (only dependency columns edited); Chill, Retro Rendering, HUD, Flip Phone, Player Controller rows lack Day, Night & Sleep
- Open: beds in shared shack; blackout wake (Hunger GDD); sleep-on-demand resets; Cooler preserving fish; host leaves; day length playtest; where time shows. UX flag: warning banners, co-op wait list, overnight card
- Settings & Input: third /design-review 2026-11-16 NEEDS REVISION, 3 blockers fixed; re-review pending in a fresh session
- Next, in FRESH sessions: /design-review design/gdd/settings-input.md; /design-review design/gdd/day-night-sleep.md; then /design-system Retro Rendering (5th)
- Gate: Concept -> Systems Design is CONCERNS; stage still Concept
- Git: uncommitted: settings-input.md (+review log), day-night-sleep.md (new), systems index, registry (S&I only), this file

### 2026-11-16 — previous checkpoints (kept for history)

- Foundation GDDs closed out + owner decisions (branch setup/studio-template).
  Fish Database and Gear & Item Database both Approved (lean); post-approval
  edits NOT re-reviewed.
- Fish DB edits: Formula 1 missing-rarity term (Chill also lifts rarities with
  unlogged entries; Top Shelf ~22 -> ~18 bites); Formula 5 + knob
  yak_legendary_share 0.5 (0.2-0.8); rule 11 reference check; one-off Lost
  Legends need no tag; AC-33 at 100k; AC-45..49; Pond 1 tags in content file.
- Owner decisions: tags = lure families (bass, panfish, catfish, pike, trout);
  perf 60 fps Steam Deck (project.yaml performance); meters 0-100 points;
  sweet_spot_bonus applies to the 3 s gap; Lost Legends: 3 verified, 3 replaced
  with real records, 2 resized, Abuelo Guavina stays invented.
- Gear: recommended items 1-4 done after approval; OQ 1 closed (stringer
  5/8/12/18, Rope Stringer starter).
- Open: optional fresh re-review of both GDDs; Gear AC-1 needs item numbers;
  integration ACs wait on other docs; Fish log has no 4th-review entry.
- This file previously held two copies of its header and checkpoint (the first
  one malformed); rewritten into one on 2026-11-16 by the Settings & Input
  session.

<!--
  FIELD NOTES

  STATUS block
    Drives the status-line breadcrumb (`Combat System > Melee > Hitboxes`), and
    only at Production / Polish / Release stage. All three fields are optional —
    leave a field blank when it does not apply, and blank all three when there is
    no active focus. Do not delete the markers themselves — `statusline.sh`
    expects them to exist.

  CHECKPOINT block
    The recovery payload. `session-start.sh` shows it when a previous session
    left state, and again after a compaction (SessionStart runs then too).
    It reads THIS region and nothing else, which is what keeps the cost fixed
    no matter how long the narrative gets.

    Keep `Branch` current. This file is not committed, so it stays put when you
    switch branches; session-start.sh compares `Branch` with the branch you are
    on and adds one line when they differ.

    Write it so a cold reader can resume without reading anything else. "Current
    task: fixing the thing" is useless; "Current task: adding wall-jump to
    player_movement.gd" is not.
-->

<!-- CONSISTENCY-CHECK: 2026-11-17 | GDDs checked: 4 | Conflicts found: 0 | Log: docs/consistency-failures.md -->

<!-- CONSISTENCY-CHECK: 2026-11-17 | GDDs checked: 5 | Conflicts found: 0 | Log: docs/consistency-failures.md -->
- Consistency check 2026-11-17 (PASS, 0 conflicts) left registry work for the Retro Rendering session: sun_direction variables lack sunrise_hour and expression hard-codes 6; shade_gap variable names (fog_at_cast_range, brightness, crt_mean_darkening) differ from Formula 5 (f_c, b, m, gap_min, k); night_start_hour (DNS Formula 2, default 21.0, 16.5-22.5) and sunrise_hour (6.0) are shared by DNS and Retro Rendering but unregistered.

<!-- CONSISTENCY-CHECK: 2026-11-17 | GDDs checked: 6 | Conflicts found: 0 | Log: docs/consistency-failures.md -->
- Consistency check 2026-11-17 (6 GDDs incl. save-load.md; PASS, 0 conflicts, 0 stale): registered sunrise_hour (constant 6.0) and night_start_hour (formula) with source day-night-sleep.md (owner OK); registry 30 entries, validate clean.

<!-- CONSISTENCY-CHECK: 2026-11-17 | GDDs checked: 6 | Conflicts found: 0 | Log: docs/consistency-failures.md -->

<!-- CONSISTENCY-CHECK: 2026-11-17 | GDDs checked: 7 | Conflicts found: 0 | Log: docs/consistency-failures.md -->
