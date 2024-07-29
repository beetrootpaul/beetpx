import { beforeEach, describe, expect, test, vi } from "vitest";
import { $u, $v, $v_0_0, BeetPx } from "../../src";
import { MovementLine } from "./MovementLine";

describe("MovementLine", () => {
  let stubbedFrameNumber = 1;

  function incrementFrameNumber(): void {
    stubbedFrameNumber += 1;
  }

  beforeEach(() => {
    vi.spyOn(BeetPx, "frameNumberOutsidePause", "get").mockImplementation(
      () => stubbedFrameNumber,
    );
  });

  [
    {
      caseName: "right",
      startXy: $v(123, -4.56),
      angle: 0,
      angledSpeed: 2,
      expectedSpeed: $v(2, 0),
    },
    {
      caseName: "left",
      startXy: $v(123, -4.56),
      angle: 0.5,
      angledSpeed: 2,
      expectedSpeed: $v(-2, 0),
    },
    {
      caseName: "down",
      startXy: $v(123, -4.56),
      angle: 0.25,
      angledSpeed: 2,
      expectedSpeed: $v(0, 2),
    },
    {
      caseName: "up",
      startXy: $v(123, -4.56),
      angle: 0.75,
      angledSpeed: 2,
      expectedSpeed: $v(0, -2),
    },
    {
      caseName: "up, but defined with a negative turn",
      startXy: $v(123, -4.56),
      angle: -0.25,
      angledSpeed: 2,
      expectedSpeed: $v(0, -2),
    },
    {
      caseName: "up, but defined with a turn over 1",
      startXy: $v(123, -4.56),
      angle: 987.75,
      angledSpeed: 2,
      expectedSpeed: $v(0, -2),
    },
    {
      caseName: "up, but defined with a turn over 1",
      startXy: $v(123, -4.56),
      angle: 987.75,
      angledSpeed: 2,
      expectedSpeed: $v(0, -2),
    },
    {
      caseName: "left-down (45deg)",
      startXy: $v(123, -4.56),
      angle: 3 / 8,
      angledSpeed: 2,
      expectedSpeed: $v(-Math.sqrt(2), Math.sqrt(2)),
    },
  ].forEach(({ caseName, startXy, angle, angledSpeed, expectedSpeed }) => {
    test(`angle-based movement (case: ${caseName})`, () => {
      const movement = MovementLine.of({
        angle,
        angledSpeed,
      })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed.x).toBeCloseTo(expectedSpeed.x, 11);
      expect(movement.speed.y).toBeCloseTo(expectedSpeed.y, 11);
      expect(movement.hasFinished).toBe(false);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy.x).toBeCloseTo(startXy.x + expectedSpeed.x, 11);
      expect(movement.xy.y).toBeCloseTo(startXy.y + expectedSpeed.y, 11);
      expect(movement.speed.x).toBeCloseTo(expectedSpeed.x, 11);
      expect(movement.speed.y).toBeCloseTo(expectedSpeed.y, 11);
      expect(movement.hasFinished).toBe(false);
    });
  });

  test(`angle-based movement + base speed`, () => {
    const movement = MovementLine.of({
      baseSpeedXy: $v(9.87, -654),
      angle: 3 / 8,
      angledSpeed: 2,
    })($v(10, 200));

    expect(movement.xy).toEqual($v(10, 200));
    expect(movement.speed.x).toBeCloseTo(9.87 - Math.sqrt(2), 11);
    expect(movement.speed.y).toBeCloseTo(-654 + Math.sqrt(2), 11);
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();

    expect(movement.xy.x).toBeCloseTo(10 + 9.87 - Math.sqrt(2), 11);
    expect(movement.xy.y).toBeCloseTo(200 - 654 + Math.sqrt(2), 11);
    expect(movement.speed.x).toBeCloseTo(9.87 - Math.sqrt(2), 11);
    expect(movement.speed.y).toBeCloseTo(-654 + Math.sqrt(2), 11);
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy.x).toBeCloseTo(10 + 3 * (9.87 - Math.sqrt(2)), 11);
    expect(movement.xy.y).toBeCloseTo(200 + 3 * (-654 + Math.sqrt(2)), 11);
    expect(movement.speed.x).toBeCloseTo(9.87 - Math.sqrt(2), 11);
    expect(movement.speed.y).toBeCloseTo(-654 + Math.sqrt(2), 11);
    expect(movement.hasFinished).toBe(false);
  });

  test(`angle-based movement + limit of N frames`, () => {
    const movement = MovementLine.of({
      angle: 0,
      angledSpeed: 2,
      frames: 10,
    })($v(10, 200));

    expect(movement.xy).toEqual($v(10, 200));
    expect(movement.speed).toEqual($v(2, 0));
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual($v(12, 200));
    expect(movement.speed).toEqual($v(2, 0));
    expect(movement.hasFinished).toBe(false);

    $u.range(8).forEach(() => {
      incrementFrameNumber();
      movement.update();
    });

    expect(movement.xy).toEqual($v(28, 200));
    expect(movement.speed).toEqual($v(2, 0));
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual($v(30, 200));
    expect(movement.speed).toEqual($v_0_0);
    expect(movement.hasFinished).toBe(true);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual($v(30, 200));
    expect(movement.speed).toEqual($v_0_0);
    expect(movement.hasFinished).toBe(true);
  });

  test(`angle-based movement + limit of 1 frame`, () => {
    const movement = MovementLine.of({
      angle: 0,
      angledSpeed: 2,
      frames: 1,
    })($v(10, 200));

    expect(movement.xy).toEqual($v(10, 200));
    expect(movement.speed).toEqual($v(2, 0));
    expect(movement.hasFinished).toBe(false);

    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual($v(12, 200));
    expect(movement.speed).toEqual($v_0_0);
    expect(movement.hasFinished).toBe(true);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual($v(12, 200));
    expect(movement.speed).toEqual($v_0_0);
    expect(movement.hasFinished).toBe(true);
  });

  test(`angle-based movement + limit of 0 frames`, () => {
    const movement = MovementLine.of({
      angle: 0,
      angledSpeed: 2,
      frames: 0,
    })($v(10, 200));

    expect(movement.xy).toEqual($v(10, 200));
    expect(movement.speed).toEqual($v_0_0);
    expect(movement.hasFinished).toBe(true);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual($v(10, 200));
    expect(movement.speed).toEqual($v_0_0);
    expect(movement.hasFinished).toBe(true);
  });

  test(`angle-based movement + limit of -N frames`, () => {
    const movement = MovementLine.of({
      angle: 0,
      angledSpeed: 2,
      frames: -123,
    })($v(10, 200));

    expect(movement.xy).toEqual($v(10, 200));
    expect(movement.speed).toEqual($v_0_0);
    expect(movement.hasFinished).toBe(true);

    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();
    incrementFrameNumber();
    movement.update();

    expect(movement.xy).toEqual($v(10, 200));
    expect(movement.speed).toEqual($v_0_0);
    expect(movement.hasFinished).toBe(true);
  });

  [
    {
      caseName: "right",
      startXy: $v(123, -4.56),
      targetXy: $v(999_000, -4.56),
      angledSpeed: 2,
      expectedSpeed: $v(2, 0),
    },
    {
      caseName: "left",
      startXy: $v(123, -4.56),
      targetXy: $v(-999_000, -4.56),
      angledSpeed: 2,
      expectedSpeed: $v(-2, 0),
    },
    {
      caseName: "down",
      startXy: $v(123, -4.56),
      targetXy: $v(123, 999_000),
      angledSpeed: 2,
      expectedSpeed: $v(0, 2),
    },
    {
      caseName: "up",
      startXy: $v(123, -4.56),
      targetXy: $v(123, -999_000),
      angledSpeed: 2,
      expectedSpeed: $v(0, -2),
    },
    {
      caseName:
        "up, but with a target near to the start (movement should continue past it)",
      startXy: $v(123, -4.56),
      targetXy: $v(123, -4.57),
      angledSpeed: 2,
      expectedSpeed: $v(0, -2),
    },
    {
      caseName: "left-down (45deg)",
      startXy: $v(123, -4.56),
      targetXy: $v(-999_000 + 123, 999_000 - 4.56),
      angledSpeed: 2,
      expectedSpeed: $v(-Math.sqrt(2), Math.sqrt(2)),
    },
  ].forEach(({ caseName, startXy, targetXy, angledSpeed, expectedSpeed }) => {
    test(`target-based movement (case: ${caseName})`, () => {
      const movement = MovementLine.of({
        targetXy,
        angledSpeed,
      })(startXy);

      expect(movement.xy).toEqual(startXy);
      expect(movement.speed.x).toBeCloseTo(expectedSpeed.x, 11);
      expect(movement.speed.y).toBeCloseTo(expectedSpeed.y, 11);
      expect(movement.hasFinished).toBe(false);

      incrementFrameNumber();
      movement.update();

      expect(movement.xy.x).toBeCloseTo(startXy.x + expectedSpeed.x, 11);
      expect(movement.xy.y).toBeCloseTo(startXy.y + expectedSpeed.y, 11);
      expect(movement.speed.x).toBeCloseTo(expectedSpeed.x, 11);
      expect(movement.speed.y).toBeCloseTo(expectedSpeed.y, 11);
      expect(movement.hasFinished).toBe(false);
    });
  });
});
