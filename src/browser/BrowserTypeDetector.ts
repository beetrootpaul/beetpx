/**
 * The list of browser types the engine detects. It is tightly related to the
 * gamepad mapping resolution.
 *
 * @see {@link BeetPx.detectedBrowserType}
 *
 * @category Miscellaneous
 */
export type BpxBrowserType =
  | "chromium"
  | "firefox_windows"
  | "firefox_other"
  | "safari"
  | "other";

export class BrowserTypeDetector {
  static detect(userAgent: string | undefined): BpxBrowserType {
    const ua = userAgent?.toLowerCase() ?? "";
    if (ua.includes("firefox")) {
      // We need to differentiate Firefox on Windows, because DualSense
      //   controller mapping is even worse there than on macOS.
      return ua.includes("win64") ? "firefox_windows" : "firefox_other";
    }
    if (ua.includes("chrome")) return "chromium";
    if (ua.includes("safari")) return "safari";
    return "other";
  }
}
