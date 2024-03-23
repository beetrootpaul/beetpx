import { BpxRgbColor } from "../color/RgbColor";
import { DrawApi } from "../draw_api/DrawApi";
import { font_saint11Minimal4_, rgb_p8_, v_1_1_ } from "../shorthands";

export class FpsDisplay {
  constructor(
    drawApi: DrawApi,
    params: {
      color?: BpxRgbColor;
    },
  ) {
    this.#drawApi = drawApi;
    this.#color = params.color ?? rgb_p8_.ember;
  }

  readonly #drawApi: DrawApi;
  readonly #color: BpxRgbColor;

  drawRenderingFps(renderingFps: number): void {
    const prevFont = this.#drawApi.useFont(font_saint11Minimal4_);
    this.#drawApi.drawText(renderingFps.toFixed(), v_1_1_, this.#color);
    this.#drawApi.useFont(prevFont);
  }
}
