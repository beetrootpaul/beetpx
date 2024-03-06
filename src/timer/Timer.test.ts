import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "../BeetPx";
import { u_ } from "../Utils";
import { timer_ } from "../shorthands";
import { BpxTimer } from "./Timer";

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}

function nextFrameNumberWillBe(frameNumber: number): void {
  stubbedFrameNumber = frameNumber;
}

function pickPropertyOfTimer(propertyName: string) {
  return (timer: BpxTimer) => {
    return {
      // @ts-ignore
      [propertyName]: timer[propertyName],
    };
  };
}

function pickPropertyOfExpectedValues(propertyName: string) {
  return (expectedValues: {
    t: number;
    progress: number;
    framesLeft: number;
    hasFinished: boolean;
    hasJustFinished: boolean;
  }) => {
    return {
      // @ts-ignore
      [propertyName]: expectedValues[propertyName],
    };
  };
}

// The reasoning behind such test setup:
//   - keep expected values together in tests, since they are highly co-related
//   - assert them separately over the whole test scenario, since it makes debugging
//     easier and allows to focus on implementation of a single property
const allPropertiesToTest = [
  "t",
  "progress",
  "framesLeft",
  "hasFinished",
  "hasJustFinished",
];

describe("Timer", () => {
  beforeEach(() => {
    jest
      .spyOn(BeetPx, "frameNumber", "get")
      .mockImplementation(() => stubbedFrameNumber);
    nextFrameNumberWillBe(501);
  });

  describe.each(allPropertiesToTest)(
    'single pass (tested property: "%s")',
    (testedProperty) => {
      const ppt = pickPropertyOfTimer(testedProperty);
      const ppev = pickPropertyOfExpectedValues(testedProperty);

      test("rounding", () => {
        const timer1 = timer_(4.4);
        const timer2 = timer_(4.6);

        expect(ppt(timer1)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        expect(ppt(timer2)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer1)).toEqual(
          ppev({
            t: 1,
            progress: 0.25,
            framesLeft: 3,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        expect(ppt(timer2)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });

      test("0 frames long timer", () => {
        const timer = timer_(0);

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("0 frames long timer - created from a negative frames as the param", () => {
        const timerNegative = timer_(-3);
        const timerZero = timer_(0);

        u_.range(5).forEach(() => {
          expect(ppt(timerNegative)).toEqual(ppt(timerZero));

          incrementFrameNumber();
        });
      });

      test("1 frame long timer", () => {
        const timer = timer_(1);

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("2 frames long timer", () => {
        const timer = timer_(2);

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 2,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.5,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("many frames long timer", () => {
        const timer = timer_(100);

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 100,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.01,
            framesLeft: 99,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.02,
            framesLeft: 98,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        u_.range(96).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 98,
            progress: 0.98,
            framesLeft: 2,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 99,
            progress: 0.99,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 100,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 100,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("when the time moves strangely", () => {
        nextFrameNumberWillBe(500);
        const timer = timer_(8);

        u_.range(6).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 6,
            progress: 0.75,
            framesLeft: 2,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(504);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 4,
            progress: 0.5,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(502);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.25,
            framesLeft: 6,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(508);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 8,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        nextFrameNumberWillBe(509);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 8,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(508);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 8,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        nextFrameNumberWillBe(499);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 8,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });

      test("pause/resume", () => {
        const timer = timer_(5);

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.pause();

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.pause();
        timer.pause();
        timer.pause();
        timer.pause();

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();
        timer.resume();
        timer.resume();
        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 4,
            progress: 0.8,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        timer.pause();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("already paused timer", () => {
        const timer = timer_(5, { pause: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });

      test("restart", () => {
        const timer = timer_(5);

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 3,
            progress: 0.6,
            framesLeft: 2,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();

        timer.pause();

        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        u_.range(5).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        u_.range(5).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("delayed timer", () => {
        const timer = timer_(5, { delayFrames: 3 });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 4,
            progress: 0.8,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 5,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.pause();

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });

      test("delayed and already paused timer", () => {
        const timer = timer_(5, { delayFrames: 3, pause: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        u_.range(12).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });

      test("delayed timer vs early restart", () => {
        const timer = timer_(5, { delayFrames: 3 });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });
    },
  );

  describe.each(allPropertiesToTest)(
    'looped (tested property: "%s")',
    (testedProperty) => {
      const ppt = pickPropertyOfTimer(testedProperty);
      const ppev = pickPropertyOfExpectedValues(testedProperty);

      test("rounding", () => {
        const timer1 = timer_(4.4, { loop: true });
        const timer2 = timer_(4.6, { loop: true });

        expect(ppt(timer1)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
        expect(ppt(timer2)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        u_.range(6).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(timer1)).toEqual(
          ppev({
            t: 2,
            progress: 0.5,
            framesLeft: 2,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
        expect(ppt(timer2)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("0 frames long timer", () => {
        const timer = timer_(0, { loop: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 1,
            framesLeft: 0,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );
      });

      test("0 frames long timer - created from a negative frames as the param", () => {
        const timerNegative = timer_(-3, { loop: true });
        const timerZero = timer_(0, { loop: true });

        u_.range(5).forEach(() => {
          expect(ppt(timerNegative)).toEqual(ppt(timerZero));

          incrementFrameNumber();
        });
      });

      test("1 frame long timer", () => {
        const timer = timer_(1, { loop: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 1,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 1,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );
      });

      test("2 frames long timer", () => {
        const timer = timer_(2, { loop: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 2,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.5,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 2,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.5,
            framesLeft: 1,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 2,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );
      });

      test("many frames long timer", () => {
        const timer = timer_(100, { loop: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 100,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.01,
            framesLeft: 99,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.02,
            framesLeft: 98,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        u_.range(96).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 98,
            progress: 0.98,
            framesLeft: 2,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 99,
            progress: 0.99,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 100,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.01,
            framesLeft: 99,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        u_.range(97).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 98,
            progress: 0.98,
            framesLeft: 2,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 99,
            progress: 0.99,
            framesLeft: 1,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 100,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );
      });

      test("when the time moves strangely", () => {
        nextFrameNumberWillBe(500);
        const timer = timer_(8, { loop: true });

        u_.range(6).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 6,
            progress: 0.75,
            framesLeft: 2,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(504);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 4,
            progress: 0.5,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(502);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.25,
            framesLeft: 6,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(508);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 8,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        nextFrameNumberWillBe(516);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 8,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        nextFrameNumberWillBe(517);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.125,
            framesLeft: 7,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(507);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 7,
            progress: 0.875,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(500);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 8,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(499);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 8,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        nextFrameNumberWillBe(492);
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 8,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });

      test("pause/resume", () => {
        const timer = timer_(5, { loop: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.pause();

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        u_.range(15).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.pause();
        timer.pause();
        timer.pause();
        timer.pause();

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.resume();
        timer.resume();
        timer.resume();
        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        u_.range(15).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 4,
            progress: 0.8,
            framesLeft: 1,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        timer.pause();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("already paused timer", () => {
        const timer = timer_(5, { loop: true, pause: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
        u_.range(5).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });

      test("restart", () => {
        const timer = timer_(5, { loop: true });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        u_.range(15).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        u_.range(15).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 3,
            progress: 0.6,
            framesLeft: 2,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();

        timer.pause();

        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        u_.range(15).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        u_.range(15).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("delayed timer", () => {
        const timer = timer_(5, { loop: true, delayFrames: 3 });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 4,
            progress: 0.8,
            framesLeft: 1,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.pause();

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 2,
            progress: 0.4,
            framesLeft: 3,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );
      });

      test("delayed and already paused timer", () => {
        const timer = timer_(5, {
          loop: true,
          delayFrames: 3,
          pause: true,
        });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        u_.range(12).forEach(() => {
          incrementFrameNumber();
        });
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        timer.resume();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });

      test("delayed timer vs early restart", () => {
        const timer = timer_(5, { loop: true, delayFrames: 3 });

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();

        timer.restart();

        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: false,
            hasJustFinished: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 0,
            progress: 0,
            framesLeft: 5,
            hasFinished: true,
            hasJustFinished: true,
          }),
        );

        incrementFrameNumber();
        expect(ppt(timer)).toEqual(
          ppev({
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            hasFinished: true,
            hasJustFinished: false,
          }),
        );
      });
    },
  );
});
