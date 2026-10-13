#!/usr/bin/env bash
# Builds the host and 3 versions of the game library, then loads them in turn.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

case "$(uname)" in
Darwin) ext=dylib ;;
*) ext=so ;;
esac

mkdir -p out
odin build host -out:out/host
for v in 1 2 3; do
	# The wrapper imports "../game", so point it at this version.
	rm -f game && ln -s "game_v$v" game
	odin build hot -build-mode:dll -define:FW_HOT=true \
		-out:"out/game_v$v.$ext"
done
rm -f game

echo "=== Keep old libraries loaded ==="
./out/host out/game_v{1,2,3}."$ext"
echo
echo "=== Unload old libraries ==="
./out/host --unload-old out/game_v{1,2,3}."$ext" || echo "host exited with $?"
