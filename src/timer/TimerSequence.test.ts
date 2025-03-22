import { beforeEach, describe, expect, test, vi } from "vitest";
import { BeetPx } from "../";
import { range } from "../utils/range";

import { $timerSeq } from "../shorthands";
import { BpxTimerSequence } from "./TimerSequence";

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}

function nextFrameNumberWillBe(frameNumber: number): void {
  stubbedFrameNumber = frameNumber;
}

function pickPropertyOfTimer<TPhaseName extends string>(
  propertyName: TPhaseName,
) {
  return (timer: BpxTimerSequence<TPhaseName>) => {
    return {
      // @ts-expect-error TS2536: Type 'TPhaseName' cannot be used to index type 'BpxTimerSequence<TPhaseName>'.
      [propertyName]: timer[propertyName],
    };
  };
}

function pickPropertyOfExpectedValues<TPhaseName extends string>(
  propertyName: TPhaseName,
) {
  return (expectedValues: {
    tOverall: number;
    progressOverall: number;
    framesLeftOverall: number;
    hasFinishedOverall: boolean;
    hasJustFinishedOverall: boolean;
    justFinishedPhase: TPhaseName | null;
    currentPhase: TPhaseName | null;
    t: number;
    progress: number;
    framesLeft: number;
    isPaused: boolean;
  }) => {
    return {
      // @ts-expect-error TS2536: Type 'TPhaseName' cannot be used to index type '{ tOverall: number; progressOverall: number; framesLeftOverall: number; hasFinishedOverall: boolean; hasJustFinishedOverall: boolean; justFinishedPhase: TPhaseName | null; currentPhase: TPhaseName | null; t: number; progress: number; framesLeft: number; }'.
      [propertyName]: expectedValues[propertyName],
    };
  };
}

// The reasoning behind such test setup:
//   - keep expected values together in tests, since they are highly co-related
//   - assert them separately over the whole test scenario, since it makes debugging
//     easier and allows to focus on implementation of a single property
const allPropertiesToTest = [
  "tOverall",
  "progressOverall",
  "framesLeftOverall",
  "hasFinishedOverall",
  "hasJustFinishedOverall",
  "justFinishedPhase",
  "currentPhase",
  "t",
  "progress",
  "framesLeft",
  "isPaused",
];

describe("TimerSequence", () => {
  beforeEach(() => {
    vi.spyOn(BeetPx, "frameNumberOutsidePause", "get").mockImplementation(
      () => stubbedFrameNumber,
    );
    nextFrameNumberWillBe(501);
  });

  describe("intro only", () => {
    test.each(allPropertiesToTest)(
      'iterates over phases (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        const framesAaa = 100;
        const framesBbb = 20;
        const framesCcc = 40;

        const seq = $timerSeq({
          intro: [
            ["aaa", framesAaa],
            ["bbb", framesBbb],
            ["ccc", framesCcc],
          ],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        range(framesAaa - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: t,
              progressOverall: t / (framesAaa + framesBbb + framesCcc),
              framesLeftOverall: framesAaa + framesBbb + framesCcc - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "aaa",
              t: t,
              progress: t / framesAaa,
              framesLeft: framesAaa - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa,
            progressOverall: framesAaa / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "aaa",
            currentPhase: "bbb",
            t: 0,
            progress: 0,
            framesLeft: framesBbb,
            isPaused: false,
          }),
        );

        range(framesBbb - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesAaa + t,
              progressOverall:
                (framesAaa + t) / (framesAaa + framesBbb + framesCcc),
              framesLeftOverall: framesBbb + framesCcc - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "bbb",
              t: t,
              progress: t / framesBbb,
              framesLeft: framesBbb - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb,
            progressOverall:
              (framesAaa + framesBbb) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "bbb",
            currentPhase: "ccc",
            t: 0,
            progress: 0,
            framesLeft: framesCcc,
            isPaused: false,
          }),
        );

        range(framesCcc - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesAaa + framesBbb + t,
              progressOverall:
                (framesAaa + framesBbb + t) /
                (framesAaa + framesBbb + framesCcc),
              framesLeftOverall: framesCcc - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "ccc",
              t: t,
              progress: t / framesCcc,
              framesLeft: framesCcc - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + framesCcc,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ccc",
            currentPhase: "ccc",
            t: framesCcc,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + framesCcc,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ccc",
            t: framesCcc,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'pause/resume (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;

        const seq = $timerSeq({
          intro: [
            ["aaa", framesAaa],
            ["bbb", framesBbb],
            ["ccc", framesCcc],
          ],
        });

        range(framesAaa).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa,
            progressOverall: framesAaa / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "aaa",
            currentPhase: "bbb",
            t: 0,
            progress: 0,
            framesLeft: framesBbb,
            isPaused: false,
          }),
        );

        seq.resume();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa,
            progressOverall: framesAaa / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "aaa",
            currentPhase: "bbb",
            t: 0,
            progress: 0,
            framesLeft: framesBbb,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: true,
          }),
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: true,
          }),
        );

        seq.resume();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 2,
            progressOverall:
              (framesAaa + 2) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc - 2,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 2,
            progress: 2 / framesBbb,
            framesLeft: framesBbb - 2,
            isPaused: false,
          }),
        );

        seq.pause();
        seq.pause();
        seq.pause();
        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 2,
            progressOverall:
              (framesAaa + 2) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc - 2,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 2,
            progress: 2 / framesBbb,
            framesLeft: framesBbb - 2,
            isPaused: true,
          }),
        );

        seq.resume();
        seq.resume();
        seq.resume();
        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 3,
            progressOverall:
              (framesAaa + 3) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb + framesCcc - 3,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 3,
            progress: 3 / framesBbb,
            framesLeft: framesBbb - 3,
            isPaused: false,
          }),
        );

        range(-3 + framesBbb - 1).forEach(() => {
          incrementFrameNumber();
        });

        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb - 1,
            progressOverall:
              (framesAaa + framesBbb - 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: 1 + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: framesBbb - 1,
            progress: (framesBbb - 1) / framesBbb,
            framesLeft: 1,
            isPaused: true,
          }),
        );

        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb,
            progressOverall:
              (framesAaa + framesBbb) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "bbb",
            currentPhase: "ccc",
            t: 0,
            progress: 0,
            framesLeft: framesCcc,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'already paused (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;

        const seq = $timerSeq(
          {
            intro: [
              ["aaa", framesAaa],
              ["bbb", framesBbb],
              ["ccc", framesCcc],
            ],
          },
          { paused: true },
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: true,
          }),
        );

        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa + framesBbb + framesCcc - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa + framesBbb + framesCcc - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: true,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'restart (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;

        const seq = $timerSeq({
          intro: [
            ["aaa", framesAaa],
            ["bbb", framesBbb],
            ["ccc", framesCcc],
          ],
        });

        range(framesAaa + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb - 1 + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        range(framesAaa + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb - 1 + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;

        const seq = $timerSeq(
          {
            intro: [
              ["aaa", framesAaa],
              ["bbb", framesBbb],
              ["ccc", framesCcc],
            ],
          },
          { delayFrames: 333 },
        );

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        range(333).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa - 1 + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa - 1 + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: true,
          }),
        );

        seq.resume();

        range(-1 + framesAaa + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesBbb - 1 + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa - 1 + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed and already paused (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;

        const seq = $timerSeq(
          {
            intro: [
              ["aaa", framesAaa],
              ["bbb", framesBbb],
              ["ccc", framesCcc],
            ],
          },
          { delayFrames: 333, paused: true },
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: true,
          }),
        );

        seq.resume();

        range(333).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa - 1 + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );

        range(framesAaa - 1 + framesBbb + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + 1,
            progressOverall:
              (framesAaa + framesBbb + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesCcc - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ccc",
            t: 1,
            progress: 1 / framesCcc,
            framesLeft: framesCcc - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa - 1 + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed timer vs early restart (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;

        const seq = $timerSeq(
          {
            intro: [
              ["aaa", framesAaa],
              ["bbb", framesBbb],
              ["ccc", framesCcc],
            ],
          },
          { delayFrames: 333 },
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesAaa + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa - 1 + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );

        range(framesAaa - 1 + framesBbb + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + 1,
            progressOverall:
              (framesAaa + framesBbb + 1) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesCcc - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ccc",
            t: 1,
            progress: 1 / framesCcc,
            framesLeft: framesCcc - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesAaa - 1 + framesBbb + framesCcc,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );
      },
    );
  });

  describe("loop only", () => {
    test.each(allPropertiesToTest)(
      'iterates over phases (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        const framesDdd = 100;
        const framesEee = 20;
        const framesFff = 40;

        const seq = $timerSeq({
          loop: [
            ["ddd", framesDdd],
            ["eee", framesEee],
            ["fff", framesFff],
          ],
        });

        //
        // 1st loop iteration
        //

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        range(framesDdd - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: t,
              progressOverall: t / (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesDdd + framesEee + framesFff - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "ddd",
              t: t,
              progress: t / framesDdd,
              framesLeft: framesDdd - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd,
            progressOverall: framesDdd / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ddd",
            currentPhase: "eee",
            t: 0,
            progress: 0,
            framesLeft: framesEee,
            isPaused: false,
          }),
        );

        range(framesEee - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesDdd + t,
              progressOverall:
                (framesDdd + t) / (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesEee + framesFff - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "eee",
              t: t,
              progress: t / framesEee,
              framesLeft: framesEee - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + framesEee,
            progressOverall:
              (framesDdd + framesEee) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "eee",
            currentPhase: "fff",
            t: 0,
            progress: 0,
            framesLeft: framesFff,
            isPaused: false,
          }),
        );

        range(framesFff - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesDdd + framesEee + t,
              progressOverall:
                (framesDdd + framesEee + t) /
                (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesFff - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "fff",
              t: t,
              progress: t / framesFff,
              framesLeft: framesFff - t,
              isPaused: false,
            }),
          );
        });

        //
        // 2nd loop iteration, same as the 1st except for the "hasFinishedOverall=true"
        //
        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "fff",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        range(framesDdd - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: t,
              progressOverall: t / (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesDdd + framesEee + framesFff - t,
              hasFinishedOverall: true,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "ddd",
              t: t,
              progress: t / framesDdd,
              framesLeft: framesDdd - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd,
            progressOverall: framesDdd / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ddd",
            currentPhase: "eee",
            t: 0,
            progress: 0,
            framesLeft: framesEee,
            isPaused: false,
          }),
        );

        range(framesEee - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesDdd + t,
              progressOverall:
                (framesDdd + t) / (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesEee + framesFff - t,
              hasFinishedOverall: true,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "eee",
              t: t,
              progress: t / framesEee,
              framesLeft: framesEee - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + framesEee,
            progressOverall:
              (framesDdd + framesEee) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: "eee",
            currentPhase: "fff",
            t: 0,
            progress: 0,
            framesLeft: framesFff,
            isPaused: false,
          }),
        );

        range(framesFff - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesDdd + framesEee + t,
              progressOverall:
                (framesDdd + framesEee + t) /
                (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesFff - t,
              hasFinishedOverall: true,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "fff",
              t: t,
              progress: t / framesFff,
              framesLeft: framesFff - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "fff",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'pause/resume (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq({
          loop: [
            ["ddd", framesDdd],
            ["eee", framesEee],
            ["fff", framesFff],
          ],
        });

        range(framesDdd).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd,
            progressOverall: framesDdd / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ddd",
            currentPhase: "eee",
            t: 0,
            progress: 0,
            framesLeft: framesEee,
            isPaused: false,
          }),
        );

        seq.resume();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd,
            progressOverall: framesDdd / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ddd",
            currentPhase: "eee",
            t: 0,
            progress: 0,
            framesLeft: framesEee,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 1,
            progressOverall:
              (framesDdd + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 1,
            progressOverall:
              (framesDdd + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: true,
          }),
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 1,
            progressOverall:
              (framesDdd + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: true,
          }),
        );

        seq.resume();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 1,
            progressOverall:
              (framesDdd + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 2,
            progressOverall:
              (framesDdd + 2) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff - 2,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 2,
            progress: 2 / framesEee,
            framesLeft: framesEee - 2,
            isPaused: false,
          }),
        );

        seq.pause();
        seq.pause();
        seq.pause();
        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 2,
            progressOverall:
              (framesDdd + 2) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff - 2,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 2,
            progress: 2 / framesEee,
            framesLeft: framesEee - 2,
            isPaused: true,
          }),
        );

        seq.resume();
        seq.resume();
        seq.resume();
        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 3,
            progressOverall:
              (framesDdd + 3) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff - 3,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 3,
            progress: 3 / framesEee,
            framesLeft: framesEee - 3,
            isPaused: false,
          }),
        );

        range(-3 + framesEee + framesFff + framesDdd - 1).forEach(() => {
          incrementFrameNumber();
        });

        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd - 1,
            progressOverall:
              (framesDdd - 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: 1 + framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: framesDdd - 1,
            progress: (framesDdd - 1) / framesDdd,
            framesLeft: 1,
            isPaused: true,
          }),
        );

        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd,
            progressOverall: framesDdd / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ddd",
            currentPhase: "eee",
            t: 0,
            progress: 0,
            framesLeft: framesEee,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'already paused (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq(
          {
            loop: [
              ["ddd", framesDdd],
              ["eee", framesEee],
              ["fff", framesFff],
            ],
          },
          { paused: true },
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: true,
          }),
        );

        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd + framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd + framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: true,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'restart (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq({
          loop: [
            ["ddd", framesDdd],
            ["eee", framesEee],
            ["fff", framesFff],
          ],
        });

        range(framesDdd + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 1,
            progressOverall:
              (framesDdd + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee - 1 + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        range(framesDdd + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 1,
            progressOverall:
              (framesDdd + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee - 1 + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        range(framesDdd + framesEee + framesFff).forEach(i => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "fff",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd - 1 + framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq(
          {
            loop: [
              ["ddd", framesDdd],
              ["eee", framesEee],
              ["fff", framesFff],
            ],
          },
          { delayFrames: 333 },
        );

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        range(333).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd - 1 + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd - 1 + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: true,
          }),
        );

        seq.resume();

        range(-1 + framesDdd + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 1,
            progressOverall:
              (framesDdd + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee - 1 + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd - 1 + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed and already paused (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq(
          {
            loop: [
              ["ddd", framesDdd],
              ["eee", framesEee],
              ["fff", framesFff],
            ],
          },
          { delayFrames: 333, paused: true },
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: true,
          }),
        );

        seq.resume();

        range(333).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd - 1 + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: false,
          }),
        );

        range(
          -1 + framesDdd + framesEee + framesFff + framesDdd + framesEee + 1,
        ).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + framesEee + 1,
            progressOverall:
              (framesDdd + framesEee + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff - 1,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "fff",
            t: 1,
            progress: 1 / framesFff,
            framesLeft: framesFff - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd - 1 + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed timer vs early restart (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq(
          {
            loop: [
              ["ddd", framesDdd],
              ["eee", framesEee],
              ["fff", framesFff],
            ],
          },
          { delayFrames: 333 },
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd - 1 + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: false,
          }),
        );

        range(
          framesDdd - 1 + framesEee + framesFff + framesDdd + framesEee + 1,
        ).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + framesEee + 1,
            progressOverall:
              (framesDdd + framesEee + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff - 1,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "fff",
            t: 1,
            progress: 1 / framesFff,
            framesLeft: framesFff - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1 / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesDdd - 1 + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 1 / framesDdd,
            framesLeft: framesDdd - 1,
            isPaused: false,
          }),
        );
      },
    );
  });

  describe("intro + loop", () => {
    test.each(allPropertiesToTest)(
      'iterates over phases (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        //   - moreover, the sum of frames in the intro is different than the sum in the loop
        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;
        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq({
          intro: [
            ["aaa", framesAaa],
            ["bbb", framesBbb],
            ["ccc", framesCcc],
          ],
          loop: [
            ["ddd", framesDdd],
            ["eee", framesEee],
            ["fff", framesFff],
          ],
        });

        //
        // intro
        //

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        range(framesAaa - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: t,
              progressOverall:
                t /
                (framesAaa +
                  framesBbb +
                  framesCcc +
                  framesDdd +
                  framesEee +
                  framesFff),
              framesLeftOverall:
                framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff -
                t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "aaa",
              t: t,
              progress: t / framesAaa,
              framesLeft: framesAaa - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa,
            progressOverall:
              framesAaa /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "aaa",
            currentPhase: "bbb",
            t: 0,
            progress: 0,
            framesLeft: framesBbb,
            isPaused: false,
          }),
        );

        range(framesBbb - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesAaa + t,
              progressOverall:
                (framesAaa + t) /
                (framesAaa +
                  framesBbb +
                  framesCcc +
                  framesDdd +
                  framesEee +
                  framesFff),
              framesLeftOverall:
                framesBbb + framesCcc + framesDdd + framesEee + framesFff - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "bbb",
              t: t,
              progress: t / framesBbb,
              framesLeft: framesBbb - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb,
            progressOverall:
              (framesAaa + framesBbb) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall: framesCcc + framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "bbb",
            currentPhase: "ccc",
            t: 0,
            progress: 0,
            framesLeft: framesCcc,
            isPaused: false,
          }),
        );

        range(framesCcc - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesAaa + framesBbb + t,
              progressOverall:
                (framesAaa + framesBbb + t) /
                (framesAaa +
                  framesBbb +
                  framesCcc +
                  framesDdd +
                  framesEee +
                  framesFff),
              framesLeftOverall:
                framesCcc + framesDdd + framesEee + framesFff - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "ccc",
              t: t,
              progress: t / framesCcc,
              framesLeft: framesCcc - t,
              isPaused: false,
            }),
          );
        });

        //
        // 1st loop iteration, the one in which the intro is counted towards the overall progress
        //
        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + framesCcc,
            progressOverall:
              (framesAaa + framesBbb + framesCcc) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ccc",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        range(framesDdd - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesAaa + framesBbb + framesCcc + t,
              progressOverall:
                (framesAaa + framesBbb + framesCcc + t) /
                (framesAaa +
                  framesBbb +
                  framesCcc +
                  framesDdd +
                  framesEee +
                  framesFff),
              framesLeftOverall: framesDdd + framesEee + framesFff - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "ddd",
              t: t,
              progress: t / framesDdd,
              framesLeft: framesDdd - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + framesCcc + framesDdd,
            progressOverall:
              (framesAaa + framesBbb + framesCcc + framesDdd) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall: framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ddd",
            currentPhase: "eee",
            t: 0,
            progress: 0,
            framesLeft: framesEee,
            isPaused: false,
          }),
        );

        range(framesEee - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesAaa + framesBbb + framesCcc + framesDdd + t,
              progressOverall:
                (framesAaa + framesBbb + framesCcc + framesDdd + t) /
                (framesAaa +
                  framesBbb +
                  framesCcc +
                  framesDdd +
                  framesEee +
                  framesFff),
              framesLeftOverall: framesEee + framesFff - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "eee",
              t: t,
              progress: t / framesEee,
              framesLeft: framesEee - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + framesCcc + framesDdd + framesEee,
            progressOverall:
              (framesAaa + framesBbb + framesCcc + framesDdd + framesEee) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall: framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "eee",
            currentPhase: "fff",
            t: 0,
            progress: 0,
            framesLeft: framesFff,
            isPaused: false,
          }),
        );

        range(framesFff - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall:
                framesAaa + framesBbb + framesCcc + framesDdd + framesEee + t,
              progressOverall:
                (framesAaa +
                  framesBbb +
                  framesCcc +
                  framesDdd +
                  framesEee +
                  t) /
                (framesAaa +
                  framesBbb +
                  framesCcc +
                  framesDdd +
                  framesEee +
                  framesFff),
              framesLeftOverall: framesFff - t,
              hasFinishedOverall: false,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "fff",
              t: t,
              progress: t / framesFff,
              framesLeft: framesFff - t,
              isPaused: false,
            }),
          );
        });

        //
        // 2nd loop iteration, where the intro is no longer counted towards the overall progress
        //

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "fff",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );

        range(framesDdd - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: t,
              progressOverall: t / (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesDdd + framesEee + framesFff - t,
              hasFinishedOverall: true,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "ddd",
              t: t,
              progress: t / framesDdd,
              framesLeft: framesDdd - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd,
            progressOverall: framesDdd / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ddd",
            currentPhase: "eee",
            t: 0,
            progress: 0,
            framesLeft: framesEee,
            isPaused: false,
          }),
        );

        range(framesEee - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesDdd + t,
              progressOverall:
                (framesDdd + t) / (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesEee + framesFff - t,
              hasFinishedOverall: true,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "eee",
              t: t,
              progress: t / framesEee,
              framesLeft: framesEee - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + framesEee,
            progressOverall:
              (framesDdd + framesEee) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: "eee",
            currentPhase: "fff",
            t: 0,
            progress: 0,
            framesLeft: framesFff,
            isPaused: false,
          }),
        );

        range(framesFff - 1).forEach(i => {
          const t = i + 1;

          incrementFrameNumber();

          expect(ppt(seq)).toEqual(
            ppev({
              tOverall: framesDdd + framesEee + t,
              progressOverall:
                (framesDdd + framesEee + t) /
                (framesDdd + framesEee + framesFff),
              framesLeftOverall: framesFff - t,
              hasFinishedOverall: true,
              hasJustFinishedOverall: false,
              justFinishedPhase: null,
              currentPhase: "fff",
              t: t,
              progress: t / framesFff,
              framesLeft: framesFff - t,
              isPaused: false,
            }),
          );
        });

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: framesDdd + framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "fff",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: framesDdd,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'pause/resume (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        //   - moreover, the sum of frames in the intro is different than the sum in the loop
        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;
        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq({
          intro: [
            ["aaa", framesAaa],
            ["bbb", framesBbb],
            ["ccc", framesCcc],
          ],
          loop: [
            ["ddd", framesDdd],
            ["eee", framesEee],
            ["fff", framesFff],
          ],
        });

        range(framesAaa).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa,
            progressOverall:
              framesAaa /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "aaa",
            currentPhase: "bbb",
            t: 0,
            progress: 0,
            framesLeft: framesBbb,
            isPaused: false,
          }),
        );

        seq.resume();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa,
            progressOverall:
              framesAaa /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "aaa",
            currentPhase: "bbb",
            t: 0,
            progress: 0,
            framesLeft: framesBbb,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: true,
          }),
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: true,
          }),
        );

        seq.resume();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff - 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 2,
            progressOverall:
              (framesAaa + 2) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff - 2,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 2,
            progress: 2 / framesBbb,
            framesLeft: framesBbb - 2,
            isPaused: false,
          }),
        );

        seq.pause();
        seq.pause();
        seq.pause();
        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 2,
            progressOverall:
              (framesAaa + 2) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff - 2,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 2,
            progress: 2 / framesBbb,
            framesLeft: framesBbb - 2,
            isPaused: true,
          }),
        );

        seq.resume();
        seq.resume();
        seq.resume();
        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 3,
            progressOverall:
              (framesAaa + 3) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb + framesCcc + framesDdd + framesEee + framesFff - 3,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 3,
            progress: 3 / framesBbb,
            framesLeft: framesBbb - 3,
            isPaused: false,
          }),
        );

        range(framesBbb - 3 + framesCcc + framesDdd + framesEee - 1).forEach(
          () => {
            incrementFrameNumber();
          },
        );

        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall:
              framesAaa + framesBbb + framesCcc + framesDdd + framesEee - 1,
            progressOverall:
              (framesAaa + framesBbb + framesCcc + framesDdd + framesEee - 1) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall: 1 + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: framesEee - 1,
            progress: (framesEee - 1) / framesEee,
            framesLeft: 1,
            isPaused: true,
          }),
        );

        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + framesCcc + framesDdd + framesEee,
            progressOverall:
              (framesAaa + framesBbb + framesCcc + framesDdd + framesEee) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall: framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "eee",
            currentPhase: "fff",
            t: 0,
            progress: 0,
            framesLeft: framesFff,
            isPaused: false,
          }),
        );

        range(framesFff + framesDdd - 1).forEach(() => {
          incrementFrameNumber();
        });

        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd - 1,
            progressOverall:
              (framesDdd - 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: 1 + framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: framesDdd - 1,
            progress: (framesDdd - 1) / framesDdd,
            framesLeft: 1,
            isPaused: true,
          }),
        );

        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd,
            progressOverall: framesDdd / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: "ddd",
            currentPhase: "eee",
            t: 0,
            progress: 0,
            framesLeft: framesEee,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'already paused (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        //   - moreover, the sum of frames in the intro is different than the sum in the loop
        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;
        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq(
          {
            intro: [
              ["aaa", framesAaa],
              ["bbb", framesBbb],
              ["ccc", framesCcc],
            ],
            loop: [
              ["ddd", framesDdd],
              ["eee", framesEee],
              ["fff", framesFff],
            ],
          },
          { paused: true },
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: true,
          }),
        );

        seq.resume();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff -
              1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff -
              1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: true,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'restart (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        //   - moreover, the sum of frames in the intro is different than the sum in the loop
        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;
        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq({
          intro: [
            ["aaa", framesAaa],
            ["bbb", framesBbb],
            ["ccc", framesCcc],
          ],
          loop: [
            ["ddd", framesDdd],
            ["eee", framesEee],
            ["fff", framesFff],
          ],
        });

        range(framesAaa + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + 1,
            progressOverall:
              (framesAaa + 1) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesBbb - 1 + framesCcc + framesDdd + framesEee + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "bbb",
            t: 1,
            progress: 1 / framesBbb,
            framesLeft: framesBbb - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        range(framesAaa + framesBbb + framesCcc + framesDdd + 1).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + framesCcc + framesDdd + 1,
            progressOverall:
              (framesAaa + framesBbb + framesCcc + framesDdd + 1) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall: framesEee - 1 + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        range(
          framesAaa +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff +
            framesDdd +
            1,
        ).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + 1,
            progressOverall:
              (framesDdd + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesEee - 1 + framesFff,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        //   - moreover, the sum of frames in the intro is different than the sum in the loop
        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;
        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq(
          {
            intro: [
              ["aaa", framesAaa],
              ["bbb", framesBbb],
              ["ccc", framesCcc],
            ],
            loop: [
              ["ddd", framesDdd],
              ["eee", framesEee],
              ["fff", framesFff],
            ],
          },
          { delayFrames: 333 },
        );

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        range(333).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa -
              1 +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );

        seq.pause();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa -
              1 +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: true,
          }),
        );

        seq.resume();

        range(framesAaa - 1 + framesBbb + framesCcc + framesDdd + 1).forEach(
          () => {
            incrementFrameNumber();
          },
        );

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesAaa + framesBbb + framesCcc + framesDdd + 1,
            progressOverall:
              (framesAaa + framesBbb + framesCcc + framesDdd + 1) /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall: framesEee - 1 + framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "eee",
            t: 1,
            progress: 1 / framesEee,
            framesLeft: framesEee - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa -
              1 +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed and already paused (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        //   - moreover, the sum of frames in the intro is different than the sum in the loop
        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;
        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq(
          {
            intro: [
              ["aaa", framesAaa],
              ["bbb", framesBbb],
              ["ccc", framesCcc],
            ],
            loop: [
              ["ddd", framesDdd],
              ["eee", framesEee],
              ["fff", framesFff],
            ],
          },
          { delayFrames: 333, paused: true },
        );

        range(9876).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: true,
          }),
        );

        seq.resume();

        range(333).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa -
              1 +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );

        range(
          framesAaa -
            1 +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff +
            framesDdd +
            framesEee +
            1,
        ).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + framesEee + 1,
            progressOverall:
              (framesDdd + framesEee + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff - 1,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "fff",
            t: 1,
            progress: 1 / framesFff,
            framesLeft: framesFff - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa -
              1 +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'delayed timer vs early restart (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        // Frames below are chosen in a way which:
        //   - makes it possible to easily compare float progress values without a need to close-to-compare
        //   - and above applies both to individual phases as to the sum of all frames as well
        //   - moreover, the sum of frames in the intro is different than the sum in the loop
        const framesAaa = 10;
        const framesBbb = 50;
        const framesCcc = 20;
        const framesDdd = 200;
        const framesEee = 40;
        const framesFff = 80;

        const seq = $timerSeq(
          {
            intro: [
              ["aaa", framesAaa],
              ["bbb", framesBbb],
              ["ccc", framesCcc],
            ],
            loop: [
              ["ddd", framesDdd],
              ["eee", framesEee],
              ["fff", framesFff],
            ],
          },
          { delayFrames: 333 },
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        seq.restart();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall:
              framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: framesAaa,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa -
              1 +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );

        range(
          -1 +
            framesAaa +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff +
            framesDdd +
            framesEee +
            1,
        ).forEach(() => {
          incrementFrameNumber();
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: framesDdd + framesEee + 1,
            progressOverall:
              (framesDdd + framesEee + 1) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff - 1,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "fff",
            t: 1,
            progress: 1 / framesFff,
            framesLeft: framesFff - 1,
            isPaused: false,
          }),
        );

        seq.restart();

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall:
              1 /
              (framesAaa +
                framesBbb +
                framesCcc +
                framesDdd +
                framesEee +
                framesFff),
            framesLeftOverall:
              framesAaa -
              1 +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1 / framesAaa,
            framesLeft: framesAaa - 1,
            isPaused: false,
          }),
        );
      },
    );
  });

  describe("edge cases", () => {
    test.each(allPropertiesToTest)(
      'empty (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const seq = $timerSeq({});

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: null,
            currentPhase: null,
            t: 0,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: null,
            t: 0,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'intro of 0 frames (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const seq = $timerSeq({
          intro: [["aaa", 0]],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "aaa",
            currentPhase: "aaa",
            t: 0,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'loop of 0 frames (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const seq = $timerSeq({
          loop: [["ddd", 0]],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'intro & loop of 0 frames (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const seq = $timerSeq({
          intro: [["aaa", 0]],
          loop: [["ddd", 0]],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'intro & loop created from negative amounts of frames (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);

        const seqZero = $timerSeq({
          intro: [
            ["aaa", 0],
            ["bbb", 0],
            ["ccc", 0],
          ],
          loop: [
            ["ddd", 0],
            ["eee", 0],
            ["fff", 0],
          ],
        });
        const seqNegative = $timerSeq({
          intro: [
            ["aaa", -1],
            ["bbb", -2],
            ["ccc", -3],
          ],
          loop: [
            ["ddd", -4],
            ["eee", -5],
            ["fff", -6],
          ],
        });

        range(99).forEach(() => {
          expect(ppt(seqZero)).toEqual(ppt(seqNegative));

          incrementFrameNumber();
        });
      },
    );

    test.each(allPropertiesToTest)(
      'intro of 1 frame (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const seq = $timerSeq({
          intro: [["aaa", 1]],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "aaa",
            currentPhase: "aaa",
            t: 1,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 1,
            framesLeftOverall: 0,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 1,
            progress: 1,
            framesLeft: 0,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'loop of 1 frame (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const seq = $timerSeq({
          loop: [["ddd", 1]],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 1,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 1,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'intro & loop of 1 frame (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const seq = $timerSeq({
          intro: [["aaa", 1]],
          loop: [["ddd", 1]],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 2,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 0.5,
            framesLeftOverall: 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "aaa",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 1,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 1,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 1,
            isPaused: false,
          }),
        );
      },
    );

    test.each(allPropertiesToTest)(
      'when the time moves strangely (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        nextFrameNumberWillBe(500);
        const seq = $timerSeq({
          intro: [["aaa", 2]],
          loop: [["ddd", 8]],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 10,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: 2,
            isPaused: false,
          }),
        );

        nextFrameNumberWillBe(511);

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 0.125,
            framesLeftOverall: 7,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 0.125,
            framesLeft: 7,
            isPaused: false,
          }),
        );

        nextFrameNumberWillBe(510);

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 8,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 8,
            isPaused: false,
          }),
        );

        nextFrameNumberWillBe(509);

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 9,
            progressOverall: 0.9,
            framesLeftOverall: 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 7,
            progress: 0.875,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        nextFrameNumberWillBe(499);

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 10,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: 2,
            isPaused: false,
          }),
        );
      },
    );
  });

  describe("rounding", () => {
    test.each(allPropertiesToTest)(
      'frames of each phase are rounded (tested property: "%s")',
      testedProperty => {
        const ppt = pickPropertyOfTimer(testedProperty);
        const ppev = pickPropertyOfExpectedValues(testedProperty);

        const seq = $timerSeq({
          intro: [["aaa", 5.4]],
          loop: [["ddd", 4.6]],
        });

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 10,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 0,
            progress: 0,
            framesLeft: 5,
            isPaused: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 4,
            progressOverall: 0.4,
            framesLeftOverall: 6,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "aaa",
            t: 4,
            progress: 0.8,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 5,
            progressOverall: 0.5,
            framesLeftOverall: 5,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: "aaa",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 5,
            isPaused: false,
          }),
        );

        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();
        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 9,
            progressOverall: 0.9,
            framesLeftOverall: 1,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 4,
            progress: 0.8,
            framesLeft: 1,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 0,
            progressOverall: 0,
            framesLeftOverall: 5,
            hasFinishedOverall: true,
            hasJustFinishedOverall: true,
            justFinishedPhase: "ddd",
            currentPhase: "ddd",
            t: 0,
            progress: 0,
            framesLeft: 5,
            isPaused: false,
          }),
        );

        incrementFrameNumber();

        expect(ppt(seq)).toEqual(
          ppev({
            tOverall: 1,
            progressOverall: 0.2,
            framesLeftOverall: 4,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ddd",
            t: 1,
            progress: 0.2,
            framesLeft: 4,
            isPaused: false,
          }),
        );
      },
    );
  });
});
