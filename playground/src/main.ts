import { $, $d, $rgb_p8 } from "../../src";
import { Movement } from "./Movement";
import { Music } from "./Music";
import { PauseMenu } from "./PauseMenu";
import { Vfx } from "./Vfx";

let pauseMenu: PauseMenu;
let music: Music;
let movement: Movement;
let vfx: Vfx;

$.setOnStarted(() => {
  pauseMenu = new PauseMenu();
  music = new Music();
  movement = new Movement();
  vfx = new Vfx({ loopFrames: Music.beatFrames });
});

$.setOnUpdate(() => {
  if ($.isPaused) {
    pauseMenu.update();
  }
});

$.setOnDraw(() => {
  $d.clearCanvas($rgb_p8.storm);

  vfx.draw();
  movement.draw();

  if ($.isPaused) {
    pauseMenu.draw();
  }
});

$.start({
  canvasSize: "256x256",
  assets: [...Movement.assetUrls, ...Music.assetUrls],
  globalPause: {
    available: true,
  },
  requireConfirmationOnTabClose: BEETPX__IS_PROD,
});
