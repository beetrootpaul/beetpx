import { describe, expect, test } from "@jest/globals";
import { Timer } from "./Timer";

describe("Timer", () => {
  describe("#left", () => {
    test("0 seconds", () => {
      const timer = new Timer(0);
      expect(timer.left).toBe(0);
    });

    test("finished in 1 update", () => {
      const timer = new Timer(0.1);
      expect(timer.left).toBe(0.1);
      timer.update(0.1);
      expect(timer.left).toBe(0);
      timer.update(0.1);
      expect(timer.left).toBe(0);
    });

    test("finished in 2 updates", () => {
      const timer = new Timer(0.2);
      expect(timer.left).toBe(0.2);
      timer.update(0.1);
      expect(timer.left).toBeCloseTo(0.1, 1);
      timer.update(0.1);
      expect(timer.left).toBe(0);
    });

    test("finished in many updates", () => {
      const timer = new Timer(10);
      expect(timer.left).toBe(10);
      timer.update(0.1);
      expect(timer.left).toBeCloseTo(9.9, 1);
      timer.update(0.1);
      expect(timer.left).toBeCloseTo(9.8, 1);
      timer.update(9.6);
      expect(timer.left).toBeCloseTo(0.2, 1);
      timer.update(0.1);
      expect(timer.left).toBeCloseTo(0.1, 1);
      timer.update(0.1);
      expect(timer.left).toBe(0);
    });

    test("negative amount of seconds", () => {
      const timer = new Timer(-1);
      expect(timer.left).toBe(0);
    });
  });

  describe("#progress", () => {
    test("0 seconds", () => {
      const timer = new Timer(0);
      expect(timer.progress).toBe(1);
    });

    test("finished in 1 update", () => {
      const timer = new Timer(0.1);
      expect(timer.progress).toBe(0);
      timer.update(0.1);
      expect(timer.progress).toBe(1);
      timer.update(0.1);
      expect(timer.progress).toBe(1);
    });

    test("finished in 2 updates", () => {
      const timer = new Timer(0.2);
      expect(timer.progress).toBe(0);
      timer.update(0.1);
      expect(timer.progress).toBeCloseTo(0.5, 1);
      timer.update(0.1);
      expect(timer.progress).toBe(1);
    });

    test("finished in many updates", () => {
      const timer = new Timer(10);
      expect(timer.progress).toBe(0);
      timer.update(0.1);
      expect(timer.progress).toBeCloseTo(0.01, 2);
      timer.update(0.1);
      expect(timer.progress).toBeCloseTo(0.02, 2);
      timer.update(9.6);
      expect(timer.progress).toBeCloseTo(0.98, 2);
      timer.update(0.1);
      expect(timer.progress).toBeCloseTo(0.99, 2);
      timer.update(0.1);
      expect(timer.progress).toBeCloseTo(1.0, 2);
    });

    test("negative amount of seconds", () => {
      const timer = new Timer(-1);
      expect(timer.progress).toBe(1);
    });
  });

  describe("#hasFinished", () => {
    test("0 seconds", () => {
      const timer = new Timer(0);
      expect(timer.hasFinished).toBe(true);
    });

    test("finished in 1 update", () => {
      const timer = new Timer(0.1);
      expect(timer.hasFinished).toBe(false);
      timer.update(0.1);
      expect(timer.hasFinished).toBe(true);
      timer.update(0.1);
      expect(timer.hasFinished).toBe(true);
    });

    test("finished in 2 updates", () => {
      const timer = new Timer(0.2);
      expect(timer.hasFinished).toBe(false);
      timer.update(0.1);
      expect(timer.hasFinished).toBe(false);
      timer.update(0.1);
      expect(timer.hasFinished).toBe(true);
    });

    test("finished in many updates", () => {
      const timer = new Timer(10);
      expect(timer.hasFinished).toBe(false);
      timer.update(0.1);
      expect(timer.hasFinished).toBe(false);
      timer.update(0.1);
      expect(timer.hasFinished).toBe(false);
      timer.update(9.6);
      expect(timer.hasFinished).toBe(false);
      timer.update(0.1);
      expect(timer.hasFinished).toBe(false);
      timer.update(0.1);
      expect(timer.hasFinished).toBe(true);
    });

    test("negative amount of seconds", () => {
      const timer = new Timer(-1);
      expect(timer.hasFinished).toBe(true);
    });
  });
});
