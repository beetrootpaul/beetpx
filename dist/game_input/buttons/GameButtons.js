import { $v } from "../../shorthands";
import { Button } from "./Button";
export class GameButtons {
    #left = new Button();
    #right = new Button();
    #up = new Button();
    #down = new Button();
    #a = new Button();
    #b = new Button();
    #menu = new Button();
    update(events) {
        this.#left.update(events.has("button_left"));
        this.#right.update(events.has("button_right"));
        this.#up.update(events.has("button_up"));
        this.#down.update(events.has("button_down"));
        this.#a.update(events.has("button_a"));
        this.#b.update(events.has("button_b"));
        this.#menu.update(events.has("button_menu"));
    }
    isAnyPressed() {
        return (this.#left.isPressed ||
            this.#right.isPressed ||
            this.#up.isPressed ||
            this.#down.isPressed ||
            this.#a.isPressed ||
            this.#b.isPressed ||
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
            case "a":
                return this.#a.isPressed;
            case "b":
                return this.#b.isPressed;
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
            case "a":
                this.#a.setRepeating(repeating);
                return;
            case "b":
                this.#b.setRepeating(repeating);
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
            this.#a.wasJustPressed ||
            this.#b.wasJustPressed ||
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
            case "a":
                return this.#a.wasJustPressed;
            case "b":
                return this.#b.wasJustPressed;
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
            case "a":
                return this.#a.wasJustReleased;
            case "b":
                return this.#b.wasJustReleased;
            case "menu":
                return this.#menu.wasJustReleased;
        }
    }
}
