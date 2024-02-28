import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "../BeetPx";
import { timerSeq_ } from "./TimerSequence";

describe("TimerSequence", () => {
  beforeEach(() => {
    jest
      .spyOn(BeetPx, "frameNumber", "get")
      .mockImplementation(() => stubbedFrameNumber);
    nextFrameNumberWillBe(501);
  });

  test("iterates over phases (intro only)", () => {
    const seq = timerSeq_({
      intro: [
        ["aaa", 4],
        ["bbb", 2],
        ["ccc", 4],
      ],
    });

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

    expect(seq.tOverall).toBe(10);
    expect(seq.progressOverall).toBe(1);
    expect(seq.framesLeftOverall).toBe(0);
    expect(seq.hasFinishedOverall).toBe(true);
    expect(seq.hasJustFinishedOverall).toBe(true);
    //
    expect(seq.justFinishedPhase).toBe("ccc");
    //
    expect(seq.currentPhase).toBe("ccc");
    expect(seq.t).toBe(4);
    expect(seq.progress).toBe(1);
    expect(seq.framesLeft).toBe(0);

    incrementFrameNumber();

    expect(seq.tOverall).toBe(10);
    expect(seq.progressOverall).toBe(1);
    expect(seq.framesLeftOverall).toBe(0);
    expect(seq.hasFinishedOverall).toBe(true);
    expect(seq.hasJustFinishedOverall).toBe(false);
    //
    expect(seq.justFinishedPhase).toBe(null);
    //
    expect(seq.currentPhase).toBe("ccc");
    expect(seq.t).toBe(4);
    expect(seq.progress).toBe(1);
    expect(seq.framesLeft).toBe(0);
  });

  // TODO: test loop
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
