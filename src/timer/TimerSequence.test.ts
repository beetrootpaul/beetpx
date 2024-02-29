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

  test("iterates over phases (intro only)", () => {
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
      expect(seq.progressOverall).toBe(t / (framesAaa + framesBbb + framesCcc));
      expect(seq.framesLeftOverall).toBe(framesAaa + framesBbb + framesCcc - t);
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

  test("iterates over phases (loop only)", () => {
    const seq = timerSeq_({
      intro: [
        ["aaa", 4],
        ["bbb", 2],
        ["ccc", 4],
      ],
    });

    //
    // t = 0, first loop iteration, phase "aaa"
    //

    expect(seq.tOverall).toBe(0);
    expect(seq.progressOverall).toBe(0);
    expect(seq.framesLeftOverall).toBe(10);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("aaa");
    expect(seq.t).toBe(0);
    expect(seq.progress).toBe(0);
    expect(seq.framesLeft).toBe(4);

    incrementFrameNumber();

    //
    // t = 1, first loop iteration, phase "aaa"
    //

    expect(seq.tOverall).toBe(1);
    expect(seq.progressOverall).toBe(0.1);
    expect(seq.framesLeftOverall).toBe(9);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("aaa");
    expect(seq.t).toBe(1);
    expect(seq.progress).toBe(0.25);
    expect(seq.framesLeft).toBe(3);

    incrementFrameNumber();

    //
    // t = 2, first loop iteration, phase "aaa"
    //

    expect(seq.tOverall).toBe(2);
    expect(seq.progressOverall).toBe(0.2);
    expect(seq.framesLeftOverall).toBe(8);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("aaa");
    expect(seq.t).toBe(2);
    expect(seq.progress).toBe(0.5);
    expect(seq.framesLeft).toBe(2);

    incrementFrameNumber();

    //
    // t = 3, first loop iteration, phase "aaa"
    //

    expect(seq.tOverall).toBe(3);
    expect(seq.progressOverall).toBe(0.3);
    expect(seq.framesLeftOverall).toBe(7);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("aaa");
    expect(seq.t).toBe(3);
    expect(seq.progress).toBe(0.75);
    expect(seq.framesLeft).toBe(1);

    incrementFrameNumber();

    //
    // t = 4, first loop iteration, phase "bbb"
    //

    expect(seq.tOverall).toBe(4);
    expect(seq.progressOverall).toBe(0.4);
    expect(seq.framesLeftOverall).toBe(6);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe("aaa");
    //
    expect(seq.currentPhase).toBe("bbb");
    expect(seq.t).toBe(0);
    expect(seq.progress).toBe(0);
    expect(seq.framesLeft).toBe(2);

    incrementFrameNumber();

    //
    // t = 5, first loop iteration, phase "bbb"
    //

    expect(seq.tOverall).toBe(5);
    expect(seq.progressOverall).toBe(0.5);
    expect(seq.framesLeftOverall).toBe(5);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("bbb");
    expect(seq.t).toBe(1);
    expect(seq.progress).toBe(0.5);
    expect(seq.framesLeft).toBe(1);

    incrementFrameNumber();

    //
    // t = 6, first loop iteration, phase "ccc"
    //

    expect(seq.tOverall).toBe(6);
    expect(seq.progressOverall).toBe(0.6);
    expect(seq.framesLeftOverall).toBe(4);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe("bbb");
    //
    expect(seq.currentPhase).toBe("ccc");
    expect(seq.t).toBe(0);
    expect(seq.progress).toBe(0);
    expect(seq.framesLeft).toBe(4);

    incrementFrameNumber();

    //
    // t = 7, first loop iteration, phase "ccc"
    //

    expect(seq.tOverall).toBe(7);
    expect(seq.progressOverall).toBe(0.7);
    expect(seq.framesLeftOverall).toBe(3);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("ccc");
    expect(seq.t).toBe(1);
    expect(seq.progress).toBe(0.25);
    expect(seq.framesLeft).toBe(3);

    incrementFrameNumber();

    //
    // t = 8, first loop iteration, phase "ccc"
    //

    expect(seq.tOverall).toBe(8);
    expect(seq.progressOverall).toBe(0.8);
    expect(seq.framesLeftOverall).toBe(2);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("ccc");
    expect(seq.t).toBe(2);
    expect(seq.progress).toBe(0.5);
    expect(seq.framesLeft).toBe(2);

    incrementFrameNumber();

    //
    // t = 9, first loop iteration, phase "ccc"
    //

    expect(seq.tOverall).toBe(9);
    expect(seq.progressOverall).toBe(0.9);
    expect(seq.framesLeftOverall).toBe(1);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("ccc");
    expect(seq.t).toBe(3);
    expect(seq.progress).toBe(0.75);
    expect(seq.framesLeft).toBe(1);

    incrementFrameNumber();

    //
    // And now, from the beginning:
    // t = 10, second loop iteration, phase "aaa"
    //

    expect(seq.tOverall).toBe(0);
    expect(seq.progressOverall).toBe(0);
    expect(seq.framesLeftOverall).toBe(10);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("aaa");
    expect(seq.t).toBe(0);
    expect(seq.progress).toBe(0);
    expect(seq.framesLeft).toBe(4);

    incrementFrameNumber();

    //
    // t = 11, second loop iteration, phase "aaa"
    //

    expect(seq.tOverall).toBe(1);
    expect(seq.progressOverall).toBe(0.1);
    expect(seq.framesLeftOverall).toBe(9);
    expect(seq.hasFinishedOverall).toBe(false);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("aaa");
    expect(seq.t).toBe(1);
    expect(seq.progress).toBe(0.25);
    expect(seq.framesLeft).toBe(3);
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
