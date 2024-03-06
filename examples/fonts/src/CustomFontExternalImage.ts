import { CustomFont } from "./CustomFont";

export class CustomFontExternalImage extends CustomFont {
  // TODO: update this URL after merging to "main"
  spriteSheetUrls = [
    "https://raw.githubusercontent.com/beetrootpaul/beetpx/04a09315b10b57f68e81afaacd476385fb08b1fa/examples/fonts/public/custom-font.png",
  ];
}

export const customFontExternalImage = new CustomFontExternalImage();
