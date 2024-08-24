import { describe, expect, test } from "vitest";
import { $v } from "../../shorthands";
import { SpriteCanvasXyMapper } from "./SpriteCanvasXyMapper";

describe("SpriteCanvasXyMapper", () => {
  [$v(0, 1), $v(1, 0), $v(1, 1), $v(3, 2), $v(2, 3), $v(3, 3)].forEach(
    scaleXy => {
      describe(`mapping both ways, with scaleXy [${scaleXy}]`, () => {
        [
          $v(0, -20),
          $v(0, -0.2),
          $v(0, 0.2),
          $v(0, 20),
          $v(-20, 0),
          $v(-0.2, 0),
          $v(0.2, 0),
          $v(20, 0),
        ].forEach(targetXy => {
          describe(`with targetXy ${targetXy}`, () => {
            const xyMapper = new SpriteCanvasXyMapper(targetXy, scaleXy);

            [
              $v(0, 0),
              $v(-2, 100),
              $v(-100, 2),
              $v(2, -100),
              $v(100, -2),
              $v(-5.5, 3.3),
              $v(3.3, -5.5),
            ].forEach(spriteXy => {
              test(`for spriteXy ${spriteXy}`, () => {
                const canvasXyFromSprite = xyMapper.toCanvasXy(spriteXy);
                const [spriteXFromCanvas, spriteYFromCanvas] =
                  xyMapper.toSpriteXy(
                    canvasXyFromSprite.x,
                    canvasXyFromSprite.y,
                  );

                expect(fixedForNegZero(spriteXFromCanvas)).toEqual(
                  scaleXy.x === 0 ? 0 : Math.floor(spriteXy.x),
                );
                expect(fixedForNegZero(spriteYFromCanvas)).toEqual(
                  scaleXy.y === 0 ? 0 : Math.floor(spriteXy.y),
                );
              });
            });
          });
        });
      });
    },
  );
});

function fixedForNegZero(value: number): number {
  return value === -0 ? 0 : value;
}
