# Game Brief: Catch n' Burn — Lil' Puffin' Pond sketch

<!-- PROTOTYPE - NOT FOR PRODUCTION -->
<!-- Question: Is cast, bite, needle, smoke fun on its own, and does Chill vs Munchies make smoking a decision? -->
<!-- Date: 2026-11-15 -->
<!-- This is the browser sketch's own brief. The full game's brief is design/game-brief.md. -->

## In your words
"catch fish → sell fish → buy weed → smoke weed → unlock rarer fish → unlock better weed → repeat"
"Use `/prototype` to sketch the cast → bite → needle → smoke loop first so we can tune the feel before building the 3D slice in Godot."
1. View: "3D."
2. Casting: "move around"
3. Money: "quick menu is available but less convenient and rewarding than The Drop Box."
4. End: "Fish as long as you like but once you catch the legendary you can buy the pictures on the map to the next pond in that area"
5. Difficulty: "yeah i like that" (Commons easy, the Legendary takes a few tries)

**Pitch:** Paddle a kayak around a misty Maine pond, hook fish with a needle mini-game, and get higher to hook rarer ones.

**Genre:** first-person fishing

**Controls:** WASD paddle · mouse look · hold Space to charge a cast, Space to set the hook and stop the needle · F smoke · E interact · Tab flip phone

**Question:** Is cast → bite → needle → smoke fun on its own, and does Chill vs Munchies make smoking a decision? *(guessed)*

**Hooks:** getting high opens the next rarity; the BioShock 2-style needle; shade that moves with the sun.

**Intent:** no goal to reach *(you said)* · soft or no failure *(you said)*

## Look and references
- Look: PS1-style low-poly 3D at a low internal resolution scaled up with hard pixels, vertex wobble, ordered dithering and distance fog. Pine-green bank, blue-grey misty water, warm amber sun tint that shifts through the day; chunky early-2000s HUD. Signature detail: tree shadows sliding across the water as the sun moves. Every figure drawn, no emoji, no plain circles.
- References: Rapala Pro Bass Fishing (the "TV broadcast" catch banner), BioShock 2 (the needle gauge).
- View: 3D · Camera: first person from the kayak seat.

## First minute
You start in the kayak at the dock at sunrise. Paddle toward a patch of shade under the pines, hold Space, and cast. A cast on open water bites in about 5 s; in shade, about 2 s. "FISH ON" flashes red; hit Space inside 1.5 s, then stop the needle on green three times as the text turns green. Rainbow flash, broadcast banner: your first Pumpkinseed.

## Challenge
Commons are easy. The first real trouble comes around minutes 3–5: your first Reggie opens the Uncommons, whose needle is faster with smaller zones, and each hit pushes Hunger toward Munchies, which locks fishing and smoking until you eat. The Legendary takes a few tries. A loss costs the fish and the weed you burned to reach it. *(guessed: all needle numbers per rarity)*

## Core loop
- Paddle to shade → cast → hook-set → needle → fish in the boat.
- Drop the catch in The Drop Box and sleep for full price, or Quick Sell on the phone for less, right now.
- Buy strains from The Guy; they arrive overnight. Smoke on the water to open the next rarity.
- Log all of a rarity → the next strain tier unlocks → repeat up to the Legendary.

## Goal & fail state
- No end: fish as long as you like. Landing the Landlocked Atlantic Salmon lets you buy the picture of the next pond on the Map.
- A missed hook-set or a needle total below 0 loses the fish; a cast onto the bank tangles; maxed Munchies stops you until you eat.

## Features
- [x] Paddle a small 3D pond with a dock
- [x] Sun crosses the sky; pines cast shade; shade bites faster
- [x] Power cast, and a mash-to-free tangle on the bank
- [x] FISH ON, 1.5 s hook-set, needle reel-in, red-to-green text, rainbow flash, broadcast banner
- [x] The pond's 10 fish gated by strain tier, plus junk and the "go smoke somethin'" text
- [x] F to smoke: Chill Meter states, vibrance, YAK LOCKED and its bonus cast
- [x] Hunger → Munchies, and snacks to eat
- [x] Debug toggle for the Silver Trout and Silver Smoke; every tuning value in `config.js`

## Your systems
- cast & tangle · in the slice
- bite timing · in the slice
- needle reel-in · in the slice
- paddling · in the slice
- day/night & shade sweet spots · in the slice
- smoking & Chill Meter · in the slice
- Hunger → Munchies · in the slice
- strain unlock chain · in the slice
- The Drop Box & sleeping · thin stand-in
- Flip Phone (The Guy, Jimmy's Quick Sell, Unc's log) · thin stand-in
- shack Map & pond pictures · thin stand-in
- fish and strain prices · thin stand-in *(guessed)*
- beer & Drunk meter · later *(guessed)*
- Jane's shop & gear · later *(guessed)*
- shack interior, main menu, intro, save/load · later *(guessed)*
- multiplayer · later

## Keep
-

## Avoid
- Repetitive waiting, unresponsive controls, too-easy fights, long loads.
- Real brands, real people, mean comedy.

## Out of scope
- Many waters on a map, each with its own fish: grow it
- A boat to upgrade: add it as a feature
- Weather and seasons that change what bites: add it as a feature
- Multiplayer: needs a server, not built here
- beer & Drunk meter, Jane's shop & gear, the shack interior, main menu, intro and save/load: later

## Build order
1. The slice: one endless session on Lil' Puffin' Pond, from first Pumpkinseed to the Legendary and the Pond 2 picture.

---
**Kill condition:** if the loop isn't fun for 15 minutes on one pond after two tuning passes, redesign the needle and the Chill / Munchies balance before any Godot work. *(provisional)*

**Who it's for / what they feel:** friend groups who play friendslop and anyone fond of 2000s budget fishing games; chill, a bit silly, hooked on filling the log. *(guessed)*

**Games you love / don't:** Love Rapala Pro Bass Fishing, Bass Pro Shops: The Strike, Lethal Company, R.E.P.O., PEAK, the BioShock 2 hacking needle. Don't love the waiting, the tension bar and the load times in those fishing games.
