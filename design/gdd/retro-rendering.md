# Retro Rendering

> **Status**: Approved (second `/design-review` 2026-11-17, lean: APPROVED, 0 blockers; its 3 recommended items (dither margin on the load check, AC-12 capture times, rule 15 gap match) applied after approval and not re-reviewed. First review 2026-11-17: NEEDS REVISION, 1 blocker, fixed)
> **Creative Director Review (CD-GDD-ALIGN)**: skipped — Lean mode
> **Author**: owner + Claude (design-system, lean review)
> **Last Updated**: 2026-11-17
> **Last Verified**: 2026-11-17
> **Implements Pillar**: Pillar 4 (Budget Charm); art bible Principle 3 (Read the Water First) and Principle 2 (Muted Until Moved)

## Summary

Retro Rendering turns the art bible into the picture on screen. The world renders at 270 lines with per-vertex light that follows the clock, PS1 vertex wobble, fixed-density fog, Chill vibrance and the YAK LOCKED blur, and 5-bit dither. The HUD is drawn crisp on top, and the CRT filter is an option. It also draws the shade on the water and guarantees that shade stays at least 3:1 against lit water at casting range, at every time of day, Brightness and vibrance level. That makes the game's one spatial decision readable. Read it for anything about the look, the sun's path, what the HUD is protected from, or the Brightness, Vertex wobble and CRT settings.

> **Quick reference** — Layer: `Foundation` · Priority: `MVP` · Key deps: `None hard` (soft: Day, Night & Sleep, Settings & Input, Casting & Tangle, Player Controller, Scene Flow & Loading; owns contracts fed by Shade Sweet Spots and Chill Meter & Smoking)

## Overview

Retro Rendering is the frame every visual system is drawn through. It renders the 3D world at a fixed low internal resolution (270 lines tall), lights it with simple per-vertex light that follows the time of day, snaps vertices to a coarse grid for the PS1 wobble, adds fixed-density distance fog, then runs one world-only post pass: the YAK LOCKED blur, Brightness, Chill vibrance, and 5-bit ordered dithering. It scales the result to the screen with nearest-neighbour pixels, draws the HUD over it at native resolution untouched by any of that, and lays the optional CRT filter over the finished frame. It also draws the shade on the water, taking the shapes from Shade Sweet Spots and darkening Lit Water by a fixed ratio, and it owns the rule that keeps that shade readable: at least 3:1 contrast at casting range, at every time of day, region, Brightness and vibrance level (art bible Principle 3). Players never operate it. They see it as the game's look, the light moving over the pond through the day, and the world going lush and then smeared as they get higher, while the HUD stays put. Without it the art bible is a document, not a picture, and the one spatial decision in the game (where the shade is) has no guarantee of being visible.

## Detailed Design

### Core Rules

1. **One frame order.** Every frame is built in this fixed order:
   1. **World pass** at the internal resolution (rule 2): per-vertex light (rule 3), vertex snap (rule 8), the shade on the water (rule 5), fog and sky (rule 4).
   2. **World post pass**, in this order: YAK LOCKED blur, Brightness, vibrance, then 5-bit ordered dither (Formulas 6 and 8). Brightness comes before vibrance so that a colour Brightness clips at white is clipped in both the Sober and the high frame alike, and vibrance still keeps luminance exactly (rule 7).
   3. **Upscale** to the window with nearest-neighbour pixels.
   4. **UI layer** at native resolution: HUD, catch banner, phone, menus, button prompts and screen fades. Nothing here receives fog, time-of-day tint, dither, vibrance, blur or Brightness (art bible, UI palette). This is what keeps the HUD the sober anchor.
   5. **CRT filter**, if on, over the finished frame, UI included (rule 12).

2. **Internal resolution** (owner decision 2026-11-17). The world always renders 270 lines tall. Its width follows the window's shape (Formula 1): 480×270 at 16:9, 432×270 on the Steam Deck's 16:10. Pixels are square to within one internal pixel across the width, and the upscale fills the window exactly with no bars and no crop (Formula 1). At scales that are not whole numbers (720p, the Deck) some pixel rows are one screen pixel wider than others, and that is accepted. Windows narrower than 4:3 or wider than 21:9 get black bars on the long side. The resolution is not a player setting (Settings & Input rule 8).

3. **Lighting.** World geometry is lit per vertex by one directional light (the sun by day, the moon by night), one ambient colour, and at most `max_local_lights` (4) local point lights in view, kept for the Ember glows: woodstove, beer sign, shack window, lighter. The game has no real-time shadows, no glow or bloom, no auto-exposure, no screen-space effects, no anti-aliasing and no HDR output. The art bible's hex values must come out as authored: an unlit test card in each palette colour reads back within 1/255 of its hex at Brightness 1.0 with vibrance 0 and dither off (AC-2). The engine settings that achieve this go to an ADR.

4. **Time of day** (Day, Night & Sleep rule 3). Outdoor light comes from the current region's four **light keys** (Sunrise, Day, Sunset, Night). They are blended by `time_of_day` at hours taken from Day, Night & Sleep's phase boundaries (Formula 3). Each key sets the horizon colour (also the fog colour), the zenith colour, ambient colour, sun colour and intensity, and water light. The sober sky keys carry a little colour, about 10–15% saturation at Day (owner decision 2026-11-17), so vibrance has something to push and the sky visibly ripens at higher Chill. **The sun's direction belongs to this system** (owner decision 2026-11-17): it is a pure function of `time_of_day`, the night-start hour and the pond's north heading (Formula 2), and Shade Sweet Spots reads the same function. Because it uses only the host's clock, every co-op peer gets the same sun. **Fog density never changes** (Formula 4); only the fog and sky colours follow the clock. Dawn and Dusk blend continuously with no pop at a phase boundary. Night's light arrives over the first third of Night, after the first warning has already removed the shade (Day, Night & Sleep rule 4). The player gets two beats: the chime and the shade vanishing, then the pond dimming.

5. **Water and shade** (owner decision 2026-11-17: fixed darkening). Water is lit by its light key's water light only, never by the sun's angle, so a low sun cannot dim it. **Shade is drawn exactly where Shade Sweet Spots says it is**: its shade shapes on the water plane are filled with the region's Shade Water colour under the same light as Lit Water. This system never decides where shade is, so the shade the player sees is the shade that gives fast bites, for every co-op peer. At night Shade Sweet Spots provides no shapes and the water is one value (art bible, Night water). Shade edges are hard: no anti-aliasing, no soft edge, no vertex snap. Dither may vary pixels inside a shape but never crosses its edge, because Lit and Shade Water sit many 5-bit levels apart.

6. **The shade gap guarantee** (art bible Principle 3 and Vibrance rule 3; owner decision 2026-11-17: contrast ratio). Whenever Shade Sweet Spots provides shapes, the contrast between Lit and Shade Water at casting range is **at least 3:1** by Formula 5. This holds in every region, at every time of day, at Brightness 0.8 to 1.2, at every vibrance level, and with CRT on or off. Two things follow:
   - Fog starts beyond the longest cast (Formula 4).
   - Water light never drops below the floor in Formula 5 while shade exists.
   A region's palette and light keys must pass the Formula 5 check when they are authored and when they load. The check asks for `gap_min + quant_margin` (3.03), not 3.0, because the 5-bit dither moves the contrast measured on screen by up to about 0.02. A failing set is refused, and the error names the region, the key and the contrast it reached.

7. **Vibrance and the YAK LOCKED blur.** Chill Meter & Smoking publishes the local player's `vibrance` (0 at Sober to 1.0 at YAK LOCKED; the brief's +15/30/45/60/100%) and whether `yak_blur` is on. This system eases toward those values instead of snapping (Formula 6), changes saturation only (luminance is kept exactly, so rule 6 and the art bible's greyscale test hold at every Brightness, because vibrance works on the colour after Brightness), and blurs the world only. Each player sees only their own high: in co-op another player's meter never changes your frame (Pillar 5).

8. **Vertex wobble** (setting, default On; Settings & Input rule 8). When on, world vertices snap to a coarse screen grid (Formula 7) and textures map affinely, giving the PS1 warp. When off, both stop. The water plane and the shade shapes never snap, and the UI never wobbles.

9. **Textures** sample nearest-neighbour (art bible Principle 1: 64–256 px). Mipmaps are allowed, chosen nearest between levels, to stop distant shimmer at 270 lines.

10. **Brightness** (setting 0.8–1.2, default 1.0) is a gain on the world, after the blur and before vibrance and dither (Formula 8). The UI is unaffected.

11. **Dither is always on** and is not a setting. It is a 4×4 ordered pattern quantising each channel to 5 bits (32 levels) on the world only, fixed to the internal pixel grid so it never crawls with the camera (Formula 8).

12. **CRT filter** (setting, default Off; owner decision 2026-11-17: whole frame). It draws one scanline per internal pixel row over the finished frame, UI included. The darkening is applied in linear light: the pass decodes the finished frame from sRGB, darkens it, and re-encodes it (Formula 8). That is the darkening Formula 5 counts, so rule 6 holds with CRT on. The darkening is capped so HUD text stays readable (AC-25).

13. **Interiors** (the shack) use an interior light profile instead of light keys: a fixed warm, dim ambient, the local glows, no sun and no fog. Windows show the outdoor sky colour for the current `time_of_day`. Vibrance, blur, Brightness, dither and wobble apply as they do outside.

14. **Pinned time.** A non-gameplay scene can pin its own time of day. The main menu pins Dusk (art bible, Main menu row), and Main Menu & Intro chooses the value. A gameplay scene never pins.

15. **Regions.** Each region has its own palette and light keys, shifting hue and temperature only (art bible, Region temperature). The art bible's "the lit-to-shade value gap is identical everywhere" is held by contrast: every region's untinted gap `(Y_L + 0.05) / (Y_S + 0.05)` is within `region_gap_tolerance` (0.05) of North East's 3.47, and its Lit Water luminance is within `region_y_tolerance` (0.005) of North East's 0.332, so the water also reads equally bright. The load check refuses a palette outside either tolerance and names the region and colour. Rule 6's check still runs per region, because each region's tinted water light differs. The MVP ships North East only.

16. **No state of its own.** This system holds no gameplay state, saves nothing and replicates nothing. It reads the clock, the shade shapes, the local player's Chill values and the settings, and draws them.

17. **Steam Deck fallback** (owner decision 2026-11-17: cut cost, keep the look). There are no quality settings. If the Deck cannot hold 60 fps (AC-31), cost comes out in this order: first the YAK LOCKED blur drops from 8 taps to 4 per pass (`yak_blur_taps`, Formula 6), then `max_local_lights` drops from 4 to 2 on the Deck. The 270-line height, dither, fog and the shade gap never change on any platform.

### States and Transitions

The renderer has one **light profile** per scene and one **YAK blur** state per player. Vibrance is not a state: it is a continuous value easing toward its target.

| Light profile | Light comes from | Set by |
|---|---|---|
| **Outdoor** | The region's light keys at `time_of_day` (Formula 3); sun from Formula 2 | The pond, dock and every outdoor scene, on load |
| **Interior** | The scene's fixed interior profile; no sun, no fog | The shack and other interiors, on load |
| **Pinned** | The region's light keys at the scene's pinned hour | Non-gameplay scenes only (the main menu: Dusk) |

A profile changes only when a scene loads (Scene Flow & Loading), behind its fade. There is never a blend between profiles.

| YAK blur state | Blur strength | Transition |
|---|---|---|
| **Off** | 0 | → Ramping in when `yak_blur` turns on |
| **Ramping in** | rises to 1 over `yak_blur_in_s` | → On at 1; → Ramping out if `yak_blur` turns off first, from the current strength |
| **On** | 1 | → Ramping out when `yak_blur` turns off |
| **Ramping out** | falls to 0 over `yak_blur_out_s` | → Off at 0; → Ramping in if `yak_blur` turns on again, from the current strength |

### Interactions with Other Systems

| System | Flows in | Flows out | Owner of the interface |
|---|---|---|---|
| Day, Night & Sleep | `time_of_day`, `phase`; the phase-boundary hours `dawn_end_hour`, `dusk_start_hour`, `night_start_hour` (its Formula 2) | — | Day, Night & Sleep owns the clock and publishes the three boundary hours to this system (added to its Interactions table 2026-11-17); this system owns how it looks |
| Shade Sweet Spots | Shade shapes on the water plane (none at night) | `sun_direction(time_of_day)` (Formula 2) and the pond's north heading | Shade owns where shade is; this system owns the sun path and how shade looks (provisional: Shade is not designed) |
| Chill Meter & Smoking | The local player's `vibrance` (0–1.0) and `yak_blur` (on/off) | — | Chill owns how much per state; this system owns how it is drawn (provisional: Chill is not designed; the brief's values stand in) |
| Settings & Input | Brightness, Vertex wobble, CRT filter (its rule 8) | — | Settings & Input owns the rows and the settings file; this system applies them |
| Casting & Tangle | The longest possible cast, `cast_max_m` | — | Casting owns the cast; Formula 4 uses it to place fog (provisional: 30 m from the browser sketch) |
| Player Controller | Camera position and field of view | — | Player Controller owns the camera |
| Scene Flow & Loading | Which scene and light profile; the region | — | Scene Flow owns loading and the fades. Fades are drawn in the UI layer |
| HUD & Catch Banner; Flip Phone & FishMail; Main Menu & Intro; Home & Dock Menus | — | The UI layer, drawn at native resolution with no world effects (rule 1, step 4) | Each draws its own UI; this system guarantees nothing reaches them except the CRT filter |
| Main Menu & Intro | The pinned hour for the menu scene | — | Main Menu chooses the hour |
| Multiplayer (Alpha) | — | Nothing: the frame is local, built from the host clock and replicated shade | Multiplayer carries the clock and the shade |

## Formulas

All `data file` values live in the render config resource, and per-region values in each region's light profile resource, not in code. Colours are worked in linear light unless a formula says sRGB. `Y(c)` is relative luminance, `0.2126 r + 0.7152 g + 0.0722 b` on linear RGB, which is the luminance the art bible's 3.5:1 figure uses.

### Formula 1: Internal resolution

The internal_resolution formula is defined as:

`aspect_used = clamp(window_w / window_h, aspect_min, aspect_max)`
`H_int = 270`, `W_int = 2 × round(H_int × aspect_used / 2)`, rounding half up
`scale = window_h_used / H_int`, `scale_x = window_w_used / W_int`, where `window_w_used` and `window_h_used` are the window size minus any bars

`W_int` is computed in integers, never floats, so the same window always gives the same width: unclamped, `W_int = 2 × floor((270 × window_w + window_h) / (2 × window_h))`; at the 4:3 clamp it is 360; at the 21:9 clamp (43:18) it is 646. The world fills the used rectangle exactly: rows are scaled by `scale` and columns by `scale_x`. The two differ only by the rounding of `W_int`, under one internal pixel across the whole width (0.15% at 3440×1440), so pixels stay square to the eye, nothing is cropped and there is no gap.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| H_int | int | 270 | constant | Internal height in pixels. Fixed by the art bible and the browser sketch; not a setting |
| aspect_min | float | 1.333 | constant | 4:3. A narrower window gets bars top and bottom |
| aspect_max | float | 2.389 | constant | 21:9 (2.389 = 43:18). A wider window gets bars left and right |
| window_w, window_h | int | any | calculated (engine) | The window's size in screen pixels |
| W_int | int | 360–646 | calculated | Internal width in pixels, always even |
| scale | float | any > 0 | calculated | Screen rows per internal row. Need not be a whole number. Formula 8's CRT uses it |
| scale_x | float | any > 0 | calculated | Screen columns per internal column; equal to `scale` except for the rounding of `W_int` |

**Output Range:** `W_int` 360 (4:3) to 646 (21:9), and 480 at 16:9. `H_int` is always 270. A window under 270 pixels tall gives a `scale` below 1, and the upscale becomes a nearest-neighbour downscale (Edge Cases).

**Example:** the Steam Deck at 1280×800 has aspect 1.6, so `W_int` = 2 × round(216) = **432** and `scale` = 800 / 270 = 2.963. At 1920×1080: 480×270, scale **4.0**. At 3440×1440 (aspect exactly 43:18): `W_int` = 2 × floor((270 × 3440 + 1440) / 2880) = 2 × 323 = **646**, `scale` = 5.333 and `scale_x` = 3440 / 646 = 5.325, so the 646 columns fill the 3440 screen pixels exactly with no crop and no bars. At 1366×768: `W_int` = 480, `scale` 2.844, `scale_x` 2.846.

### Formula 2: Sun direction

The sun_direction formula is defined as:

`p = clamp((t − sunrise_hour) / (night_start_hour − sunrise_hour), 0, 1)`
`azimuth = 90° + 180° × p + pond_north_deg`
`elevation = sun_elev_min_deg + (sun_elev_max_deg − sun_elev_min_deg) × sin(π × p)`
`sun_direction = (sin(az) × cos(el), sin(el), −cos(az) × cos(el))` (pointing toward the sun; +X east, −Z north, +Y up before the pond's rotation)

At night (`t ≥ night_start_hour`) the light turns from the setting sun to the moon, straight down `(0, 1, 0)`, with the same weight `w_night` as Formula 3. Shade Sweet Spots never needs the night direction, because it provides no shade at night.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| t | float | 6.0–24.0 | Day, Night & Sleep (`time_of_day`) | The clock, in in-game hours |
| sunrise_hour | float | 6.0 | constant (Day, Night & Sleep) | The hour a day starts |
| night_start_hour | float | 16.5–22.5 | Day, Night & Sleep, Formula 2 | The sun sets when Night begins, so shade and sun end together |
| sun_elev_min_deg | float | 5–20 | data file, default 10 | Sun height at sunrise and sunset. Keeps tree shadows finite (5.7× tree height at 10°) |
| sun_elev_max_deg | float | 30–80 | data file, default 58 | Sun height at solar noon (the browser sketch's value) |
| pond_north_deg | float | 0–360 | data file, per pond | Rotates the sun path to fit the pond's layout, so a designer can put the shade where the trees are |
| p | float | 0–1 | calculated | How far through the sun's day we are |

The load check refuses `sun_elev_min_deg ≥ sun_elev_max_deg`.

**Output Range:** azimuth runs from 90° (east) through 180° (south) to 270° (west), plus `pond_north_deg`. Elevation runs from `sun_elev_min_deg` up to `sun_elev_max_deg` and back down. With `p` at 0 or 1 the sun sits at the minimum height, never below the horizon.

**Example:** at the defaults (`night_start_hour` 21.0) solar noon is 13:30, with the sun due south at 58°. At 09:00, `p` = 0.2: azimuth 126°, elevation 10 + 48 × sin(36°) = **38.2°**. At 19:00 (Dusk begins), `p` = 0.867: azimuth 246°, elevation 29.5°. If Day, Night & Sleep moves Night to 16.5, the sun's day shortens with it, and 13:30 gives azimuth 218.6° and elevation 47.5°.

### Formula 3: Light keys over the day

The light_key_blend formula is defined as:

`hours: h0 = 6.0 (Sunrise), h1 = dawn_end_hour (Day), h2 = dusk_start_hour (Day), h3 = night_start_hour (Sunset), h4 = h3 + night_blend_frac × (24 − h3) (Night)`
`light(t) = lerp(key_a, key_b, (t − h_a) / (h_b − h_a))` for the pair `h_a ≤ t < h_b`; Day holds from h1 to h2 and Night holds from h4 to 24
`w_night = clamp((t − h3) / (h4 − h3), 0, 1)`

Each key holds `sky_fog_color` (the horizon: sky at the horizon, fog and far shore), `sky_zenith_color` (the top of the sky dome, which blends from horizon to zenith with height and gives Dusk its amber band on cool slate), `ambient_color`, `sun_color`, `sun_intensity` and `water_light` (an RGB multiplier on both water colours). Colours blend in linear light.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| dawn_end_hour, dusk_start_hour, night_start_hour | float | 7–10, 17–20, 16.5–22.5 | Day, Night & Sleep (Formula 2 there) | Phase boundaries; that GDD's load check keeps them in order |
| night_blend_frac | float | 0.1–0.6 | data file, default 0.333 | Share of Night over which the light settles to the Night key, after the shade has gone |
| Sunrise, Day, Sunset, Night keys | colour sets | per region | data file, per region | The region's four light states (art bible, Region temperature: hue and temperature only) |
| h4 | float | 17.25–23.4 | calculated | When the Night light is fully in (23.4 = night start 22.5 with `night_blend_frac` 0.6) |

**Output Range:** `light(t)` is continuous over 6.0–24.0, so there is no pop at any phase boundary. With `night_blend_frac` at 0.1 the night light arrives within 0.3 in-game hours (18 s at the default day length). The Day key holds for 11 in-game hours at the defaults.

**Example:** at the defaults, h0–h4 are 6, 8, 19, 21 and 22. At 20:00 the light is halfway between Day and Sunset. At 21:00 it is fully Sunset, and the first warning fires at the same moment. At 21:30 it is halfway to Night (`w_night` 0.5, about 30 real seconds after the chime). From 22:00 to midnight it is the Night key.

### Formula 4: Fog

The fog formula is defined as:

`f(d) = clamp((d − fog_start_m) / (fog_end_m − fog_start_m), 0, 1)`
`color_out = (1 − f) × color_in + f × sky_fog_color(t)`
Constraint: `fog_start_m ≥ cast_max_m + fog_margin_m`

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| d | float | 0+ m | calculated | Distance from the camera to the surface (radial; a depth-based fog is never denser, so it also passes) |
| cast_max_m | float | 8–60 | Casting & Tangle (provisional: 30, the browser sketch) | The longest possible cast |
| fog_margin_m | float | 0–10 | data file, default 2 | Clear water past the longest cast |
| fog_start_m | float | ≥ cast_max_m + fog_margin_m | data file, default 32 | Where fog begins. Never changes with time of day |
| fog_end_m | float | fog_start_m + 40 to 400 | data file, default 180 | Where fog is total. The camera's far plane sits here, so nothing beyond it is drawn |
| f | float | 0–1 | calculated | How much fog covers a surface |

**Output Range:** `f` is 0 at every distance the player can cast to, and 1 at `fog_end_m` and beyond. The load check refuses a `fog_start_m` below `cast_max_m + fog_margin_m` and a `fog_end_m` less than 40 m past `fog_start_m`.

**Why the constraint:** in linear light, fog of only about 4% at casting range drops the North East shade gap from 3.47:1 below 3:1 (Formula 5). The mist therefore starts just past the longest cast. Shade spots farther out fade into the mist and sharpen as the player paddles toward them.

**Example:** at the defaults a surface at 30 m gets `f` = 0, at 106 m it gets 0.5, and at 180 m it is pure `sky_fog_color`. If Casting & Tangle sets `cast_max_m` to 40, `fog_start_m` must become 42 or more.

### Formula 5: The shade gap

The shade_gap formula is defined as:

`lit = b × m × ((1 − f_c) × (LitWater ⊙ water_light(t)) + f_c × sky_fog_color(t))`
`shade = b × m × ((1 − f_c) × (ShadeWater ⊙ water_light(t)) + f_c × sky_fog_color(t))`
`C = (Y(lit) + 0.05) / (Y(shade) + 0.05)`; required on screen: `C ≥ gap_min` whenever Shade Sweet Spots provides shapes; required by the load check: `C ≥ gap_check = gap_min + quant_margin`
`k = Y(LitWater ⊙ water_light(t)) / Y(LitWater)` (the water light level)

With untinted light, the load check reduces to a floor: `k ≥ 0.05 × (gap_check − 1) / (b_min × m_min × (Y_L − gap_check × Y_S))`

The formula works on unquantised colour, but the screen shows it after the 5-bit dither (Formula 8). Dither and 8-bit storage move the measured `C` by up to about 0.02 either way (simulated over the 4×4 pattern), so a profile exactly at 3.0 can measure 2.99 on screen. `quant_margin` covers that, so a profile that passes the load check also passes AC-12.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| LitWater, ShadeWater | colour | per region | data file, per region (art bible palette) | North East: `#7FA3A0` (Y_L 0.332) and `#2F4A4C` (Y_S 0.060). Every region matches this gap and Lit Water luminance (rule 15) |
| region_gap_tolerance | float | 0.05 | constant | How far a region's untinted gap `(Y_L + 0.05) / (Y_S + 0.05)` may differ from North East's 3.47 (rule 15) |
| region_y_tolerance | float | 0.005 | constant | How far a region's `Y_L` may differ from North East's (rule 15) |
| water_light(t) | RGB | per key | Formula 3 | Light on the water at time t |
| f_c | float | 0 | Formula 4 | Fog at casting range; 0 by Formula 4's constraint |
| b | float | 0.8–1.2 | Settings & Input (Brightness) | Brightness gain (Formula 8) |
| m | float | 0.92–1.0 | Formula 8 | CRT mean darkening in linear light; 1.0 with CRT off. It is a true linear factor only because the CRT pass darkens in linear light (rule 12): darkening the sRGB-encoded frame by the same amount would cut linear light to about 0.85 and fail the Sunrise and Sunset keys (2.94) |
| gap_min | float | 3.0 | constant | Art bible Vibrance rule 3; what the screen must show (AC-12) |
| quant_margin | float | 0.03 | constant | Headroom the load check adds for the 5-bit dither, so `gap_check` is 3.03 |
| k | float | 0–1+ | calculated | Water light level relative to the authored palette |

Vibrance does not appear: it keeps `Y` exactly (Formula 6), so it cannot change `C`. Blur is excluded by measuring at least `yak_blur_px + 1` internal pixels inside a shape.

**Output Range:** the worst case is the lowest `b × m` (Brightness 0.8, CRT on: 0.8 × 0.92 = 0.736). For North East, `Y_L − 3.03 Y_S` = 0.150, so the floor is **k ≥ 0.92** (owner decision 2026-11-17: the guarantee holds at every Brightness, CRT on or off). Water light at Sunrise and Sunset therefore stays within 8% of noon. Dusk's mood comes from the sky, fog colour and an Ember tint on the land, and the pond itself darkens only during Night, when there is no shade. A palette with `Y_L ≤ 3 Y_S` can never pass and is refused. A warm tint helps: Shade Water is the bluer of the two, so an Ember tint darkens it more than Lit Water and raises `C`.

**Example:** North East at noon (`k` = 1), Brightness 1.0, CRT off: C = (0.332 + 0.05) / (0.060 + 0.05) = **3.47**. Brightness 0.8 with CRT on: C = (0.245 + 0.05) / (0.044 + 0.05) = **3.13**, a pass. Sunset with untinted water light at `k` = 0.92 in that worst case: C = **3.03**, exactly at the load-check floor. At `k` = 0.90 it gives 3.01, which Formula 5 alone would pass but which measures about 2.99 on screen after dither, so it is refused. At `k` = 0.85 it gives 2.94, also refused. North East's starting keys (Visual/Audio) give 3.05 at Sunrise, 3.12 at Day and 3.06 at Sunset in that worst case, at every window size (simulated on screen after dither: 3.04, 3.10 and 3.06).

### Formula 6: Vibrance and the YAK LOCKED blur

The vibrance formula is defined as:

`v_shown ← v_shown + clamp(v_target − v_shown, −vibrance_ramp × dt, +vibrance_ramp × dt)`
`s = min(1 + v_shown, s_gamut(c))`, where `c` is the linear colour after blur and Brightness (`c_b`, Formula 8) and `s_gamut(c)` is the largest `s` that keeps every channel of `Y + (c − Y) × s` within 0–1
`c_out = Y(c) + (c − Y(c)) × s`
`blur_radius_px = yak_blur_px × σ`, with `σ` rising 0→1 over `yak_blur_in_s` and falling 1→0 over `yak_blur_out_s` (States and Transitions)

**Blur kernel.** The blur is separable, at the internal resolution, in linear light: one horizontal pass, then one vertical pass. Each pass takes `yak_blur_taps` samples at offsets `±(i + 0.5) × blur_radius_px / (yak_blur_taps / 2)` for `i` = 0 … `yak_blur_taps / 2 − 1`, read with linear filtering between internal pixels. Each sample is weighted by a Gaussian with standard deviation `blur_radius_px / 2`, and the weights are normalised to sum to 1. At `σ` 0 the passes are skipped. The Steam Deck fallback (rule 17) halves `yak_blur_taps` from 8 to 4. The radius stays the same, so the blur looks coarser but just as wide.

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| v_target | float | 0–2.0 (clamped) | Chill Meter & Smoking (provisional: 0, 0.15, 0.30, 0.45, 0.60 and 1.0 for Sober to YAK LOCKED, from the brief) | The vibrance the player's state calls for |
| v_shown | float | 0–2.0 | calculated | The vibrance on screen now |
| vibrance_ramp | float | 0.05–2.0 per s | data file, default 0.3 | How fast vibrance eases toward its target |
| dt | float | 0–0.1 s | calculated (frame time, capped as in Day, Night & Sleep Formula 1) | Time since the last frame |
| s | float | 1 to 1 + v_shown | calculated | Saturation multiplier after the gamut limit |
| yak_blur_px | float | 0.5–4 | data file, default 2 | Blur radius at full strength, in internal pixels (the browser sketch's value) |
| yak_blur_in_s, yak_blur_out_s | float | 0.1–5 | data file, defaults 1.0 and 2.0 | Blur ramp times |
| yak_blur_taps | int | 4 or 8 | data file, default 8 (4 in the Steam Deck fallback, rule 17) | Samples per blur pass. Must be even |
| σ | float | 0–1 | calculated | Blur strength now |

**Output Range:** at `v_shown` 0, `s` = 1 and the image is unchanged. `Y(c_out) = Y(c)` exactly at every `v` (the art bible's greyscale test), because the gamut limit shrinks the colour push instead of clipping a channel. A grey pixel (`c = Y`) never changes. A colour already at the gamut edge, such as Ember, saturates only a little (`s` tops out at 1.15).

**Example:** Spruce `#3E5A45` (linear 0.048, 0.102, 0.060; Y 0.088) at YAK LOCKED (`v` 1.0, `s` 2.0) becomes `#176032` with the same Y 0.088. Sober to Chill eases in 0.15 / 0.3 = **0.5 s**. Zonked to YAK LOCKED takes 0.4 / 0.3 = 1.33 s while the blur ramps in over 1.0 s.

### Formula 7: Vertex snap (wobble)

The vertex_snap formula is defined as:

`p_px = (ndc + 1) / 2 × (W_int, H_int)`
`p_px' = round(p_px / snap_step_px) × snap_step_px`
`ndc' = 2 × p_px' / (W_int, H_int) − 1`, applied only when Vertex wobble is on, the vertex is in front of the camera (clip w > 0), and the mesh is not exempt (the water plane, shade shapes and UI)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| ndc | vec2 | −1 to 1 | calculated | The vertex's screen position after projection |
| snap_step_px | float | 1.0–3.0 | data file, default 1.5 | Snap grid size in internal pixels. The browser sketch's grid (W/3 per half-screen) is 1.5 px |
| W_int, H_int | int | Formula 1 | calculated | Internal resolution |

**Output Range:** each vertex moves at most `snap_step_px / 2` internal pixels (0.75 at the default). At 1.0 the wobble is subtle; at 3.0 it is heavy. The load check refuses values under 1.0, because 0 would divide by zero and a sub-pixel grid would be invisible.

**Example:** a vertex at ndc x 0.3171 on a 480-wide frame sits at pixel 316.10 and snaps to **316.5**, moving 0.4 px. Once it moves past 317.25 it jumps to 318.0, and that jump is the wobble.

### Formula 8: Brightness, dither and the CRT filter

The output formula is defined as:

`c_b = min(1, b × c)` (linear, world only, after the blur and before vibrance)
`e = srgb_encode(c_v)`, where `c_v` is `c_b` after vibrance (Formula 6)
`q = clamp(floor(e × 31 + 0.5 + ((B4(x, y) + 0.5) / 16 − 0.5) × dither_amp) / 31, 0, 1)` per channel, with `(x, y)` the internal pixel and `B4` the standard 4×4 Bayer matrix (0–15). The `+ 0.5` centres the offsets, so the pattern averages to no bias
CRT, when on: `line_dark = min(crt_line_max, crt_mean_dark × max(scale, 1))`. In every line row, each pixel of the finished frame, UI included, becomes `srgb_encode((1 − line_dark) × srgb_decode(pixel))`, so the darkening is in linear light (rule 12). The line rows are the bottom screen row of every internal row; when `scale` ≤ 1, every screen row is a line row
`m = 1 − line_dark / max(scale, 1)` (mean darkening in linear light, used in Formula 5)

**Variables:**
| Variable | Type | Range | Source | Description |
|----------|------|-------|--------|-------------|
| b | float | 0.8–1.2 | Settings & Input (Brightness), default 1.0 | Gain on the world |
| levels | int | 31 | constant | 5 bits per channel (32 levels), from the browser sketch |
| dither_amp | float | 0.5–1.5 | data file, default 1.0 | Dither strength in quantisation levels |
| crt_mean_dark | float | 0.04–0.08 | data file, default 0.08 | The frame-average darkening the CRT filter adds, in linear light, the same at every window size. Formula 5's 0.92 floor is worked at 0.08; a larger value raises that floor |
| crt_line_max | float | 0.2–0.5 | data file, default 0.4 | Darkest a single scanline gets, in linear light (0.4 linear is about 21% darker on screen for a mid-tone), so HUD text under a line stays readable |
| scale | float | > 0 | Formula 1 | Screen pixels per internal row |
| m | float | 0.92–1.0 | calculated | Mean CRT darkening |

**Output Range:** `q` has 32 levels per channel. At `dither_amp` 1.0 the dither moves a pixel by under half a level either way (under three-quarters at 1.5), so two colours more than two levels apart never mix across an edge. Lit and Shade Water are about 10 levels apart in every channel. `m` is 0.92 for any window up to 5 × 270 = 1350 pixels tall; above that `line_dark` reaches its cap and `m` rises toward 1, which only helps the gap. At `scale` 1 or below every row is a line row, `line_dark` equals `crt_mean_dark`, and the whole frame is darkened evenly, so `m` is still 0.92. Because the darkening is linear, the scanlines look subtler on screen than the same number applied to sRGB values. That is the price of the shade gap holding with CRT on (owner decision 2026-11-17, first design review).

**Example:** on the Deck (scale 2.963) each scanline darkens by 0.08 × 2.963 = **0.237** in linear light, and the frame averages 0.92. A mid-grey pixel (encoded 0.5) on a line row becomes 0.441, about 12% darker on screen. At 1080p (scale 4) lines darken by 0.32 linear, about 16% on screen. At 1440p (scale 5.33) a line would need 0.427, so it caps at 0.4 (about 21% on screen) and the average becomes 0.925. A mid-grey `e` of 0.5 quantises to level 15.5, which dithers evenly between 15 and 16 in the 4×4 pattern.

## Edge Cases

*`systems-designer` not consulted for this section — Lean mode. Review manually before production.*

**Window and display**

- **If the window is narrower than 4:3 or wider than 21:9**: the world keeps the clamped shape (Formula 1) with black bars on the long side, and the UI layer is laid out inside the same rectangle, so no HUD element sits over a bar.
- **If the window is under 270 pixels tall**: the nearest-neighbour upscale becomes a downscale and some internal rows are skipped. The game still runs. Only the UI's own scale (Settings & Input Formula 5) protects text at that size.
- **If the window size or display mode changes mid-play** (including Settings & Input's 10-second revert): `W_int` and `scale` are recomputed on the next frame. The dither pattern stays on the internal grid, and the frame on which the size changes may show one stretched image.
- **If the scale is not a whole number** (720p, the Deck, 1366×768): some internal pixels cover one more screen row or column than their neighbours, and `scale_x` may differ from `scale` by the rounding of `W_int` (Formula 1). This is accepted (owner decision 2026-11-17), and the shade gap is unaffected because it is a contrast between areas, not edges.

**Clock and light**

- **If `time_of_day` arrives outside 6.0–24.0** (a corrupted save or a bad value): the lighting clamps it to 6.0–24.0 and logs one warning. It never extrapolates past the Night key.
- **If the clock is held at 24:00 during the midnight grace** (Day, Night & Sleep rule 6): the Night key holds. Nothing new happens.
- **If the overnight jumps the clock from 24:00 to 06:00**: the light jumps from the Night key to the Sunrise key while the screen is black (Day, Night & Sleep rule 8), so the player never sees the jump.
- **If a co-op client's clock is held by a host correction** (Day, Night & Sleep: the clock never runs backwards): the light holds with it and never runs backwards either.
- **If a player joins a co-op game mid-day**: their first frame uses the host's current time behind the loading fade, so there is no sunrise-to-now sweep.
- **If Day, Night & Sleep's config changes the phase boundaries** (another day length or a different warning lead): the five key hours (Formula 3) and the sun's day (Formula 2) follow on the next frame. Mid-play this only happens in development tools.
- **If a region has no light profile, or its profile fails the Formula 5 check or rule 15's gap match at load**: the scene uses North East's profile, and the error names the region, the key and the contrast reached. Rendering never stops the game for it. The build check (AC-11) makes sure this never ships.

**Shade**

- **If Shade Sweet Spots' shapes overlap**: they are drawn as their union, filled once with Shade Water. Shade is never darkened twice.
- **If a shade shape extends past the shoreline**: only the part on the water plane is drawn. Land under a tree shadow stays as vertex lighting draws it, with no shadow, because the game has no real-time shadows (rule 3).
- **If a shade shape lies beyond casting range**: it is drawn and fogged like any surface (Formula 4). The 3:1 guarantee applies only out to `cast_max_m`.
- **If Shade Sweet Spots provides shapes while `is_night` is true**: this system draws what it receives, and debug builds log a warning. "No shade at night" is Shade Sweet Spots' rule, and its own acceptance criteria test it.
- **If the YAK LOCKED blur is on**: shade edges soften over `yak_blur_px` internal pixels, but shape interiors keep the 3:1 gap. Whether that softening is part of "fishing gets harder" is Chill Meter & Smoking's call (art bible, Open points).

**Effects and settings**

- **If `vibrance` changes while a ramp is running**: the ramp continues from the value on screen toward the new target. It never restarts from 0.
- **If `vibrance` arrives above 2.0 or below 0**: it is clamped to 0–2.0. Gear that multiplies Chill (the gas mask's ×2) multiplies how fast the meter fills, not vibrance.
- **If the game is paused in solo** (Settings & Input rule 17): a ramp already running finishes on real frame time under the pause screen. Targets cannot change while paused, because the Chill Meter is paused too.
- **If a pixel is grey or white**: vibrance leaves it unchanged (Formula 6). The sober sky keys carry 10–15% saturation (owner decision 2026-11-17), so the sky still gains colour: the Day horizon `#B3C8C8` becomes `#A0CCCC` at YAK LOCKED. A truly grey pixel never changes.
- **If Brightness 1.2 pushes a bright surface past white**: that channel clips at 1.0. This happens before vibrance (rule 1), so the Sober and high frames clip alike and vibrance still keeps luminance. Water never comes close to clipping, so the gap is unaffected.
- **If the camera bobs or sways** (the kayak, a paddle stroke): with Vertex wobble on, the whole world shimmers slightly as vertices cross snap lines. This is the intended PS1 look, and players who dislike it turn Vertex wobble off.
- **If a vertex is behind the camera** (clip w ≤ 0): it is not snapped, which avoids a divide-by-zero and a flipped vertex.
- **If more than `max_local_lights` local lights are in view**: the 4 nearest to the camera are used. Scenes are authored with no more than 4, so this fallback is a safety net, and swapping a light in or out may pop.
- **If the CRT filter is on and HUD text has strokes thinner than 2 screen pixels**: a stroke can fall on a scanline and lose up to 40% of its light (`crt_line_max` 0.4, linear), about 21% of its on-screen value. Label Cream on Plate still keeps 8.7:1 contrast on a line row (AC-25). The HUD & Catch Banner GDD sets its minimum stroke width with this in mind.
- **If the CRT filter is on and the window is under 270 pixels tall**: every row is a line row, and the frame dims evenly by `crt_mean_dark` (Formula 8).

**Pause, fades and the phone**

- **If the phone is open**: the world keeps rendering behind it, with every effect. The phone is UI and ignores sun and vibrance (art bible, Flip phone row).
- **If a fade to black is running** (Scene Flow & Loading, the overnight): the fade is drawn in the UI layer above the world, so vibrance and Brightness cannot lighten it. Under CRT the scanlines over black stay black.

## Dependencies

**Upstream (this system reads from them).** Every upstream link is soft: without it the system still draws a valid frame using the fallback named.

| System | Hard / Soft | Interface | Without it |
|---|---|---|---|
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`, In Review) | Soft | `time_of_day`, `phase`; the phase-boundary hours `dawn_end_hour`, `dusk_start_hour`, `night_start_hour` | The Day key and a noon sun |
| Settings & Input (`design/gdd/settings-input.md`, In Review) | Soft | Brightness, Vertex wobble, CRT filter (its rule 8) | The defaults: 1.0, On, Off |
| Casting & Tangle (not designed) | Soft | `cast_max_m` for Formula 4's fog constraint | The provisional 30 m |
| Player Controller (not designed) | Soft | Camera transform and field of view | — (the camera always exists) |
| Scene Flow & Loading (not designed) | Soft | The scene's light profile and region on load | Outdoor profile, North East |

**Contracts this system owns that its dependents feed** (data flows in, but the dependency runs the other way, so the systems index has no cycle):

| System | Depends on this for | Feeds back | Hard / Soft for them |
|---|---|---|---|
| Shade Sweet Spots (not designed) | `sun_direction(time_of_day)` and `pond_north_deg` (Formula 2); the guarantee that its shapes are drawn as readable shade (rules 5–6) | Shade shapes on the water plane, none at night | Hard |
| Chill Meter & Smoking (not designed) | Drawing vibrance and the YAK LOCKED blur (rule 7, Formula 6) | `vibrance` 0–1.0 and `yak_blur` for the local player | Hard |

**Downstream (other systems depend on this):**

| System | Hard / Soft | What it relies on |
|---|---|---|
| Shade Sweet Spots | Hard | As above |
| Chill Meter & Smoking | Hard | As above |
| HUD & Catch Banner | Soft | The UI layer gets no world effects (rule 1); the CRT stroke rule (Edge Cases) |
| Flip Phone & FishMail; Main Menu & Intro; Home & Dock Menus | Soft | The same UI-layer guarantee; Main Menu sets the pinned hour (rule 14) |
| Day, Night & Sleep | Soft | Its Visual/Audio requirements and AC-21 are met here (light follows the phase, fog density fixed) |
| Every art asset | — | Asset standards follow from rules 2, 3, 8 and 9 (art bible Section 8, not yet written) |

**Bidirectional check** (2026-11-17):
- Settings & Input lists Retro Rendering as a soft dependency (Brightness, Vertex wobble, CRT filter), and that matches.
- Day, Night & Sleep lists Retro Rendering as a soft dependent for `time_of_day`, `phase` and the three phase-boundary hours (added there 2026-11-17), and that matches.
- The systems index's row 6 listed only Settings & Input (soft). It now also lists Day, Night & Sleep (soft) and Casting & Tangle (soft).
- Rows 7 (Shade Sweet Spots) and 11 (Chill Meter & Smoking) already list Retro Rendering.
- Casting & Tangle, Player Controller, Scene Flow & Loading, Shade Sweet Spots, Chill Meter & Smoking and the HUD have no GDD yet. Each must list Retro Rendering when it is written.

## Visual/Audio Requirements

*`art-director` and `technical-artist` not consulted — Lean mode, and Visual/Audio is optional for a `Core` system. Review manually before production.*

- **Per-region data, authored once per region:** the palette (Lit Water, Shade Water, sky/fog and the land colours) and the four light keys (Formula 3). Each region shifts hue and temperature only, and must pass Formula 5. The MVP needs North East only.
- **North East starting light keys** (2026-11-17; tune in the engine prototype, Open Question 6). Each passes Formula 5 in the worst case (Brightness 0.8, CRT on). Saturation is HSV, under the art bible's 50% cap for sober colours.

  | Key | At (defaults) | Horizon and fog | Zenith | Ambient | Sun or moon (intensity) | Water light (RGB) | `k` | Worst-case C |
  |---|---|---|---|---|---|---|---|---|
  | Sunrise | 06:00 | `#E3C2A8` pale peach (26%) | `#A9BDC6` | `#7C7A88` | `#FFC08A` (0.6), low in the east | 0.97, 0.93, 0.92 | 0.935 | 3.05 |
  | Day | 08:00–19:00 | `#B3C8C8` misty blue-green (10.5%) | `#A3BAC4` | `#8C9690` | `#FFF1DC` (1.0) | 1, 1, 1 | 1.000 | 3.12 |
  | Sunset | 21:00 | `#D4A07A` muted amber (42%) | `#5E6A80` cool slate | `#7E7078` | `#FF9A55` (0.55), low in the west | 1.08, 0.92, 0.80 | 0.933 | 3.06 |
  | Night | 22:00–24:00 | `#2E3550` | `#1B2030` | `#2C3348` | moon `#8FA0D8` (0.35), straight down | 0.30, 0.34, 0.48 | 0.345 | — (no shade) |

  The Sunset horizon is a muted amber, not Ember: the art bible caps Ember at about 5% of the frame, so Ember is kept for the sun disc and the glows. The Day horizon replaces Fog Pale (`#C9CFC6`, 4% saturation) as the sky and fog colour, so that vibrance has colour to push (owner decision 2026-11-17; the art bible's palette row carries a note). The browser sketch's sky ramp was the starting point.
- **Water assets:** the water plane and the shade shapes are untextured flat colour, so nothing on them can break up the shade edge (art bible, Shape Language: "big, simple wedges with an unbroken edge").
- **Ember points at night** (the shack window, a lighter) are local lights or unlit emissive surfaces. They are the only saturated things on Night water.
- **What asset authors must know** (for art bible Section 8): no normal maps or PBR detail, because vertex light ignores them; textures 64–256 px, imported with nearest filtering; large flat surfaces subdivided so affine warping stays mild; at most 4 local lights per scene.
- **Audio:** none. Audio reads Day, Night & Sleep's `phase_changed` directly, not this system.

> 📌 **Asset Spec** — Visual/Audio requirements are defined. After the art bible is approved, run `/asset-spec system:retro-rendering` to produce per-asset visual descriptions, dimensions, and generation prompts from this section.

## Game Feel

- **Vibrance blooms, it never snaps.** Each Chill step eases in over about 0.5 s (Formula 6), so getting higher reads as the pond ripening, not a filter switching on.
- **YAK LOCKED arrives in about a second and leaves in two.** The blur ramps in over 1.0 s and out over 2.0 s, so coming down is gentler than going up.
- **The world moves; the HUD doesn't.** No world effect (wobble, blur, vibrance, Brightness) ever touches the UI, so a gauge or FISH ON stays exactly where the hand expects it at every level.
- **Wobble only shows in motion.** A still camera gives still snapped vertices. Paddling and looking around bring the PS1 shimmer.
- **No added latency.** The post pass works on the current frame only, with no temporal effects, so this system adds no frame of delay to the 3-frame input target in Settings & Input's Game Feel.

## UI Requirements

This system has no screens of its own. Its three player settings (Brightness, Vertex wobble, CRT filter) are rows on Settings & Input's Graphics tab, which owns the screen. One requirement for that tab: when Settings is opened from gameplay, the world stays visible behind the panel, so changing Brightness, Vertex wobble or CRT shows its effect at once (Settings & Input rule 8: "each change takes effect at once").

## Cross-References

| Document | Section | What this GDD uses |
|---|---|---|
| Art bible (`design/art/art-bible.md`) | 1 Principles 1–3; 2 Mood & Atmosphere; 3 Shadows; 4 Colour System (palette, UI palette, Vibrance rule 1–5, Region temperature, Open points) | The look; vibrance on the world only, before the HUD; saturation only; the 3:1 shade gap; the UI never gets fog, tint, dither or vibrance; fog density fixed; night water flat |
| Day, Night & Sleep (`design/gdd/day-night-sleep.md`) | Core Rules 3, 4, 6, 8; Formula 1 (sunrise 6.0, the `dt` cap) and Formula 2 (phase boundaries, `night_start_hour`); Visual/Audio; AC-21 | The clock and phases; the light must not pop; the Night key holds through the midnight grace; the jump to sunrise is hidden by the overnight black |
| Settings & Input (`design/gdd/settings-input.md`) | Rule 8 (Graphics rows: Brightness 0.8–1.2, Vertex wobble On, CRT filter Off; "internal render resolution is not a setting"); rule 17 (solo pause); Formula 5 (UI scale); Game Feel (3-frame target); Open Question 2 (deferred screen-effect intensity slider) | The three settings this system applies; the HUD is laid out at native resolution |
| Game concept (`design/gdd/game-concept.md`) | Pillar 4; Pillar 5; Technical Considerations | Budget Charm; each player sees their own high; the PS1 look in Forward+ is a named technical risk |
| Game brief (`design/game-brief.md`) | Look and references; Smoking & the Chill Meter | 64–256 px nearest textures; vertex snapping and affine wobble, toggleable; ordered dither; distance fog; vertex lighting with a warm time-of-day tint; CRT option; the vibrance values per Chill state; YAK LOCKED blur |
| Browser sketch (`prototypes/catch-n-burn/index.html`, `config.js`) | `build3D`, the post pass, `ps1_snap`, `dither`, `crt`, `vib_*`, `sun_max_deg`, `cast_max` | 480×270, the 1.5 px snap grid, 5-bit Bayer dither, the 2 px blur, the 58° noon sun, the 30 m cast |
| `project.yaml` | `performance` | 60 fps on Steam Deck, 16.67 ms frame |
| Systems index (`design/gdd/systems-index.md`) | Row 6; High-Risk Systems (Retro Rendering, Shade Sweet Spots) | The engine prototype for the look and the shade gap before art production |

## Acceptance Criteria

Story types: **Logic** needs an automated unit test; **Visual** and **UI** need retained screenshots in `production/qa/evidence/` (and lead sign-off for Visual); **Check** is a scripted inspection or profile; **Integration** is a test or documented playtest. Where Shade Sweet Spots or Chill Meter & Smoking does not exist yet, a fake supplies their values (a fixed wedge shape; a settable `vibrance` and `yak_blur`).

**Frame order and layers**

- **AC-1** (Visual, rule 1) — **GIVEN** the home pond with the HUD showing, **WHEN** one screenshot is taken at Sober, Brightness 1.0, and one at YAK LOCKED (`vibrance` 1.0, blur on), Brightness 1.2, both with CRT off, **THEN** every fully opaque HUD pixel (plates, labels, meters) is identical between the two, and no HUD pixel shows a dither pattern, while the world pixels differ. The opaque set is the pixels where the UI layer's alpha is 1, captured as a mask from the UI layer alone; anti-aliased glyph edges and translucent pixels blend the world behind them, so they are excluded. Screenshots and the mask retained.
- **AC-2** (Check, rule 3) — **GIVEN** a test scene of unlit cards in each of the 7 world palette colours, **WHEN** rendered at Brightness 1.0, `vibrance` 0, with dither off through a debug switch, **THEN** each card reads back within 1/255 of its hex on every channel.
- **AC-3** (Check, rule 3) — **GIVEN** the project settings and every light and environment resource, **WHEN** scanned, **THEN** real-time shadows, glow, auto-exposure, SSAO, SSR, SSIL, MSAA, FXAA, SMAA, TAA and HDR output are all off, and no scene has more than 4 local lights. The script lists every resource it checked.

**Resolution**

- **AC-4** (Logic, Formula 1) — **GIVEN** windows of 1920×1080, 1280×800, 1024×768, 3440×1440, 3840×1080 and 1280×1024, **WHEN** the internal resolution is computed, **THEN** it is 480×270 (scale 4.0), 432×270 (scale 2.963), 360×270, 646×270 (`scale_x` 5.325, no crop), 646×270 with bars left and right, and 360×270 with bars top and bottom, in that order. 1366×768 gives 480×270 with `scale_x` 2.846. The integer computation gives the same results on every run and platform.
- **AC-5** (Visual, rule 2) — **GIVEN** a Steam Deck at 1280×800 and a 3840×1080 window, **WHEN** the pond is shown, **THEN** the Deck frame has no bars and pixel blocks about 3 screen pixels wide, and the 32:9 frame has side bars with every HUD element inside the world's rectangle. Screenshots retained.

**Time of day**

- **AC-6** (Logic, Formula 2) — **GIVEN** the defaults (`night_start_hour` 21.0, `pond_north_deg` 0), **WHEN** `sun_direction` is computed, **THEN**:
  - t 6.0 gives azimuth 90° and elevation 10°.
  - t 9.0 gives 126° and 38.2° (± 0.1°).
  - t 13.5 gives 180° and 58°.
  - t 21.0 gives 270° and 10°.
  - With `night_start_hour` 16.5, t 13.5 gives 218.6° and 47.5°.
  - `pond_north_deg` 90 adds 90° to every azimuth.
  - Elevation is never below 10° for t from 6.0 to `night_start_hour`.
  - The same inputs give bit-identical results on two runs.
- **AC-7** (Logic, Formula 3) — **GIVEN** the defaults and four test keys with distinct colours, **WHEN** the light is sampled, **THEN**:
  - t 7.0 is the midpoint of Sunrise and Day.
  - t 13.0 is exactly Day.
  - t 20.0 is the midpoint of Day and Sunset.
  - t 21.0 is exactly Sunset.
  - t 21.5 gives `w_night` 0.5.
  - t 23.0 is exactly Night.
  - Sampling 6.0 to 24.0 in 0.001 h steps, no channel changes by more than 0.01 between neighbouring samples, so there is no pop.
- **AC-8** (Visual + Integration, rule 4; meets Day, Night & Sleep AC-21) — **GIVEN** the home pond, **WHEN** `time_of_day` is 6.0, 12.0, 19.5, 21.0 and 23.9, **THEN** the sky, light direction and tint differ in each, and the debug fog readout for a surface at 100 m shows `f` = 0.459 ((100 − 32) / 148) in all five. Screenshots retained.
- **AC-9** (Integration, edge case) — **GIVEN** the overnight running at the defaults (Day, Night & Sleep AC-22), **WHEN** every frame from the start of the fade out to the end of the fade up is captured, **THEN** no frame showing any world pixel shows the jump from the Night key to the Sunrise key.

**Fog and the shade gap**

- **AC-10** (Logic, Formula 4) — **GIVEN** the defaults, **WHEN** `f` is computed, **THEN** it is 0 at 0, 30 and 32 m, 0.5 at 106 m, and 1 at 180 and 500 m. The load check refuses `fog_start_m` 31 (with `cast_max_m` 30 and `fog_margin_m` 2) and `fog_end_m` 60 (with `fog_start_m` 32), and each message names the rule broken.
- **AC-11** (Logic, Formula 5, rules 6 and 15) — **GIVEN** the shade-gap check tool and every region's profile, **WHEN** it evaluates the Sunrise, Day and Sunset keys at Brightness 0.8, 1.0 and 1.2 with CRT off (`m` 1.0) and on (`m` 0.92), **THEN** every case gives C ≥ 3.03 (`gap_check`).
  - Known values: North East at Day, Brightness 1.0, CRT off gives 3.47 (± 0.01); at Brightness 0.8 with CRT on it gives 3.13.
  - A test profile with untinted Sunset `water_light` at `k` 0.85 is refused, with a message naming the region, the key and 2.94. One at `k` 0.90 is refused naming 3.01, and one at `k` 0.92 passes.
  - A test region whose Lit Water luminance is 0.340 (North East + 0.008) is refused by rule 15's match, with a message naming the region and the colour. So is a test region with North East's Lit Water and a Shade Water of luminance 0.064 (gap 3.35, 0.12 below North East's).
  - The tool runs in the build check, so a failing profile fails the build. It prints each case it evaluated.
- **AC-12** (Visual, rule 6, in engine) — **GIVEN** the home pond and a Shade fake giving one wedge at 25 m, **WHEN** screenshots are taken in a 1280×800 window (the Deck's size) at 06:00 (the Sunrise key), 13:30 and 20:59 (the last minute before Night, nearest the Sunset key) × Brightness 0.8 and 1.2 × CRT off and on × `vibrance` 0 and 1.0 (24 captures, scripted), and the 6 CRT-on captures at Brightness 0.8 are repeated at 1920×1080, **THEN** in every capture the contrast (Formula 5's `C`) between an 8×8 internal-pixel patch at least 3 px inside the wedge and an adjacent lit-water patch is ≥ 3.0. Each patch's luminance is the mean of `Y` over its screen pixels after decoding them from sRGB to linear light, never the mean of encoded values. Screenshots and the table of values retained.
- **AC-13** (Visual, rule 5) — **GIVEN** the Shade fake giving no shapes at 21:30 (Night), **WHEN** the water inside casting range is sampled, **THEN** its luminance varies by no more than 2 quantisation levels (dither only): single-value water. Screenshot retained.
- **AC-14** (Logic, rule 5, edge case) — **GIVEN** two overlapping wedges from the Shade fake, **WHEN** drawn, **THEN** the overlap has the same colour as either wedge alone, and wedge pixels outside the water plane are not drawn.

**Vibrance and blur**

- **AC-15** (Logic, Formula 6) — **GIVEN** the vibrance function, **WHEN** tested, **THEN**:
  - A grey pixel is unchanged at `v` 0, 0.15, 1.0 and 2.0.
  - Spruce `#3E5A45` at `v` 1.0 gives `#176032` (± 1 per channel).
  - For 10,000 seeded colours at `v` 0.15, 0.6, 1.0 and 2.0, every output channel lies within 0–1 and Y matches the input to within 1e-6.
  - `v` −0.5 and 3.0 are clamped to 0 and 2.0.
- **AC-16** (Logic, Formula 6) — **GIVEN** `vibrance_ramp` 0.3, **WHEN** the target goes from 0 to 0.15, **THEN** `v_shown` reaches 0.15 at 0.5 s (± one frame). **WHEN** the target changes to 0.6 while the ramp is at 0.10, **THEN** it continues from 0.10 without resetting.
- **AC-17** (Logic, States) — **GIVEN** the YAK blur state machine, **WHEN** `yak_blur` turns on, **THEN** `σ` reaches 1 at 1.0 s. **WHEN** it turns off at `σ` 0.5, **THEN** `σ` falls to 0 in 1.0 s. **WHEN** it turns on again at `σ` 0.25, **THEN** `σ` rises from 0.25. **GIVEN** the blur kernel at `yak_blur_taps` 8 and 4, **THEN** each pass's weights sum to 1 (± 1e-6), the offsets are symmetric about 0 with the outermost at ± `blur_radius_px × (taps − 1) / taps`, and a flat-colour frame comes out unchanged.
- **AC-18** (Visual, rule 7; art bible Vibrance rule 2) — **GIVEN** the same frozen view at Sober and at `vibrance` 1.0 with the blur off (debug switch), once at Brightness 1.0 and once at 1.2, **WHEN** each pair is converted to greyscale, **THEN** no pixel differs by more than 3/31 and the frame mean differs by no more than 1/31. Screenshots retained.
- **AC-19** (Integration, rule 7; Pillar 5) — **GIVEN** two co-op peers at the same host time, player A at YAK LOCKED and player B Sober, **WHEN** both screens are captured, **THEN** B's world shows `vibrance` 0 and no blur, A's shows 1.0 with blur, and `sun_direction` matches on both to 1e-4. Screenshots retained.

**Wobble, textures and output**

- **AC-20** (Logic, Formula 7) — **GIVEN** `snap_step_px` 1.5 on a 480-wide frame, **WHEN** snapped, **THEN** pixel 316.10 gives 316.5 and 317.30 gives 318.0.
  - At step 1.0 every position rounds to a whole pixel.
  - The load check refuses 0.9.
  - A vertex with clip w ≤ 0, a vertex of an exempt mesh (water plane, shade shape), and any vertex with Vertex wobble off are returned unchanged.
- **AC-21** (Visual, rule 8) — **GIVEN** the camera panning at 10°/s past a prop, **WHEN** 10 consecutive frames are captured with Vertex wobble On and again with it Off, **THEN** with On, the prop's silhouette vertices move in steps of at least 1 internal pixel, and the water edge and HUD never step. With Off, no step-jumps appear. Captures retained; lead sign-off.
- **AC-22** (Check, rule 9) — **GIVEN** every world texture's import settings, **WHEN** scanned, **THEN** each uses nearest filtering (mipmaps nearest between levels if enabled) and is 64–256 px on its longest side. The script lists each file.
- **AC-23** (Logic, Formula 8) — **GIVEN** the output functions, **WHEN** tested, **THEN**:
  - Brightness 1.2 on linear 0.9 clips to 1.0.
  - Brightness is applied before vibrance: a linear colour (0.95, 0.5, 0.2) at Brightness 1.2 and `v` 1.0 has the same `Y` as the same colour at Brightness 1.2 and `v` 0 (± 1e-6).
  - `e` 0.5 quantises only to 15/31 or 16/31, and a 4×4 block averages 15.5/31 (± 0.01).
  - Over a 4×4 block, the dither offsets `((B4 + 0.5) / 16 − 0.5)` sum to 0.
  - `e` 0 and 1 stay 0 and 1.
  - CRT `line_dark` is 0.237 at scale 2.963 and 0.32 at scale 4. At scale 5.333 it caps at 0.4 with `m` 0.925. At scale 1 and at scale 0.5 every row is a line row, `line_dark` is 0.08 and `m` is 0.92.
  - The CRT darkens in linear light: an encoded 0.5 pixel on a line row at scale 2.963 becomes 0.441 (± 0.002), not 0.381.
- **AC-24** (Visual, rule 11) — **GIVEN** a flat gradient wall filling the frame, **WHEN** the camera translates sideways by 5 internal pixels, **THEN** the dither pattern stays at the same screen positions and does not move with the wall. Screenshot pair retained.
- **AC-25** (Visual, rule 12) — **GIVEN** CRT on at 1280×800, **WHEN** the pond with the HUD and then a fade to black are captured, **THEN** scanlines cross both world and HUD; measured from the capture, a Label Cream stroke on a scanline row keeps at least 4.5:1 contrast against the Plate beside it (8.7:1 expected at `crt_line_max` 0.4); and the black fade shows no lighter lines. Screenshots and the measured values retained.
- **AC-26** (UI, UI Requirements) — **GIVEN** Settings opened from gameplay, **WHEN** Brightness moves from 1.0 to 0.8, **THEN** the world behind the panel darkens on the next frame and the panel itself does not change. Screenshot pair retained.

**Profiles, data and state**

- **AC-27** (Visual, rule 13) — **GIVEN** the shack interior at 13:00 and at 23:00, **WHEN** captured from the same spot, **THEN** interior light and colours are identical except the window, which shows the Day and Night sky colours, and there is no fog. Screenshots retained.
- **AC-28** (Visual, rule 14) — **GIVEN** the main menu, **WHEN** captured twice 60 s apart, **THEN** the light is identical (pinned Dusk). Screenshots retained.
- **AC-29** (Logic, edge cases) — **GIVEN** `time_of_day` 25.0, **THEN** the light equals that at 24.0 and one warning is logged. **GIVEN** a region with no light profile, **THEN** North East's profile is used and the error names the region.
- **AC-30** (Check, rule 16) — **GIVEN** the project source, **WHEN** Retro Rendering's files are searched, **THEN** they contain no save or load calls and no replicated or synchronised properties.
- **AC-31** (Check, performance) — **GIVEN** a Steam Deck at 1280×800 on the home pond at Dusk, YAK LOCKED, CRT on, Vertex wobble on, **WHEN** profiled for 60 s, **THEN** frames are at or under 16.67 ms at the 99th percentile, and this system's post pass, upscale and CRT together average no more than 1.0 ms of GPU time per frame. If it fails, rule 17's steps are applied in order and the profile is re-run; the AC passes only on a run that meets both numbers.

## Open Questions

**Closed 2026-11-17** (numbers kept for traceability):
- **1 Phase-boundary hours.** Day, Night & Sleep now publishes `dawn_end_hour`, `dusk_start_hour` and `night_start_hour` to this system (its Interactions table and Dependencies).
- **3 Sober sky.** Owner decision: the sky keys carry about 10–15% saturation (rule 4, Visual/Audio), and the art bible's Fog Pale row carries a note.
- **5 Steam Deck fallback.** Owner decision: cut cost, keep the look (rule 17).
- **9 North East light keys.** Starting values are in Visual/Audio and pass Formula 5 (worst case 3.05). Tuning continues in the prototype under Open Question 6.

| # | Question | Owner | Resolve by |
|---|---|---|---|
| 2 | **Engine gaps, narrowed.** Verified in the Godot 4.7 docs on 2026-11-17 and recorded in `docs/engine-reference/godot/modules/rendering.md`: Viewport `SCALING_3D_MODE_NEAREST` (the 3D buffer renders low while the 2D UI stays native, the likely route for rule 1 steps 1–4); `FOG_MODE_DEPTH` with `fog_depth_begin`, `fog_depth_end` and `fog_depth_curve`; `TONE_MAPPER_LINEAR` ("does not modify color data"); glow, SSAO, SSR, SSIL and SDFGI off by default; `SHADING_MODE_PER_VERTEX` and `render_mode vertex_lighting`. **Still unproven, for the engine prototype:** (a) whether per-vertex shading is honoured under Forward+ (the docs don't say); (b) whether `scaling_3d_scale` accepts 270 / window height at every size (0.25 at 1080p, 0.1875 at 1440p, non-whole ratios on the Deck), and whether Compositor effects (the post pass) run at the internal resolution; (c) whether depth fog is radial or view-depth (either passes Formula 4); (d) affine mapping, where the shading language has only `flat` and `smooth`, so it needs the UV × w trick; (e) that HDR output is off by default (`display/window/hdr/request_hdr_output`). Then write the ADR. | godot-shader-specialist / technical-artist with the owner | Before the first rendering story and before art production |
| 4 | **`cast_max_m` is provisional at 30 m** (the browser sketch). Formula 4 puts the fog start just past it, so a longer cast pushes the mist out. | Casting & Tangle GDD | When that GDD is written |
| 6 | **Does Dusk still feel like dusk?** The starting Sunset key keeps water light at 0.93 and puts the mood in the amber horizon, slate zenith and Ember sun. Check in the prototype. If Dusk reads as flat, revisit the every-setting promise (owner decision 2026-11-17), not the 3:1 rule. | Owner | Engine prototype |
| 7 | **Screen-effect intensity slider** (Settings & Input Open Question 2, deferred). If it ships, it would scale `vibrance`, blur and wobble here; Formula 5 is unaffected because vibrance keeps luminance. | Owner | After the first Godot playtest |
| 8 | **Drunk or Munchies screen effects.** The art bible says Munchies changes nothing in the world, and the brief gives Drunk no visual. If Hunger, Munchies & Drunk wants one, it arrives as a new post-pass input here and must still pass Formula 5. | Hunger, Munchies & Drunk GDD | When that GDD is written |
