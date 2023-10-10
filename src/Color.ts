import { BpxCanvasSnapshot } from "./draw_api/DrawApi";

export type BpxColorId = string;

export interface BpxColor {
  // TODO: `serialized()` might be a better name for it? As long as we provide `deserialize` as well…
  // meant to be used e.g. as textual key in `Map()`
  id: BpxColorId;
}

// TODO: split colors into separate files?

export class BpxTransparentColor implements BpxColor {
  readonly id: BpxColorId = "transparent";
}

export const transparent_ = new BpxTransparentColor();

// Red, green, and blue, each one as value between 0 and 255.
export class BpxSolidColor implements BpxColor {
  readonly id: BpxColorId;

  readonly r: number;
  readonly g: number;
  readonly b: number;

  constructor(r: number, g: number, b: number) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw Error(
        `One of color components is outside 0-255 range: r=${r}, g=${g}, b=${b}.`,
      );
    }
    this.r = r;
    this.g = g;
    this.b = b;
    this.id = "solid-" + this.asRgbCssHex();
  }

  asRgbCssHex(): string {
    return (
      "#" +
      this.r.toString(16).padStart(2, "0") +
      this.g.toString(16).padStart(2, "0") +
      this.b.toString(16).padStart(2, "0")
    );
  }

  static fromRgbCssHex(cssHex: string): BpxSolidColor {
    if (!/^#[0-9a-fA-F]{6}$/.test(cssHex)) {
      throw Error(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'",
      );
    }
    return new BpxSolidColor(
      parseInt(cssHex.slice(1, 3), 16),
      parseInt(cssHex.slice(3, 5), 16),
      parseInt(cssHex.slice(5, 7), 16),
    );
  }
}

export class BpxCompositeColor implements BpxColor {
  readonly id: BpxColorId;

  readonly primary: BpxSolidColor | BpxTransparentColor;
  readonly secondary: BpxSolidColor | BpxTransparentColor;

  constructor(
    primary: BpxSolidColor | BpxTransparentColor,
    secondary: BpxSolidColor | BpxTransparentColor,
  ) {
    this.primary = primary;
    this.secondary = secondary;
    this.id = `composite:${this.primary.id}:${this.secondary.id}`;
  }
}

// TODO: make it a function which allows to implement catch it all color
export class BpxMappingColor implements BpxColor {
  static #nextId = 1;

  readonly id: BpxColorId = `mapping:${BpxMappingColor.#nextId++}`;

  readonly canvasSnapshot: BpxCanvasSnapshot;

  readonly #mapping: (
    canvasColor: BpxSolidColor | BpxTransparentColor,
  ) => BpxSolidColor | BpxTransparentColor;

  constructor(
    canvasSnapshot: BpxCanvasSnapshot,
    mapping: (
      canvasColor: BpxSolidColor | BpxTransparentColor,
    ) => BpxSolidColor | BpxTransparentColor,
  ) {
    this.canvasSnapshot = canvasSnapshot;
    this.#mapping = mapping;
  }

  getMappedColorForCanvasIndex(
    r: number,
    g: number,
    b: number,
    a: number,
  ): BpxSolidColor | BpxTransparentColor {
    return this.#mapping(
      a >= 0xff / 2 ? new BpxSolidColor(r, g, b) : transparent_,
    );
  }
}
