WAVEBOUND — Princess of the Sundered Sea          v1.0
====================================================

A 2D mermaid platformer. Pure HTML/JS/canvas — no build step, no dependencies.

RUN IT
  The game loads its audio and save data with fetch(), which browsers block on
  file:// URLs. Serve the folder over HTTP:

    ./serve.sh game          # starts a local server on :8791 and opens the game
                             # (or any static server: `python3 -m http.server` here)

  Opening index.html by double-clicking WILL run, but silent (no audio files).

INSTALL AS AN APP (recommended)
  Serve or host over https (or localhost) and open index.html once. The address
  bar shows an Install button (or menu > Install app). Installed, it opens like
  a native app, fullscreen, and works offline — all songs, sounds and your save
  are cached (saves live in browser storage).

HOSTING OPTIONS for sharing
  - itch.io: zip this folder, upload as "html5 game", done.
  - Netlify / Cloudflare Pages / GitHub Pages: drop the folder as a static site.
    (https is required for the install/offline features to light up.)

CONTROLS
  Arrows/WASD move · SPACE jump (hold to glide with the gull feather) ·
  C run/dash · X smack/tail, Tide Bolt in sea form · E switch sea/land form ·
  ENTER talk/confirm · Tab voyages menu · L test-select any voyage ·
  Esc/O pause · M mute · F fullscreen. Gamepad: stick/D-pad, A jump, B smack,
  Y/RB form, LB/RT dash, Start confirm.

FILES
  index.html          game entry
  game.js             gameplay + screens        levels.js    the 15 voyage defs
  audio.js            music/SFX engine         assets/audio manifest.json, library.json,
                                               sfx_library/, music_library/
  flavor.js/_overrides.js  all in-game text     render.js, level_core.js, wa_npcs*.js
  sw.js + manifest.webmanifest + icons/        PWA offline/install layer
  serve.sh            local dev server helper

  Edit tools (level/audio/flavor/npc editors) live in the source repo, not in
  this release folder.

VERSION 1.0 — 2026-11-17
