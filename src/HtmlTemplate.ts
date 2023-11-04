export class HtmlTemplate {
  static readonly selectors = {
    fullScreenSubject: "body",
    canvas: "#game_canvas",

    touchControls: ".touch_control",

    controlsLeft: "#dpad_l",
    controlsRight: "#dpad_r",
    controlsUp: "#dpad_u",
    controlsDown: "#dpad_d",
    controlsUpLeft: "#dpad_ul",
    controlsUpRight: "#dpad_ur",
    controlsDownLeft: "#dpad_dl",
    controlsDownRight: "#dpad_dr",
    controlsA: "#button_a",
    controlsB: "#button_b",
    controlsMenu: "#button_menu",

    controlsFullScreen: "#button_fullscreen",
    controlsMuteToggle: "#button_mute",
  };

  static updateDebugClass(isDebug: boolean): void {
    document.body.classList[isDebug ? "add" : "remove"]("debug");
  }

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
  }): void {
    document.body.classList[isPressed.up ? "add" : "remove"]("pressed_u");
    document.body.classList[isPressed.down ? "add" : "remove"]("pressed_d");
    document.body.classList[isPressed.left ? "add" : "remove"]("pressed_l");
    document.body.classList[isPressed.right ? "add" : "remove"]("pressed_r");
    document.body.classList[isPressed.a ? "add" : "remove"]("pressed_a");
    document.body.classList[isPressed.b ? "add" : "remove"]("pressed_b");
    document.body.classList[isPressed.menu ? "add" : "remove"]("pressed_menu");
    document.body.classList[isPressed.mute ? "add" : "remove"]("pressed_mute");
    document.body.classList[isPressed.fullscreen ? "add" : "remove"](
      "pressed_fullscreen",
    );
  }
}
