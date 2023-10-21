import {
  b_,
  BpxSolidColor,
  spr_,
  transparent_,
  v_,
  v_0_0_,
} from "../../../src";

const spr = spr_("spritesheet.png");

const lime = BpxSolidColor.fromRgbCssHex("#a8e72e");

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
    k_esc: spr(128, 32, 13, 6),
    k_p: spr(144, 32, 5, 6),
    //
    k_m: spr(128, 40, 5, 6),
    k_f: spr(136, 40, 5, 6),
    k_semicolon: spr(152, 40, 5, 6),
    //
    g_ps_x: spr(128, 48, 5, 6),
    g_ps_triangle: spr(136, 48, 5, 6),
    g_menu: spr(144, 48, 5, 6),
    k_coma: spr(152, 48, 5, 6),
    //
    g_ps_circle: spr(128, 56, 5, 6),
    g_ps_square: spr(136, 56, 5, 6),
    g_ps_menu: spr(144, 56, 5, 6),
    k_period: spr(152, 56, 5, 6),
    //
    g_dpad_left: spr(128, 64, 15, 16),
    g_dpad_right: spr(144, 64, 15, 16),
    g_dpad_up: spr(128, 80, 15, 16),
    g_dpad_down: spr(144, 80, 15, 16),
    //
    g_stick_left: spr(128, 96, 13, 14),
    g_stick_right: spr(144, 96, 13, 14),
    g_stick_up: spr(128, 112, 13, 14),
    g_stick_down: spr(144, 112, 13, 14),
    //
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

  update(): void {
    const { ip } = this;

    ip.up = b_.__internal__capturedEvents().has("button_up");
    ip.down = b_.__internal__capturedEvents().has("button_down");
    ip.left = b_.__internal__capturedEvents().has("button_left");
    ip.right = b_.__internal__capturedEvents().has("button_right");
    ip.a = b_.__internal__capturedEvents().has("button_a");
    ip.b = b_.__internal__capturedEvents().has("button_b");
    ip.menu = b_.__internal__capturedEvents().has("button_menu");
    ip.muteUnmute = b_.__internal__capturedEvents().has("mute_unmute_toggle");
    ip.fullScreen = b_.__internal__capturedEvents().has("full_screen");
    ip.debugToggle = b_.__internal__capturedEvents().has("debug_toggle");
    ip.frameByFrameToggle = b_
      .__internal__capturedEvents()
      .has("frame_by_frame_toggle");
    ip.frameByFrameStep = b_
      .__internal__capturedEvents()
      .has("frame_by_frame_step");
  }

  draw() {
    const { ip, ps } = this;

    // background
    b_.sprite(spr(0, 0, 128, 128), v_0_0_);

    // pressed buttons
    const prevMapping = b_.mapSpriteColors([{ from: lime, to: transparent_ }]);
    if (ip.up) {
      b_.sprite(ps.k_w, v_(21, 17));
      b_.sprite(ps.k_up, v_(47, 17));
      b_.sprite(ps.g_dpad_up, v_(74, 16));
      b_.sprite(ps.g_stick_up, v_(97, 16));
    }
    if (ip.down) {
      b_.sprite(ps.k_s, v_(22, 24));
      b_.sprite(ps.k_down, v_(47, 24));
      b_.sprite(ps.g_dpad_down, v_(74, 16));
      b_.sprite(ps.g_stick_down, v_(97, 16));
    }
    if (ip.left) {
      b_.sprite(ps.k_a, v_(15, 24));
      b_.sprite(ps.k_left, v_(40, 24));
      b_.sprite(ps.g_dpad_left, v_(74, 16));
      b_.sprite(ps.g_stick_left, v_(97, 16));
    }
    if (ip.right) {
      b_.sprite(ps.k_d, v_(29, 24));
      b_.sprite(ps.k_right, v_(54, 24));
      b_.sprite(ps.g_dpad_right, v_(74, 16));
      b_.sprite(ps.g_stick_right, v_(97, 16));
    }
    if (ip.a) {
      b_.sprite(ps.k_c, v_(41, 41));
      b_.sprite(ps.k_j, v_(50, 41));
      b_.sprite(ps.g_a, v_(72, 41));
      b_.sprite(ps.g_y, v_(80, 41));
      b_.sprite(ps.g_ps_x, v_(93, 41));
      b_.sprite(ps.g_ps_square, v_(101, 41));
      // b_.sprite(ps.g_ps_x, v_(93, 41));
      // b_.sprite(ps.g_ps_circle, v_(93, 52));
      // b_.sprite(ps.g_ps_circle, v_(101, 41));
    }
    if (ip.b) {
      b_.sprite(ps.k_x, v_(41, 52));
      b_.sprite(ps.k_k, v_(50, 52));
      b_.sprite(ps.g_b, v_(72, 52));
      b_.sprite(ps.g_x, v_(80, 52));
      b_.sprite(ps.g_ps_circle, v_(93, 52));
      b_.sprite(ps.g_ps_triangle, v_(101, 52));
      // b_.sprite(ps.g_ps_square, v_(101, 52));
      // b_.sprite(ps.g_ps_triangle, v_(93, 52));
    }
    if (ip.menu) {
      b_.sprite(ps.k_esc, v_(24, 65));
      b_.sprite(ps.k_p, v_(41, 65));
      b_.sprite(ps.g_menu, v_(80, 65));
      b_.sprite(ps.g_ps_menu, v_(93, 65));
    }
    if (ip.muteUnmute) {
      b_.sprite(ps.k_m, v_(5, 85));
    }
    if (ip.fullScreen) {
      b_.sprite(ps.k_f, v_(5, 95));
    }
    if (ip.debugToggle) {
      b_.sprite(ps.k_semicolon, v_(118, 100));
    }
    if (ip.frameByFrameToggle) {
      b_.sprite(ps.k_coma, v_(118, 110));
    }
    if (ip.frameByFrameStep) {
      b_.sprite(ps.k_period, v_(118, 118));
    }
    b_.mapSpriteColors(prevMapping);
  }
}
