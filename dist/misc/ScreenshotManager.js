var _a;
import { HtmlTemplate } from "../HtmlTemplate";
import { ScopedLocaleStorage } from "../storage/ScopedLocaleStorage";
export class ScreenshotManager {
    static #storageKey = "screenshots";
    static limit = 16;
    isBrowsing = false;
    constructor() {
        HtmlTemplate.updateScreenshotDownloadLinks(this.#loadPersistedScreenshots());
    }
    addScreenshot(imageDataUrl) {
        const screenshots = this.#loadPersistedScreenshots();
        if (screenshots.unshift({ imageDataUrl, timestamp: Date.now() }) >
            _a.limit) {
            screenshots.pop();
        }
        ScopedLocaleStorage.setItem(_a.#storageKey, screenshots);
        HtmlTemplate.updateScreenshotDownloadLinks(screenshots);
    }
    #loadPersistedScreenshots() {
        const maybeScreenshots = ScopedLocaleStorage.getItem(_a.#storageKey);
        if (maybeScreenshots && Array.isArray(maybeScreenshots)) {
            return maybeScreenshots.slice(0, _a.limit);
        }
        else {
            ScopedLocaleStorage.removeItem(_a.#storageKey);
            return [];
        }
    }
}
_a = ScreenshotManager;
