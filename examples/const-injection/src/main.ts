import { $, $d, $rgb_p8, $v } from "../../../src";

declare global {
  interface Window {
    PREV_COMMIT: string;
    envType: "prod" | "dev" | undefined;
  }
}

$.init().then(async ({ startGame }) => {
  $.setOnDraw(() => {
    $d.clearCanvas(window.envType === "prod" ? $rgb_p8.wine : $rgb_p8.storm);
    $d.text(`PREV_COMMIT=${window.PREV_COMMIT}`, $v(1, 1), $rgb_p8.silver);
    $d.text(`envType=${window.envType}`, $v(1, 8), $rgb_p8.silver);
  });

  await startGame();
});
