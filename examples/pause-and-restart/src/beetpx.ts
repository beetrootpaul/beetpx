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
  const music = new Music();
  let movement: Movement;
  let vfx: Vfx;
  let isPaused: boolean;

  b_.setOnStarted(() => {
    music.start();
    movement = new Movement();
    vfx = new Vfx({ loopFrames: Music.beatFrames });
    isPaused = false;
  });

  b_.setOnUpdate(() => {
    if (b_.wasButtonJustPressed("a") || b_.wasButtonJustPressed("b")) {
      b_.restart();
    }

    if (b_.wasButtonJustPressed("menu")) {
      isPaused = !isPaused;
      if (isPaused) {
        movement.pause();
        music.muteMelody();
      } else {
        movement.resume();
        music.unmuteMelody();
      }
    }
  });

  b_.setOnDraw(() => {
    b_.clearCanvas(rgb_p8_.storm);
    vfx.draw();
    movement.draw();
    if (isPaused) {
      pauseOverlay.draw();
    }
  });

  await startGame();
});
