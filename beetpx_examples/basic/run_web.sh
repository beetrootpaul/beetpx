#!/usr/bin/env bash
set -euo pipefail

# TODO: Stay in the example's directory instead?
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

# TODO: Hide most of this script boilerplate in BeetPx CLI.
# TODO: Make it run on Windows too, e.g. with a `.bat` file?

rm -rf ./build/web/
mkdir -p ./build/web/

# TODO: Make the CLI's builds much more forgiving.
# TODO: Name the WASM file after the game.
odin build ./beetpx_examples/basic \
	-collection:beetpx=./beetpx_core/ \
	-disable-non-constant-globals \
	-strict-style \
	-vet \
	-vet-cast \
	-vet-tabs \
	-vet-packages:main \
	-vet-using-param \
	-vet-using-stmt \
	-warnings-as-errors \
	-target:js_wasm32 \
	-out:build/web/beetpx_game.wasm
cp "$(odin root)/core/sys/wasm/js/odin.js" ./build/web/odin.js
cp ./beetpx_core/beetpx.js ./build/web/beetpx.js
cp ./beetpx_examples/index.html ./build/web/index.html

echo "Serving ./build/web/ at http://127.0.0.1:8000 ..."
python3 -m http.server 8000 \
	--bind 127.0.0.1 \
	--directory ./build/web/
