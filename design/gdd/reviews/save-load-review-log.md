# Review Log — Save/Load (Repack)

## Review — 2026-11-17 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean mode)
Blocking items: 3 | Recommended: 10
Summary: A strong first draft: atomic writes with a backup, a clear host-owns-the-save co-op rule, and a guest's own slots never touched. The blockers are boundary precision, not direction: the wake-up save sits inside the overnight handover that rule 6 says cannot save, the "current pond's shack" contradicts the brief and Day, Night & Sleep (the shack belongs to the area), and Settings & Input's quit path still says the game ends after rule 20 step 5 with Save/Load "not a dependency".
Prior verdict resolved: First review
Findings:
- [BLOCKING] Rules 5/6: the wake-up save fires at DNS rule 8 step 4, inside the overnight (Cutscene / Loading), while rule 6 forbids saves and makes a quit exit unsaved during it; the quit-vs-save boundary is undefined
- [BLOCKING] Rule 7 / AC-6 / interactions / edge case: "the current pond's shack" contradicts the brief (each pond is a level; the shack is in the home pond) and DNS rule 9 (the current area's shack)
- [BLOCKING] Dependencies / Settings & Input: rule 20 says a quit request ends the game after step 5 and lists Save/Load as "not a dependency"; this GDD runs the save after rule 20 and before the exit
- [RECOMMENDED] Rule 7: Turn & Burn then Repack is a free trip home that dodges midnight spoilage (owner to accept or change)
- [RECOMMENDED] Rules 10/11: a backup load leaves the damaged primary to be demoted over the only good backup at the next write
- [RECOMMENDED] Formula 1 / rule 18: one eviction per join never re-enforces a lowered cap; rule 18 omits "not in the current session"
- [RECOMMENDED] States / rule 15: joining from In Play with unsaved solo progress is unspecified; Repack with only Damaged slots unspecified
- [RECOMMENDED] Rule 8: the header's host Steam ID has no consumer or mismatch behaviour
- [RECOMMENDED] Rules 9/11 / AC-15: per-section versions have no upgrade rule or test
- [RECOMMENDED] Formula 2: play time while in the overnight or a scene load is unspecified
- [RECOMMENDED] Acceptance Criteria: no AC for joining a running save, quit during a save, missing folder, removed pond, offline profile, guest rejoin before the next save; "Check" type undeclared; AC-23 cap-2 clause and AC-20 last clause ambiguous
- [RECOMMENDED] Rule 2 / rule 10: after New Sesh replaces a slot, the old game becomes the new game's backup, so a damaged new save loads another game
- [RECOMMENDED] Tuning Knobs: absent (advisory at standard); the Formulas cite a save config resource with no knob table
Reviewed-Content-Hash: design/gdd/save-load.md 73a0a557abe22a528f8ac8bcb25ea6ebd6ecc527
Reviewed-Content-Hash: design/registry/entities.yaml 28ef26aa2f19078a4399bb4a163acd36408b2862
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/day-night-sleep.md 7a95b329c588832bc6a825f510da2f4bf2555368
Reviewed-Content-Hash: design/gdd/gear-item-database.md 6a79e0d13d6c0c35587ef5e32c5b7617bb807428
Reviewed-Content-Hash: design/gdd/settings-input.md e2352e4194de39a95a89f34e36e758bc2700a25f
Reviewed-Content-Hash: design/gdd/fish-database-spawn-tables.md 3cf03b69015cd1a77a878f22618d49d29c5fd4c7
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
Reviewed-Content-Hash: design/game-brief.md 50dc6ce5ae4283ef7b7c16414c96c2d32d2db647
