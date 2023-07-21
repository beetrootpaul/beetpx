import { SolidColor } from "./Color";
import { Font } from "./font/Font";
import { Utils } from "./Utils";

export type AssetsToLoad = {
  images: ImageAssetToLoad[];
  fonts: FontAssetToLoad[];
  sounds: SoundAssetToLoad[];
};

export type ImageUrl = string;
export type SoundUrl = string;

type ImageAssetToLoad = {
  url: ImageUrl;
};

type FontAssetToLoad = {
  font: Font;
  url: ImageUrl;
  imageTextColor: SolidColor;
  imageBgColor: SolidColor;
};

type SoundAssetToLoad = {
  url: SoundUrl;
};

export type ImageAsset = {
  width: number;
  height: number;
  rgba8bitData: Uint8ClampedArray;
};

export type FontAsset = {
  font: Font;
  image: ImageAsset;
  imageTextColor: SolidColor;
  imageBgColor: SolidColor;
};

export type SoundAsset = {
  audioBuffer: AudioBuffer;
};

type AssetsParams = {
  decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;
};

export class Assets {
  readonly #decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;

  #images: Map<ImageUrl, ImageAsset> = new Map();
  #fonts: Map<
    ImageUrl,
    {
      font: Font;
      imageTextColor: SolidColor;
      imageBgColor: SolidColor;
    }
  > = new Map();
  #sounds: Map<SoundUrl, SoundAsset> = new Map();

  constructor(params: AssetsParams) {
    this.#decodeAudioData = params.decodeAudioData;
  }

  // TODO: game loading screen during assets loading?
  async loadAssets(assetsToLoad: AssetsToLoad): Promise<void> {
    assetsToLoad.fonts.forEach(
      ({ url, font, imageTextColor, imageBgColor }) => {
        this.#fonts.set(url, { font, imageTextColor, imageBgColor });
      },
    );

    const imageUrls = [
      ...assetsToLoad.images.map(({ url }) => url),
      ...assetsToLoad.fonts.map(({ url }) => url),
    ];
    await Promise.all(
      imageUrls.map(async (url) => {
        const htmlImage = new Image();
        htmlImage.src = url;
        await htmlImage.decode();
        const canvas = document.createElement("canvas");
        canvas.width = htmlImage.naturalWidth;
        canvas.height = htmlImage.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw Error(`Failed to process the image: ${htmlImage.src}`);
        }
        ctx.drawImage(htmlImage, 0, 0);
        const imageData: ImageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        this.#images.set(url, {
          width: imageData.width,
          height: imageData.height,
          rgba8bitData: imageData.data,
        });
      }),
    );

    // TODO: make sounds loaded in parallel with images above
    await Promise.all(
      assetsToLoad.sounds.map(async ({ url }) => {
        if (!url.toLowerCase().endsWith(".wav")) {
          throw Error(
            `Assets: only wav sound files are supported due to Safari compatibility. The file which doesn't seem to be wav: "${url}"`,
          );
        }
        const httpResponse = await fetch(url);
        const arrayBuffer = await httpResponse.arrayBuffer();
        const audioBuffer = await this.#decodeAudioData(arrayBuffer);
        this.#sounds.set(url, {
          audioBuffer,
        });
      }),
    );
  }

  // call `loadAssets` before this one
  getImage(urlOfAlreadyLoadedImage: ImageUrl): ImageAsset {
    const imageAsset = this.#images.get(urlOfAlreadyLoadedImage);
    if (!imageAsset) {
      throw Error(
        `Assets: There is no image loaded for: ${urlOfAlreadyLoadedImage}`,
      );
    }
    return imageAsset;
  }

  // call `loadAssets` before this one
  getFont(urlOfAlreadyLoadedFontImage: ImageUrl): FontAsset {
    const { font, imageTextColor, imageBgColor } =
      this.#fonts.get(urlOfAlreadyLoadedFontImage) ??
      Utils.throwError(
        `Assets: font descriptor is missing for font image URL "${urlOfAlreadyLoadedFontImage}"`,
      );
    return {
      font,
      image: this.getImage(urlOfAlreadyLoadedFontImage),
      imageTextColor,
      imageBgColor,
    };
  }

  // call `loadAssets` before this one
  getSound(urlOfAlreadyLoadedSound: SoundUrl): SoundAsset {
    const soundAsset = this.#sounds.get(urlOfAlreadyLoadedSound);
    if (!soundAsset) {
      throw Error(
        `Assets: There is no sound loaded for: ${urlOfAlreadyLoadedSound}`,
      );
    }
    return soundAsset;
  }
}
