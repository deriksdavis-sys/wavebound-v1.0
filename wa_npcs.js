(function () {
  "use strict";
  if (window.waNpc) return;
  const TAU = Math.PI * 2;

  // Side-view river otter, matched to otter_sprite_pack (idle): long body,
  // thick tapering tail, cream belly + muzzle, short legs, dark outline.
  const DEFAULTS = {
    elder: {
      scale: 1,
      fur: "#6e645c", belly: "#e4d4c0", ear: "#c8bdb0", dark: "#2a2420", whisk: "#4a443c", browCol: "#c8c0b4",
      outline: "#1a1410",
      headRX: 5.2, headRY: 5.0, headX: 11, headY: -1,
      earR: 1.55, earInner: 0.75, earX1: 8.6, earX2: 13.2, earY: -5.6,
      faceRX: 3.8, faceRY: 2.8, faceX: 14.4, faceY: 0.6,
      noseRX: 1.15, noseRY: 0.9, noseX: 17.3, noseY: 0.9,
      whiskLen: 5, whiskX: 15.2, whiskY: 0.6, whiskSep: 1.15, whiskRise: 0.9, whiskN: 3,
      mouthR: 1.1, mouthX: 15.6, mouthY: 2.0, mouthW: 1.1,
      eyeX: 11.4, eyeY: -2.2, eyeR: 1.15, glint: 1, glintDX: 0.35, glintDY: -0.4, glintR: 0.45,
      eye2X: 11.4, eye2Y: -2.2, eye2R: 0, glint2: 0, glint2DX: 0, glint2DY: 0, glint2R: 0,
      brow: 1, browX1: 10.2, browX2: 12.4, browY: -3.6, browCtlY: -4.1, browW: 1.2,
      cheek: 0, cheekX: 13, cheekY: 1.2, cheekRX: 1.4, cheekRY: 1.0,
      bodyRX: 12, bodyRY: 5.6, bodyX: 1.2, bodyY: 4.2, bodyRot: -0.38,
      bellyRX: 8.2, bellyRY: 2.9, bellyX: 2.8, bellyY: 6.6, bellyRot: -0.38,
      feetRX: 2.3, feetRY: 2.7, feetY: 11.4, feetX1: -4.2, feetX2: -0.6,
      pawRX: 2.0, pawRY: 2.3, pawX: 7.2, pawY: 9.6, pawRot: 0.15,
      tailX: -8, tailY: 4.5, tailCtl: -18, tailCtlY: 3.5, tailTipX: -26, tailTipY: 7.5, tailW1: 9, tailW2: 5
    },
    kid: {
      scale: 0.86,
      fur: "#885038", belly: "#e8c098", ear: "#c09868", dark: "#2a1810", whisk: "#5a3020", browCol: "#5a3020",
      outline: "#1a100c",
      headRX: 5.2, headRY: 5.0, headX: 11, headY: -1,
      earR: 1.55, earInner: 0.75, earX1: 8.6, earX2: 13.2, earY: -5.6,
      faceRX: 3.8, faceRY: 2.8, faceX: 14.4, faceY: 0.6,
      noseRX: 1.15, noseRY: 0.9, noseX: 17.3, noseY: 0.9,
      whiskLen: 5, whiskX: 15.2, whiskY: 0.6, whiskSep: 1.15, whiskRise: 0.9, whiskN: 3,
      mouthR: 1.1, mouthX: 15.6, mouthY: 2.0, mouthW: 1.1,
      eyeX: 11.4, eyeY: -2.2, eyeR: 1.35, glint: 1, glintDX: 0.4, glintDY: -0.45, glintR: 0.5,
      eye2X: 11.4, eye2Y: -2.2, eye2R: 0, glint2: 0, glint2DX: 0, glint2DY: 0, glint2R: 0,
      brow: 0, browX1: 10.2, browX2: 12.4, browY: -3.6, browCtlY: -4.1, browW: 1.2,
      cheek: 0, cheekX: 13, cheekY: 1.2, cheekRX: 1.4, cheekRY: 1.0,
      bodyRX: 12, bodyRY: 5.6, bodyX: 1.2, bodyY: 4.2, bodyRot: -0.38,
      bellyRX: 8.2, bellyRY: 2.9, bellyX: 2.8, bellyY: 6.6, bellyRot: -0.38,
      feetRX: 2.3, feetRY: 2.7, feetY: 11.4, feetX1: -4.2, feetX2: -0.6,
      pawRX: 2.0, pawRY: 2.3, pawX: 7.2, pawY: 9.6, pawRot: 0.15,
      tailX: -8, tailY: 4.5, tailCtl: -18, tailCtlY: 3.5, tailTipX: -26, tailTipY: 7.5, tailW1: 9, tailW2: 5
    }
  };

  let overrides = {};
  try { if (window.WA_NPC_OVERRIDES) overrides = window.WA_NPC_OVERRIDES; } catch (e) {}
  function merged(kind) {
    const c = Object.assign({}, DEFAULTS[kind]);
    if (overrides[kind]) Object.assign(c, overrides[kind]);
    return c;
  }

  function draw(ctx, kind) {
    const c = merged(kind);
    const s = c.scale;
    ctx.save();
    ctx.scale(s, s);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const ink = c.outline || "#1a1410";

    // tail — long, thick, slightly drooping (sprite-pack idle)
    ctx.strokeStyle = ink; ctx.lineWidth = c.tailW1 + 1.6;
    ctx.beginPath(); ctx.moveTo(c.tailX, c.tailY); ctx.quadraticCurveTo(c.tailCtl, c.tailCtlY, c.tailTipX, c.tailTipY); ctx.stroke();
    ctx.strokeStyle = c.fur; ctx.lineWidth = c.tailW1;
    ctx.beginPath(); ctx.moveTo(c.tailX, c.tailY); ctx.quadraticCurveTo(c.tailCtl, c.tailCtlY, c.tailTipX, c.tailTipY); ctx.stroke();
    ctx.strokeStyle = c.fur; ctx.lineWidth = c.tailW2;
    ctx.beginPath(); ctx.moveTo(c.tailX - 2, c.tailY + 0.5); ctx.quadraticCurveTo(c.tailCtl - 1, c.tailCtlY + 1.5, c.tailTipX, c.tailTipY); ctx.stroke();
    ctx.strokeStyle = c.belly; ctx.lineWidth = Math.max(2, c.tailW2 * 0.45);
    ctx.beginPath(); ctx.moveTo(c.tailX, c.tailY + 2); ctx.quadraticCurveTo(c.tailCtl, c.tailCtlY + 3, c.tailTipX + 2, c.tailTipY + 1); ctx.stroke();

    function blob(x, y, rx, ry, rot, fill, stroke) {
      ctx.fillStyle = fill;
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); ctx.fill();
      if (stroke) {
        ctx.strokeStyle = ink; ctx.lineWidth = 1.35;
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); ctx.stroke();
      }
    }

    // hind legs
    blob(c.feetX1, c.feetY, c.feetRX, c.feetRY, 0.12, c.fur, true);
    blob(c.feetX2, c.feetY + 0.3, c.feetRX * 0.92, c.feetRY * 0.95, -0.08, c.fur, true);
    // body
    blob(c.bodyX, c.bodyY, c.bodyRX, c.bodyRY, c.bodyRot, c.fur, true);
    // cream belly along the underside
    blob(c.bellyX, c.bellyY, c.bellyRX, c.bellyRY, c.bellyRot, c.belly, false);
    // front paw
    blob(c.pawX, c.pawY, c.pawRX, c.pawRY, c.pawRot, c.fur, true);
    // head
    blob(c.headX, c.headY, c.headRX, c.headRY, -0.15, c.fur, true);
    // ears
    blob(c.earX1, c.earY, c.earR, c.earR * 1.15, -0.3, c.fur, true);
    blob(c.earX2, c.earY - 0.2, c.earR * 0.95, c.earR * 1.1, 0.25, c.fur, true);
    ctx.fillStyle = c.ear;
    ctx.beginPath(); ctx.ellipse(c.earX1, c.earY + 0.15, c.earInner, c.earInner * 1.1, -0.3, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(c.earX2, c.earY, c.earInner * 0.9, c.earInner, 0.25, 0, TAU); ctx.fill();
    // cream muzzle
    blob(c.faceX, c.faceY, c.faceRX, c.faceRY, 0.2, c.belly, true);
    // nose
    ctx.fillStyle = c.dark;
    ctx.beginPath(); ctx.ellipse(c.noseX, c.noseY, c.noseRX, c.noseRY, 0.15, 0, TAU); ctx.fill();
    // mouth
    ctx.strokeStyle = c.whisk; ctx.lineWidth = c.mouthW;
    ctx.beginPath(); ctx.arc(c.mouthX, c.mouthY, c.mouthR, 0.15, 1.05, false); ctx.stroke();
    // whiskers
    ctx.strokeStyle = c.whisk; ctx.lineWidth = 0.9;
    for (let w = 0; w < c.whiskN; w++) {
      const dy = w - Math.floor(c.whiskN / 2);
      ctx.beginPath();
      ctx.moveTo(c.whiskX, c.whiskY + dy * c.whiskSep);
      ctx.lineTo(c.whiskX + c.whiskLen, c.whiskY + dy * c.whiskSep - dy * c.whiskRise);
      ctx.stroke();
    }
    // eye
    ctx.fillStyle = c.dark;
    ctx.beginPath(); ctx.arc(c.eyeX, c.eyeY, c.eyeR, 0, TAU); ctx.fill();
    if (c.glint) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(c.eyeX + c.glintDX, c.eyeY + c.glintDY, c.glintR, 0, TAU); ctx.fill();
    }
    if (c.eye2R > 0.2) {
      ctx.fillStyle = c.dark;
      ctx.beginPath(); ctx.arc(c.eye2X, c.eye2Y, c.eye2R, 0, TAU); ctx.fill();
      if (c.glint2) {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(c.eye2X + c.glint2DX, c.eye2Y + c.glint2DY, c.glint2R, 0, TAU); ctx.fill();
      }
    }
    if (c.brow) {
      ctx.strokeStyle = c.browCol; ctx.lineWidth = c.browW;
      ctx.beginPath(); ctx.moveTo(c.browX1, c.browY); ctx.quadraticCurveTo((c.browX1 + c.browX2) / 2, c.browCtlY, c.browX2, c.browY); ctx.stroke();
    }
    if (c.cheek) {
      ctx.fillStyle = c.belly;
      ctx.beginPath(); ctx.ellipse(c.cheekX, c.cheekY, c.cheekRX, c.cheekRY, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  window.waNpc = {
    defaults: (kind) => JSON.parse(JSON.stringify(DEFAULTS[kind])),
    config: merged,
    setOverride: (kind, cfg) => { if (cfg == null) delete overrides[kind]; else overrides[kind] = Object.assign({}, cfg); },
    overrides: () => overrides,
    draw
  };
})();
