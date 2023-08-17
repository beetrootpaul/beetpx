import { describe, expect, test } from "@jest/globals";
import { v_ } from "../Vector2d";
import { ClippingRegion } from "./ClippingRegion";

describe("ClippingRegion", () => {
  describe("#allowsDrawingAt", () => {
    test("a regular region", () => {
      // given
      const clippingRegion = new ClippingRegion(v_(-100, -200), v_(400, 600));

      // top-left corner
      expect(clippingRegion.allowsDrawingAt(v_(-100, -200))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v_(-100, -201))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(-101, -200))).toBe(false);

      // top-right corner
      expect(clippingRegion.allowsDrawingAt(v_(299, -200))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v_(299, -201))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(300, -200))).toBe(false);

      // bottom-left corner
      expect(clippingRegion.allowsDrawingAt(v_(-100, 399))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v_(-100, 400))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(-101, 399))).toBe(false);

      // bottom-right corner
      expect(clippingRegion.allowsDrawingAt(v_(299, 399))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v_(299, 400))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(300, 399))).toBe(false);
    });

    test("a negative size region", () => {
      // given
      const clippingRegion = new ClippingRegion(v_(300, 400), v_(-400, -600));

      // top-left corner
      expect(clippingRegion.allowsDrawingAt(v_(-100, -200))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v_(-100, -201))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(-101, -200))).toBe(false);

      // top-right corner
      expect(clippingRegion.allowsDrawingAt(v_(299, -200))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v_(299, -201))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(300, -200))).toBe(false);

      // bottom-left corner
      expect(clippingRegion.allowsDrawingAt(v_(-100, 399))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v_(-100, 400))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(-101, 399))).toBe(false);

      // bottom-right corner
      expect(clippingRegion.allowsDrawingAt(v_(299, 399))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v_(299, 400))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(300, 399))).toBe(false);
    });

    test("1x1", () => {
      // given
      const clippingRegion = new ClippingRegion(v_(0, 0), v_(1, 1));

      // center
      expect(clippingRegion.allowsDrawingAt(v_(0, 0))).toBe(true);

      // around
      expect(clippingRegion.allowsDrawingAt(v_(-1, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(-1, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(0, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(1, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(1, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(1, 1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(0, 1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(-1, 1))).toBe(false);
    });

    test("0x0", () => {
      // given
      const clippingRegion = new ClippingRegion(v_(0, 0), v_(0, 0));

      expect(clippingRegion.allowsDrawingAt(v_(-1, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(0, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(1, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(-1, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(0, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(1, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(-1, 1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(0, 1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v_(1, 1))).toBe(false);
    });
  });
});
