import { BpxRgbColor } from "../color/RgbColor";
import { DrawApi } from "../draw_api/DrawApi";
import { BpxVector2d } from "../misc/Vector2d";
import { font_saint11Minimal4_, rgb_p8_, v_ } from "../shorthands";

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
  }

  readonly #drawApi: DrawApi;
  readonly #color: BpxRgbColor;
  readonly #xy: BpxVector2d;

  drawRenderingFps(renderingFps: number): void {
    const prevFont = this.#drawApi.useFont(font_saint11Minimal4_);
    this.#drawApi.drawText(renderingFps.toFixed(), this.#xy, this.#color);
    this.#drawApi.useFont(prevFont);
  }
}
