import {$x, $d, $rgb, $rgb_p8, $v, $v_1_1} from "@beetpx/beetpx";
import {ColorSequence} from "./ColorSequence";
import {Counter} from "./Counter";


let cs1: ColorSequence;
let cs2: ColorSequence;
let counter: Counter;

$x.setOnStarted(() => {
    cs1 = new ColorSequence($rgb("#000000"));
    cs2 = new ColorSequence($rgb("#ffffff"));
    counter = new Counter(60);
});

$x.setOnUpdate(() => {
    cs1.next();
    cs2.next();
});

$x.setOnDraw(() => {
    $d.clearCanvas($rgb_p8.slate);
    $d.ellipse($v(8), $v(48), cs1.current);
    $d.ellipse($v(16), $v(32), cs2.current);
    $d.text(counter.left.toFixed().padStart(2, "0"), $v_1_1, $rgb_p8.silver);
});

$x.start({
    gameId: "@beetpx/example-tests",
    canvasSize: "64x64",
    fixedTimestep: "60fps"
});
