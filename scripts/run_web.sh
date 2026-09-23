#!/usr/bin/env bash
set -euo pipefail

# Go to the repo root, since the further script assumes relative paths from it.
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# TODO: Hide most of this script boilerplate in BeetPx CLI.
# TODO: Make the script cross-platform. Right now it won't run on Windows, right?

rm -rf ./build/web/
mkdir -p ./build/web/

# TODO: WASM file named after the specific game itself.
odin build ./beetpx_examples/basic \
	-collection:beetpx_core=./beetpx_core/ \
	-target:js_wasm32 \
	-out:build/web/beetpx_game.wasm
cp "$(odin root)/core/sys/wasm/js/odin.js" ./build/web/odin.js
cp ./beetpx_examples/index.html ./build/web/index.html

echo "Serving ./build/web/ at http://127.0.0.1:8000 ..."
python3 -m http.server 8000 \
	--bind 127.0.0.1 \
	--directory ./build/web/
