// TODO: rework HTML and selectors

import { u_ } from "./Utils";

export class HtmlTemplate {
  static #gameDisplay: Element | undefined;

  static readonly selectors = {
    fullScreenSubject: "body",
    canvas: "#game_canvas",
    gameDisplay: "#game_display",

    touchControls: ".touch_control",

    controlsLeft: "#dpad_l",
    controlsRight: "#dpad_r",
    controlsUp: "#dpad_u",
    controlsDown: "#dpad_d",
    controlsA: "#button_a",
    controlsB: "#button_b",
    controlsMenu: "#button_menu",

    controlsFullScreen: "#button_fullscreen",
    controlsMuteToggle: "#button_mute",
  };

  static readonly classes = {
    // TODO: ??? REIMPLEMENT
    canvasDebugBorder: "debug",

    // TODO: ??? REIMPLEMENT
    appLoaded: "game_loaded",
  };

  static updatePressedClasses(isPressed: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    a: boolean;
    b: boolean;
    menu: boolean;
    mute: boolean;
    fullscreen: boolean;
  }) {
    if (!HtmlTemplate.#gameDisplay) {
      HtmlTemplate.#gameDisplay =
        document.querySelectorAll(HtmlTemplate.selectors.gameDisplay)[0] ??
        u_.throwError(
          `Was unable to locale a game display under selector "${HtmlTemplate.selectors.gameDisplay}"`,
        );
    }

    if (isPressed.up) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_u");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_u");
    }
    if (isPressed.down) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_d");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_d");
    }
    if (isPressed.left) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_l");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_l");
    }
    if (isPressed.right) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_r");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_r");
    }
    if (isPressed.a) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_a");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_a");
    }
    if (isPressed.b) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_b");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_b");
    }
    if (isPressed.menu) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_menu");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_menu");
    }
    if (isPressed.mute) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_mute");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_mute");
    }
    if (isPressed.fullscreen) {
      HtmlTemplate.#gameDisplay?.classList.add("pressed_fullscreen");
    } else {
      HtmlTemplate.#gameDisplay?.classList.remove("pressed_fullscreen");
    }
  }
}
