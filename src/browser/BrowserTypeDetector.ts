export type BpxBrowserType = "chromium" | "firefox" | "safari" | "other";

export class BrowserTypeDetector {
  static detect(userAgent: string | undefined): BpxBrowserType {
    const ua = userAgent?.toLowerCase() ?? "";
    if (ua.includes("firefox")) return "firefox";
    if (ua.includes("chrome")) return "chromium";
    if (ua.includes("safari")) return "safari";
    return "other";
  }
}
