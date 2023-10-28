import { FontAsset, ImageAsset } from "../Assets";
import {
  BpxColorId,
  BpxCompositeColor,
  BpxMappingColor,
  BpxSolidColor,
  BpxTransparentColor,
} from "../Color";
import { BpxCharSprite } from "../font/Font";
import { BpxSprite } from "../Sprite";
import { BpxVector2d } from "../Vector2d";
import { BpxCanvasPixelsSnapshotId } from "./canvas_pixels/CanvasPixelsSnapshot";
import { BpxClippingRegion } from "./ClippingRegion";
import { BpxFillPattern } from "./FillPattern";

export type DrawCommand =
  | DrwCmdTakeCanvasSnapshot
  | DrwCmdClear
  | DrwCmdPixel
  | DrwCmdPixels
  | DrwCmdLine
  | DrwCmdRect
  | DrwCmdEllipse
  | DrwCmdSprite
  | DrwCmdText;

export type DrwCmdTakeCanvasSnapshot = {
  type: "take_canvas_snapshot";
  snapshotId: BpxCanvasPixelsSnapshotId;
};

export type DrwCmdClear = {
  type: "clear";
  color: BpxSolidColor;
  clippingRegion: BpxClippingRegion | null;
};

export type DrwCmdPixel = {
  type: "pixel";
  xy: BpxVector2d;
  color: BpxSolidColor;
  fillPattern: BpxFillPattern;
  clippingRegion: BpxClippingRegion | null;
};

export type DrwCmdPixels = {
  type: "pixels";
  xy: BpxVector2d;
  bits: string[];
  color: BpxSolidColor;
  clippingRegion: BpxClippingRegion | null;
};

export type DrwCmdLine = {
  type: "line";
  xy: BpxVector2d;
  wh: BpxVector2d;
  color: BpxSolidColor | BpxCompositeColor | BpxMappingColor;
  fillPattern: BpxFillPattern;
  clippingRegion: BpxClippingRegion | null;
};

export type DrwCmdRect = {
  type: "rect";
  xy: BpxVector2d;
  wh: BpxVector2d;
  color: BpxSolidColor | BpxCompositeColor | BpxMappingColor;
  fill: boolean;
  fillPattern: BpxFillPattern;
  clippingRegion: BpxClippingRegion | null;
};

export type DrwCmdEllipse = {
  type: "ellipse";
  xy: BpxVector2d;
  wh: BpxVector2d;
  color: BpxSolidColor | BpxCompositeColor | BpxMappingColor;
  fill: boolean;
  fillPattern: BpxFillPattern;
  clippingRegion: BpxClippingRegion | null;
};

export type DrwCmdSprite = {
  type: "sprite";
  sourceImageAsset: ImageAsset;
  sprite: BpxSprite;
  targetXy: BpxVector2d;
  scaleXy: BpxVector2d;
  spriteColorMapping: Map<BpxColorId, BpxSolidColor | BpxTransparentColor>;
  fillPattern: BpxFillPattern;
  clippingRegion: BpxClippingRegion | null;
};

export type DrwCmdText = {
  type: "text";
  text: string;
  canvasXy: BpxVector2d;
  fontAsset: FontAsset;
  color: BpxSolidColor | ((charSprite: BpxCharSprite) => BpxSolidColor);
  clippingRegion: BpxClippingRegion | null;
};
