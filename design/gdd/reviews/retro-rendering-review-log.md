# Review Log — Retro Rendering

## Review — 2026-11-17 — Verdict: NEEDS REVISION
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean mode)
Blocking items: 1 | Recommended: 9
Summary: An unusually strong first draft. Every formula's worked example and every AC number checks out, and the 3:1 shade-gap promise is argued all the way to a load-time check. The one blocker sat inside that check. The CRT scanlines darkened the sRGB-encoded frame, but Formula 5 counted the darkening as linear light (0.92 against a real ~0.85). The authored Sunrise and Sunset keys therefore reached only 2.94 and 2.95 at Brightness 0.8 with CRT on (Deck), while the AC-11 tool would have passed them. The owner chose to darken in linear light (subtler on-screen scanlines). That and all nine recommended items were applied the same day, so the document differs from the version reviewed.
Prior verdict resolved: First review
Findings:
- [BLOCKING] Formula 5 / Formula 8 / rule 12: CRT darkening applied to display-encoded values but counted as linear `m` 0.92; worst case was 2.94 (Sunrise) and 2.95 (Sunset) on the Deck, 2.96 at 1080p. Fixed (owner choice "darken in linear light"): rule 12, Formula 8 (decode, darken, re-encode; on-screen equivalents), Formula 5 `m` row, edge case, AC-12 (1280×800 plus 1080p, linearised patch luminance), AC-23 (0.441 not 0.381). Worst case restored to 3.05 / 3.12 / 3.06 at every window size.
- [RECOMMENDED] Rule 1 / Formula 6 / Formula 8: Brightness ran after vibrance and clipped, breaking "luminance kept exactly" at Brightness 1.2. Fixed: order is now blur, Brightness, vibrance, dither; AC-18 runs at 1.0 and 1.2; AC-23 clause.
- [RECOMMENDED] Formula 8: below scale 1, `line_dark` fell under `crt_mean_dark` and `m` misdescribed the frame. Fixed: `max(scale, 1)` in both expressions; AC-23 clause at scale 0.5.
- [RECOMMENDED] Formula 3: `h4` range was 17.25–23.0; the true maximum is 23.4. Fixed.
- [RECOMMENDED] Formula 1: leftover width when `W_int × scale ≠ window_w` was unspecified, and 645.0 could float-round to 644. Fixed: integer computation, `scale_x` fills the width exactly (no crop, no gap); 3440×1440 example and AC-4 updated, 1366×768 added.
- [RECOMMENDED] Rule 15 vs art bible Region temperature ("value gap identical everywhere"): rules only required ≥ 3:1 per region. Fixed: every region's Lit/Shade Water luminance must match North East's within `region_y_tolerance` 0.005, load check refuses otherwise; AC-11 clause.
- [RECOMMENDED] AC-1: "every HUD pixel identical" would fail on anti-aliased edges and translucent plates. Fixed: fully opaque UI-layer pixels only, mask retained.
- [RECOMMENDED] AC-25: "remain readable" was subjective. Fixed: Label Cream on Plate ≥ 4.5:1 on a scanline row (8.7:1 expected).
- [RECOMMENDED] Registry: `sun_direction` hard-coded 6 and lacked `sunrise_hour`; `shade_gap` variable names differed from Formula 5. Fixed in `design/registry/entities.yaml` (both revised 2026-11-17; validate clean).
- [RECOMMENDED] Formula 6 / rule 17: the blur kernel was undefined, so "8 taps to 4" had nothing to halve. Fixed: separable Gaussian-weighted kernel, `yak_blur_taps` 8 (4 on Deck fallback); AC-17 clause.
- [NICE] Bayer offset was biased by −1/32 level and the "half a level" claim held only at `dither_amp` ≤ 1. Fixed in passing (`(B4 + 0.5)/16 − 0.5`, Output Range wording, AC-23 clause).
- [NICE] Vibrance drifts HSV hue by about 6° (Spruce 135°→142°, Ember 28°→35°); the art bible's hue clause has no test. Not changed.
- [NICE] AC-19 should say it waits on Multiplayer (Alpha). Not changed.
- [NICE] Dependencies lists Settings & Input as "In Review" while the index tracker says it was approved at its sixth review; re-sync when that settles. Not changed.
- [NICE] Player Fantasy and Tuning Knobs sections absent (advisory at standard). Not changed.
- [FOLLOW-UP] `sunrise_hour` and `night_start_hour` are still unregistered; they belong to Day, Night & Sleep's registry work.
Note: the GDD's own hash is deliberately not stamped below. The file was revised after this review, so the next `/design-review` must read it as NEW and run in full.
Reviewed-Content-Hash: design/registry/entities.yaml 7e2ee32b383248be57734774cb8cbc104e365711
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/day-night-sleep.md 7a95b329c588832bc6a825f510da2f4bf2555368
Reviewed-Content-Hash: design/gdd/settings-input.md e2352e4194de39a95a89f34e36e758bc2700a25f
Reviewed-Content-Hash: design/art/art-bible.md c672bb8db5ffd7853f2ae61cd9ea87fccffe2492

## Review — 2026-11-17 — Verdict: APPROVED
Review mode: lean · Workflow: standard
Scope signal: L
Specialists: none (lean mode)
Blocking items: 0 | Recommended: 3
Summary: An independent re-review, run in full. All 10 prior findings are resolved in the text. Every worked number was recomputed and reproduces, including the linear-light CRT (11.8% on-screen line darkening on the Deck, 16.5% at 1080p, 21.3% at the cap, mid-grey line 0.441, m 0.92 / 0.925), Formula 1's integer W_int, the blur kernel and AC-25's 8.67:1. A 4×4 Bayer, 5-bit, 8-bit-storage simulation measured the worst-case keys on screen at 3.04 / 3.10 / 3.06. No new defect breaks the shade-gap promise for shipped content. The three recommended items harden the guard for future regions.
Prior verdict resolved: Yes (blocker and all 9 recommended verified in the text)
Findings:
- [RECOMMENDED] Formula 5 / AC-11: the load check counted unquantised colour, so a profile at the floor (untinted k 0.90, C 3.006) passed but measured 2.985–2.999 on screen after dither, failing AC-12. Applied after approval (owner): gap_check = gap_min + quant_margin (0.03) = 3.03; floor now k ≥ 0.92; AC-11 cases at k 0.90 (refused, 3.01) and 0.92 (passes); registry shade_gap_min note revised.
- [RECOMMENDED] AC-12: "8 CRT-on captures" was 6 (3 times × 2 vibrance), and 07:00 / 20:30 missed the tightest keys. Applied after approval: 06:00, 13:30, 20:59; "6".
- [RECOMMENDED] Rule 15: ±0.005 on Y_S (8% of 0.060) let the noon gap range 3.28–3.69 against North East's 3.47, not "identical". Applied after approval: untinted gap within region_gap_tolerance 0.05 of 3.47, Y_L still within 0.005; Formula 5 variable rows, edge case and AC-11 case (Shade Water Y 0.064, gap 3.35, refused).
- [NICE] Formula 1: "under one internal pixel" is exactly one at 3440×1440 (645.0 → 646); say "at most one". Not changed.
- [NICE] AC-7 / Formula 3: night_blend_frac 0.333 gives w_night 0.5005 at 21.5 and h4 21.999; use 1/3 or add ±0.001. Not changed.
- [NICE] Formula 8 Output Range: "more than two levels apart never mix" holds only at dither_amp ≤ 1.0 (about 1.2 levels at 1.5); harmless for water (9–10 apart). Not changed.
- [NICE] Edge Cases: "the 4 nearest" local lights ignores the Deck fallback of 2; say max_local_lights. Not changed.
- [NICE] Formula 2: how the sun-to-moon direction blends over w_night is unspecified. Not changed.
- [NICE] Carried over: vibrance hue drift untested; AC-19 waits on Multiplayer; Player Fantasy / Tuning Knobs absent (advisory); Dependencies' Settings & Input status label (GDD header In Review, index Approved).
Note: the GDD hash below is of the version reviewed, before the three post-approval edits, so the next /design-review reads it as CHANGED and runs in full.
Reviewed-Content-Hash: design/gdd/retro-rendering.md 2a16c9f3aadfd8aef19eeba8f142c15a0d5b19c5
Reviewed-Content-Hash: design/registry/entities.yaml 7e2ee32b383248be57734774cb8cbc104e365711
Reviewed-Content-Hash: .claude/skills/design-review/SKILL.md 4dcc8b81162613c757144532f1b72708ab3ba27f
Reviewed-Content-Hash: design/gdd/day-night-sleep.md 7a95b329c588832bc6a825f510da2f4bf2555368
Reviewed-Content-Hash: design/gdd/settings-input.md e2352e4194de39a95a89f34e36e758bc2700a25f
Reviewed-Content-Hash: design/art/art-bible.md c672bb8db5ffd7853f2ae61cd9ea87fccffe2492
Reviewed-Content-Hash: design/gdd/game-concept.md 9575fa3b8e721823c815dd1750d82b8b10b89eaf
