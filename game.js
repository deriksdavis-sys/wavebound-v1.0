(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const W = 960;
  const H = 540;
  const TILE = 30;
  const ROWS = 36;

  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR, DPR);

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const TAU = Math.PI * 2;

  // ---- flavor text lookups (see flavor.js / flavor_editor.html)
  function FT(path, vars) {
    let v = String(path).split(".").reduce((x, k) => (x == null ? undefined : x[k]), globalThis.WAVEBOUND_FLAVOR);
    if (typeof v !== "string") v = "¿" + path;
    if (vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return v;
  }
  function wrapFit(str, font, maxW) {
    ctx.font = font;
    const words = String(str).split(" ");
    const lines = [];
    let cur = "";
    for (const word of words) {
      const test = cur ? cur + " " + word : word;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = word; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }
  function FL(path) {
    const v = String(path).split(".").reduce((x, k) => (x == null ? undefined : x[k]), globalThis.WAVEBOUND_FLAVOR);
    return Array.isArray(v) ? v : [];
  }

  const SPRITE_SETS = {
    otter: { dir: "assets/sprites/npcs/otter", idle: 4, run: 3 },
  };
  let spriteSheets = {};
  function loadSheets(kind) {
    if (spriteSheets[kind]) return spriteSheets[kind];
    const conf = SPRITE_SETS[kind];
    const sheets = { idle: [], run: [] };
    if (typeof Image === "undefined") return sheets;
    for (const anim of ["idle", "run"]) {
      for (let k = 1; k <= conf[anim]; k++) {
        const im = new Image();
        im.src = conf.dir + "/" + anim + "_" + k + ".png";
        sheets[anim].push(im);
      }
    }
    spriteSheets[kind] = sheets;
    return sheets;
  }
  function getSprite(kind, set, i) {
    const sheets = loadSheets(kind);
    const arr = sheets[set] && sheets[set].length ? sheets[set] : sheets.idle;
    if (!arr.length) return null;
    const im = arr[((i % arr.length) + arr.length) % arr.length];
    if (im && im.complete && im.naturalWidth) return im;
    const first = arr[0];
    return first && first.complete && first.naturalWidth ? first : null;
  }

  const STATE = { TITLE: 0, SEL: 1, PLAY: 2, DYING: 3, WIN: 4, FINAL: 5, CONGRATS: 6 };
  let state = STATE.TITLE;
  let stateTimer = 0;
  let selIndex = 0;
  let selShow = false;
  let selTest = false;
  let titleChoice = 0;
  let titleConfirm = false;
  let toast = "";
  let toastT = 0;
  let paused = false;
  function setPaused(on) {
    paused = on;
    const panel = document.getElementById("pause-panel");
    if (!panel) return;
    panel.classList.toggle("hidden", !on);
    if (on) {
      const s = WBAudio.settings;
      const vm = document.getElementById("vol-music"), vs = document.getElementById("vol-sfx");
      vm.value = Math.round(s.music * 100); vs.value = Math.round(s.sfx * 100);
      document.getElementById("vol-music-val").textContent = vm.value + "%";
      document.getElementById("vol-sfx-val").textContent = vs.value + "%";
    }
  }
  window.setPaused = setPaused;
  let debugShow = false;
  const dbgLog = [];
  function dbg(m, t) {
    dbgLog.push((t ? t.toFixed(1) : performance.now() / 1000).toFixed(1) + "s " + m);
    if (dbgLog.length > 9) dbgLog.shift();
  }
  let dbgGlideOn = false;
  let banner = "";
  let bannerT = 0;
  let levelIntroT = 0;
  let shakeT = 0;
  let camX = 0;
  let camY = 0;
  let bossActive = false;
  let bossDead = false;
  let dialog = null;
  let shopCursor = 0;

  const levels = window.WAVEBOUND_LEVELS;
  const R = window.WAVEBOUND_RENDER;
  const LCore = window.WAVEBOUND_LEVEL_CORE;
  const PAL = R.PAL;

  const SHOP_ITEMS = [
    { name: "HEALING CONCH", cost: 8, desc: "Restore all hearts", ok: () => save.maxHearts > player.hearts, fn: () => { player.hearts = save.maxHearts; } },
    { name: "MAX HEART", cost: 30, desc: "+1 heart forever", ok: () => save.maxHearts < 6, fn: () => { save.maxHearts = Math.min(6, save.maxHearts + 1); player.maxHearts = save.maxHearts; player.hearts = save.maxHearts; } },
    { name: "STAR SHARD", cost: 12, desc: "Invincible for a while", ok: () => true, fn: () => { player.starT = 7; } },
  ];

  const buyShopItem = (i) => {
    const item = SHOP_ITEMS[i];
    if (!item || player.tix < item.cost || !item.ok()) {
      toast = FT("toasts.notEnoughTix");
      toastT = 1.6;
      return false;
    }
    player.tix -= item.cost;
    item.fn();
    persist();
    sparkle(player.x + player.w / 2, player.y, "#ffe08a", 12, 120);
    return true;
  };

  const DEFAULT_SAVE = { v: 3, unlocked: 0, cleared: [], abilities: { jump: true, bolt: false }, maxHearts: 3, tix: 0, stones: { white: false, black: false }, chests: {} };

  function loadSave() {
    try {
      const raw = localStorage.getItem("wavebound_save_v1");
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE));
      const s = JSON.parse(raw);
      if (s.tix == null && s.pearls != null) s.tix = s.pearls; // v2 -> v3: pearls renamed to tix
      delete s.pearls;
      const merged = Object.assign(JSON.parse(JSON.stringify(DEFAULT_SAVE)), s);
      if (merged.abilities) merged.abilities.jump = true; // double jump ships unlocked; migrate old saves
      return merged;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_SAVE));
    }
  }
  function persist() { try { localStorage.setItem("wavebound_save_v1", JSON.stringify(save)); } catch (e) {} }

  function startNewGame() {
    Object.assign(save, JSON.parse(JSON.stringify(DEFAULT_SAVE)));
    persist();
    titleConfirm = false;
    titleChoice = 0;
    currentLevel = 0;
    loadLevel(0, true);
    state = STATE.PLAY;
  }

  let save = loadSave();

  // ---- per-level stats, shown on the Congratulations screen
  let levelStats = { enemies: {}, items: {} };
  const talkedOnce = new Set(); // session-only: "talk" sfx only during an NPC's first conversation
  let congratsTotalT = 999, congratsSfxKey = "", congratsPrevJump = false;
  function resetLevelStats() { levelStats = { enemies: {}, items: {} }; }
  function statKill(t) { levelStats.enemies[t] = (levelStats.enemies[t] || 0) + 1; }
  function statItem(t) { levelStats.items[t] = (levelStats.items[t] || 0) + 1; }
  // Ambient crab chatter: each active crab decides its own random clack schedule
  // (~every 2.2-6.7 s); only crabs near the player are heard. Timers keep running
  // off-screen so entering a cluster doesn't burst-click.
  function crabTick(e, dt) {
    e.clickCool = (e.clickCool || 0) - dt;
    if (e.clickCool > 0) return;
    e.clickCool = 2.2 + Math.random() * 4.5;
    const dx = e.x - player.x;
    if (Math.abs(dx) > 420) return;
    WBAudio.playSfx("crabclick", { vol: 0.8, pan: dx / 420, rate: 0.85 + Math.random() * 0.5 });
  }

  const keys = {
    left: false, right: false, up: false, down: false,
    jump: false, jumpHeld: false,
    run: false, tail: false,
    enter: false, enterPrev: false,
    switchPressed: false, switchPrev: false,
    testPressed: false, testPrev: false,
  };

  const padPrev = { enter: false, switch: false, cheat: false };
  let padEnterEdge = false;

  function grantAllPowerups() {
    save.maxHearts = 6;
    player.maxHearts = 6;
    player.hearts = 6;
    save.abilities.jump = true;
    save.abilities.bolt = true;
    save.tix = 999;
    player.tix = 999;
    player.starT = 7;
    player.feather = true;
    player.air = 100;
    persist();
    sparkle(player.x + player.w / 2, player.y + player.h / 2, "#ffe08a", 18, 150);
  }

  function syncInput() {
    const gps = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;
    for (const g of gps) if (g && g.connected) { gp = g; break; }

    let pLeft = false, pRight = false, pUp = false, pDown = false;
    let pJump = false, pRun = false, pTail = false, pEnter = false, pSwitch = false, pSelect = false;
    if (gp) {
      const btns = gp.buttons || [];
      const axes = gp.axes || [];
      const btn = (i) => !!(btns[i] && btns[i].pressed);
      const DEAD = 0.25;
      // movement: left stick, Xbox D-pad buttons, and the dinput hat axes some
      // 8BitDo/DInput pads use instead of buttons 12-15
      // 6/7 hat pair (typical dinput, e.g. 8BitDo Ultimate on 2.4G): only trust
      // it on pads exposing >=8 axes, and only at near-full deflection, so an
      // analog trigger axis resting at -1 can never fake a held D-pad.
      const hat67 = axes.length >= 8;
      pLeft = btn(14) || axes[0] < -DEAD || axes[11] > 0.5 || (hat67 && axes[6] < -0.9);
      pRight = btn(15) || axes[0] > DEAD || axes[12] > 0.5 || (hat67 && axes[6] > 0.9);
      pUp = btn(12) || axes[1] < -DEAD || axes[9] > 0.5 || (hat67 && axes[7] < -0.9);
      pDown = btn(13) || axes[1] > DEAD || axes[10] > 0.5 || (hat67 && axes[7] > 0.9);
      pJump = btn(0);
      pRun = btn(4) || btn(7) || (axes.length > 5 && axes[5] > 0.6) || (axes.length === 4 && axes[2] > 0.6); // LB / RT (or dinput combined axis)
      pTail = btn(1);
      pEnter = btn(9);
      pSelect = btn(8);
      pSwitch = btn(3) || btn(5); // Y / RB
    }
    padEnterEdge = !!(gp && pEnter && !padPrev.enter);

    const cheatCombo = pEnter && pSelect && !padPrev.cheat;
    if (cheatCombo) { pEnter = false; pSwitch = false; grantAllPowerups(); }
    padPrev.cheat = pEnter && pSelect;

    input.left = keys.left || pLeft;
    input.right = keys.right || pRight;
    input.up = keys.up || pUp;
    input.down = keys.down || pDown;
    input.jump = keys.jump || pJump;
    input.jumpHeld = keys.jumpHeld || pJump;
    input.run = keys.run || pRun;
    input.tail = keys.tail || pTail;

    input.enter = (keys.enter && !keys.enterPrev) || padEnterEdge;
    input.padEnter = padEnterEdge;
    input.switchReq = (keys.switchPressed && !keys.switchPrev) || (pSwitch && !padPrev.switch);
    input.testReq = keys.testPressed && !keys.testPrev;

    keys.enterPrev = keys.enter;
    keys.switchPrev = keys.switchPressed;
    keys.testPrev = keys.testPressed;
    padPrev.enter = pEnter;
    padPrev.switch = pSwitch;
  }

  const input = {
    left: false, right: false, up: false, down: false,
    jump: false, jumpHeld: false,
    run: false, runWas: false,
    tail: false, tailWas: false,
    switchReq: false,
    testReq: false,
    padEnter: false,
    upPrev: false, downPrev: false,
    leftPrev: false, rightPrev: false,
    enter: false, prevEnter: false,
  };

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  window.addEventListener("keydown", (e) => {
    const k = e.key;
    if ((k === "F" || k === "f") && !e.repeat) { toggleFullscreen(); e.preventDefault(); return; }
    const game = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ","C","c","Enter","Tab","E","e","Q","q","X","x","J","j","K","k","P","p","L","l","M","m","O","o","Escape"].includes(k);
    switch (k) {
      case "ArrowLeft": case "a": case "A": keys.left = true; break;
      case "ArrowRight": case "d": case "D": keys.right = true; break;
      case "ArrowUp": case "w": case "W": keys.up = true; break;
      case "ArrowDown": case "s": case "S": keys.down = true; break;
      case " ": keys.jump = true; keys.jumpHeld = true; if (!e.repeat) dbg("SPACE down"); break;
      case "C": case "c": keys.run = true; break;
      case "X": case "x": case "J": case "j": case "K": case "k": keys.tail = true; break;
      case "E": case "e": case "Q": case "q": case "Tab": keys.switchPressed = true; break;
      case "Enter": keys.enter = true; break;
      case "L": case "l": keys.testPressed = true; break;
      case "M": case "m":
        if (!e.repeat) { const mut = WBAudio.toggleMute(); toast = mut ? FT("toasts.muted") : FT("toasts.unmuted"); toastT = 1.5; }
        break;
      case "O": case "o":
        if (!e.repeat) setPaused(!paused);
        break;
      case "Escape":
        if (!e.repeat) { if (dialog) dialog = null; else if (state === STATE.PLAY) setPaused(!paused); }
        break;
      case "P": case "p": if (!e.repeat) debugShow = !debugShow; break;
    }
    if (game) e.preventDefault();
  });
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "ArrowLeft": case "a": case "A": keys.left = false; break;
      case "ArrowRight": case "d": case "D": keys.right = false; break;
      case "ArrowUp": case "w": case "W": keys.up = false; break;
      case "ArrowDown": case "s": case "S": keys.down = false; break;
      case " ": keys.jump = false; keys.jumpHeld = false; dbg("SPACE up"); break;
      case "C": case "c": keys.run = false; break;
      case "X": case "x": case "J": case "j": case "K": case "k": keys.tail = false; break;
      case "E": case "e": case "Q": case "q": case "Tab": keys.switchPressed = false; break;
      case "Enter": keys.enter = false; break;
      case "L": case "l": keys.testPressed = false; break;
    }
  });

  window.addEventListener("gamepadconnected", () => {
    toast = FT("toasts.padOn"); toastT = 2;
  });
  window.addEventListener("gamepaddisconnected", () => {
    toast = FT("toasts.padOff"); toastT = 2;
  });

  window.addEventListener("blur", () => {
    Object.assign(keys, { left: false, right: false, up: false, down: false, jump: false, jumpHeld: false, run: false, tail: false, enter: false, switchPressed: false, testPressed: false });
    Object.assign(input, { left: false, right: false, up: false, down: false, jump: false, jumpHeld: false, run: false, tail: false, switchReq: false, enter: false, prevEnter: false });
  });

  let L = null;

  const player = {
    x: 0, y: 0, w: 24, h: 36,
    vx: 0, vy: 0, facing: 1, form: "sea",
    onGround: false, inWater: false,
    air: 100, hearts: save.maxHearts, maxHearts: save.maxHearts,
    invuln: 0, switchT: 0, coyote: 0, airJumps: 0,
    tailT: 0, tailCd: 0, dashT: 0, dashCd: 0, starT: 0,
    feather: false, glide: false, glideT: 0, skid: false,
    climbing: false, climbCol: -1, climbSide: 1,
    score: 0, tix: save.tix, animT: 0, swimT: 0,
    keys: [],
  };

  const particles = [];
  const sparks = [];
  const bolts = [];
  const shockwaves = [];

  const sparkle = (x, y, color, n = 6, sp = 60) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU;
      const s = sp * (0.4 + Math.random() * 0.8);
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, life: 0.6 + Math.random() * 0.5, max: 1, color, r: 2 + Math.random() * 2 });
    }
  };
  const bubbleEmit = (x, y, n = 1) => {
    for (let i = 0; i < n; i++)
      particles.push({ x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 8, vx: (Math.random() - 0.5) * 12, vy: -22 - Math.random() * 22, life: 1.4 + Math.random() * 1.2, max: 2.6, color: "#bfe8ff", r: 1.5 + Math.random() * 3, rise: true });
  };

  function buildLevel(idx) {
    return LCore.build(levels[idx]);
  }

  function loadLevel(idx, fresh, keepFeather) {
    currentLevel = idx;
    L = buildLevel(idx);
    applyPersistedState();
    camX = 0;
    camY = 0;
    stateTimer = 0;
    levelIntroT = 3;
    lvlIntroText = levels[idx].name;
    bossActive = false;
    bossDead = false;
    dialog = null;
    input.switchReq = false;
    player.x = levels[idx].spawn.x; player.y = levels[idx].spawn.y;
    player.vx = 0; player.vy = 0; player.facing = 1;
    player.form = "sea";
    player.airJumps = 0; player.switchT = 0; player.invuln = 0;
    player.tailT = 0; player.tailCd = 0; player.dashT = 0; player.dashCd = 0;
    player.coyote = 0; player.animT = 0; player.swimT = 0;
    if (!keepFeather) player.feather = false;
    player.glide = false; player.glideT = 0;
    player.keys = [];
    player.maxHearts = fresh ? save.maxHearts : player.maxHearts;
    if (fresh) { player.hearts = save.maxHearts; player.tix = save.tix; }
    player.air = 100;
    resetLevelStats();
    WBAudio.playLevelMusic(idx);
  }

  function applyPersistedState() {
    const saved = save.chests[currentLevel];
    if (saved) {
      for (const c of L.chests) {
        if (saved.includes(c.c + ":" + c.r)) c.open = true;
      }
    }
    for (const pk of L.pickups) {
      if (pk.t === "stone_white" && save.stones.white) pk.got = true;
      if (pk.t === "stone_black" && save.stones.black) pk.got = true;
    }
  }

  let lvlIntroText = "";

  // save stations: def.saves = [{ x, r, mix }] (new) or legacy saveX/saveY
  function stationsOf(def) {
    if (Array.isArray(def.saves) && def.saves.length) return def.saves;
    const xs = Array.isArray(def.saveX) ? def.saveX : (def.saveX != null ? [def.saveX] : []);
    const sy = def.saveY != null ? def.saveY : (def.goalY != null ? def.goalY : 13);
    return xs.map((x) => ({ x: x, r: sy, mix: null }));
  }
  function stationAt(p) {
    const def = L ? L.def : null;
    if (!def) return null;
    const defSy = def.saveY != null ? def.saveY : (def.goalY != null ? def.goalY : 13);
    for (const st of stationsOf(def)) {
      const sy = st.r != null ? st.r : defSy;
      if (Math.abs(p.x + p.w / 2 - st.x + 14) < 30 && Math.abs(p.y + p.h / 2 - sy * TILE) < 80) return st;
    }
    return null;
  }

  function resetLevel() {
    const idx = currentLevel;
    L = buildLevel(idx);
    applyPersistedState();
    resetLevelStats();
    camX = 0;
    camY = 0;
    stateTimer = 0;
    bossActive = false;
    bossDead = false;
    dialog = null;
    input.switchReq = false;
    player.x = levels[idx].spawn.x; player.y = levels[idx].spawn.y;
    player.vx = 0; player.vy = 0;
    player.form = "sea";
    player.airJumps = 0; player.switchT = 0; player.invuln = 0;
    player.tailT = 0; player.tailCd = 0; player.dashT = 0; player.dashCd = 0;
    player.coyote = 0; player.animT = 0; player.swimT = 0;
    player.glide = false; player.glideT = 0;
    player.keys = [];
    player.hearts = save.maxHearts;
    player.air = 100;
  }

  let currentLevel = 0;

  function tileAt(px, py) {
    const c = Math.floor(px / TILE), r = Math.floor(py / TILE);
    const out = c < 0 || c >= L.COLS;
    return {
      c, r,
      s: out ? 1 : L.solid[r] && L.solid[r][c],
      p: !out && L.plat[r] && L.plat[r][c],
      w: !out && r >= 0 && r < ROWS && L.wat[r] && L.wat[r][c] ? 1 : 0,
    };
  }

  function collideX(o, allowClimb) {
    const top = Math.floor(o.y / TILE);
    const bot = Math.floor((o.y + o.h - 1) / TILE);
    const side = o.vx > 0 ? Math.floor((o.x + o.w) / TILE) : Math.floor(o.x / TILE);
    if (side < 0 || side >= L.COLS) return false;
    for (let r = Math.max(0, top); r <= Math.min(ROWS - 1, bot); r++) {
      if (L.solid[r][side]) {
        if (allowClimb && tryClimb(o, side)) return false;
        o.x = o.vx > 0 ? side * TILE - o.w - 0.01 : (side + 1) * TILE + 0.01;
        return true;
      }
    }
    return false;
  }

  function tryClimb(o, side) {
    if (!input.up && !input.jumpHeld) return false;
    let tr = Math.floor((o.y + o.h * 0.6) / TILE);
    if (tr < 0 || !L.solid[tr][side]) return false;
    while (tr > 0 && L.solid[tr - 1][side]) tr--;
    const topY = tr * TILE;
    if (topY >= o.y + o.h - TILE * 2 && topY <= o.y + o.h + 14) {
      o.y = topY - o.h;
      o.vy = -140;
      o.onGround = false;
      bubbleEmit(o.x + o.w / 2, o.y + o.h, 3);
      return true;
    }
    return false;
  }

  function collideY(o, dy) {
    const left = Math.floor(o.x / TILE);
    const right = Math.floor((o.x + o.w - 1) / TILE);
    if (dy >= 0) {
      const row = Math.floor((o.y + o.h) / TILE);
      const prevBottom = o.y - dy + o.h;
      if (row >= 0 && row < ROWS) {
        for (let c = left; c <= right; c++) {
          if (row >= 0 && c >= 0 && c < L.COLS && L.solid[row][c]) {
            o.y = row * TILE - o.h;
            o.vy = 0; o.onGround = true;
            return true;
          }
          if (row >= 0 && c >= 0 && c < L.COLS && L.plat[row][c] && !input.down && prevBottom <= row * TILE + 8) {
            o.y = row * TILE - o.h;
            o.vy = 0; o.onGround = true;
            return true;
          }
        }
      }
    } else {
      const row = Math.floor(o.y / TILE);
      if (row >= 0 && row < ROWS) {
        for (let c = left; c <= right; c++) {
          if (c >= 0 && c < L.COLS && L.solid[row][c]) {
            o.y = (row + 1) * TILE;
            o.vy = 0;
            return true;
          }
        }
      }
    }
    return false;
  }

  function hurtPlayer(dropFeather) {
    const p = player;
    if (p.invuln > 0 || p.starT > 0) return;
    p.hearts -= 1;
    WBAudio.playSfx("hit");
    p.invuln = 1.3;
    if (dropFeather !== false) {
      p.feather = false; p.glide = false; p.glideT = 0;
      for (const pk of L.pickups) if (pk.t === "feather") pk.got = false;
      dbg("HIT: feather dropped @c" + Math.floor(p.x / TILE));
    }
    p.vy = -360;
    p.vx = -p.facing * 220;
    shakeT = 0.3;
    sparkle(p.x + p.w / 2, p.y + 8, "#ff5a5a", 12, 140);
    if (p.hearts <= 0) { state = STATE.DYING; stateTimer = 0; WBAudio.playSfx("die"); }
  }

  function doSwitch() {
    const p = player;
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    const inW = tileAt(cx, cy).w === 1;
    p.form = p.form === "sea" ? "land" : "sea";
    p.switchT = 0.15;
    p.vx *= 0.5;
    p.vy = lerp(p.vy, 0, 0.3);
    sparkle(cx, p.y + 8, inW ? "#7fe3ff" : "#ffd7a0", 9, 70);
  }

  let tailSwing = 0;

  function startTail() {
    const p = player;
    if (p.tailCd > 0) return;
    tailSwing++;
    p.tailT = 0.2;
    p.tailCd = 0.34;
    p.vy = lerp(p.vy, 0, 0.4);
    if (p.form === "sea" && save.abilities.bolt) {
      bolts.push({ x: p.x + p.w / 2 + p.facing * 14, y: p.y + p.h / 2, vx: p.facing * 520, vy: 0, life: 0.9, max: 0.9 });
    }
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    shockwaves.push({ x: cx, y: cy, r: 14, maxR: 160, life: 0.45, max: 0.45 });
    smackHitEnemies();
  }

  function smackHitEnemies() {
    const p = player;
    const px = p.x + p.w / 2, py = p.y + p.h / 2;
    const R = 40;
    for (const c of L.chests) {
      if (c.open) continue;
      const cx = c.x, cy = c.y + 9;
      if (Math.hypot(cx - px, cy - py) < R + 18) openChest(c);
    }
    for (const e of L.enemies) {
      if (e.dead || e.hidden) continue;
      const ex = e.x + (e.w || TILE) / 2, ey = e.y + (e.h || TILE) / 2;
      const dx = ex - px, dy = ey - py;
      const dist = Math.hypot(dx, dy);
      if (dist > R + (e.w || TILE) / 2) continue;
      smackEnemy(e, dist > 1 ? (dx / dist) * 250 : p.facing * 250);
    }
    if (bossActive && !bossDead && boss) {
      const bb = bossHit();
      const bcx = bb.x + bb.w / 2, bcy = bb.y + bb.h / 2;
      if (Math.hypot(bcx - px, bcy - py) < R + bb.w / 2) hitBoss(1);
    }
  }

  function smackEnemy(e, kx) {
    if (e.dead) return;
    e.hp -= 1;
    e.stun = 0.35;
    e.flipT = 1.25;
    e.flipShakeT = 0;
    e.flipKx = kx;
    sparkle(e.x + (e.w || TILE) / 2, e.y + (e.h || TILE) / 2, "#bfe8ff", 8, 110);
    if (e.hp <= 0) { statKill(e.t); e.dead = true; e.deadT = 0; player.score += 200; WBAudio.playSfx("kill"); }
  }

  function startDash() {
    const p = player;
    if (p.dashCd > 0) return;
    let dx = 0, dy = 0;
    if (input.right) dx += 1;
    if (input.left) dx -= 1;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;
    if (dx === 0 && dy === 0) dx = p.facing;
    const n = Math.hypot(dx, dy) || 1;
    const inW = tileAt(p.x + p.w / 2, p.y + p.h / 2).w === 1;
    p.dashT = 0.26;
    p.dashCd = inW ? 0.74 : 0.44;
    p.dashDx = dx / n;
    p.dashDy = dy / n;
    p.facing = dx >= 0 ? 1 : -1;
    for (let i = 0; i < 1; i++) bubbleEmit(p.x + p.w / 2, p.y + p.h / 2, 1);
  }

  function handleClimb() {
    const p = player;
    if (!p.climbing) {
      const leftC = Math.floor(p.x / TILE), rightC = Math.floor((p.x + p.w - 1) / TILE);
      const cands = new Set();
      for (let c = leftC; c <= rightC; c++) cands.add(c);
      cands.add(p.facing > 0 ? rightC + 1 : leftC - 1);
      let C = -1;
      for (const c of cands) {
        if (c < 0 || c >= L.COLS) continue;
        const sideThere = (c * TILE + TILE / 2) > (p.x + p.w / 2) ? 1 : -1;
        if (sideThere !== p.facing) continue;
        for (let r = Math.floor(p.y / TILE); r <= Math.floor((p.y + p.h - 1) / TILE); r++) {
          if (r >= 0 && r < ROWS && L.climb[r][c]) { C = c; break; }
        }
        if (C >= 0) break;
      }
      if (C < 0 || !input.up) return false;
      p.climbing = true;
      p.climbCol = C;
      p.climbSide = p.facing;
      p.vx = 0; p.vy = 0;
      p.jumpWas = input.jump;
      return true;
    }
    const C = p.climbCol;
    const feet = p.y + p.h;
    const feetRow = Math.floor(feet / TILE);
    if (input.jump && !p.jumpWas) {
      p.climbing = false;
      p.vy = -420;
      p.vx = (p.climbSide > 0 ? -1 : 1) * 30;
      p.facing = p.climbSide > 0 ? -1 : 1;
      p.jumpWas = input.jump;
      return true;
    }
    if ((p.climbSide > 0 && input.left) || (p.climbSide < 0 && input.right)) {
      p.climbing = false;
      p.vx = (p.climbSide > 0 ? -1 : 1) * 130;
      p.vy = -40;
      return true;
    }
    let topR = -1, botR = -1;
    for (let r = 0; r < ROWS; r++) if (L.climb[r][C]) { if (topR < 0) topR = r; botR = r; }
    if (topR < 0) { p.climbing = false; return false; }
    if (p.climbSide > 0) p.x = C * TILE - p.w - 0.4; else p.x = (C + 1) * TILE + 0.4;
    p.vx = 0; p.vy = 0;
    if (input.up) {
      if (feetRow > topR) p.y = (feetRow - 1) * TILE - p.h;
      else {
        p.y = (topR - 1) * TILE - p.h;
        p.x = (p.climbSide > 0
          ? (C + 1) * TILE + TILE / 2 - p.w / 2 - 2
          : (C - 1) * TILE + TILE / 2 - p.w / 2 + 2);
        p.climbing = false;
        p.onGround = true;
        p.vy = 0;
      }
      return true;
    } else if (input.down) {
      if (feetRow + 1 <= botR) p.y = (feetRow + 1) * TILE - p.h;
      return true;
    }
    return true;
  }

  function updatePlayer(dt) {
    const p = player;
    p.animT += dt;
    const wasOnGround = p.onGround;
    p.onGround = false;
    p.skid = false;

    if (input.switchReq && p.switchT <= 0) doSwitch();
    input.switchReq = false;
    if (p.switchT > 0) p.switchT -= dt;
    if (p.tailCd > 0) p.tailCd -= dt;
    if (p.tailT > 0) p.tailT -= dt;
    if (p.dashCd > 0) p.dashCd -= dt;
    if (p.starT > 0) p.starT -= dt;

    if (input.tail && !input.tailWas && state === STATE.PLAY) startTail();
    const isTailSwing = p.tailT > 0.12;

    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    p.inWater = tileAt(cx, cy).w === 1;
    if (p.inWater && !p._wasIn) WBAudio.playSfx("splash", { pan: (p.x + p.w / 2 - camX - W / 2) / (W / 2) });
    p._wasIn = p.inWater;
    const inW = p.inWater;
    const isSea = p.form === "sea";

    let dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (dir !== 0) p.facing = dir;

    const usingRun = input.run;

    const climbingFrame = !inW && p.form === "land" ? handleClimb() : (p.climbing = false, false);
    if (climbingFrame) {
      // CLIFF CLIMB handled all movement this frame; skip water/ground physics.
    } else if (inW && isSea) {
      const swim = Math.min(1, Math.abs(p.vy) / 320);
      p.swimT += dt * 6 * (0.3 + swim);
      if (Math.floor(p.swimT / 2) !== Math.floor((p.swimT - dt * 6 * (0.3 + swim)) / 2))
        WBAudio.playSfx("swim", { vol: 0.45, rate: 0.9 + Math.random() * 0.2 });
      const postDash = p.dashT <= 0 && p.dashCd > 0;
      const fVX = postDash ? Math.min(1, 5 * dt) : (dir === 0 && !input.run ? 1 - Math.pow(0.28, dt) : 1 - Math.pow(0.02, dt));
      p.vx = lerp(p.vx, dir * 150, fVX);
      if (input.up || (input.jump && input.jumpHeld)) p.vy -= 700 * dt;
      else if (input.down) p.vy += 460 * dt;
      else p.vy = lerp(p.vy, 30, postDash ? Math.min(1, 5 * dt) : 1 - Math.pow(0.02, dt));
      p.vy = clamp(p.vy, -600, 480);
      if (input.run && p.dashCd <= 0) startDash();
      if (Math.random() < dt * 0.9) bubbleEmit(p.x + Math.random() * 20, p.y + p.h);
    } else if (inW && !isSea) {
      p.vx = lerp(p.vx, dir * 130, 1 - Math.pow(p.dashT <= 0 && !input.run && dir === 0 ? 0.32 : 0.04, dt));
      if (p.vy > -20) p.vy += 760 * dt;
      p.vy = clamp(p.vy, -300, 360);
      if (input.run && p.dashCd <= 0) startDash();
      if (input.up && p.vy > -240) p.vy -= 420 * dt;
      if (Math.random() < dt * 0.4) bubbleEmit(p.x + Math.random() * 16, p.y + p.h);
    } else if (!inW && isSea) {
      // MERMAID flops on land: low hop + weak float (glide overrides the float)
      const flopLift = p.feather ? 0 : 160;
      p.vx = lerp(p.vx, dir * 84, 1 - Math.pow(0.03, dt));
      p.vy += 1300 * dt;
      if (input.jump && input.jumpHeld) p.vy -= flopLift * dt;
    } else {
      // HUMAN: Mario-3 style momentum — accelerate toward a target, bleed
      // speeds when releasing run, and skid (carry momentum) when reversing.
      const walkT = 150, runT = 272;
      const maxT = usingRun ? runT : walkT;
      const grounded = wasOnGround;
      p.skid = false;
      if (dir !== 0) {
        if (p.vx * dir < 0) {
          // reversing: skid, changing direction is slow and keeps momentum
          p.skid = true;
          p.vx += dir * (grounded ? 760 : 300) * dt;
          if (Math.abs(p.vx) < 24) p.vx = 0;
        } else {
          const cap = Math.abs(p.vx);
          if (cap > maxT + 0.5) {
            // coasting above current class (e.g. released run): bleed toward it
            p.vx -= Math.sign(p.vx) * (grounded ? 700 : 500) * dt;
          } else if (cap < maxT - 0.5) {
            const accel = grounded ? (usingRun ? 1900 : 1500) : 900;
            p.vx += dir * accel * dt;
            p.vx = clamp(p.vx, -maxT, maxT);
          } else {
            p.vx = (p.vx >= 0 ? 1 : -1) * maxT;
          }
        }
        p.vx = clamp(p.vx, -runT, runT);
      } else if (grounded) {
        const s = Math.sign(p.vx);
        p.vx = Math.abs(p.vx) <= 2600 * dt ? 0 : p.vx - s * 2600 * dt;
      }
      // in air with no input, momentum carries (no friction)
      p.vy += 2000 * dt;
    }

    if (!inW) {
      if (!wasOnGround && p.onGround) WBAudio.playSfx("land", { vol: Math.min(1, Math.abs(p.vyPrev || 0) / 500 + 0.3) });
      if (wasOnGround) p.coyote = 0.1;
      else if (p.coyote > 0) p.coyote -= dt;
      const impulse = isSea ? (usingRun ? -500 : -420) : (usingRun ? -796 : -690);
      if (input.jump && !p.jumpWas && p.coyote > 0) {
        p.vy = impulse;
        p.coyote = 0;
        p.airJumps = 0;
        WBAudio.playSfx("jump");
      }
      if (!input.jumpHeld && p.vy < -200) p.vy += (isSea ? 900 : 1500) * dt;
      if (p.dashT <= 0 && !wasOnGround && !p.onGround && input.jump && !p.jumpWas && !isSea && save.abilities.jump && p.airJumps < 1 && p.vy > -100) {
        p.vy = -700;
        p.airJumps++;
        WBAudio.playSfx("jump", { rate: 1.25 });
        sparkle(p.x + p.w / 2, p.y + p.h, "#9fe4ff", 8, 90);
      }
      if (p.onGround) p.airJumps = 0;
    } else {
      p.coyote = 0;
    }

    let inU = false;
    for (const u of L.updrafts) {
      const floor = u.floorY || (u.r1 + 1) * TILE;
      if (p.x + p.w > u.c0 * TILE && p.x < (u.c1 + 1) * TILE && p.y + p.h > u.r0 * TILE && p.y < floor) {
        inU = true;
      }
    }
    p.glide = false;
    if (p.feather && p.form !== "sea" && !p.onGround && input.jumpHeld && (p.vy > 20 || inU)) {
      if (!dbgGlideOn) { dbg("glide ON"); dbgGlideOn = true; }
      p.vy = Math.min(p.vy + 500 * dt, 125);
      p.vx = lerp(p.vx, dir * 260, 1 - Math.pow(0.2, dt));
      p.glide = true;
      p.glideT += dt;
      if (inU) {
        for (const u of L.updrafts) {
          const floor = u.floorY || (u.r1 + 1) * TILE;
          if (p.x + p.w > u.c0 * TILE && p.x < (u.c1 + 1) * TILE && p.y + p.h > u.r0 * TILE && p.y < floor) {
            const want = -Math.min(320, u.lift);
            p.vy += (want - p.vy) * Math.min(1, 5.5 * dt);
          }
        }
      }
      if (Math.random() < dt * 22) particles.push({ x: p.x + p.w / 2 - p.facing * 10, y: p.y + 14, vx: -p.facing * 30 + (Math.random() - 0.5) * 20, vy: 30 + Math.random() * 30, life: 0.3 + Math.random() * 0.3, max: 0.6, color: "rgba(240,248,255,0.7)", r: 1.5 + Math.random() * 1.5 });
    } else {
      if (dbgGlideOn) { dbg("glide OFF"); dbgGlideOn = false; }
      p.glideT = 0;
    }

    for (const cur of L.currents) {
      if (p.x + p.w > cur.c0 * TILE && p.x < (cur.c1 + 1) * TILE && p.y + p.h > cur.r0 * TILE && p.y < (cur.r1 + 1) * TILE) {
        p.vx += cur.dx * dt;
        p.vy += cur.dy * dt;
      }
    }

    // UPDRAFTS: significant lift only while gliding in the column
    if (p.glide && !inW && !p.climbing) {
      for (const u of L.updrafts) {
        const floor = u.floorY || (u.r1 + 1) * TILE;
        if (p.x + p.w > u.c0 * TILE && p.x < (u.c1 + 1) * TILE && p.y + p.h > u.r0 * TILE && p.y < floor) {
          p.vy = Math.min(p.vy, -300);
          break;
        }
      }
    }

    p.x += p.vx * dt;
    collideX(p, inW);
    p.x = Math.max(0, Math.min(p.x, L.levelW - p.w));
    const dy = p.vy * dt;
    const steps = Math.max(1, Math.ceil(Math.abs(dy) / (TILE * 0.5)));
    const step = dy / steps;
    for (let i = 0; i < steps; i++) {
      p.y += step;
      if (collideY(p, step)) break;
    }

    if (p.skid && wasOnGround && Math.abs(p.vx) > 60 && Math.random() < dt * 20) {
      particles.push({ x: p.x + p.w / 2 - p.facing * 8, y: p.y + p.h - 4, vx: -p.facing * 50 + (Math.random() - 0.5) * 30, vy: -40 + Math.random() * 50, life: 0.25 + Math.random() * 0.2, max: 0.45, color: "rgba(210,215,220,0.7)", r: 2 + Math.random() * 2 });
    }

    if (p.dashT > 0) {
      p.dashT -= dt * (inW ? 2.5 : (input.run ? 1 : 3));
      if (p.dashT < 0) p.dashT = 0;
      const dashSpeed = inW ? 333 : 780;
      p.vx = p.dashDx * dashSpeed;
      p.vy = p.dashDy * dashSpeed;
      if (Math.random() < 0.08) bubbleEmit(p.x + p.w / 2, p.y + p.h / 2, 2);
    }

    if (isSea && input.up) {
      const sCol = Math.floor((p.x + p.w / 2) / TILE);
      const sRow = L.surf[sCol];
      if (sRow > 0 && L.wat[sRow] && L.wat[sRow][sCol] && p.y + p.h >= sRow * TILE - 6) {
        // AUTO-MOUNT (crest): only against a shore whose top is AT or ABOVE the
        // water surface (rr <= sRow), so she climbs out of pools and onto
        // beaches but never gets glued to underwater floors or ledges.
        // Scan the columns just ahead of the leading edge, since a beach wall
        // she braced against is never overlap by her body.
        const leadEdge = p.facing > 0 ? (p.x + p.w) / TILE : p.x / TILE;
        const near = Math.floor(leadEdge);
        const scar = [near, near + (p.facing > 0 ? 1 : -1)];
        for (let k = 0; k < scar.length; k++) {
          const shoreCol = scar[k];
          if (shoreCol < 0 || shoreCol >= L.COLS) continue;
          for (let rr = Math.max(0, sRow - 3); rr <= sRow; rr++) {
            if (!L.solid[rr][shoreCol]) continue;
            if (rr > 0 && L.solid[rr - 1][shoreCol]) continue;
            const shoreTop = rr * TILE;
            const low = shoreTop - 2 * TILE - 8;
            const high = shoreTop + 2 * TILE + 8;
            const side = p.y + p.h;
            if (side > low && side < high && Math.abs(side - shoreTop) > 4) {
              p.y = shoreTop - p.h;
              p.vy = -180;
              p.vx = 0;
              p.onGround = false;
              sparkle(p.x + p.w / 2, p.y + p.h, "#8ff0ff", 8, 80);
            }
            break;
          }
        }
      }
    }

    if (inW && !isSea) {
      if (p.y <= L.surf[Math.floor((p.x + p.w / 2) / TILE)] * TILE) {
        p.air = Math.min(100, p.air + 45 * dt);
      }
      p.air -= 13 * dt;
      if (p.air <= 0) { hurtPlayer(false); p.air = 55; }
    } else if (!inW) {
      p.air = Math.min(100, p.air + 30 * dt);
    }

    if (p.invuln > 0) p.invuln -= dt;

    p.jumpWas = input.jump;
    p.runWas = input.run;
    p.tailWas = input.tail;

    if (p.y > L.levelH + 200) { state = STATE.DYING; stateTimer = 0; WBAudio.playSfx("die"); return; }
    p.x = clamp(p.x, -40, L.levelW + 40);
  }

  function updateBolts(dt) {
    for (let i = bolts.length - 1; i >= 0; i--) {
      const b = bolts[i];
      b.life -= dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (Math.random() < dt * 30) bubbleEmit(b.x, b.y, 1);
      for (const c of L.chests) {
        if (!c.open && Math.abs(b.x - c.x) < 18 && Math.abs(b.y - (c.y + 9)) < 22) {
          openChest(c);
          b.life = 0;
        }
      }
      for (const e of L.enemies) {
        if (e.dead || e.hidden) continue;
        if (Math.abs(b.x - (e.x + (e.w || TILE) / 2)) < 16 + (e.w || TILE) / 2 && Math.abs(b.y - (e.y + (e.h || TILE) / 2)) < 16 + (e.h || TILE) / 2) {
          damageEnemy(e, 1, 0);
          b.life = 0;
          break;
        }
      }
      if (bossActive && !bossDead && boss) {
        const bb = bossHit();
        if (Math.abs(b.x - (bb.x + bb.w / 2)) < 16 + bb.w / 2 && Math.abs(b.y - (bb.y + bb.h / 2)) < 22 + bb.h / 2) {
          hitBoss(1);
          b.life = 0;
        }
      }
      if (b.life <= 0) bolts.splice(i, 1);
    }
  }

  const TICKET_HASH = [0, 3, 7, 1, 5, 2, 6, 4, 0, 5, 1, 6, 3, 7, 2, 4];
  function ticketColor(pk) {
    if (!pk._tc) {
      let h = (pk.c * 2654435761 ^ pk.r * 2246822519 ^ (pk.idx | 0) * 2654435761) >>> 0;
      pk._tc = R.RAINBOW[TICKET_HASH[h % 16]];
    }
    return pk._tc;
  }

  function pickupsUpdate(dt) {
    const p = player;
    for (const pk of L.pickups) {
      if (pk.got) continue;
      const hx = pk.c * TILE + TILE / 2, hy = pk.r * TILE + TILE / 2;
      const half = pk.t === "conch" || pk.t === "starprize" ? 13 : 9;
      if (Math.abs(p.x + p.w / 2 - hx) < half + p.w / 2 && Math.abs(p.y + p.h / 2 - hy) < half + p.h / 2) {
        pk.got = true;
        statItem(pk.t);
        if (pk.t === "ticket") { p.tix++; p.score += 100; WBAudio.playSfx("ticket"); sparkle(hx, hy, "#fff3c4", 8, 90); }
        else if (pk.t === "bubble") { p.air = Math.min(100, p.air + 45); WBAudio.playSfx("splash", { rate: 1.4, vol: 0.5 }); sparkle(hx, hy, "#bdeaff", 8, 90); }
        else if (pk.t === "conch") {
          if (save.maxHearts < 6) { save.maxHearts++; p.maxHearts = save.maxHearts; }
          p.hearts = save.maxHearts; p.score += 500; WBAudio.playSfx("conch"); sparkle(hx, hy, "#ff9bb4", 14, 120);
        }
        else if (pk.t === "feather") {
          p.feather = true; p.glide = false; p.score += 150; WBAudio.playSfx("feather");
          dbg("feather gained @c" + pk.c);
          toast = FT("toasts.feather");
          toastT = 2.4;
          sparkle(hx, hy, "#e8f4ff", 14, 120);
        }
        else if (pk.t === "starprize") { p.starT = 7; WBAudio.playSfx("conch", { rate: 1.4 }); p.score += 300; sparkle(hx, hy, "#ffd77a", 16, 140); }
        else if (pk.t.indexOf("key_") === 0) {
          const color = pk.t.slice(4);
          if (!p.keys.includes(color)) p.keys.push(color);
          WBAudio.playSfx("key");
          p.score += 50;
          const c = R.KEY_COLORS[color] || "#ffd77a";
          sparkle(hx, hy, c, 10, 100);
          toast = FT("toasts.key", { color: color.toUpperCase() });
          toastT = 1.8;
        }
        else if (pk.t === "stone_white") { WBAudio.playSfx("key", { rate: 0.8 });
          save.stones.white = true; persist(); p.score += 100;
          sparkle(hx, hy, "#f0ecff", 12, 110);
          toast = FT("toasts.stoneWhite");
          toastT = 2.2;
        }
        else if (pk.t === "stone_black") { WBAudio.playSfx("key", { rate: 0.8 });
          save.stones.black = true; persist(); p.score += 100;
          sparkle(hx, hy, "#8a7bff", 12, 110);
          toast = FT("toasts.stoneBlack");
          toastT = 2.2;
        }
        else { p.score += 50; sparkle(hx, hy, "#9fe4ff", 10, 100); }
      }
    }
  }

  function damageEnemy(e, dmg, kx) {
    if (e.dead) return;
    e.hp -= dmg;
    e.vx = kx;
    e.stun = 0.35;
    sparkle(e.x + (e.w || TILE) / 2, e.y + (e.h || TILE) / 2, "#ffe1a0", 8, 100);
    if (e.hp <= 0) { statKill(e.t); e.dead = true; e.deadT = 0; player.score += 200; WBAudio.playSfx("kill"); }
  }

  function updateEnemies(dt) {
    for (const e of L.enemies) {
      if (e.dead) { e.deadT += dt; continue; }
      if (e.flipT > 0) {
        // SMACKED: knocked back and flipped. In water it slowly floats up
        // to the surface; the last beat is a little shake before getting up.
        e.flipT -= dt;
        e.x += e.flipKx * dt;
        e.flipKx *= Math.pow(0.05, dt);
        const fw = e.w || TILE;
        const inW = tileAt(e.x + fw / 2, e.y + (e.h || TILE) / 2).w === 1;
        if (inW) {
          const sRow = L.surf[Math.floor((e.x + fw / 2) / TILE)];
          if (sRow >= 0) {
            const target = sRow * TILE - 2 - (e.h || TILE);
            e.y = Math.max(target, e.y - 36 * dt);
          }
        }
        e.wigg += dt;
        if (e.flipT <= 0) e.flipShakeT = 0.35;
        continue;
      }
      if (e.flipShakeT > 0) {
        e.flipShakeT -= dt;
        e.wigg += dt;
        if (e.flipShakeT <= 0) e.hp = Math.min(2, e.hp + 1);
        continue;
      }
      e.wigg += dt;
      if (e.stun > 0) { e.stun -= dt; continue; }
      if (e.t === "crab" || (e.t === "crabj" && e.phase !== "buried")) crabTick(e, dt);
      if (e.t === "crab") {
        e.x += e.vx * dt;
        const standOn = (r, c) => (r >= 0 && r < ROWS && c >= 0 && c < L.COLS) ? ((L.solid[r][c] || L.plat[r][c]) ? 1 : 0) : 1;
        const fc = Math.floor((e.vx > 0 ? e.x + e.w : e.x) / TILE);
        let landRow = -1;
        const feetRow = Math.floor(((e.y + e.h) + 4) / TILE);
        for (let r = feetRow; r <= feetRow + 3 && r < ROWS; r++) {
          if (standOn(r, fc)) { landRow = r; break; }
        }
        if (landRow >= 0) e.y = landRow * TILE - e.h;
        const fc2 = Math.floor((e.vx > 0 ? e.x + e.w : e.x) / TILE);
        const ahead = standOn(Math.floor((e.y + e.h + 4) / TILE), fc2);
        const wall = standOn(Math.floor((e.y + 6) / TILE), e.vx > 0 ? fc2 : fc2 - 1);
        if (!ahead || wall) e.vx = -e.vx;
      } else if (e.t === "crabj") {
        // BURROWING GREEN CRAB: hides under the ground, erupts out, scurries
        // with short unpredictable hops, then digs back down and rests.
        const standOn = (r, c) => (r >= 0 && r < ROWS && c >= 0 && c < L.COLS) ? ((L.solid[r][c] || L.plat[r][c]) ? 1 : 0) : 1;
        e.cycleT -= dt;
        if (e.phase === "buried") {
          e.hidden = true;
          if (e.cycleT <= 0) {
            e.phase = "rise";
            e.x = e.baseC * TILE + (TILE - e.w) / 2;
            e.vx = 0; e.vy = -620;
            e.hidden = false;
            sparkle(e.x + e.w / 2, e.surfY, "#c9a06a", 10, 130);
            if (Math.abs(e.x - player.x) < 560) WBAudio.playSfx("crabburst", { pan: Math.max(-1, Math.min(1, (e.x - player.x) / 400)) });
          }
        } else if (e.phase === "rise") {
          e.vy += 2000 * dt;
          e.y += e.vy * dt;
          if (e.vy >= 0 && e.y + e.h >= e.surfY) {
            e.y = e.surfY - e.h; e.vy = 0;
            e.phase = "active"; e.cycleT = 2 + Math.random() * 2.5;
            sparkle(e.x + e.w / 2, e.surfY, "#c9a06a", 8, 90);
          }
        } else if (e.phase === "dive") {
          e.cycleT = 0;
          e.y += 320 * dt;
          if (e.y >= e.diveTarget) {
            e.y = e.diveTarget;
            e.phase = "buried"; e.hidden = true;
            e.cycleT = 1.2 + Math.random() * 2.8;
          }
        } else {
          const inW = tileAt(e.x + (e.w) / 2, e.y + (e.h) / 2).w === 1;
          const damp = inW ? 0.55 : 1;
          e.x += e.vx * dt;
          e.y += e.vy * dt;
          e.vy += 1400 * damp * dt;
          const fc = Math.floor((e.vx > 0 ? e.x + e.w : e.x) / TILE);
          const feetRow = Math.floor(((e.y + e.h) + 4) / TILE);
          let landRow = -1;
          for (let r = feetRow; r <= feetRow + 3 && r < ROWS; r++) {
            if (standOn(r, fc)) { landRow = r; break; }
          }
          if (landRow >= 0 && e.vy >= 0) {
            e.y = landRow * TILE - e.h;
            e.vy = 0;
            e.grounded = true;
          } else {
            e.grounded = false;
          }
          const fc2 = Math.floor((e.vx > 0 ? e.x + e.w : e.x) / TILE);
          const ahead = standOn(Math.floor((e.y + e.h + 4) / TILE), fc2);
          const wall = standOn(Math.floor((e.y + 6) / TILE), e.vx > 0 ? fc2 : fc2 - 1);
          if ((!ahead && landRow >= 0) || wall) e.vx = -e.vx;
          e.hopT -= dt;
          if (e.hopT <= 0 && e.grounded) {
            e.hopT = 0.7 + Math.random() * 1.8;
            e.vy = -(150 + Math.random() * 190) * damp;
            e.vx = (Math.random() < 0.5 ? -1 : 1) * (55 + Math.random() * 95);
          }
          if (e.cycleT <= 0) {
            e.phase = "dive";
            const dc = Math.floor((e.x + e.w / 2) / TILE);
            const feetRow2 = Math.floor((e.y + e.h) / TILE);
            let dip = null;
            for (let r = feetRow2 + 1; r < ROWS && r <= feetRow2 + 6; r++) {
              if (standOn(r, dc)) { dip = r * TILE; break; }
            }
            e.diveTarget = (dip ?? (e.y + e.h + TILE * 4)) - e.h + TILE * 1.4;
            sparkle(e.x + e.w / 2, e.surfY, "#c9a06a", 8, 90);
          }
        }
      } else if (e.t === "star") {
        e.y = e.baseY + Math.sin(e.wigg * 3) * 3;
        const inW = tileAt(e.x + (e.w || TILE) / 2, e.y + (e.h || TILE) / 2).w === 1;
        if (inW) {
          e.x += e.vx * dt;
          const fc = Math.floor((e.vx > 0 ? e.x + e.w : e.x) / TILE);
          const fw = tileAt(e.vx > 0 ? e.x + e.w : e.x, e.y + (e.h || TILE) / 2).w === 1;
          const fwall = tileAt(e.vx > 0 ? e.x + e.w : e.x, e.y + (e.h || TILE) / 2).s === 1;
          if (!fw || fwall) e.vx = -e.vx;
        }
      } else if (e.t === "jelly") {
        e.x = e.baseX + Math.sin(e.wigg * 0.7) * 26 - (e.w / 2);
        e.y = e.baseY + Math.sin(e.wigg * 1.5 + 1.3) * 16;
      } else if (e.t === "eel") {
        e.x += e.vx * dt;
        if (e.x < e.baseX - TILE * 3 || e.x > e.baseX + TILE * 3) e.vx = -e.vx;
      }
    }
  }

  function tokenContact(e) {
    if (e.hidden || e.flipT > 0 || e.flipShakeT > 0) return;
    if (!R.BADDIES.includes(e.t)) return;
    const p = player;
    const w = e.w || TILE - 6, h = e.h || TILE - 6;
    const ny = e.y + (e.t === "eel" ? 6 : 0);
    if (p.x < e.x + w - 6 && p.x + p.w > e.x + 6 && p.y < ny + h - 4 && p.y + p.h > ny + 4) {
      const stomp = p.vy > 80 && (p.y + p.h - p.vy * 0.016) < ny + h * 0.6;
      if (p.starT > 0 || p.dashT > 0 || stomp) {
        damageEnemy(e, e.hp, p.starT > 0 ? -p.facing * 120 : 0);
        p.vy = stomp ? (p.form === "sea" ? -280 : -460) : p.vy;
        if (stomp) p.score += 200;
        else if (p.starT > 0 || p.dashT > 0) { p.score += 200; p.vy = p.form === "sea" ? -120 : -200; }
      } else if (p.invuln <= 0) {
        hurtPlayer();
      }
    }
  }

  let boss = null;

  function bossHit() {
    if (boss.kind === "crabk") return { x: boss.x - 42, y: boss.y - 46, w: 84, h: 76 };
    return { x: boss.x - 26, y: boss.y - 26, w: 52, h: 52 };
  }

  function hitBoss(dmg) {
    if (boss.flash > 0) return;
    boss.hp -= dmg;
    boss.flash = 0.18;
    boss.knock = 1;
    sparkle(boss.x, boss.y, "#ffe1a0", 12, 130);
    if (boss.hp <= 0) {
      bossDead = true;
      statKill("boss");
      sparkle(boss.x, boss.y, "#ffd77a", 40, 220);
      const rewardDef = L.def.reward || L.def.boss.reward;
      if (rewardDef === "jump") {
        save.abilities.jump = true;
        persist();
        banner = FT("banners.leap");
        bannerT = 4;
        toast = FT("toasts.leapHint");
        toastT = 3.5;
      } else if (rewardDef === "bolt") {
        save.abilities.bolt = true;
        persist();
        banner = FT("banners.bolt");
        bannerT = 4;
        toast = FT("banners.boltHint");
        toastT = 3.5;
      }
      save.cleared[currentLevel] = true;
      save.unlocked = Math.max(save.unlocked, Math.min(currentLevel + 1, levels.length - 1));
      persist();
      for (const gate of L.gates) {
        for (const r of gate.rows) L.solid[r][gate.c] = 0;
      }
    }
  }

  function spawnBoss() {
    const b = L.def.boss;
    boss = {
      kind: b.kind, hp: b.hp, maxhp: b.hp,
      x: b.x, y: b.y, t: 0, flash: 0, knock: 0,
      vx: 0, vy: 0, state: "walk", timer: 1.4, dir: -1,
      baseX: b.x, baseY: b.y, hitSwing: 0,
    };
    if (b.kind === "serpent" && L.def.gates && L.def.gates[0]) {
      const x0 = (L.def.gates[0].c + 1) * TILE + 40, x1 = b.x + 260;
      boss.baseX0 = (x0 + x1) / 2;
      boss.halfW = (x1 - x0) / 2;
      boss.baseY0 = (2 + 24) / 2 * TILE;
      boss.halfH = (24 - 2) / 2 * TILE;
    }
    bossActive = true;
  }

  function updateBoss(dt) {
    if (!boss || bossDead) return;
    const p = player;
    boss.t += dt;
    if (boss.flash > 0) boss.flash -= dt;
    if (boss.knock > 0) boss.knock -= dt;

    if (boss.kind === "crabk") {
      const halfW = 30, halfH = 23;
      const gy = boss.y + 12;
      const dx = (p.x + p.w / 2) - boss.x;
      if (boss.state === "walk") {
        const spd = 92;
        boss.dir = dx > 4 ? 1 : dx < -4 ? -1 : boss.dir;
        boss.x += boss.dir * spd * dt;
        const floorRow = Math.floor((gy + halfH) / TILE);
        if (L.solid[floorRow] && L.solid[floorRow][Math.floor(boss.x / TILE)] && boss.x > L.def.boss.x - 320 && boss.x < L.def.boss.x + 320) {
          boss.y = L.def.boss.y;
        }
        boss.x = clamp(boss.x, L.def.boss.x - 300, L.def.boss.x + 300);
        boss.timer -= dt;
        if (boss.timer <= 0) { boss.state = "coil"; boss.timer = 0.55; }
      } else if (boss.state === "coil") {
        boss.timer -= dt;
        if (boss.timer <= 0) { boss.state = "snap"; boss.timer = 0.5; boss.dir = dx >= 0 ? 1 : -1; }
      } else {
        boss.x += boss.dir * 470 * dt;
        boss.timer -= dt;
        if (boss.timer <= 0) { boss.state = "walk"; boss.timer = 1.6 + Math.random() * 2; }
      }
      const hit = { x: boss.x - 42, y: boss.y - 46, w: 84, h: 76 };
      if (boss.knock > 0) hit.x += -boss.dir * 40;
      if (p.x < hit.x + hit.w && p.x + p.w > hit.x && p.y < hit.y + hit.h && p.y + p.h > hit.y) {
        if (p.vy > 80 && (p.y + p.h - p.vy * 0.016) < hit.y + hit.h * 0.5 && boss.knock <= 0) {
          hitBoss(1);
          p.vy = -480;
          p.score += 300;
        } else if (p.invuln <= 0 && p.starT <= 0 && p.dashT <= 0) {
          hurtPlayer();
        }
      }
    } else {
      const poke = L.def.boss.x;
      const x0 = (L.def.gates && L.def.gates[0] ? L.def.gates[0].c + 1 : Math.floor(poke / TILE) - 6) * TILE + 40, x1 = L.def.boss.x + 260;
      const mx = (x0 + x1) / 2, half = (x1 - x0) / 2;
      const my = (2 + 24) / 2 * TILE, hy = (24 - 2) / 2 * TILE;
      boss.x = mx + Math.sin(boss.t * 0.45) * half;
      boss.y = my + Math.sin(boss.t * 1.1) * hy;
      const dx = (p.x + p.w / 2) - boss.x, dy = (p.y + p.h / 2) - boss.y;
      if (Math.hypot(dx, dy) < 170 && boss.timer <= 0) {
        boss.state = "lunge";
        boss.timer = 0.6;
        boss.vx = dx / Math.hypot(dx, dy) * 560;
        boss.vy = dy / Math.hypot(dx, dy) * 560;
      }
      if (boss.state === "lunge") {
        boss.timer -= dt;
        if (boss.timer <= 0) { boss.state = "swim"; boss.timer = 1.2 + Math.random() * 1.5; }
      } else {
        boss.vx = lerp(boss.vx, 0, 1 - Math.pow(0.1, dt));
        boss.vy = lerp(boss.vy, 0, 1 - Math.pow(0.1, dt));
      }
      boss.x = clamp(boss.x + boss.vx * dt, x0, x1);
      boss.y = clamp(boss.y + boss.vy * dt, 2 * TILE, 26 * TILE);
      const hh = { x: boss.x - 20, y: boss.y - 20, w: 40, h: 40 };
      if (p.x < hh.x + hh.w && p.x + p.w > hh.x && p.y < hh.y + hh.h && p.y + p.h > hh.y) {
        if ((p.dashT > 0 || p.starT > 0 || (p.vy > 90 && (p.y + p.h - p.vy * 0.016) < hh.y + hh.h * 0.5)) && boss.knock <= 0) {
          hitBoss(1);
          p.vy = p.form === "sea" ? -200 : -400;
          p.score += 300;
        } else if (p.invuln <= 0 && p.starT <= 0) {
          hurtPlayer();
        }
      }
    }
  }

  function otterOnGround(x, row) {
    const c = Math.floor(x / TILE);
    if (c < 0 || c >= L.COLS || row < 0 || row >= ROWS) return false;
    return !!(L.solid[row][c] || L.plat[row][c]);
  }

  function updateNPC(dt) {
    const p = player;
    for (const n of L.npcs) {
      if (n.kind !== "elder" && n.kind !== "kid") continue;
      n.animT = (n.animT || 0) + dt;
      n.actT -= dt;
      if (n.act === "walk") {
        const look = n.x + n.face * 14;
        if (!otterOnGround(look, n.row) || Math.abs(n.x - n.homeX) > 90) n.face *= -1;
        n.vx = n.face * n.speed;
        n.x += n.vx * dt;
        if (!otterOnGround(n.x, n.row)) { n.x -= n.vx * dt; n.face *= -1; n.act = "idle"; n.actT = 0.8 + Math.random(); n.vx = 0; }
        if (n.actT <= 0) { n.act = "idle"; n.actT = 1.2 + Math.random() * 2.4; n.vx = 0; }
      } else {
        n.vx = 0;
        if (n.actT <= 0) {
          n.act = "walk";
          n.actT = 1.4 + Math.random() * 2.8;
          if (Math.random() < 0.5) n.face *= -1;
        }
      }
    }
    if (dialog) return;
    let nearest = null, best = 1e9;
    for (const n of L.npcs) {
      const dx = (p.x + p.w / 2) - n.x, dy = (p.y + p.h / 2) - n.y;
      if (Math.abs(dx) < 90 && Math.abs(dy) < 80) {
        const d = Math.abs(dx);
        if (d < best) { best = d; nearest = n; }
      }
    }
    player.nearNPC = nearest;
    if (nearest && input.enter && !input.prevEnter) openDialog(nearest);
  }

  function openDialog(npc) {
    const seenBefore = talkedOnce.has(currentLevel + ":" + npc.name);
    talkedOnce.add(currentLevel + ":" + npc.name);
    dialog = { npc, line: 0, shop: false, cursor: 0, seenBefore };
    if (npc.quest === "stones" && !save.abilities.bolt && save.stones.white && save.stones.black) {
      save.stones.white = false;
      save.stones.black = false;
      save.abilities.bolt = true;
      persist();
      banner = FT("banners.bolt");
      bannerT = 4;
      toast = FT("banners.boltHint");
      toastT = 3.5;
      sparkle(player.x + player.w / 2, player.y, "#9fe4ff", 20, 160);
      dialog = {
        npc: { kind: "kid", lines: FL("story.pipStones"), quest: "stones" },
        line: 0, shop: false, cursor: 0,
      };
    }
  }

  function updateDialog(dt) {
    if (!dialog) return;
    const enterEdge = input.enter && !input.prevEnter;
    const tailEdge = input.tail && !input.tailWas;
    const switchEdge = input.switchReq;
    input.switchReq = false;
    if (dialog.shop) {
      if (input.up && !input.upPrev) dialog.cursor = (dialog.cursor + SHOP_ITEMS.length - 1) % SHOP_ITEMS.length;
      if (input.down && !input.downPrev) dialog.cursor = (dialog.cursor + 1) % SHOP_ITEMS.length;
      if (switchEdge) { dialog = null; input.switchReq = false; }
      else if (tailEdge) { dialog = null; }
      else if (enterEdge) {
        const bought = buyShopItem(dialog.cursor);
        if (bought) { dialog.shop = false; dialog.line = 0; }
      }
      input.upPrev = input.up;
      input.downPrev = input.down;
      return;
    } else {
      if (switchEdge) { dialog = null; }
      else if (enterEdge || tailEdge) {
        dialog.line++;
        if (!dialog.seenBefore) WBAudio.playSfx("talk");
        if (dialog.line >= dialog.npc.lines.length) {
          if (dialog.npc.trade) { dialog.shop = true; dialog.cursor = 0; dialog.line = 0; }
          else dialog = null;
        }
      }
    }
    input.upPrev = input.up;
  }

  function openDoor(d) {
    d.open = true;
    WBAudio.playSfx("door");
    for (const r of d.rows) L.solid[r][d.c] = 0;
    sparkle(d.c * TILE + TILE / 2, 150, "#ffe79a", 14, 130);
  }

  function openChest(c) {
    if (c.open) return;
    c.open = true;
    WBAudio.playSfx("chest");
    const key = c.c + ":" + c.r;
    if (!save.chests[currentLevel]) save.chests[currentLevel] = [];
    if (!save.chests[currentLevel].includes(key)) save.chests[currentLevel].push(key);
    persist();
    const rw = c.reward || { tix: 50 };
    sparkle(c.x, c.y + 8, "#ffe9b0", 20, 160);
    if (rw.unlock) {
      if (rw.unlock === "bolt" && !save.abilities.bolt) {
        save.abilities.bolt = true;
        persist();
        banner = FT("banners.bolt");
        bannerT = 4;
        toast = FT("banners.boltHint");
        toastT = 3.5;
      } else if (rw.unlock === "jump" && !save.abilities.jump) {
        save.abilities.jump = true;
        persist();
        banner = FT("banners.leap");
        bannerT = 4;
        toast = FT("toasts.leapHint");
        toastT = 3.5;
      }
    } else {
      const n = rw.tix != null ? rw.tix : 0;
      if (n > 0) {
        player.tix += n;
        save.tix = player.tix;
        persist();
        toast = FT("toasts.tickets", { n });
        toastT = 2.4;
      }
    }
  }

  function puzzleUpdate(dt) {
    const p = player;
    const pcx = p.x + p.w / 2;
    for (const d of L.doors) {
      if (d.open) continue;
      const dcx = d.c * TILE + TILE / 2;
      const dTop = d.rows[0] * TILE, dBot = (d.rows[d.rows.length - 1] + 1) * TILE;
      const near = Math.abs(pcx - dcx) < TILE * 3 && p.y + p.h > dTop - 60 && p.y < dBot + 60;
      if (!near) continue;
      if (p.keys.includes(d.color)) {
        openDoor(d);
        const c = R.KEY_COLORS[d.color] || "#ffd77a";
        toast = FT("toasts.gate");
        toastT = 2;
        sparkle(dcx, dTop + 40, c, 16, 150);
      } else {
        d.hint = 0.6;
      }
    }
    for (const d of L.doors) if (d.hint > 0) d.hint -= dt;
  }

  function updateGame(dt) {
    const p = player;
    if (dialog) { updateDialog(dt); return; }

    updatePlayer(dt);
    if (state !== STATE.PLAY) return;

    updateEnemies(dt);
    updateBolts(dt);
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.life -= dt;
      if (sw.life <= 0) shockwaves.splice(i, 1);
    }
    updateNPC(dt);
    pickupsUpdate(dt);
    puzzleUpdate(dt);

    for (const e of L.enemies) { if (!e.dead) tokenContact(e); }

    if (player.inWater && state === STATE.PLAY) {
      if (Math.random() < dt * 1) bubbleEmit(player.x + Math.random() * 16 - 8, player.y + Math.random() * 24);
    }

    const hitStation = stationAt(p);
    if (hitStation) {
      if (!saveTouchedRun) {
        saveTouchedRun = true;
        save.tix = p.tix;
        persist();
        toast = FT("toasts.saved");
        toastT = 2;
        WBAudio.playSfx("save");
        if (hitStation.mix != null) WBAudio.setMix(hitStation.mix);
      }
    } else saveTouchedRun = false;

    if (bossActive && !bossDead) {
      updateBoss(dt);
      if (L.gates.length) {
        const g = L.gates[0];
        const inside = p.x > (g.c + 1) * TILE + 6;
        const wantState = inside ? 1 : 0;
        if (L.solid[g.rows[0]][g.c] !== wantState)
          for (const r of g.rows) L.solid[r][g.c] = wantState;
      }
    }

    if (!bossActive && L.def.boss && L.def.gates && L.def.gates[0] && p.x + p.w > (L.def.gates[0].c) * TILE - 10) {
      spawnBoss();
      if (L.gates[0]) for (const r of L.gates[0].rows) L.solid[r][L.gates[0].c] = 0;
      banner = FT("banners.boss", { boss: L.def.boss.name });
      bannerT = 3;
      WBAudio.playSfx("boss");
    }

    if (p.x + p.w > L.def.goalX && p.x < L.def.goalX + 40 && (!L.def.boss || bossDead)) {
      state = STATE.CONGRATS;
      stateTimer = 0;
      congratsTotalT = 999; congratsSfxKey = ""; congratsPrevJump = true;
      WBAudio.playSfx("win");
      WBAudio.playCongratsMusic();
      save.cleared[currentLevel] = true;
      save.unlocked = Math.max(save.unlocked, Math.min(currentLevel + 1, levels.length - 1));
      save.tix = p.tix;
      if (!bossDead && L.def.boss) { bossDead = true; }
      persist();
    }

    // MARIO-3 CAMERA: player rides a right "scroll trigger" (camera advances
    // 1:1 with them past ~58% of the screen), pans back left once they cross
    // the mirrored band (~42%), and vert follows within a middle band.
    const triggerX = W * 0.58;
    const sxp = p.x + p.w / 2 - camX;
    if (sxp > triggerX) camX = p.x + p.w / 2 - triggerX;
    else if (sxp < W - triggerX && camX > 0) camX = p.x + p.w / 2 - (W - triggerX);
    camX = clamp(camX, 0, L.levelW - W);
    const topY = H * 0.38, botY = H * 0.62;
    const syp = p.y + p.h / 2 - camY;
    if (syp < topY) camY = p.y + p.h / 2 - topY;
    else if (syp > botY) camY = p.y + p.h / 2 - botY;
    camY = clamp(camY, 0, L.levelH - H);
  }

  let saveTouchedRun = false;

  function shadeDarken(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.floor(((n >> 16) & 255) * 0.45);
    const g = Math.floor(((n >> 8) & 255) * 0.45);
    const b = Math.floor((n & 255) * 0.45);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function drawBackground(t) {
    const th = L.def.theme;
    const pal = PAL[th];
    const pc = Math.floor((player.x + player.w / 2) / TILE), pr = Math.floor((player.y + player.h / 2) / TILE);
    const inShade = !L.def.underwater && L.shade.some((s) => pc >= s.c0 && pc <= s.c1 && pr >= s.r0 && pr <= s.r1);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    if (inShade) {
      g.addColorStop(0, shadeDarken(pal.sky[0]));
      g.addColorStop(0.55, shadeDarken(pal.sky[1]));
      g.addColorStop(1, shadeDarken(pal.sky[2]));
    } else {
      g.addColorStop(0, pal.sky[0]);
      g.addColorStop(0.55, pal.sky[1]);
      g.addColorStop(1, pal.sky[2]);
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    if (!L.def.underwater) {
      if (!inShade) {
        ctx.fillStyle = pal.sun;
        ctx.beginPath(); ctx.arc(790 - camX * 0.02, 90, 34, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath(); ctx.arc(790 - camX * 0.02, 90, 48, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = pal.far;
      for (let i = 0; i < 8; i++) {
        const bx = ((i * 420 - camX * 0.1) % (W + 400)) - 200;
        ctx.beginPath(); ctx.ellipse(bx, 250 + ((i * 37) % 60), 90, 26, 0, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = pal.near;
      for (let i = 0; i < 12; i++) {
        const bx = ((i * 260 - camX * 0.3) % (W + 300)) - 150;
        ctx.beginPath(); ctx.ellipse(bx, 330, 70, 18, 0, 0, TAU); ctx.fill();
      }
    } else {
      ctx.fillStyle = pal.far;
      for (let i = 0; i < 6; i++) {
        const by = ((i * 130 + Math.sin(t + i * 2.4) * 20) % (H + 200)) - 100;
        ctx.fillStyle = pal.far;
        ctx.beginPath(); ctx.ellipse(200 - camX * 0.05, by, 160, 30, 0, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = pal.sun;
      ctx.save();
      ctx.globalAlpha = 0.5 + Math.sin(t) * 0.2;
      for (let i = 0; i < 3; i++) {
        const rx = ((i * 320 + Math.sin(t * 0.6 + i) * 40 - camX * 0.5) % (W + 300)) - 150;
        ctx.beginPath(); ctx.ellipse(rx, 60 + i * 30, 90, 14, 0, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawLevel(t) {
    const th = L.def.theme;
    const pal = PAL[th];
    const c0 = Math.floor(camX / TILE), c1 = Math.ceil((camX + W) / TILE);
    const r0 = Math.floor(camY / TILE), r1 = Math.ceil((camY + H) / TILE);
    for (let c = Math.max(0, c0); c <= Math.min(L.COLS - 1, c1); c++) {
      for (let r = Math.max(0, r0); r <= Math.min(ROWS - 1, r1); r++) {
        const x = c * TILE - camX, y = r * TILE - camY;
        if (L.solid[r][c]) {
          const isTop = L.topSurface.some((sp) => sp[0] === c && sp[1] === r);
          if (isTop) {
            ctx.fillStyle = pal.grass;
            ctx.fillRect(x, y, TILE, 5);
            ctx.fillStyle = th === "cave" || th === "abyss" ? pal.dirtB : pal.dirtB;
            ctx.fillRect(x, y + 4, TILE, TILE - 4);
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.fillRect(x, y + 6, TILE, 3);
            if (th === "town") {
              ctx.strokeStyle = "rgba(80,60,30,0.3)"; ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(x, y + 14); ctx.lineTo(x + TILE, y + 14); ctx.stroke();
            }
          } else {
            ctx.fillStyle = ((r + c) % 2) ? pal.dirtA : pal.dirtB;
            ctx.fillRect(x, y, TILE, TILE);
            ctx.fillStyle = pal.dirtB;
            ctx.fillRect(x, y + TILE - 2, TILE, 2);
          }
        }
        if (L.wat[r][c]) {
          const depth = r / ROWS;
          ctx.fillStyle = `rgba(${pal.water},${0.30 + depth * 0.24})`;
          ctx.fillRect(x, y, TILE, TILE);
        }
        if (L.plat[r][c]) {
          if (L.cloud[r][c]) {
            ctx.fillStyle = "rgba(255,252,246,0.5)";
            ctx.fillRect(x, y + TILE - 6, TILE, 6);
            ctx.beginPath();
            ctx.ellipse(x + TILE / 2, y + TILE - 7, 13, 7, 0, 0, TAU);
            ctx.arc(x + 8, y + TILE - 11, 6, 0, TAU);
            ctx.arc(x + 22, y + TILE - 10, 5, 0, TAU);
            ctx.fill();
          } else {
            ctx.fillStyle = pal.grass;
            ctx.fillRect(x, y, TILE, 6);
            ctx.fillStyle = pal.dirtB;
            ctx.fillRect(x, y + 6, TILE, TILE - 6);
            ctx.fillStyle = "rgba(255,255,255,0.05)";
            ctx.fillRect(x, y + 8, TILE, 3);
          }
        }
      }
    }

    if (!L.def.underwater) {
      for (let c = Math.max(0, c0); c <= Math.min(L.COLS - 1, c1); c++) {
        for (let r = Math.max(0, r0); r <= Math.min(ROWS - 1, r1); r++) {
          if (L.wat[r][c] && (r === 0 || !L.wat[r - 1][c])) {
            const x = c * TILE - camX, y = r * TILE - camY;
            const shim = Math.sin(t * 2 + c * 0.7) * 3;
            ctx.fillStyle = "rgba(210,245,255,0.5)";
            ctx.fillRect(x, y - 1 + shim, TILE, 4);
          }
        }
      }
    }

    if (L.def.underwater) {
      ctx.save();
      ctx.globalAlpha = 0.16;
      for (let i = 0; i < 5; i++) {
        const ox = ((i * 260 - camX * 0.5 + Math.sin(t + i * 1.7) * 30) % (W + 220)) - 110;
        const gr = ctx.createLinearGradient(ox, 0, ox + 18, 0);
        gr.addColorStop(0, "rgba(0,0,0,0)");
        gr.addColorStop(0.5, "rgba(255,245,200,0.4)");
        gr.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gr;
        ctx.fillRect(ox, 0, 18, H);
      }
      ctx.restore();
      ctx.fillStyle = `rgba(${pal.water},0.12)`;
      ctx.fillRect(0, 0, W, H);
    }

    if (th === "falls") {
      ctx.save();
      ctx.globalAlpha = 0.22;
      for (let c = 53; c <= 60; c++) {
        const x = c * TILE - camX, y = 13 * TILE - camY;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(x + 8 + Math.sin(t * 3 + c) * 4, y, 6, H - y);
      }
      ctx.restore();
    }

    if (L.updrafts.length) {
      ctx.save();
      for (const u of L.updrafts) {
        const x0 = u.c0 * TILE - camX, x1 = (u.c1 + 1) * TILE - camX;
        const y0 = u.r0 * TILE - camY, y1 = (u.floorY || (u.r1 + 1) * TILE) - camY;
        if (x1 < 0 || x0 > W || y1 < 0 || y0 > H) continue;
        const n = Math.max(2, Math.round((x1 - x0) / 26));
        for (let i = 0; i < n; i++) {
          const sx = x0 + ((i + 0.5) / n) * (x1 - x0) + Math.sin(t * 3 + i * 1.3) * 3;
          const sy = y0 + ((((t * 140 + i * 50) % (y1 - y0 + 50)) - 25 + 50) % (y1 - y0 + 50)) - 25;
          ctx.fillStyle = "rgba(235,250,255,0.14)";
          ctx.beginPath();
          ctx.ellipse(sx, sy, 2.5, 9, 0, 0, TAU);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  function drawDeco(t) {
    const th = L.def.theme;
    if (th === "town") {
      for (let c = 0; c < L.COLS; c++) {
        const isBld = L.topSurface.some((sp) => sp[0] === c && sp[1] === 9);
        if (!isBld) continue;
        const x = c * TILE - camX, y = 9 * TILE - camY;
        if (x < -60 || x > W + 60) continue;
        ctx.fillStyle = "#e2707f";
        ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + TILE + 6, y); ctx.lineTo(x + TILE / 2, y - 22); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#c15363";
        ctx.fillRect(x - 6, y - 3, TILE + 12, 4);
        ctx.fillStyle = "#f4d39a";
        ctx.fillRect(x + 3, y + 6, TILE - 6, TILE - 8);
        ctx.fillStyle = "#a6723d";
        ctx.fillRect(x + 3, y + 6, TILE - 6, 4);
        ctx.fillStyle = "#e8b06a";
        ctx.fillRect(x + TILE / 2 - 4, y + 16, 8, TILE - 16);
      }
    }
  }

  const flagColor = (i) => ["#ff5d7e", "#ffd77a", "#9fe4ff", "#b07ce0"][i];

  function drawGoal(t) {
    const fx = L.def.goalX - camX + 10;
    const fy = (L.def.goalY || (L.def.underwater ? 3 : 13)) * TILE - camY;
    if (fx < -60 || fx > W + 60) return;
    ctx.fillStyle = "#8fae6a";
    ctx.fillRect(fx, fy - 40, 4, 40);
    ctx.fillStyle = "#ff5d7e";
    ctx.beginPath(); ctx.moveTo(fx + 4, fy - 40); ctx.lineTo(fx + 34, fy - 31); ctx.lineTo(fx + 4, fy - 22); ctx.closePath(); ctx.fill();
    ctx.font = "700 14px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText(FT("world.goal"), fx - 8, fy - 54);
  }

  function drawSave(t) {
    for (const st of stationsOf(L.def)) {
      const sx0 = st.x;
      const sy = ((st.r != null ? st.r : (L.def.saveY || L.def.goalY || 13))) * TILE - camY;
      const sx = sx0 - camX + 10;
      if (sx < -60 || sx > W + 60) continue;
      const glow = 0.4 + Math.sin(t * 3) * 0.2;
      ctx.save();
      ctx.translate(sx, sy);
    ctx.fillStyle = `rgba(255,220,140,${glow})`;
    ctx.beginPath(); ctx.arc(0, -18, 14, 0, TAU); ctx.fill();
    ctx.fillStyle = "#ffe9b0";
    ctx.beginPath(); ctx.arc(0, -18, 9, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#8fae6a"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -14); ctx.stroke();
    ctx.fillStyle = "#ff5d7e";
    ctx.beginPath();
    ctx.moveTo(-8, 0); ctx.lineTo(0, -8); ctx.lineTo(8, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }

  function drawPickups(t) {
    for (const pk of L.pickups) {
      if (pk.got) continue;
      const px = pk.c * TILE + TILE / 2 - camX;
      const py = pk.r * TILE + TILE / 2 - camY;
      if (px < -30 || px > W + 30) continue;
      if (pk.t === "ticket") R.drawTicket(ctx, px, py, t * 2 + pk.bob, ticketColor(pk));
      else if (pk.t === "bubble") R.drawBubblePickup(ctx, px, py, t * 2.4 + pk.bob);
      else if (pk.t === "conch") R.drawConch(ctx, px, py, t);
      else if (pk.t === "feather") R.drawFeather(ctx, px, py, t);
      else if (pk.t === "starprize") R.drawStarPrize(ctx, px, py, t);
      else if (pk.t.indexOf("key_") === 0) R.drawKey(ctx, px, py, t, pk.t.slice(4));
      else if (pk.t === "stone_white") R.drawStone(ctx, px, py, t, "white");
      else if (pk.t === "stone_black") R.drawStone(ctx, px, py, t, "black");
      else R.drawUnknown(ctx, px, py, t, "#9fe4ff", pk.t);
    }
  }

  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawMermaid(x, y, t, vx, facing, onGround, inWater, isSea, invuln, tailSwing, dash, glide, skid) {
    if (invuln > 0 && Math.floor(invuln * 14) % 2 === 0) return;
    const skin = "#f7c8a8";
    const hair = "#ffb3ca";
    const tailC = "#2fb8c8";
    const tailD = "#1c8fa6";
    const dress = "#ff8fa6";

    ctx.save();
    ctx.translate(x, y);
    if (facing < 0) ctx.scale(-1, 1);

    if (glide) {
      const wing = Math.sin(t * 18) * 0.5 + 0.5;
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.lineWidth = 1.5;
      for (let s of [1, -1]) {
        const far = s === -1;
        ctx.save();
        // two simple arches, one per wing, trailing behind her; the far wing
        // rides higher, further back, thinner + dimmer for perspective
        ctx.translate(far ? -13 : -9, (far ? -7 : -1) + wing * 2);
        ctx.rotate(far ? 0.12 : -0.08);
        if (far) { ctx.scale(0.9, 0.9); ctx.globalAlpha = 0.55; }
        ctx.fillStyle = far ? "#e8f1fa" : "#f0f7ff";
        ctx.strokeStyle = far ? "#cfe4f7" : "#dbeaff";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-6, -14, -12, -7);
        ctx.quadraticCurveTo(-15, -3, -17, 7);
        ctx.quadraticCurveTo(-11, 2, 0, 3);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }

    if (tailSwing) {
      ctx.save();
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const r = 8 + i * 8 + ((t * 46) % 8);
        ctx.globalAlpha = 0.85 - i * 0.26;
        ctx.strokeStyle = "#cdf3ff";
        ctx.lineWidth = 2.4 - i * 0.4;
        ctx.beginPath();
        ctx.arc(6, 1, r, -0.85, 0.85);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (isSea) {
      const wave = Math.sin(t * (inWater ? 9 : 6)) * (inWater ? 7 : 4);
      ctx.fillStyle = tailC;
      ctx.beginPath();
      ctx.moveTo(-6, 8);
      ctx.quadraticCurveTo(-7, 12, -2, 18 + wave * 0.6);
      ctx.quadraticCurveTo(-1, 24 + wave, 0, 28 + wave);
      ctx.quadraticCurveTo(1, 24 + wave, 3, 18 + wave * 0.6);
      ctx.quadraticCurveTo(8, 12, 7, 8);
      ctx.fill();
      ctx.fillStyle = tailD;
      ctx.beginPath();
      ctx.moveTo(-1, 26 + wave);
      ctx.lineTo(-9, 30 + wave * 1.2);
      ctx.lineTo(-1, 31 + wave);
      ctx.lineTo(1, 31 + wave);
      ctx.lineTo(9, 30 + wave * 1.2);
      ctx.lineTo(2, 26 + wave);
      ctx.fill();
      ctx.fillStyle = dress;
      ctx.beginPath();
      ctx.moveTo(-7, 8); ctx.lineTo(-4, -2); ctx.lineTo(4, -2); ctx.lineTo(7, 8);
      ctx.fill();
    } else {
      const walking = onGround && Math.abs(vx) > 20;
      const walkT = skid > 0 ? 0 : (walking ? t * 12 : 0);
      const legA = Math.sin(walkT) * 5;
      const legB = Math.sin(walkT + Math.PI) * 5;
      const pantC = "#b3e58f";
      const bootC = dress;
      ctx.save();
      if (skid > 0) ctx.rotate(0.22);
      ctx.fillStyle = pantC;
      ctx.beginPath(); ctx.ellipse(-2, 14 + legA * 0.4, 2.6, 5, legA * 0.09, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(2, 14 + legB * 0.4, 2.6, 5, legB * 0.09, 0, TAU); ctx.fill();
      ctx.fillStyle = bootC;
      ctx.beginPath(); ctx.moveTo(-2, 18 + legA * 0.4); ctx.lineTo(-8, 21 + legA * 0.5); ctx.lineTo(-2, 22 + legA * 0.4); ctx.fill();
      ctx.beginPath(); ctx.moveTo(2, 18 + legB * 0.4); ctx.lineTo(8, 21 + legB * 0.5); ctx.lineTo(2, 22 + legB * 0.4); ctx.fill();
      ctx.fillStyle = dress;
      ctx.beginPath();
      ctx.moveTo(-8, 11); ctx.lineTo(-5, 1); ctx.lineTo(5, 1); ctx.lineTo(8, 11);
      ctx.quadraticCurveTo(6, 13, 5, 12); ctx.lineTo(-5, 12); ctx.quadraticCurveTo(-6, 13, -8, 11); ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = hair;
    ctx.beginPath(); ctx.arc(0, -3, 6.5, 0, TAU); ctx.fill();
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(0, -4, 5, 0, TAU); ctx.fill();
    ctx.fillStyle = hair;
    ctx.beginPath(); ctx.arc(0, -6, 5, Math.PI, 0, false); ctx.fill();
    ctx.fillStyle = "#2a1a2a";
    ctx.beginPath(); ctx.arc(2.2, -4, 0.9, 0, TAU); ctx.fill();
    ctx.fillStyle = inWater ? "#9fe4ff" : "#ffd77a";
    ctx.beginPath();
    ctx.moveTo(-3.4, -6.5); ctx.lineTo(-3.4, -9.5); ctx.lineTo(-1.6, -7.6);
    ctx.lineTo(0, -10.2); ctx.lineTo(1.6, -7.6); ctx.lineTo(3.4, -9.5);
    ctx.lineTo(3.4, -6.5); ctx.fill();
    if (dash > 0) {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(-14, -8, 28, 4);
      ctx.fillRect(-14, 10, 28, 4);
    }
    ctx.restore();
  }


  function drawShockwave(sw, t) {
    const prog = sw.life / sw.max;
    const r = sw.maxR * (1 - prog) + 6;
    const fade = Math.pow(prog, 1.3);
    const cx = sw.x - camX, cy = sw.y - camY;
    ctx.save();
    // Bold at the center, fading as the rings push outward.
    const rings = [
      { frac: 0.26, alpha: 0.95, width: 5.5 },
      { frac: 0.56, alpha: 0.55, width: 2.6 },
      { frac: 0.9, alpha: 0.24, width: 1.4 },
    ];
    for (const g of rings) {
      ctx.globalAlpha = fade * g.alpha;
      ctx.strokeStyle = "rgba(190,235,255,0.95)";
      ctx.lineWidth = g.width;
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(3, r * g.frac), 0, TAU); ctx.stroke();
    }
    ctx.globalAlpha = fade * 0.45;
    ctx.fillStyle = "rgba(190,235,255,0.6)";
    ctx.beginPath(); ctx.arc(cx, cy, Math.max(2.5, r * 0.11), 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawBoss(t) {
    if (!bossActive || !boss) { if (L.def.boss && !bossActive && !dialog) drawBossDoor(t); return; }
    const b = boss;
    ctx.save();
    if (b.flash > 0) ctx.globalAlpha = 0.5;
    if (b.kind === "crabk") {
      R.drawCrabKing(ctx, b.x - camX, b.y - camY, t, b);
    } else {
      const th = L.def.theme;
      const pal = PAL[th];
      for (let i = 7; i >= 0; i--) {
        const bt = boss.t - i * 0.09;
        const sx = b.baseX0 + Math.sin(bt * 0.45) * b.halfW;
        const sy = b.baseY0 + Math.sin(bt * 1.1 + i * 0.3) * b.halfH - camY;
        const r = 13 - i * 1.3;
        ctx.fillStyle = i % 2 ? "#1c5f86" : "#2a7ba8";
        ctx.beginPath(); ctx.arc(sx - camX, sy, r, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath(); ctx.arc(sx - 3 - camX, sy - 3, r * 0.5, 0, TAU); ctx.fill();
      }
      const hx = boss.x - camX, hy = boss.y - camY;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(hx + 10, hy - 6, 3, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(hx + 10, hy + 4, 3, 0, TAU); ctx.fill();
      ctx.fillStyle = "#2a1a2a";
      ctx.beginPath(); ctx.arc(hx + 10, hy - 6, 1.4, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(hx + 10, hy + 4, 1.4, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  function drawBossDoor(t) {
    if (!L.def.boss || !L.def.gates || !L.def.gates[0]) return;
    const gateC = L.def.gates[0].c;
    const x = gateC * TILE - camX;
    if (x < -80 || x > W + 80) return;
    ctx.fillStyle = "rgba(8,20,34,0.75)";
    ctx.fillRect(x, 0, TILE, H);
    ctx.fillStyle = "#ffd77a";
    ctx.font = "700 16px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(FT("world.battleAhead"), x + TILE / 2, 40);
    ctx.beginPath();
    ctx.arc(x + TILE / 2, 60 + Math.sin(t * 2) * 4, 5, 0, TAU);
    ctx.fill();
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(x, H - 90, TILE, 90);
  }

  function drawPuzzle(t) {
    if (!L.doors.length && !L.chests.length) return;
    for (const d of L.doors) {
      if (d.open) continue;
      const x = d.c * TILE - camX;
      if (x < -TILE || x > W + TILE) continue;
      const r0 = d.rows[0], r1 = d.rows[d.rows.length - 1];
      const y0 = r0 * TILE - camY, y1 = (r1 + 1) * TILE - camY;
      const cb = R.KEY_COLORS[d.color] || "#59d7c4";
      ctx.fillStyle = "rgba(16,34,48,0.45)";
      ctx.fillRect(x + 2, y0, TILE - 4, y1 - y0);
      ctx.strokeStyle = cb; ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y0 + 3, TILE - 8, y1 - y0 - 6);
      for (let yy = y0 + 8; yy < y1 - 4; yy += 13) {
        ctx.strokeStyle = cb; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x + 6, yy); ctx.lineTo(x + TILE - 6, yy); ctx.stroke();
      }
      if (d.hint > 0) {
        ctx.font = "700 12px 'Segoe UI', system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = cb;
        ctx.fillText(FT("world.needKey", { color: d.color.toUpperCase() }), x + TILE / 2, r0 * TILE - 12);
        ctx.textAlign = "left";
      }
    }
    for (const c of L.chests) {
      const x = c.x - camX;
      if (x < -40 || x > W + 40) continue;
      R.drawChest(ctx, x, c.y - camY, t, c.open);
    }
  }

  function drawNPCs(t) {
    for (const n of L.npcs) {
      const x = n.x - camX;
      if (x < -160 || x > W + 160) continue;
      const y = n.y - camY;
      if (n.kind === "sign") {
        R.drawSign(ctx, x, y);
        continue;
      }
      const bob = (n.kind === "elder" || n.kind === "kid") ? 0 : Math.sin(t * 1.6 + n.x) * 2;
      ctx.save();
      ctx.translate(x, y + bob);
      if (n.face < 0) ctx.scale(-1, 1);
      if (n.kind === "turtle") {
        ctx.fillStyle = "#5f9a4e";
        ctx.beginPath(); ctx.ellipse(0, 6, 12, 10, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#7fb86a";
        ctx.beginPath(); ctx.ellipse(0, 5, 9, 7, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#3f7030";
        ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(2.5, -1.5, 2, 0, TAU); ctx.fill();
        ctx.fillStyle = "#2a1a2a";
        ctx.beginPath(); ctx.arc(3, -1.5, 1, 0, TAU); ctx.fill();
      } else if (n.kind === "vendor") {
        R.drawVendor(ctx, 0, 0, t);
      } else if (n.kind === "elder" || n.kind === "kid") {
        const moving = n.act === "walk";
        const fps = moving ? 10 : 8;
        const im = getSprite("otter", moving ? "run" : "idle", Math.floor((n.animT || t) * fps));
        if (im) {
          const dw = n.kind === "kid" ? 80 : 104;
          const destY = 38 - dw * 0.795;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(im, -dw / 2, destY, dw, dw);
          ctx.imageSmoothingEnabled = true;
        }
      } else {
        R.drawUnknown(ctx, 0, 0, t, "#ffe08a", n.kind);
      }
      ctx.restore();
      if (player.nearNPC === n && !dialog) {
        ctx.font = "600 13px 'Segoe UI', system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillText(FT("world.talk"), x, y - 56);
        ctx.textAlign = "left";
      }
    }
  }

  function drawBossBar(t) {
    if (!bossActive || !boss || bossDead) return;
    const bw = 400, bx = (W - bw) / 2, by = 24;
    ctx.fillStyle = "rgba(8,20,34,0.6)";
    rr(bx, by, bw, 22, 6); ctx.fill();
    const frac = clamp(boss.hp / boss.maxhp, 0, 1);
    ctx.fillStyle = "#ff5d7e";
    if (frac > 0.01) { rr(bx + 3, by + 3, (bw - 6) * frac, 16, 5); ctx.fill(); }
    ctx.font = "700 13px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(L.def.boss.name.toUpperCase(), W / 2, by - 14);
    ctx.textAlign = "left";
  }

  function drawHUD(t) {
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "700 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "rgba(8,20,34,0.55)";
    rr(12, 12, 300, 50, 8); ctx.fill();
    for (let i = 0; i < player.maxHearts; i++) {
      const hx = 24 + i * 24;
      ctx.fillStyle = i < player.hearts ? "#ff5d7e" : "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.moveTo(hx, 24);
      ctx.bezierCurveTo(hx - 8, 17, hx - 10, 27, hx, 32);
      ctx.bezierCurveTo(hx + 10, 27, hx + 8, 17, hx, 24);
      ctx.fill();
    }

    ctx.font = "600 14px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(player.form === "sea" ? "SEA" : "LAND", 150, 18);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(L.def.name, 190, 18);

    let abx = 150, aby = 36;
    const ab = [
      { on: true, ch: "X", name: "TAIL" },
      { on: save.abilities.jump, ch: "SPACE", name: "LEAP" },
      { on: save.abilities.bolt, ch: "X WATER", name: "BOLT" },
      { on: player.feather, ch: "SPACE", name: "GLIDE" },
    ];
    ctx.font = "600 12px 'Segoe UI', system-ui, sans-serif";
    for (const a of ab) {
      ctx.fillStyle = a.on ? "#9fe4ff" : "rgba(255,255,255,0.28)";
      ctx.fillText(a.name, abx, aby);
      abx += ctx.measureText(a.name).width + 18;
    }
    // right-side stack: KEYS / STONES / TIX (labels above, icons below)
    let ry = 14;
    if (player.keys.length) {
      ctx.font = "600 11px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.fillText(FT("world.keys"), W - 14, ry);
      let kx = W - 18;
      for (const k of player.keys) {
        R.drawKey(ctx, kx, ry + 19, t, k);
        kx -= 20;
      }
      ry += 40;
    }
    if (save.stones.white || save.stones.black) {
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "600 11px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(FT("world.stones"), W - 14, ry);
      let sx = W - 18;
      if (save.stones.white) { R.drawStone(ctx, sx, ry + 19, t, "white"); sx -= 20; }
      if (save.stones.black) { R.drawStone(ctx, sx, ry + 19, t, "black"); }
      ry += 40;
    }
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = "600 11px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(FT("world.tix"), W - 14, ry);
    ctx.fillStyle = "#fff3c4";
    ctx.font = "700 18px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(player.tix, W - 34, ry + 12);
    R.drawTicket(ctx, W - 17, ry + 22, t, "yellow");
    ctx.textAlign = "left";

    if (player.inWater && player.form === "land") {
      const bx = 12, by = 66, bw = 250;
      ctx.fillStyle = "rgba(8,20,34,0.55)";
      rr(bx, by, bw, 18, 9); ctx.fill();
      const frac = clamp(player.air / 100, 0, 1);
      ctx.fillStyle = frac > 0.4 ? "#66e0ff" : "#ff6b7a";
      if (frac > 0.01) { rr(bx + 2, by + 2, (bw - 4) * frac, 14, 7); ctx.fill(); }
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "700 12px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(FT("world.air"), bx + bw / 2, by + 3);
      ctx.textAlign = "left";
    }

    if (debugShow) {
      ctx.textAlign = "left";
      ctx.font = "700 13px monospace";
      ctx.fillStyle = "rgba(8,20,34,0.7)";
      rr(12, 88, 330, 4 + 14 * 10, 6); ctx.fill();
      const lines = [
        `feather=${player.feather}  glide=${player.glide}`,
        `onGround=${player.onGround}  inW=${player.inWater}  form=${player.form}`,
        `jumpHeld=${input.jumpHeld}  vy=${player.vy.toFixed(1)}`,
        `dashT=${player.dashT.toFixed(2)}  dashCd=${player.dashCd.toFixed(2)}`,
        `starT=${player.starT.toFixed(2)}  invuln=${player.invuln.toFixed(2)}`,
        `hearts=${player.hearts}  air=${player.air.toFixed(0)}`,
        `glide can fire: ${player.feather && !player.onGround && input.jumpHeld && player.vy > 20}`,
      ];
      ctx.fillStyle = "#9fe4ff";
      let yy = 94;
      for (const ln of lines) { ctx.fillText(ln, 18, yy); yy += 14; }
      ctx.fillStyle = "rgba(255,220,150,0.95)";
      for (const ln of dbgLog) { ctx.fillText(ln, 18, yy); yy += 14; }
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText("P: hide debug", 18, yy);
    }

    if (player.nearNPC && !dialog) {
      ctx.font = "600 15px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(FT("dialog.speak"), W / 2, H - 40);
      ctx.textAlign = "left";
    }
    ctx.restore();
  }

  let onAbilitiesShow = true;

  function drawDialog(t) {
    if (!dialog) return;
    ctx.fillStyle = "rgba(6,12,24,0.55)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(10,24,40,0.94)";
    rr(20, H - 200, W - 40, 170, 12); ctx.fill();
    ctx.strokeStyle = "rgba(120,190,220,0.6)"; ctx.lineWidth = 2;
    rr(20, H - 200, W - 40, 170, 12); ctx.stroke();

    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.font = "700 18px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#ffd77a";
    ctx.fillText(dialog.npc.name, 40, H - 186);

    if (dialog.shop) {
      ctx.font = "600 15px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      SHOP_ITEMS.forEach((it, i) => {
        const y = H - 158 + i * 26;
        ctx.fillStyle = i === dialog.cursor ? "#ffd77a" : "rgba(255,255,255,0.85)";
        ctx.fillStyle = i === dialog.cursor ? "#ffe9b0" : "rgba(255,255,255,0.75)";
        const afford = player.tix >= it.cost && it.ok();
        ctx.fillStyle = !afford ? "rgba(255,120,120,0.9)" : ctx.fillStyle;
        ctx.fillText((i === dialog.cursor ? "> " : "  ") + FT("shop.items." + i + ".name") + "   " + it.cost + " tix", 44, y);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText(FT("dialog.tix", { tix: player.tix }), 600, H - 186);
      });
      ctx.font = "600 13px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(FT("dialog.buy"), 44, H - 42);
    } else {
      const line = dialog.npc.lines[dialog.line];
      ctx.font = "600 17px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      let cy = H - 154;
      const words = line.split(" ");
      let cur = "";
      for (const word of words) {
        const test = cur ? cur + " " + word : word;
        if (ctx.measureText(test).width > 760 && cur) { ctx.fillText(cur, 40, cy); cur = word; cy += 26; }
        else cur = test;
      }
      if (cur) ctx.fillText(cur, 40, cy);
      ctx.font = "600 13px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = Math.floor(t * 2) % 2 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)";
      ctx.fillText(FT("dialog.next"), W - 60, H - 40);
    }
    ctx.textAlign = "left";
  }

  function drawTitle(t) {
    drawBackground(t);
    ctx.fillStyle = "rgba(8,22,38,0.68)";
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.font = "800 64px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#9fe4ff";
    ctx.fillText(FT("title.name"), W / 2, 84);
    ctx.font = "400 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#ffb3ca";
    ctx.fillText(FT("title.subtitle"), W / 2, 128);

    ctx.font = "400 17px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "rgba(230,245,255,0.9)";
    const lines = FL("title.lore");
    lines.forEach((l, i) => ctx.fillText(l, W / 2, 156 + i * 22));

    drawMermaid(W / 2, 298, t * 1.2, 0, 1, false, true, true, 0, false, 0);

    ctx.font = "500 14px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "rgba(220,240,255,0.75)";
    const ctrl = FL("title.ctrl");
    ctrl.forEach((l, i) => ctx.fillText(l, W / 2, 380 + i * 18));

    const has = save.unlocked > 0 || save.cleared[0];
    if (titleConfirm) {
      ctx.fillStyle = "rgba(6,12,24,0.72)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(10,24,40,0.96)";
      rr(W / 2 - 230, 330, 460, 120, 12); ctx.fill();
      ctx.strokeStyle = "rgba(255,140,150,0.7)"; ctx.lineWidth = 2;
      rr(W / 2 - 230, 330, 460, 120, 12); ctx.stroke();
      ctx.textAlign = "center";
      ctx.font = "700 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "#ffd77a";
      ctx.fillText(FT("title.confirmAsk"), W / 2, 366);
      ctx.font = "500 16px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(FT("title.confirmWarn"), W / 2, 396);
      ctx.fillStyle = Math.floor(t * 2) % 2 ? "#ffe08a" : "rgba(255,255,255,0.6)";
      ctx.font = "600 17px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(FT("title.confirmKeys"), W / 2, 428);
    } else {
      const options = has ? [FT("title.optContinue"), FT("title.optNew"), FT("title.optSong")] : [FT("title.optNew"), FT("title.optSong")];
      const songOpt = options.length - 1;
      const cursorBlink = Math.floor(t * 2) % 2 ? 1 : 0.4;
      options.forEach((o, i) => {
        const selected = i === titleChoice;
        let label = o, songRow = false;
        if (i === songOpt) { label = WBAudio.titleSong().label; songRow = true; }
        ctx.font = "600 20px 'Segoe UI', system-ui, sans-serif";
        ctx.fillStyle = selected ? "#ffd77a" : "rgba(235,245,255,0.85)";
        ctx.fillText(label, W / 2, 446 + i * 26);
        const w = ctx.measureText(label).width;
        if (songRow) {
          // filled eighth notes facing outward: left head stems up, right head stems down
          const ny = 446 + i * 26 - 6.5, col = ctx.fillStyle;
          ctx.lineWidth = 1.9;
          for (const s of [-1, 1]) {
            const nx = W / 2 + s * (w / 2 + 15);
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.ellipse(nx, ny, 5.2, 3.9, -0.3, 0, TAU); ctx.fill();
            const sx = nx + (s < 0 ? -4.7 : 4.7);
            ctx.strokeStyle = col;
            ctx.beginPath(); ctx.moveTo(sx, ny); ctx.lineTo(sx, ny + (s < 0 ? -16 : 16)); ctx.stroke();
          }
        }
        if (selected) {
          ctx.fillStyle = `rgba(255,215,122,${cursorBlink})`;
          ctx.beginPath(); ctx.arc(W / 2 - w / 2 - (songRow ? 34 : 16), 442 + i * 26, 5, 0, TAU); ctx.fill();
        }
      });
      ctx.font = "500 13px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = Math.floor(t * 2) % 2 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)";
      ctx.fillText(FT("title.hint"), W / 2, 518);
      ctx.font = "400 11px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(FT("title.foot"), W / 2, 534);
    }
  }

  function drawSEL(t) {
    drawBackground(t);
    ctx.fillStyle = "rgba(6,14,26,0.88)";
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.font = "800 44px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "#9fe4ff";
    ctx.fillText(FT("voyages.heading"), W / 2, 70);
    ctx.font = "600 18px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillText(FT("voyages.hint"), W / 2, 110);
    if (selTest) {
      ctx.font = "700 16px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "#ff9fb8";
      ctx.fillText(FT("voyages.test"), W / 2, 134);
    }
    const lineH = 58, listTop = 150, listBot = 500;
    const visCount = Math.max(1, Math.floor((listBot - listTop) / lineH));
    const canScroll = levels.length > visCount;
    const offset = canScroll ? clamp(selIndex - (visCount >> 1), 0, levels.length - visCount) : 0;
    levels.forEach((lv, i) => {
      const row = i - offset;
      if (row < 0 || row >= visCount) return;
      const y = listTop + row * lineH + 10;
      const unlocked = selTest || i <= save.unlocked;
      const cleared = !!save.cleared[i];
      ctx.fillStyle = i === selIndex && unlocked ? "#ffd77a" : unlocked ? "rgba(235,245,255,0.95)" : "rgba(255,255,255,0.25)";
      ctx.font = "700 20px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(lv.name, W / 2, y);
      if (i === selIndex && unlocked) {
        ctx.fillStyle = "rgba(160,220,255,0.9)";
        ctx.beginPath(); ctx.arc(W / 2 - 170, y - 6, 5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(W / 2 + 170, y - 6, 5, 0, TAU); ctx.fill();
      }
      if (cleared) {
        ctx.fillStyle = "#7fe3a0";
        ctx.font = "700 14px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(FT("voyages.cleared"), W / 2 + 150, y - 18);
      }
      if (L && lv.boss) {
        ctx.fillStyle = "rgba(255,110,120,0.9)";
        ctx.font = "700 13px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(FT("voyages.boss"), W / 2 - 140, y - 18);
      }
    });
    if (canScroll) {
      const trackH = listBot - listTop;
      const barH = Math.max(30, trackH * visCount / levels.length);
      const barY = listTop + (trackH - barH) * offset / (levels.length - visCount);
      ctx.fillStyle = "rgba(159,228,255,0.18)";
      ctx.fillRect(W - 20, listTop, 5, trackH);
      ctx.fillStyle = "rgba(159,228,255,0.75)";
      ctx.fillRect(W - 20, barY, 5, barH);
    }
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "500 14px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(FT("voyages.tix", { tix: save.tix }), W / 2, 508);
  }

  const CON_KEYS_EN = ["crab", "crabj", "star", "jelly", "eel", "boss"];
  const CON_KEYS_IT = ["ticket", "bubble", "conch", "feather", "starprize", "key", "stone_white", "stone_black"];

  function congratsRows() {
    const rows = [];
    const s = levelStats;
    for (const k of CON_KEYS_EN) {
      const n = s.enemies[k] || 0;
      if (n > 0) rows.push({ label: FT("congrats.en." + k), n });
    }
    const items = {};
    for (const k of Object.keys(s.items)) {
      if (k.indexOf("key_") === 0) items.key = (items.key || 0) + s.items[k];
      else items[k] = (items[k] || 0) + s.items[k];
    }
    for (const k of CON_KEYS_IT) {
      const n = items[k] || 0;
      if (n > 0) rows.push({ label: FT("congrats.it." + k), n });
    }
    return rows;
  }

  function drawCongrats(t) {
    ctx.fillStyle = `rgba(0,0,0,${Math.min(1, stateTimer / 0.45)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffe08a";
    ctx.font = "800 46px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(FT("congrats.heading"), W / 2, 110);
    ctx.fillStyle = "#9fe4ff";
    ctx.font = "400 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(L.def.name, W / 2, 150);
    const rows = congratsRows();
    const TICK = 0.09;
    let acc = 0.7;
    if (!rows.length) {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "600 22px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(FT("congrats.none"), W / 2, 240);
      congratsTotalT = 1.6;
    } else {
      let y = 205;
      const maxShown = rows.length - 1;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const t0 = acc;
        const countDur = TICK * (row.n + 1); // include a frame where the final value itself ticks
        acc = t0 + Math.max(0.5, countDur) + 0.25;
        if (stateTimer >= t0) {
          const el = stateTimer - t0;
          let v, counting;
          if (el < countDur) { v = Math.min(row.n, Math.floor(el / TICK + 1e-9)); counting = true; }
          else { v = row.n; counting = false; } // hold phase: no sfx, just the settled number
          if (counting) {
            const key = i + ":" + v;
            if (key !== congratsSfxKey) {
              if (v > 0) WBAudio.playSfx("roulette", { rate: 1 + Math.min(1, v / 12) * 0.6 });
              congratsSfxKey = key;
            }
          } else if (i === maxShown && congratsSfxKey.indexOf(i + ":") !== 0) {
            congratsSfxKey = i + ":" + v; // keep tracker honest so the NEXT row ticks fresh
          }
          ctx.font = "600 21px 'Segoe UI', system-ui, sans-serif";
          ctx.textAlign = "right";
          ctx.fillStyle = "#9fb8cc";
          ctx.fillText(row.label, W / 2 - 30, y);
          ctx.textAlign = "left";
          ctx.fillStyle = "#ffd77a";
          ctx.fillText(String(v), W / 2 + 30, y);
        }
        y += 32;
      }
      congratsTotalT = acc + 0.3;
    }
    if (stateTimer >= congratsTotalT) {
      ctx.textAlign = "center";
      ctx.fillStyle = Math.floor(t * 2) % 2 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)";
      ctx.font = "600 20px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(FT("congrats.cont"), W / 2, H - 70);
    }
  }

  function drawDying(t) {
    ctx.fillStyle = `rgba(8,16,30,${Math.min(1, stateTimer / 1.2)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "600 24px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(FT("death.line"), W / 2, H / 2);
  }

  function drawFinal(t) {
    ctx.fillStyle = `rgba(8,22,38,${Math.min(1, stateTimer / 1.0)})`;
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffe08a";
    ctx.font = "800 54px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(FT("final.heading"), W / 2, 140);
    const tagFont = "400 24px 'Segoe UI', system-ui, sans-serif";
    const tagLines = wrapFit(FT("final.tagline"), tagFont, 840);
    ctx.fillStyle = "#9fe4ff";
    ctx.font = tagFont;
    let y = 195;
    for (const line of tagLines) { ctx.fillText(line, W / 2, y); y += 32; }
    const totalTix = save.tix;
    const maxH = save.maxHearts;
    const statsY = Math.max(280, y + 14);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "600 20px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(FT("final.stats", { score: player.score, tix: totalTix, hearts: maxH }), W / 2, statsY);
    ctx.fillStyle = "rgba(190,220,240,0.8)";
    ctx.font = "400 18px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(FT("final.thanks"), W / 2, statsY + 44);
    ctx.fillStyle = Math.floor(t * 2) % 2 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)";
    ctx.font = "600 20px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText(FT("final.cont"), W / 2, 430);
  }

  function drawToasts(t) {
    if (toastT > 0) {
      ctx.textAlign = "center";
      ctx.font = "700 20px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = `rgba(255,215,120,${Math.min(1, toastT)})`;
      ctx.fillText(toast, W / 2, 80);
    }
    if (bannerT > 0) {
      ctx.textAlign = "center";
      ctx.font = "800 34px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = `rgba(255,215,120,${Math.min(1, bannerT)})`;
      ctx.fillText(banner, W / 2, 140);
    }
  }

  function drawParticles(dt) {
    for (const p of particles) {
      const a = Math.min(1, p.life / (p.max * 0.5));
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color || "#fff";
      ctx.beginPath();
      ctx.arc(p.x - camX, p.y - camY, p.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  let lastT = performance.now();

  function frame(now) {
    const dt = clamp((now - lastT) / 1000, 0, 1 / 30);
    lastT = now;
    const t = now / 1000;
    syncInput();

    if (state === STATE.TITLE) {
      const punch = input.enter && !input.prevEnter;
      const tab = input.switchReq;
      if (titleConfirm) {
        if (punch) startNewGame();
        if (tab) titleConfirm = false;
      } else {
        const has = save.unlocked > 0 || save.cleared[0];
        const songOpt = has ? 2 : 1;
        if (input.up && !input.upPrev) { const n = (titleChoice + songOpt) % (songOpt + 1); if (n !== titleChoice) WBAudio.playSfx("select", { vol: 0.5 }); titleChoice = n; }
        if (input.down && !input.downPrev) { const n = (titleChoice + 1) % (songOpt + 1); if (n !== titleChoice) WBAudio.playSfx("select", { vol: 0.5 }); titleChoice = n; }
        if (titleChoice === songOpt) {
          if ((input.left && !input.leftPrev) || (input.right && !input.rightPrev)) {
            WBAudio.titleStep(input.right && !input.rightPrev ? 1 : -1);
            WBAudio.playSfx("select", { vol: 0.6 });
          }
          if (punch) { WBAudio.retrigger(); WBAudio.playSfx("select"); input.enter = false; }
        } else if (punch) {
          if (titleChoice === 1 || !has) {
            if (has) titleConfirm = true;
            else startNewGame();
          } else {
            selShow = true; state = STATE.SEL; selIndex = clamp(save.unlocked, 0, levels.length - 1);
            WBAudio.playSfx("select");
          }
          input.enter = false;
        }
        if (tab) { selShow = true; state = STATE.SEL; selIndex = clamp(save.unlocked, 0, levels.length - 1); WBAudio.playSfx("select"); }
        if (input.testReq) { selShow = true; selTest = true; state = STATE.SEL; selIndex = clamp(currentLevel, 0, levels.length - 1); WBAudio.playSfx("select"); }
      }
      input.switchReq = false;
      input.upPrev = input.up;
      input.downPrev = input.down;
      input.leftPrev = input.left;
      input.rightPrev = input.right;
      input.prevEnter = input.enter;
    } else if (state === STATE.SEL) {
      const tab = input.switchReq;
      const p = input.enter && !input.prevEnter;
      if (input.up && !input.upPrev) selIndex = Math.max(0, selIndex - 1);
      if (input.down && !input.downPrev) { selIndex = Math.min(levels.length - 1, selIndex + 1); if (!selTest && selIndex > save.unlocked) selIndex = save.unlocked; }
      if (p && (selTest || selIndex <= save.unlocked)) { currentLevel = selIndex; loadLevel(selIndex, true); state = STATE.PLAY; input.enter = false; selTest = false; }
      if (tab) { state = STATE.TITLE; selShow = false; selTest = false; titleChoice = 0; WBAudio.playSfx("back"); WBAudio.playTitle(); }
      input.switchReq = false;
      input.upPrev = input.up;
      input.downPrev = input.down;
    } else if (state === STATE.PLAY) {
      if (!paused) {
        if (dialog) updateDialog(dt);
        else updateGame(dt);
      }
      // Gamepad START: pause when wandering, unpause when paused,
      // and defer to talking/confirming whenever a dialog is open or an NPC is near.
      if (input.padEnter) {
        if (paused) setPaused(false);
        else if (!dialog && !player.nearNPC && state === STATE.PLAY) setPaused(true);
      }
      if (state === STATE.CONGRATS) { stateTimer = 0; congratsPrevJump = true; }
    } else if (state === STATE.DYING) {
      stateTimer += dt;
      if (stateTimer > 2.4) { resetLevel(); state = STATE.PLAY; }
    } else if (state === STATE.CONGRATS) {
      stateTimer += dt;
      const enterP = input.enter && !input.prevEnter;
      const aP = input.jump && !congratsPrevJump;
      congratsPrevJump = input.jump;
      if ((enterP || aP) && stateTimer > 0.5) {
        if (stateTimer < congratsTotalT) {
          stateTimer = congratsTotalT; // skip: reveal all counts + continue hint
        } else if (currentLevel + 1 < levels.length) {
          currentLevel++; loadLevel(currentLevel, true, true); state = STATE.PLAY;
        } else { state = STATE.FINAL; stateTimer = 0; WBAudio.playFinalMusic(); }
        input.enter = false;
        input.switchReq = false;
      }
    } else if (state === STATE.FINAL) {
      stateTimer += dt;
      const p = input.enter && !input.prevEnter;
      if (p) {
        state = STATE.TITLE; titleChoice = 0; titleConfirm = false; WBAudio.playTitle();
        input.enter = false;
        input.switchReq = false;
      }
    }

    if (state === STATE.PLAY && !dialog) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.rise) p.vy = lerp(p.vy, -26, Math.min(1, 0.12 * dt * 60));
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    if (toastT > 0) toastT -= dt;
    if (bannerT > 0) bannerT -= dt;
    if (shakeT > 0) shakeT -= dt;
    if (levelIntroT > 0) levelIntroT -= dt;

    const shx = shakeT > 0 ? (Math.random() - 0.5) * 10 : 0;
    ctx.save();
    ctx.translate(shx, 0);

    drawBackground(t);

    if (state === STATE.TITLE) drawTitle(t);
    else if (state === STATE.SEL) drawSEL(t);
    else if (state === STATE.FINAL) drawFinal(t);
    else if (state === STATE.CONGRATS) drawCongrats(t);
    else {
      drawLevel(t);
      drawDeco(t);
      drawPuzzle(t);
      drawGoal(t);
      drawSave(t);
      drawPickups(t);
      for (const e of L.enemies) {
        if (e.dead || e.hidden) continue;
        const ex = e.x - camX, ey = e.y - camY;
        if (ex < -80 || ex > W + 80 || ey < -80 || ey > H + 80) continue;
        const flipped = e.flipT > 0 || e.flipShakeT > 0;
        ctx.save();
        if (flipped) {
          const cx = ex + (e.w || TILE) / 2, cy = ey + (e.h || TILE) / 2;
          ctx.translate(cx, cy);
          const shake = e.flipShakeT > 0 ? Math.sin(t * 40) * 0.18 : 0;
          ctx.rotate(Math.PI + shake);
          ctx.translate(-cx, -cy);
        }
        if (e.t === "crab" || e.t === "crabj") R.drawCrab(ctx, ex, ey, t, e.vx, e.t === "crabj");
        else if (e.t === "star") R.drawStar(ctx, e, ex, ey, t);
        else if (e.t === "jelly") R.drawJelly(ctx, e.x + (e.w || TILE) / 2 - camX, e.y + (e.h || TILE) / 2 - camY, t);
        else if (e.t === "eel") R.drawEel(ctx, e.x + (e.w || TILE) / 2 - camX, e.y + (e.h || TILE) / 2 - camY, t, Math.sign(e.vx) || 1);
        else R.drawUnknown(ctx, e.x + (e.w || TILE) / 2 - camX, e.y + (e.h || TILE) / 2 - camY, t, "#ff7b9c", e.t);
        ctx.restore();
      }
      drawNPCs(t);
      drawBoss(t);
      for (const b of bolts) R.drawBP(ctx, b.x - camX, b.y - camY);
      for (const sw of shockwaves) drawShockwave(sw, t);
      const dashing = player.dashT > 0;
      drawMermaid(player.x + player.w / 2 - camX, player.y + 8 - camY, t + player.animT,
        player.vx, player.facing, player.onGround, player.inWater,
        player.form === "sea", player.invuln, player.tailT > 0.12, dashing ? 1 : 0, player.glide ? 1 : 0, player.skid ? 1 : 0);
      if (player.starT > 0) {
        ctx.fillStyle = `rgba(255,225,140,${0.25 + Math.sin(t * 8) * 0.15})`;
        ctx.beginPath(); ctx.arc(player.x + player.w / 2 - camX, player.y + 14 - camY, 22, 0, TAU); ctx.fill();
      }
      drawParticles(dt);
      drawBossBar(t);
      drawHUD(t);
      if (levelIntroT > 0) {
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, levelIntroT * 2)})`;
        ctx.font = "700 26px 'Segoe UI', system-ui, sans-serif";
        ctx.fillText(lvlIntroText, W / 2, 120);
        ctx.font = "500 15px 'Segoe UI', system-ui, sans-serif";
        ctx.fillStyle = "rgba(190,220,240,0.85)";
        ctx.fillText(FT("world.levelIntro"), W / 2, 150);
        ctx.textAlign = "left";
      }
      if (toastT > 0) drawToasts(t);
      if (bannerT > 0) drawToasts(t);
      if (state === STATE.DYING) drawDying(t);
      if (dialog) drawDialog(t);
    }

    ctx.restore();

    input.prevEnter = input.enter;
    input.runWas = input.run;
    input.tailWas = input.tail;

    requestAnimationFrame(frame);
  }

  globalThis.__wavebound = { player, save, state: () => state, setState: (s) => (state = s), levels, frame, getL: () => L, resetLevel, loadLevel, constants: { TILE, W, H }, STATE, cam: () => ({ x: camX, y: camY }), title: () => ({ choice: titleChoice, confirm: titleConfirm }), persist, camSet: (x, y) => { camX = x; camY = y; }, openChest, getBossState: () => ({ active: bossActive, dead: bossDead, boss: boss ? { kind: boss.kind, hp: boss.hp, x: boss.x, y: boss.y, state: boss.state } : null }), hooks: { doSwitch, startDash, startTail, hitBoss, hurtPlayer, spawnBoss, buyShopItem, openDialog, input, getDialog: () => dialog ? { npc: dialog.npc.kind, line: dialog.line, shop: dialog.shop, cursor: dialog.cursor } : null } };

  loadLevel(0, true);
  // audio options panel wiring
  (function () {
    const vm = document.getElementById("vol-music");
    const vs = document.getElementById("vol-sfx");
    if (!vm || !vs) return;
    vm.addEventListener("input", () => {
      WBAudio.setVolume("music", vm.value / 100);
      document.getElementById("vol-music-val").textContent = vm.value + "%";
    });
    vs.addEventListener("input", () => {
      WBAudio.setVolume("sfx", vs.value / 100);
      document.getElementById("vol-sfx-val").textContent = vs.value + "%";
    });
    const btn = document.getElementById("btn-unpause");
    if (btn) btn.addEventListener("click", () => setPaused(false));
  })();

  WBAudio.playTitle();

  requestAnimationFrame(frame);
})();