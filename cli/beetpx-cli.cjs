#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const removeHtmlComments = require("remove-html-comments");
const removeCssComments = require("strip-comments");

const yargsBuilderConstants = {
  const: {
    type: "string",
    array: true,
    describe:
      'A constant (or many of them) to define on a browser\'s "window" object. In a format of MY_CONST="its value" (quotes can be omitted if not needed). Can be used multiple times.',
    demandOption: false,
    requiresArg: true,
  },
};

const yargsBuilderHtmlTitle = {
  htmlTitle: {
    type: "string",
    describe: "A title to use in <title> tag of a generated HTML page.",
    demandOption: false,
    requiresArg: true,
  },
};

const yargsBuilderHtmlIcon = {
  htmlIcon: {
    type: "string",
    describe: `A path to a PNG file to use as <link rel="icon"> in a generated HTML page.`,
    demandOption: false,
    requiresArg: true,
  },
};

const yargsBuilderPort = {
  port: {
    type: "number",
    describe: "Specify an exact port the game should be served on.",
    demandOption: false,
  },
};

const yargsBuilderOpen = {
  open: {
    type: "boolean",
    describe: "Automatically open the game in a browser.",
    demandOption: false,
  },
};

// yargs docs: https://yargs.js.org/docs/
const argv = require("yargs")
  .strict()
  .scriptName("beetpx")
  .command(
    ["dev", "$0"],
    "Start the game in a dev mode, with hot reloading and a sample HTML page.",
    {
      ...yargsBuilderConstants,
      ...yargsBuilderHtmlTitle,
      ...yargsBuilderHtmlIcon,
      ...yargsBuilderPort,
      ...yargsBuilderOpen,
    },
  )
  .command("build", "Builds a production-ready bundle with the game.", {
    ...yargsBuilderConstants,
    ...yargsBuilderHtmlTitle,
    ...yargsBuilderHtmlIcon,
  })
  .command("preview", "Starts a production-ready bundle of the game.", {
    ...yargsBuilderPort,
    ...yargsBuilderOpen,
  })
  .command(
    "zip",
    "Generates a ZIP file with a previously built production-ready bundle and static assets in it. Ready to be uploaded to e.g. itch.io.",
  )
  .check((argv, options) => {
    const { htmlIcon } = argv;
    if (!htmlIcon) {
      return true;
    }
    if (htmlIcon.toLowerCase().endsWith(".png")) {
      return true;
    }
    throw Error(
      `htmlIcon has to be a PNG file, but its file extension suggest another type format: "${path.basename(
        htmlIcon,
      )}"`,
    );
  })
  .alias({
    h: "help",
  })
  .showHelpOnFail(true)
  .help().argv;

const _bpxCodebaseRoot = path.resolve(__dirname, "..");
const bpxCodebase = {
  root: _bpxCodebaseRoot,
  packageJson: path.resolve(_bpxCodebaseRoot, "package.json"),
  templatesDir: path.resolve(_bpxCodebaseRoot, "html_templates"),
  templateFileNames: {
    indexHtml: "index.template.html",
    defaultIcon: "icon.png",
    additionalPngAsset: [
      "edge_tl.png",
      "edge_t.png",
      "edge_tr.png",
      "edge_l.png",
      "edge_r.png",
      "edge_bl.png",
      "edge_b.png",
      "edge_br.png",
      "gui.png",
      "loading.gif",
      "start.png",
      "pico-8-font.png",
    ],
  },
};

const _gameCodebaseRoot = process.cwd();
const gameCodebase = {
  root: _gameCodebaseRoot,
  tmpBeetPxDir: path.resolve(_gameCodebaseRoot, ".beetpx"),
  generatedIndexHtml: path.resolve(_gameCodebaseRoot, "index.html"),
  assetsDirName: "public",
  assetsDir: path.resolve(_gameCodebaseRoot, "public"),
  generatedAdditionalAssetsDir: path.resolve(
    _gameCodebaseRoot,
    "public",
    ".beetpx",
  ),
  tsEntrypoint: path.resolve(_gameCodebaseRoot, "src", "beetpx.ts"),
  distZipDir: path.resolve(_gameCodebaseRoot, "dist"),
};

const beetPxVersion = JSON.parse(
  fs.readFileSync(bpxCodebase.packageJson, {
    encoding: "utf8",
  }),
).version;
if (typeof beetPxVersion !== "string" || beetPxVersion.length <= 0) {
  throw Error('Unable to read "version" from "package.json"');
}

if (!fs.existsSync(gameCodebase.tsEntrypoint)) {
  console.error(
    `Could not find required BeetPx entrypoint TypeScript file: "${gameCodebase.tsEntrypoint}"`,
  );
  process.exit(1);
}

if (argv._.includes("dev") || argv._.length <= 0) {
  runDevCommand({
    constants: parseConstants(argv.const),
    htmlTitle: argv.htmlTitle ?? "BeetPx game",
    htmlIconFile:
      argv.htmlIcon ??
      path.resolve(
        bpxCodebase.templatesDir,
        bpxCodebase.templateFileNames.defaultIcon,
      ),
    port: argv.port ?? undefined,
    open: argv.open ?? false,
  });
} else if (argv._.includes("build")) {
  runBuildCommand({
    constants: parseConstants(argv.const),
    htmlTitle: argv.htmlTitle ?? "BeetPx game",
    htmlIconFile:
      argv.htmlIcon ??
      path.resolve(
        bpxCodebase.templatesDir,
        bpxCodebase.templateFileNames.defaultIcon,
      ),
  });
} else if (argv._.includes("preview")) {
  runPreviewCommand({
    port: argv.port ?? undefined,
    open: argv.open ?? false,
  });
} else if (argv._.includes("zip")) {
  runZipCommand();
} else {
  throw Error("This code should not be reached :-)");
}

function parseConstants(argvConst) {
  const result = {};
  (argvConst ?? []).forEach((entry) => {
    const delimiterPos = entry.indexOf("=");
    if (delimiterPos > 0) {
      result[entry.slice(0, delimiterPos)] = entry.slice(delimiterPos + 1);
    } else {
      result[entry] = "";
    }
  });
  return result;
}

// Based on https://stackoverflow.com/a/69628635/1036577
function WatchPublicDir() {
  return {
    name: "watch-public-dir",
    enforce: "post",
    handleHotUpdate({ file, server }) {
      const prefixToMatch = gameCodebase.assetsDir + "/";
      if (file.startsWith(prefixToMatch)) {
        const shortFileName =
          gameCodebase.assetsDirName +
          "/" +
          file.substring(prefixToMatch.length);
        console.log(`reloading due to change in file "${shortFileName}"...`);
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}

function runDevCommand(params) {
  const { constants, htmlTitle, htmlIconFile, port, open } = params;

  [
    gameCodebase.generatedIndexHtml,
    gameCodebase.generatedAdditionalAssetsDir,
    gameCodebase.tmpBeetPxDir,
  ].forEach((fileOrDir) => {
    if (fs.existsSync(fileOrDir)) {
      fs.rmSync(fileOrDir, { recursive: true });
    }
  });

  generateHtmlFile({
    htmlTitle: htmlTitle,
    htmlIconFile: htmlIconFile,
    constants: {
      ...constants,
      BEETPX__IS_PROD: false,
      BEETPX__VERSION: beetPxVersion,
    },
  });

  copyBeetPxAdditionalAssets();

  fs.mkdirSync(gameCodebase.tmpBeetPxDir, {
    recursive: true,
  });

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#createserver
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/server-options.html
  require("vite")
    .createServer({
      plugins: [WatchPublicDir()],
      configFile: false,
      root: gameCodebase.root,
      publicDir: gameCodebase.assetsDir,
      cacheDir: path.resolve(gameCodebase.tmpBeetPxDir, ".vite"),
      // Base `./` is crucial for itch.io, since it produces
      //     <script type="module" crossOrigin src="./assets/index-<hash>.js"></script>
      //   instead of
      //     <script type="module" crossOrigin src="/assets/index-<hash>.js"></script>
      //   and the latter does not work there.
      base: "./",
      server: {
        port: port ?? undefined,
        strictPort: !!port,
        open: open ? "index.html" : false,
        hmr: true,
        watch: {
          interval: 500,
          binaryInterval: 1000,
        },
      },
      logLevel: "info",
    })
    .then((devServer) =>
      devServer.listen().then(() => {
        devServer.printUrls();
      }),
    )
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function runBuildCommand(params) {
  const { constants, htmlTitle, htmlIconFile } = params;

  [
    gameCodebase.generatedIndexHtml,
    gameCodebase.generatedAdditionalAssetsDir,
    gameCodebase.tmpBeetPxDir,
  ].forEach((fileOrDir) => {
    if (fs.existsSync(fileOrDir)) {
      fs.rmSync(fileOrDir, { recursive: true });
    }
  });

  generateHtmlFile({
    htmlTitle: htmlTitle,
    htmlIconFile: htmlIconFile,
    constants: {
      ...constants,
      BEETPX__IS_PROD: true,
      BEETPX__VERSION: beetPxVersion,
    },
  });

  copyBeetPxAdditionalAssets();

  fs.mkdirSync(gameCodebase.tmpBeetPxDir, {
    recursive: true,
  });

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#build
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/build-options.html
  require("vite")
    .build({
      configFile: false,
      root: gameCodebase.root,
      publicDir: gameCodebase.assetsDir,
      cacheDir: path.resolve(gameCodebase.tmpBeetPxDir, ".vite"),
      base: "./",
      build: {
        outDir: path.resolve(gameCodebase.tmpBeetPxDir, "dist"),
        emptyOutDir: true,
      },
      logLevel: "info",
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function runPreviewCommand(params) {
  const { port, open } = params;

  fs.mkdirSync(gameCodebase.tmpBeetPxDir, {
    recursive: true,
  });

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#preview
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/preview-options.html
  require("vite")
    .preview({
      configFile: false,
      // NOTE: Vite expects `dist/` directory inside the `root`. Make sure it is generated in `build`.
      root: gameCodebase.tmpBeetPxDir,
      cacheDir: path.resolve(gameCodebase.tmpBeetPxDir, ".vite"),
      base: "./",
      preview: {
        port: port ?? undefined,
        strictPort: !!port,
        open: open ? "index.html" : false,
      },
      logLevel: "info",
    })
    .then((previewServer) => {
      previewServer.printUrls();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function runZipCommand() {
  fs.mkdirSync(gameCodebase.distZipDir, {
    recursive: true,
  });

  const inputDir = path.resolve(
    gameCodebase.tmpBeetPxDir,
    gameCodebase.distZipDir,
  );
  const outputZip = path.resolve(gameCodebase.distZipDir, "game.zip");

  // Remove the ZIP file first, otherwise its old content will get merged with the new one
  if (fs.existsSync(outputZip)) {
    fs.rmSync(outputZip);
  }

  require("cross-zip").zipSync(inputDir, outputZip);

  const sizeBytes = fs.statSync(outputZip).size;
  const sizeKibibytes = sizeBytes / 1024;
  const sizeMebibytes = sizeKibibytes / 1024;
  const sizePart =
    sizeKibibytes >= 1024
      ? `${sizeMebibytes.toFixed(1)} MiB`
      : `${sizeKibibytes.toFixed(0)} KiB`;
  console.log(
    `Zip got created in: ${path.relative(
      process.cwd(),
      outputZip,
    )} (${sizePart})`,
  );
}

function generateHtmlFile(params) {
  const { htmlTitle, htmlIconFile, constants } = params;

  let content = fs.readFileSync(
    path.resolve(
      bpxCodebase.templatesDir,
      bpxCodebase.templateFileNames.indexHtml,
    ),
    { encoding: "utf8" },
  );

  const htmlTitleSlot = "__BPX__HTML_TITLE__";
  while (content.indexOf(htmlTitleSlot) >= 0) {
    content = content.replace(htmlTitleSlot, htmlTitle);
  }

  const htmlIconBase64 = fs.readFileSync(htmlIconFile, "base64");
  const htmlIconSlot = "__BPX__HTML_ICON_BASE64__";
  while (content.indexOf(htmlIconSlot) >= 0) {
    content = content.replace(htmlIconSlot, htmlIconBase64);
  }

  const htmlWindowConstantsSlot = "__BPX__WINDOW_CONSTANTS__";
  let htmlWindowConstants = " */\n";
  for (const [key, value] of Object.entries(constants)) {
    const sanitizedKey = key.replaceAll('"', '\\"');
    if (typeof value === "string") {
      const sanitizedValue = value.replaceAll('"', '\\"');
      htmlWindowConstants += `window["${sanitizedKey}"] = "${sanitizedValue}";\n`;
    } else if (typeof value === "boolean") {
      htmlWindowConstants += `window["${sanitizedKey}"] = ${
        value ? "true" : "false"
      };\n`;
    } else if (typeof value === "number") {
      htmlWindowConstants += `window["${sanitizedKey}"] = ${value};\n`;
    } else {
      throw Error(
        `HTML generation: unexpected value type of a constant "${key}"`,
      );
    }
  }
  htmlWindowConstants += "/* ";
  while (content.indexOf(htmlWindowConstantsSlot) >= 0) {
    content = content.replace(htmlWindowConstantsSlot, htmlWindowConstants);
  }

  content = removeHtmlComments(content).data;
  // NOTE: This one also removes JS block comments!
  content = removeCssComments(content, {
    line: true,
    block: true,
    keepProtected: false,
    preserveNewlines: true,
  });

  fs.writeFileSync(gameCodebase.generatedIndexHtml, content, {
    encoding: "utf8",
  });
}

function copyBeetPxAdditionalAssets() {
  if (fs.existsSync(gameCodebase.generatedAdditionalAssetsDir)) {
    fs.rmSync(gameCodebase.generatedAdditionalAssetsDir, { recursive: true });
  }

  fs.mkdirSync(gameCodebase.generatedAdditionalAssetsDir, { recursive: true });

  bpxCodebase.templateFileNames.additionalPngAsset.forEach((pngAsset) => {
    fs.copyFileSync(
      path.resolve(bpxCodebase.templatesDir, pngAsset),
      path.resolve(gameCodebase.generatedAdditionalAssetsDir, pngAsset),
    );
  });
}
