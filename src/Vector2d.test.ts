import { describe, expect, test } from "@jest/globals";
import { v2d_, v_ } from "./Vector2d";

describe("Vector2d", () => {
  describe("angle <-> vector", () => {
    test("basic vector to angle conversions (right angles)", () => {
      expect(v_.angleOf([1, 0])).toEqual(0);
      expect(v_.angleOf([123, 0])).toEqual(0);
      expect(v_.angleOf([1.23, 0])).toEqual(0);

      expect(v_.angleOf([0, 1])).toEqual(0.25);
      expect(v_.angleOf([0, 123])).toEqual(0.25);
      expect(v_.angleOf([0, 1.23])).toEqual(0.25);

      expect(v_.angleOf([-1, 0])).toEqual(0.5);
      expect(v_.angleOf([-123, 0])).toEqual(0.5);
      expect(v_.angleOf([-1.23, 0])).toEqual(0.5);

      expect(v_.angleOf([0, -1])).toEqual(-0.25);
      expect(v_.angleOf([0, -123])).toEqual(-0.25);
      expect(v_.angleOf([0, -1.23])).toEqual(-0.25);
    });

    test("basic angle to vector conversions (right angles)", () => {
      expect(v_.unitFromAngle(0)[0]).toBeCloseTo(1.0, 15);
      expect(v_.unitFromAngle(0)[1]).toBeCloseTo(0.0, 15);

      expect(v_.unitFromAngle(0.25)[0]).toBeCloseTo(0.0, 15);
      expect(v_.unitFromAngle(0.25)[1]).toBeCloseTo(1.0, 15);

      expect(v_.unitFromAngle(0.5)[0]).toBeCloseTo(-1.0, 15);
      expect(v_.unitFromAngle(0.5)[1]).toBeCloseTo(0.0, 15);

      expect(v_.unitFromAngle(-0.25)[0]).toBeCloseTo(0.0, 15);
      expect(v_.unitFromAngle(-0.25)[1]).toBeCloseTo(-1.0, 15);
    });

    test("conversion back and forth", () => {
      const v = v2d_(-123, -456);
      expect(v_.unitFromAngle(v_.angleOf(v))[0]).toBeCloseTo(
        v[0] / v_.magnitude(v),
        15,
      );
      expect(v_.unitFromAngle(v_.angleOf(v))[1]).toBeCloseTo(
        v[1] / v_.magnitude(v),
        15,
      );
    });
  });
});
