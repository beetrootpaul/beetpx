import { decode as fastPngDecode, type DecodedPng } from "fast-png";
import { BpxRgbColor } from "../color/RgbColor";
import { BpxFont } from "../font/Font";
import { Assets, BpxImageUrl, BpxJsonUrl, BpxSoundUrl } from "./Assets";

export type AssetsToLoad = {
  images: ImageAssetToLoad[];
  fonts: FontAssetToLoad[];
  sounds: SoundAssetToLoad[];
  jsons: JsonAssetToLoad[];
};

type ImageAssetToLoad = {
  url: BpxImageUrl;
};

type FontAssetToLoad = {
  font: BpxFont;
  spriteTextColor: BpxRgbColor | null;
};

type SoundAssetToLoad = {
  url: BpxSoundUrl;
};

type JsonAssetToLoad = {
  url: BpxJsonUrl;
};

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
    assetsToLoad.fonts.forEach(({ font, spriteTextColor }) => {
      this.#assets.addFontAsset(font.id, {
        font,
        spriteTextColor,
      });
    });

    const uniqueImageUrls = new Set(assetsToLoad.images.map(({ url }) => url));
    for (const { font } of assetsToLoad.fonts) {
      if (font.imageUrl != null) {
        uniqueImageUrls.add(font.imageUrl);
      }
    }

    await Promise.all([
      ...Array.from(uniqueImageUrls).map((url) => this.#loadImage(url)),
      ...assetsToLoad.sounds.map(async ({ url }) => this.#loadSound(url)),
      ...assetsToLoad.jsons.map(async ({ url }) => this.#loadJson(url)),
    ]);
  }

  async #loadImage(url: BpxImageUrl): Promise<void> {
    if (!url.toLowerCase().endsWith(".png")) {
      throw Error(
        `Assets: only PNG image files are supported. The file which doesn't seem to be PNG: "${url}"`,
      );
    }

    const httpResponse = await fetch(url);
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
    if (
      !url.toLowerCase().endsWith(".wav") &&
      !url.toLowerCase().endsWith(".flac")
    ) {
      throw Error(
        `Assets: only wav and flac sound files are supported due to Safari compatibility. The file which doesn't seem to be neither wav nor flac: "${url}"`,
      );
    }
    const httpResponse = await fetch(url);
    if (!this.#is2xx(httpResponse.status)) {
      throw Error(`Assets: could not fetch sound file: "${url}"`);
    }
    const arrayBuffer = await httpResponse.arrayBuffer();
    const audioBuffer = await this.#decodeAudioData(arrayBuffer);
    this.#assets.addSoundAsset(url, { audioBuffer });
  }

  async #loadJson(url: BpxJsonUrl): Promise<void> {
    const httpResponse = await fetch(url);
    if (!this.#is2xx(httpResponse.status)) {
      throw Error(`Assets: could not fetch JSON file: "${url}"`);
    }
    const json = await httpResponse.json();
    this.#assets.addJsonAsset(url, { json });
  }

  #is2xx(httpStatus: number): boolean {
    return httpStatus >= 200 && httpStatus < 300;
  }
}
