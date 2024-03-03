import { BpxImageUrl } from "../../../src";
import { CustomFont } from "./CustomFont";

// TODO: rework
export class CustomFontExternalImage extends CustomFont {
  // TODO: update the URL once it is on `main`
  readonly imageUrl: BpxImageUrl =
    "https://raw.githubusercontent.com/beetrootpaul/beetpx/04a09315b10b57f68e81afaacd476385fb08b1fa/examples/fonts/public/custom-font.png";
}
