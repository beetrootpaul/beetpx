# Input Tester

This example serves as a quick way to test game inputs,
both keyboard ones and gamepads. The latter are especially important
here, since the key mapping varies between game controllers,
web browsers and operating systems.

The dashed line at the edge of the canvas indicate which game input type
(a keyboard or a gamepad) was detected the last. The way it could be 
leveraged in a real game would be to show either keyboard or gamepad
controls to the player depending on what do they use to play the game.

When in debug mode (entered with a semicolon on the keyboard),
the alternative screen appears, showing details of up to 3 connected
game controllers. What it presents are detected gamepad
buttons. First, there are two rows of regular buttons
(with a colored square indicating the full press was detected
and a cross/plus indicated a half-press).
Next, there are 7 axis of precise "buttons" like D-pad
or triggers.

In the debug mode, there is also an indication of a detected
gamepad type, as well as a detected web browser (and whether
it's Windows or not, when it comes to Firefox). Those are
dictated by differences between gamepad mappings I experienced so far.

You can also try this example out as a tool published on itch.io: https://beetrootpaul.itch.io/beetpx-input-tester

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

### `npm run build`

Creates a production build of the project.

### `npm run prod`

Creates a production build of the project, serves it, and opens
it in a web browser.

### `npm run zip`

Creates a production build fo the project, then creates a zip
archive out of its files. Such package is ready to be used e.g. on https://itch.io .

