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
