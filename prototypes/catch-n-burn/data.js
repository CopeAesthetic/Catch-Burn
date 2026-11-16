// PROTOTYPE - NOT FOR PRODUCTION
// Question: Is cast, bite, needle, smoke fun on its own, and does Chill vs Munchies make smoking a decision?
// Date: 2026-11-15
// Content for Lil' Puffin' Pond, copied from design/catch-n-burn/content-areas-fish-strains.md.
// rarity: 0 Common, 1 Uncommon, 2 Rare, 3 Epic, 4 Legendary, 5 Lost Legend. Weights in pounds.
// art: how the 2D figure is drawn (see drawFish in index.html).
window.DATA = {
  rarities: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Lost Legend'],
  rarityColors: ['#f2f2f2', '#55d66b', '#4aa8ff', '#b77bff', '#ffc93c', '#ff7ad9'],
  fish: [
    { id: 'pumpkinseed', name: 'Pumpkinseed', short: 'Pumpkinseed', rarity: 0, wmin: 0.2, wmax: 0.9,
      art: { L: 0.78, H: 0.46, back: '#4f7d5c', belly: '#f0a23a', tail: 'notch', dorsal: 'spiny', pat: 'spots', extra: 'earflap', fin: '#d9892a' } },
    { id: 'yellow-perch', name: 'Yellow Perch', short: 'Yellow Perch', rarity: 0, wmin: 0.3, wmax: 1.4,
      art: { L: 0.95, H: 0.3, back: '#7a8a2e', belly: '#f4d94a', tail: 'fork', dorsal: 'split', pat: 'bars', extra: '', fin: '#e8742c' } },
    { id: 'brown-bullhead', name: 'Brown Bullhead', short: 'Brown Bullhead', rarity: 0, wmin: 0.5, wmax: 2.2,
      art: { L: 0.92, H: 0.3, back: '#5a4226', belly: '#d9c391', tail: 'round', dorsal: 'soft', pat: 'plain', extra: 'barbels', fin: '#4a361f', head: 'blunt' } },
    { id: 'chain-pickerel', name: 'Chain Pickerel', short: 'Chain Pickerel', rarity: 1, wmin: 1, wmax: 4.5,
      art: { L: 1.25, H: 0.17, back: '#4d6b2c', belly: '#e9e2a8', tail: 'fork', dorsal: 'rear', pat: 'chain', extra: '', fin: '#6b7a34', head: 'duck' } },
    { id: 'black-crappie', name: 'Black Crappie', short: 'Black Crappie', rarity: 1, wmin: 0.4, wmax: 2.3,
      art: { L: 0.86, H: 0.44, back: '#39443f', belly: '#dfe6dc', tail: 'notch', dorsal: 'sail', pat: 'speck', extra: '', fin: '#2b332f' } },
    { id: 'smallmouth-bass', name: 'Smallmouth Bass', short: 'Smallmouth Bass', rarity: 2, wmin: 1.2, wmax: 5.5,
      art: { L: 1.08, H: 0.3, back: '#6e5a2a', belly: '#d8c58a', tail: 'notch', dorsal: 'split', pat: 'bars', extra: 'redeye', fin: '#5a4a22' } },
    { id: 'largemouth-bass', name: 'Largemouth Bass', short: 'Largemouth Bass', rarity: 2, wmin: 1.5, wmax: 8,
      art: { L: 1.15, H: 0.33, back: '#3f6a3a', belly: '#eef0d8', tail: 'notch', dorsal: 'split', pat: 'stripe', extra: '', fin: '#35582f', head: 'bigmouth' } },
    { id: 'brook-trout', name: 'Brook Trout', short: 'Brook Trout', rarity: 3, wmin: 0.8, wmax: 4,
      art: { L: 1.05, H: 0.25, back: '#3d5a3a', belly: '#f08a3c', tail: 'square', dorsal: 'soft', pat: 'worm', extra: 'adipose', fin: '#e2552e', edge: '#ffffff' } },
    { id: 'landlocked-salmon', name: 'Landlocked Atlantic Salmon', short: 'Landlocked Salmon', rarity: 4, wmin: 3, wmax: 12,
      art: { L: 1.35, H: 0.23, back: '#4a5f73', belly: '#e9eef2', tail: 'fork', dorsal: 'soft', pat: 'xmarks', extra: 'adipose', fin: '#56687a', head: 'kype' } },
    { id: 'silver-trout', name: 'Silver Trout', short: 'Silver Trout', rarity: 5, wmin: 0.6, wmax: 1.6,
      art: { L: 0.98, H: 0.2, back: '#9fb2bd', belly: '#f7fbff', tail: 'fork', dorsal: 'soft', pat: 'plain', extra: 'adipose', fin: '#c9d6de', shine: true },
      note: 'Extinct; last known from Dublin Pond, NH (1930s). Photographed and released.' },
  ],
  junk: [
    { id: 'old-boot', name: 'Old Boot' },
    { id: 'beer-can', name: 'Beer Can' },
    { id: 'tire', name: 'Tire' },
    { id: 'pizza-box', name: 'Soggy Pizza Box' },
    { id: 'lighter', name: 'Lost Lighter' },
  ],
  // tier: 1 Reggie, 2 Home Grown, 3 Top Shelf, 4 Straight Fire
  strains: [
    { id: 'bluegill-dream', name: 'Bluegill Dream', tier: 1, tierName: 'Reggie', need: 'log all 3 Commons' },
    { id: 'devil-driftwood', name: 'Devil Driftwood', tier: 2, tierName: 'Home Grown', need: 'log both Uncommons' },
    { id: 'trout-runtz', name: 'Trout Runtz', tier: 3, tierName: 'Top Shelf', need: 'log both Rares' },
    { id: 'silver-smoke', name: 'Silver Smoke', tier: 4, tierName: 'Straight Fire', need: 'land the Lost Legend' },
  ],
  // munchies: how much Munchies it lowers. hunger: how much Hunger it gives back.
  food: [
    { id: 'cheese-puffs', name: 'Gas-Station Cheese Puffs', munchies: 'small', hunger: 'small' },
    { id: 'gummy-worms', name: 'Gummy Worms', munchies: 'med', hunger: 'small' },
    { id: 'frozen-burrito', name: 'Frozen Burrito', munchies: 'med', hunger: 'large' },
  ],
  fridgeDaily: ['cheese-puffs', 'gummy-worms', 'frozen-burrito'],
  ponds: [
    { name: "Lil' Puffin' Pond", note: 'Home pond' },
    { name: 'Lake Winnipe-SMOKE-ee', note: 'Lake Winnipesaukee, NH' },
    { name: 'The Connecti-KUSH River', note: 'Connecticut River' },
    { name: 'Lake Champ-BLAZE', note: 'Lake Champlain' },
  ],
  banners: [
    "THAT'S A KEEPER, FOLKS!", 'OH, HE WORKED FOR THAT ONE!', 'TEXTBOOK HOOK-SET!',
    'YOU LOVE TO SEE IT ON THE POND!', 'WHAT A SPECIMEN!', 'THE CROWD ON THE BANK GOES MILD!',
  ],
  junkBanners: ['WELL... IT IS A CATCH.', 'THE JUDGES ARE CONFERRING.', 'SOMEBODY LOST THAT.'],
  tips: [
    'Shade bites faster. Follow the shadows as the sun moves.',
    'A fish in The Drop Box pays full price overnight. Jimmy on the phone pays less, right now.',
    'Stop the lure on blue for three pulls. Green is one.',
    'Eat before the Munchies max out, or you sit and watch the water.',
    'Every hit makes you hungrier. Pack the snacks from the fridge.',
    'Higher on the meter means better odds at the rare ones.',
    "Patience, nephew. The pond don't own a watch.",
    'At 100% take one more hit of Top Shelf. You will see.',
  ],
};
