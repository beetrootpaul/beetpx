#!/usr/bin/env node

// TODO: prevent CLI from running inside this repo or, in general, add some safety nets against messing up with files

const path = require("path");
const fs = require("fs");

const argv = require("yargs")
  .strict()
  .scriptName("beetpx")
  .command(
    ["dev", "$0"],
    "Start the game in a dev mode, with hot reloading and a sample HTML page.",
  )
  .command("build", "Builds a production-ready bundle with the game.")
  .command("preview", "Starts a production-ready bundle of the game.")
  .command(
    "zip",
    "Generates a ZIP file with a previously built production-ready bundle and static assets in it. Ready to be uploaded to e.g. itch.io.",
  )
  .alias({
    h: "help",
  })
  .showHelpOnFail(true)
  .help().argv;

const beetPxCodebaseDir = path.resolve(__dirname, "..");
const gameCodebaseDir = process.cwd();
const tmpBeetPxDir = ".beetpx/";
const gameHtml = "index.html";
const itchIoSimulationHtml = "itch_io_simulation.html";
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

if (argv._.includes("dev")) {
  runDevCommand();
} else if (argv._.includes("build")) {
  runBuildCommand();
} else if (argv._.includes("preview")) {
  runPreviewCommand();
} else if (argv._.includes("zip")) {
  runZipCommand();
} else {
  // TODO: make yargs error on invalid command
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

function runDevCommand() {
  fs.mkdirSync(path.resolve(gameCodebaseDir, tmpBeetPxDir), {
    recursive: true,
  });

  // TODO: Find a way to put HTML files inside `.beetpx/` and still make everything work OK. Maybe some server middleware for route resolution?
  fs.copyFileSync(
    path.resolve(beetPxCodebaseDir, "html_templates", itchIoSimulationHtml),
    path.resolve(gameCodebaseDir, itchIoSimulationHtml),
  );
  fs.copyFileSync(
    path.resolve(beetPxCodebaseDir, "html_templates", gameHtml),
    path.resolve(gameCodebaseDir, gameHtml),
  );

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
        open: itchIoSimulationHtml,
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

function runBuildCommand() {
  fs.mkdirSync(path.resolve(gameCodebaseDir, tmpBeetPxDir), {
    recursive: true,
  });

  // TODO: Find a way to put HTML files inside `.beetpx/` and still make everything work OK. Maybe some server middleware for route resolution?
  fs.copyFileSync(
    path.resolve(beetPxCodebaseDir, "html_templates", gameHtml),
    path.resolve(gameCodebaseDir, gameHtml),
  );

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
  // TODO: throw error if "build" was not invoked before or rather there are no files to zip
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

  console.log(`Zip got created in: ${path.relative(process.cwd(), outputZip)}`);
}
