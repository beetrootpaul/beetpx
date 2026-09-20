# Pause and Restart

This example shows how to use built-in game pause feature, how to
render a pause menu, and how to control which music and animations
should honor the game pause.

Controls:

- press Menu button (`P`/`return`/`esc` on a keyboard) to pause the game;
- inside the pause menu, press Menu button to resume the game,
- inside the pause menu, press up/down to select the menu item, then A button (`C`/`J` on a keyboard) to activate it (either resume the game, mute/unmute audio, or restart the game).

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