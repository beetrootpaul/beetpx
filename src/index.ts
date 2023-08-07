/// <reference path="./__IS_PROD__.d.ts" />

export {
  CompositeColor as BpxCompositeColor,
  SolidColor as BpxSolidColor,
  TransparentColor as TransparentColor,
  type Color as BpxColor,
  type ColorId as BpxColorId,
} from "./Color";
export { Sprite as BpxSprite } from "./Sprite";
export { Utils as BpxUtils } from "./Utils";
export { Vector2d as BpxVector2d } from "./Vector2d";
export { ClippingRegion as BpxClippingRegion } from "./draw_api/ClippingRegion";
export { FillPattern as BpxFillPattern } from "./draw_api/FillPattern";
export {
  type CharSprite as BpxCharSprite,
  type Font as BpxFont,
} from "./font/Font";
export { type GameInputEvent as BpxGameInputEvent } from "./game_input/GameInput";

export { transparent_ } from "./Color";
export { spr_ } from "./Sprite";
export { v_ } from "./Vector2d";

export { BeetPx } from "./BeetPx";

// TODO: remove comments from HTMLs from the generated game

// TODO: do not emit tests

// TODO: improve bg color on itch around the game, but under the buttons
