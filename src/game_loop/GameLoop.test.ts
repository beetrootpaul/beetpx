import { describe, expect, jest, test } from "@jest/globals";
import { GameLoop, GameLoopCallbacks } from "./GameLoop";

describe("GameLoop", () => {
  describe("updateFn", () => {
    test("if ticks happen fast enough updateFn is called once every desired delta time", () => {
      testGameLoop({
        desiredUpdateFps: 1000 / 100,
        sequenceOfEvents: [
          tickAt(0),
          tickAt(1),
          tickAt(2),
          tickAt(3),
          tickAt(4),
          tickAt(99),
          () => expect(updateFn).toBeCalledTimes(0),
          tickAt(100),
          () => expect(updateFn).toBeCalledTimes(1),
          tickAt(101),
          tickAt(199),
          () => expect(updateFn).toBeCalledTimes(1),
          tickAt(200),
          () => expect(updateFn).toBeCalledTimes(2),
        ],
      });
    });

    test("time spent while window was not visible does not count towards delta time for updateFn calls", () => {
      testGameLoop({
        desiredUpdateFps: 1000 / 100,
        sequenceOfEvents: [
          tickAt(0),
          tickAt(90),
          hideWindow(),
          tickAt(100),
          () => expect(updateFn).toBeCalledTimes(0),
          tickAt(400),
          showWindow(),
          tickAt(409),
          () => expect(updateFn).toBeCalledTimes(0),
          tickAt(410),
          () => expect(updateFn).toBeCalledTimes(1),
          tickAt(509),
          hideWindow(),
          tickAt(909),
          () => expect(updateFn).toBeCalledTimes(1),
          showWindow(),
          tickAt(910),
          () => expect(updateFn).toBeCalledTimes(2),
        ],
      });
    });

    test("updateFn is called multiple times to compensate for a long delta time between ticks", () => {
      testGameLoop({
        desiredUpdateFps: 1000 / 100,
        sequenceOfEvents: [
          tickAt(0),
          tickAt(99),
          () => expect(updateFn).toBeCalledTimes(0),
          tickAt(400),
          () => expect(updateFn).toBeCalledTimes(4),
          tickAt(499),
          () => expect(updateFn).toBeCalledTimes(4),
          tickAt(800),
          () => expect(updateFn).toBeCalledTimes(8),
        ],
      });
    });

    test("updateFn is called no  more then 5 times when compensating for a long delta time between ticks", () => {
      testGameLoop({
        desiredUpdateFps: 1000 / 100,
        sequenceOfEvents: [
          tickAt(0),
          tickAt(99),
          () => expect(updateFn).toBeCalledTimes(0),
          tickAt(1234),
          () => expect(updateFn).toBeCalledTimes(5), // instead of 10
          tickAt(1333),
          () => expect(updateFn).toBeCalledTimes(5), // because only 1 ms passed since last time amount of update calls reached its limit
          tickAt(1334),
          () => expect(updateFn).toBeCalledTimes(6),
          tickAt(2000),
          () => expect(updateFn).toBeCalledTimes(11), // instead of 20
        ],
      });
    });
  });

  describe("renderFn", () => {
    test("renderFn is called on every tick, no matter how do they related to a desired update FPS", () => {
      testGameLoop({
        desiredUpdateFps: anyFps,
        sequenceOfEvents: [
          tickAt(0),
          () => expect(renderFn).toBeCalledTimes(1),
          tickAt(1),
          () => expect(renderFn).toBeCalledTimes(2),
          tickAt(2),
          () => expect(renderFn).toBeCalledTimes(3),
          tickAt(3),
          () => expect(renderFn).toBeCalledTimes(4),
          tickAt(1_000_000),
          () => expect(renderFn).toBeCalledTimes(5),
          tickAt(2_000_000),
          () => expect(renderFn).toBeCalledTimes(6),
          tickAt(3_000_000),
          () => expect(renderFn).toBeCalledTimes(7),
          tickAt(999_000_000),
          () => expect(renderFn).toBeCalledTimes(8),
        ],
      });
    });

    test("renderFn is not called on those ticks where window was not visible", () => {
      testGameLoop({
        desiredUpdateFps: anyFps,
        sequenceOfEvents: [
          tickAt(0),
          () => expect(renderFn).toBeCalledTimes(1),
          tickAt(1),
          () => expect(renderFn).toBeCalledTimes(2),
          hideWindow(),
          tickAt(2),
          () => expect(renderFn).toBeCalledTimes(2),
          showWindow(),
          tickAt(3),
          () => expect(renderFn).toBeCalledTimes(3),
          tickAt(1_000_000),
          () => expect(renderFn).toBeCalledTimes(4),
          hideWindow(),
          tickAt(2_000_000),
          () => expect(renderFn).toBeCalledTimes(4),
          tickAt(3_000_000),
          () => expect(renderFn).toBeCalledTimes(4),
          showWindow(),
          tickAt(999_000_000),
          () => expect(renderFn).toBeCalledTimes(5),
        ],
      });
    });

    test("render FPS calculation", () => {
      testGameLoop({
        desiredUpdateFps: anyFps,
        sequenceOfEvents: [
          tickAt(0),
          () => expect(renderFn).lastCalledWith(GameLoop.renderFpsResultCap),
          tickAt(123),
          () => expect(renderFn).lastCalledWith(Math.floor(1000 / 123)),
          tickAt(223),
          () => expect(renderFn).lastCalledWith(Math.floor(1000 / 100)),
          tickAt(224),
          // We expect FPS result cap here, because 1 millis would mean 1000 FPS
          //   and our cap is at 999:
          () => expect(renderFn).lastCalledWith(GameLoop.renderFpsResultCap),
          tickAt(226),
          () => expect(renderFn).lastCalledWith(Math.floor(1000 / 2)),
        ],
      });
    });

    test("render FPS calculation - ignore ticks and do not accumulate delta time when window is not visible ", () => {
      testGameLoop({
        desiredUpdateFps: anyFps,
        sequenceOfEvents: [
          tickAt(0),
          () => expect(renderFn).lastCalledWith(GameLoop.renderFpsResultCap),
          tickAt(10),
          () => expect(renderFn).lastCalledWith(Math.floor(1000 / 10)),
          hideWindow(),
          tickAt(30),
          tickAt(60),
          showWindow(),
          tickAt(100),
          // We expect 40 here, because the delta is calculated from the last tick,
          //   no matter if the window was hidden:
          () => expect(renderFn).lastCalledWith(Math.floor(1000 / 40)),
          tickAt(150),
          () => expect(renderFn).lastCalledWith(Math.floor(1000 / 50)),
        ],
      });
    });
  });
});

const anyFps = 10;

const rafFn = jest.fn<AnimationFrameProvider["requestAnimationFrame"]>();
const updateFn = jest.fn<GameLoopCallbacks["updateFn"]>();
const renderFn = jest.fn<GameLoopCallbacks["renderFn"]>();

const documentVisibilityStateProvider: {
  visibilityState: DocumentVisibilityState;
} = { visibilityState: "visible" };

function tickAt(time: DOMHighResTimeStamp): TestEvent {
  return { type: "tick", time };
}

function showWindow(): TestEvent {
  return { type: "show_window" };
}

function hideWindow(): TestEvent {
  return { type: "hide_window" };
}

type TestEvent =
  | (() => void) // a side effect type of an event
  | { type: "tick"; time: DOMHighResTimeStamp; eventIndex?: number }
  | { type: "show_window" }
  | { type: "hide_window" };

function testGameLoop(params: {
  desiredUpdateFps: number;
  sequenceOfEvents: TestEvent[];
}): void {
  let seq: TestEvent[] = [...params.sequenceOfEvents];

  // Replace non-tick events with side effects and add logs to make it
  //   easier to debug failing tests:
  seq = seq.map((event, index) => {
    if (typeof event === "function") {
      return () => {
        console.log(`Sequence event: [${index}] custom side effect`);
        event();
      };
    }
    if (event.type === "show_window") {
      return () => {
        console.log(`Sequence event: [${index}] show_window`);
        documentVisibilityStateProvider.visibilityState = "visible";
      };
    }
    if (event.type === "hide_window") {
      return () => {
        console.log(`Sequence event: [${index}] hide_window`);
        documentVisibilityStateProvider.visibilityState = "hidden";
      };
    }
    return {
      ...event,
      eventIndex: index,
    };
  });

  // Merge consecutive side effects, so we can assume there is
  //   at most 1 side effect between other events:
  seq = seq.reduce((prevEvents: TestEvent[], nextEvent: TestEvent) => {
    const prevEvent = prevEvents[prevEvents.length - 1];
    if (typeof prevEvent === "function" && typeof nextEvent === "function") {
      prevEvents[prevEvents.length - 1] = () => {
        prevEvent();
        nextEvent();
      };
      return prevEvents;
    }
    prevEvents.push(nextEvent);
    return prevEvents;
  }, []);

  // Pop the last side effect so we can call it separately after
  //   starting a game loop before it:
  let lastSideEffect: () => void = () => {};
  if (typeof seq[seq.length - 1] === "function") {
    lastSideEffect = seq[seq.length - 1] as () => void;
    seq.pop();
  }

  // Prepare for the sequence processing:
  jest.resetAllMocks();
  documentVisibilityStateProvider.visibilityState = "visible";
  let nextRafRequestId = 1;
  rafFn.mockImplementation((_callback) => nextRafRequestId++);

  // Process the sequence of events:
  let prevTickTime = -1;
  for (let i = 0; i < seq.length; i++) {
    const currEvent = seq[i];
    if (typeof currEvent === "object" && currEvent.type === "tick") {
      // we want to simulate always increasing tick time
      expect(currEvent.time).toBeGreaterThan(prevTickTime);
      prevTickTime = currEvent.time;

      const prevEvent = i > 0 ? seq[i - 1]! : undefined;

      rafFn.mockImplementationOnce((callback) => {
        if (typeof prevEvent === "function") {
          prevEvent();
        }
        console.log(
          `Sequence event: [${currEvent.eventIndex}] tick ${currEvent.time}`,
        );

        callback(currEvent.time);

        return nextRafRequestId++;
      });
    }
  }

  // Start the Game Loop:
  new GameLoop({
    fixedTimestepFps: params.desiredUpdateFps,
    rafFn,
    documentVisibilityStateProvider,
  }).start({ updateFn, renderFn });

  // Process the last side effect event:
  lastSideEffect();
}
