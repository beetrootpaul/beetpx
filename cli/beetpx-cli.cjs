#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const removeHtmlComments = require("remove-html-comments");
const removeCssComments = require("strip-comments");

const yargsBuilderHtmlTitle = {
  htmlTitle: {
    type: "string",
    describe: "A title to use in <title> tag of a generated HTML page",
    demandOption: false,
    requiresArg: true,
  },
};

const yargsBuilderHtmlIcon = {
  htmlIcon: {
    type: "string",
    describe: `A path to a PNG file to use as <link rel="icon"> in a generated HTML page`,
    demandOption: false,
    requiresArg: true,
  },
};

const yargsBuilderOpen = {
  open: {
    type: "boolean",
    describe: "Automatically open the game in a browser",
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
      ...yargsBuilderHtmlTitle,
      ...yargsBuilderHtmlIcon,
      ...yargsBuilderOpen,
    },
  )
  .command("build", "Builds a production-ready bundle with the game.", {
    ...yargsBuilderHtmlTitle,
    ...yargsBuilderHtmlIcon,
  })
  .command("preview", "Starts a production-ready bundle of the game.")
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

const beetPxCodebaseDir = path.resolve(__dirname, "..");
const gameCodebaseDir = process.cwd();
const tmpBeetPxDir = ".beetpx/";

const tsEntrypoint = path.resolve(gameCodebaseDir, "src", "beetpx.ts");

const gameHtmlTemplate = "index.template.html";

const beetPxHtmlTemplatesInDir = path.resolve(
  beetPxCodebaseDir,
  "html_templates",
);

const defaultHtmlIcon = path.resolve(beetPxHtmlTemplatesInDir, "icon.png");

const beetPxAdditionalPublicAssetsOutDir = path.resolve(
  gameCodebaseDir,
  "public",
  ".beetpx",
);

const buildOutDirAsExpectedByVitePreview = "dist/";
const distZipDir = "dist/";
const distZipFile = "game.zip";

const beetPxVersion = JSON.parse(
  fs.readFileSync(path.resolve(beetPxCodebaseDir, "package.json"), {
    encoding: "utf8",
  }),
).version;
if (typeof beetPxVersion !== "string" || beetPxVersion.length <= 0) {
  throw Error('Unable to read "version" from "package.json"');
}

if (!fs.existsSync(tsEntrypoint)) {
  console.error(
    `Could not find required BeetPx entrypoint TypeScript file: "${tsEntrypoint}"`,
  );
  process.exit(1);
}

if (argv._.includes("dev") || argv._.length <= 0) {
  runDevCommand({
    htmlTitle: argv.htmlTitle ?? "BeetPx game",
    htmlIconFile: argv.htmlIcon ?? defaultHtmlIcon,
    open: argv.open ?? false,
  });
} else if (argv._.includes("build")) {
  runBuildCommand({
    htmlTitle: argv.htmlTitle ?? "BeetPx game",
    htmlIconFile: argv.htmlIcon ?? defaultHtmlIcon,
  });
} else if (argv._.includes("preview")) {
  runPreviewCommand();
} else if (argv._.includes("zip")) {
  runZipCommand();
} else {
  throw Error("This code should not be reached :-)");
}

// Based on https://stackoverflow.com/a/69628635/1036577
function WatchPublicDir() {
  return {
    name: "watch-public-dir",
    enforce: "post",
    handleHotUpdate({ file, server }) {
      const prefixToMatch = path.resolve(gameCodebaseDir, "public") + "/";
      if (file.startsWith(prefixToMatch)) {
        const shortFileName = "public/" + file.substring(prefixToMatch.length);
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
  const { htmlTitle, htmlIconFile, open } = params;

  generateHtmlFile({
    inputFile: path.resolve(beetPxHtmlTemplatesInDir, gameHtmlTemplate),
    outputFile: path.resolve(
      gameCodebaseDir,
      gameHtmlTemplate.replace(".template", ""),
    ),
    htmlTitle: htmlTitle,
    htmlIconFile: htmlIconFile,
  });

  copyBeetPxAdditionalAssets({
    inputDir: beetPxHtmlTemplatesInDir,
    outputDir: beetPxAdditionalPublicAssetsOutDir,
  });

  fs.mkdirSync(path.resolve(gameCodebaseDir, tmpBeetPxDir), {
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
      root: gameCodebaseDir,
      publicDir: path.resolve(gameCodebaseDir, "public"),
      cacheDir: path.resolve(gameCodebaseDir, tmpBeetPxDir, ".vite"),
      // Base `./` is crucial for itch.io, since it produces
      //     <script type="module" crossOrigin src="./assets/index-<hash>.js"></script>
      //   instead of
      //     <script type="module" crossOrigin src="/assets/index-<hash>.js"></script>
      //   and the latter does not work there.
      base: "./",
      server: {
        open: open ? gameHtmlTemplate.replace(".template", "") : false,
        hmr: true,
        watch: {
          interval: 500,
          binaryInterval: 1000,
        },
      },
      // important docs about "define": https://vitejs.dev/config/shared-options.html#define
      define: {
        __BEETPX__IS_PROD__: false,
        __BEETPX__VERSION__: JSON.stringify(beetPxVersion),
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
  const { htmlTitle, htmlIconFile } = params;

  generateHtmlFile({
    inputFile: path.resolve(beetPxHtmlTemplatesInDir, gameHtmlTemplate),
    outputFile: path.resolve(
      gameCodebaseDir,
      gameHtmlTemplate.replace(".template", ""),
    ),
    htmlTitle: htmlTitle,
    htmlIconFile: htmlIconFile,
  });

  copyBeetPxAdditionalAssets({
    inputDir: beetPxHtmlTemplatesInDir,
    outputDir: beetPxAdditionalPublicAssetsOutDir,
  });

  fs.mkdirSync(path.resolve(gameCodebaseDir, tmpBeetPxDir), {
    recursive: true,
  });

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#build
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/build-options.html
  require("vite")
    .build({
      configFile: false,
      root: gameCodebaseDir,
      publicDir: path.resolve(gameCodebaseDir, "public"),
      cacheDir: path.resolve(gameCodebaseDir, tmpBeetPxDir, ".vite"),
      base: "./",
      build: {
        outDir: path.resolve(
          gameCodebaseDir,
          tmpBeetPxDir,
          buildOutDirAsExpectedByVitePreview,
        ),
        emptyOutDir: true,
      },
      // important docs about "define": https://vitejs.dev/config/shared-options.html#define
      define: {
        __BEETPX__IS_PROD__: true,
        __BEETPX__VERSION__: JSON.stringify(beetPxVersion),
      },
      logLevel: "info",
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function runPreviewCommand() {
  fs.mkdirSync(path.resolve(gameCodebaseDir, tmpBeetPxDir), {
    recursive: true,
  });

  // Vite docs:
  //   - https://vitejs.dev/guide/api-javascript.html#preview
  //   - https://vitejs.dev/config/shared-options.html
  //   - https://vitejs.dev/config/preview-options.html
  require("vite")
    .preview({
      configFile: false,
      root: path.resolve(gameCodebaseDir, tmpBeetPxDir),
      cacheDir: path.resolve(gameCodebaseDir, tmpBeetPxDir, ".vite"),
      base: "./",
      preview: {
        open: true,
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
  fs.mkdirSync(path.resolve(gameCodebaseDir, distZipDir), {
    recursive: true,
  });

  const inputDir = path.resolve(
    gameCodebaseDir,
    tmpBeetPxDir,
    buildOutDirAsExpectedByVitePreview,
  );
  const outputZip = path.resolve(gameCodebaseDir, distZipDir, distZipFile);

  // Remove the ZIP file first, otherwise its old content will get merged with the new one
  if (fs.existsSync(outputZip)) {
    fs.unlinkSync(outputZip);
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
  const { inputFile, outputFile, htmlTitle, htmlIconFile } = params;

  let content = fs.readFileSync(inputFile, { encoding: "utf8" });

  content = removeHtmlComments(content).data;
  content = removeCssComments(content, {
    line: true,
    block: true,
    keepProtected: false,
    preserveNewlines: true,
  });

  const htmlTitleSlot = "__HTML_TITLE__";
  while (content.indexOf(htmlTitleSlot) >= 0) {
    content = content.replace(htmlTitleSlot, htmlTitle);
  }

  const htmlIconBase64 = fs.readFileSync(htmlIconFile, "base64");
  const htmlIconSlot = "__HTML_ICON_BASE64__";
  while (content.indexOf(htmlIconSlot) >= 0) {
    content = content.replace(htmlIconSlot, htmlIconBase64);
  }

  fs.writeFileSync(outputFile, content, { encoding: "utf8" });
}

function copyBeetPxAdditionalAssets(params) {
  const { inputDir, outputDir } = params;

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }

  fs.mkdirSync(outputDir, { recursive: true });
  [
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
  ].forEach((pngAsset) => {
    fs.copyFileSync(
      path.resolve(inputDir, pngAsset),
      path.resolve(outputDir, pngAsset),
    );
  });
}
