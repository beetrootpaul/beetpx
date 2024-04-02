import { b_ } from "../BeetPx";
import { BpxRgbColor } from "../color/RgbColor";
import { DrawApi } from "../draw_api/DrawApi";
import { BpxVector2d } from "../misc/Vector2d";
import { font_pico8_, rgb_p8_ } from "../shorthands";
import { BpxUtils } from "../utils/Utils";

export type FpsDisplayPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export class FpsDisplay {
  readonly #drawApi: DrawApi;
  readonly #color: BpxRgbColor;
  readonly #canvasSize: BpxVector2d;
  readonly #alignTop: boolean;
  readonly #alignLeft: boolean;

  constructor(
    drawApi: DrawApi,
    canvasSize: BpxVector2d,
    params: {
      color?: BpxRgbColor;
      placement?: FpsDisplayPlacement;
    },
  ) {
    this.#drawApi = drawApi;

    this.#color = params.color ?? rgb_p8_.orange;

    this.#canvasSize = canvasSize;

    const placement: FpsDisplayPlacement = params.placement ?? "top-right";
    this.#alignLeft = placement.endsWith("-left");
    this.#alignTop = placement.startsWith("top-");

    this.#recentSamples = Array.from({ length: 15 }, () => 0);
    this.#nextSampleIndex = 0;
    this.#lastCalculatedAverageFps = 0;
  }

  readonly #recentSamples: number[];
  #nextSampleIndex: number;
  #lastCalculatedAverageFps: number;

  // Assumption: this method is called every frame, therefore averaging over N frames makes sense.
  drawRenderingFps(renderingFps: number): void {
    this.#recentSamples[this.#nextSampleIndex] = renderingFps;
    this.#nextSampleIndex = BpxUtils.mod(
      this.#nextSampleIndex + 1,
      this.#recentSamples.length,
    );

    if (this.#nextSampleIndex === 0) {
      this.#lastCalculatedAverageFps = 0;
      for (const sample of this.#recentSamples) {
        this.#lastCalculatedAverageFps += sample;
      }
      this.#lastCalculatedAverageFps /= this.#recentSamples.length;
    }

    const prevFont = this.#drawApi.useFont(font_pico8_);

    const text = this.#lastCalculatedAverageFps.toFixed();
    const wh = b_.measureText(text).wh;
    this.#drawApi.drawText(
      text,
      this.#drawApi.cameraXy.add(
        this.#alignLeft ? 1 : this.#canvasSize.x - wh.x - 1,
        this.#alignTop ? 1 : this.#canvasSize.y - wh.y - 1,
      ),
      this.#color,
    );

    this.#drawApi.useFont(prevFont);
  }
}
