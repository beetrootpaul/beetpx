import {$x, $d, $rgb_p8, $v, $v_0_0, BpxDrawingPattern, BpxPatternColors} from "@beetpx/beetpx";

declare global {
    interface Window {
        PREV_COMMIT: string;
        envType: "prod" | "dev" | undefined;
    }
}

const patterns = [
    BpxDrawingPattern.of(0b0011_0110_1100_1001),
    BpxDrawingPattern.of(0b0110_1100_1001_0011),
    BpxDrawingPattern.of(0b1100_1001_0011_0110),
    BpxDrawingPattern.of(0b1001_0011_0110_1100),
];

$x.setOnStarted(() => {
    $d.setTextColorMarkers({
        lighter: $rgb_p8.silver,
    });
});

$x.setOnDraw(() => {
    $d.clearCanvas(BEETPX__IS_PROD ? $rgb_p8.wine : $rgb_p8.storm);

    $d.setDrawingPattern(patterns[Math.floor($x.frameNumber / 4) % 4]!);
    $d.rect($v_0_0, $x.canvasSize, BpxPatternColors.of(
        BEETPX__IS_PROD ? $rgb_p8.wine : $rgb_p8.storm,
        $rgb_p8.black
    ));
    $d.setDrawingPattern(BpxDrawingPattern.primaryOnly);

    $d.text(`BEETPX__VERSION=[lighter]${BEETPX__VERSION}`, $v(1, 1), $rgb_p8.dusk);
    $d.text(`BEETPX__IS_PROD=[lighter]${BEETPX__IS_PROD}`, $v(1, 8), $rgb_p8.dusk);

    $d.text(`PREV_COMMIT=[lighter]${window.PREV_COMMIT}`, $v(1, 19), $rgb_p8.dusk);
    $d.text(`envType=[lighter]${window.envType}`, $v(1, 26), $rgb_p8.dusk);

    if (!BEETPX__IS_PROD) {
        $d.text(`press , to toggle frame-by-frame`, $v(1, $x.canvasSize.y - 25), $rgb_p8.dusk);
        $d.text(` then . to advance the frame`, $v(1, $x.canvasSize.y - 18), $rgb_p8.dusk);
        $d.text(`press ; to toggle debug mode`, $v(1, $x.canvasSize.y - 6), $rgb_p8.dusk);
    }
});

$x.start({
    gameId: "@beetpx/example-const-injection",
    fixedTimestep: "30fps",
    requireConfirmationOnTabClose: BEETPX__IS_PROD,
    debugMode: {
        available: !BEETPX__IS_PROD,
        fpsDisplay: {
            enabled: !BEETPX__IS_PROD,
            placement: "bottom-right",
        },
    },
    frameByFrame: {
        available: !BEETPX__IS_PROD,
    },
});
