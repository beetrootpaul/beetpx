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
    const seq = timerSeq_({
      intro: [
        ["aaa", 8],
        ["bbb", 2],
      ],
    });

    expect(seq.t).toBe(0);
    expect(seq.progress).toBe(0);
    expect(seq.framesLeft).toBe(10);
    expect(seq.hasFinished).toBe(false);
    expect(seq.hasJustFinished).toBe(false);
    expect(seq.justFinishedPhase).toBe(null);
    expect(seq.phase).toBe("aaa");
    expect(seq.phaseTimer.t).toBe(0);
    expect(seq.phaseTimer.progress).toBe(0);
    expect(seq.phaseTimer.framesLeft).toBe(8);
    expect(seq.phaseTimer.hasFinished).toBe(false);
    expect(seq.phaseTimer.hasJustFinished).toBe(false);

    incrementFrameNumber();

    expect(seq.t).toBe(1);
    expect(seq.progress).toBe(0.1);
    expect(seq.framesLeft).toBe(9);
    expect(seq.hasFinished).toBe(false);
    expect(seq.hasJustFinished).toBe(false);
    expect(seq.justFinishedPhase).toBe(null);
    expect(seq.phase).toBe("aaa");
    expect(seq.phaseTimer.t).toBe(1);
    expect(seq.phaseTimer.progress).toBe(0.125);
    expect(seq.phaseTimer.framesLeft).toBe(7);
    expect(seq.phaseTimer.hasFinished).toBe(false);
    expect(seq.phaseTimer.hasJustFinished).toBe(false);

    u_.range(8 - 2).forEach(() => {
      incrementFrameNumber();
    });

    expect(seq.t).toBe(7);
    expect(seq.progress).toBe(0.7);
    expect(seq.framesLeft).toBe(3);
    expect(seq.hasFinished).toBe(false);
    expect(seq.hasJustFinished).toBe(false);
    expect(seq.justFinishedPhase).toBe(null);
    expect(seq.phase).toBe("aaa");
    expect(seq.phaseTimer.t).toBe(7);
    expect(seq.phaseTimer.progress).toBe(0.875);
    expect(seq.phaseTimer.framesLeft).toBe(1);
    expect(seq.phaseTimer.hasFinished).toBe(false);
    expect(seq.phaseTimer.hasJustFinished).toBe(false);

    incrementFrameNumber();

    expect(seq.t).toBe(8);
    expect(seq.progress).toBe(0.8);
    expect(seq.framesLeft).toBe(2);
    expect(seq.hasFinished).toBe(false);
    expect(seq.hasJustFinished).toBe(false);
    expect(seq.justFinishedPhase).toBe("aaa");
    expect(seq.phase).toBe("bbb");
    expect(seq.phaseTimer.t).toBe(0);
    expect(seq.phaseTimer.progress).toBe(0);
    expect(seq.phaseTimer.framesLeft).toBe(2);
    expect(seq.phaseTimer.hasFinished).toBe(false);
    expect(seq.phaseTimer.hasJustFinished).toBe(false);

    incrementFrameNumber();

    expect(seq.t).toBe(9);
    expect(seq.progress).toBe(0.9);
    expect(seq.framesLeft).toBe(1);
    expect(seq.hasFinished).toBe(false);
    expect(seq.hasJustFinished).toBe(false);
    expect(seq.justFinishedPhase).toBe(null);
    expect(seq.phase).toBe("bbb");
    expect(seq.phaseTimer.t).toBe(1);
    expect(seq.phaseTimer.progress).toBe(0.5);
    expect(seq.phaseTimer.framesLeft).toBe(1);
    expect(seq.phaseTimer.hasFinished).toBe(false);
    expect(seq.phaseTimer.hasJustFinished).toBe(false);

    incrementFrameNumber();

    expect(seq.t).toBe(10);
    expect(seq.progress).toBe(1);
    expect(seq.framesLeft).toBe(0);
    expect(seq.hasFinished).toBe(true);
    expect(seq.hasJustFinished).toBe(true);
    expect(seq.justFinishedPhase).toBe("bbb");
    expect(seq.phase).toBe("bbb");
    expect(seq.phaseTimer.t).toBe(2);
    expect(seq.phaseTimer.progress).toBe(1);
    expect(seq.phaseTimer.framesLeft).toBe(0);
    expect(seq.phaseTimer.hasFinished).toBe(true);
    expect(seq.phaseTimer.hasJustFinished).toBe(true);

    incrementFrameNumber();

    expect(seq.t).toBe(10);
    expect(seq.progress).toBe(1);
    expect(seq.framesLeft).toBe(0);
    expect(seq.hasFinished).toBe(true);
    expect(seq.hasJustFinished).toBe(false);
    expect(seq.justFinishedPhase).toBe(null);
    expect(seq.phase).toBe("bbb");
    expect(seq.phaseTimer.t).toBe(2);
    expect(seq.phaseTimer.progress).toBe(1);
    expect(seq.phaseTimer.framesLeft).toBe(0);
    expect(seq.phaseTimer.hasFinished).toBe(true);
    expect(seq.phaseTimer.hasJustFinished).toBe(false);
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
