# AI.md

Starting point reference for AI coding assistants (Claude, OpenAI Codex, etc.) working in this repository.

`AGENTS.md` and `CLAUDE.md` are symlinks to this file. Edit `AI.md` itself; do
not replace the symlinks with regular files.

## Working agreement

- The user should be the main author of ideas in the codebase.
- Roles the user wants AI for:
  1. **Code review** - review code the user wrote and suggest improvements.
  2. **English writing help** - write or polish English text, e.g. READMEs,
     other MDs, or documenting comments in the code, since English is not the
     user's native language.
  3. **Mundane, repetitive, non-creative tasks** - e.g. renaming dozens of
     files, or refactoring code in ways that IDE tooling does not support well.
- Writing implementation code is fine when the user names the file/API and the
  scope. Do not invent architecture or widen API surface on your own.
- Never install packages or tools (e.g. via `brew`, `npm`) without the user's
  explicit permission first.
- Never run scripts (e.g. anything under `scripts/`). Tell the user which
  script to run and with what arguments instead.
- Never commit, amend, or push. The user owns all git operations; edit the
  working tree and report what changed.

## Licensing and third-party code

The Odin code in this repository is released under the zlib license (see
`LICENSE`). `README.md` additionally reserves the "BeetPx" name and logo, which
the code license does not cover.

- **Keep the copyright year in `LICENSE` current, without being asked.** The
  notice reads `Copyright (c) 2026 Beetroot Paul`. Whenever you make a
  substantive change to this repository's own code or docs, compare the end
  year of that notice against the current year. If the current year is later,
  extend the notice to a range (`2026-2027`, then `2026-2028`, and so on) in
  the same change, and mention it in your summary. Determine the current year
  from the system date reported in your environment - **never** from your own
  training data, which is routinely out of date. Leave the `LICENSE` files
  under `v0.56.1-for-reference/` alone; those notices are frozen.
- **Never add, vendor, or propose a third-party library, code snippet, font, or
  asset without first identifying its license, stating it explicitly, and
  asking for permission.** This is part of the "never install packages without
  explicit permission" rule, not separate from it.
- Acceptable licenses are permissive ones that are safe to ship inside a
  closed-source commercial game: zlib, MIT, MIT-0, BSD-2-Clause, BSD-3-Clause,
  ISC, Unlicense, CC0, or public domain. Apache-2.0 is usable, but flag its
  `NOTICE`/attribution obligations before it is adopted.
- **Do not introduce copyleft or source-available dependencies**: GPL, LGPL,
  AGPL, MPL, BUSL, PolyForm, SSPL, or any non-commercial (e.g. CC BY-NC)
  terms. Raise it with the user instead. LGPL is doubly unsuitable here,
  because Odin links statically by default.
- Do not copy code from other engines, frameworks, tutorials, or Stack
  Overflow into this repository. This includes generated code that reproduces
  a known implementation. If any contribution is derived from an external
  source, say so and name the source and its license.
- When vendoring is approved, keep the upstream license file next to the
  vendored code and record it in the project's third-party notices.
- Do not add per-file license headers unless asked to.
- `v0.56.1-for-reference/` keeps its own MIT `LICENSE` files. Do not relicense,
  rewrite, or remove them.
- Planned adapter dependencies and their licenses at the time of writing: SDL3
  (zlib) and miniaudio (dual MIT-0 / public domain); Odin's own `core`/`vendor`
  packages are BSD-3-Clause. Re-verify the current license at the moment of
  vendoring rather than trusting this list.

## Repository state

This checkout is on branch `v2`: a from-scratch Odin rewrite of BeetPx.

- **There is no Odin source yet** - zero `.odin` files. Do not go looking for
  `src/`, a `beetpx` package, or a CLI; they are still unwritten.
- `other/cross-platform-rewrite-llm-braindump.md` - large design braindump for
  the rewrite (layer boundaries, flat `bpx.*` API sketch, phased plan). Read it
  for context, but treat it as a **non-binding draft**: do not quote it as a
  rule the user must follow, and do not edit it unless asked.
- `v0.56.1-for-reference/` - frozen snapshots of the current engine
  (`beetpx/`), its examples (`beetpx-examples/`), and the project generator
  (`beetpx-npm-init-game/`). They have no git history of their own and exist
  only to inspect behavior while porting. Do not modify them, and do not run
  `npm install` there: `beetpx`'s `postinstall` runs `npx playwright install`.
  Their husky hooks were deliberately removed, so `pre_commit_hook.sh` no
  longer fires - that is intended, not a bug to fix.

## Toolchain

- `odin` is already on PATH (homebrew, `dev-2026-09`). Relevant targets for
  this rewrite: `js_wasm32` for the browser and native macOS.
- No CI, no linter, no formatter, and no test suite are configured. `odinfmt`
  and `ols` are **not** installed, so do not invoke them or assume a
  format/typecheck step exists. Verification is planned as `odin test` with
  `core:testing`, but no tests exist yet.

## Odin language

Whenever you work with Odin, use these as references rather than relying on
recall, since Odin changes often and training data goes stale:

- **Language overview** - the guided tour of the language: syntax, semantics,
  packages, and conditional compilation (file suffixes, `#+build` tags,
  `#config`/`-define`). Start here for "how does Odin do X":
  https://odin-lang.org/docs/overview
- **Official demo** - the reference for code style and idiomatic constructs:
  https://raw.githubusercontent.com/odin-lang/Odin/refs/heads/master/examples/demo/demo.odin
