import {
  $,
  $d,
  $rgb,
  $u,
  $v,
  BpxCanvasSnapshotColorMapping,
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

  const lightMapper = BpxCanvasSnapshotColorMapping.of(sourceColor =>
    !sourceColor ? null : (
      $rgb(sourceColor.r * 2.2, sourceColor.g * 1.6, sourceColor.b * 1.2)
    ),
  );

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
      lightMapper,
    );
  }

  await startGame();
});
