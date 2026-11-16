// PROTOTYPE - NOT FOR PRODUCTION
// Question: Is cast, bite, needle, smoke fun on its own, and does Chill vs Munchies make smoking a decision?
// Date: 2026-11-15
// Every tuning value lives here, each with value, min, max and step. The game reads them live
// through tune.<name> (index.html); the tweak panel, an add-on, writes them back here.
// Per-rarity values end in _c _u _r _e _l _x: Common, Uncommon, Rare, Epic, Legendary, Lost Legend.
window.CONFIG = {
  seed: 1, // every gameplay random call reads rng(), seeded from this (or ?seed= in the address)
  volume: { value: 0.5, min: 0, max: 1, step: 0.05 },

  // ---- Bite (the brief: 5 s open water, 2 s in shade, about +-1 s of jitter, 1.5 s to hook) ----
  bite_open: { value: 5, min: 1, max: 12, step: 0.25 },        // seconds, average, open water
  bite_shade: { value: 2, min: 0.5, max: 8, step: 0.25 },      // seconds, average, in shade
  bite_jitter: { value: 1, min: 0, max: 3, step: 0.1 },        // seconds either side
  hookset_window: { value: 1.5, min: 0.4, max: 3, step: 0.1 }, // seconds to press Space on FISH ON
  night_bite_mult: { value: 1.5, min: 1, max: 4, step: 0.1 },  // bites are this much slower at night

  // ---- Needle (the pull gauge): green +1, blue +3, miss -1, below 0 escapes ----
  needle_start: { value: 1, min: 0, max: 3, step: 1 },         // pulls you start with (0 = first miss loses the fish)
  needle_green: { value: 1, min: 1, max: 3, step: 1 },         // pulls for green
  needle_blue: { value: 3, min: 1, max: 5, step: 1 },          // pulls for blue
  needle_miss: { value: 1, min: 1, max: 3, step: 1 },          // pulls lost on a miss
  needle_ramp: { value: 0.05, min: 0, max: 0.3, step: 0.01 },  // the lure speeds up this much per stop
  needle_speed_c: { value: 0.55, min: 0.2, max: 3, step: 0.05 }, // sweeps per second
  needle_speed_u: { value: 0.75, min: 0.2, max: 3, step: 0.05 },
  needle_speed_r: { value: 0.95, min: 0.2, max: 3, step: 0.05 },
  needle_speed_e: { value: 1.2, min: 0.2, max: 3, step: 0.05 },
  needle_speed_l: { value: 1.45, min: 0.2, max: 3, step: 0.05 },
  needle_speed_x: { value: 1.7, min: 0.2, max: 3, step: 0.05 },
  green_c: { value: 0.26, min: 0.03, max: 0.5, step: 0.01 },   // green zone width, share of the gauge
  green_u: { value: 0.21, min: 0.03, max: 0.5, step: 0.01 },
  green_r: { value: 0.17, min: 0.03, max: 0.5, step: 0.01 },
  green_e: { value: 0.14, min: 0.03, max: 0.5, step: 0.01 },
  green_l: { value: 0.115, min: 0.03, max: 0.5, step: 0.005 },
  green_x: { value: 0.095, min: 0.03, max: 0.5, step: 0.005 },
  blue_c: { value: 0.07, min: 0.01, max: 0.2, step: 0.005 },   // blue zone width
  blue_u: { value: 0.06, min: 0.01, max: 0.2, step: 0.005 },
  blue_r: { value: 0.05, min: 0.01, max: 0.2, step: 0.005 },
  blue_e: { value: 0.045, min: 0.01, max: 0.2, step: 0.005 },
  blue_l: { value: 0.04, min: 0.01, max: 0.2, step: 0.005 },
  blue_x: { value: 0.035, min: 0.01, max: 0.2, step: 0.005 },
  pulls_c: { value: 3, min: 1, max: 15, step: 1 },             // pulls needed to land it
  pulls_u: { value: 4, min: 1, max: 15, step: 1 },
  pulls_r: { value: 5, min: 1, max: 15, step: 1 },
  pulls_e: { value: 6, min: 1, max: 15, step: 1 },
  pulls_l: { value: 8, min: 1, max: 15, step: 1 },
  pulls_x: { value: 10, min: 1, max: 15, step: 1 },

  // ---- Chill Meter (percent) ----
  chill_reggie: { value: 13, min: 2, max: 60, step: 1 },       // percent per hit, One Hitter
  chill_homegrown: { value: 19, min: 2, max: 60, step: 1 },
  chill_topshelf: { value: 26, min: 2, max: 60, step: 1 },
  chill_fire: { value: 35, min: 2, max: 60, step: 1 },
  chill_drain: { value: 0.5, min: 0.05, max: 3, step: 0.05 },  // percent per second
  yak_seconds: { value: 18, min: 4, max: 60, step: 1 },        // how long YAK LOCKED lasts
  full_hold: { value: 5, min: 0, max: 20, step: 0.5 },         // seconds the meter sits at 100% before it drains: the window for the extra hit
  grams_per_hit: { value: 0.1, min: 0.05, max: 1, step: 0.05 },
  state_bonus: { value: 0.3, min: 0, max: 1, step: 0.05 },     // each Chill state above the first lifts the tier's new rarities this much
  vib_chill: { value: 0.15, min: 0, max: 1.5, step: 0.05 },    // colour vibrance added per state
  vib_high: { value: 0.3, min: 0, max: 1.5, step: 0.05 },
  vib_stoned: { value: 0.45, min: 0, max: 1.5, step: 0.05 },
  vib_zonked: { value: 0.6, min: 0, max: 1.5, step: 0.05 },
  vib_yak: { value: 1, min: 0, max: 2, step: 0.05 },

  // ---- Hunger -> Munchies (one bar, two phases; percent) ----
  hunger_drain: { value: 0.14, min: 0, max: 1, step: 0.01 },   // Hunger lost per second
  hunger_hit: { value: 9, min: 0, max: 40, step: 1 },          // extra Hunger lost per hit
  munchies_fill: { value: 0.22, min: 0, max: 1, step: 0.01 },  // Munchies gained per second
  munchies_hit: { value: 13, min: 0, max: 40, step: 1 },       // extra Munchies per hit
  food_small: { value: 25, min: 5, max: 100, step: 5 },
  food_med: { value: 45, min: 5, max: 100, step: 5 },
  food_large: { value: 70, min: 5, max: 100, step: 5 },

  // ---- Odds: which rarity bites under each strain tier (weights) ----
  w1_c: { value: 60, min: 0, max: 100, step: 1 }, w1_u: { value: 40, min: 0, max: 100, step: 1 },
  w2_c: { value: 40, min: 0, max: 100, step: 1 }, w2_u: { value: 30, min: 0, max: 100, step: 1 }, w2_r: { value: 30, min: 0, max: 100, step: 1 },
  w3_c: { value: 30, min: 0, max: 100, step: 1 }, w3_u: { value: 22, min: 0, max: 100, step: 1 }, w3_r: { value: 22, min: 0, max: 100, step: 1 },
  w3_e: { value: 16, min: 0, max: 100, step: 1 }, w3_l: { value: 10, min: 0, max: 100, step: 1 },
  w4_c: { value: 15, min: 0, max: 100, step: 1 }, w4_u: { value: 20, min: 0, max: 100, step: 1 }, w4_r: { value: 25, min: 0, max: 100, step: 1 },
  w4_e: { value: 22, min: 0, max: 100, step: 1 }, w4_l: { value: 18, min: 0, max: 100, step: 1 },
  new_species_bias: { value: 2, min: 1, max: 6, step: 0.5 },   // a species not yet logged is this much likelier
  junk_chance: { value: 0.4, min: 0, max: 1, step: 0.05 },     // sober, with the Commons logged
  junk_texts: { value: 3, min: 1, max: 10, step: 1 },          // junk catches before The Guy texts

  // ---- Money (dollars) ----
  start_cash: { value: 0, min: 0, max: 500, step: 5 },
  price_c: { value: 5, min: 1, max: 100, step: 1 },            // a mid-weight fish; weight moves it +-30%
  price_u: { value: 14, min: 1, max: 200, step: 1 },
  price_r: { value: 34, min: 1, max: 400, step: 1 },
  price_e: { value: 90, min: 1, max: 800, step: 5 },
  price_l: { value: 240, min: 1, max: 2000, step: 10 },
  price_junk: { value: 0.25, min: 0, max: 5, step: 0.05 },
  quick_sell: { value: 0.6, min: 0.1, max: 1, step: 0.05 },    // Jimmy's instant price, share of full
  fire_bonus: { value: 1.5, min: 1, max: 4, step: 0.1 },       // sale value under Straight Fire
  gram_reggie: { value: 8, min: 1, max: 100, step: 1 },        // dollars per gram
  gram_homegrown: { value: 22, min: 1, max: 200, step: 1 },
  gram_topshelf: { value: 55, min: 1, max: 400, step: 5 },
  gram_fire: { value: 140, min: 1, max: 1000, step: 10 },
  map_picture: { value: 200, min: 0, max: 2000, step: 25 },    // the next pond's picture on the Map

  // ---- Cast and tangle ----
  cast_charge: { value: 1.3, min: 0.3, max: 4, step: 0.1 },    // seconds to full power
  cast_min: { value: 5, min: 1, max: 20, step: 1 },            // metres
  cast_max: { value: 30, min: 8, max: 60, step: 1 },           // metres
  cast_flight: { value: 0.7, min: 0.2, max: 2, step: 0.05 },   // seconds in the air
  tangle_presses: { value: 9, min: 2, max: 30, step: 1 },      // Space presses to get free
  tangle_decay: { value: 2, min: 0, max: 8, step: 0.25 },      // progress lost per second

  // ---- Paddling ----
  paddle_accel: { value: 5, min: 1, max: 20, step: 0.5 },      // metres per second squared
  paddle_max: { value: 4.5, min: 1, max: 12, step: 0.25 },     // metres per second
  paddle_drag: { value: 1.1, min: 0.1, max: 5, step: 0.1 },    // per second
  turn_rate: { value: 1.7, min: 0.3, max: 5, step: 0.1 },      // radians per second, keys
  mouse_sens: { value: 0.0024, min: 0.0005, max: 0.01, step: 0.0001 },

  // ---- Day and shade ----
  day_seconds: { value: 240, min: 30, max: 1200, step: 10 },   // sunrise to sunset
  night_seconds: { value: 70, min: 10, max: 600, step: 10 },
  sun_max_deg: { value: 58, min: 20, max: 85, step: 1 },       // the sun's height at noon
  shadow_max: { value: 38, min: 5, max: 80, step: 1 },         // longest tree shadow, metres

  // ---- Look ----
  ps1_snap: { value: 1, min: 0, max: 1, step: 1 },             // vertex wobble on or off
  dither: { value: 1, min: 0, max: 1, step: 1 },               // ordered dithering on or off
  crt: { value: 0, min: 0, max: 1, step: 1 },                  // scanlines on or off

  // ---- Debug ----
  debug_lost_legend: { value: 0, min: 0, max: 1, step: 1 },    // 1: the Silver Trout and Silver Smoke are reachable here
};
