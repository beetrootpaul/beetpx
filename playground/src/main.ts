import {
  $,
  $d,
  $rgb_p8,
  $timer,
  $timerSeq,
  $v,
  $v_0_0,
  BpxTimer,
  BpxTimerSequence,
  BpxVector2d,
} from "../../src";
import { Movement } from "./Movement";
import { Music } from "./Music";
import { PauseMenu } from "./PauseMenu";
import { Vfx } from "./Vfx";

let pauseMenu: PauseMenu;
let music: Music;
let movement: Movement;
let vfx: Vfx;
let dot: BpxVector2d;

let t: BpxTimer;
let tseq: BpxTimerSequence<"_i_1" | "_i__2" | "one" | "TWO">;
let t2: BpxTimer | undefined;

$.setOnStarted(() => {
  pauseMenu = new PauseMenu();
  music = new Music();
  movement = new Movement();
  vfx = new Vfx({ loopFrames: Music.beatFrames });
  dot = $.canvasSize.div(2);
  t = $timer(3, { loop: true });
  tseq = $timerSeq({
    intro: [
      ["_i_1", 3],
      ["_i__2", 3],
    ],
    loop: [
      ["one", 3],
      ["TWO", 3],
    ],
  });
  console.log("___ started ___", t.t, tseq.currentPhase, tseq.t, t2?.t);
});

$.setOnUpdate(() => {
  if ($.isPaused) {
    pauseMenu.update();
  } else {
    dot = dot
      .add($.getPressedDirection().normalize().mul(1.5))
      .clamp($v_0_0, $.canvasSize.sub(1));
  }

  if ($.wasButtonJustPressed("x") && $.wasButtonJustPressed("o")) {
    t.restart();
    tseq.restart();
    t2?.restart();
  } else if ($.wasButtonJustPressed("x")) {
    t.pause();
    tseq.pause();
    t2?.pause();
  } else if ($.wasButtonJustPressed("o")) {
    t.resume();
    tseq.resume();
    t2?.resume();
  }

  if (tseq.hasJustFinishedOverall) {
    t2 = $timer(3, { loop: true });
  }

  console.log("UPDATE", t.t, tseq.currentPhase, tseq.t, t2?.t);

  if ($.wasButtonJustPressed("menu")) {
    $.restart();
    return;
  }
});

$.setOnDraw(() => {
  console.log("draw", t.t, tseq.currentPhase, tseq.t, t2?.t);

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
    available: false,
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
    activateOnStart: true,
  },
});
