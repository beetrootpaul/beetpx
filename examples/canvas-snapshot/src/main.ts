import {
  $,
  $d,
  $rgb,
  $u,
  $v,
  BpxCanvasSnapshotColorMapping,
  BpxRgbColor,
} from "../../../src";
import { Fire } from "./Fire";
import { Room } from "./Room";

$.init({
  canvasSize: "128x128",
  fixedTimestep: "60fps",
  assets: ["tiles.png", "fire.png"],
  debugMode: {
    available: true,
  },
}).then(async ({ startGame }) => {
  const room = new Room();
  const fire1 = new Fire();
  const fire2 = new Fire();
  fire1.setPosition($v(32));
  fire2.setPosition($v(64));

  let lightRadius = 0;

  const colorMapperLighten = (color: BpxRgbColor | null): BpxRgbColor | null =>
    color ?
      $rgb((50 + color.r) * 1.25, (30 + color.g) * 1.2, (10 + color.b) * 1.05)
    : null;

  const colorMapperReachableOnly = (
    color: BpxRgbColor | null,
    x: number,
    y: number,
  ): BpxRgbColor | null => (room.isReachableByLight(x, y) ? color : null);

  $.setOnUpdate(() => {
    fire1.setPosition(
      fire1.position.add($.getPressedDirection()).clamp($v(12), $v(116)),
    );
    lightRadius = 30 + $u.trigCos($.frameNumber / 40);
  });

  $.setOnDraw(() => {
    room.draw();

    $d.takeCanvasSnapshot();
    drawLightAround(fire1);
    drawLightAround(fire2);

    fire1.draw();
    fire2.draw();
  });

  function drawLightAround(fire: Fire): void {
    $d.ellipseFilled(
      fire.position.sub(lightRadius),
      $v(lightRadius * 2),
      BpxCanvasSnapshotColorMapping.of((color, x, y) =>
        colorMapperLighten(colorMapperReachableOnly(color, x, y)),
      ),
    );
  }

  await startGame();
});
