#!/usr/bin/env bash
set -euo pipefail

# Puts the BeetPx logo in the top-right corner of a game cover PNG.
#
# Usage: tools/brand_cover.sh <input.png> <output.png> [-scale:<n>]

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
binary="${repo_dir}/build/tools/brand_cover"

mkdir -p "$(dirname "${binary}")"
odin build "${repo_dir}/tools/brand_cover" -out:"${binary}"

"${binary}" "$@"
