import { $d, $spr, $u, $v, BpxVector2d } from "../../../src";

const n = 16;

export class Room {
  #tileFloor = $spr("tiles.png")(8, 8, 0, 0);
  #tileWall = $spr("tiles.png")(8, 8, 8, 0);

  draw(): void {
    $u.range(n).forEach(row => {
      $u.range(n).forEach(col => {
        $d.sprite(
          row === 0 || row === n - 1 || col === 0 || col === n - 1 ?
            this.#tileWall
          : this.#tileFloor,
          $v(col, row).mul(8),
        );
      });
    });
  }

  isReachableByLight(xy: BpxVector2d): boolean {
    return xy.x >= 7 && xy.x <= 120 && xy.y >= 6 && xy.y <= 120;
  }
}
