import { $v } from "../../shorthands";
import { Button } from "./Button";
export class GameButtons {
    #left = new Button();
    #right = new Button();
    #up = new Button();
    #down = new Button();
    #O = new Button();
    #X = new Button();
    #menu = new Button();
    update(events) {
        this.#left.update(events.has("button_left"));
        this.#right.update(events.has("button_right"));
        this.#up.update(events.has("button_up"));
        this.#down.update(events.has("button_down"));
        this.#O.update(events.has("button_O"));
        this.#X.update(events.has("button_X"));
        this.#menu.update(events.has("button_menu"));
    }
    isAnyPressed() {
        return (this.#left.isPressed ||
            this.#right.isPressed ||
            this.#up.isPressed ||
            this.#down.isPressed ||
            this.#O.isPressed ||
            this.#X.isPressed ||
            this.#menu.isPressed);
    }
    isPressed(button) {
        switch (button) {
            case "left":
                return this.#left.isPressed;
            case "right":
                return this.#right.isPressed;
            case "up":
                return this.#up.isPressed;
            case "down":
                return this.#down.isPressed;
            case "O":
            case "o":
                return this.#O.isPressed;
            case "X":
            case "x":
                return this.#X.isPressed;
            case "menu":
                return this.#menu.isPressed;
        }
    }
    getPressedDirection() {
        return $v((this.#left.isPressed ? -1 : 0) + (this.#right.isPressed ? 1 : 0), (this.#up.isPressed ? -1 : 0) + (this.#down.isPressed ? 1 : 0));
    }
    setButtonRepeating(button, repeating) {
        switch (button) {
            case "left":
                this.#left.setRepeating(repeating);
                return;
            case "right":
                this.#right.setRepeating(repeating);
                return;
            case "up":
                this.#up.setRepeating(repeating);
                return;
            case "down":
                this.#down.setRepeating(repeating);
                return;
            case "O":
            case "o":
                this.#O.setRepeating(repeating);
                return;
            case "X":
            case "x":
                this.#X.setRepeating(repeating);
                return;
            case "menu":
                this.#menu.setRepeating(repeating);
                return;
        }
    }
    wasAnyJustPressed() {
        return (this.#left.wasJustPressed ||
            this.#right.wasJustPressed ||
            this.#up.wasJustPressed ||
            this.#down.wasJustPressed ||
            this.#O.wasJustPressed ||
            this.#X.wasJustPressed ||
            this.#menu.wasJustPressed);
    }
    wasJustPressed(button) {
        switch (button) {
            case "left":
                return this.#left.wasJustPressed;
            case "right":
                return this.#right.wasJustPressed;
            case "up":
                return this.#up.wasJustPressed;
            case "down":
                return this.#down.wasJustPressed;
            case "O":
            case "o":
                return this.#O.wasJustPressed;
            case "X":
            case "x":
                return this.#X.wasJustPressed;
            case "menu":
                return this.#menu.wasJustPressed;
        }
    }
    wasJustReleased(button) {
        switch (button) {
            case "left":
                return this.#left.wasJustReleased;
            case "right":
                return this.#right.wasJustReleased;
            case "up":
                return this.#up.wasJustReleased;
            case "down":
                return this.#down.wasJustReleased;
            case "O":
            case "o":
                return this.#O.wasJustReleased;
            case "X":
            case "x":
                return this.#X.wasJustReleased;
            case "menu":
                return this.#menu.wasJustReleased;
        }
    }
}
//# sourceMappingURL=GameButtons.js.map