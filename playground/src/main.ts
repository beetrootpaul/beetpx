import {
  $d,
  $rgb_p8,
  $timer,
  $timerSeq,
  $v,
  $v_0_0,
  $v_1_1,
  $x,
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

$x.setOnStarted(() => {
  pauseMenu = new PauseMenu();
  music = new Music();
  movement = new Movement();
  vfx = new Vfx({ loopFrames: Music.beatFrames });
  dot = $x.canvasSize.div(2);
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
  // console.log("___ started ___", t.t, tseq.currentPhase, tseq.t, t2?.t);
});

$x.setOnUpdate(() => {
  if ($x.isPaused) {
    pauseMenu.update();
  } else {
    dot = dot
      .add($x.getPressedDirection().normalize().mul(1.5))
      .clamp($v_0_0, $x.canvasSize.sub(1));
  }

  if ($x.wasButtonJustPressed("x") && $x.wasButtonJustPressed("o")) {
    t.restart();
    tseq.restart();
    t2?.restart();
  } else if ($x.wasButtonJustPressed("x")) {
    t.pause();
    tseq.pause();
    t2?.pause();
  } else if ($x.wasButtonJustPressed("o")) {
    t.resume();
    tseq.resume();
    t2?.resume();
  }

  if (tseq.hasJustFinishedOverall) {
    t2 = $timer(3, { loop: true });
  }

  if ($x.wasJustPaused) {
    console.log("PAUSED", Date.now());
  }
  if ($x.wasJustResumed) {
    console.log("resumed", Date.now());
  }
});

$x.setOnDraw(() => {
  // console.log("draw", t.t, tseq.currentPhase, tseq.t, t2?.t);

  $d.clearCanvas($rgb_p8.black);
  $d.rectFilled($v_0_0, $x.canvasSize, $rgb_p8.storm);

  $d.setCameraXy($v(-10, -10));
  $d.pixel($v_0_0, $rgb_p8.ember);
  $d.pixel($d.cameraXy, $rgb_p8.lemon);

  vfx.draw();
  movement.draw();

  if ($x.isButtonPressed("O")) {
    $d.text("O", $v(8, 32), $rgb_p8.lemon);
  }
  if ($x.isButtonPressed("X")) {
    $d.text("X", $v(18, 32), $rgb_p8.lemon);
  }

  $d.pixel(dot, $rgb_p8.white);

  $d.text(
    $x.isTouchInputMethodAvailable() ? "TOUCH" : "no touch",
    $v_1_1,
    $rgb_p8.sky,
  );

  if ($x.isPaused) {
    pauseMenu.draw();
  }
});

$x.start({
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
    activateOnStart: false,
  },
});
