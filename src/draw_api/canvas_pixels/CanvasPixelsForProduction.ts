import { BpxSolidColor } from "../../Color";
import { u_ } from "../../Utils";
import { BpxVector2d, v_ } from "../../Vector2d";
import { CanvasPixels } from "./CanvasPixels";
import { CanvasPixelsForProductionSnapshot } from "./CanvasPixelsForProductionSnapshot";
import { CanvasPixelsSnapshot } from "./CanvasPixelsSnapshot";

// TODO: rename, like, seriously…
export class CanvasPixelsForProduction extends CanvasPixels {
  readonly #length: number;

  readonly #visited: boolean[];

  readonly #htmlCanvas: HTMLCanvasElement;
  readonly #htmlCanvasContext: CanvasRenderingContext2D;
  readonly #offscreenContext: OffscreenCanvasRenderingContext2D;
  readonly #offscreenImageData: ImageData;

  constructor(
    canvasSize: BpxVector2d,
    htmlCanvas: HTMLCanvasElement,
    htmlCanvasBackground: BpxSolidColor,
  ) {
    super(canvasSize);

    this.#length = canvasSize.x * canvasSize.y;
    this.#visited = u_.range(this.#length).map(() => false);

    this.#htmlCanvas = htmlCanvas;
    this.#htmlCanvas.style.backgroundColor = htmlCanvasBackground.asRgbCssHex();

    this.#htmlCanvasContext =
      this.#htmlCanvas.getContext("2d", {
        // we allow transparency in order ot make background color visible around the game itself
        alpha: true,
      }) ??
      u_.throwError(
        "CanvasPixels2d: Was unable to obtain '2d' context from <canvas>",
      );

    const offscreenCanvas = document
      .createElement("canvas")
      .transferControlToOffscreen();
    offscreenCanvas.width = canvasSize.x;
    offscreenCanvas.height = canvasSize.y;

    this.#offscreenContext =
      offscreenCanvas.getContext("2d", {
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
        alpha: false,
      }) ??
      u_.throwError(
        "CanvasPixels2d: Was unable to obtain '2d' context from OffscreenCanvas",
      );

    this.#offscreenImageData = this.#offscreenContext.createImageData(
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height,
    );

    this.#initializeAsNonTransparent();
  }

  wasAlreadySet(x: number, y: number): boolean {
    const index = y * this.canvasSize.x + x;
    if (index < 0 || index >= this.#length) {
      return true;
    }
    return this.#visited[index]!;
  }

  set(color: BpxSolidColor, x: number, y: number): void {
    const index = y * this.canvasSize.x + x;

    if (index >= this.#length) {
      throw Error(
        `CanvasPixels2d: index out of bounds: index = ${index}, maxAllowedIndex = ${
          this.#length - 1
        }`,
      );
    }

    const dataIndex = index * 4;
    this.#offscreenImageData.data[dataIndex] = color.r;
    this.#offscreenImageData.data[dataIndex + 1] = color.g;
    this.#offscreenImageData.data[dataIndex + 2] = color.b;

    this.#visited[index] = true;
  }

  newSnapshot(): CanvasPixelsSnapshot {
    return new CanvasPixelsForProductionSnapshot(
      new Uint8ClampedArray(this.#offscreenImageData.data),
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

  resetVisitedMarkers(): void {
    for (let index = 0; index < this.#length; index++) {
      this.#visited[index] = false;
    }
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
