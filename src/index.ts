declare global {
  const __BEETPX_IS_PROD__: boolean;
}

export { type ImageUrl } from "./Assets";
export {
  CompositeColor,
  MappingColor,
  SolidColor,
  TransparentColor,
  type Color,
  type ColorId,
} from "./Color";
export { Sprite } from "./Sprite";
export { Utils } from "./Utils";
export { Vector2d } from "./Vector2d";
export { type AudioPlaybackId } from "./audio/AudioApi";
export { type SoundSequence } from "./audio/SoundSequence";
export { ClippingRegion } from "./draw_api/ClippingRegion";
export { type ColorMapping } from "./draw_api/DrawApi";
export { FillPattern } from "./draw_api/FillPattern";
export { type CharSprite, type Font, type FontId } from "./font/Font";
export { type ButtonName } from "./game_input/Buttons";
export { type GameInputEvent } from "./game_input/GameInput";
export { Timer } from "./misc/Timer";

export { transparent_ } from "./Color";
export { spr_ } from "./Sprite";
export { v_ } from "./Vector2d";

export { BeetPx } from "./BeetPx";

// TODO: remove comments from HTMLs from the generated game

// TODO: improve bg color on itch around the game, but under the buttons

// TODO: refactor HTML templates, rework canvas vs buttons layout vs screen orientation

// TODO: remove ability to select touch button's text

// TODO: fire pause menu event whenever browser tab is switched

// TODO: iOS Safari: prevent selection of button text on long touch

// TODO: make it possible to show game cover before the game loads

// TODO: consider adding own start button (auto-focused) and make it auto-load in itch. And make sure this makes audio context always work

// TODO: test out a flow in which I work with assets while working on game and have fast feedback loop. Maybe run a watcher on Aseprite file and run its CLI to export to `public/`?
