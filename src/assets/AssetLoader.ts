import { decode as fastPngDecode, type DecodedPng } from "fast-png";
import { Logger } from "../logger/Logger";
import { Assets, BpxImageUrl, BpxJsonUrl, BpxSoundUrl } from "./Assets";

export type AssetsToLoad = Array<BpxImageUrl | BpxSoundUrl | BpxJsonUrl>;

export class AssetLoader {
  readonly #assets: Assets;
  readonly #decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;

  constructor(
    assets: Assets,
    params: {
      decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;
    },
  ) {
    this.#assets = assets;
    this.#decodeAudioData = params.decodeAudioData;
  }

  async loadAssets(assetsToLoad: AssetsToLoad): Promise<void> {
    const normalizedAssetsToLoad: AssetsToLoad = assetsToLoad
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const unrecognizedAssetFormats = normalizedAssetsToLoad.filter(
      url => !this.#isImage(url) && !this.#isSound(url) && !this.#isJson(url),
    );
    if (unrecognizedAssetFormats.length > 0) {
      throw Error(
        "Assets: following URLs don't look like any of supported formats: " +
          unrecognizedAssetFormats.map(url => `"${url}"`).join(", ") +
          '. Supported formats are: ".png", ".wav", ".flac", ".json", ".ldtk"',
      );
    }

    await Promise.all([
      ...normalizedAssetsToLoad
        .filter(url => this.#isImage(url))
        .map(url => this.#loadImage(url)),
      ...normalizedAssetsToLoad
        .filter(url => this.#isSound(url))
        .map(url => this.#loadSound(url)),
      ...normalizedAssetsToLoad
        .filter(url => this.#isJson(url))
        .map(url => this.#loadJson(url)),
    ]);
  }

  #isImage(url: BpxImageUrl): boolean {
    return url.toLowerCase().endsWith(".png");
  }

  #isSound(url: BpxSoundUrl): boolean {
    return (
      url.toLowerCase().endsWith(".wav") || url.toLowerCase().endsWith(".flac")
    );
  }

  #isJson(url: BpxJsonUrl): boolean {
    return (
      url.toLowerCase().endsWith(".json") || url.toLowerCase().endsWith(".ldtk")
    );
  }

  async #loadImage(url: BpxImageUrl): Promise<void> {
    Logger.infoBeetPx(`Assets: loading image "${url}"`);

    const httpResponse = await fetch(this.#withPathFixed(url));
    if (!this.#is2xx(httpResponse.status)) {
      throw Error(`Assets: could not fetch PNG file: "${url}"`);
    }
    const arrayBuffer = await httpResponse.arrayBuffer();

    // You might be surprised why do we use "fast-png" for PNG decoding instead of
    //   a more popular solution of:
    //     ```
    //       const htmlImage = new Image();
    //       htmlImage.src = url;
    //       await htmlImage.decode();
    //       const canvas = document.createElement("canvas");
    //       canvas.width = htmlImage.naturalWidth;
    //       canvas.height = htmlImage.naturalHeight;
    //       const ctx = canvas.getContext("2d")!;
    //       ctx.drawImage(htmlImage, 0, 0);
    //       const imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //       return imageData.data;
    //     ```
    //   This is because such approach was prone to browser's color management features.
    //   In particular, we had a case of Firefox on Window 10 on an old Zenbook laptop, which
    //     was adjusting rendered colors. We were able to overcome it by setting
    //     `gfx.color_management.native_srgb` to `true` on `about:config` page of that
    //     particular browser. But still, it would require users to modify their browser config.
    //  Moreover, you might wonder why is it a problem that some colors are slightly adjusted?
    //    It wouldn't be a problem if not for a sprite color mapping. If we define in BeetPx
    //    that we want to map, let's say, lime background into a transparency, then we
    //    need that lime to be exactly same RGB hex as defined in the color mapping, otherwise
    //    it will not get mapped and display as lime.
    const decodedPng: DecodedPng = fastPngDecode(arrayBuffer);

    if (decodedPng.channels !== 3 && decodedPng.channels !== 4) {
      throw Error(
        `Assets: only PNG image files with 3 or 4 channels are supported. The file which seems to have ${decodedPng.channels} channels instead: "${url}"`,
      );
    }

    this.#assets.addImageAsset(url, {
      width: decodedPng.width,
      height: decodedPng.height,
      channels: decodedPng.channels,
      rgba8bitData: decodedPng.data,
    });
  }

  async #loadSound(url: BpxSoundUrl): Promise<void> {
    Logger.infoBeetPx(`Assets: loading sound "${url}"`);

    const httpResponse = await fetch(this.#withPathFixed(url));
    if (!this.#is2xx(httpResponse.status)) {
      throw Error(`Assets: could not fetch sound file: "${url}"`);
    }
    const arrayBuffer = await httpResponse.arrayBuffer();
    const audioBuffer = await this.#decodeAudioData(arrayBuffer);
    this.#assets.addSoundAsset(url, { audioBuffer });
  }

  async #loadJson(url: BpxJsonUrl): Promise<void> {
    Logger.infoBeetPx(`Assets: loading JSON "${url}"`);

    const httpResponse = await fetch(this.#withPathFixed(url));
    if (!this.#is2xx(httpResponse.status)) {
      throw Error(`Assets: could not fetch JSON file: "${url}"`);
    }
    const json = await httpResponse.json();
    this.#assets.addJsonAsset(url, { json });
  }

  #withPathFixed(url: string): string {
    return (
        url.startsWith("/") ||
          url.startsWith("http://") ||
          url.startsWith("https://")
      ) ?
        url
      : `/${url}`;
  }

  #is2xx(httpStatus: number): boolean {
    return httpStatus >= 200 && httpStatus < 300;
  }
}
