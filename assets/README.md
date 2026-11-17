# Wavebound — Asset Workflow

This document defines how game assets are produced, organized, and named for
the Wavebound project. The repository root is `/home/derik/Work/wavebound`.

## Directory Layout

```
assets/
  sprites/
    player/      # Player character(s)
    enemies/     # Enemy sprites
    npcs/        # Non-player characters
    objects/     # Interactive/prop objects
  tiles/         # Tile sets used by levels
  backgrounds/   # Backdrops, parallax layers
  effects/       # Particles, VFX, animations
  ui/            # HUD, menus, icons, cursors
```

## Source vs. Exported Artwork

- **Keep source pixel art editable.** Store Pixelorama project files
  (`.pxo`) alongside their exports so sprites can be reworked later.
- **Separate source from game-ready output.** Exported, game-ready PNGs live
  in the directories above. Source/editable files belong in an `src/`
  subdirectory next to the export (e.g. `assets/sprites/player/src/`) or in
  a dedicated location agreed on during development.
- Never ship `.pxo` files as game assets; the game only loads PNGs.

## Format Rules

- Use **transparent PNGs** for any sprite that does not fill its full frame
  (characters, enemies, effects). `8-bit/color RGBA` is the expected format.
- Keep all frames of an animation the same size.

## Established Conventions

- Canvas / game resolution: **960 × 540**.
- Character sprites: **200 × 200** px per frame.
- Naming pattern: `<animation>_<frame>.png` (e.g. `idle_1.png`, `run_3.png`).
- Sprite sets live under `assets/sprites/<category>/<character>/` and are
  declared in `game.js` in the `SPRITE_SETS` map (dir + per-animation frame
  counts). Adding a character = drop PNGs + add one entry.
- `ref/` at the repo root holds reference imagery (not shipped).

## Current Characters

### Otter NPCs (`assets/sprites/npcs/otter/`)

- Two town NPCs (Old Merell the elder, Pip the kid) share one sprite set,
  drawn at different scales at runtime.
- Animations: `idle` ×4, `run` ×3.
- Palette (matches the mermaid player):
  - `#ff8fa6` main fur (her dress)
  - `#2fb8c8` fur shadow / teal accent (her tail)
  - `#f7c8a8` belly / muzzle (her skin)
  - `#ffb3ca` ears (her hair)
  - `#2a1a2a` outline, nose, eyes (her eye dark)

### Pixelorama Workflow (`.pxo` sources)

- Editable sources live in `assets/sprites/npcs/otter/src/`:
  - `idle.pxo` — 4 frames
  - `run.pxo` — 3 frames
- Edit the `.pxo` in Pixelorama, then export PNG frames back over the PNGs:
  File → Export… (Image tab), set file name `idle` / `run` and **number of
  digits = 1** so frames land as `idle_1.png` … `idle_4.png` (and
  `run_1.png` … `run_3.png`), matching the names the game loads.
- Game only loads the PNGs — `.pxo` files are never shipped.

## AI-Generated Assets

- AI-generated or AI-assisted assets must be **reviewed and cleaned up
  manually** (pixels, palette, transparency, animation consistency) before
  they are considered final.
- Treat any AI output as a rough draft until it passes manual cleanup.

## Level Authoring

### In-browser Level Editor (`level_editor.html`)

- Open `level_editor.html` directly in a browser (works from `file://`).
- Paint tiles, place pickups/enemies/NPCs, add doors/switches/currents/
  updrafts/bosses, then **Copy def** or **Download levels.js**.
- `Download levels.js` emits a full `levels.js` replacement: the original
  levels (re-serialized, gameplay-identical) plus your edited/new level.

### Shared Modules

The game's level-building and entity rendering live in two shared files so
the game and the editor stay in sync:

- `level_core.js` — `window.WAVEBOUND_LEVEL_CORE.build(def)` produces the
  tile grids (`solid/plat/wat/climb/cloud`), pickups, enemies, NPCs, doors,
  switches, currents, updrafts, and gates from a level def.
- `render.js` — `window.WAVEBOUND_RENDER` exposes the canvas draw routines
  (`drawPearl`, `drawCrab`, `drawJelly`, `drawUnknown`, …) with `ctx` as the
  first argument, plus the theme `PAL` map. The editor reuses these so
  palette icons and in-level previews match the game exactly.

Script order in `index.html` is: `render.js`, `level_core.js`, `wa_npcs.js`,
`wa_npc_custom.js`, `levels.js`, `game.js`.

### Placeholder Entities

The editor palette includes placeholder types that serialize into levels but are
not yet implemented in the game:

- Pickups: `kelp`, `crown`
- Enemies: `spike`, `seaghost`
- NPC: `stranger`

In-game they render as a ghostly dashed `?` (via `R.drawUnknown`) and are
harmless — placeholder enemies deal no damage and placeholders pickups only
give a small score. Implement them by adding a `draw*` function in
`render.js` and a behaviour branch in `game.js`/`level_core.js`.

## Keys & Colored Gates

- Seven rainbow gate colors: `red`, `orange`, `yellow`, `green`, `blue`,
  `indigo`, `violet` (defined in `render.js` as `RAINBOW`/`KEY_COLORS`).
- Gates are built with `g.door(c, r0, r1, "color")`. They stay closed until the
  player collects the matching key pickup (`key_red`, `key_blue`, …).
- Keys are **session-only**: collecting one lets you open any matching gate in
  the current run; they reset on death/level reload.
- The old switch/pearl-gate system was removed — every door is now a key gate.

## Sun Shade Areas

- Build with `g.shade(c0, c1, r0, r1)` to mark a rectangle. While the player
  stands inside it, the sun disc is hidden and the sky darkens.
- Only applies in non-underwater levels (the sun only exists there).
- Editor tool: **Sun shade** (drag a rectangle, like currents/updrafts).

## Otter Stones & Pip's Quest

- Two quest pickups: `stone_white` and `stone_black` (found in Twintail Town).
- They persist in the save once collected (HUD shows a stones indicator).
- Give an NPC the `quest: "stones"` flag (see Pip in `levels.js`). Talking to
  that NPC while holding both stones unlocks the BOLT ability early.

## Treasure Chests

- Build with `chests: [{ c, r, reward }]`, where reward is `\{ tix: N \}` or
  `{ unlock: "bolt" | "jump" }`.
- A chest opens when struck by a player attack (tail smack or bolt). It opens
  once, stays open, and the opened state is persisted in the save.
- Editor tool: **Treasure chest** (reward = tix amount or an unlock).

## Audio (Music & SFX)

Files live under `assets/audio/` and are picked up by name at runtime —
missing files are silent placeholders, so the game runs before any audio
exists.

### Music (`assets/audio/music/`)

- One **aligned stem pair per level**, crossfaded by save stations:
  `<level-index, 2 digits>_a.wav` and `_b.wav` — `00_a.wav`/`00_b.wav`
  is SHALLOW SHORE (index = position in `levels.js`).
- Pair must be same length, same tempo, same start; the engine loops both
  in sample-accurate phase and only balances their gains.
- Use **WAV, 44.1 kHz, stereo** (no MP3 codec padding — loops stay seamless).
- Mix balance is 0–100 (0 = track A, 100 = track B). Each save station
  carries its own target (`mix`), ramped over 4 s by default.
- Title screen: `title_a.wav`/`title_b.wav`. The title has a song-select
  menu; until real songs are listed there, the only entry is "SILENCE".

### Sound effects (`assets/audio/sfx/`)

- `<event>.wav` (wav/mp3/ogg all fine — one-shots), keep ≤ 2 s, peak-normalized.
- Wired events: `jump`, `land`, `splash`, `swim`, `ticket`, `conch`, `key`,
  `door`, `chest`, `hit`, `kill`, `save`, `talk`, `boss`, `win`, `die`,
  `select`, `back`.