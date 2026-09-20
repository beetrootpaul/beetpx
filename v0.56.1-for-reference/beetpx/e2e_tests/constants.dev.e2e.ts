import { expect, test } from "@playwright/test";

// COMMAND ARGS ::--const MY_CONST_1=value_without_quotes --const myConst2="with quotes and whitespaces" const3="this one was added as the 2nd one to the same --const" --const const4="  ! some special characters! @#$%^&*() !   " --const const5WithoutValue

declare global {
  interface Window {
    MY_CONST_1: boolean;
    myConst2: boolean;
    const3: boolean;
    const4: boolean;
    const5WithoutValue: boolean;
  }
}

test("constants injected onto window object", async ({ page }) => {
  await page.goto("./");

  const constants = await page.evaluate(() => ({
    c1: window.MY_CONST_1,
    c2: window.myConst2,
    c3: window.const3,
    c4: window.const4,
    c5: window.const5WithoutValue,
  }));

  expect(constants).toEqual({
    c1: "value_without_quotes",
    c2: "with quotes and whitespaces",
    c3: "this one was added as the 2nd one to the same --const",
    c4: "  ! some special characters! @#$%^&*() !   ",
    c5: "",
  });

  expect(typeof constants.c1).toBe("string");
  expect(typeof constants.c2).toBe("string");
  expect(typeof constants.c3).toBe("string");
  expect(typeof constants.c4).toBe("string");
  expect(typeof constants.c5).toBe("string");
});
