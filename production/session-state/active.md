# Active Session State — [project or branch]

<!--
  HOW THIS FILE WORKS. Read this before editing it.

  This file has TWO regions and they are not interchangeable:

    1. The CHECKPOINT region below (STATUS + CHECKPOINT blocks) is the part
       machines read. session-start.sh shows it verbatim in the context, so it is
       BOUNDED BY CONSTRUCTION: keep it under ~25 lines. It is OVERWRITTEN on
       every update, never appended to.

    2. Everything after `<!-- /CHECKPOINT -->` is free-form narrative for humans
       and for a returning agent that wants detail. No hook ever injects it, so
       it may grow — but see Rotation below.

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
- Task: Foundation GDDs closed out, 2026-11-16 (branch setup/studio-template)
- Status: Fish Database Approved (4th review, lean); Gear & Item Database Approved (3rd review, lean, same session as its revisions, so not independent)
- Files: design/gdd/fish-database-spawn-tables.md, design/gdd/gear-item-database.md; both have all 8 sections
- After approval (not re-reviewed): Gear recommended items 1-4 (Fish DB is a contract; flat_max ranges 0.1-1.0 s and 1-4; resolve(stat_key, base, loadout); fixture, AC-35, AC-36); Gear OQ 1 closed (stringer 5/8/12/18, Rope Stringer starter); Fish Tuning Knobs and Player Fantasy added; brief kit and Straight Fire wording; index dependency rows and counts
- Owner decisions today: flat_max safe ranges; stringer ladder and Rope Stringer starter; brief Straight Fire excludes Lost Legends
- Open: Gear OQ 14 (meter units), AC-1 needs item numbers, no performance budget (OQ 10), integration ACs wait on other docs; Fish log has no entry for its 4th review
- Next, in a FRESH session: /design-system Settings & Input (3rd in design order)
- Gate: Concept -> Systems Design is CONCERNS; stage still Concept
- Git: nothing committed this session; uncommitted: both GDDs, Gear review log, systems index, brief, content file, this file
<!-- /CHECKPOINT -->

---

## Notes

[Free-form. Decisions and their rationale, what was tried and rejected, context
that would be expensive to reconstruct. Not machine-read — write for the person
or agent picking this up cold.]

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
