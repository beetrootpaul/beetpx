#!/usr/bin/env bash
set -euo pipefail

# Go to the repo root, since the further script assumes relative paths from it.
cd "$(dirname "${BASH_SOURCE[0]}")/.."

rm -rf ./build/web/
mkdir -p ./build/web/

odin build ./beetpx_examples/basic \
    -target:js_wasm32 \
    -out:build/web/game.wasm
cp "$(odin root)/core/sys/wasm/js/odin.js" ./build/web/odin.js
cp ./beetpx_examples/index.html ./build/web/index.html

echo "Serving ./build/web/ at http://127.0.0.1:8000 ..."
python3 -m http.server 8000 \
    --bind 127.0.0.1 \
    --directory ./build/web/
