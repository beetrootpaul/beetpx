import {
  $d,
  $rgb_p8,
  $timer,
  $timerSeq,
  $u,
  $v,
  $v_0_0,
  $x,
  BpxEasing,
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

const distribution = [0, 0, 0, 0, 0, 0, 0, 0];

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

  bgXy = bgXy.add($x.getPressedDirection().normalize().mul(8));

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

  distribution[$u.randInt(-2, 5) + 2]! += 1;
});

$x.setOnDraw(() => {
  $d.clearCanvas($rgb_p8.black);

  const wOuter = 48;
  const hOuter = 48;
  const wInner = 32;
  const hInner = 32;

  const rowLimit = Math.floor($x.canvasSize.x / wOuter);

  const t = ($x.frameNumber % 60) / 60;

  [
    //
    BpxEasing.linear,
    //
    BpxEasing.inQuadratic,
    BpxEasing.outQuadratic,
    BpxEasing.inOutQuadratic,
    BpxEasing.outInQuadratic,
    //
    BpxEasing.inQuartic,
    BpxEasing.outQuartic,
    BpxEasing.inOutQuartic,
    BpxEasing.outInQuartic,
    //
    BpxEasing.inOvershoot,
    BpxEasing.outOvershoot,
    BpxEasing.inOutOvershoot,
    BpxEasing.outInOvershoot,
    //
    BpxEasing.inElastic,
    BpxEasing.outElastic,
    BpxEasing.inOutElastic,
    BpxEasing.outInElastic,
    //
    BpxEasing.inBounce,
    BpxEasing.outBounce,
    //
  ].forEach((fn, i) => {
    const xOuter = (i % rowLimit) * wOuter;
    const yOuter = Math.floor(i / rowLimit) * hOuter;
    $d.rect($v(xOuter, yOuter), $v(wOuter, hOuter), $rgb_p8.storm);

    const xInner = xOuter + (wOuter - wInner) / 2;
    const yInner = yOuter + (hOuter - hInner) / 2;
    $d.rect($v(xInner, yInner), $v(wInner, hInner), $rgb_p8.storm);

    for (let x = 0; x < wInner; x++) {
      const y = wInner * fn(x / wInner);
      $d.pixel($v(xInner + x, yInner + y), $rgb_p8.white);
    }
  });

  // vfx.draw();
  // movement.draw();
  //
  // if ($x.isPaused) {
  //   pauseMenu.draw();
  // }

  for (let i = 0; i < 8; i++) {
    $d.line($v(8 + i * 8, 8), $v(1, distribution[i]!), $rgb_p8.ember);
  }
});

$x.start({
  gameId: "beetpx-playground",
  canvasSize: "256x256",
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
      // enabled: true,
    },
  },
  frameByFrame: {
    available: !BEETPX__IS_PROD,
    activateOnStart: false,
  },
});
