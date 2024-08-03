import { $, $d, $rgb_p8, $v, $v_0_0, BpxVector2d } from "../../src";
import { Movement } from "./Movement";
import { Music } from "./Music";
import { PauseMenu } from "./PauseMenu";
import { Vfx } from "./Vfx";

let pauseMenu: PauseMenu;
let music: Music;
let movement: Movement;
let vfx: Vfx;
let dot: BpxVector2d;

$.setOnStarted(() => {
  pauseMenu = new PauseMenu();
  music = new Music();
  movement = new Movement();
  vfx = new Vfx({ loopFrames: Music.beatFrames });
  dot = $.canvasSize.div(2);
});

$.setOnUpdate(() => {
  if ($.isPaused) {
    pauseMenu.update();
  } else {
    dot = dot
      .add($.getPressedDirection().normalize().mul(1.5))
      .clamp($v_0_0, $.canvasSize.sub(1));
  }
});

$.setOnDraw(() => {
  $d.clearCanvas($rgb_p8.storm);

  vfx.draw();
  movement.draw();

  if ($.isButtonPressed("O")) {
    $d.text("O", $v(8, 32), $rgb_p8.lemon);
  }
  if ($.isButtonPressed("X")) {
    $d.text("X", $v(18, 32), $rgb_p8.lemon);
  }

  $d.pixel(dot, $rgb_p8.white);

  if ($.isPaused) {
    pauseMenu.draw();
  }
});

$.start({
  gameId: "beetpx-playground",
  canvasSize: "256x256",
  assets: [...Movement.assetUrls, ...Music.assetUrls],
  gamePause: {
    available: true,
  },
  requireConfirmationOnTabClose: BEETPX__IS_PROD,
  screenshots: {
    available: true,
  },
  debugMode: {
    available: !BEETPX__IS_PROD,
  },
  frameByFrame: {
    available: !BEETPX__IS_PROD,
  },
});
