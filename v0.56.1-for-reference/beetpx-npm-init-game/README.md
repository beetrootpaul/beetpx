# beetpx-npm-init-game

A tool for creating new [BeetPx](https://beetpx.dev) projects.

To use it, in your terminal navigate to the parent folder in which
you want to create your BeetPx game. Then run:

```shell
npm init @beetpx/beetpx-game@latest my-game
cd my-game
npm install
```

where `my-game` is your desired directory/project name.

To make sure things are working correctly, continue with:

```shell
npm run tsc
npm start
```

and the sample project should open in your web browser.

## Development

To test if the current set of initial files is correct, do the following:

```shell
rm -rf test_sandbox
mkdir -p test_sandbox
cd test_sandbox
node ../init-game.js game
cd game
npm install
npm run tsc
npm start
# Then Ctrl-C and test other defined npm scripts as well.
```