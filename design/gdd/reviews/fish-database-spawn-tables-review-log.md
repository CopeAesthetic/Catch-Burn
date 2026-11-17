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

## Review — 2026-11-16 (re-review) — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 2 | Recommended: 6
Summary: Odds, AC tolerances and pacing (31.3 bites to log a pond at Chill 1, by simulation) all re-derive correctly, and no registry conflicts. The prior 3 blockers were resolved. Two new contract gaps were found and fixed in the same session; the target document was edited afterwards, so the next /design-review runs in full.
Prior verdict resolved: Yes
Findings:
- [BLOCKING] Detailed Design / AC-1: MVP data (1 pond) could not satisfy AC-1 (32 ponds) or Rules 1-3. Fixed: rule 0 (load any listed ponds, at least 1), AC-1 rewritten, AC-38.
- [BLOCKING] Detailed Design: species-tag list never defined though Gear's rule 4 and AC-5 need it. Fixed: rule 9 (closed tag list), AC-39.
- [RECOMMENDED] Detailed Design / Interactions: request contract versus Interactions table. Fixed: Bite Timing assembles the whole request; logged set defined.
- [RECOMMENDED] Co-op: guest's own inputs are used (owner choice); AC-34 updated. Fixed.
- [RECOMMENDED] States: three versus four states; no refusal when not Ready. Fixed: AC-40.
- [RECOMMENDED] Straight Fire: Lost Legends excluded (owner choice); brief wording needs updating. Doc fixed, brief open.
- [RECOMMENDED] Systems index: Lost Legends, Pond & Area Travel and HUD rows do not list this system; Chill Meter is a contract, not a dependency. Open.
- [RECOMMENDED] Acceptance Criteria: AC-22 and AC-13 wording. Fixed.
- [NICE] Game Feel 7 to 10 corrected to 6.5 to 10; species count basis stated; base_weight 1-100 added to rule 8; AC-41 added. Tuning Knobs table and registering weight_skew/base_weight still open (advisory).
Reviewed-Content-Hash: design/registry/entities.yaml 53310e8f4ffd8d6c8edc4bd204b17e8acbe129c3
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 2052f58158fb60f9ef155304c441f1be81bfe77a
Reviewed-Content-Hash: design/game-brief.md 65a3a063f6e7dcc788e706bbda7a276206fe9d42
Reviewed-Content-Hash: design/gdd/systems-index.md 143596910aa88d79acf1548c3257d72e15d3f997
Reviewed-Content-Hash: design/catch-n-burn/content-areas-fish-strains.md cac39293f21fa6492b97266fc89eb02fe647ac97
Reviewed-Content-Hash: design/gdd/gear-item-database.md b066fea89fb14ddda16dd0b35912f4388034dac0

## Review — 2026-11-16 (third review) — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean)
Blocking items: 2 | Recommended: 7
Summary: Odds, pacing, trophy rate and every AC tolerance re-derive correctly by hand, and no registry conflicts. The two prior blockers are resolved. Two new gaps: the data model has no Pond record (region and area membership), and the YAK LOCK bonus carries no pond or tier condition, so it can bypass the strain gate (Pillar 1).
Prior verdict resolved: Yes
Findings:
- [BLOCKING] Detailed Design / What the database holds: no Pond record with region and area, though regional junk, AC-13 and Pond & Area Travel's per-area count need it; no load-check validates it.
- [BLOCKING] Detailed Design rule 2 / Edge Cases: YAK LOCK bonus is paid at any tier and for any pond, so it can hand out an Epic or Legendary the strain has not unlocked. Needs an owner decision (tier-gate or pond-bind); AC-8 should name the tier.
- [RECOMMENDED] Detailed Design / Formula 1: open and boost sets are in two tables and it is unstated whether they are fixed or data; rule 6 checks only opened rarities.
- [RECOMMENDED] Detailed Design / AC-26: draw order and entry-selection convention undefined; AC-26's forced draw cannot be run as written.
- [RECOMMENDED] Detailed Design rule 7 / Formula 4: the Lost Legend trophy exemption lives only in Edge Cases.
- [RECOMMENDED] Edge Cases: a request for a pond not in the loaded data is unspecified (likely in the MVP with 1 pond).
- [RECOMMENDED] Acceptance Criteria: AC-35 does not cover base_weight above 100 (rule 8).
- [RECOMMENDED] Systems index: Pond & Area Travel, Lost Legends and HUD rows still do not list this system.
- [RECOMMENDED] Cross-doc: Gear rule 4 and Open Question 12 still call the tag list open; brief line 186 still says "every rarity".
- [NICE] Consolidated Tuning Knobs table and Player Fantasy (advisory); register base_weight, weight_skew and the tier table; say who rolls a junk item's value.
Reviewed-Content-Hash: design/gdd/fish-database-spawn-tables.md 91bb60b2e06fc478a94d5287d8f685a85b67819f
Reviewed-Content-Hash: design/registry/entities.yaml 53310e8f4ffd8d6c8edc4bd204b17e8acbe129c3
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/game-concept.md 2052f58158fb60f9ef155304c441f1be81bfe77a
Reviewed-Content-Hash: design/game-brief.md 65a3a063f6e7dcc788e706bbda7a276206fe9d42
Reviewed-Content-Hash: design/gdd/systems-index.md 143596910aa88d79acf1548c3257d72e15d3f997
Reviewed-Content-Hash: design/catch-n-burn/content-areas-fish-strains.md cac39293f21fa6492b97266fc89eb02fe647ac97
Reviewed-Content-Hash: design/gdd/gear-item-database.md b066fea89fb14ddda16dd0b35912f4388034dac0
