declare global {
  const __BEETPX_IS_PROD__: boolean;
}

export { type ImageUrl } from "./Assets";
export {
  CompositeColor,
  SolidColor,
  TransparentColor,
  type Color,
  type ColorId,
} from "./Color";
export { Sprite } from "./Sprite";
export { Utils } from "./Utils";
export { Vector2d } from "./Vector2d";
export { ClippingRegion } from "./draw_api/ClippingRegion";
export { type ColorMapping } from "./draw_api/DrawApi";
export { FillPattern } from "./draw_api/FillPattern";
export { type CharSprite, type Font, type FontId } from "./font/Font";
export { type GameInputEvent } from "./game_input/GameInput";
export { Timer } from "./misc/Timer";

export { transparent_ } from "./Color";
export { spr_ } from "./Sprite";
export { v_ } from "./Vector2d";

export { BeetPx } from "./BeetPx";

// TODO: remove comments from HTMLs from the generated game

// TODO: improve bg color on itch around the game, but under the buttons
