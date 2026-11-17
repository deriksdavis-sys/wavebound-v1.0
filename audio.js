// Wavebound audio engine: WebAudio, music + sfx, driven by an optional manifest.
// Legacy (no manifest):  assets/audio/music/<key>_a.wav / <key>_b.wav, assets/audio/sfx/<event>.wav
// Manifest (assets/audio/manifest.json, written by audio_editor.html):
//   sfx.<event>          -> { file: "sfx_library/x.ogg", files?: [up to 4, played round robin], gain }
//   music.tracks.<file>  -> { label, gain }        (title-screen song menu)
//   music.order          -> [file, ...]            (title-screen song menu order)
//   music.title          -> file | null            (default title song)
//   music.levels.<idx>   -> { file, b?, next?, next2?, next3?, gain }  (b = optional crossfade
//                             stem; next/next2/next3 = encore stages played back to back after A;
//                             when the chain runs out it restarts from A)
//   music.congrats       -> { file, gain }              (post-level "Congratulations" stats screen)
//   music.final          -> { file, gain }              (end-of-game "final screen" music)
// Missing files resolve to silence — the game runs with zero audio assets.
(function () {
  "use strict";

  const SFX_EVENTS = ["jump", "land", "splash", "swim", "ticket", "conch", "key",
    "door", "chest", "hit", "kill", "save", "talk", "boss", "win", "die",
    "select", "back", "feather", "crabburst", "crabclick", "roulette"];

  const SILENCE_GAP = 0;     // seconds of silence between a track finishing and its encore (0 = back to back)

  // title song menu entries; rebuilt when the manifest arrives
  // (placeholder until then — a song-less build keeps silence, but real menus never show it)
  const TITLE_SONGS = [
    { label: "SILENCE", key: null },
  ];

  const SETTINGS_KEY = "wavebound_audio";
  let settings = { music: 0.8, sfx: 0.8, muted: false };
  try { Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}); } catch (e) {}

  let ctx = null, masterG = null, musicA = null, musicB = null, sfxG = null;
  let srcA = null, srcB = null;
  let curKey = null;
  let curGain = 1;            // per-track gain from the manifest
  let curLoop = true;
  let curHasB = false;
  let mix = 0;               // 0..100, 0 = track A only, 100 = track B only
  const RAMP = 4;            // default crossfade seconds
  const bufCache = {};       // "url" -> AudioBuffer | null
  const lastPlay = {};       // sfx throttle
  const rrIdx = {};          // sfx round-robin index per event
  let encoreTimer = null;    // pending encore timer (set only on the first pass)
  let chain = null;          // stage keys of the current level chain, e.g. [level, file:x, file:y]
  let chainIdx = 0;
  let playGen = 0;           // generation token; bump to cancel pending timers/promises

  let manifest = null;
  fetch("assets/audio/manifest.json").then((r) => (r.ok ? r.json() : null))
    .then((m) => { if (m) { manifest = m; rebuildTitleSongs(); primeSfx(); } })
    .catch(() => {});

  function ensureCtx() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterG = ctx.createGain();
    masterG.connect(ctx.destination);
    musicA = ctx.createGain(); musicB = ctx.createGain();
    musicA.connect(masterG); musicB.connect(masterG);
    sfxG = ctx.createGain(); sfxG.connect(masterG);
    applyVolumes();
    primeSfx();
    if (pending) { const p = pending; pending = null; p(); }
  }

  let pending = null;

  function unlock() { ensureCtx(); }
  document.addEventListener("pointerdown", unlock);
  document.addEventListener("keydown", unlock);

  function applyVolumes() {
    if (!ctx) return;
    masterG.gain.value = settings.muted ? 0 : 1;
    musicA.gain.value = musicB.gain.value = 0;
    sfxG.gain.value = settings.sfx;
    mixMusic(mix, 0);
    refreshMusicGain();
  }

  function trackGain(entry) {
    return entry && entry.gain != null ? Math.max(0, Math.min(2, entry.gain)) : 1;
  }

  function refreshMusicGain() {
    if (!ctx) return;
    const m = mix / 100, mp = settings.music * curGain;
    musicA.gain.value = (1 - m) * mp;
    musicB.gain.value = m * mp;
  }

  function silentBuffer(dur) {
    if (!ctx) return null;
    const b = ctx.createBuffer(2, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
    return b;
  }

  function loadBuffer(url) {
    return fetch(url).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.arrayBuffer();
    }).then((ab) => ctx.decodeAudioData(ab)).catch(() => null);
  }

  // up to 4 files per event from the manifest (files[]), else legacy single file.
  function sfxUrls(ev) {
    const e = manifest && manifest.sfx && manifest.sfx[ev];
    if (e && Array.isArray(e.files)) {
      const urls = e.files.filter(Boolean).map((f) => "assets/audio/" + f);
      if (urls.length) return urls;
    }
    if (e && e.file) return ["assets/audio/" + e.file];
    return ["assets/audio/sfx/" + ev + ".wav"];
  }

  function sfxUrl(ev) { return sfxUrls(ev)[0]; }

  function getBuf(url) {
    if (bufCache[url] !== undefined) return Promise.resolve(bufCache[url]);
    return (ctx ? Promise.resolve() : new Promise((res) => setTimeout(res, 0))).then(() => {
      if (!ctx) return null;
      return loadBuffer(url).then((b) => { bufCache[url] = b; return b; });
    });
  }

  // resolve a music key -> { a, b?, next?, nextKey?, gain } (urls relative to assets/audio/)
  function resolveMusic(key) {
    if (key == null) return null;
    if (typeof key === "string" && key.indexOf("file:") === 0) {
      const file = key.slice(5);
      const tr = manifest && manifest.music && manifest.music.tracks
        ? manifest.music.tracks[file] : null;
      return { a: "assets/audio/" + file, b: null, gain: tr ? tr.gain : 1 };
    }
    if (key === "final" || key === "congrats") {
      const e = manifest && manifest.music && manifest.music[key];
      if (!e || !e.file) return null;
      return { a: "assets/audio/" + e.file, b: null, gain: trackGain(e) };
    }
    if (manifest && manifest.music && /^\d+$/.test(key)) {
      const idx = String(parseInt(key, 10));
      const lv = manifest.music.levels || {};
      const e = lv[idx] || lv[key];
      if (!e || !e.file) return null;
      return { a: "assets/audio/" + e.file,
        b: e.b ? "assets/audio/" + e.b : null,
        next: e.next ? "assets/audio/" + e.next : null,
        nextKey: e.next ? "file:" + e.next : null,
        next2Key: e.next2 ? "file:" + e.next2 : null,
        next3Key: e.next3 ? "file:" + e.next3 : null,
        gain: trackGain(e) };
    }
    return { a: "assets/audio/music/" + key + "_a.wav",
      b: "assets/audio/music/" + key + "_b.wav", gain: 1 };
  }

  // mode: "once" = play through and stop (title songs)
  //       "cycle" = play through, then encore stages back to back; wraps around to the start
  //       "chain" = a middle/end stage of a cycle: play through, then advance the chain
  //       "loop" = seamless loop forever
  function startMusic(key, mode) {
    if (!ctx) return;
    stopMusicSources();
    curKey = key;
    curLoop = mode;
    const gen = playGen;
    const r = resolveMusic(key);
    if (!r) { curGain = 1; curHasB = false; return; } // silence
    if (mode === "cycle") {
      chain = [key].concat([r.nextKey, r.next2Key, r.next3Key].filter(Boolean));
      chainIdx = 0;
    }
    curGain = r.gain;
    curHasB = !!r.b;
    Promise.all([getBuf(r.a), r.b ? getBuf(r.b) : Promise.resolve(null)]).then((bs) => {
      if (curKey !== key || gen !== playGen) return; // stale
      const la = bs[0] || silentBuffer(2), lb = bs[1] || silentBuffer(2);
      const t = ctx.currentTime + 0.05;
      const looping = mode === "loop";
      srcA = ctx.createBufferSource(); srcA.buffer = la; srcA.loop = looping; srcA.connect(musicA);
      srcB = ctx.createBufferSource(); srcB.buffer = lb; srcB.loop = looping; srcB.connect(musicB);
      srcA.start(t); srcB.start(t);
      mixMusic(mix, 0);
      refreshMusicGain();
      if (mode === "cycle" || mode === "chain") {
        srcA.onended = () => {
          if (gen !== playGen) return;
          encoreTimer = setTimeout(() => {
            encoreTimer = null;
            if (gen !== playGen) return;
            chainIdx = (chainIdx + 1) % chain.length;
            if (chainIdx === 0) startMusic(chain[0], "cycle");
            else { mix = 0; startMusic(chain[chainIdx], "chain"); }
          }, SILENCE_GAP * 1000);
        };
      }
    });
  }

  function stopMusicSources() {
    playGen++;
    if (encoreTimer) { clearTimeout(encoreTimer); encoreTimer = null; }
    for (const s of [srcA, srcB]) {
      if (s) {
        try { s.onended = null; } catch (e) {}
        try { s.stop(); } catch (e) {}
        s.disconnect();
      }
    }
    srcA = srcB = null;
  }

  function playMusicKey(key, mode) {
    titleActive = false;
    mix = 0;
    if (!ctx) { pending = () => { startMusic(key, mode || "cycle"); }; return; }
    startMusic(key, mode || "cycle");
  }

  function levelKey(idx) { return (idx < 10 ? "0" : "") + idx; }

  function playLevelMusic(idx) {
    if (manifest && manifest.music) {
      const e = (manifest.music.levels || {})[String(idx)];
      playMusicKey(e && e.file != null ? levelKey(idx) : null);
      return;
    }
    playMusicKey(levelKey(idx));
  }

  function mixMusic(target0to100, ramp) {
    const v = Math.max(0, Math.min(100, target0to100));
    mix = v;
    if (!ctx) return;
    const r = ramp == null ? RAMP : ramp;
    const t = ctx.currentTime, m = v / 100, mp = settings.music * curGain;
    if (r <= 0) { musicA.gain.value = (1 - m) * mp; musicB.gain.value = m * mp; return; }
    musicA.gain.cancelScheduledValues(t); musicB.gain.cancelScheduledValues(t);
    musicA.gain.setValueAtTime(musicA.gain.value, t);
    musicB.gain.setValueAtTime(musicB.gain.value, t);
    musicA.gain.linearRampToValueAtTime((1 - m) * mp, t + r);
    musicB.gain.linearRampToValueAtTime(m * mp, t + r);
  }

  function setMix(target0to100, ramp) {
    if (!curHasB) { mix = Math.max(0, Math.min(100, target0to100)); return; }
    mixMusic(target0to100, ramp);
  }

  function retrigger() { if (curKey) startMusic(curKey, curLoop); }

  // ---- title song menu
  let titleIdx = 0;
  let titleActive = false;   // title menu owns the music right now?
  function rebuildTitleSongs() {
    const songs = [];
    const m = manifest && manifest.music;
    const tr = m ? m.tracks : null;
    if (tr) {
      const known = Object.keys(tr);
      let ord = Array.isArray(m.order) ? m.order.filter((f) => known.indexOf(f) >= 0) : [];
      for (const f of known) if (ord.indexOf(f) === -1) ord.push(f);
      for (const file of ord) {
        songs.push({ label: (tr[file] && tr[file].label) || file, key: "file:" + file });
      }
    }
    if (!songs.length) songs.push({ label: "SILENCE", key: null }); // only when no songs exist at all
    TITLE_SONGS.length = 0;
    Array.prototype.push.apply(TITLE_SONGS, songs);
    const want = manifest && manifest.music ? manifest.music.title : null;
    if (want) {
      const i = TITLE_SONGS.findIndex((s) => s.key === "file:" + want);
      if (i >= 0) titleIdx = i;
    }
    titleIdx = Math.min(titleIdx, TITLE_SONGS.length - 1);
    if (titleActive) playTitle(); // manifest arrived after the title had started: switch from placeholder to the default song
  }
  function titleSong() { return TITLE_SONGS[Math.min(titleIdx, TITLE_SONGS.length - 1)]; }
  function titleStep(dir) {
    titleIdx = (titleIdx + dir + TITLE_SONGS.length) % TITLE_SONGS.length;
    playTitle();
    return titleSong();
  }
  function playTitle() {
    titleActive = true;
    const s = titleSong();
    if (!s.key) { stopMusicSources(); curKey = null; return; }
    mix = 0;
    if (!ctx) { pending = () => { startMusic(s.key, "cycle"); }; return; }
    startMusic(s.key, "cycle"); // play through; when it finishes, restart it from the beginning
  }

  function playFinalMusic() {
    titleActive = false;
    if (!ctx) { pending = () => { playFinalMusic(); }; return; }
    playMusicKey("final", "loop");
  }

  function playCongratsMusic() {
    titleActive = false;
    if (!ctx) { pending = () => { playCongratsMusic(); }; return; }
    playMusicKey("congrats", "loop");
  }

  // ---- sfx
  function playSfx(name, opts) {
    if (!ctx) return;
    const urls = sfxUrls(name);
    if (rrIdx[name] == null) rrIdx[name] = 0;
    const url = urls[rrIdx[name]];
    rrIdx[name] = (rrIdx[name] + 1) % urls.length;
    const b = bufCache[url];
    if (b === undefined) { getBuf(url); return; } // first request primes cache
    if (!b) return;
    const o = opts || {};
    const now = performance.now();
    if (now - (lastPlay[name] || 0) < 50) return;
    lastPlay[name] = now;
    let slotGain = 1;
    if (manifest && manifest.sfx && manifest.sfx[name] && manifest.sfx[name].gain != null) {
      slotGain = Math.max(0, Math.min(2, manifest.sfx[name].gain));
    }
    const s = ctx.createBufferSource();
    s.buffer = b;
    if (o.rate) s.playbackRate.value = o.rate;
    const g = ctx.createGain();
    g.gain.value = (o.vol == null ? 1 : Math.max(0, Math.min(1, o.vol))) * slotGain;
    s.connect(g);
    if (o.pan && ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = Math.max(-1, Math.min(1, o.pan));
      g.connect(p); p.connect(sfxG);
    } else {
      g.connect(sfxG);
    }
    s.start();
    s.onended = () => { try { s.disconnect(); g.disconnect(); } catch (e) {} };
  }

  function primeSfx() {
    if (!ctx) return;
    for (const ev of SFX_EVENTS) {
      for (const url of sfxUrls(ev)) if (bufCache[url] === undefined) getBuf(url);
    }
  }

  function setVolume(which, val) {
    settings[which] = Math.max(0, Math.min(1, val));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (!ctx) return;
    if (which === "sfx") sfxG.gain.value = settings.sfx;
    else refreshMusicGain(), mixMusic(mix, 0);
  }

  function toggleMute() {
    settings.muted = !settings.muted;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (ctx) masterG.gain.value = settings.muted ? 0 : 1;
    return settings.muted;
  }

  window.WBAudio = {
    SFX_EVENTS, TITLE_SONGS, RAMP,
    unlock,
    playTitle, playLevelMusic, playMusicKey, playFinalMusic, playCongratsMusic, setMix, retrigger,
    titleSong, titleStep,
    playSfx, primeSfx,
    setVolume, toggleMute,
    get settings() { return settings; },
    get mix() { return mix; },
    get manifest() { return manifest; },
  };
})();
