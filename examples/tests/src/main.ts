import { $, $d, $rgb, $rgb_p8, $v } from "../../../src";
import { ColorSequence } from "./ColorSequence";

$.init({ canvasSize: "64x64", fixedTimestep: "60fps" }).then(
  async ({ startGame }) => {
    const cs1 = new ColorSequence($rgb("#000000"));
    const cs2 = new ColorSequence($rgb("#ffffff"));

    $.setOnUpdate(() => {
      cs1.next();
      cs2.next();
    });

    $.setOnDraw(() => {
      $d.clearCanvas($rgb_p8.slate);
      $d.ellipse($v(8), $v(48), cs1.current);
      $d.ellipse($v(16), $v(32), cs2.current);
    });

    await startGame();
  },
);
