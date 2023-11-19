/**
 * This script removes JavaScript comments from files in `./dist/`
 * (both line and block ones), but omits JSDoc comments.
 */

const path = require("path");
const fs = require("fs");
const { globSync } = require("glob");

const beetPxCodebaseDir = path.resolve(__dirname, "..");

const jsFiles = globSync(path.resolve(beetPxCodebaseDir, "dist") + "/**/*.js");
for (const jsFile of jsFiles) {
  let js = fs.readFileSync(jsFile, { encoding: "utf8" });

  // remove JS comments (except JSDoc)
  js = js.replace(/(\/\*[^*]*\*\/)|(\/\/[^\r\n]*)/g, "");

  fs.writeFileSync(jsFile, js, { encoding: "utf8" });
}
