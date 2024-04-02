import { b_, rgb_, rgb_p8_, v_ } from "../../../src";
import { ColorSequence } from "./ColorSequence";

b_.init({canvasSize: "64x64", fixedTimestep: "60fps"}).then(async ({ startGame }) => {
  const cs1 = new ColorSequence(rgb_("#000000"));
  const cs2 = new ColorSequence(rgb_("#ffffff"));

  b_.setOnUpdate(() => {
    cs1.next();
    cs2.next();
  });

  b_.setOnDraw(() => {
    b_.clearCanvas(rgb_p8_.slate);
    b_.drawEllipse(v_(8), v_(48), cs1.current);
    b_.drawEllipse(v_(16), v_(32), cs2.current);
  });

  await startGame();
});
