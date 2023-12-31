import { describe, expect, test } from "@jest/globals";
import { BpxUtils } from "../Utils";
import { timer_ } from "./Timer";

describe("Timer", () => {
  describe("#framesLeft", () => {
    test("for a 0 frames long timer", () => {
      const timer = timer_(0);
      expect(timer.framesLeft).toBe(0);
    });

    test("for a 1 frame long timer", () => {
      const timer = timer_(1);
      expect(timer.framesLeft).toBe(1);
      timer.update();
      expect(timer.framesLeft).toBe(0);
      timer.update();
      expect(timer.framesLeft).toBe(0);

      timer.restart();

      expect(timer.framesLeft).toBe(1);
      timer.update();
      expect(timer.framesLeft).toBe(0);
    });

    test("for a 2 frames long timer", () => {
      const timer = timer_(2);
      expect(timer.framesLeft).toBe(2);
      timer.update();
      expect(timer.framesLeft).toBe(1);
      timer.update();
      expect(timer.framesLeft).toBe(0);

      timer.restart();

      expect(timer.framesLeft).toBe(2);
      timer.update();
      expect(timer.framesLeft).toBe(1);
    });

    test("for a many frames long timer", () => {
      const timer = timer_(100);
      expect(timer.framesLeft).toBe(100);
      timer.update();
      expect(timer.framesLeft).toBe(99);
      timer.update();
      expect(timer.framesLeft).toBe(98);
      BpxUtils.range(96).forEach(() => {
        timer.update();
      });
      expect(timer.framesLeft).toBe(2);
      timer.update();
      expect(timer.framesLeft).toBe(1);
      timer.update();
      expect(timer.framesLeft).toBe(0);
      timer.update();
      expect(timer.framesLeft).toBe(0);

      timer.restart();

      expect(timer.framesLeft).toBe(100);
      timer.update();
      expect(timer.framesLeft).toBe(99);
    });

    test("for a negative amount of frames", () => {
      const timer = timer_(-1);
      expect(timer.framesLeft).toBe(0);
      timer.update();
      expect(timer.framesLeft).toBe(0);

      timer.restart();

      expect(timer.framesLeft).toBe(0);
    });
  });

  describe("#progress", () => {
    test("for a 0 frames long timer", () => {
      const timer = timer_(0);
      expect(timer.progress).toBe(1);

      timer.restart();

      expect(timer.progress).toBe(1);
    });

    test("for a 1 frame long timer", () => {
      const timer = timer_(1);
      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBe(1);
      timer.update();
      expect(timer.progress).toBe(1);

      timer.restart();

      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBe(1);
    });

    test("for a 2 frames long timer", () => {
      const timer = timer_(2);
      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBe(0.5);
      timer.update();
      expect(timer.progress).toBe(1);

      timer.restart();

      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBe(0.5);
    });

    test("for a many frames long timer", () => {
      const timer = timer_(100);
      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBeCloseTo(0.01, 2);
      timer.update();
      expect(timer.progress).toBeCloseTo(0.02, 2);
      BpxUtils.range(96).forEach(() => {
        timer.update();
      });
      expect(timer.progress).toBeCloseTo(0.98, 2);
      timer.update();
      expect(timer.progress).toBeCloseTo(0.99, 2);
      timer.update();
      expect(timer.progress).toBeCloseTo(1.0, 2);
      timer.update();
      expect(timer.progress).toBeCloseTo(1.0, 2);

      timer.restart();

      expect(timer.progress).toBe(0);
      timer.update();
      expect(timer.progress).toBeCloseTo(0.01, 2);
    });

    test("for a negative amount of frames", () => {
      const timer = timer_(-1);
      expect(timer.progress).toBe(1);
      timer.update();
      expect(timer.progress).toBe(1);

      timer.restart();

      expect(timer.progress).toBe(1);
    });
  });

  describe("#hasFinished", () => {
    test("for a 0 frames long timer", () => {
      const timer = timer_(0);
      expect(timer.hasFinished).toBe(true);

      timer.restart();

      expect(timer.hasFinished).toBe(true);
    });

    test("for a 1 frame long timer", () => {
      const timer = timer_(1);
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(true);
      timer.update();
      expect(timer.hasFinished).toBe(true);

      timer.restart();

      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(true);
    });

    test("for a 2 frames long timer", () => {
      const timer = timer_(2);
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(true);

      timer.restart();

      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
    });

    test("for a many frames long timer", () => {
      const timer = timer_(100);
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
      BpxUtils.range(96).forEach(() => {
        timer.update();
      });
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(true);
      timer.update();
      expect(timer.hasFinished).toBe(true);

      timer.restart();

      expect(timer.hasFinished).toBe(false);
      timer.update();
      expect(timer.hasFinished).toBe(false);
    });

    test("for a negative amount of frames", () => {
      const timer = timer_(-1);
      expect(timer.hasFinished).toBe(true);
      timer.update();
      expect(timer.hasFinished).toBe(true);

      timer.restart();

      expect(timer.hasFinished).toBe(true);
    });
  });
});
