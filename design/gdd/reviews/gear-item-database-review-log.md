# Review Log — Gear & Item Database

## Review — 2026-11-16 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: M
Specialists: none (lean)
Blocking items: 4 | Recommended: 7
Summary: The design holds together and respects Pillar 1's intent; smoking-item values, registry values and worked examples all check out against the content file and registry. The 4 blockers were precision gaps, fixed in the same session; the target document was edited afterwards, so it carries no content hash here and the next /design-review runs in full.
Prior verdict resolved: First review
Findings:
- [BLOCKING] Detailed Design / Acceptance Criteria: claim that no stat key touches Fish Database Formula 1 ignores the Chill-state path from chill_per_hit and chill_drain; AC-23 tested only at Chill state 1, where the bonus term is zero. Fixed: claim reworded (intended, owner choice), AC-23 now at states 1 and 4, AC-26 added.
- [BLOCKING] Formulas: ladder steps "set a flat value outright" conflicted with Formula 1, and kayak keys were percent. Fixed: ladder step is a flat modifier, best step only, base 0; kayak keys now flat.
- [BLOCKING] Formulas: "no combination more than doubles a stat" was false for flat-only keys (hookset_window, line_forgiveness). Fixed: per-key flat_max (owner choice), data rule 10, AC-27. Values are proposals (Open Question 13).
- [BLOCKING] Detailed Design: lure tag check needs a closed tag list the Fish Database does not yet define. Open: Open Question 12, for the Fish Database doc.
- [RECOMMENDED] Formulas / Data rules: per-modifier percent range and per-key override pairs were unchecked. Fixed: rules 8 and 9, AC-28.
- [RECOMMENDED] Edge Cases: mask factors applied without a smoking item. Fixed: AC-29.
- [RECOMMENDED] Acceptance Criteria: concentrate, paddling flag and retired ids had no test. Fixed: AC-30 to AC-32.
- [RECOMMENDED] Dependencies: stale systems-index paragraph. Fixed in the doc; the index rows for Player Controller, Bite Timing, Hunger, Cosmetics, Save/Load and Multiplayer still do not list this system. Open.
- [RECOMMENDED] Formulas: units of munchies, hunger, drunk and the base of sweet_spot_bonus unspecified. Open: Open Question 14.
- [RECOMMENDED] Acceptance Criteria: AC-1 cannot pass until lines, lures and kayaks have numbers. Open.
- [RECOMMENDED] Acceptance Criteria: no performance criterion (no budget set). Open.
- [NICE] Tuning Knobs and Player Fantasy absent (advisory at standard); one-line API shape for the stat request.
Reviewed-Content-Hash: design/registry/entities.yaml 53310e8f4ffd8d6c8edc4bd204b17e8acbe129c3
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/fish-database-spawn-tables.md ba31a2e454b2a15f54816c31ce0a8e53501d5c94
Reviewed-Content-Hash: design/gdd/game-concept.md 2052f58158fb60f9ef155304c441f1be81bfe77a
Reviewed-Content-Hash: design/game-brief.md 65a3a063f6e7dcc788e706bbda7a276206fe9d42
Reviewed-Content-Hash: design/gdd/systems-index.md 62809b73ab01f8e492a389ad0bb8c073cc7630f7
Reviewed-Content-Hash: design/catch-n-burn/content-areas-fish-strains.md cac39293f21fa6492b97266fc89eb02fe647ac97

## Review — 2026-11-16 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: M
Specialists: none (lean)
Blocking items: 2 | Recommended: 5
Summary: Re-review. The first review's fixes held: flat ceilings, percent ranges, ladder semantics, the mask rule and the Chill-state path are correct and tested, every registry value matches, and AC-23's bands match Fish Database AC-17 and AC-18. Both blockers came from the Fish Database changing after Gear's revision (request contract via Bite Timing; closed tag list), and both were fixed in the same session as wording and AC edits. At the owner's request the recommended and nice-to-have items were folded in afterward too; only the carried-over items that need other docs or owner numbers stay open. The target document was edited afterwards, so it carries no content hash here and the next /design-review runs in full.
Prior verdict resolved: Yes (prior blocker 4, the closed tag list, is now closed by Fish Database rule 9)
Findings:
- [BLOCKING] Detailed Design / Dependencies / Acceptance Criteria: lure bias sent straight to the Fish Database (line 87, Interactions, Dependents, AC-24), contradicting the approved contract that Bite Timing assembles the catch request. Fixed: routed through Bite Timing, AC-24 rewritten (plus empty lure slot).
- [BLOCKING] Detailed Design / Open Questions: data rule 4 and Open Question 12 still said the tag list was open. Fixed: rule 4 cites Fish Database rule 9, OQ 12 closed, Fish Database state shown as Approved.
- [RECOMMENDED] Formulas / Edge Cases: Loop check and the Dab Rig + Gas Mask lean omit the YAK LOCK bonus (guaranteed Epic or Legendary at tier 3–4); AC-23 should say no flags raised. Fixed: Pillar 1 note, loop check and lean list name the bonus; Open Question 15 for the Chill Meter doc; AC-23 says no flag raised.
- [RECOMMENDED] States and Transitions: load order unstated; rule 4 needs the Fish Database Ready before Gear's Checking state. Fixed: load-order paragraph, Unloaded row, AC-34.
- [RECOMMENDED] Acceptance Criteria: AC-16 asserts the Rope Stringer (5), which Open Question 1 leaves unconfirmed. Fixed: AC-16 and the Gaps list say it waits on Open Question 1.
- [RECOMMENDED] Dependencies: systems-index rows 1, 9, 12, 23, 24 still do not list Gear; row 9 (Bite Timing) now consumes the lure bias. Fixed: rows and layer lists updated; tracker counts corrected (2 started, 2 reviewed, 1 approved).
- [RECOMMENDED] Formulas / Acceptance Criteria: carried over — meter-key units (OQ 14), AC-1 cannot pass yet, no performance criterion. Open (need the Hunger and Bite Timing docs, owner numbers, and a budget: Open Questions 2–4, 6, 10, 14).
- [NICE] AC-21's co-op note is untested; the lure bias type is unstated; the Πfactor ceiling (16×) is not stated; Tuning Knobs and Player Fantasy absent (advisory). Fixed: AC-21's note moved to a real test (AC-33); bias is a decimal; factor product bounds stated; both sections added (Player Fantasy drawn from existing text).
Reviewed-Content-Hash: design/registry/entities.yaml 53310e8f4ffd8d6c8edc4bd204b17e8acbe129c3
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/fish-database-spawn-tables.md c1faa794e8bf03ac2e00c85ded440ad642591839
Reviewed-Content-Hash: design/gdd/game-concept.md 2052f58158fb60f9ef155304c441f1be81bfe77a
Reviewed-Content-Hash: design/game-brief.md 65a3a063f6e7dcc788e706bbda7a276206fe9d42
Reviewed-Content-Hash: design/gdd/systems-index.md 7f1c0313c35cf2a1346b01dfed0d5bcbe9d38e36
Reviewed-Content-Hash: design/catch-n-burn/content-areas-fish-strains.md cac39293f21fa6492b97266fc89eb02fe647ac97

## Review — 2026-11-16 (third review) — Verdict: APPROVED
Review mode: lean · Workflow: standard
Scope signal: M
Specialists: none (lean)
Blocking items: 0 | Recommended: 5
Summary: The prior blockers and recommended items held: the lure bias reaches the Fish Database through Bite Timing, the tag list is closed by Fish Database rule 9, the formula, examples and AC arithmetic match the registry, and the Pillar 1 line is tested at a fixed Chill state with no flag raised. Run in the same session that wrote the revisions, so not independent. Afterwards, at the owner's request, recommended items 1–4 were fixed and Open Question 1 was closed; those edits, and same-day edits to the Fish Database, brief and content file, came after this review, so those files carry no content hash here and the next /design-review runs in full.
Prior verdict resolved: Yes
Findings:
- [RECOMMENDED] Dependencies: the Fish Database was listed as a soft dependent, making a loop with the approved doc ("depends on nothing"). Fixed after approval: row marked Contract only.
- [RECOMMENDED] Formulas / Tuning Knobs: flat_max had no safe range or load check. Fixed after approval: hookset_window 0.1–1.0 s, line_forgiveness 1–4 (owner decision), rule 10, AC-27.
- [RECOMMENDED] Detailed Design: the resolve call had no stated shape. Fixed after approval: resolve(stat_key, base, loadout), refusals before Ready or for an unknown key, AC-34 and AC-36.
- [RECOMMENDED] Acceptance Criteria: AC-5 and AC-34 needed a named Fish Database fixture; rule 6 had no negative test. Fixed after approval: fixture and float tolerance stated, AC-35.
- [RECOMMENDED] Acceptance Criteria / Open Questions: carried over, needing other docs or owner numbers — meter-key units (OQ 14), AC-1 numbers, performance budget (OQ 10), integration ACs. Open. Open Question 1 (stringer ladder and Rope Stringer starter) closed by the owner after approval.
- [NICE] Float tolerance (fixed), food amounts read straight from the record (fixed), Foundation heading in the systems index (fixed: "no hard dependencies"), doc size over 40 KB (open).
Reviewed-Content-Hash: design/registry/entities.yaml 53310e8f4ffd8d6c8edc4bd204b17e8acbe129c3
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 2052f58158fb60f9ef155304c441f1be81bfe77a
