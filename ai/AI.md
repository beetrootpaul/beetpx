# AI.md

Starting point for AI coding assistants (Claude, OpenAI Codex, etc.) working
in this repository.

`AGENTS.md` and `CLAUDE.md` in the repository root are symlinks to this file,
`ai/AI.md`. Edit `ai/AI.md` itself; do not replace the symlinks with regular
files.

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
- Never run scripts (e.g. the `run_*.sh` scripts of the examples). Tell the
  user which script to run and with what arguments instead.
- Never commit, amend, or push, whether with git or with jj. This is a
  colocated jj repository, and the user owns all version-control operations:
  do not create, describe, rewrite, abandon, or move changes or bookmarks
  (e.g. `jj new`, `jj describe`, `jj commit`, `jj squash`, `jj abandon`,
  `jj bookmark ...`, `jj git push`). Read-only commands such as `jj log`,
  `jj diff`, `jj show`, and `jj status` are fine. Edit the working tree and
  report what changed; jj snapshotting those edits into `@` is expected.

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

This checkout is on branch `odin`: a from-scratch Odin rewrite of BeetPx, at
an early stage.

**Read `ai/rewrite_status.md` at the start of a session.**
It records what already works, what is temporary, and what has not started,
so you do not have to re-derive that from the code. The file describes the
repository as of the last change that touched it, so the changes it may not
cover yet are the ones after that:

```sh
jj log -r 'heads(::@ & files("ai/rewrite_status.md"))..@'
# Without jj (this misses the uncommitted working-copy change):
git log "$(git log -1 --format=%H -- ai/rewrite_status.md)..HEAD"
```

When your change alters anything the file describes, update the file in the
same change, including its "Last updated" line. Whenever you touch the file,
bring all of it up to date, because the lookup above will treat everything
before that change as covered. Keep it a snapshot of the present, not a
changelog.

Record in it only what the code does not already say: intent, the reasons
behind decisions, rejected alternatives, known problems, and what has been
verified and when. For anything a quick read of a file answers (flag lists,
proc names, the step-by-step logic of a proc), point to that file instead of
restating it, since a restated copy goes stale as soon as the file changes.

The repository layout:

- `beetpx_core/` - the root of the `beetpx` collection. Each subdirectory is a
  package that games import from it by name, e.g. `import "beetpx:bpx"`. Odin
  names an import after the imported directory, not after its `package`
  clause, so a package's directory name is the name games write in code.
  - `bpx/` - the engine package. `bpx.odin` is the facade and holds every
    public declaration; every other file in the package is private (see
    "Code conventions"). Those files are named by topic (`platform`,
    `game_loop`, `draw`). A platform-specific file of a topic is marked
    either by a `_js` suffix, which Odin compiles only for the web, or by a
    `#+build` tag listing the OSes it is for, as `platform_sdl.odin` does for
    `darwin`, `linux` and `windows`.
  - `palettes/` - color palettes games import directly.
  - `beetpx.js` - the JavaScript half of the web platform, next to the
    packages rather than inside one.
- `scripts/` - scripts that check and format `beetpx_core`.
- `beetpx_examples/` - example games (currently `basic/`), plus the
  `index.html` page that hosts the web build.
  - `scripts/` - scripts that check and format all examples. Each lists the
    examples it covers explicitly, in an array.
- `beetpx_examples/basic/run_web.sh` and `beetpx_examples/basic/run_macos.sh`
  build and run that example for each target, writing output to the
  repository root's `build/` (gitignored). There is no CLI yet.
- `ai/` - documents for AI assistants: this file, `rewrite_status.md` (see
  above), and `rewrite_braindump.md`, a large design braindump for the rewrite
  (layer boundaries, flat `bpx.*` API sketch, phased plan). Read the braindump
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
  this rewrite: `js_wasm32` for the browser and native macOS (`darwin_arm64`).
  `scripts/check_core.sh` also checks `beetpx_core` for `linux_amd64` and
  `windows_amd64`, which nothing builds or runs yet.
- `ols` (language server) and `odinfmt` (formatter) are used through the
  `danielgavin.ols` VS Code extension, which bundles its own binaries. They are
  **not** on PATH, so do not invoke them from the shell. Their configuration is
  checked in at the repo root: `ols.json` (registers the `beetpx`
  collection) and `odinfmt.json` (80-column lines, LF line endings). Write Odin
  code that already conforms to those settings.
- Shared editor settings live in `beetpx.code-workspace`. `.vscode/` is
  gitignored and meant for personal, untracked settings, so do not put shared
  configuration there.
- No CI, no linter, and no test suite are configured. Verification is planned
  as `odin test` with `core:testing`, but no tests exist yet.

## Odin language

Whenever you work with Odin, use these as references rather than relying on
recall, since Odin changes often and training data goes stale:

- **Language overview** - the guided tour of the language: syntax, semantics,
  packages, and conditional compilation (file suffixes, `#+build` tags,
  `#config`/`-define`). Start here for "how does Odin do X":
  https://odin-lang.org/docs/overview
- **Official demo** - the reference for code style and idiomatic constructs:
  https://raw.githubusercontent.com/odin-lang/Odin/refs/heads/master/examples/demo/demo.odin
- **Official examples repository** - short, practical programs showing how to
  do specific things, including SDL3 and WASM (which is what the platform
  adapters need). Browse it before designing anything platform-related:
  https://github.com/odin-lang/examples
- **Local Odin installation** - the authoritative source for the standard
  library and the bundled `vendor` packages (e.g. `vendor:sdl3`,
  `vendor:miniaudio`). It always matches the installed compiler, unlike the
  web. Find it with `odin root`, then read the `.odin` sources under
  `base/`, `core/` and `vendor/`. Prefer it over the web for any question
  about an API's signatures or behavior. Note that the Homebrew install does
  not ship `examples/`, so the demo and the examples repository above are
  web-only.
- **Package documentation** - a browsable index of the same `base`, `core` and
  `vendor` packages, generated from their sources. Handy for discovering what
  exists; when it differs from the local sources, trust the local sources:
  https://pkg.odin-lang.org/

## Code conventions

- **Narrowest visibility by default; broader visibility only by explicit
  opt-in.** Start every declaration as private as the language allows, and
  widen it only when something actually needs it. In `beetpx_core/bpx/` this
  means:
  - Every file except `bpx.odin` starts with `#+private file`, so its
    declarations are visible only inside that file.
  - A declaration that another file of the package needs is marked
    `@(private = "package")` (spaced as `odinfmt` formats it). Write it that
    way rather than as plain `@(private)`, which inside such a file reads as
    if it meant "file".
  - Only `bpx.odin`, the facade that games use, declares public names.
    Odin has no attribute that makes a single declaration public inside a
    `#+private file` file, so `bpx.odin` re-exports whatever games need from
    the other files: a type or a constant by an alias
    (`Rgb :: _Color_Rgb`), a proc by a wrapper proc (an alias of a private
    proc stays private), and a variable by an accessor proc
    (`frame_number`).
  - `@(export)` is only for symbols an outside host calls by name, such as
    `step` for `odin.js`. It does not widen Odin-level visibility, so an
    exported proc can stay file-private.
- **Naming of private declarations.** Every private name starts with `_`. A
  name marked `@(private = "package")` is also prefixed with its file's topic,
  e.g. `_game_loop_advance`, `_platform_start`, or `_Color_Rgb` for a type. A
  name that is the topic itself, such as `_Xy`, does not repeat it.
  File-private names have no topic prefix, e.g. `_TICK_HZ` or
  `_accumulated_s`.
- **Comments and docs describe the code on its own terms.** BeetPx Odin will
  ship as the next release of BeetPx, so it has to stand on its own. Do not
  justify or explain anything by reference to v0.56.1, the TypeScript engine,
  `v0.56.1-for-reference/`, or earlier decisions and iterations (e.g. avoid
  "as in v0.56.1's `CanvasForProduction`" or "which v0.56.1 relied on").
  Describe what the code does and why, as if no earlier version existed.
  Consulting `v0.56.1-for-reference/` while porting is still fine; it just
  must not leak into what gets written.
