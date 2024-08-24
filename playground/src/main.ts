import {
  $d,
  $rgb_p8,
  $spr,
  $timer,
  $timerSeq,
  $v,
  $v_0_0,
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

let bgXy = $v_0_0;

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

  bgXy = bgXy.add($x.getPressedDirection().normalize().mul(2));

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
  $d.setCameraXy($v(-10, -20));
  $d.sprite($spr("big_image.png")(1280, 1280, 0, 0), bgXy);

  // vfx.draw();
  // movement.draw();

  // if ($x.isButtonPressed("O")) {
  //   $d.text("O", $v(8, 32), $rgb_p8.lemon);
  // }
  // if ($x.isButtonPressed("X")) {
  //   $d.text("X", $v(18, 32), $rgb_p8.lemon);
  // }

  if ($x.isPaused) {
    pauseMenu.draw();
  }
});

$x.start({
  gameId: "beetpx-playground",
  canvasSize: "64x64",
  assets: [...Movement.assetUrls, ...Music.assetUrls, "big_image.png"],
  gamePause: {
    available: true,
  },
  requireConfirmationOnTabClose: BEETPX__IS_PROD,
  screenshots: {
    available: true,
  },
  debugMode: {
    available: !BEETPX__IS_PROD,
    fpsDisplay: {
      enabled: true,
    },
  },
  frameByFrame: {
    available: !BEETPX__IS_PROD,
    activateOnStart: false,
  },
});
