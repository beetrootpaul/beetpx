import {
  b_,
  BpxRgbColor,
  BpxSpriteColorMapping,
  spr_,
  v_,
  v_0_0_,
} from "../../../src";

const spr = spr_("spritesheet.png");

const lime = BpxRgbColor.fromCssHex("#a8e72e");
const pink = BpxRgbColor.fromCssHex("#ff77a8");
const yellow = BpxRgbColor.fromCssHex("#f3ef7d");
const darkGreen = BpxRgbColor.fromCssHex("#125359");
const darkBlue = BpxRgbColor.fromCssHex("#1d2b53");
const lightGrey = BpxRgbColor.fromCssHex("#c2c3c7");
const darkGrey = BpxRgbColor.fromCssHex("#83769c");

export class StandardView {
  // ps = pressed sprite
  // k_ = keyboard
  // g_ = gamepad
  private readonly ps = {
    k_w: spr(128, 0, 5, 6),
    k_s: spr(136, 0, 5, 6),
    k_up: spr(144, 0, 5, 6),
    k_down: spr(152, 0, 5, 6),
    //
    k_a: spr(128, 8, 5, 6),
    k_d: spr(136, 8, 5, 6),
    k_left: spr(144, 8, 5, 6),
    k_right: spr(152, 8, 5, 6),
    //
    k_c: spr(128, 16, 5, 6),
    k_j: spr(136, 16, 5, 6),
    g_a: spr(144, 16, 5, 6),
    g_y: spr(152, 16, 5, 6),
    //
    k_x: spr(128, 24, 5, 6),
    k_k: spr(136, 24, 5, 6),
    g_b: spr(144, 24, 5, 6),
    g_x: spr(152, 24, 5, 6),
    //
    k_p: spr(144, 32, 5, 6),
    k_esc: spr(128, 32, 13, 6),
    k_enter: spr(149, 30, 8, 10),
    //
    k_m: spr(128, 40, 5, 6),
    k_f: spr(136, 40, 5, 6),
    k_semicolon: spr(152, 40, 5, 6),
    //
    g_dualsense_cross: spr(128, 48, 5, 6),
    g_dualsense_triangle: spr(136, 48, 5, 6),
    g_xbox_menu: spr(144, 48, 5, 6),
    k_coma: spr(152, 48, 5, 6),
    //
    g_dualsense_circle: spr(128, 56, 5, 6),
    g_dualsense_square: spr(136, 56, 5, 6),
    g_ps_menu: spr(144, 56, 5, 6),
    k_period: spr(152, 56, 5, 6),
    //
    g_dpad_left: spr(128, 64, 15, 16),
    g_dpad_right: spr(144, 64, 15, 16),
    g_dpad_up: spr(128, 80, 15, 16),
    g_dpad_down: spr(144, 80, 15, 16),
    //
    g_dpad_up_left: spr(128, 96, 15, 16),
    g_dpad_up_right: spr(144, 96, 15, 16),
    g_dpad_down_left: spr(128, 112, 15, 16),
    g_dpad_down_right: spr(144, 112, 15, 16),
    //
    g_stick_left: spr(288, 0, 13, 14),
    g_stick_right: spr(304, 0, 13, 14),
    g_stick_up: spr(288, 16, 13, 14),
    g_stick_down: spr(304, 16, 13, 14),
    //
    g_stick_up_left: spr(288, 32, 13, 14),
    g_stick_up_right: spr(304, 32, 13, 14),
    g_stick_down_left: spr(288, 48, 13, 14),
    g_stick_down_right: spr(304, 48, 13, 14),
  };

  // ip = is pressed
  private readonly ip = {
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
    menu: false,
    muteUnmute: false,
    fullScreen: false,
    debugToggle: false,
    frameByFrameToggle: false,
    frameByFrameStep: false,
  };

  private highlightKeyboard: boolean = true;

  update(): void {
    const { ip } = this;

    const events = b_.getEventsCapturedInLastUpdate();
    ip.up = events.has("button_up");
    ip.down = events.has("button_down");
    ip.left = events.has("button_left");
    ip.right = events.has("button_right");
    ip.a = events.has("button_a");
    ip.b = events.has("button_b");
    ip.menu = events.has("button_menu");
    ip.muteUnmute = events.has("mute_unmute_toggle");
    ip.fullScreen = events.has("full_screen");
    ip.debugToggle = events.has("debug_toggle");
    ip.frameByFrameToggle = events.has("frame_by_frame_toggle");
    ip.frameByFrameStep = events.has("frame_by_frame_step");

    if (b_.getRecentInputMethods().has("keyboard")) {
      this.highlightKeyboard = true;
    } else if (b_.getRecentInputMethods().has("gamepad")) {
      this.highlightKeyboard = false;
    }
  }

  draw() {
    const { ip, ps } = this;

    // background: base
    b_.drawSprite(spr(0, 0, 128, 128), v_0_0_);

    // background: keyboard vs gamepad
    let prevMapping = b_.setSpriteColorMapping(
      this.highlightKeyboard
        ? BpxSpriteColorMapping.from([[pink, darkGreen]])
        : BpxSpriteColorMapping.from([[yellow, darkBlue]]),
    );
    b_.setClippingRegion(v_(0, 0), v_(128, 3));
    b_.drawSprite(spr(0, 0, 128, 128), v_0_0_);
    b_.setClippingRegion(v_(126, 0), v_(126, 128));
    b_.drawSprite(spr(0, 0, 128, 128), v_0_0_);
    b_.setClippingRegion(v_(0, 126), v_(128, 128));
    b_.drawSprite(spr(0, 0, 128, 128), v_0_0_);
    b_.setClippingRegion(v_(0, 0), v_(2, 128));
    b_.drawSprite(spr(0, 0, 128, 128), v_0_0_);
    b_.setClippingRegion(v_(64, 77), v_(64, 6));
    b_.drawSprite(spr(0, 0, 128, 128), v_0_0_);
    b_.setSpriteColorMapping(prevMapping);
    prevMapping = b_.setSpriteColorMapping(
      BpxSpriteColorMapping.from([[lightGrey, darkGrey]]),
    );
    b_.setClippingRegion(
      this.highlightKeyboard ? v_(110, 3) : v_(3, 3),
      v_(15, 11),
    );
    b_.drawSprite(spr(0, 0, 128, 128), v_0_0_);
    b_.removeClippingRegion();
    b_.setSpriteColorMapping(prevMapping);

    // pressed buttons
    prevMapping = b_.setSpriteColorMapping(
      BpxSpriteColorMapping.from([[lime, null]]),
    );
    if (ip.up) {
      b_.drawSprite(ps.k_w, v_(21, 17));
      b_.drawSprite(ps.k_up, v_(47, 17));
      b_.drawSprite(ps.g_dpad_up, v_(74, 16));
      b_.drawSprite(ps.g_stick_up, v_(97, 16));
    }
    if (ip.down) {
      b_.drawSprite(ps.k_s, v_(22, 24));
      b_.drawSprite(ps.k_down, v_(47, 24));
      b_.drawSprite(ps.g_dpad_down, v_(74, 16));
      b_.drawSprite(ps.g_stick_down, v_(97, 16));
    }
    if (ip.left) {
      b_.drawSprite(ps.k_a, v_(15, 24));
      b_.drawSprite(ps.k_left, v_(40, 24));
      b_.drawSprite(ps.g_dpad_left, v_(74, 16));
      b_.drawSprite(ps.g_stick_left, v_(97, 16));
    }
    if (ip.right) {
      b_.drawSprite(ps.k_d, v_(29, 24));
      b_.drawSprite(ps.k_right, v_(54, 24));
      b_.drawSprite(ps.g_dpad_right, v_(74, 16));
      b_.drawSprite(ps.g_stick_right, v_(97, 16));
    }
    if (ip.up && ip.left) {
      b_.drawSprite(ps.g_dpad_up_left, v_(74, 16));
      b_.drawSprite(ps.g_stick_up_left, v_(97, 16));
    }
    if (ip.up && ip.right) {
      b_.drawSprite(ps.g_dpad_up_right, v_(74, 16));
      b_.drawSprite(ps.g_stick_up_right, v_(97, 16));
    }
    if (ip.down && ip.left) {
      b_.drawSprite(ps.g_dpad_down_left, v_(74, 16));
      b_.drawSprite(ps.g_stick_down_left, v_(97, 16));
    }
    if (ip.down && ip.right) {
      b_.drawSprite(ps.g_dpad_down_right, v_(74, 16));
      b_.drawSprite(ps.g_stick_down_right, v_(97, 16));
    }
    if (ip.a) {
      b_.drawSprite(ps.k_c, v_(37, 40));
      b_.drawSprite(ps.k_j, v_(49, 40));
      b_.drawSprite(ps.g_a, v_(73, 40));
      b_.drawSprite(ps.g_y, v_(84, 40));
      b_.drawSprite(ps.g_dualsense_cross, v_(100, 40));
      b_.drawSprite(ps.g_dualsense_triangle, v_(111, 40));
    }
    if (ip.b) {
      b_.drawSprite(ps.k_x, v_(37, 51));
      b_.drawSprite(ps.k_k, v_(49, 51));
      b_.drawSprite(ps.g_b, v_(73, 51));
      b_.drawSprite(ps.g_x, v_(84, 51));
      b_.drawSprite(ps.g_dualsense_circle, v_(100, 51));
      b_.drawSprite(ps.g_dualsense_square, v_(111, 51));
    }
    if (ip.menu) {
      b_.drawSprite(ps.k_p, v_(6, 65));
      b_.drawSprite(ps.k_esc, v_(16, 65));
      b_.drawSprite(ps.k_enter, v_(34, 61));
      b_.drawSprite(ps.g_xbox_menu, v_(84, 65));
      b_.drawSprite(ps.g_ps_menu, v_(100, 65));
    }
    if (ip.muteUnmute) {
      b_.drawSprite(ps.k_m, v_(5, 85));
    }
    if (ip.fullScreen) {
      b_.drawSprite(ps.k_f, v_(5, 95));
    }
    if (ip.debugToggle) {
      b_.drawSprite(ps.k_semicolon, v_(118, 100));
    }
    if (ip.frameByFrameToggle) {
      b_.drawSprite(ps.k_coma, v_(118, 110));
    }
    if (ip.frameByFrameStep) {
      b_.drawSprite(ps.k_period, v_(118, 118));
    }
    b_.setSpriteColorMapping(prevMapping);
  }
}
