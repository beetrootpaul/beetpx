import { Assets } from "../assets/Assets";
import { CanvasForTests } from "../canvas/CanvasForTests";
import { BpxRgbColor } from "../color/RgbColor";
import { DrawApi } from "./DrawApi";

type DrawingTestSetup = {
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
  return { canvas, assets, drawApi };
}
