(() => {
  "use strict";

  const TAU = Math.PI * 2;
  const TILE = 30;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const PAL = {
    shore: { sky: ["#2f6aab", "#5f9fd6", "#9fcce8"], sun: "rgba(255,214,140,0.95)", far: "rgba(80,150,190,0.4)", near: "rgba(40,120,175,0.32)", water: "24,132,185", grass: "#7fb86a", dirtA: "#cda878", dirtB: "#c29d6c" },
    town: { sky: ["#2a5f9e", "#6f9cc8", "#e8d29f"], sun: "rgba(255,230,160,0.95)", far: "rgba(110,155,175,0.4)", near: "rgba(80,135,150,0.32)", water: "30,140,180", grass: "#7cb86a", dirtA: "#d6bd8d", dirtB: "#c9ad79" },
    cave: { sky: ["#0a1a2e", "#0e2940", "#12334a"], sun: "rgba(180,230,255,0.10)", far: "rgba(40,120,160,0.25)", near: "rgba(60,150,190,0.20)", water: "16,110,170", grass: "#2eab8a", dirtA: "#2c5566", dirtB: "#244a5c" },
    falls: { sky: ["#2c639f", "#6fa8d8", "#a8cdc8"], sun: "rgba(255,220,150,0.95)", far: "rgba(90,170,200,0.4)", near: "rgba(45,140,180,0.32)", water: "24,132,185", grass: "#7fb86a", dirtA: "#cda878", dirtB: "#c29d6c" },
    abyss: { sky: ["#030610", "#071426", "#0a1c33"], sun: "rgba(140,210,255,0.08)", far: "rgba(30,80,140,0.25)", near: "rgba(50,110,180,0.20)", water: "8,60,120", grass: "#1f9bcc", dirtA: "#173a52", dirtB: "#122f46" },
    sky: { sky: ["#3f8fd0", "#8cc8ee", "#e6f4ff"], sun: "rgba(255,244,200,0.95)", far: "rgba(255,255,255,0.45)", near: "rgba(220,240,255,0.30)", water: "90,180,220", grass: "#cfe9f5", dirtA: "#a8bdd6", dirtB: "#8fa8c4" },
    crypt: { sky: ["#0a0f1c", "#12202e", "#1a2c3a"], sun: "rgba(150,210,255,0.08)", far: "rgba(40,90,130,0.25)", near: "rgba(60,120,150,0.20)", water: "12,80,120", grass: "#5fc0a0", dirtA: "#2a4a58", dirtB: "#223c4a" },
    lava: { sky: ["#2a1208", "#4a1e10", "#6b2a14"], sun: "rgba(255,170,90,0.5)", far: "rgba(200,90,40,0.25)", near: "rgba(255,120,50,0.18)", water: "200,60,20", grass: "#c88a4a", dirtA: "#5a2c18", dirtB: "#4a2212" },
    tundra: { sky: ["#20334a", "#5a7a9a", "#cfe0ef"], sun: "rgba(220,240,255,0.7)", far: "rgba(190,215,235,0.4)", near: "rgba(160,195,225,0.3)", water: "120,160,190", grass: "#bfe0e8", dirtA: "#8aa0b0", dirtB: "#728ca0" },
  };

  const PICKUPS = ["ticket", "conch", "bubble", "feather", "starprize"];
  const BADDIES = ["crab", "crabj", "star", "jelly", "eel"];
  const NPCS = ["sign", "elder", "vendor", "kid"];
  const PLACEHOLDERS = ["spike", "seaghost", "kelp", "crown", "stranger"];

  const RAINBOW = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  const KEY_COLORS = {
    red: "#ff5d5d", orange: "#ffa64d", yellow: "#ffe066", green: "#7fe36e",
    blue: "#66c4ff", indigo: "#8a7bff", violet: "#d08aff",
  };
  const KEY_PICKS = RAINBOW.map(function (c) { return "key_" + c; });
  const STONE_PICKS = ["stone_white", "stone_black"];

  function drawPearl(ctx, x, y, bob) {
    const cy = y + Math.sin(bob) * 2;
    ctx.fillStyle = "#f4f0ff";
    ctx.beginPath(); ctx.arc(x, cy, 5.5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#c9d4ff";
    ctx.beginPath(); ctx.arc(x + 1.5, cy - 1.5, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(x - 0.5, cy - 2, 1.6, 0, TAU); ctx.fill();
  }

  function drawBubblePickup(ctx, x, y, bob) {
    const cy = y + Math.sin(bob) * 2;
    ctx.fillStyle = "rgba(190,235,255,0.65)";
    ctx.beginPath(); ctx.arc(x, cy, 7, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(220,245,255,0.9)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, cy, 9, 0, TAU); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath(); ctx.arc(x - 2, cy - 3, 2.2, 0, TAU); ctx.fill();
  }

  function drawFeather(ctx, x, y, t) {
    const cy = y + Math.sin(t * 1.8) * 3;
    const wob = Math.sin(t * 2.4) * 5;
    ctx.save();
    ctx.translate(x, cy);
    ctx.rotate(wob * 0.02 + Math.sin(t * 1.2) * 0.06);
    ctx.fillStyle = "rgba(235,245,255,0.22)";
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#eef6ff"; ctx.lineWidth = 4.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-21, 6); ctx.lineTo(-15, 3); ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-15, 3); ctx.lineTo(16, -3); ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-16, 3);
    ctx.lineTo(-15, -2);
    ctx.quadraticCurveTo(-12, -10, -2, -11.5);
    ctx.quadraticCurveTo(6, -12.5, 16, -3);
    ctx.quadraticCurveTo(8, -4, -1, -3);
    ctx.quadraticCurveTo(-10, -1, -16, 3);
    ctx.fill();
    ctx.strokeStyle = "rgba(205,228,255,0.9)"; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const bx = -13 + i * 4.7;
      ctx.beginPath();
      ctx.moveTo(bx, -2.5);
      ctx.lineTo(bx - 2.4, -9 - i * 0.35);
      ctx.stroke();
    }
    ctx.fillStyle = "#dcecff";
    ctx.beginPath();
    ctx.moveTo(-16, 3);
    ctx.quadraticCurveTo(-12, 11, 0, 10.5);
    ctx.quadraticCurveTo(7, 8.5, 16, -3);
    ctx.quadraticCurveTo(7, 2, 0, 3);
    ctx.quadraticCurveTo(-9, 3, -16, 3);
    ctx.fill();
    ctx.restore();
  }

  function drawConch(ctx, x, y, t) {
    const cy = y + Math.sin(t * 1.2) * 2;
    ctx.save(); ctx.translate(x, cy + 4);
    ctx.fillStyle = "#ff9fb8";
    ctx.beginPath(); ctx.ellipse(0, 0, 9, 6, -0.5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#e76d92";
    ctx.beginPath(); ctx.moveTo(-4, 3); ctx.quadraticCurveTo(0, -6, 6, -2); ctx.quadraticCurveTo(3, 4, -4, 3); ctx.fill();
    ctx.fillStyle = "#ffd4e2";
    ctx.beginPath(); ctx.moveTo(0, -3); ctx.quadraticCurveTo(4, -5, 7, -4); ctx.quadraticCurveTo(4, -1, 0, -3); ctx.fill();
    ctx.restore();
  }

  function drawStarPrize(ctx, x, y, t) {
    ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 3);
    const pulse = (Math.sin(t * 5) + 1) / 2;
    ctx.fillStyle = `rgba(255,225,140,${0.25 + pulse * 0.2})`;
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, TAU); ctx.fill();
    ctx.fillStyle = "#ffd77a";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2;
      const r = i % 2 === 0 ? 12 : 5;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fff3c4";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2 + 0.4;
      const r = i % 2 === 0 ? 8 : 3.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawCrab(ctx, x, y, t, vx, green) {
    const legC = green ? "#2f7d3b" : "#b4532a";
    const clawC = green ? "#4cb856" : "#e8874a";
    const clawHi = green ? "#82d171" : "#ffb064";
    const bodyD = green ? "#4cb856" : "#e8874a";
    const bodyHi = green ? "#8fdc78" : "#ffb576";
    ctx.save();
    ctx.translate(x + TILE / 2, y + TILE / 2 + 4);
    const wob = Math.sin(t * 8) * 2;
    ctx.strokeStyle = legC; ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const lx = -6 - i * 2;
      ctx.beginPath(); ctx.moveTo(lx, 2); ctx.lineTo(lx - 3, 10 + wob * 0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(6 + i * 2, 2); ctx.lineTo(9 + i * 2, 10 + wob * 0.5); ctx.stroke();
    }
    ctx.fillStyle = clawC;
    ctx.beginPath(); ctx.arc(-7, -4, 4, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(7, -4, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = clawHi;
    ctx.beginPath(); ctx.arc(-8, -4, 2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(8, -4, 2, 0, TAU); ctx.fill();
    ctx.fillStyle = bodyD;
    ctx.beginPath(); ctx.ellipse(0, 1, 8, 6, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = bodyHi;
    ctx.beginPath(); ctx.ellipse(0, -1, 6, 3.5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(-3, -5, 2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -5, 2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2a1a2a";
    ctx.beginPath(); ctx.arc(-3.4, -5, 1, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(2.6, -5, 1, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawStar(ctx, e, x, y, t) {
    ctx.save();
    ctx.translate(x + (e.w || TILE) / 2, y + (e.h || TILE) / 2 + Math.sin(t * 2.5) * 3);
    ctx.rotate(Math.sin(t * 1.2) * 0.25);
    ctx.fillStyle = "#b06bd0";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2;
      const r = i % 2 === 0 ? 11 : 5.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#e6b4ff";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2 + 0.3;
      const r = i % 2 === 0 ? 7 : 3;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(-2, -3, 2.4, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawJelly(ctx, x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    const puls = 1 + Math.sin(t * 4) * 0.12;
    ctx.fillStyle = "rgba(210,140,255,0.5)";
    ctx.beginPath();
    ctx.ellipse(0, -6, 10 * puls, 12 * puls, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(230,180,255,0.9)"; ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 6, 2);
      ctx.quadraticCurveTo(i * 8, 10 + Math.sin(t * 5 + i) * 3, i * 4, 16 + Math.sin(t * 4.5 + i * 2) * 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEel(ctx, x, y, t, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#2a5f86";
    ctx.beginPath();
    ctx.ellipse(0, 0, 14 * dir, 5, dir * Math.sin(t * 6) * 0.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#7fb4d6";
    for (let i = -1; i <= 1; i++) {
      const ox = -16 * dir - i * 6 * dir;
      ctx.beginPath(); ctx.arc(ox, 0, 4 - Math.abs(i) * 1.2, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(14 * dir, -1, 2.4, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2a1a2a";
    ctx.beginPath(); ctx.arc(14 * dir, -1, 1.2, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawBP(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, TAU); ctx.fill();
    ctx.fillStyle = "#bfe8ff";
    ctx.beginPath(); ctx.arc(0, 0, 5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(1.5, -1.5, 2, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function windJitter(t, i) { return Math.sin(t * 3 + i * 2.1) * 0.1; }

  function drawCrabKing(ctx, x, y, t, b) {
    const state = b.state || "walk";
    const coil01 = state === "coil" ? clamp(1 - b.timer / 0.55, 0, 1) : state === "snap" ? 1 : 0;
    const snap01 = state === "snap" ? clamp(1 - b.timer / 0.6, 0, 1) : 0;
    const wound = coil01 * (1 - snap01 * 0.92);
    const crouch = 4 * wound;
    const lean = 6 * snap01;
    const gait = t * 7;

    ctx.save();
    ctx.translate(x, y + 12);
    ctx.scale(b.dir || 1, 1);

    const shadowA = 0.28 - snap01 * 0.08;
    ctx.fillStyle = "rgba(20,8,4," + shadowA + ")";
    ctx.beginPath();
    ctx.ellipse(0, 26, 44, 9, 0, 0, TAU);
    ctx.fill();

    if (wound > 0.05) {
      ctx.strokeStyle = "rgba(255,110,40," + (0.35 * wound + Math.sin(t * 13) * 0.12) + ")";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, crouch, 52 + Math.sin(t * 9) * 4, 14, 0, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, crouch, 40, 8, 0, 0, TAU);
      ctx.stroke();
    }

    ctx.strokeStyle = "#6e2208"; ctx.lineWidth = 6;
    for (let i = 0; i < 3; i++) {
      const ph = i - 1;
      const sw = Math.sin(gait + ph * 1.9) * (1 - wound) * 8;
      const lx = -16 - ph * 7;
      const out = 5 + Math.sin(gait + ph * 2.3) * 4;
      ctx.beginPath();
      ctx.moveTo(lx * 0.7, 10 + sw * 0.4);
      ctx.lineTo(-20 - ph * 8, 20 + out);
      ctx.lineTo(-24 - ph * 9, 26 + sw);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(16 + ph * 7, 10 + sw * 0.4);
      ctx.lineTo(20 + ph * 8, 20 + out);
      ctx.lineTo(24 + ph * 9, 26 + sw);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(8,20,34,0.55)";
    ctx.beginPath(); ctx.ellipse(0, 10 + crouch, 34, 24, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#7c2d12";
    ctx.beginPath(); ctx.ellipse(0, 6 + crouch, 42, 30, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#b3401c";
    ctx.beginPath(); ctx.ellipse(0, 2 + crouch, 37, 26, 0, 0, TAU); ctx.fill();
    for (let seg = 0; seg < 3; seg++) {
      ctx.strokeStyle = "rgba(90,26,8,0.55)"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 2 + crouch, 26 + seg * 5, 13 + seg * 3, 0, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath(); ctx.ellipse(-16, -8 + crouch, 20, 9, 0.35, 0, TAU); ctx.fill();
    for (let i = -2; i <= 2; i++) {
      ctx.fillStyle = "#ffd77a";
      ctx.beginPath(); ctx.arc(i * 15, 8 + crouch, 2.4, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,215,122,0.4)";
      ctx.beginPath(); ctx.arc(i * 15, 8 + crouch, 4, 0, TAU); ctx.fill();
    }

    const eyeR = 5.2 - snap01 * 0.8;
    const stalk = 13 - wound * 6;
    ctx.strokeStyle = "#c84a1f"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-12, -6 + crouch); ctx.lineTo(-12, -6 - stalk + crouch); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, -6 + crouch); ctx.lineTo(12, -6 - stalk + crouch); ctx.stroke();
    ctx.fillStyle = "#e2572a";
    ctx.beginPath(); ctx.arc(-12, -8 - stalk + crouch, eyeR + 2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(12, -8 - stalk + crouch, eyeR + 2, 0, TAU); ctx.fill();
    ctx.fillStyle = snap01 > 0.5 ? "#c22a1a" : "#ffd771";
    ctx.beginPath(); ctx.arc(-12, -8 - stalk + crouch, eyeR, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(12, -8 - stalk + crouch, eyeR, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2a0a06";
    ctx.beginPath(); ctx.arc(-12 + 1.6, -7 - stalk + crouch, eyeR * 0.45, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(12 + 1.6, -7 - stalk + crouch, eyeR * 0.45, 0, TAU); ctx.fill();
    if (snap01 > 0.5) {
      ctx.strokeStyle = "#2a0a06"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-18, -3 + crouch); ctx.lineTo(-6, 1 + crouch);
      ctx.moveTo(6, 1 + crouch); ctx.lineTo(18, -3 + crouch); ctx.stroke();
    }

    const clawAng = clamp(lerp(0.52, 2.25, wound) - snap01 * 2.2, -0.1, 2.35);
    const clawExt = 1 + snap01 * 0.5;
    const open = (coil01 * 1 - snap01) * 0.9;
    for (const s of [-1, 1]) {
      const shx = s * 6 + lean * 0.4;
      const shy = 6 + crouch - 4 * wound;
      ctx.strokeStyle = "#c84a1f"; ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(shx, shy);
      ctx.lineTo(shx + Math.cos(clawAng) * 20 * s * clawExt, shy - Math.sin(clawAng) * 20 * clawExt);
      ctx.stroke();
      const ux = shx + Math.cos(clawAng) * 20 * s * clawExt;
      const uy = shy - Math.sin(clawAng) * 20 * clawExt;
      const fa = clawAng + (s === 1 ? -0.42 : 0.42);
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(ux, uy);
      ctx.lineTo(ux + Math.cos(fa) * 17 * s, uy - Math.sin(fa) * 17);
      ctx.stroke();
      const px = ux + Math.cos(fa) * 17 * s;
      const py = uy - Math.sin(fa) * 17;
      ctx.fillStyle = "#b3401c";
      ctx.beginPath(); ctx.ellipse(px, py, 9, 5, -fa + Math.PI / 2, 0, TAU); ctx.fill();
      ctx.fillStyle = "#ffd77a";
      ctx.beginPath(); ctx.arc(px + Math.cos(fa) * 6 * s, py - Math.sin(fa) * 6, 2.4, 0, TAU); ctx.fill();
      const grip = open > 0 ? 0.5 : 0.1;
      ctx.strokeStyle = "#ffd77a"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - Math.cos(fa) * 6 * s + s * 4, py - Math.sin(fa) * 6 - 4 * grip);
      ctx.lineTo(px + Math.cos(fa) * 5 * s + s * 4, py - Math.sin(fa) * 5 - 6);
      ctx.moveTo(px - Math.cos(fa) * 6 * s - s * 4, py - Math.sin(fa) * 6 - 4 * grip);
      ctx.lineTo(px + Math.cos(fa) * 5 * s - s * 4, py - Math.sin(fa) * 5 - 6);
      ctx.stroke();
    }

    ctx.fillStyle = "#e2572a";
    ctx.beginPath();
    ctx.moveTo(-8 + lean * 0.5, 4 + crouch);
    ctx.lineTo(0, 12 + crouch);
    ctx.lineTo(8 + lean * 0.5, 4 + crouch);
    ctx.lineTo(5 + lean * 0.5, -2 + crouch);
    ctx.lineTo(-5 + lean * 0.5, -2 + crouch);
    ctx.closePath();
    ctx.fill();
    const gape = snap01 > 0.4 ? (snap01 - 0.4) / 0.6 : 0;
    ctx.fillStyle = "#2a0a06";
    ctx.beginPath(); ctx.ellipse(lean * 0.6, 8 + crouch, 9 + gape * 8, 2 + gape * 4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#fff3c8";
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.arc(i * 5 + lean * 0.6, 6 + crouch - gape * 3, 1.4, 0, TAU); ctx.fill();
    }

    ctx.save();
    ctx.translate(0, -24 + crouch + windJitter(t, 0));
    ctx.fillStyle = "#c87f1f";
    ctx.fillRect(-19, 2, 38, 5);
    ctx.fillStyle = "#ffd77a";
    ctx.fillRect(-17, 0, 34, 3);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const sx = -16 + i * 8;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx + 4, -11);
      ctx.lineTo(sx + 8, 0);
    }
    ctx.fill();
    ctx.fillStyle = "#e23b2e";
    ctx.beginPath(); ctx.arc(-16, -1, 2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(-8, -4, 2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -6, 2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(8, -4, 2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(16, -1, 2, 0, TAU); ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function drawSign(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y + 52);
    ctx.fillStyle = "#a6723d";
    ctx.fillRect(-4, 0, 8, 20);
    ctx.fillStyle = "#f4d39a";
    ctx.fillRect(-28, -30, 56, 30);
    ctx.fillStyle = "#7a4a22";
    ctx.fillRect(-28, -30, 56, 4);
    ctx.restore();
  }

  function drawVendor(ctx, x, y, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#b06bd0";
    ctx.beginPath(); ctx.ellipse(0, 4, 13, 11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#e6b4ff";
    ctx.beginPath(); ctx.ellipse(0, 2, 10, 8, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU + Math.sin(t * 2) * 0.4;
      ctx.strokeStyle = "#b06bd0"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * 9, 2 + Math.sin(a) * 8); ctx.lineTo(Math.cos(a + 0.25) * 16, 2 + Math.sin(a + 0.25) * 14); ctx.stroke();
    }
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(3, -2, 2.4, 0, TAU); ctx.fill();
    ctx.fillStyle = "#2a1a2a";
    ctx.beginPath(); ctx.arc(3.4, -2, 1.1, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawKey(ctx, x, y, t, color) {
    const c = KEY_COLORS[color] || "#ffd77a";
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 2) * 2);
    ctx.rotate(Math.sin(t * 1.4) * 0.2);
    // bow/ring
    ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(-6, 0, 5, 0.3, Math.PI * 2 - 0.3); ctx.stroke();
    // shaft
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(12, 0); ctx.stroke();
    // teeth
    ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(8, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(12, 5); ctx.stroke();
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(-6, 0, 2.5, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawStone(ctx, x, y, t, color) {
    const fill = color === "white" ? "#f0ecff" : "#1a1420";
    const edge = color === "white" ? "#cfc6ec" : "#4a4258";
    ctx.save();
    ctx.translate(x, y + Math.sin(t * 1.6) * 2);
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.ellipse(0, 0, 8, 6.5, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = edge; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(0, 0, 8, 6.5, 0, 0, TAU); ctx.stroke();
    // little sparkle vein
    ctx.strokeStyle = edge; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-3, -2); ctx.quadraticCurveTo(0, -4, 4, -1); ctx.stroke();
    ctx.restore();
  }

  function drawChest(ctx, x, y, t, open) {
    ctx.save();
    ctx.translate(x, y + 2 + (open ? 0 : Math.sin(t * 2) * 1.5));
    // base
    ctx.fillStyle = open ? "#6b4a2a" : "#8a5f33";
    ctx.fillRect(-13, 2, 26, 14);
    ctx.strokeStyle = "#4a2f18"; ctx.lineWidth = 1.6;
    ctx.strokeRect(-13, 2, 26, 14);
    // lid
    ctx.fillStyle = "#a06a34";
    ctx.beginPath(); ctx.arc(0, 2, 14, Math.PI, 0, false); ctx.fill();
    ctx.strokeStyle = "#4a2f18";
    ctx.beginPath(); ctx.arc(0, 2, 14, Math.PI, 0, false); ctx.stroke();
    // trim
    ctx.fillStyle = "#e0b050";
    ctx.fillRect(-14, 1, 28, 3);
    // latch
    ctx.fillStyle = "#ffe08a";
    ctx.fillRect(-2, 4, 4, 4);
    if (open) {
      // gold glow
      ctx.fillStyle = "rgba(255,225,140," + (0.35 + Math.sin(t * 5) * 0.15) + ")";
      ctx.beginPath(); ctx.arc(0, 8, 9, 0, TAU); ctx.fill();
      ctx.fillStyle = "#ffe9b0";
      ctx.beginPath(); ctx.arc(-3, 8, 3.2, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(3, 7, 2.6, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(0, 11, 2.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // Placeholder: renders unknown / future entities as a ghostly "?".
  function drawUnknown(ctx, x, y, t, color, label) {
    const bob = Math.sin(t * 2) * 2;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.fill();
    ctx.strokeStyle = color || "#9fe4ff"; ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = color || "#9fe4ff";
    ctx.font = "700 15px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label || "?", 0, 0);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.restore();
  }

  function ticketShade(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.round((n >> 16) * k));
    const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
    const b = Math.min(255, Math.round((n & 255) * k));
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function ticketAnchor(ctx, x, y, s, color) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = color; ctx.lineWidth = 1.7; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(0, -7, 2.6, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -4.2); ctx.lineTo(0, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-4.5, -2.5); ctx.lineTo(4.5, -2.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 2.5, 5.5, Math.PI * 0.15, Math.PI * 0.85, false); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-5.2, 4.6); ctx.lineTo(-7.2, 3.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(5.2, 4.6); ctx.lineTo(7.2, 3.2); ctx.stroke();
    ctx.restore();
  }

  function ticketOtterFace(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(s, s);
    const fur = "#8a6a52", muzzle = "#e8d4b0", ink = "#1d140e";
    ctx.fillStyle = fur;
    ctx.beginPath(); ctx.arc(-7, -10.8, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(7, -10.8, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -13.5);
    ctx.quadraticCurveTo(10, -11, 9.5, 1);
    ctx.quadraticCurveTo(12, 6, 7.5, 9.5);
    ctx.quadraticCurveTo(3.5, 14, 0, 13);
    ctx.quadraticCurveTo(-3.5, 14, -7.5, 9.5);
    ctx.quadraticCurveTo(-12, 6, -9.5, 1);
    ctx.quadraticCurveTo(-10, -11, 0, -13.5);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(30,20,14,0.35)";
    ctx.beginPath(); ctx.ellipse(-4.6, -2, 3.6, 2.8, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4.6, -2, 3.6, 2.8, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = muzzle;
    ctx.beginPath(); ctx.ellipse(0, 6.6, 6, 4.8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ink;
    ctx.beginPath(); ctx.ellipse(-4.6, -2, 1.9, 1.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4.6, -2, 1.9, 1.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 4.6, 2.3, 1.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 6.3); ctx.lineTo(0, 8.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-6.5, 5.6); ctx.lineTo(-11.5, 4.8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6.5, 5.6); ctx.lineTo(11.5, 4.8); ctx.stroke();
    ctx.restore();
  }

  // Otter Ticket bill: squared corners, diagonal sash, center seal with otter face, anchors flanking
  function drawTicket(ctx, x, y, bob, color) {
    const c = KEY_COLORS[color] || KEY_COLORS.green;
    const w = 26, h = 13, r = 2;
    const yy = y + Math.sin(bob) * 1.5;
    const x0 = x - w / 2, y0 = yy - h / 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.arcTo(x0 + w, y0, x0 + w, y0 + h, r);
    ctx.arcTo(x0 + w, y0 + h, x0, y0 + h, r);
    ctx.arcTo(x0, y0 + h, x0, y0, r);
    ctx.arcTo(x0, y0, x0 + w, y0, r);
    ctx.closePath();
    ctx.fillStyle = "#f6efdc"; ctx.fill();
    ctx.lineWidth = 1.2; ctx.strokeStyle = ticketShade(c, 0.7); ctx.stroke();
    ctx.save(); ctx.clip();
    ctx.globalAlpha = 0.55; ctx.fillStyle = ticketShade(c, 0.85);
    ctx.beginPath();
    ctx.moveTo(x0 + w * 0.10, y0 + h); ctx.lineTo(x0 + w * 0.45, y0);
    ctx.lineTo(x0 + w * 0.58, y0); ctx.lineTo(x0 + w * 0.23, y0 + h);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    ticketAnchor(ctx, x0 + 5, yy, 0.32, c);
    ticketAnchor(ctx, x0 + w - 5, yy, 0.32, c);
    const fx = x + w * 0.13, fr = h * 0.36;
    ctx.beginPath(); ctx.arc(fx, yy, fr, 0, Math.PI * 2);
    ctx.fillStyle = "#fff8e8"; ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = c; ctx.stroke();
    ctx.save();
    ctx.beginPath(); ctx.arc(fx, yy, fr - 0.5, 0, Math.PI * 2); ctx.clip();
    ticketOtterFace(ctx, fx, yy, fr / 12.5);
    ctx.restore();
    ctx.restore();
  }

  window.WAVEBOUND_RENDER = {
    TAU, TILE, clamp, lerp, PAL,
    PICKUPS, BADDIES, NPCS, PLACEHOLDERS,
    drawPearl, drawBubblePickup, drawFeather, drawConch, drawStarPrize,
    drawTicket,
    drawCrab, drawStar, drawJelly, drawEel, drawBP, drawUnknown,
    drawSign, drawVendor, drawCrabKing, drawKey, drawStone, drawChest,
    KEY_COLORS, RAINBOW, KEY_PICKS, STONE_PICKS,
  };
})();