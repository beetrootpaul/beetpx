# Canvas Snapshot

This example demonstrates usage of `$d.takeCanvasSnapshot()` and
`BpxCanvasSnapshotColorMapping` in order to modify already drawn pixels.
This might come handy when e.g. implementing a light source mechanics.

Use keyboard arrows to move one of the light sources around.

## Quick Start

```
npm install
npm start
```

## Commands

### `npm start`

Runs the project in dev mode, serves it, and opens it in a web browser.
The watch mode is enabled, meaning any change to the source code or assets
will make the webpage reload.

### `npm run prod`

Creates a production build of the project, serves it, and opens
it in a web browser.

### `npm run zip`

Creates a production build fo the project, then creates a zip
archive out of its files. Such package is ready to be used e.g. on https://itch.io .

### `npm run tsc`

Checks the project in term of its TypeScript types.

#### `npm run tsc:watch`

Similar to `npm run tsc`, but in a watch mode – helpful
when you constantly change the code and want to constantly
see whether your types usage is correct or not.

Typically, you would run `npm run tsc:watch` in a separate
terminal window, alongside `npm start.