import { $, $d, $h, $rgb_p8, $spr, $v, $v_0_0 } from "../../../src";

const logoSprite = $spr("logo.png")(16, 16, 0, 0);
let circleMovementCenter = $v_0_0;
let logoPosition = $v_0_0;

/**
 * `init` is used to configure BeetPx app and initialize underlying
 *  singleton used later to access the whole API (drawing functions etc.)
 *
 *  `$` is a shorter way of accessing `BeetPx`.
 */
$.init({
  /**
   * Here are names of asset files to be fetched by the BeetPx on load
   * for further use. They are located in `../public/`.
   */
  assets: ["logo.png", "music_melody.flac"],

  /**
   * `debugMode` configures a mode which might come handy while developing
   * the game. When on, it is indicated by a colored border around the canvas.
   *
   * Press `;` (semicolon) to turn it on/off.
   *
   * FPS display: When debug mode is on and `fpsDisplay: { enabled: true }`,
   * you will see a number of rendered frames per second in the corner of
   * the game canvas.
   */
  debugMode: {
    available: true,
    forceEnabledOnStart: true,
    fpsDisplay: { enabled: true },
  },

  /**
   * `frameByFrame` allows you to examine how every frame looks like.
   * Press `,` (comma) to enter this mode, then use `.` (dot) again
   * and again and again to advance to subsequent frames. Press `,`
   * to come back to a regular gameplay.
   */
  frameByFrame: {
    available: true,
  },
}).then(async ({ startGame }) => {
  /**
   * `setOnStarted` is used to initialize or reset any state that is relevant
   * for the game. The callback passed here is called every time the game
   * restarts (including: the very first time it starts).
   *
   * Press Enter on your keyboard (or menu on your gamepad) to test it.
   */
  $.setOnStarted(() => {
    $.startPlaybackLooped("music_melody.flac");
    circleMovementCenter = $.canvasSize.div(2);
  });

  /**
   * `setOnUpdate` is used for a logic to be run in a fixed timestep
   * game loop.
   */
  $.setOnUpdate(() => {
    /**
     * `getPressedDirection` returns a 2D vector representing the pressed
     * state of directional buttons. For example: "right" is (1,0).
     */
    circleMovementCenter = circleMovementCenter.add(
      $.getPressedDirection().mul(3),
    );

    /**
     * `frameNumber` used below represents a game loop frame number
     * counted from the moment the game (re)started.
     */
    logoPosition = circleMovementCenter.add(
      $v(32).mul(
        Math.cos(($.frameNumber / 120) * Math.PI),
        Math.sin(($.frameNumber / 120) * Math.PI),
      ),
    );

    /**
     * (see comments above `setOnStarted`)
     */
    if ($.isButtonPressed("menu")) {
      $.restart();
    }
  });

  /**
   * `setOnDraw` is used for drawing, which might be an expensive operation
   * (because of processing every pixel of the game canvas individually).
   *
   * The callback passed here is *not* guaranteed to be called on a fixed
   * timestamp, in a contrary to the one passed to `setOnUpdated`.
   *
   * `$d` used inside is a shorter way of accessing `BeetPx.draw`.
   *
   * `$h` used inside is a shorter way of accessing `BeetPx.helpers`.
   */
  $.setOnDraw(() => {
    $d.clearCanvas($rgb_p8.storm);
    if ($h.booleanChangingEveryNthFrame(30)) {
      $d.pixel(circleMovementCenter, $rgb_p8.ember);
    }
    $d.sprite(logoSprite, logoPosition, { centerXy: [true, true] });
  });

  /**
   * At the very end, let's not forget to start the game loop :)
   */
  await startGame();
});
