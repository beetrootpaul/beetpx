import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { BeetPx } from "../../BeetPx";
import { u_ } from "../../Utils";
import { Button } from "./Button";

let stubbedFrameNumber = 1;

function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}

describe("Button", () => {
  beforeEach(() => {
    stubbedFrameNumber = 123;
    jest
      .spyOn(BeetPx, "frameNumber", "get")
      .mockImplementation(() => stubbedFrameNumber);
  });

  describe("without repeating", () => {
    const btn = new Button();
    test("#wasJustReleased / #wasJustPressed", () => {
      // repeating is off by default, nothing else to be done about it

      // released at init
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(false);

      // still released
      btn.update(false);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(false);

      // pressed
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);

      // still pressed
      u_.range(99).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      // released
      btn.update(false);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(false);

      // still released
      u_.range(99).forEach(() => {
        btn.update(false);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      // pressed and released again, and again
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      btn.update(false);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(false);
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      btn.update(false);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(false);
    });
  });

  describe("with repeating", () => {
    test.each([
      { initialFrames: 10, intervalFrames: 4 },
      { initialFrames: 5, intervalFrames: 22 },
    ])(
      "#wasJustReleased / #wasJustPressed (initial=$initialFrames, interval=$intervalFrames)",
      ({ initialFrames, intervalFrames }) => {
        const btn = new Button();
        btn.makeRepeating(initialFrames, intervalFrames);

        // initial state
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);

        // press
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(true);

        // nearly complete continuous initial press
        u_.range(-1 + initialFrames - 1).forEach(() => {
          btn.update(true);
          incrementFrameNumber();
          expect(btn.wasJustReleased).toBe(false);
          expect(btn.wasJustPressed).toBe(false);
        });
        btn.update(false);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(true);
        expect(btn.wasJustPressed).toBe(false);

        // press again
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(true);

        // complete continuous initial press …
        u_.range(-1 + initialFrames - 1).forEach(() => {
          btn.update(true);
          incrementFrameNumber();
          expect(btn.wasJustReleased).toBe(false);
          expect(btn.wasJustPressed).toBe(false);
        });
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(true);
        expect(btn.wasJustPressed).toBe(true);

        // … continued into several complete continuous interval presses …
        u_.range(3).forEach(() => {
          u_.range(intervalFrames - 1).forEach(() => {
            btn.update(true);
            incrementFrameNumber();
            expect(btn.wasJustReleased).toBe(false);
            expect(btn.wasJustPressed).toBe(false);
          });
          btn.update(true);
          incrementFrameNumber();
          expect(btn.wasJustReleased).toBe(true);
          expect(btn.wasJustPressed).toBe(true);
        });

        // … and, finally, the chain of intervals is broken
        u_.range(intervalFrames - 1).forEach(() => {
          btn.update(true);
          incrementFrameNumber();
          expect(btn.wasJustReleased).toBe(false);
          expect(btn.wasJustPressed).toBe(false);
        });
        btn.update(false);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(true);
        expect(btn.wasJustPressed).toBe(false);

        // and keep it released for some time
        u_.range(3).forEach(() => {
          btn.update(false);
          incrementFrameNumber();
          expect(btn.wasJustReleased).toBe(false);
          expect(btn.wasJustPressed).toBe(false);
        });

        // now, press again
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(true);

        // and keep pressed for the whole initial duration
        u_.range(-1 + initialFrames - 1).forEach(() => {
          btn.update(true);
          incrementFrameNumber();
          expect(btn.wasJustReleased).toBe(false);
          expect(btn.wasJustPressed).toBe(false);
        });
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(true);
        expect(btn.wasJustPressed).toBe(true);
      },
    );

    test("repeating can be set, changed, or unset any time", () => {
      const btn = new Button();

      //
      // no repeating
      //

      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(99).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      //
      // repeating turned on in the middle of a press
      //

      btn.makeRepeating(22, 11);

      u_.range(99).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      btn.update(false);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(false);
      u_.range(3).forEach(() => {
        btn.update(false);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(-1 + 22 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(11 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(3).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      //
      // repeating changed in the middle of a repeated press – the new
      // configuration will take place after the nearest button release
      //

      btn.makeRepeating(44, 33);

      u_.range(-3 + 11 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(3).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      btn.update(false);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(false);

      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(-1 + 44 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(33 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(3).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      //
      // repeating turned off
      //

      btn.makeNotRepeating();

      btn.update(false);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(false);
      u_.range(99).forEach(() => {
        btn.update(false);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
    });

    test("repeating defined with 1 initial frame and 1 interval frame", () => {
      const btn = new Button();

      btn.makeRepeating(1, 1);

      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(false);

      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);

      u_.range(99).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(true);
        expect(btn.wasJustPressed).toBe(true);
      });
    });

    test("repeating defined with negative or zero amount of frames", () => {
      let btn = new Button();

      //
      // no initial frames
      //

      btn.makeRepeating(0, 22);
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(false);

      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(22 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      // TODO: ???
      // expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(22 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);

      //
      // negative initial frames
      //

      btn = new Button();
      btn.makeRepeating(-1, 22);
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(false);

      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(-1 + 22 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(22 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);

      //
      // no interval frames
      //

      btn = new Button();
      btn.makeRepeating(22, 0);
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(false);

      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(22 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(99).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });

      //
      // negative interval frames
      //

      btn = new Button();
      btn.makeRepeating(22, -1);
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(false);

      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(false);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(22 - 1).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
      btn.update(true);
      incrementFrameNumber();
      expect(btn.wasJustReleased).toBe(true);
      expect(btn.wasJustPressed).toBe(true);
      u_.range(99).forEach(() => {
        btn.update(true);
        incrementFrameNumber();
        expect(btn.wasJustReleased).toBe(false);
        expect(btn.wasJustPressed).toBe(false);
      });
    });
  });
});
