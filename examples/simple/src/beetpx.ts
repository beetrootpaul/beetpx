import { b_, rgb_p8_, spr_, v_, v_0_0_ } from "../../../src";

const logoSprite = spr_("logo.png")(16, 16, 0, 0);
let circleMovementCenter = v_0_0_;
let logoPosition = v_0_0_;

/**
 * `init` is used to configure BeetPx app and initialize underlying
 *  singleton used later to access the whole API (drawing functions etc.)
 *
 *  `b_` is a shorter way of accessing `BeetPx`.
 */
b_.init({
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
  b_.setOnStarted(() => {
    b_.startPlaybackLooped("music_melody.flac");
    circleMovementCenter = b_.canvasSize.div(2);
  });

  /**
   * `setOnUpdate` is used for a logic to be run in a fixed timestep
   * game loop.
   */
  b_.setOnUpdate(() => {
    /**
     * `getPressedDirection` returns a 2D vector representing the pressed
     * state of directional buttons. For example: "right" is (1,0).
     */
    circleMovementCenter = circleMovementCenter.add(
      b_.getPressedDirection().mul(3),
    );

    /**
     * `frameNumber` used below represents a game loop frame number
     * counted from the moment the game (re)started.
     */
    logoPosition = circleMovementCenter.add(
      v_(32).mul(
        Math.cos((b_.frameNumber / 120) * Math.PI),
        Math.sin((b_.frameNumber / 120) * Math.PI),
      ),
    );

    /**
     * (see comments above `setOnStarted`)
     */
    if (b_.isButtonPressed("menu")) {
      b_.restart();
    }
  });

  /**
   * `setOnDraw` is used for drawing, which might be an expensive operation
   * (because of processing every pixel of the game canvas individually).
   *
   * The callback passed here is *not* guaranteed to be called on a fixed
   * timestamp, in a contrary to the one passed to `setOnUpdated`.
   */
  b_.setOnDraw(() => {
    b_.clearCanvas(rgb_p8_.storm);
    b_.drawPixel(circleMovementCenter, rgb_p8_.ember);
    b_.drawSprite(logoSprite, logoPosition, { centerXy: [true, true] });
  });

  /**
   * At the very end, let's not forget to start the game loop :)
   */
  await startGame();
});
