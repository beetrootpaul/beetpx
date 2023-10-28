import { Assets, FontAsset } from "../Assets";
import {
  BpxColorId,
  BpxCompositeColor,
  BpxMappingColor,
  BpxSolidColor,
  BpxTransparentColor,
} from "../Color";
import { BpxSprite } from "../Sprite";
import { BpxUtils, u_ } from "../Utils";
import { BpxVector2d, v_, v_1_1_ } from "../Vector2d";
import { BpxCharSprite, BpxFont, BpxFontId } from "../font/Font";
import { Logger } from "../logger/Logger";
import { BpxClippingRegion } from "./ClippingRegion";
import { DrawClear } from "./DrawClear";
import { DrawCommand } from "./DrawCommand";
import { DrawEllipse } from "./DrawEllipse";
import { DrawLine } from "./DrawLine";
import { DrawPixel } from "./DrawPixel";
import { DrawPixels } from "./DrawPixels";
import { DrawRect } from "./DrawRect";
import { DrawSprite } from "./DrawSprite";
import { DrawText } from "./DrawText";
import { BpxFillPattern } from "./FillPattern";
import { CanvasPixels } from "./canvas_pixels/CanvasPixels";
import { BpxCanvasPixelsSnapshotId } from "./canvas_pixels/CanvasPixelsSnapshot";

// TODO: BpxColorMapping and BpxMappingColor are named way too similar, while doing different things!
export type BpxColorMapping = Array<{
  from: BpxSolidColor;
  to: BpxSolidColor | BpxTransparentColor;
}>;

type DrawApiOptions = {
  canvasPixels: CanvasPixels;
  assets: Assets;
};

// TODO: rework DrawAPI to make it clear which modifiers (pattern, mapping, clip, etc.) affect which operations (line, rect, sprite, etc.)

// TODO: tests for float rounding: different shapes and sprites drawn for same coords should be aligned visually, not off by 1.
//       It's especially about cases where we should round xy+wh instead of xy first and then wh separately.

export class DrawApi {
  #queues: DrawCommand[][] = [[]];

  readonly #assets: Assets;

  readonly #canvasPixels: CanvasPixels;

  readonly #clear: DrawClear;
  readonly #pixel: DrawPixel;
  readonly #pixels: DrawPixels;
  readonly #line: DrawLine;
  readonly #rect: DrawRect;
  readonly #ellipse: DrawEllipse;
  readonly #sprite: DrawSprite;
  readonly #text: DrawText;

  #cameraOffset: BpxVector2d = v_(0, 0);

  #clippingRegion: BpxClippingRegion | null = null;
  #fillPattern: BpxFillPattern = BpxFillPattern.primaryOnly;

  #fontAsset: FontAsset | null = null;

  readonly #spriteColorMapping: Map<
    BpxColorId,
    BpxSolidColor | BpxTransparentColor
  > = new Map();

  constructor(options: DrawApiOptions) {
    this.#assets = options.assets;

    this.#canvasPixels = options.canvasPixels;

    this.#clear = new DrawClear(options.canvasPixels);
    this.#pixel = new DrawPixel(options.canvasPixels);
    this.#pixels = new DrawPixels(options.canvasPixels);
    this.#line = new DrawLine(options.canvasPixels);
    this.#rect = new DrawRect(options.canvasPixels);
    this.#ellipse = new DrawEllipse(options.canvasPixels);
    this.#sprite = new DrawSprite(options.canvasPixels);
    this.#text = new DrawText(options.canvasPixels);
  }

  // TODO: cover it with tests, e.g. make sure that fill pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
  // TODO: consider returning the previous offset
  setCameraOffset(offset: BpxVector2d): void {
    this.#cameraOffset = offset;
  }

  setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void {
    this.#clippingRegion = new BpxClippingRegion(xy, wh);
  }

  removeClippingRegion(): void {
    this.#clippingRegion = null;
  }

  // TODO: rename it? "fill" suggests it would apply to filled shapes only, but we apply it to contours as well
  // TODO: cover it with tests
  setFillPattern(fillPattern: BpxFillPattern): void {
    this.#fillPattern = fillPattern;
  }

  // TODO: rename to `setSpriteColorMapping`?
  // TODO: make it more clear this fn is additive and `mapSpriteColor([])` does NOT reset the current mapping
  // TODO: super confusing: 1) prevMapping = mapSpriteColors(…) 2) mapSpriteColors(other) 3) mapSpriteColors(prevMapping) DOES NOT reset 2nd call
  // TODO: ability to remove all mappings
  // TODO: cover it with tests
  mapSpriteColors(mapping: BpxColorMapping): BpxColorMapping {
    const previous: BpxColorMapping = [];
    mapping.forEach(({ from, to }) => {
      previous.push({
        from,
        to: this.#spriteColorMapping.get(from.id) ?? from,
      });
      // TODO: consider writing a custom equality check function
      if (from.id === to.id) {
        this.#spriteColorMapping.delete(from.id);
      } else {
        this.#spriteColorMapping.set(from.id, to);
      }
    });
    return previous;
  }

  clearCanvas(color: BpxSolidColor): void {
    // TODO: encapsulate queues logic
    // Canvas clear usually happens first among all the draw calls
    //   and only once. We decided to keep it simple and therefore
    //   canvas clear does *not* check whether given pixel is
    //   already set by a some shape on top of it. Instead
    //   we keep it in a separate draw queue and just clear
    //   an entire canvas.
    this.#queues.push([
      {
        type: "clear",
        color: color,
        clippingRegion: this.#clippingRegion,
      },
    ]);
    // And let's create a next empty queue for subsequent commands in order
    //   for the canvas clear to be done immediately and not at the end of
    //   the queue.
    this.#queues.push([]);
  }

  pixel(xy: BpxVector2d, color: BpxSolidColor): void {
    // TODO: encapsulate queues logic
    this.#queues[this.#queues.length - 1]!.push({
      type: "pixel",
      xy: xy.sub(this.#cameraOffset),
      color: color,
      fillPattern: BpxFillPattern.primaryOnly,
      clippingRegion: this.#clippingRegion,
    });
  }

  // bits = an array representing rows from top to bottom, where each array element
  //        is a text sequence of `0` and `1` to represent drawn and skipped pixels
  //        from left to right.
  pixels(xy: BpxVector2d, color: BpxSolidColor, bits: string[]): void {
    this.#queues[this.#queues.length - 1]!.push({
      type: "pixels",
      xy: xy.sub(this.#cameraOffset),
      bits: bits,
      color: color,
      clippingRegion: this.#clippingRegion,
    });
  }

  line(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#queues[this.#queues.length - 1]!.push({
      type: "line",
      xy: xy.sub(this.#cameraOffset),
      wh: wh,
      color: color,
      fillPattern: this.#fillPattern,
      clippingRegion: this.#clippingRegion,
    });
  }

  rect(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#queues[this.#queues.length - 1]!.push({
      type: "rect",
      xy: xy.sub(this.#cameraOffset),
      wh: wh,
      color: color,
      fill: false,
      fillPattern: this.#fillPattern,
      clippingRegion: this.#clippingRegion,
    });
  }

  rectFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#queues[this.#queues.length - 1]!.push({
      type: "rect",
      xy: xy.sub(this.#cameraOffset),
      wh: wh,
      color: color,
      fill: true,
      fillPattern: this.#fillPattern,
      clippingRegion: this.#clippingRegion,
    });
  }

  ellipse(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#queues[this.#queues.length - 1]!.push({
      type: "ellipse",
      xy: xy.sub(this.#cameraOffset),
      wh: wh,
      color: color,
      fill: false,
      fillPattern: this.#fillPattern,
      clippingRegion: this.#clippingRegion,
    });
  }

  ellipseFilled(
    xy: BpxVector2d,
    wh: BpxVector2d,
    color: BpxSolidColor | BpxCompositeColor | BpxMappingColor,
  ): void {
    this.#queues[this.#queues.length - 1]!.push({
      type: "ellipse",
      xy: xy.sub(this.#cameraOffset),
      wh: wh,
      color: color,
      fill: true,
      fillPattern: this.#fillPattern,
      clippingRegion: this.#clippingRegion,
    });
  }

  // TODO: make sprite make use of fillPattern as well?
  sprite(
    sprite: BpxSprite,
    canvasXy: BpxVector2d,
    scaleXy: BpxVector2d = v_1_1_,
  ): void {
    const sourceImageAsset = this.#assets.getImageAsset(sprite.imageUrl);
    this.#queues[this.#queues.length - 1]!.push({
      type: "sprite",
      sourceImageAsset: sourceImageAsset,
      sprite: sprite,
      targetXy: canvasXy.sub(this.#cameraOffset),
      scaleXy: scaleXy,
      spriteColorMapping: new Map<
        BpxColorId,
        BpxSolidColor | BpxTransparentColor
      >(this.#spriteColorMapping.entries()),
      fillPattern: this.#fillPattern,
      clippingRegion: this.#clippingRegion,
    });
  }

  // TODO: cover it with tests
  setFont(fontId: BpxFontId | null): void {
    this.#fontAsset = fontId ? this.#assets.getFontAsset(fontId) : null;
  }

  getFont(): BpxFont | null {
    return this.#fontAsset?.font ?? null;
  }

  // TODO: !!! MOVE TO QUEUE !!!
  // TODO: cover with tests
  print(
    text: string,
    canvasXy: BpxVector2d,
    color: BpxSolidColor | ((charSprite: BpxCharSprite) => BpxSolidColor),
    centerXy: [boolean, boolean] = [false, false],
  ): void {
    if (centerXy[0] || centerXy[1]) {
      const size = BpxUtils.measureText(text);
      canvasXy = canvasXy.sub(
        centerXy[0] ? size.x / 2 : 0,
        centerXy[1] ? size.y / 2 : 0,
      );
    }
    if (this.#fontAsset) {
      this.#queues[this.#queues.length - 1]!.push({
        type: "text",
        text: text,
        canvasXy: canvasXy.sub(this.#cameraOffset),
        fontAsset: this.#fontAsset,
        color: color,
        clippingRegion: this.#clippingRegion,
      });
    } else {
      Logger.infoBeetPx(
        `print: (${canvasXy.x},${canvasXy.y}) [${
          typeof color === "function" ? "computed" : color.asRgbCssHex()
        }] ${text}`,
      );
    }
  }

  takeCanvasSnapshot(): BpxCanvasPixelsSnapshotId {
    const snapshotId = this.#canvasPixels.generateNextSnapshotId();
    // Snapshots require the whole image to be drawn up to this point,
    //   therefore we push this command to a separate queue:
    //   the previous queue will get processed from the top-most
    //   layer to the bottom, then the snapshot will get taken.
    this.#queues.push([
      {
        type: "take_canvas_snapshot",
        snapshotId: snapshotId,
      },
    ]);
    // And let's create a next empty queue for subsequent commands in order
    //   for the snapshot to be taken immediately and not at the end of
    //   the queue.
    this.#queues.push([]);
    return snapshotId;
  }

  processQueuedCommands(): void {
    for (const queue of this.#queues) {
      this.#canvasPixels.resetVisitedMarkers();

      for (let i = queue.length - 1; i >= 0; --i) {
        const cmd = queue[i]!;
        if (cmd.type === "clear") {
          this.#clear.draw(cmd.color);
        } else if (cmd.type === "pixel") {
          this.#pixel.draw(
            cmd.xy.x,
            cmd.xy.y,
            cmd.color,
            cmd.fillPattern,
            cmd.clippingRegion,
          );
        } else if (cmd.type === "pixels") {
          this.#pixels.draw(cmd.xy, cmd.bits, cmd.color, cmd.clippingRegion);
        } else if (cmd.type === "line") {
          this.#line.draw(
            cmd.xy,
            cmd.wh,
            cmd.color,
            cmd.fillPattern,
            cmd.clippingRegion,
          );
        } else if (cmd.type === "rect") {
          this.#rect.draw(
            cmd.xy,
            cmd.wh,
            cmd.color,
            cmd.fill,
            cmd.fillPattern,
            cmd.clippingRegion,
          );
        } else if (cmd.type === "ellipse") {
          this.#ellipse.draw(
            cmd.xy,
            cmd.wh,
            cmd.color,
            cmd.fill,
            cmd.fillPattern,
            cmd.clippingRegion,
          );
        } else if (cmd.type === "sprite") {
          this.#sprite.draw(
            cmd.sourceImageAsset,
            cmd.sprite,
            cmd.targetXy,
            cmd.scaleXy,
            cmd.spriteColorMapping,
            cmd.fillPattern,
            cmd.clippingRegion,
          );
        } else if (cmd.type === "text") {
          this.#text.draw(
            cmd.text,
            cmd.canvasXy,
            cmd.fontAsset,
            cmd.color,
            cmd.clippingRegion,
          );
        } else if (cmd.type === "take_canvas_snapshot") {
          this.#canvasPixels.takeSnapshot(cmd.snapshotId);
        } else {
          u_.assertUnreachable(cmd);
        }
      }
    }

    this.#queues = [[]];
  }
}
