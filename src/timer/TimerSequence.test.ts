import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "../BeetPx";
import { u_ } from "../Utils";
import { BpxTimerSequence, timerSeq_ } from "./TimerSequence";

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}

function nextFrameNumberWillBe(frameNumber: number): void {
  stubbedFrameNumber = frameNumber;
}

// The reasoning behind such test setup:
//   - keep expected values together in tests, since they are highly co-related
//   - assert them separately over the whole test scenario, since it makes debugging
//     easier and allows to focus on implementation of a single property
describe.each([
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
])(`TimerSequence (tested property: %s)`, (testedProperty) => {
  // pft = pick a field from a timer
  function pft<TPhaseName extends string>(
    timer: BpxTimerSequence<TPhaseName>,
  ): any {
    return {
      // @ts-ignore
      [testedProperty]: timer[testedProperty],
    };
  }

  // pfe = pick a field from expected values
  function pfe<TPhaseName extends string>(expectedValues: {
    tOverall: number;
    progressOverall: number;
    framesLeftOverall: number;
    hasFinishedOverall: boolean;
    hasJustFinishedOverall: boolean;
    justFinishedPhase: TPhaseName | null;
    currentPhase: TPhaseName;
    t: number;
    progress: number;
    framesLeft: number;
  }): any {
    return {
      // @ts-ignore
      [testedProperty]: expectedValues[testedProperty],
    };
  }

  beforeEach(() => {
    jest
      .spyOn(BeetPx, "frameNumber", "get")
      .mockImplementation(() => stubbedFrameNumber);
    nextFrameNumberWillBe(501);
  });

  describe("intro only", () => {
    test("iterates over phases", () => {
      // Frames below are chosen in a way which:
      //   - makes it possible to easily compare float progress values without a need to close-to-compare
      //   - and above applies both to individual phases as to the sum of all frames as well
      const framesAaa = 100;
      const framesBbb = 20;
      const framesCcc = 40;

      const seq = timerSeq_({
        intro: [
          ["aaa", framesAaa],
          ["bbb", framesBbb],
          ["ccc", framesCcc],
        ],
      });

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesAaa - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesBbb - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesCcc - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
            tOverall: framesAaa + framesBbb + t,
            progressOverall:
              (framesAaa + framesBbb + t) / (framesAaa + framesBbb + framesCcc),
            framesLeftOverall: framesCcc - t,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "ccc",
            t: t,
            progress: t / framesCcc,
            framesLeft: framesCcc - t,
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );
    });
  });

  describe("loop only", () => {
    test("iterates over phases", () => {
      // Frames below are chosen in a way which:
      //   - makes it possible to easily compare float progress values without a need to close-to-compare
      //   - and above applies both to individual phases as to the sum of all frames as well
      const framesDdd = 100;
      const framesEee = 20;
      const framesFff = 40;

      const seq = timerSeq_({
        loop: [
          ["ddd", framesDdd],
          ["eee", framesEee],
          ["fff", framesFff],
        ],
      });

      //
      // 1st loop iteration
      //

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesDdd - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesEee - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesFff - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
            tOverall: framesDdd + framesEee + t,
            progressOverall:
              (framesDdd + framesEee + t) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff - t,
            hasFinishedOverall: false,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "fff",
            t: t,
            progress: t / framesFff,
            framesLeft: framesFff - t,
          }),
        );
      });

      //
      // 2nd loop iteration, same as the 1st except for the "hasFinishedOverall=true"
      //
      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesDdd - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesEee - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesFff - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
            tOverall: framesDdd + framesEee + t,
            progressOverall:
              (framesDdd + framesEee + t) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff - t,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "fff",
            t: t,
            progress: t / framesFff,
            framesLeft: framesFff - t,
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );
    });
  });

  describe("intro + loop", () => {
    test("iterates over phases", () => {
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

      const seq = timerSeq_({
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

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesAaa - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesBbb - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesCcc - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      //
      // 1st loop iteration, the one in which the intro is counted towards the overall progress
      //
      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesDdd - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesEee - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesFff - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
            tOverall:
              framesAaa + framesBbb + framesCcc + framesDdd + framesEee + t,
            progressOverall:
              (framesAaa + framesBbb + framesCcc + framesDdd + framesEee + t) /
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
          }),
        );
      });

      //
      // 2nd loop iteration, where the intro is no longer counted towards the overall progress
      //
      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesDdd - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesEee - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
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
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );

      u_.range(framesFff - 1).forEach((i) => {
        const t = i + 1;

        incrementFrameNumber();

        expect(pft(seq)).toEqual(
          pfe({
            tOverall: framesDdd + framesEee + t,
            progressOverall:
              (framesDdd + framesEee + t) / (framesDdd + framesEee + framesFff),
            framesLeftOverall: framesFff - t,
            hasFinishedOverall: true,
            hasJustFinishedOverall: false,
            justFinishedPhase: null,
            currentPhase: "fff",
            t: t,
            progress: t / framesFff,
            framesLeft: framesFff - t,
          }),
        );
      });

      incrementFrameNumber();

      expect(pft(seq)).toEqual(
        pfe({
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
        }),
      );
    });
  });
});
