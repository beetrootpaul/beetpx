import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "../BeetPx";
import { u_ } from "../Utils";
import { timerSeq_ } from "./TimerSequence";

describe("TimerSequence", () => {
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

      expect(seq.tOverall).toBe(0);
      expect(seq.progressOverall).toBe(0);
      expect(seq.framesLeftOverall).toBe(framesAaa + framesBbb + framesCcc);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe(null);

      expect(seq.currentPhase).toBe("aaa");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesAaa);

      u_.range(framesAaa - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(t);
        expect(seq.progressOverall).toBe(
          t / (framesAaa + framesBbb + framesCcc),
        );
        expect(seq.framesLeftOverall).toBe(
          framesAaa + framesBbb + framesCcc - t,
        );
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("aaa");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesAaa);
        expect(seq.framesLeft).toBe(framesAaa - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesAaa);
      expect(seq.progressOverall).toBe(
        framesAaa / (framesAaa + framesBbb + framesCcc),
      );
      expect(seq.framesLeftOverall).toBe(framesBbb + framesCcc);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("aaa");

      expect(seq.currentPhase).toBe("bbb");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesBbb);

      u_.range(framesBbb - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesAaa + t);
        expect(seq.progressOverall).toBe(
          (framesAaa + t) / (framesAaa + framesBbb + framesCcc),
        );
        expect(seq.framesLeftOverall).toBe(framesBbb + framesCcc - t);
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("bbb");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesBbb);
        expect(seq.framesLeft).toBe(framesBbb - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesAaa + framesBbb);
      expect(seq.progressOverall).toBe(
        (framesAaa + framesBbb) / (framesAaa + framesBbb + framesCcc),
      );
      expect(seq.framesLeftOverall).toBe(framesCcc);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("bbb");

      expect(seq.currentPhase).toBe("ccc");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesCcc);

      u_.range(framesCcc - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesAaa + framesBbb + t);
        expect(seq.progressOverall).toBe(
          (framesAaa + framesBbb + t) / (framesAaa + framesBbb + framesCcc),
        );
        expect(seq.framesLeftOverall).toBe(framesCcc - t);
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("ccc");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesCcc);
        expect(seq.framesLeft).toBe(framesCcc - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesAaa + framesBbb + framesCcc);
      expect(seq.progressOverall).toBe(1);
      expect(seq.framesLeftOverall).toBe(0);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(true);

      expect(seq.justFinishedPhase).toBe("ccc");

      expect(seq.currentPhase).toBe("ccc");
      expect(seq.t).toBe(framesCcc);
      expect(seq.progress).toBe(1);
      expect(seq.framesLeft).toBe(0);

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesAaa + framesBbb + framesCcc);
      expect(seq.progressOverall).toBe(1);
      expect(seq.framesLeftOverall).toBe(0);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe(null);

      expect(seq.currentPhase).toBe("ccc");
      expect(seq.t).toBe(framesCcc);
      expect(seq.progress).toBe(1);
      expect(seq.framesLeft).toBe(0);
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

      expect(seq.tOverall).toBe(0);
      expect(seq.progressOverall).toBe(0);
      expect(seq.framesLeftOverall).toBe(framesDdd + framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe(null);

      expect(seq.currentPhase).toBe("ddd");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesDdd);

      u_.range(framesDdd - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(t);
        expect(seq.progressOverall).toBe(
          t / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(
          framesDdd + framesEee + framesFff - t,
        );
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("ddd");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesDdd);
        expect(seq.framesLeft).toBe(framesDdd - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesDdd);
      expect(seq.progressOverall).toBe(
        framesDdd / (framesDdd + framesEee + framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("ddd");

      expect(seq.currentPhase).toBe("eee");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesEee);

      u_.range(framesEee - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesDdd + t);
        expect(seq.progressOverall).toBe(
          (framesDdd + t) / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(framesEee + framesFff - t);
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("eee");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesEee);
        expect(seq.framesLeft).toBe(framesEee - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesDdd + framesEee);
      expect(seq.progressOverall).toBe(
        (framesDdd + framesEee) / (framesDdd + framesEee + framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesFff);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("eee");

      expect(seq.currentPhase).toBe("fff");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesFff);

      u_.range(framesFff - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesDdd + framesEee + t);
        expect(seq.progressOverall).toBe(
          (framesDdd + framesEee + t) / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(framesFff - t);
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("fff");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesFff);
        expect(seq.framesLeft).toBe(framesFff - t);
      });

      //
      // 2nd loop iteration, same as the 1st except for the "hasFinishedOverall=true"
      //
      incrementFrameNumber();

      expect(seq.tOverall).toBe(0);
      expect(seq.progressOverall).toBe(0);
      expect(seq.framesLeftOverall).toBe(framesDdd + framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(true);

      expect(seq.justFinishedPhase).toBe("fff");

      expect(seq.currentPhase).toBe("ddd");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesDdd);

      u_.range(framesDdd - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(t);
        expect(seq.progressOverall).toBe(
          t / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(
          framesDdd + framesEee + framesFff - t,
        );
        expect(seq.hasFinishedOverall).toBe(true);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("ddd");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesDdd);
        expect(seq.framesLeft).toBe(framesDdd - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesDdd);
      expect(seq.progressOverall).toBe(
        framesDdd / (framesDdd + framesEee + framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("ddd");

      expect(seq.currentPhase).toBe("eee");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesEee);

      u_.range(framesEee - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesDdd + t);
        expect(seq.progressOverall).toBe(
          (framesDdd + t) / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(framesEee + framesFff - t);
        expect(seq.hasFinishedOverall).toBe(true);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("eee");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesEee);
        expect(seq.framesLeft).toBe(framesEee - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesDdd + framesEee);
      expect(seq.progressOverall).toBe(
        (framesDdd + framesEee) / (framesDdd + framesEee + framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesFff);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("eee");

      expect(seq.currentPhase).toBe("fff");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesFff);

      u_.range(framesFff - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesDdd + framesEee + t);
        expect(seq.progressOverall).toBe(
          (framesDdd + framesEee + t) / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(framesFff - t);
        expect(seq.hasFinishedOverall).toBe(true);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("fff");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesFff);
        expect(seq.framesLeft).toBe(framesFff - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(0);
      expect(seq.progressOverall).toBe(0);
      expect(seq.framesLeftOverall).toBe(framesDdd + framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(true);

      expect(seq.justFinishedPhase).toBe("fff");

      expect(seq.currentPhase).toBe("ddd");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesDdd);
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

      expect(seq.tOverall).toBe(0);
      expect(seq.progressOverall).toBe(0);
      expect(seq.framesLeftOverall).toBe(
        framesAaa + framesBbb + framesCcc + framesDdd + framesEee + framesFff,
      );
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe(null);

      expect(seq.currentPhase).toBe("aaa");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesAaa);

      u_.range(framesAaa - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(t);
        expect(seq.progressOverall).toBe(
          t /
            (framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff),
        );
        expect(seq.framesLeftOverall).toBe(
          framesAaa +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff -
            t,
        );
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("aaa");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesAaa);
        expect(seq.framesLeft).toBe(framesAaa - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesAaa);
      expect(seq.progressOverall).toBe(
        framesAaa /
          (framesAaa +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff),
      );
      expect(seq.framesLeftOverall).toBe(
        framesBbb + framesCcc + framesDdd + framesEee + framesFff,
      );
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("aaa");

      expect(seq.currentPhase).toBe("bbb");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesBbb);

      u_.range(framesBbb - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesAaa + t);
        expect(seq.progressOverall).toBe(
          (framesAaa + t) /
            (framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff),
        );
        expect(seq.framesLeftOverall).toBe(
          framesBbb + framesCcc + framesDdd + framesEee + framesFff - t,
        );
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("bbb");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesBbb);
        expect(seq.framesLeft).toBe(framesBbb - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesAaa + framesBbb);
      expect(seq.progressOverall).toBe(
        (framesAaa + framesBbb) /
          (framesAaa +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff),
      );
      expect(seq.framesLeftOverall).toBe(
        framesCcc + framesDdd + framesEee + framesFff,
      );
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("bbb");

      expect(seq.currentPhase).toBe("ccc");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesCcc);

      u_.range(framesCcc - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesAaa + framesBbb + t);
        expect(seq.progressOverall).toBe(
          (framesAaa + framesBbb + t) /
            (framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff),
        );
        expect(seq.framesLeftOverall).toBe(
          framesCcc + framesDdd + framesEee + framesFff - t,
        );
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("ccc");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesCcc);
        expect(seq.framesLeft).toBe(framesCcc - t);
      });

      //
      // 1st loop iteration, the one in which the intro is counted towards the overall progress
      //
      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesAaa + framesBbb + framesCcc);
      expect(seq.progressOverall).toBe(
        (framesAaa + framesBbb + framesCcc) /
          (framesAaa +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesDdd + framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("ccc");

      expect(seq.currentPhase).toBe("ddd");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesDdd);

      u_.range(framesDdd - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesAaa + framesBbb + framesCcc + t);
        expect(seq.progressOverall).toBe(
          (framesAaa + framesBbb + framesCcc + t) /
            (framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff),
        );
        expect(seq.framesLeftOverall).toBe(
          framesDdd + framesEee + framesFff - t,
        );
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("ddd");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesDdd);
        expect(seq.framesLeft).toBe(framesDdd - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesAaa + framesBbb + framesCcc + framesDdd);
      expect(seq.progressOverall).toBe(
        (framesAaa + framesBbb + framesCcc + framesDdd) /
          (framesAaa +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("ddd");

      expect(seq.currentPhase).toBe("eee");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesEee);

      u_.range(framesEee - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(
          framesAaa + framesBbb + framesCcc + framesDdd + t,
        );
        expect(seq.progressOverall).toBe(
          (framesAaa + framesBbb + framesCcc + framesDdd + t) /
            (framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff),
        );
        expect(seq.framesLeftOverall).toBe(framesEee + framesFff - t);
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("eee");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesEee);
        expect(seq.framesLeft).toBe(framesEee - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(
        framesAaa + framesBbb + framesCcc + framesDdd + framesEee,
      );
      expect(seq.progressOverall).toBe(
        (framesAaa + framesBbb + framesCcc + framesDdd + framesEee) /
          (framesAaa +
            framesBbb +
            framesCcc +
            framesDdd +
            framesEee +
            framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesFff);
      expect(seq.hasFinishedOverall).toBe(false);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("eee");

      expect(seq.currentPhase).toBe("fff");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesFff);

      u_.range(framesFff - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(
          framesAaa + framesBbb + framesCcc + framesDdd + framesEee + t,
        );
        expect(seq.progressOverall).toBe(
          (framesAaa + framesBbb + framesCcc + framesDdd + framesEee + t) /
            (framesAaa +
              framesBbb +
              framesCcc +
              framesDdd +
              framesEee +
              framesFff),
        );
        expect(seq.framesLeftOverall).toBe(framesFff - t);
        expect(seq.hasFinishedOverall).toBe(false);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("fff");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesFff);
        expect(seq.framesLeft).toBe(framesFff - t);
      });

      //
      // 2nd loop iteration, where the intro is no longer counted towards the overall progress
      //
      incrementFrameNumber();

      expect(seq.tOverall).toBe(0);
      expect(seq.progressOverall).toBe(0);
      expect(seq.framesLeftOverall).toBe(framesDdd + framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(true);

      expect(seq.justFinishedPhase).toBe("fff");

      expect(seq.currentPhase).toBe("ddd");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesDdd);

      u_.range(framesDdd - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(t);
        expect(seq.progressOverall).toBe(
          t / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(
          framesDdd + framesEee + framesFff - t,
        );
        expect(seq.hasFinishedOverall).toBe(true);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("ddd");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesDdd);
        expect(seq.framesLeft).toBe(framesDdd - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesDdd);
      expect(seq.progressOverall).toBe(
        framesDdd / (framesDdd + framesEee + framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("ddd");

      expect(seq.currentPhase).toBe("eee");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesEee);

      u_.range(framesEee - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesDdd + t);
        expect(seq.progressOverall).toBe(
          (framesDdd + t) / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(framesEee + framesFff - t);
        expect(seq.hasFinishedOverall).toBe(true);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("eee");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesEee);
        expect(seq.framesLeft).toBe(framesEee - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(framesDdd + framesEee);
      expect(seq.progressOverall).toBe(
        (framesDdd + framesEee) / (framesDdd + framesEee + framesFff),
      );
      expect(seq.framesLeftOverall).toBe(framesFff);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe("eee");

      expect(seq.currentPhase).toBe("fff");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesFff);

      u_.range(framesFff - 1).forEach((i) => {
        incrementFrameNumber();
        const t = i + 1;

        expect(seq.tOverall).toBe(framesDdd + framesEee + t);
        expect(seq.progressOverall).toBe(
          (framesDdd + framesEee + t) / (framesDdd + framesEee + framesFff),
        );
        expect(seq.framesLeftOverall).toBe(framesFff - t);
        expect(seq.hasFinishedOverall).toBe(true);
        expect(seq.hasJustFinishedOverall).toBe(false);

        expect(seq.justFinishedPhase).toBe(null);

        expect(seq.currentPhase).toBe("fff");
        expect(seq.t).toBe(t);
        expect(seq.progress).toBe(t / framesFff);
        expect(seq.framesLeft).toBe(framesFff - t);
      });

      incrementFrameNumber();

      expect(seq.tOverall).toBe(0);
      expect(seq.progressOverall).toBe(0);
      expect(seq.framesLeftOverall).toBe(framesDdd + framesEee + framesFff);
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(true);

      expect(seq.justFinishedPhase).toBe("fff");

      expect(seq.currentPhase).toBe("ddd");
      expect(seq.t).toBe(0);
      expect(seq.progress).toBe(0);
      expect(seq.framesLeft).toBe(framesDdd);
    });
  });

  // TODO: test intro+loop
  // TODO: test global pause/resume/restart + phase pause/resume/restart
});

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}

function nextFrameNumberWillBe(frameNumber: number): void {
  stubbedFrameNumber = frameNumber;
}
