# Review Log: Fish Database & Spawn Tables

## Review — 2026-11-16 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 3 | Recommended: 7
Summary: Sound design: odds, pacing (31.1 bites per pond at Chill 1 by simulation) and pillar fit all check out, and no registry conflicts. The 3 blockers were contract gaps, fixed in the same session; the target document was edited afterwards, so it carries no content hash here and the next /design-review runs in full.
Prior verdict resolved: First review
Findings:
- [BLOCKING] Detailed Design: no random source in the request, so every seeded AC had nothing to seed. Fixed: injected random source.
- [BLOCKING] Detailed Design: catch result had no "flag spent" field, though AC-9 and an Edge Case need it. Fixed.
- [BLOCKING] Formulas / Detailed Design: load-time checks and out-of-range knob behaviour were inconsistent. Fixed: rules 6-8, refuse to load (owner choice), AC-12 changed, AC-35 and AC-36 added.
- [RECOMMENDED] Acceptance Criteria: no tier 2 or tier 4 odds test, no tier-clamp or tie-break test. Fixed: AC-31 to AC-37.
- [RECOMMENDED] Detailed Design: co-op does not say whose log, Chill and tier a guest's request carries. Open.
- [RECOMMENDED] States and Transitions: text says three states, table lists four; Failed scope unclear. Open.
- [RECOMMENDED] Straight Fire: brief says every rarity can bite, this doc excludes Lost Legends; owner call. Open.
- [RECOMMENDED] Systems index: five dependent rows do not list this system. Open.
- [RECOMMENDED] Tuning Knobs: no consolidated table (advisory). Open.
- [RECOMMENDED] Nice-to-have: "7 to 10 bites" is 6.7 to 10; register base_weight, weight_skew and the tier table.
Reviewed-Content-Hash: design/registry/entities.yaml f2024c0ae9c268c80a0a5bf86c7b3944621ec763
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 6709d05195bd9d207b26cbd3d247be49d8d422e3
Reviewed-Content-Hash: design/game-brief.md 65a3a063f6e7dcc788e706bbda7a276206fe9d42
Reviewed-Content-Hash: design/gdd/systems-index.md 42fecc1bd882470e3eb97981b27ab50d34fc7e55
Reviewed-Content-Hash: design/catch-n-burn/content-areas-fish-strains.md cac39293f21fa6492b97266fc89eb02fe647ac97
