#!/usr/bin/env bash
set -euo pipefail

# Formats all Odin code of this repo in place, with the settings from
# `odinfmt.json`. Assumes `odinfmt` is available on PATH.

# Go to the repo root, since the further script assumes relative paths from it.
cd "$(dirname "${BASH_SOURCE[0]}")"

odinfmt -w ./beetpx_core
odinfmt -w ./beetpx_examples
