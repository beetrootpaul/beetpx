import { describe, expect, test } from "@jest/globals";
import { v_ } from "../misc/Vector2d";
import { BpxPixels } from "./Pixels";

describe("Pixels", () => {
  test("1x1", () => {
    expect(BpxPixels.from("#").asciiRows).toEqual(["#"]);
  });

  test("a complex and uneven set of bits", () => {
    expect(
      BpxPixels.from(`
        ##-##-##
        ##-##-##
        #-#--#-#
        -----------
        -----------
        ################
        ----------##
        #
      `).asciiRows,
    ).toEqual([
      "##-##-##",
      "##-##-##",
      "#-#--#-#",
      "-----------",
      "-----------",
      "################",
      "----------##",
      "#",
    ]);
  });

  test("ignored whitespaces", () => {
    expect(
      BpxPixels.from(`
      
      
        #           ## # # ###
        
             -###   ##--
        
        
        --    #     #----
        
        
        
      `).asciiRows,
    ).toEqual(["########", "-#####--", "--##----"]);
  });

  test("validation", () => {
    // unexpected characters
    expect(() => BpxPixels.from("#_#")).toThrow();
    expect(() => BpxPixels.from("#+#")).toThrow();
    expect(() => BpxPixels.from("#|#")).toThrow();
    expect(() => BpxPixels.from("#0#")).toThrow();
    expect(() => BpxPixels.from("#1#")).toThrow();
  });

  test("0-size", () => {
    expect(BpxPixels.from("").asciiRows).toEqual([]);
  });

  test("dimensions", () => {
    const pixels = BpxPixels.from(`
      ##-##-##
      ##-##-##
      #-#--#-#
      -----------
      -----------
      ################
      ----------##
      #
    `);
    expect(pixels.wh).toEqual(v_(16, 8));
  });
});
