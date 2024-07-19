import {
  $,
  $d,
  $spr,
  $v,
  $v_0_0,
  BpxRgbColor,
  BpxSpriteColorMapping,
} from "../../../src";

const spr = $spr("spritesheet.png");

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
    k_w: spr(5, 6, 128, 0),
    k_s: spr(5, 6, 136, 0),
    k_up: spr(5, 6, 144, 0),
    k_down: spr(5, 6, 152, 0),
    //
    k_a: spr(5, 6, 128, 8),
    k_d: spr(5, 6, 136, 8),
    k_left: spr(5, 6, 144, 8),
    k_right: spr(5, 6, 152, 8),
    //
    k_c: spr(5, 6, 128, 16),
    k_j: spr(5, 6, 136, 16),
    g_a: spr(5, 6, 144, 16),
    g_y: spr(5, 6, 152, 16),
    //
    k_x: spr(5, 6, 128, 24),
    k_k: spr(5, 6, 136, 24),
    g_b: spr(5, 6, 144, 24),
    g_x: spr(5, 6, 152, 24),
    //
    k_p: spr(5, 6, 144, 32),
    k_esc: spr(13, 6, 128, 32),
    k_enter: spr(8, 10, 149, 30),
    //
    k_m: spr(5, 6, 128, 40),
    k_f: spr(5, 6, 136, 40),
    k_semicolon: spr(5, 6, 152, 40),
    //
    g_dualsense_cross: spr(5, 6, 128, 48),
    g_dualsense_triangle: spr(5, 6, 136, 48),
    g_xbox_menu: spr(5, 6, 144, 48),
    k_coma: spr(5, 6, 152, 48),
    //
    g_dualsense_circle: spr(5, 6, 128, 56),
    g_dualsense_square: spr(5, 6, 136, 56),
    g_ps_menu: spr(5, 6, 144, 56),
    k_period: spr(5, 6, 152, 56),
    //
    g_dpad_left: spr(15, 16, 128, 64),
    g_dpad_right: spr(15, 16, 144, 64),
    g_dpad_up: spr(15, 16, 128, 80),
    g_dpad_down: spr(15, 16, 144, 80),
    //
    g_dpad_up_left: spr(15, 16, 128, 96),
    g_dpad_up_right: spr(15, 16, 144, 96),
    g_dpad_down_left: spr(15, 16, 128, 112),
    g_dpad_down_right: spr(15, 16, 144, 112),
    //
    g_stick_left: spr(13, 14, 288, 0),
    g_stick_right: spr(13, 14, 304, 0),
    g_stick_up: spr(13, 14, 288, 16),
    g_stick_down: spr(13, 14, 304, 16),
    //
    g_stick_up_left: spr(13, 14, 288, 32),
    g_stick_up_right: spr(13, 14, 304, 32),
    g_stick_down_left: spr(13, 14, 288, 48),
    g_stick_down_right: spr(13, 14, 304, 48),
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

    const events = $.getEventsCapturedInLastUpdate();
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

    if ($.getRecentInputMethods().has("keyboard")) {
      this.highlightKeyboard = true;
    } else if ($.getRecentInputMethods().has("gamepad")) {
      this.highlightKeyboard = false;
    }
  }

  draw() {
    const { ip, ps } = this;

    // background: base
    $d.sprite(spr(128, 128, 0, 0), $v_0_0);

    // background: keyboard vs gamepad
    let prevMapping = $d.setSpriteColorMapping(
      this.highlightKeyboard
        ? BpxSpriteColorMapping.from([[pink, darkGreen]])
        : BpxSpriteColorMapping.from([[yellow, darkBlue]]),
    );
    $d.setClippingRegion($v(0, 0), $v(128, 3));
    $d.sprite(spr(128, 128, 0, 0), $v_0_0);
    $d.setClippingRegion($v(126, 0), $v(126, 128));
    $d.sprite(spr(128, 128, 0, 0), $v_0_0);
    $d.setClippingRegion($v(0, 126), $v(128, 128));
    $d.sprite(spr(128, 128, 0, 0), $v_0_0);
    $d.setClippingRegion($v(0, 0), $v(2, 128));
    $d.sprite(spr(128, 128, 0, 0), $v_0_0);
    $d.setClippingRegion($v(64, 77), $v(64, 6));
    $d.sprite(spr(128, 128, 0, 0), $v_0_0);
    $d.setSpriteColorMapping(prevMapping);
    prevMapping = $d.setSpriteColorMapping(
      BpxSpriteColorMapping.from([[lightGrey, darkGrey]]),
    );
    $d.setClippingRegion(
      this.highlightKeyboard ? $v(110, 3) : $v(3, 3),
      $v(15, 11),
    );
    $d.sprite(spr(128, 128, 0, 0), $v_0_0);
    $d.removeClippingRegion();
    $d.setSpriteColorMapping(prevMapping);

    // pressed buttons
    prevMapping = $d.setSpriteColorMapping(
      BpxSpriteColorMapping.from([[lime, null]]),
    );
    if (ip.up) {
      $d.sprite(ps.k_w, $v(21, 17));
      $d.sprite(ps.k_up, $v(47, 17));
      $d.sprite(ps.g_dpad_up, $v(74, 16));
      $d.sprite(ps.g_stick_up, $v(97, 16));
    }
    if (ip.down) {
      $d.sprite(ps.k_s, $v(22, 24));
      $d.sprite(ps.k_down, $v(47, 24));
      $d.sprite(ps.g_dpad_down, $v(74, 16));
      $d.sprite(ps.g_stick_down, $v(97, 16));
    }
    if (ip.left) {
      $d.sprite(ps.k_a, $v(15, 24));
      $d.sprite(ps.k_left, $v(40, 24));
      $d.sprite(ps.g_dpad_left, $v(74, 16));
      $d.sprite(ps.g_stick_left, $v(97, 16));
    }
    if (ip.right) {
      $d.sprite(ps.k_d, $v(29, 24));
      $d.sprite(ps.k_right, $v(54, 24));
      $d.sprite(ps.g_dpad_right, $v(74, 16));
      $d.sprite(ps.g_stick_right, $v(97, 16));
    }
    if (ip.up && ip.left) {
      $d.sprite(ps.g_dpad_up_left, $v(74, 16));
      $d.sprite(ps.g_stick_up_left, $v(97, 16));
    }
    if (ip.up && ip.right) {
      $d.sprite(ps.g_dpad_up_right, $v(74, 16));
      $d.sprite(ps.g_stick_up_right, $v(97, 16));
    }
    if (ip.down && ip.left) {
      $d.sprite(ps.g_dpad_down_left, $v(74, 16));
      $d.sprite(ps.g_stick_down_left, $v(97, 16));
    }
    if (ip.down && ip.right) {
      $d.sprite(ps.g_dpad_down_right, $v(74, 16));
      $d.sprite(ps.g_stick_down_right, $v(97, 16));
    }
    if (ip.a) {
      $d.sprite(ps.k_c, $v(37, 40));
      $d.sprite(ps.k_j, $v(49, 40));
      $d.sprite(ps.g_a, $v(73, 40));
      $d.sprite(ps.g_y, $v(84, 40));
      $d.sprite(ps.g_dualsense_cross, $v(100, 40));
      $d.sprite(ps.g_dualsense_triangle, $v(111, 40));
    }
    if (ip.b) {
      $d.sprite(ps.k_x, $v(37, 51));
      $d.sprite(ps.k_k, $v(49, 51));
      $d.sprite(ps.g_b, $v(73, 51));
      $d.sprite(ps.g_x, $v(84, 51));
      $d.sprite(ps.g_dualsense_circle, $v(100, 51));
      $d.sprite(ps.g_dualsense_square, $v(111, 51));
    }
    if (ip.menu) {
      $d.sprite(ps.k_p, $v(6, 65));
      $d.sprite(ps.k_esc, $v(16, 65));
      $d.sprite(ps.k_enter, $v(34, 61));
      $d.sprite(ps.g_xbox_menu, $v(84, 65));
      $d.sprite(ps.g_ps_menu, $v(100, 65));
    }
    if (ip.muteUnmute) {
      $d.sprite(ps.k_m, $v(5, 85));
    }
    if (ip.fullScreen) {
      $d.sprite(ps.k_f, $v(5, 95));
    }
    if (ip.debugToggle) {
      $d.sprite(ps.k_semicolon, $v(118, 100));
    }
    if (ip.frameByFrameToggle) {
      $d.sprite(ps.k_coma, $v(118, 110));
    }
    if (ip.frameByFrameStep) {
      $d.sprite(ps.k_period, $v(118, 118));
    }
    $d.setSpriteColorMapping(prevMapping);
  }
}
