import { BpxRgbColor } from "../color/RgbColor";
import { DrawApi } from "../draw_api/DrawApi";
import { BpxVector2d } from "../misc/Vector2d";
import { font_saint11Minimal4_, rgb_p8_, v_ } from "../shorthands";
import { BpxUtils } from "../utils/Utils";

export type FpsDisplayPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export class FpsDisplay {
  constructor(
    drawApi: DrawApi,
    params: {
      color?: BpxRgbColor;
      placement?: FpsDisplayPlacement;
    },
  ) {
    this.#drawApi = drawApi;

    this.#color = params.color ?? rgb_p8_.orange;

    const placement: FpsDisplayPlacement = params.placement ?? "top-right";
    this.#xy = v_(
      placement.endsWith("-left") ? 1 : 128 - 3 * 4,
      placement.startsWith("top-") ? 1 : 128 - 5,
    );

    this.#recentSamples = Array.from({ length: 15 }, () => 0);
    this.#nextSampleIndex = 0;
    this.#lastCalculatedAverageFps = 0;
  }

  readonly #drawApi: DrawApi;
  readonly #color: BpxRgbColor;
  readonly #xy: BpxVector2d;

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

    const prevFont = this.#drawApi.useFont(font_saint11Minimal4_);
    this.#drawApi.drawText(
      this.#lastCalculatedAverageFps.toFixed(),
      this.#xy,
      this.#color,
    );
    this.#drawApi.useFont(prevFont);
  }
}
