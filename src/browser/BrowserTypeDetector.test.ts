import { describe, expect, test } from "@jest/globals";
import { BpxBrowserType, BrowserTypeDetector } from "./BrowserTypeDetector";

describe("BrowserTypeDetector", () => {
  (
    [
      // macOS Ventura 13.5.2 (Apple M1 Max), Arc 1.13.1 (42579), Chromium Engine Version 118.0.5993.88
      [
        "chromium",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      ],
      // macOS Ventura 13.5.2 (Apple M1 Max), Brave 1.59.122 Chromium: 118.0.5993.96 (Official Build) (arm64)
      [
        "chromium",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      ],
      // macOS Ventura 13.5.2 (Apple M1 Max), Chrome 118.0.5993.96 (Official Build) (arm64)
      [
        "chromium",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.3",
      ],
      // macOS Ventura 13.5.2 (Apple M1 Max), Edge 118.0.2088.61 (Official build) (arm64)
      [
        "chromium",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.69",
      ],
      // macOS Ventura 13.5.2 (Apple M1 Max), Opera One (version: 103.0.4928.34) (arm64)
      [
        "chromium",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 OPR/103.0.0.0",
      ],
      // macOS Ventura 13.5.2 (Apple M1 Max), Vivaldi 6.2.3105.58 (Stable channel) (arm64)
      [
        "chromium",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      ],
      // macOS Ventura 13.5.2 (Apple M1 Max), Firefox 118.0.2 (64-bit)
      [
        "firefox",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0",
      ],
      // macOS Ventura 13.5.2 (Apple M1 Max), Safari 16.6 (18615.3.12.11.2)
      [
        "safari",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
      ],
      // Windows 10 Home 22H2 (Intel Core i7-3517U), Brave 1.59.120 Chromium: 118.0.5993.88 (Official Build) (64-bit)
      [
        "chromium",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      ],
      // Windows 10 Home 22H2 (Intel Core i7-3517U), Chrome 118.0.5993.89 (Official Build) (64-bit)
      [
        "chromium",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      ],
      // Windows 10 Home 22H2 (Intel Core i7-3517U), Edge 118.0.2088.57 (Official build) (64-bit)
      [
        "chromium",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61",
      ],
      // Windows 10 Home 22H2 (Intel Core i7-3517U), Opera One (version: 103.0.4928.34)
      [
        "chromium",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 OPR/103.0.0.0",
      ],
      // Windows 10 Home 22H2 (Intel Core i7-3517U), Vivaldi 6.2.3105.58 (Stable channel) (64-bit)
      [
        "chromium",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      ],
      // Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 118.0.2 (64-bit)
      [
        "firefox",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
      ],
      // Windows 10 Home 22H2 (Intel Core i7-3517U), Firefox 118.0.2 (64-bit)
      [
        "firefox",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
      ],
    ] as [BpxBrowserType, string][]
  ).forEach(([browserType, userAgent], index) => {
    test(`#detect (userAgent = [${index}] "${userAgent}")`, () => {
      expect(BrowserTypeDetector.detect(userAgent)).toBe(browserType);
    });
  });
});
