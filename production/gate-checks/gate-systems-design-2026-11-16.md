# Gate Check: Concept → Systems Design

**Date**: 2026-11-16
**Checked by**: gate-check skill
**Settings**: `workflow: standard` · `review_mode: lean` · `qa.level: standard` · `team.size: individual`

## Verdict: FAIL

One required artifact is missing. The stage stays at **Concept**.

## Required Artifacts: 3/4 present

- [ ] `design/gdd/game-concept.md` — **MISSING**. The owner-approved concept is `design/game-brief.md`, the one-page format the `minimal` tier uses. At `standard` the gate requires `game-concept.md`.
- [x] Engine set up — `project.yaml` has `engine.name: Godot`, version 4.7, GDScript.
- [x] `design/art/art-bible.md` — exists; sections 1–4 written (about 2,400 words), sections 5–9 are placeholders. `standard` requires 1–4.
- [x] `design/gdd/systems-index.md` — exists; 30 systems, all Not Started.

Not detectable from disk (the catalog declares no artifact for them): `brainstorm`, `design-review-concept`. Both are resolved below, not assumed.

## Recommended at `standard` (absent = CONCERNS, never a blocker)

- [ ] Game pillars defined — none exist, in a concept doc or in `design/gdd/game-pillars.md`.
- [ ] Visual Identity Anchor section in the concept doc — absent there. A visual rule and three supporting principles do exist, in `design/art/art-bible.md` section 1.
- [~] Concept prototype with a REPORT.md showing PROCEED — the browser sketch `prototypes/catch-n-burn/` exists (tag `one-shot/catch-n-burn`) and the owner played it on 2026-11-16 and said the loop "felt great". It has no REPORT.md because a one-shot writes none. Treated as "proven by other means".

## Quality Checks: 2/4 passing

- [x] Core loop is described and understood — `design/game-brief.md`, "Core loop".
- [x] Target audience is identified — `design/game-brief.md`, "Who it's for / what they feel". That line is still tagged as a studio proposal, not the owner's words.
- [ ] Game concept has been reviewed — no `/design-review` has been run. CONCERNS; it cannot run until the concept doc exists.
- [ ] Visual Identity Anchor contains a one-line rule and at least 2 principles — not in a concept doc (see above). CONCERNS.

## Blockers

1. **No `design/gdd/game-concept.md`.** Write it from the approved brief in the studio's concept template, then re-run this gate.

## Recommendations

- Define 3–5 game pillars in the concept doc. They need the owner's input.
- Carry the art bible's visual rule and principles into the concept doc as its Visual Identity Anchor.
- Run `/design-review design/gdd/game-concept.md` once it exists.

## Director Panel

**Not run.** At `review_mode: lean` and `workflow: standard` the panel is `technical-director` and `producer` (2 of 4; Creative and Art perspectives are not consulted at this tier). The directors were not spawned on this run because the gate already fails on a required artifact and their verdict could not change the outcome. This is a skipped step, not a READY: the panel must run on the re-check.

## Not run

- Test suite, performance and localization checks: this gate's checklist has none.
- `docs/consistency-failures.md`: does not exist, so there was no prior-conflict context to carry.

Chain-of-Verification: 5 questions checked (3 by re-reading files or re-running a check) — verdict unchanged.
