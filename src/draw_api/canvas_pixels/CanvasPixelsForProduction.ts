import { BpxSolidColor } from "../../Color";
import { u_ } from "../../Utils";
import { BpxVector2d, v_ } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsForProductionSnapshot } from "./CanvasPixelsForProductionSnapshot";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

export class CanvasPixelsForProduction extends CanvasPixels {
  readonly #length: number;

  readonly #htmlCanvas: HTMLCanvasElement;
  readonly #htmlCanvasContext: CanvasRenderingContext2D;
  readonly #offscreenContext: OffscreenCanvasRenderingContext2D;
  readonly #offscreenImageData: ImageData;

  #minX: number;
  #minY: number;
  #maxX: number;
  #maxY: number;

  constructor(
    canvasSize: BpxVector2d,
    htmlCanvas: HTMLCanvasElement,
    htmlCanvasBackground: BpxSolidColor,
  ) {
    super(canvasSize);

    this.#length = canvasSize.x * canvasSize.y;

    this.#minX = 0;
    this.#minY = 0;
    this.#maxX = canvasSize.x - 1;
    this.#maxY = canvasSize.y - 1;

    this.#htmlCanvas = htmlCanvas;
    this.#htmlCanvas.style.backgroundColor = htmlCanvasBackground.asRgbCssHex();

    this.#htmlCanvasContext =
      this.#htmlCanvas.getContext("2d", {
        colorSpace: "srgb",
        // we allow transparency in order ot make background color visible around the game itself
        alpha: true,
      }) ?? u_.throwError("Was unable to obtain '2d' context from <canvas>");

    const offscreenCanvas = document
      .createElement("canvas")
      .transferControlToOffscreen();
    offscreenCanvas.width = canvasSize.x;
    offscreenCanvas.height = canvasSize.y;

    this.#offscreenContext =
      offscreenCanvas.getContext("2d", {
        colorSpace: "srgb",
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
        alpha: false,
      }) ??
      u_.throwError("Was unable to obtain '2d' context from OffscreenCanvas");

    this.#offscreenImageData = this.#offscreenContext.createImageData(
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height,
      { colorSpace: "srgb" },
    );

    this.#initializeAsNonTransparent();
  }

  setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void {
    const [xyMinInclusive, xyMaxExclusive] = BpxVector2d.minMax(
      xy.round(),
      xy.add(wh).round(),
    );
    this.#minX = xyMinInclusive.x;
    this.#minY = xyMinInclusive.y;
    this.#maxX = xyMaxExclusive.x - 1;
    this.#maxY = xyMaxExclusive.y - 1;
  }

  removeClippingRegion(): void {
    this.#minX = 0;
    this.#minY = 0;
    this.#maxX = this.canvasSize.x - 1;
    this.#maxY = this.canvasSize.y - 1;
  }

  canSetAny(xMin: number, yMin: number, xMax: number, yMax: number): boolean {
    return (
      xMax >= this.#minX &&
      yMax >= this.#minY &&
      xMin <= this.#maxX &&
      yMin <= this.#maxY
    );
  }

  canSetAt(x: number, y: number): boolean {
    return (
      x >= this.#minX && y >= this.#minY && x <= this.#maxX && y <= this.#maxY
    );
  }

  set(color: BpxSolidColor, x: number, y: number): void {
    if (x < 0 || y < 0 || x >= this.canvasSize.x || y >= this.canvasSize.y) {
      throw Error(
        `(x,y) index out of bounds: (x,y) = (${x},${y}), bottom bound = (0,0), upper bound = (${
          this.canvasSize.x - 1
        },${this.canvasSize.y - 1})`,
      );
    }

    const index = y * this.canvasSize.x + x;

    if (index >= this.#length) {
      throw Error(
        `index out of bounds: index = ${index}, max allowed index = ${
          this.#length - 1
        }`,
      );
    }

    const dataIndex = index * 4;
    this.#offscreenImageData.data[dataIndex] = color.r;
    this.#offscreenImageData.data[dataIndex + 1] = color.g;
    this.#offscreenImageData.data[dataIndex + 2] = color.b;
  }

  newSnapshot(): CanvasPixelsSnapshot {
    return new CanvasPixelsForProductionSnapshot(
      this.#offscreenImageData.data.slice(),
    );
  }

  onWindowResize(): void {
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
    this.#htmlCanvas.width =
      this.#htmlCanvas.getBoundingClientRect().width * window.devicePixelRatio;
    this.#htmlCanvas.height =
      this.#htmlCanvas.getBoundingClientRect().height * window.devicePixelRatio;

    // seems like we have to set it every time the canvas size is changed
    this.#htmlCanvasContext.imageSmoothingEnabled = false;
  }

  doRender(): void {
    this.#offscreenContext.putImageData(this.#offscreenImageData, 0, 0);

    const htmlCanvasSize = v_(this.#htmlCanvas.width, this.#htmlCanvas.height);
    const scaleToFill = Math.min(
      htmlCanvasSize.div(this.canvasSize).floor().x,
      htmlCanvasSize.div(this.canvasSize).floor().y,
    );
    const centeringOffset = htmlCanvasSize
      .sub(this.canvasSize.mul(scaleToFill))
      .div(2)
      .floor();
    // TODO: does the fitting algorithm take DPI into account? Maybe it would allow low res game to occupy more space?

    this.#htmlCanvasContext.drawImage(
      this.#offscreenContext.canvas,
      0,
      0,
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height,
      centeringOffset.x,
      centeringOffset.y,
      scaleToFill * this.canvasSize.x,
      scaleToFill * this.canvasSize.y,
    );
  }

  #initializeAsNonTransparent() {
    for (let i = 3; i < this.#offscreenImageData.data.length; i += 4) {
      this.#offscreenImageData.data[i] = 0xff;
    }
  }
}
