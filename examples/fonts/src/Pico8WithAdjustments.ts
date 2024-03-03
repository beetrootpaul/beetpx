import { BpxPixels, BpxVector2d, v_ } from "../../../src";
import { BpxFontPico8 } from "../../../src/font/BpxFontPico8";

// TODO: rework
export class Pico8WithAdjustments extends BpxFontPico8 {
  override spriteFor(
    character: string,
  ): [BpxVector2d, BpxVector2d] | BpxPixels | null {
    if (character === "[") {
      return BpxPixels.from(`
        ##-
        #--
        #--
        #--
        ##-
      `);
    }
    if (character === "]") {
      return [v_(13, 5).mul(8), v_(3, 5)];
    }
    return super.spriteFor(character);
  }
}
