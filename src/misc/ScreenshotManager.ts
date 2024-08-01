import { HtmlTemplate } from "../HtmlTemplate";
import { ScopedLocaleStorage } from "../storage/ScopedLocaleStorage";

export type PersistedScreenshot = {
  imageDataUrl: string;
  timestamp: number;
};

export class ScreenshotManager {
  static readonly #storageKey = "screenshots";

  static readonly limit = 16;

  isBrowsing: boolean = false;

  constructor() {
    HtmlTemplate.updateScreenshotDownloadLinks(
      this.#loadPersistedScreenshots(),
    );
  }

  addScreenshot(imageDataUrl: string): void {
    const screenshots = this.#loadPersistedScreenshots();

    if (
      screenshots.unshift({ imageDataUrl, timestamp: Date.now() }) >
      ScreenshotManager.limit
    ) {
      screenshots.pop();
    }

    ScopedLocaleStorage.setItem(ScreenshotManager.#storageKey, screenshots);

    HtmlTemplate.updateScreenshotDownloadLinks(screenshots);
  }

  #loadPersistedScreenshots(): PersistedScreenshot[] {
    const maybeScreenshots = ScopedLocaleStorage.getItem(
      ScreenshotManager.#storageKey,
    );
    if (maybeScreenshots && Array.isArray(maybeScreenshots)) {
      return maybeScreenshots.slice(0, ScreenshotManager.limit);
    } else {
      ScopedLocaleStorage.removeItem(ScreenshotManager.#storageKey);
      return [];
    }
  }
}
