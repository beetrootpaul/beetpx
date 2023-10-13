import { describe, expect, test } from "@jest/globals";
import { v2d_ } from "../Vector2d";
import { BpxClippingRegion } from "./ClippingRegion";

describe("ClippingRegion", () => {
  describe("#allowsDrawingAt", () => {
    test("a regular region", () => {
      // given
      const clippingRegion = new BpxClippingRegion(
        v2d_(-100, -200),
        v2d_(400, 600),
      );

      // top-left corner
      expect(clippingRegion.allowsDrawingAt(v2d_(-100, -200))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v2d_(-100, -201))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(-101, -200))).toBe(false);

      // top-right corner
      expect(clippingRegion.allowsDrawingAt(v2d_(299, -200))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v2d_(299, -201))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(300, -200))).toBe(false);

      // bottom-left corner
      expect(clippingRegion.allowsDrawingAt(v2d_(-100, 399))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v2d_(-100, 400))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(-101, 399))).toBe(false);

      // bottom-right corner
      expect(clippingRegion.allowsDrawingAt(v2d_(299, 399))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v2d_(299, 400))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(300, 399))).toBe(false);
    });

    test("a negative size region", () => {
      // given
      const clippingRegion = new BpxClippingRegion(
        v2d_(300, 400),
        v2d_(-400, -600),
      );

      // top-left corner
      expect(clippingRegion.allowsDrawingAt(v2d_(-100, -200))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v2d_(-100, -201))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(-101, -200))).toBe(false);

      // top-right corner
      expect(clippingRegion.allowsDrawingAt(v2d_(299, -200))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v2d_(299, -201))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(300, -200))).toBe(false);

      // bottom-left corner
      expect(clippingRegion.allowsDrawingAt(v2d_(-100, 399))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v2d_(-100, 400))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(-101, 399))).toBe(false);

      // bottom-right corner
      expect(clippingRegion.allowsDrawingAt(v2d_(299, 399))).toBe(true);
      expect(clippingRegion.allowsDrawingAt(v2d_(299, 400))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(300, 399))).toBe(false);
    });

    test("1x1", () => {
      // given
      const clippingRegion = new BpxClippingRegion(v2d_(0, 0), v2d_(1, 1));

      // center
      expect(clippingRegion.allowsDrawingAt(v2d_(0, 0))).toBe(true);

      // around
      expect(clippingRegion.allowsDrawingAt(v2d_(-1, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(-1, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(0, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(1, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(1, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(1, 1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(0, 1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(-1, 1))).toBe(false);
    });

    test("0x0", () => {
      // given
      const clippingRegion = new BpxClippingRegion(v2d_(0, 0), v2d_(0, 0));

      expect(clippingRegion.allowsDrawingAt(v2d_(-1, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(0, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(1, -1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(-1, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(0, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(1, 0))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(-1, 1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(0, 1))).toBe(false);
      expect(clippingRegion.allowsDrawingAt(v2d_(1, 1))).toBe(false);
    });
  });
});
