# Gate Check: Concept → Systems Design (second re-run)

**Date**: 2026-11-16
**Checked by**: gate-check skill
**Settings**: `workflow: standard` · `review_mode: lean` · `qa.level: standard` · `team.size: individual`
**Earlier runs**: `gate-systems-design-2026-11-16.md` (FAIL: concept doc missing) · `gate-systems-design-2026-11-16-rerun.md` (CONCERNS: 7 concerns)

## Verdict: CONCERNS

All required artifacts are present and nothing blocks entering Systems Design. Both directors returned CONCERNS again. The stage stays at **Concept**: the owner has not accepted the concerns, and no stage write was made. The owner chose to start system design work with the stage unchanged.

## Required Artifacts: 4/4 present

- [x] `design/gdd/game-concept.md` — reviewed and revised 2026-11-16.
- [x] Engine set up — `project.yaml`: Godot 4.7, GDScript.
- [x] `design/art/art-bible.md` — sections 1–4.
- [x] `design/gdd/systems-index.md` — 30 systems (19 MVP · 6 Vertical Slice · 4 Alpha · 1 Full Vision).

## Recommended at `standard`

- [x] Game pillars defined — five; Pillars 1 and 3 reworded with the owner's approval.
- [x] Visual Identity Anchor in the concept doc.
- [~] Concept prototype showing PROCEED — played by the owner ("felt great"); no written record.
- [~] Concept reviewed — `/design-review` ran (lean): NEEDS REVISION, 3 blocking items, all revised the same day. The revision has not been re-reviewed. The gate's bar is "not MAJOR REVISION NEEDED", which is met.

## Director Panel Assessment

Panel: 2 of 4 (`workflow: standard`). Creative and Art perspectives were not consulted. Both directors were the same agents as the first re-run, resumed with a summary of what changed and told to re-read the sections.

**Technical Director: CONCERNS**
- Resolved: the co-op state contract (Save/Load is 6th and must carry co-op state rules); the concept review; the Strains → Log → Needle → Bite loop is correctly cut by the "fish landed" event; MVP count of 19 matches the order table.
- Remaining: retro look and 3:1 shade gap unproven in Godot; GodotSteam cited but untested and absent from the engine reference; no PROCEED record for the sketch; revised concept not re-reviewed.
- New, small: the concept's Technical Risks still called the co-op mitigation "an early architecture decision". **Fixed after this run.**

**Producer: CONCERNS**
- Resolved: the design order (Save/Load 6th, ahead of Inventory 12th and Economy 18th); the scope change is accounted for in both documents.
- Partly resolved: the design review ran; its fixes are not re-reviewed. Re-review before the first system doc.
- Remaining: scope against timeline **not assessed** — no timeline or capacity figure. MVP design is now about 32–41 sessions; all 30 docs about 51–62+. The prototype result is not written down. 320 fish and 8 shacks for one developer, deferred to Production.
- New, minor: the GodotSteam check was only in the High-Risk table. **Added to the index's Next Steps after this run.**

## Blockers

None.

## Concerns

1. Retro look and 3:1 shade gap unproven in Godot.
2. GodotSteam on Godot 4.7 untested and not in the engine reference.
3. Revised concept not re-reviewed.
4. Scope against timeline not assessed: no timeline.
5. Prototype result not written down.
6. Content scope (320 fish, 8 shacks) for one developer.

## Recommendations

- Engine prototype for the look and the shade gap before or alongside the Retro Rendering (5th) and Shade Sweet Spots (11th) docs.
- Re-review the concept in a fresh session before the first system doc. The owner started the first system doc without it; that is recorded here, not approved.
- Set an MVP target date before the Technical Setup gate.

Chain-of-Verification: the verdict follows from two director CONCERNS verdicts and is not softened from a FAIL: the four required artifacts were re-checked by the artifact script after the revisions, and the directors' two new findings were verified in the files and fixed.
