export { BpxCompositeColor, BpxMappingColor, BpxSolidColor, BpxTransparentColor, } from "./Color";
export { BpxEasing } from "./Easing";
export { BpxSprite } from "./Sprite";
export { BpxUtils } from "./Utils";
export { BpxVector2d } from "./Vector2d";
export { BpxClippingRegion } from "./draw_api/ClippingRegion";
export { BpxFillPattern } from "./draw_api/FillPattern";
export { BpxTimer } from "./misc/Timer";
export { BeetPx } from "./BeetPx";
export { b_ } from "./BeetPx";
export { transparent_ } from "./Color";
export { spr_ } from "./Sprite";
export { u_ } from "./Utils";
export { v_, v_0_0_, v_1_1_ } from "./Vector2d";
export { timer_ } from "./misc/Timer";
// TODO: remove comments from HTMLs from the generated game
// TODO: improve bg color on itch around the game, but under the buttons
// TODO: refactor HTML templates, rework canvas vs buttons layout vs screen orientation
// TODO: remove ability to select touch button's text
// TODO: fire pause menu event whenever browser tab is switched
// TODO: iOS Safari: prevent selection of button text on long touch
// TODO: make it possible to show game cover before the game loads
// TODO: consider adding own start button (auto-focused) and make it auto-load in itch. And make sure this makes audio context always work
// TODO: test out a flow in which I work with assets while working on game and have fast feedback loop. Maybe run a watcher on Aseprite file and run its CLI to export to `public/`?
// TODO: write down a checklist of things to test manually, eg. game controllers support or browser tab close prevention
// TODO: expose a global variable with a BeetPx version. Or at least `BeetPx.version`
// TODO: make it possible to customize iframe bg and maybe to style the canvas itself as well, since for example a border in a given color might suite a game as well
// TODO: suggested tsconfig changes:
//       - moduleDetection force https://www.typescriptlang.org/tsconfig#moduleDetection
//       - isolated modules https://www.typescriptlang.org/tsconfig#isolatedModules
//       - verbatim module syntax https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax
// TODO: consider adding a desktop build, e.g. in Electron
// TODO: remember which input methods was used recently and expose that info so the game can show the proper button image
// TODO: reconsider what to show as text copy or glyphs on touch buttons
// TODO: sometimes the canvas gets stretched after screen orientation change. Fix that
// TODO: consider regenerating docs and compiled files only on released versions. Like: have a version
//       bump script which asks whether it's major or minor or patch and checks if we are on `main`, then
//       generates docs etc. before the commit
