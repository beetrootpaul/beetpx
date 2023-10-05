import { describe, expect, test } from "@jest/globals";
import { BpxUtils } from "../Utils";
import { BpxTimer } from "./Timer";

describe("Timer", () => {
  describe("#framesLeft", () => {
    test("for a 0 frames long timer", () => {
      const timer = new BpxTimer({ frames: 0 });
      expect(timer.framesLeft).toBe(0);
    });

    test("for a 1 frame long timer", () => {
      const timer = new BpxTimer({ frames: 1 });
      expect(timer.framesLeft).toBe(1);
      timer.update();
      expect(timer.framesLeft).toBe(0);
      timer.update();
      expect(timer.framesLeft).toBe(0);
    });

    test("for a 2 frames long timer", () => {
      const timer = new BpxTimer({ frames: 2 });
      expect(timer.framesLeft).toBe(2);
      timer.update();
      expect(timer.framesLeft).toBe(1);
      timer.update();
      expect(timer.framesLeft).toBe(0);
    });

    test("for a many frames long timer", () => {
      const timer = new BpxTimer({ frames: 100 });
      expect(timer.framesLeft).toBe(100);
      timer.update();
      expect(timer.framesLeft).toBe(99);
      timer.update();
      expect(timer.framesLeft).toBe(98);
      BpxUtils.repeatN(96, () => {
        timer.update();
      });
      expect(timer.framesLeft).toBe(2);
      timer.update();
      expect(timer.framesLeft).toBe(1);
      timer.update();
      expect(timer.framesLeft).toBe(0);
    });

    test("for a negative amount of frames", () => {
      const timer = new BpxTimer({ frames: -1 });
      expect(timer.framesLeft).toBe(0);
    });
  });

  describe("#progress", () => {
    test("for a 0 frames long timer", () => {
      const timer = new BpxTimer({ frames: 0 });
      expect(timer.progress).toBe(1);
    });

    test("for a 1 frame long timer", () => {
      const timer = new BpxTimer({ frames: 1 });
      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBe(1);
      timer.update();
      expect(timer.progress).toBe(1);
    });

    test("for a 2 frames long timer", () => {
      const timer = new BpxTimer({ frames: 2 });
      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBe(0.5);
      timer.update();
      expect(timer.progress).toBe(1);
    });

    test("for a many frames long timer", () => {
      const timer = new BpxTimer({ frames: 100 });
      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBeCloseTo(0.01, 2);
      timer.update();
      expect(timer.progress).toBeCloseTo(0.02, 2);
      BpxUtils.repeatN(96, () => {
        timer.update();
      });
      expect(timer.progress).toBeCloseTo(0.98, 2);
      timer.update();
      expect(timer.progress).toBeCloseTo(0.99, 2);
      timer.update();
      expect(timer.progress).toBeCloseTo(1.0, 2);
    });

    test("for a negative amount of frames", () => {
      const timer = new BpxTimer({ frames: -1 });
      expect(timer.progress).toBe(1);
    });
  });

  describe("#hasFinished", () => {
    test("for a 0 frames long timer", () => {
      const timer = new BpxTimer({ frames: 0 });
      expect(timer.hasFinished).toBe(true);
    });

    test("for a 1 frame long timer", () => {
      const timer = new BpxTimer({ frames: 1 });
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(true);
      timer.update();
      expect(timer.hasFinished).toBe(true);
    });

    test("for a 2 frames long timer", () => {
      const timer = new BpxTimer({ frames: 2 });
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(true);
    });

    test("for a many frames long timer", () => {
      const timer = new BpxTimer({ frames: 100 });
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
      BpxUtils.repeatN(96, () => {
        timer.update();
      });
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(true);
    });

    test("for a negative amount of frames", () => {
      const timer = new BpxTimer({ frames: -1 });
      expect(timer.hasFinished).toBe(true);
    });
  });
});
