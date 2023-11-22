export class BrowserTypeDetector {
    static detect(userAgent) {
        const ua = userAgent?.toLowerCase() ?? "";
        if (ua.includes("firefox")) {
            
            
            return ua.includes("win64") ? "firefox_windows" : "firefox_other";
        }
        if (ua.includes("chrome"))
            return "chromium";
        if (ua.includes("safari"))
            return "safari";
        return "other";
    }
}
