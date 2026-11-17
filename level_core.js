(() => {
  "use strict";

  const TILE = 30;
  const ROWS = 36;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const TAU = Math.PI * 2;

  function build(def) {
    const COLS = def.cols;
    const solid = [], plat = [], wat = [], topSurface = [], climb = [], cloud = [];
    for (let r = 0; r < ROWS; r++) {
      solid.push(new Uint8Array(COLS));
      plat.push(new Uint8Array(COLS));
      wat.push(new Uint8Array(COLS));
      climb.push(new Uint8Array(COLS));
      cloud.push(new Uint8Array(COLS));
    }
    const levelObj = { gates: [], doors: [], currents: [], updrafts: [], shade: [] };
    const g = {
      offset: 0,
      ground: (top, x0, x1, bot = ROWS - 1) => {
        x0 += g.offset; x1 += g.offset;
        for (let r = Math.max(0, top); r <= Math.min(ROWS - 1, bot); r++)
          for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) solid[r][c] = 1;
        for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) topSurface.push([c, top]);
      },
      platform: (row, x0, x1) => { x0 += g.offset; x1 += g.offset; for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) plat[row][c] = 1; },
      water: (x0, x1, top) => { x0 += g.offset; x1 += g.offset; for (let r = Math.max(0, top); r < ROWS; r++) for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) wat[r][c] = 1; },
      pool: (x0, x1, top, depth = 2) => {
        // Shallow puddle: solid bed at top+depth with water filling down to it.
        // Water is capped, so the player can always wade out.
        x0 += g.offset; x1 += g.offset;
        const bed = Math.min(ROWS - 2, top + depth);
        for (let r = Math.max(0, top); r < ROWS; r++)
          for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) wat[r][c] = 1;
        for (let r = bed; r < ROWS; r++)
          for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) solid[r][c] = 1;
        for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) topSurface.push([c, bed]);
      },
      current: (x0, x1, r0, r1, dx, dy) => { x0 += g.offset; x1 += g.offset; levelObj.currents.push({ c0: Math.max(0, x0), c1: Math.min(COLS - 1, x1), r0: Math.max(0, r0), r1: Math.min(ROWS - 1, r1), dx, dy }); },
      wind: (x0, x1, r0, r1, lift) => {
        x0 += g.offset; x1 += g.offset;
        let floorR = -1;
        for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) {
          for (let r = Math.min(ROWS - 1, r1 + 1); r < ROWS; r++) {
            if (solid[r][c] || plat[r][c]) { if (floorR < 0 || r < floorR) floorR = r; break; }
          }
        }
        const floorY = floorR > 0 ? floorR * TILE : (r1 + 3) * TILE;
        levelObj.updrafts.push({ c0: Math.max(0, x0), c1: Math.min(COLS - 1, x1), r0: Math.max(0, r0), r1: Math.min(ROWS - 1, r1), lift, floorY });
      },
      cliff: (c, r0, r1) => { c += g.offset; for (let r = Math.max(0, r0); r <= Math.min(ROWS - 1, r1); r++) { solid[r][c] = 1; climb[r][c] = 1; } },
      cloud: (row, x0, x1) => { x0 += g.offset; x1 += g.offset; for (let c = Math.max(0, x0); c <= Math.min(COLS - 1, x1); c++) { plat[row][c] = 1; cloud[row][c] = 1; } },
      door: (c, r0, r1, color = "red") => {
        c += g.offset;
        const rows = [];
        for (let r = Math.max(0, r0); r <= Math.min(ROWS - 1, r1); r++) { solid[r][c] = 1; rows.push(r); }
        levelObj.doors.push({ c, rows, color, open: false, hit: false });
      },
      shade: (x0, x1, r0, r1) => { x0 += g.offset; x1 += g.offset; levelObj.shade.push({ c0: Math.max(0, x0), c1: Math.min(COLS - 1, x1), r0: Math.max(0, r0), r1: Math.min(ROWS - 1, r1) }); },
    };
    if (def.build) def.build(g);
    if (def.gates) {
      for (const gate of def.gates) {
        const rows = [];
        for (let r = gate.r0; r < ROWS; r++) {
          if (!solid[r][gate.c]) { solid[r][gate.c] = 1; rows.push(r); }
        }
        levelObj.gates.push({ c: gate.c, rows });
      }
    }
    const pickups = (def.picks || []).map((p) => ({ t: p[0], c: p[1], r: p[2], got: false, bob: Math.random() * TAU }));
    const enemies = (def.baddies || []).map((b) => {
      const o = { t: b[0], c: b[1], r: b[2], hp: 2, stun: 0, dead: false, deadT: 0, wigg: Math.random() * TAU, hitSwing: 0 };
      o.x = b[1] * TILE; o.y = b[2] * TILE;
      if (o.t === "crab") { o.vx = 60; o.w = TILE - 6; o.h = TILE - 6; o.baseY = o.y; }
      if (o.t === "crabj") {
        o.vx = 55; o.w = TILE - 6; o.h = TILE - 6; o.baseY = o.y; o.vy = 0; o.grounded = true; o.hopT = Math.random() * 1.2; o.green = true;
        o.baseC = o.c; o.cycleT = 1 + Math.random() * 2;
        let top = -1;
        for (let r = o.r; r < ROWS; r++) { if (solid[r][o.c] || plat[r][o.c]) { top = r * TILE; break; } }
        o.surfY = top;
        if (top < 0) { o.phase = "active"; o.hidden = false; o.cycleT = 2 + Math.random() * 2; }
        else { o.phase = "buried"; o.hidden = true; o.y = top - o.h + TILE * 1.4; }
      }
      if (o.t === "star") { o.vx = 55; o.w = TILE - 8; o.h = TILE - 8; o.baseY = o.y; }
      if (o.t === "jelly") { o.w = 20; o.h = 24; o.baseX = o.x + TILE / 2; o.baseY = o.y; }
      if (o.t === "eel") { o.vx = 50; o.w = 26; o.h = 16; o.baseY = o.y; }
      return o;
    });
    const npcs = (def.npcs || []).map((n) => {
      const fov = ((globalThis.WAVEBOUND_FLAVOR || {}).npcs || {})[def.name + ":" + n.name] || {};
      const o = { x: n.c * TILE + TILE / 2, y: (n.r - 1) * TILE - 8, kind: n.t, name: fov.name || n.name, face: n.face || -1, lines: fov.lines || n.lines, trade: !!n.trade, quest: n.quest || null };
      if (n.t === "elder" || n.t === "kid") {
        o.homeX = o.x;
        o.row = n.r;
        o.vx = 0;
        o.act = "idle";
        o.actT = 0.4 + Math.random() * 1.2;
        o.animT = Math.random();
        o.speed = n.t === "kid" ? 58 : 38;
      }
      return o;
    });
    const chests = (def.chests || []).map((c) => {
      const o = { c: c.c, r: c.r, reward: c.reward, open: false };
      o.x = c.c * TILE + TILE / 2; o.y = c.r * TILE;
      return o;
    });

    const surf = new Int16Array(COLS).fill(-1);
    for (let c = 0; c < COLS; c++)
      for (let r = 0; r < ROWS; r++)
        if (wat[r][c]) { surf[c] = r; break; }

    return { def, COLS, solid, plat, wat, topSurface, climb, cloud, pickups, enemies, npcs, chests, levelW: COLS * TILE, levelH: ROWS * TILE, surf, gates: levelObj.gates, doors: levelObj.doors, currents: levelObj.currents, updrafts: levelObj.updrafts, shade: levelObj.shade };
  }

  window.WAVEBOUND_LEVEL_CORE = { build, TILE, ROWS };
})();