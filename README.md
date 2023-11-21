# BeetPx

![BeetPx logo](./logo/BeetPx%20logo%20(x5).png)

> A mini framework for low-res browser games, written in TypeScript.

## Getting Started

Add it to your project with:

```shell
npm install --save-dev --save-exact @beetpx/beetpx
```

It might make sense in a future to drop `--save-exact` flag, but for now better be safe than sorry – in this early phase
of development the framework constantly evolves and quite often breaking changes are introduced.

There is a simple example in [./examples/simple/](examples/simple/README.md) . Run it as described
in [its README](examples/simple/README.md).

Also, you might want to take a look at how following projects are using BeetPx:

- https://github.com/beetrootpaul/towers-of-survival-beetpx
- https://github.com/beetrootpaul/avoid-your-past-beetpx

## API Documentation

For a nicely formatted list of API exposed by BeetPx run:

```shell
npm run docs
```

to open it in your default browser. In case of any issues, the website which is supposed to open is located under [docs/index.html](./docs/index.html)

## Development Setup

This projects is developed on [Node.js 18](https://nodejs.org/docs/latest-v18.x/api/index.html).

You might find it helpful to use
[nvm](https://github.com/nvm-sh/nvm#installing-and-updating) in order to make sure you use the same Node.js version as
which is specified in [.nvmrc](.nvmrc).

## Random Notes

- Gamepad input seems to be laggy (at least on Firefox), unsuitable for fast paced games.
- It's good to avoid `.forEach`, `.reduce` and similar functions and use classic `for` loops instead. The former tend to have significantly worse performance due to an extra function call in each iteration.