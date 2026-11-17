#!/usr/bin/env bash
# Wavebound local server — audio files need http:// (file:// blocks fetch).
# usage: ./serve.sh [game|editor|audio|flavor|both]   (default: both)
cd "$(dirname "$0")" || exit 1
PORT="${PORT:-8791}"
target="${1:-both}"

port_open() { python3 - "$PORT" <<'PY'
import socket, sys
s = socket.socket()
try:
    s.connect(("127.0.0.1", int(sys.argv[1])))
    s.close()
    sys.exit(0)
except OSError:
    sys.exit(1)
PY
}

open_url() { setsid xdg-open "$1" >/dev/null 2>&1 </dev/null & }

if ! port_open; then
  setsid python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 </dev/null &
  sleep 0.6
fi

case "$target" in
  game)   open_url "http://localhost:$PORT/index.html" ;;
  editor) open_url "http://localhost:$PORT/level_editor.html" ;;
  audio)  open_url "http://localhost:$PORT/audio_editor.html" ;;
  flavor) open_url "http://localhost:$PORT/flavor_editor.html" ;;
  *)      open_url "http://localhost:$PORT/index.html"; open_url "http://localhost:$PORT/level_editor.html"; open_url "http://localhost:$PORT/audio_editor.html" ;;
esac
