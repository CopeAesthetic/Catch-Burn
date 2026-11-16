# Art Bible: Catch n' Burn

> **Status**: Draft
> **Owned By**: art-director
> **Last Updated**: 2026-11-16
> **Art Director Sign-Off (AD-ART-BIBLE)**: SKIPPED 2026-11-16 — lean mode

`/art-bible` writes these nine sections in this order and replaces each
section's `[To be designed]` line as that section is approved. A section still
holding its placeholder is incomplete; a later run fills only those.

## 1. Visual Identity Statement

**Visual rule: The world is a calm, misty pond; the high is what happens to it. Keep the base world quiet and low-fi, and let colour, never clutter, carry the joke.**

The Chill Meter's vibrance climb (+15% to +100%) is the game's one big visual escalation. Calm and comedy don't compete if the sober world stays restrained enough that saturation reads as an event. Geometry, composition and fog stay the same at every level. Only colour and blur change.

The brief has no formal pillars, so each principle names the part of the pitch or the "what they feel" line it serves.

### Principle 1: Budget Charm, Built to Show

*Serves: "Friendslop-grade budget: charm over fidelity" and the owner's PS1–PS2 look.*

Low-poly models, 64–256 px nearest-neighbour textures, ordered dithering and chunky UI are the style, not a compromise. Every asset should look deliberately simple and be recognisable in silhouette. Fidelity-chasing detail (fine normal maps, soft realistic gradients) breaks the spell and the budget.

**Design test:** When an asset could carry more detail or more character, this principle says choose the readable, chunky shape with a single memorable feature (the deer head, the beer-sign glow).

### Principle 2: Muted Until Moved

*Serves: "chill, a bit silly" and the Chill Meter's vibrance mechanic.*

Sober palettes are earthy and misty: spruce green, weathered wood, pale fog, a warm time-of-day tint. This gives the +15% to +100% climb room to feel like a reward. YAK LOCKED, the +100% step with blur, should read as a spectacle, which only works if Sober looked like a quiet morning.

**Design test:** When a colour could be punchier in the base world, this principle says choose the muted version and save the punch for higher Chill levels.

### Principle 3: Read the Water First

*Serves: the gameplay-critical shade mechanic and "quietly hooked on filling the log."*

The player's decisions happen on the water: shade, bite timing, the FISH ON text, rarity colours. Fog, dithering and scene decoration must never hide shaded-versus-lit water. Rarity colours and the red-to-green FISH ON cue keep fixed meanings at every vibrance level.

**Design test:** When atmosphere (fog, tint, dither, set dressing) competes with legibility of the water or a gameplay cue, this principle says choose legibility.

**Open risk, carried to Section 4:** the vibrance boost could erode the shade contrast or push rarity colours together at +100%. The browser sketch (`prototypes/catch-n-burn/`) applied vibrance to the 3D world only and left the HUD alone.

## 2. Mood & Atmosphere

Chill level changes colour and blur only. Time of day changes light direction, tint and fog colour, never fog density. Sober and the four high levels are one row pair because they share a frame; the fight and the catch add UI over an unchanged world.

| State | Emotional target | Lighting | Descriptors | Energy | Carried by |
|---|---|---|---|---|---|
| Main menu | Arriving at camp with the whole weekend ahead | Dusk, sun behind the treeline; amber band on cool slate; medium contrast | Still, silhouetted, glassy, amber-on-slate | Low, expectant | Black spruce silhouette over an Ember band mirrored in flat water |
| Shack interior | Snug, lived-in, safe | Warm, dim, high contrast; two glow pools on dark-stained walls | Smoky-amber, knotty, cluttered-cosy, dim | Resting | Woodstove and beer-sign glow, the only saturated lights |
| Dock | Threshold: about to head out | Same sun as the water; open, low contrast | Open, damp, pale, quiet | Low, ready | Dark dock planks leading into pale fog |
| Water, Sober (day) | Unhurried attention on a quiet morning | Soft vertex light, warm tint tracking the sun; low contrast except tree shadow | Misty, earthy, washed-out, patient | Low, measured | Two-tone water: dark shadow shapes on pale water |
| Water, Chill to Zonked | The same pond getting prettier and funnier | Identical light; saturation steps +15/30/45/60% | Ripening, lush, candy-edged, technicolour | Low motion, rising colour | Treeline and sky gaining colour while the HUD stays put |
| YAK LOCKED | Glorious overcommitment; the punchline | Identical light; +100% and world blur | Blown-out, smeared, neon, swimmy | Peak, for 60 s | Smeared world behind a crisp HUD |
| The fight | Sudden narrow focus, pulse up | World untouched; gauge and FISH ON text are the brightest things on screen | Tense, snappy, centred, bright-on-dark | High, short | FISH ON text running red to green |
| The catch | A small win played as big-time television | Brief rainbow flash, then banner | Cheesy, slick, celebratory, brief | Spike, then settle | Lower-third banner with its rarity stripe |
| Night water | Pleasantly lonely, getting sleepy | Cool indigo-slate, low contrast, top-down moonlight | Indigo, flat, hushed, drowsy | Lowest | Single-value water with small Ember points (shack window, lighter) |
| Munchies maxed | Comic stalemate: stuck, not punished | World untouched | Stalled, nagging, deadpan, blinking | Low with a pulse | The locked red bar, the only persistent red on screen |
| Flip phone | Pocket-sized 2008 distraction while life carries on | Self-lit cool LCD, flat; ignores sun and vibrance | Plasticky, backlit, pixel-crisp, tiny | Low, fiddly | Cool LCD rectangle against the muted world still moving behind it |

**Notes**

- **Night's flat water is the tell.** Removing the two-tone water shows there are no shade sweet spots without a tooltip (Principle 3).
- **The HUD is the sober anchor.** It looks the same at every level, so the world's shift is measurable against it and the gameplay cues stay fixed.
- **The catch flash is the one loud beat allowed at Sober.** It lives in the UI layer and is brief, so it does not spend the vibrance reward (Principle 2).
- **Fight and Munchies change nothing in the world.** Their mood comes entirely from UI, which keeps the escalation budget with the Chill Meter.

## 3. Shape Language

Three shape families do three jobs. The world is horizontals and simple triangles, the cast is one-feature silhouettes, and the UI is bevelled rounded rectangles. The UI deliberately does not echo the world.

### Cast silhouettes

| Subject | Rule | Why |
|---|---|---|
| Fish | Side-on profile from a parts kit: body length-to-height ratio, tail, dorsal, head, plus one exaggerated "tell" (pickerel duckbill, bullhead barbels, sunfish ear flap, salmon kype). Must read as a black silhouette 32 px wide; pattern and colour come second. | Principle 1: one memorable feature. A kit keeps 320 species affordable, and collecting only works if each one is recognisable. |
| Junk | Lumpy, asymmetric, drooping. Nothing streamlined or pointed like a fish. | Reads as "not a fish" before the banner lands. The slump is slapstick, not failure, which keeps the tone kind. |
| Other kayaks | A long lozenge hull with an upright torso and one diagonal rod line. | The rod is the only diagonal on the horizon, so friends are findable through fog. Per-player identity is deferred to Section 5. |

### Environment geometry

- **Horizontals dominate.** Water plane, far shoreline and fog band are stacked horizontal strips. Horizontals read as stable and restful, which is the "calm pond" of the visual rule.
- **Conifers are the verticals.** Cones and stacked triangles punctuate the horizon and cast the shadows that matter.
- **Shadows are big, simple wedges with an unbroken edge.** No dappled or leafy shadow noise on the water. Dither may shade inside a shape but never breaks its outline (Principle 3).
- **Shacks are boxes with one memorable roofline per region.** Gable camp, stilts, A-frame, cedar shed, rounded adobe parapet, hip-roof cottage. The region is identifiable from the silhouette alone (Principle 1).
- **Set dressing is one chunky shape per prop.** The shack can be full without being noisy: colour, never clutter.

### UI shape grammar: stands apart

- **HUD:** thick-outlined pill bars with tick segments on dark plates. The style is glossy and chunky, and never organic.
- **Needle gauge:** a long horizontal bar with a sweeping needle. Its zones are flat blocks, with the blue zone always the narrower one.
- **Flip phone:** two stacked rounded rectangles and a hinge, with a strict rectangular grid on screen. It is rigid and manufactured against a soft world.
- **Broadcast banner:** a lower-third strip with a slashed end. This is the only diagonal in the UI, so it reads as an event.

The world is what gets altered and the UI is what stays the same. Keeping their shapes separate makes that distinction visible at a glance and keeps cues legible when the world is blown out.

### Hero versus supporting shapes

| Tier | Shapes | Treatment |
|---|---|---|
| Hero | Shade wedges on water, the fish in hand, gauge and FISH ON text, the banner | Largest value or colour contrast in frame; clean edges |
| Supporting | Treeline, shack, dock, other kayaks | Mid contrast; simple masses |
| Background | Far shore, sky, fog | Lowest contrast; nearly flat |

No supporting shape may out-contrast a hero shape.

## 4. Color System

### Primary world palette (sober, North East baseline)

| Name | Hex | Role and meaning |
|---|---|---|
| Fog Pale | `#C9CFC6` | Sky, fog, far shore. The quiet everything fades into. |
| Lit Water | `#7FA3A0` | Open water. Slow bites. |
| Shade Water | `#2F4A4C` | Tree shadow on water. The sweet spot, and the darkest large daytime shape. |
| Spruce | `#3E5A45` | Treeline, the main vertical mass. |
| Weathered Wood | `#7A6248` | Docks, shacks, kayak trim. Human-made and worn. |
| Reed Ochre | `#B59A5A` | Reeds, sand, dry grass. Warm relief. |
| Ember | `#E08A3C` | Stove, beer sign, dusk sun, lighter. The one warm punch. |

Sober world textures stay at or under 50% HSV saturation. Ember is exempt but capped at about 5% of the frame.

### Semantic colours (UI layer only)

| Meaning | Hex | Reason |
|---|---|---|
| Common / Uncommon / Rare / Epic / Legendary | `#F2F2F2` `#55D66B` `#4AA8FF` `#B77BFF` `#FFC93C` | Owner-fixed; the browser sketch's values kept. |
| Lost Legend | `#FF7AD9` | Pink is the only hue family left unclaimed, so it reads as off the chart. Owner decision 2026-11-16: pink means Lost Legend and nothing else. |
| Junk | `#B8C0C8` | Grey signals "no tier". |
| Gauge green / blue | `#62C94F` / `#6AB8FF` | Owner-fixed: good and better. |
| Gauge miss | `#2A2D30` | Dark is absence, so only the scoring zones carry colour. |
| FISH ON far to close | `#D8342B` to `#8CF25A` | Owner-fixed; the ends also differ in brightness. |
| Chill Meter | `#9FE870` | Leaf lime, lighter and yellower than gauge green. |
| YAK LOCKED meter | `#9FE870` and `#F2F2F2` stripes, with a lock icon | Owner decision 2026-11-16: not pink, so it cannot be mistaken for Lost Legend. |
| Hunger | `#C9A66B` | Quiet tan: a neutral state should not shout, and it stays clear of Legendary gold. |
| Munchies / Maxed | `#FF8A3C` / `#FF4A3A` | A heat ramp from nagging to blocked. |
| Money | `#E4DCB8` with `$` | The glyph carries the meaning; gold stays Legendary. Tips print in Chill lime because the high earns them. |
| Warning | `#FF4A3A` | Red means blocked, nothing else. |

### Region temperature (sober)

- **North East:** cool grey-green; the baseline.
- **Mid Atlantic:** neutral-warm; olive, tea-brown water, cream haze.
- **South East:** warm and humid; yellow-green haze, tannin water.
- **Mid West:** neutral; wheat and slate under a flat pale sky.
- **Pacific Northwest:** coldest; blue-green and slate.
- **West Coast:** warm and clear; straw hills, dusty blue water.
- **South West:** hottest land against the coolest water; terracotta beside grey-turquoise.
- **US Islands:** warm and bright; sea-glass water, coral sand, sitting at the saturation cap.

Each region shifts hue and temperature only. The lit-to-shade value gap is identical everywhere.

### UI palette

- **Colours:** Plate `#14171A`, Label Cream `#E4DCB8`, Quiet Grey `#B8C0C8`, Phone Silver `#A9B0B5`, LCD `#DCE8EE` with ink `#1B2A33`, Broadcast Navy `#1C2A4A`.
- **Divergence:** the UI is saturated, hard-edged and cool-neutral. It never receives fog, tint, dither or vibrance.

### Vibrance rule

This resolves the open risk carried from Section 1.

1. Vibrance and blur apply to the 3D world render only, before the HUD is composited, as in the browser sketch.
2. Vibrance changes saturation only; hue and luminance are preserved. Test: a +100% frame converted to greyscale must match the Sober frame converted to greyscale.
3. Shade is a value gap, not a hue. Shade Water stays about 3:1 darker than Lit Water at casting range, through fog.
4. Semantic colours live only in the UI layer, each on a Plate backing with a dark outline. No world asset uses a rarity colour to mean rarity.
5. The shader curve and clamping belong to the technical-artist; the result must pass test 2.

### Colourblind backups

| Pair | Backup |
|---|---|
| FISH ON red to green | A chevron row under the text fills as the fish closes; the ramp brightens. |
| Gauge green / blue | Blue is always narrower, hatched, with taller end caps; distinct hit sounds requested from the audio-director. |
| Rarities (green/blue/purple, gold/green, pink/purple) | 1–5 pips plus the printed rarity word; Lost Legend gets a photo-frame icon. |
| Chill lime / Munchies orange / Maxed red | Fixed positions, text labels, leaf and fork icons; Maxed adds a lock and hatched fill. |
| Shade / lit water | Safe by construction, because it is value-coded. |

### Open points

- **The 3:1 shade gap is unmeasured in engine.** It is arithmetic on the two hex values (about 3.5:1 before fog). Check it at 480×270 with fog and dither on, at every region and time of day.
- **Blur and "fishing gets harder".** The HUD stays crisp during YAK LOCKED. Blur softens shade edges; whether that is part of the intended difficulty is a gameplay call for the Chill Meter GDD.
- **Differences from the browser sketch** (`prototypes/catch-n-burn/`): money moves from yellow to cream, the Hunger bar from gold to tan, the YAK LOCKED meter from pink to lime-and-white stripes, and the FISH ON ramp's red end becomes darker than its green end.

## 5. Character Design Direction

[To be designed] — the player character's visual archetype, how players tell
enemies, NPCs and allies apart at a glance, expression and pose style, and how
much detail survives at game camera distance (LOD philosophy).

## 6. Environment Design Language

[To be designed] — architectural style and its tie to the world's culture,
texture philosophy (painted, PBR or stylised, and why), prop density rules per
area type, and environmental storytelling guidelines.

## 7. UI/HUD Visual Direction

[To be designed] — diegetic versus screen-space HUD, typography (personality,
weight, size hierarchy, minimum readable size), iconography style, UI animation
feel, and any art-direction versus readability conflict and how it was decided.

## 8. Asset Standards

[To be designed] — file formats, naming convention, texture resolution tiers,
LOD levels, export settings, and the engine's hard limits (poly budgets per
asset category, texture memory, material slots). Where an art preference and a
technical limit disagree, record both and the trade-off chosen.

## 9. Reference Direction

[To be designed] — 3–5 references (games, films, art styles or artists). For
each: the specific element to take from it, and what to avoid so the result
does not read as a copy.
