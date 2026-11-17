// Wavebound flavor text: every screen string, in one place.
// Edit via flavor_editor.html, which exports flavor_overrides.js (loaded before this file
// and merged over these defaults). Tokens in {braces} are substituted by the game.
(function () {
  "use strict";

  const DEFAULTS = {
    title: {
      name: "WAVEBOUND",
      subtitle: "Princess of the Sundered Sea",
      lore: [
        "The Sundering tore the ocean from the shore, and your little kingdom crumbled between them.",
        "Sea and land have claimed you both - so you claim them back.",
        "Break the crowns of the King of Crabs and the Serpent,",
        "and bind this kingdom whole again.",
      ],
      ctrl: [
        "ARROWS / WASD move    SPACE jump (hold to glide)    HOLD C run / dash",
        "X smack / bolt    E switch SEA / LAND form    ENTER talk / advance",
        "GAMEPAD: STICK / D-PAD   A jump   B smack   Y / RB form   LB / RT dash   START pause / talk",
      ],
      optContinue: "CONTINUE",
      optNew: "NEW GAME",
      optSong: "SONG",
      confirmAsk: "Start a NEW voyage?",
      confirmWarn: "This erases all progress, abilities and Otter Tickets.",
      confirmKeys: "ENTER to confirm      TAB / E to cancel",
      hint: "ENTER to choose    UP / DOWN to move    LEFT / RIGHT on SONG to pick",
      foot: "TAB - voyages    L - test-select any voyage",
    },
    voyages: {
      heading: "VOYAGES",
      hint: "Up / Down choose    ENTER sail    TAB back",
      test: "TEST MODE — all voyages unlocked",
      tix: "Tix {tix}",
      cleared: "CLEARED",
      boss: "BOSS",
    },
    world: {
      goal: "GOAL",
      battleAhead: "BATTLE AHEAD",
      needKey: "NEED {color} KEY",
      talk: "ENTER / START to talk",
      keys: "KEYS",
      stones: "STONES",
      tix: "TIX",
      air: "AIR",
      levelIntro: "E switch form     HOLD C run / dash     X smack",
    },
    dialog: {
      speak: "ENTER / START  to speak",
      buy: "ENTER / START buy    E exit",
      next: "ENTER / START / X  next",
      tix: "Tix: {tix}",
    },
    toasts: {
      feather: "GULL FEATHER! HOLD JUMP TO GLIDE",
      key: "{color} KEY!",
      stoneWhite: "FOUND: WHITE OTTER STONE",
      stoneBlack: "FOUND: BLACK OTTER STONE",
      tickets: "+{n} OTTER TICKETS!",
      gate: "GATE OPEN!",
      saved: "GAME SAVED",
      muted: "AUDIO MUTED",
      unmuted: "AUDIO ON",
      notEnoughTix: "NOT ENOUGH TIX (or already max)",
      padOn: "CONTROLLER READY",
      padOff: "CONTROLLER DISCONNECTED",
      leapHint: "DOUBLE-JUMP mid-air (SPACE) while on land",
    },
    banners: {
      boss: "BATTLE! {boss}",
      leap: "LEARNED: DOLPHIN LEAP!",
      bolt: "LEARNED: TIDE BOLT!",
      boltHint: "PRESS X IN SEA FORM TO FIRE A BOLT",
    },
    death: {
      line: "The tide carries you back to the shore…",
    },
    congrats: {
      heading: "CONGRATULATIONS!",
      none: "NOT A CRAB STIRRED",
      cont: "PRESS A TO CONTINUE",
      en: {
        crab: "CRABS SMASHED", crabj: "BURROW CRABS", star: "STARFISH POPPED",
        jelly: "JELLYFISH ZAPPED", eel: "EELS BONKED", boss: "BOSS DEFEATED",
      },
      it: {
        ticket: "TIX COLLECTED", bubble: "AIR BUBBLES", conch: "CONCHS FOUND",
        feather: "GULL FEATHERS", starprize: "STAR PRIZES", key: "KEYS FOUND",
        stone_white: "WHITE OTTER STONE", stone_black: "BLACK OTTER STONE",
      },
    },
    final: {
      heading: "VOYAGE COMPLETE",
      tagline: "Every shore reached, every pearl returned.",
      stats: "Final Score: {score}   Tix: {tix}   Hearts: {hearts}",
      thanks: "Thanks for playing WAVEBOUND",
      cont: "Press ENTER to return to the title",
    },
    shop: {
      items: [
        { name: "HEALING CONCH" },
        { name: "MAX HEART" },
        { name: "STAR SHARD" },
      ],
    },
    story: {
      pipStones: [
        "Whoa! Both otter stones — white AND black!",
        "The tide's power is yours now. Press X in sea form to fire a BOLT!",
      ],
    },
    npcs: {}, // "Level Name:Npc Name" -> { name, lines } — defaults live in levels.js
  };

  const clone = (o) => JSON.parse(JSON.stringify(o));

  function deepMerge(dst, src) {
    for (const k of Object.keys(src)) {
      const v = src[k];
      if (v && typeof v === "object" && !Array.isArray(v) && dst[k] && typeof dst[k] === "object" && !Array.isArray(dst[k])) deepMerge(dst[k], v);
      else dst[k] = v;
    }
    return dst;
  }

  window.WAVEBOUND_FLAVOR_DEFAULTS = clone(DEFAULTS);
  const merged = clone(DEFAULTS);
  try { deepMerge(merged, window.WAVEBOUND_FLAVOR_OVERRIDES || {}); } catch (e) {}
  window.WAVEBOUND_FLAVOR = merged;
})();
