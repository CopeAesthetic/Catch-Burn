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
- Task: fish-database-spawn-tables GDD, 2026-11-16
- Status: In Review. /design-review 2026-11-16 (lean) gave NEEDS REVISION; 3 blockers fixed, ACs 31-37 added; 5 recommended items open (co-op inputs, states wording, Tuning Knobs table, Straight Fire vs Lost Legend wording, index dependency rows)
- File: design/gdd/fish-database-spawn-tables.md
- Sections: Summary, Overview, Detailed Design, Formulas, Edge Cases, Dependencies, Acceptance Criteria, Visual/Audio Requirements, Game Feel, UI Requirements, Cross-References, Open Questions (Player Fantasy and Tuning Knobs skipped at standard)
- Registry: 3 formulas and 7 constants added to design/registry/entities.yaml
- Next, each in a FRESH session: /design-review design/gdd/fish-database-spawn-tables.md (re-review, decides Approved); /design-review design/gdd/game-concept.md; then /design-system Gear & Item Database
- Gate: Concept -> Systems Design is CONCERNS; stage still Concept; owner has not accepted the concerns
- Git: last commit 4409c8a pushed; uncommitted since: fish-database GDD revision, systems-index status, new review log
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
