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
    const framesAaa = 100;
    const framesBbb = 20;
    const framesCcc = 40;
    const seq = timerSeq_({
      loop: [
        ["aaa", framesAaa],
        ["bbb", framesBbb],
        ["ccc", framesCcc],
      ],
    });

    //
    // 1st loop iteration
    //

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

    //
    // 2nd loop iteration, same as the 1st except for the "hasFinishedOverall=true"
    //
    incrementFrameNumber();

    expect(seq.tOverall).toBe(0);
    expect(seq.progressOverall).toBe(0);
    expect(seq.framesLeftOverall).toBe(framesAaa + framesBbb + framesCcc);
    expect(seq.hasFinishedOverall).toBe(true);
    expect(seq.hasJustFinishedOverall).toBe(true);

    expect(seq.justFinishedPhase).toBe("ccc");

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
      expect(seq.hasFinishedOverall).toBe(true);
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
    expect(seq.hasFinishedOverall).toBe(true);
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
      expect(seq.hasFinishedOverall).toBe(true);
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
    expect(seq.hasFinishedOverall).toBe(true);
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
      expect(seq.hasFinishedOverall).toBe(true);
      expect(seq.hasJustFinishedOverall).toBe(false);

      expect(seq.justFinishedPhase).toBe(null);

      expect(seq.currentPhase).toBe("ccc");
      expect(seq.t).toBe(t);
      expect(seq.progress).toBe(t / framesCcc);
      expect(seq.framesLeft).toBe(framesCcc - t);
    });

    incrementFrameNumber();

    expect(seq.tOverall).toBe(0);
    expect(seq.progressOverall).toBe(0);
    expect(seq.framesLeftOverall).toBe(framesAaa + framesBbb + framesCcc);
    expect(seq.hasFinishedOverall).toBe(true);
    expect(seq.hasJustFinishedOverall).toBe(true);

    // TODO: uncomment
    // expect(seq.justFinishedPhase).toBe("ccc");

    expect(seq.currentPhase).toBe("aaa");
    expect(seq.t).toBe(0);
    expect(seq.progress).toBe(0);
    expect(seq.framesLeft).toBe(framesAaa);
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
