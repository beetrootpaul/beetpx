export class BrowserTypeDetector {
    static detect(userAgent) {
        var _a;
        const ua = (_a = userAgent === null || userAgent === void 0 ? void 0 : userAgent.toLowerCase()) !== null && _a !== void 0 ? _a : "";
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
