import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "../BeetPx";
import { u_ } from "../Utils";
import { timer_ } from "./Timer";

// TODO: copy assertion style from BpxTimerSequence

describe("Timer", () => {
  beforeEach(() => {
    jest
      .spyOn(BeetPx, "frameNumber", "get")
      .mockImplementation(() => stubbedFrameNumber);
    nextFrameNumberWillBe(501);
  });

  describe("single pass", () => {
    test("rounding", () => {
      const timer1 = timer_(4.4);
      const timer2 = timer_(4.6);

      expect(timer1.t).toBe(0);
      expect(timer1.progress).toBe(0);
      expect(timer1.framesLeft).toBe(4);
      expect(timer1.hasFinished).toBe(false);
      expect(timer1.hasJustFinished).toBe(false);

      expect(timer2.t).toBe(0);
      expect(timer2.progress).toBe(0);
      expect(timer2.framesLeft).toBe(5);
      expect(timer2.hasFinished).toBe(false);
      expect(timer2.hasJustFinished).toBe(false);

      incrementFrameNumber();

      expect(timer1.t).toBe(1);
      expect(timer1.progress).toBe(0.25);
      expect(timer1.framesLeft).toBe(3);
      expect(timer1.hasFinished).toBe(false);
      expect(timer1.hasJustFinished).toBe(false);

      expect(timer2.t).toBe(1);
      expect(timer2.progress).toBe(0.2);
      expect(timer2.framesLeft).toBe(4);
      expect(timer2.hasFinished).toBe(false);
      expect(timer2.hasJustFinished).toBe(false);
    });

    test("0 frames long timer", () => {
      const timer = timer_(0);

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("0 frames long timer - created from a negative frames as the param", () => {
      const timerNegative = timer_(-3);
      const timerZero = timer_(0);

      u_.range(5).forEach(() => {
        expect(timerNegative.t).toBe(timerZero.t);
        expect(timerNegative.progress).toBe(timerZero.progress);
        expect(timerNegative.framesLeft).toBe(timerZero.framesLeft);
        expect(timerNegative.hasFinished).toBe(timerZero.hasFinished);
        expect(timerNegative.hasJustFinished).toBe(timerZero.hasJustFinished);

        incrementFrameNumber();
      });
    });

    test("1 frame long timer", () => {
      const timer = timer_(1);

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();

      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();

      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("2 frames long timer", () => {
      const timer = timer_(2);

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();

      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.5);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();

      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();

      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("many frames long timer", () => {
      const timer = timer_(100);

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(100);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.01);
      expect(timer.framesLeft).toBe(99);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.02);
      expect(timer.framesLeft).toBe(98);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      u_.range(96).forEach(() => {
        incrementFrameNumber();
      });

      expect(timer.t).toBe(98);
      expect(timer.progress).toBe(0.98);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();

      expect(timer.t).toBe(99);
      expect(timer.progress).toBe(0.99);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();

      expect(timer.t).toBe(100);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();

      expect(timer.t).toBe(100);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("when the time moves strangely", () => {
      nextFrameNumberWillBe(500);
      const timer = timer_(8);

      u_.range(6).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(6);
      expect(timer.progress).toBe(0.75);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(504);
      expect(timer.t).toBe(4);
      expect(timer.progress).toBe(0.5);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(502);
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.25);
      expect(timer.framesLeft).toBe(6);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(508);
      expect(timer.t).toBe(8);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      nextFrameNumberWillBe(509);
      expect(timer.t).toBe(8);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(508);
      expect(timer.t).toBe(8);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      nextFrameNumberWillBe(499);
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(8);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("pause/resume", () => {
      const timer = timer_(5);

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.pause();

      incrementFrameNumber();
      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();

      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.pause();
      timer.pause();
      timer.pause();
      timer.pause();

      incrementFrameNumber();
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();
      timer.resume();
      timer.resume();
      timer.resume();

      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(4);
      expect(timer.progress).toBe(0.8);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      timer.pause();

      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      timer.resume();

      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("already paused timer", () => {
      const timer = timer_(5, { pause: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("restart", () => {
      const timer = timer_(5);

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(3);
      expect(timer.progress).toBe(0.6);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      incrementFrameNumber();

      timer.pause();

      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      u_.range(5).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      u_.range(5).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("delayed timer", () => {
      const timer = timer_(5, { delayFrames: 3 });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();
      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();
      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(4);
      expect(timer.progress).toBe(0.8);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);
      incrementFrameNumber();
      expect(timer.t).toBe(5);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.pause();

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();

      incrementFrameNumber();
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("delayed and already paused timer", () => {
      const timer = timer_(5, { delayFrames: 3, pause: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      u_.range(12).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();
      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("delayed timer vs early restart", () => {
      const timer = timer_(5, { delayFrames: 3 });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
    });
  });

  describe("looped", () => {
    test("rounding", () => {
      const timer1 = timer_(4.4, { loop: true });
      const timer2 = timer_(4.6, { loop: true });

      expect(timer1.t).toBe(0);
      expect(timer1.progress).toBe(0);
      expect(timer1.framesLeft).toBe(4);
      expect(timer1.hasFinished).toBe(false);
      expect(timer1.hasJustFinished).toBe(false);

      expect(timer2.t).toBe(0);
      expect(timer2.progress).toBe(0);
      expect(timer2.framesLeft).toBe(5);
      expect(timer2.hasFinished).toBe(false);
      expect(timer2.hasJustFinished).toBe(false);

      u_.range(6).forEach(() => {
        incrementFrameNumber();
      });

      expect(timer1.t).toBe(2);
      expect(timer1.progress).toBe(0.5);
      expect(timer1.framesLeft).toBe(2);
      expect(timer1.hasFinished).toBe(true);
      expect(timer1.hasJustFinished).toBe(false);

      expect(timer2.t).toBe(1);
      expect(timer2.progress).toBe(0.2);
      expect(timer2.framesLeft).toBe(4);
      expect(timer2.hasFinished).toBe(true);
      expect(timer2.hasJustFinished).toBe(false);
    });

    test("0 frames long timer", () => {
      const timer = timer_(0, { loop: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(1);
      expect(timer.framesLeft).toBe(0);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);
    });

    test("0 frames long timer - created from a negative frames as the param", () => {
      const timerNegative = timer_(-3, { loop: true });
      const timerZero = timer_(0, { loop: true });

      u_.range(5).forEach(() => {
        expect(timerNegative.t).toBe(timerZero.t);
        expect(timerNegative.progress).toBe(timerZero.progress);
        expect(timerNegative.framesLeft).toBe(timerZero.framesLeft);
        expect(timerNegative.hasFinished).toBe(timerZero.hasFinished);
        expect(timerNegative.hasJustFinished).toBe(timerZero.hasJustFinished);

        incrementFrameNumber();
      });
    });

    test("1 frame long timer", () => {
      const timer = timer_(1, { loop: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);
    });

    test("2 frames long timer", () => {
      const timer = timer_(2, { loop: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.5);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.5);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);
    });

    test("many frames long timer", () => {
      const timer = timer_(100, { loop: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(100);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.01);
      expect(timer.framesLeft).toBe(99);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.02);
      expect(timer.framesLeft).toBe(98);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      u_.range(96).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(98);
      expect(timer.progress).toBe(0.98);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(99);
      expect(timer.progress).toBe(0.99);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(100);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.01);
      expect(timer.framesLeft).toBe(99);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      u_.range(97).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(98);
      expect(timer.progress).toBe(0.98);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(99);
      expect(timer.progress).toBe(0.99);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(100);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);
    });

    test("when the time moves strangely", () => {
      nextFrameNumberWillBe(500);
      const timer = timer_(8, { loop: true });

      u_.range(6).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(6);
      expect(timer.progress).toBe(0.75);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(504);
      expect(timer.t).toBe(4);
      expect(timer.progress).toBe(0.5);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(502);
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.25);
      expect(timer.framesLeft).toBe(6);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(508);
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(8);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      nextFrameNumberWillBe(516);
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(8);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      nextFrameNumberWillBe(517);
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.125);
      expect(timer.framesLeft).toBe(7);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(507);
      expect(timer.t).toBe(7);
      expect(timer.progress).toBe(0.875);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(500);
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(8);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(499);
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(8);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      nextFrameNumberWillBe(492);
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(8);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("pause/resume", () => {
      const timer = timer_(5, { loop: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.pause();

      incrementFrameNumber();
      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();

      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      u_.range(15).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      timer.pause();
      timer.pause();
      timer.pause();
      timer.pause();

      incrementFrameNumber();
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();
      timer.resume();
      timer.resume();
      timer.resume();

      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      incrementFrameNumber();
      u_.range(15).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(4);
      expect(timer.progress).toBe(0.8);
      expect(timer.framesLeft).toBe(1);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      timer.pause();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      timer.resume();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("already paused timer", () => {
      const timer = timer_(5, { loop: true, pause: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      incrementFrameNumber();
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.resume();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);
      u_.range(5).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });

    test("restart", () => {
      const timer = timer_(5, { loop: true });

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      u_.range(15).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      incrementFrameNumber();
      incrementFrameNumber();
      u_.range(15).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(3);
      expect(timer.progress).toBe(0.6);
      expect(timer.framesLeft).toBe(2);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      incrementFrameNumber();
      incrementFrameNumber();

      timer.pause();

      incrementFrameNumber();
      incrementFrameNumber();
      expect(timer.t).toBe(2);
      expect(timer.progress).toBe(0.4);
      expect(timer.framesLeft).toBe(3);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      u_.range(15).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);

      timer.restart();

      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(false);
      expect(timer.hasJustFinished).toBe(false);

      u_.range(15).forEach(() => {
        incrementFrameNumber();
      });
      expect(timer.t).toBe(0);
      expect(timer.progress).toBe(0);
      expect(timer.framesLeft).toBe(5);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(true);

      incrementFrameNumber();
      expect(timer.t).toBe(1);
      expect(timer.progress).toBe(0.2);
      expect(timer.framesLeft).toBe(4);
      expect(timer.hasFinished).toBe(true);
      expect(timer.hasJustFinished).toBe(false);
    });
  });
});

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}

function nextFrameNumberWillBe(frameNumber: number): void {
  stubbedFrameNumber = frameNumber;
}
