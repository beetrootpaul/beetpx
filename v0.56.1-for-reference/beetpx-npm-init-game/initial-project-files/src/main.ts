import {$x, $d, $rgb, $rgb_p8, $spr, $u, $v_0_0, $v_1_1, BpxVector2d} from "@beetpx/beetpx";

const logoSprite = $spr("logo.png")(16, 16, 0, 0);
let logoPosition: BpxVector2d;

/**
 * `$` is a shorter way of accessing `BeetPx`.
 */
$x.setOnStarted(() => {
    logoPosition = $x.canvasSize.div(2);
    $x.startPlaybackLooped("music.flac");
});

/**
 * `setOnUpdate` is used for a logic to be run in a fixed timestep
 * game loop.
 */
$x.setOnUpdate(() => {
    /**
     * `getPressedDirection` returns a 2D vector representing the pressed
     * state of directional buttons. For example: "right" is (1,0).
     */
    const positionDiff = $x.getPressedDirection().normalize().mul(3);
    logoPosition = logoPosition.add(positionDiff).clamp($v_0_0, $x.canvasSize);
});

/**
 * `setOnDraw` is used for drawing, which might be an expensive operation
 * (because of processing every pixel of the game canvas individually).
 *
 * The callback passed here is *not* guaranteed to be called on a fixed
 * timestamp, in a contrary to the one passed to `setOnUpdated`.
 */
$x.setOnDraw(() => {
    /**
     * `$d` is a shorter way of accessing `BeetPxDraw`.
     */
    $d.clearCanvas($rgb_p8.storm);
    $d.sprite(logoSprite, logoPosition, {centerXy: [true, true]});
    /**
     * `$u` is a shorter way of accessing `BeetPxUtils`.
     */
    $u.drawTextWithOutline("BeetPx", $v_1_1, $rgb("#ff6e59"), $rgb("#125359"));
});

/**
 * `start` is used to configure BeetPx app and start it.
 */
$x.start({
    gameId: "__PROJECT_NAME__",

    /**
     * Here are names of asset files to be fetched by the BeetPx on load
     * for further use. They are located in `../public/`.
     */
    assets: [
        "logo.png",
        "music.flac",
    ],
});