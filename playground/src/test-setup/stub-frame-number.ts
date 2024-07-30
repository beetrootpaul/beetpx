import { beforeEach, vi } from "vitest";
import { BeetPx } from "../../../src";

let stubbedFrameNumber = 1;

beforeEach(() => {
  stubbedFrameNumber = 1;
  vi.spyOn(BeetPx, "frameNumberOutsidePause", "get").mockImplementation(
    () => stubbedFrameNumber,
  );
});

export function incrementFrameNumber(): void {
  stubbedFrameNumber += 1;
}
