import { BpxRgbColor } from "../color/RgbColor";
import { DrawApi } from "../draw_api/DrawApi";
import { rgb_p8_, v_1_1_ } from "../shorthands";

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
    this.#drawApi.drawText(renderingFps.toFixed(), v_1_1_, this.#color);
  }
}
