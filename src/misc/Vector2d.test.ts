import { describe, expect, test } from "@jest/globals";
import { BpxVector2d } from "./Vector2d";

describe("Vector2d", () => {
  describe("angle <-> vector", () => {
    test("basic vector to angle conversions (right angles)", () => {
      expect(new BpxVector2d(1, 0).toAngle()).toEqual(0);
      expect(new BpxVector2d(123, 0).toAngle()).toEqual(0);
      expect(new BpxVector2d(1.23, 0).toAngle()).toEqual(0);

      expect(new BpxVector2d(0, 1).toAngle()).toEqual(0.25);
      expect(new BpxVector2d(0, 123).toAngle()).toEqual(0.25);
      expect(new BpxVector2d(0, 1.23).toAngle()).toEqual(0.25);

      expect(new BpxVector2d(-1, 0).toAngle()).toEqual(0.5);
      expect(new BpxVector2d(-123, 0).toAngle()).toEqual(0.5);
      expect(new BpxVector2d(-1.23, 0).toAngle()).toEqual(0.5);

      expect(new BpxVector2d(0, -1).toAngle()).toEqual(0.75);
      expect(new BpxVector2d(0, -123).toAngle()).toEqual(0.75);
      expect(new BpxVector2d(0, -1.23).toAngle()).toEqual(0.75);
    });

    test("basic angle to vector conversions (right angles)", () => {
      expect(BpxVector2d.unitFromAngle(0).x).toBeCloseTo(1.0, 15);
      expect(BpxVector2d.unitFromAngle(0).y).toBeCloseTo(0.0, 15);

      expect(BpxVector2d.unitFromAngle(0.25).x).toBeCloseTo(0.0, 15);
      expect(BpxVector2d.unitFromAngle(0.25).y).toBeCloseTo(1.0, 15);

      expect(BpxVector2d.unitFromAngle(0.5).x).toBeCloseTo(-1.0, 15);
      expect(BpxVector2d.unitFromAngle(0.5).y).toBeCloseTo(0.0, 15);

      expect(BpxVector2d.unitFromAngle(-0.25).x).toBeCloseTo(0.0, 15);
      expect(BpxVector2d.unitFromAngle(-0.25).y).toBeCloseTo(-1.0, 15);
    });

    test("conversion back and forth", () => {
      const v = new BpxVector2d(-123, -456);
      expect(BpxVector2d.unitFromAngle(v.toAngle()).x).toBeCloseTo(
        v.x / v.magnitude(),
        14,
      );
      expect(BpxVector2d.unitFromAngle(v.toAngle()).y).toBeCloseTo(
        v.y / v.magnitude(),
        14,
      );
    });
  });
});
