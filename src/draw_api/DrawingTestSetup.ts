import { Assets } from "../assets/Assets";
import { CanvasForTests } from "../canvas/CanvasForTests";
import { BpxRgbColor, white_ } from "../color/RgbColor";
import { BpxFontSaint11Minimal4 } from "../font/BpxFontSaint11Minimal4";
import { DrawApi } from "./DrawApi";

export type DrawingTestSetup = {
  canvas: CanvasForTests;
  assets: Assets;
  drawApi: DrawApi;
};

export function drawingTestSetup(
  canvasWidth: number,
  canvasHeight: number,
  canvasBgColor: BpxRgbColor,
): DrawingTestSetup {
  const canvas = new CanvasForTests(canvasWidth, canvasHeight, canvasBgColor);
  const assets = new Assets();
  const drawApi = new DrawApi({
    canvas,
    assets,
  });

  assets.addFontAsset(BpxFontSaint11Minimal4.id, {
    font: new BpxFontSaint11Minimal4(),
    spriteTextColor: white_,
  });

  return { canvas, assets, drawApi };
}
