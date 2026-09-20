import {describe, expect, test} from "vitest";
import {Counter} from "./Counter";
import {$u} from "@beetpx/beetpx";
import {incrementFrameNumber} from "./test-setup/stub-frame-number";

describe("Counter", () => {
    test("counting", () => {
        const counter = new Counter(10);
        expect(counter.left).toBe(9);

        incrementFrameNumber();
        expect(counter.left).toBe(8);

        $u.range(8).forEach(() => {
            incrementFrameNumber();
        })
        expect(counter.left).toBe(0);

        incrementFrameNumber();
        expect(counter.left).toBe(9);
    });
});
