import { b_, rgb_p8_ } from "../../../src";
import { Movement } from "./Movement";
import { Music } from "./Music";
import { PauseOverlay } from "./PauseOverlay";
import { Vfx } from "./Vfx";

b_.init({
  canvasSize: "256x256",
  assets: [...Movement.assetUrls, ...Music.assetUrls],
}).then(async ({ startGame }) => {
  const pauseOverlay = new PauseOverlay();
  let music: Music;
  let movement: Movement;
  let vfx: Vfx;

  b_.setOnStarted(() => {
    music = new Music();
    movement = new Movement();
    vfx = new Vfx({ loopFrames: Music.beatFrames });
  });

  b_.setOnUpdate(() => {
    if (b_.wasButtonJustPressed("a")) {
      b_.restart();
    }
  });

  b_.setOnDraw(() => {
    b_.clearCanvas(rgb_p8_.storm);
    vfx.draw();
    movement.draw();
    if (b_.isPaused) {
      pauseOverlay.draw();
    }
  });

  await startGame();
});
