// TODO: rework HTML and selectors

export class HtmlTemplate {
  static readonly selectors = {
    fullScreenSubject: "body",
    canvas: "#game_canvas",

    touchControls: ".touch_control",

    controlsLeft: "#dpad_left",
    controlsRight: "#dpad_right",
    controlsUp: "#dpad_up",
    controlsDown: "#dpad_down",
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
}
