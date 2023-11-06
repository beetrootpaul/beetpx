import { ImageAsset } from "../Assets";
import { BpxSolidColor, type BpxColor } from "../Color";

export class TestImage {
  readonly asset: ImageAsset;
  readonly uniqueUrl: string;

  constructor(params: {
    image: string;
    withMapping: Record<string, BpxColor>;
  }) {
    const asciiImage = params.image;
    const asciiToColor = params.withMapping;

    const normalizedAsciiImageLines = asciiImage
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .split("")
          .filter((char) => char !== " ")
          .join(""),
      )
      .filter((line) => line.length > 0);
    const normalizedAsciiImage = normalizedAsciiImageLines.join("");

    this.asset = {
      width: normalizedAsciiImageLines[0]!.length,
      height: normalizedAsciiImageLines.length,
      channels: 4,
      rgba8bitData: new Uint8ClampedArray(4 * normalizedAsciiImage.length),
    };

    this.uniqueUrl =
      "/" +
      this.asset.width +
      "/" +
      this.asset.height +
      "/" +
      normalizedAsciiImage +
      ".png";
    // TODO: REMOVE
    console.log(this.uniqueUrl);

    for (let i = 0; i < this.asset.width * this.asset.height; i += 1) {
      const color = asciiToColor[normalizedAsciiImage[i]!];
      if (!color) {
        throw Error(
          `TestImage: Missing color mapping for "${normalizedAsciiImage[i]}"`,
        );
      } else if (color instanceof BpxSolidColor) {
        this.asset.rgba8bitData[4 * i] = color.r;
        this.asset.rgba8bitData[4 * i + 1] = color.g;
        this.asset.rgba8bitData[4 * i + 2] = color.b;
        this.asset.rgba8bitData[4 * i + 3] = 0xff;
      } else {
        this.asset.rgba8bitData[4 * i] = 0x00;
        this.asset.rgba8bitData[4 * i + 1] = 0x00;
        this.asset.rgba8bitData[4 * i + 2] = 0x00;
        this.asset.rgba8bitData[4 * i + 3] = 0x00;
      }
    }
  }
}
