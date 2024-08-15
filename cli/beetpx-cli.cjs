#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const removeCssAndJsComments = require("strip-comments");

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

const yargsBuilderHtmlDeviceColor = {
  htmlDeviceColor: {
    type: "string",
    describe:
      "A color to be used as the virtual device's body. Has to be in a #000000 format.",
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

const yargsBuilderTimestamp = {
  timestamp: {
    type: "boolean",
    describe: "Add a timestamp to the generated ZIP file.",
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
      ...yargsBuilderHtmlDeviceColor,
      ...yargsBuilderPort,
      ...yargsBuilderOpen,
    },
  )
  .command("build", "Builds a production-ready bundle with the game.", {
    ...yargsBuilderConstants,
    ...yargsBuilderHtmlTitle,
    ...yargsBuilderHtmlIcon,
    ...yargsBuilderHtmlDeviceColor,
  })
  .command("preview", "Starts a production-ready bundle of the game.", {
    ...yargsBuilderPort,
    ...yargsBuilderOpen,
  })
  .command(
    "zip",
    "Generates a ZIP file with a previously built production-ready bundle and static assets in it. Ready to be uploaded to e.g. itch.io.",
    {
      ...yargsBuilderTimestamp,
    },
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
  .check((argv, options) => {
    const { htmlDeviceColor } = argv;
    if (!htmlDeviceColor) {
      return true;
    }
    if (/^#[0-9a-fA-F]{6}$/.test(htmlDeviceColor)) {
      return true;
    }
    throw Error(`htmlDeviceColor has to be in a #000000 format`);
  })
  .alias({
    h: "help",
  })
  .showHelpOnFail(true)
  .help().argv;

const _bpxCodebaseRoot = path.resolve(__dirname, "..");
const bpxCodebase = {
  packageJson: path.resolve(_bpxCodebaseRoot, "package.json"),
  templatesDir: path.resolve(_bpxCodebaseRoot, "html_templates"),
  templateFileNames: {
    indexHtml: "index.template.html",
    defaultIcon: "icon.png",
    additionalPngAsset: [
      "edge_b.png",
      "edge_bl.png",
      "edge_br.png",
      "edge_l.png",
      "edge_r.png",
      "edge_t.png",
      "edge_tl.png",
      "edge_tr.png",
      "gui.png",
      "loading.gif",
      "pico-8-font.png",
      "start.png",
    ],
  },
};

const _gameCodebaseRoot = process.cwd();
const gameCodebase = {
  root: _gameCodebaseRoot,
  tsEntrypoint: path.resolve(_gameCodebaseRoot, "src", "main.ts"),
  bpxDotViteDir: path.resolve(_gameCodebaseRoot, ".beetpx", ".vite"),
  bpxDevDir: path.resolve(_gameCodebaseRoot, ".beetpx", "dev"),
  bpxBuildDir: path.resolve(_gameCodebaseRoot, ".beetpx", "build"),
  bpxBuildOutDir: path.resolve(_gameCodebaseRoot, ".beetpx", "build-out"),
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
    htmlDeviceColor: argv.htmlDeviceColor ?? "#4b4158",
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
    htmlDeviceColor: argv.htmlDeviceColor ?? "#4b4158",
  });
} else if (argv._.includes("preview")) {
  runPreviewCommand({
    port: argv.port ?? undefined,
    open: argv.open ?? false,
  });
} else if (argv._.includes("zip")) {
  runZipCommand({
    timestamp: argv.timestamp ?? false,
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  throw Error("This code should not be reached :-)");
}

/////////////////////////////////////////////////////////////////////////////

function parseConstants(argvConst) {
  const result = {};
  (argvConst ?? []).forEach(entry => {
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
      const publicDirPrefix = path.resolve(gameCodebase.root, "public") + "/";
      if (file.startsWith(publicDirPrefix)) {
        const relativeFilePath = path.relative(gameCodebase.root, file);

        console.log(`syncing asset file "${relativeFilePath}"...`);
        fs.copyFileSync(
          file,
          path.resolve(gameCodebase.bpxDevDir, relativeFilePath),
        );

        console.log(`reloading due to change in file "${relativeFilePath}"...`);
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}

function runDevCommand(params) {
  const { constants, htmlTitle, htmlIconFile, htmlDeviceColor, port, open } =
    params;

  if (fs.existsSync(gameCodebase.bpxDevDir)) {
    fs.rmSync(gameCodebase.bpxDevDir, { recursive: true });
  }
  fs.mkdirSync(gameCodebase.bpxDevDir, { recursive: true });
  fs.mkdirSync(path.resolve(gameCodebase.bpxDevDir, "public"), {
    recursive: true,
  });

  generateHtmlFile(gameCodebase.bpxDevDir, {
    htmlTitle: htmlTitle,
    htmlIconFile: htmlIconFile,
    htmlDeviceColor: htmlDeviceColor,
    constants: {
      ...constants,
      BEETPX__IS_PROD: false,
      BEETPX__VERSION: beetPxVersion,
    },
  });

  copyGameAssets(gameCodebase.bpxDevDir);

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#createserver
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/server-options.html
  require("vite")
    .createServer({
      plugins: [WatchPublicDir()],
      configFile: false,
      root: gameCodebase.root,
      publicDir: path.resolve(gameCodebase.bpxDevDir, "public"),
      cacheDir: gameCodebase.bpxDotViteDir,
      server: {
        port: port ?? undefined,
        strictPort: !!port,
        open: open
          ? path.relative(
              gameCodebase.root,
              path.resolve(gameCodebase.bpxDevDir, "index.html"),
            )
          : false,
        hmr: true,
        watch: {
          interval: 500,
          binaryInterval: 1000,
        },
      },
      logLevel: "info",
    })
    .then(devServer =>
      devServer.listen().then(() => {
        // We don't use `devServer.printUrls()` here, because the URL logged
        //   there is bare `devServer.resolvedUrls.local`, which doesn't
        //   point to the proper `index.html`.
        const url = `${devServer.resolvedUrls.local}.beetpx/dev/index.html`;
        console.log(`\n  ➜  ${url}\n`);
      }),
    )
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

function runBuildCommand(params) {
  const { constants, htmlTitle, htmlIconFile, htmlDeviceColor } = params;

  if (fs.existsSync(gameCodebase.bpxBuildDir)) {
    fs.rmSync(gameCodebase.bpxBuildDir, { recursive: true });
  }
  if (fs.existsSync(gameCodebase.bpxBuildOutDir)) {
    fs.rmSync(gameCodebase.bpxBuildOutDir, { recursive: true });
  }
  fs.mkdirSync(gameCodebase.bpxBuildDir, { recursive: true });
  fs.mkdirSync(gameCodebase.bpxBuildOutDir, { recursive: true });

  generateHtmlFile(gameCodebase.bpxBuildDir, {
    htmlTitle: htmlTitle,
    htmlIconFile: htmlIconFile,
    htmlDeviceColor: htmlDeviceColor,
    constants: {
      ...constants,
      BEETPX__IS_PROD: true,
      BEETPX__VERSION: beetPxVersion,
    },
  });

  copyGameAssets(gameCodebase.bpxBuildDir);

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#build
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/build-options.html
  require("vite")
    .build({
      configFile: false,
      root: gameCodebase.bpxBuildDir,
      cacheDir: gameCodebase.bpxDotViteDir,
      // Base `./` is crucial for itch.io, since it produces
      //     <script type="module" crossOrigin src="./assets/index-<hash>.js"></script>
      //   instead of
      //     <script type="module" crossOrigin src="/assets/index-<hash>.js"></script>
      //   and the latter does not work there.
      base: "./",
      build: {
        // Vite expects `index.html` to be inside `dist` subdirectory
        //   of the `root` passed to the preview command, therefore
        //   let's make sure the build gets generated there.
        outDir: path.resolve(gameCodebase.bpxBuildOutDir, "dist"),
        emptyOutDir: true,
      },
      logLevel: "info",
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

function runPreviewCommand(params) {
  const { port, open } = params;

  if (!fs.existsSync(gameCodebase.bpxBuildOutDir)) {
    console.error(
      "Seems like `beetpx build` was not run for this project yet.",
    );
    process.exit(1);
  }

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#preview
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/preview-options.html
  require("vite")
    .preview({
      configFile: false,
      root: gameCodebase.bpxBuildOutDir,
      cacheDir: gameCodebase.bpxDotViteDir,
      preview: {
        port: port ?? undefined,
        strictPort: !!port,
        open: open ? "index.html" : false,
      },
      logLevel: "info",
    })
    .then(previewServer => {
      // We don't use `previewServer.printUrls()` here just for sake of consistency
      //   with the way we print the URL for `beetpx dev`. Also, the built-in
      //   function doesn't include `index.html` in the URL, which is not
      //   required, but a bit inconsistent with what is opened in the browser
      //   thanks to the `open` param of the `.preview(…)` call above.
      const url = `${previewServer.resolvedUrls.local}index.html`;
      console.log(`\n  ➜  ${url}\n`);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

async function runZipCommand(params) {
  const { timestamp } = params;

  fs.mkdirSync(gameCodebase.distZipDir, {
    recursive: true,
  });

  const inputDir = path.resolve(gameCodebase.bpxBuildOutDir, "dist");

  let zipFilename;
  if (timestamp) {
    const now = new Date();
    const timestampFilenamePart =
      now.getUTCFullYear().toFixed(0).padStart(4, "0") +
      (now.getUTCMonth() + 1).toFixed(0).padStart(2, "0") +
      now.getUTCDate().toFixed().padStart(2, "0") +
      "_" +
      now.getUTCHours().toString().padStart(2, "0") +
      now.getUTCMinutes().toString().padStart(2, "0") +
      now.getUTCSeconds().toString().padStart(2, "0") +
      "_Z";
    zipFilename = `game_${timestampFilenamePart}.zip`;
  } else {
    zipFilename = "game.zip";
  }
  const outputZip = path.resolve(gameCodebase.distZipDir, zipFilename);

  if (fs.existsSync(outputZip)) {
    fs.rmSync(outputZip);
  }

  const archive = require("archiver")("zip", { zlib: { level: 9 } });
  archive.on("error", err => {
    console.error("Error from 'archiver':", err);
    throw err;
  });
  archive.pipe(fs.createWriteStream(outputZip));
  // `false` 2nd param means adding input files to the root of the created ZIP (instead of some subdir)
  archive.directory(inputDir, false);
  await archive.finalize();

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

function generateHtmlFile(outputBaseDir, params) {
  const { htmlTitle, htmlIconFile, htmlDeviceColor, constants } = params;

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

  const htmlDeviceColorSlot = "__BPX__HTML_DEVICE_COLOR__";
  while (content.indexOf(htmlDeviceColorSlot) >= 0) {
    content = content.replace(htmlDeviceColorSlot, htmlDeviceColor);
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

  content = removeHtmlComments(content);
  content = removeCssAndJsComments(content, {
    line: true,
    block: true,
    keepProtected: false,
    preserveNewlines: true,
  });

  fs.writeFileSync(path.resolve(outputBaseDir, "index.html"), content, {
    encoding: "utf8",
  });
}

function removeHtmlComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, "");
}

function copyGameAssets(outputBaseDir) {
  fs.cpSync(
    path.resolve(gameCodebase.root, "public"),
    path.resolve(outputBaseDir, "public"),
    { recursive: true },
  );

  fs.mkdirSync(path.resolve(outputBaseDir, "public", "beetpx"), {
    recursive: true,
  });
  bpxCodebase.templateFileNames.additionalPngAsset.forEach(pngAsset => {
    fs.copyFileSync(
      path.resolve(bpxCodebase.templatesDir, pngAsset),
      path.resolve(outputBaseDir, "public", "beetpx", pngAsset),
    );
  });
}
