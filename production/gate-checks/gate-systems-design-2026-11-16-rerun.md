# Gate Check: Concept → Systems Design (re-run)

**Date**: 2026-11-16
**Checked by**: gate-check skill
**Settings**: `workflow: standard` · `review_mode: lean` · `qa.level: standard` · `team.size: individual`
**Earlier run**: `gate-systems-design-2026-11-16.md` — FAIL (the concept doc was missing).

## Verdict: CONCERNS

All required artifacts are present and nothing blocks entering Systems Design. Both directors returned CONCERNS. The stage stays at **Concept**: the owner has not accepted the concerns, and no stage write was made.

## Required Artifacts: 4/4 present

- [x] `design/gdd/game-concept.md` — about 2,800 words, five owner-approved pillars, a Visual Identity Anchor section, no template placeholders left. Written 2026-11-16 from the owner-approved `design/game-brief.md`.
- [x] Engine set up — `project.yaml`: Godot 4.7, GDScript.
- [x] `design/art/art-bible.md` — sections 1–4 written; 5–9 placeholders (`standard` requires 1–4).
- [x] `design/gdd/systems-index.md` — 30 systems.

Not detectable from disk: `brainstorm`, `design-review-concept`. The second is resolved below as not done.

## Recommended at `standard`

- [x] Game pillars defined — five, in the concept doc.
- [x] Visual Identity Anchor in the concept doc — one rule and three principles.
- [~] Concept prototype showing PROCEED — the browser sketch was played by the owner ("felt great"); no REPORT.md exists because a one-shot writes none.
- [ ] Concept reviewed with `/design-review` — not done.

## Quality Checks: 3/4 passing

- [x] Core loop is described and understood.
- [x] Target audience is identified (most of the player table is tagged as a studio proposal).
- [x] Visual Identity Anchor has a one-line rule and at least 2 principles.
- [ ] Game concept has been reviewed — no `/design-review` run. CONCERNS.

## Director Panel Assessment

Panel: 2 of 4 (`workflow: standard`). Creative and Art perspectives were not consulted. Raise `modes.rigor` to `full` for the complete panel.

**Technical Director: CONCERNS**
- Required artifacts all met; the concept is buildable on Godot 4.7, GDScript and Forward+; the dependency map and both circular-dependency contracts are sound.
- Retro Rendering is a Foundation system, but the PS1 look and the 3:1 shade gap are unproven in Godot. Run the engine prototype before or alongside the Retro Rendering and Shade docs, and before art production.
- The Multiplayer state and authority contract is planned but not scheduled. The Save/Load doc must settle who owns co-op save data before gameplay docs fix their state shapes.
- Nothing in `docs/engine-reference/godot/` covers GodotSteam on 4.7 (verified: no mention). Check before the Multiplayer doc.
- The concept has not been through `/design-review`.
- The three.js sketch has no PROCEED record and says nothing about Godot performance.

**Producer: CONCERNS**
- No design review of the concept; run it before the first system doc.
- The prototype result is not written down; the owner's playtest stands in for it.
- The design order conflicted with the risk table: Save/Load was 19th, after Inventory (10th) and Economy (16th), which store state (verified in the file).
- Scope against timeline: **not assessed** — no timeline exists. The effort column adds to about 30–37 sessions for the 18 MVP docs and about 51–62+ for all 30. Set at least an MVP target date before the Technical Setup gate.
- 320 fish and 8 regional shacks for one developer is a Production risk, deferred.

## Blockers

None.

## Concerns

1. Design order contradicted the risk table (Save/Load and co-op state rules too late). **Addressed after this run**: Save/Load moved to 6th in `design/gdd/systems-index.md`, with a co-op state rules section required in its doc.
2. Retro look and shade gap unproven in Godot.
3. GodotSteam on Godot 4.7 not covered by the engine reference.
4. Concept not through `/design-review`.
5. Prototype result not written down; it proves the design, not engine performance.
6. Scope against timeline not assessed: no timeline.
7. Content scope (320 fish, 8 shacks) for one developer.

## Recommendations

- Run `/design-review design/gdd/game-concept.md` before the first system doc.
- Engine prototype for the look and the shade gap (`/prototype --path engine`).
- Set an MVP target date.

Chain-of-Verification: 5 questions checked (3 by re-running a check or re-reading a file) — verdict unchanged.
