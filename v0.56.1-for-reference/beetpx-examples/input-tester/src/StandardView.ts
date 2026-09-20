import {$x, $d, $rgb, $rgb_p8, $spr, $u, $v, $v_0_0, BpxPixels, BpxSpriteColorMapping,} from "@beetpx/beetpx";

const spr = $spr("spritesheet.png");

const lime = $rgb("#a8e72e");
const pink = $rgb("#ff77a8");
const yellow = $rgb("#f3ef7d");
const darkGreen = $rgb("#125359");
const darkBlue = $rgb("#1d2b53");
const lightGrey = $rgb("#c2c3c7");
const darkGrey = $rgb("#83769c");

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
        k_o: spr(5, 6, 128, 16),
        k_c: spr(5, 6, 134, 16),
        k_j: spr(5, 6, 140, 16),
        g_a: spr(5, 6, 146, 16),
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
        k_f: spr(5, 6, 134, 40),
        k_r_square_bracket: spr(5, 6, 140, 40),
        k_r_curly_bracket: spr(5, 6, 146, 40),
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
        O: false,
        X: false,
        menu: false,
        muteUnmute: false,
        fullScreen: false,
        takeScreenshot: false,
        browserScreenshots: false,
        debugToggle: false,
        frameByFrameToggle: false,
        frameByFrameStep: false,
    };

    private highlightKeyboard: boolean = false;
    private highlightGamepad: boolean = false;

    update(): void {
        const {ip} = this;

        const events = $x.getEventsCapturedInLastUpdate();
        ip.up = events.has("button_up");
        ip.down = events.has("button_down");
        ip.left = events.has("button_left");
        ip.right = events.has("button_right");
        ip.O = events.has("button_O");
        ip.X = events.has("button_X");
        ip.menu = events.has("button_menu");
        ip.muteUnmute = events.has("mute_unmute_toggle");
        ip.fullScreen = events.has("full_screen");
        ip.takeScreenshot = events.has("take_screenshot");
        ip.browserScreenshots = events.has("browse_screenshots_toggle");
        ip.debugToggle = events.has("debug_toggle");
        ip.frameByFrameToggle = events.has("frame_by_frame_toggle");
        ip.frameByFrameStep = events.has("frame_by_frame_step");

        if ($x.getRecentInputMethods().has("keyboard")) {
            this.highlightKeyboard = true;
            this.highlightGamepad = false;
        } else if ($x.getRecentInputMethods().has("gamepad")) {
            this.highlightKeyboard = false;
            this.highlightGamepad = true;
        }
    }

    draw() {
        const {ip, ps} = this;

        // background: base
        $d.sprite(spr(128, 128, 0, 0), $v_0_0);

        // background: keyboard vs gamepad
        let prevMapping = $d.setSpriteColorMapping(BpxSpriteColorMapping.from(
            this.highlightKeyboard
                ? [[pink, darkGreen]]
                : this.highlightGamepad
                    ? [[yellow, darkBlue]]
                    : [[pink, darkGreen], [yellow, darkBlue]]
        ));
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
        $d.removeClippingRegion();
        $d.setSpriteColorMapping(prevMapping);

        // pressed buttons
        prevMapping = $d.setSpriteColorMapping(
            BpxSpriteColorMapping.from([[lime, null]]),
        );
        if (ip.up) {
            $d.sprite(ps.k_w, $v(21, 12));
            $d.sprite(ps.k_up, $v(47, 12));
            $d.sprite(ps.g_dpad_up, $v(71, 11));
            $d.sprite(ps.g_stick_up, $v(95, 11));
        }
        if (ip.down) {
            $d.sprite(ps.k_s, $v(22, 19));
            $d.sprite(ps.k_down, $v(47, 19));
            $d.sprite(ps.g_dpad_down, $v(71, 11));
            $d.sprite(ps.g_stick_down, $v(95, 11));
        }
        if (ip.left) {
            $d.sprite(ps.k_a, $v(15, 19));
            $d.sprite(ps.k_left, $v(40, 19));
            $d.sprite(ps.g_dpad_left, $v(71, 11));
            $d.sprite(ps.g_stick_left, $v(95, 11));
        }
        if (ip.right) {
            $d.sprite(ps.k_d, $v(29, 19));
            $d.sprite(ps.k_right, $v(54, 19));
            $d.sprite(ps.g_dpad_right, $v(71, 11));
            $d.sprite(ps.g_stick_right, $v(95, 11));
        }
        if (ip.up && ip.left) {
            $d.sprite(ps.g_dpad_up_left, $v(71, 11));
            $d.sprite(ps.g_stick_up_left, $v(95, 11));
        }
        if (ip.up && ip.right) {
            $d.sprite(ps.g_dpad_up_right, $v(71, 11));
            $d.sprite(ps.g_stick_up_right, $v(95, 11));
        }
        if (ip.down && ip.left) {
            $d.sprite(ps.g_dpad_down_left, $v(71, 11));
            $d.sprite(ps.g_stick_down_left, $v(95, 11));
        }
        if (ip.down && ip.right) {
            $d.sprite(ps.g_dpad_down_right, $v(71, 11));
            $d.sprite(ps.g_stick_down_right, $v(95, 11));
        }
        if (ip.O) {
            $d.sprite(ps.k_o, $v(24, 34));
            $d.sprite(ps.k_c, $v(36, 34));
            $d.sprite(ps.k_j, $v(48, 34));
            $d.sprite(ps.g_a, $v(74, 34));
            $d.sprite(ps.g_y, $v(86, 34));
            $d.sprite(ps.g_dualsense_circle, $v(102, 34));
            $d.sprite(ps.g_dualsense_square, $v(114, 34));
        }
        if (ip.X) {
            $d.sprite(ps.k_x, $v(36, 48));
            $d.sprite(ps.k_k, $v(48, 48));
            $d.sprite(ps.g_b, $v(74, 48));
            $d.sprite(ps.g_x, $v(86, 48));
            $d.sprite(ps.g_dualsense_cross, $v(102, 48));
            $d.sprite(ps.g_dualsense_triangle, $v(114, 48));
        }
        if (ip.menu) {
            $d.sprite(ps.k_p, $v(8, 62));
            $d.sprite(ps.k_esc, $v(18, 62));
            $d.sprite(ps.k_enter, $v(36, 60));
            $d.sprite(ps.g_xbox_menu, $v(86, 62));
            $d.sprite(ps.g_ps_menu, $v(102, 62));
        }
        if (ip.muteUnmute) {
            $d.sprite(ps.k_m, $v(5, 77));
        }
        if (ip.fullScreen) {
            $d.sprite(ps.k_f, $v(5, 86));
        }
        if (ip.takeScreenshot) {
            $d.sprite(ps.k_r_square_bracket, $v(5, 95));
        }
        if (ip.browserScreenshots) {
            $d.sprite(ps.k_r_curly_bracket, $v(5, 102));
        }
        if (ip.debugToggle) {
            $d.sprite(ps.k_semicolon, $v(118, 102));
        }
        if (ip.frameByFrameToggle) {
            $d.sprite(ps.k_coma, $v(118, 111));
        }
        if (ip.frameByFrameStep) {
            $d.sprite(ps.k_period, $v(118, 118));
        }
        $d.setSpriteColorMapping(prevMapping);

        // tiny animation below "frame-by"frame" label, so we can actually test if the frame-by-frame mode works OK
        $d.pixels(
            BpxPixels.from(`#\n#`),
            $v(61 + 0.5 * (1 + $u.trigSin($x.frameNumber / 120)) * (113 - 59), 117),
            $rgb("#7e2553"),
        );
    }
}
