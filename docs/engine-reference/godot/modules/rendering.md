# Godot Rendering — Quick Reference

Last verified: 2026-11-17 (low-res retro rendering APIs, from the official 4.7 class docs); 2026-10-21 (Windows driver default, Compositor); 2026-10-17 (4.7 changes); 2026-02-12 (rest) | Engine: Godot 4.7

## What Changed Since ~4.3 (LLM Cutoff)

### 4.7 Changes
- **`AreaLight3D`**: real-time rectangular area lights
- **HDR output** on Windows, macOS, iOS, visionOS and Linux (Wayland)
- **`DrawableTexture2D`**: simple API for drawing on textures (4.7 release notes: https://godotengine.org/releases/4.7/)
- **`CanvasItem` lines**: no antialiasing feather, so lines look thinner
- **`LinearToSRGB` visual shader** no longer clamps to `[0.0, 1.0]` (Forward+, Mobile)
- **`get_format()`** moved from `ImageTexture` / `PortableCompressedTexture2D` to `Texture2D`
- **`rendering/reflections/sky_reflections/roughness_layers`** default `7` → `8` (4.7 migration guide: https://docs.godotengine.org/en/stable/tutorials/migrating/upgrading_to_godot_4.7.html)

### 4.6 Changes
- **Windows driver default is still Vulkan.** D3D12 is opt-in: set `rendering/rendering_device/driver.windows` to `d3d12`, or pass `--rendering-driver d3d12` (Godot source, main/main.cpp at 4.6, 4.7 and 4.7.2)
- **Glow processes before tonemapping** (was after) — uses screen blending mode
- **AgX tonemapper**: new white point and contrast controls
- **SSR overhauled**: better realism, visual stability, and performance

### 4.5 Changes
- **Shader Baker**: Pre-compiles shaders to reduce startup time
- **SMAA 1x**: New anti-aliasing option (sharper than FXAA, cheaper than TAA)
- **Stencil buffer support**: Enables selective geometry masking/portal effects
- **Bent normal maps**: Directional occlusion encoded in normal map textures
- **Specular occlusion**: Ambient occlusion now correctly affects reflections

### 4.4 Changes
- **`RenderingDevice.draw_list_begin`**: Many parameters removed; optional `breadcrumb` added
- **`Shader` default-texture methods**: `set_default_texture_parameter()` takes and
  `get_default_texture_parameter()` returns `Texture`, not `Texture2D` (the shading
  language's `sampler2D` / `texture()` did not change)
- **Particles `.restart()`**: Added optional `keep_seed` parameter

### 4.3 Changes (in training data)
- **`Compositor` resource**: `Compositor` + `CompositorEffect` for post-processing chains. Both are `Resource`s, not nodes
  (Godot source, `class Compositor : public Resource` in scene/resources/compositor.h at 4.6 and 4.7.2)

## Current API Patterns

### Post-Processing (4.3+)
```gdscript
# Use a Compositor resource — NOT manual viewport shader chains.
# Compositor is a Resource, not a node: assign it to the `compositor`
# property of a WorldEnvironment or Camera3D; it never enters the scene tree.
# (Godot source at 4.6 and 4.7.2: `class Compositor : public Resource` in
# scene/resources/compositor.h; `set_compositor` in scene/3d/world_environment.h
# and scene/3d/camera_3d.h)
var compositor := Compositor.new()
compositor.compositor_effects = [MyEffect.new()]  # MyEffect extends CompositorEffect
$WorldEnvironment.compositor = compositor
```

### Anti-Aliasing Options (4.6)
```
Project Settings → Rendering → Anti Aliasing:
- MSAA 2D/3D: Hardware MSAA (quality but expensive)
- Screen Space AA: FXAA (fast, blurry) or SMAA (sharp, moderate cost)  # SMAA new in 4.5
- TAA: Temporal (best quality, ghosting on fast motion)
```

### Rendering Backend Selection (4.6)
```
Project Settings → Rendering → Renderer:
- Forward+ (default): Full featured, desktop-focused
- Mobile: Optimized for mobile/low-end, limited features
- Compatibility: OpenGL 3.3 / WebGL 2, broadest hardware support

Windows default driver: Vulkan; D3D12 only when `rendering/rendering_device/driver.windows`
is set to `d3d12` (Godot source, main/main.cpp at 4.6, 4.7 and 4.7.2)
```

### Low-Resolution Retro Rendering (verified 2026-11-17)
Read on docs.godotengine.org/en/stable, whose pages are headed "Godot Engine 4.7 documentation". Gathered for `design/gdd/retro-rendering.md`, Open Question 2.
- **3D render scale with nearest-neighbour:** `Viewport.scaling_3d_mode` includes `SCALING_3D_MODE_NEAREST` (= 5), "Use nearest-neighbor filtering for the viewport's 3D buffer." The page recommends whole-divisor scales such as 0.5 or 0.25. The 2D canvas (UI) is not scaled by it. (class_viewport.html)
- **Depth fog:** `Environment.fog_mode` is `FOG_MODE_EXPONENTIAL` (= 0, the default) or `FOG_MODE_DEPTH` (= 1), "a simple fog model defined by start and end positions and a custom curve." Its properties are `fog_depth_begin` (default 10.0), `fog_depth_end` (default 100.0) and `fog_depth_curve` (default 1.0). (class_environment.html)
- **Tonemapping:** `tonemap_mode` values are `TONE_MAPPER_LINEAR` (= 0), `REINHARDT`, `FILMIC`, `ACES` and `AGX`. Linear "does not modify color data". `tonemap_exposure` and `tonemap_white` both default to 1.0. (class_environment.html)
- **Off by default:** `glow_enabled`, `ssao_enabled`, `ssr_enabled`, `ssil_enabled` and `sdfgi_enabled` all default to `false`. (class_environment.html)
- **Per-vertex lighting exists:** BaseMaterial3D `shading_mode` has `SHADING_MODE_PER_VERTEX` (= 2), and spatial shaders take `render_mode vertex_lighting`. When vertex lighting is on, `light()` does not run. The project setting is labelled "Force Vertex Shading" and is on by default on mobile. (class_basematerial3d.html, spatial_shader.html)
- **Varying qualifiers:** only `flat` and `smooth` (the default) are listed, with no `noperspective`. For PS1 affine texture mapping, pass `uv * w` and `w` as smooth varyings and divide in `fragment()`. (shading_language.html)
- **NOT VERIFIED; check in an engine prototype before relying on them:**
  - whether per-vertex shading is honoured under the Forward+ renderer (no page states renderer support);
  - the allowed range of `scaling_3d_scale` (for example 0.1875 = 270 / 1440);
  - whether `CompositorEffect`s run at the scaled 3D resolution;
  - whether `FOG_MODE_DEPTH` measures radial distance or view depth;
  - the default of `display/window/hdr/request_hdr_output` (seen only in a page summary as `false`).

## Common Mistakes
- Assuming D3D12 is the default driver on Windows (it is Vulkan through 4.7.2; D3D12 is opt-in)
- Adding `Compositor` to the scene tree as a node (it is a `Resource`; assign it to the `compositor` property;
  Godot source, scene/resources/compositor.h, scene/3d/world_environment.h and scene/3d/camera_3d.h at 4.6 and 4.7.2)
- Using manual viewport chains instead of Compositor for post-processing
- Passing or expecting `Texture2D` in `Shader.set_default_texture_parameter()` /
  `get_default_texture_parameter()` (the type is `Texture` since 4.4 — the shading
  language's `sampler2D` / `texture()` did not change)
- Not using Shader Baker for projects with many shader variants
