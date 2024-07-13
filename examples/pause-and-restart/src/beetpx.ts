import { b_, rgb_p8_ } from "../../../src";
import { Movement } from "./Movement";
import { Music } from "./Music";
import { PauseOverlay } from "./PauseOverlay";
import { Vfx } from "./Vfx";

b_.init({
  // TODO: REMOVE
  debugMode: {
    available: true,
  },
  canvasSize: "256x256",
  assets: [...Movement.assetUrls, ...Music.assetUrls],
}).then(async ({ startGame }) => {
  const pauseOverlay = new PauseOverlay();
  const music = new Music();
  let movement: Movement;
  let vfx: Vfx;

  b_.setOnStarted(() => {
    // TODO: resume
    music.start();
    movement = new Movement();
    vfx = new Vfx({ loopFrames: Music.beatFrames });
  });

  b_.setOnUpdate(() => {
    if (b_.wasButtonJustPressed("a")) {
      b_.restart();
    }
    // TODO: REMOVE
    movement.update();
    // TODO: REMOVE
    music.update();
  });

  // TODO: describe somewhere that this example is about built-in pause which can be toggled with menu button

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
