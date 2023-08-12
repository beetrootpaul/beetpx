"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Utils_1 = require("../Utils");
const Button_1 = require("./Button");
(0, globals_1.describe)("Button", () => {
    (0, globals_1.test)("#wasJustReleased / #wasJustPressed – without repeating", () => {
        const button = new Button_1.Button();
        const wasJustReleased = () => button.wasJustReleased(false);
        const wasJustPressed = () => button.wasJustPressed(false);
        // initial state
        (0, globals_1.expect)(wasJustReleased()).toBe(false);
        (0, globals_1.expect)(wasJustPressed()).toBe(false);
        // pressed
        button.update(false);
        (0, globals_1.expect)(wasJustReleased()).toBe(false);
        (0, globals_1.expect)(wasJustPressed()).toBe(false);
        button.update(true);
        (0, globals_1.expect)(wasJustReleased()).toBe(false);
        (0, globals_1.expect)(wasJustPressed()).toBe(true);
        // still pressed
        Utils_1.Utils.repeatN(Button_1.Button.repeatingFramesStart + Button_1.Button.repeatingFramesInterval + 1, () => {
            button.update(true);
            (0, globals_1.expect)(wasJustReleased()).toBe(false);
            (0, globals_1.expect)(wasJustPressed()).toBe(false);
        });
        // released
        button.update(false);
        (0, globals_1.expect)(wasJustReleased()).toBe(true);
        (0, globals_1.expect)(wasJustPressed()).toBe(false);
        // still released
        Utils_1.Utils.repeatN(Button_1.Button.repeatingFramesStart + Button_1.Button.repeatingFramesInterval + 1, () => {
            button.update(false);
            (0, globals_1.expect)(wasJustReleased()).toBe(false);
            (0, globals_1.expect)(wasJustPressed()).toBe(false);
        });
        // pressed and released again
        button.update(true);
        (0, globals_1.expect)(wasJustReleased()).toBe(false);
        (0, globals_1.expect)(wasJustPressed()).toBe(true);
        button.update(false);
        (0, globals_1.expect)(wasJustReleased()).toBe(true);
        (0, globals_1.expect)(wasJustPressed()).toBe(false);
    });
    (0, globals_1.test)("#wasJustReleased / #wasJustPressed – with repeating", () => {
        const button = new Button_1.Button();
        const wasJustReleasedRepeating = () => button.wasJustReleased(true);
        const wasJustPressedRepeating = () => button.wasJustPressed(true);
        // initial state
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        // first press
        button.update(true);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(true);
        // nearly complete sequence of press x start frames
        Utils_1.Utils.repeatN(Button_1.Button.repeatingFramesStart - 1, () => {
            button.update(true);
            (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
            (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        });
        button.update(false);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(true);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        // back to first press
        button.update(true);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(true);
        // complete sequence of press x start frames
        Utils_1.Utils.repeatN(Button_1.Button.repeatingFramesStart - 1, () => {
            button.update(true);
            (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
            (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        });
        button.update(true);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(true);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(true);
        // next, nearly complete sequence of press x interval frames
        Utils_1.Utils.repeatN(Button_1.Button.repeatingFramesInterval - 1, () => {
            button.update(true);
            (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
            (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        });
        button.update(false);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(true);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        // back to first press
        button.update(true);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(true);
        //  complete sequence of press x start frames
        Utils_1.Utils.repeatN(Button_1.Button.repeatingFramesStart - 1, () => {
            button.update(true);
            (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
            (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        });
        button.update(true);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(true);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(true);
        // next, complete sequence of press x interval frames
        Utils_1.Utils.repeatN(Button_1.Button.repeatingFramesInterval - 1, () => {
            button.update(true);
            (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
            (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        });
        button.update(true);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(true);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(true);
        // next, consecutive complete sequence of press x interval frames
        Utils_1.Utils.repeatN(Button_1.Button.repeatingFramesInterval - 1, () => {
            button.update(true);
            (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(false);
            (0, globals_1.expect)(wasJustPressedRepeating()).toBe(false);
        });
        button.update(true);
        (0, globals_1.expect)(wasJustReleasedRepeating()).toBe(true);
        (0, globals_1.expect)(wasJustPressedRepeating()).toBe(true);
    });
});
