# BeetPx

![BeetPx logo](./logo/BeetPx%20logo%20(x5).png)

> A TypeScript engine for low-res browser games.

## Getting Started

Add it to your project with:

```shell
npm install --save-dev --save-exact @beetpx/beetpx
```

It might make sense in a future to drop `--save-exact` flag, but for now better be safe than sorry – in this early phase
of development the engine constantly evolves and quite often breaking changes are introduced.

There is a simple example in [./examples/simple/](examples/simple/README.md) . Run it as described
in [its README](examples/simple/README.md).

Also, you might want to take a look at how following projects are using BeetPx:

- https://github.com/beetrootpaul/hat-escape
- https://github.com/beetrootpaul/dart-07-beetpx
- https://github.com/beetrootpaul/towers-of-survival-beetpx
- https://github.com/beetrootpaul/avoid-your-past-beetpx

## API Documentation

For a nicely formatted list of API exposed by BeetPx run:

```shell
npm run docs
```

to open it in your default browser. In case of any issues, the website which is supposed to open is located
under [docs/index.html](./docs/index.html)

## Development Setup

This projects is developed on [Node.js 18](https://nodejs.org/docs/latest-v18.x/api/index.html).

You might find it helpful to use
[nvm](https://github.com/nvm-sh/nvm#installing-and-updating) in order to make sure you use the same Node.js version as
which is specified in [.nvmrc](.nvmrc).

## The Origin

My idea for BeetPx came from a good time I had working on mini games in [PICO-8](https://www.lexaloffle.com/pico-8.php).
That fantasy consoles hit a very sweet spot for me: in PICO-8 you are creating low resolution pixel art games, to do so
you use a globally available simple API, and all your creations can easily run in a desktop browser or a mobile one.

There are though some areas I would like differently:

- I prefer to use a typed language and a one which follows a standard. In PICO-8 I had to use a custom version of Lua,
  which meant difficulties in finding a decent extension for an IDE of my choice.
- PICO-8 has a token limit, which generally means a limit on how much code you are allowed to write and an incentive to
  use a short language constructs as possible rather than optimizing for a code maintenance. I understand this is a
  heated topic in PICO-8 community and I also see advantages of the limited approach – e.g. it helps to keep games low
  scoped and, in result finish them! Also, it is sometimes a real fun to come with clever solutions for hunting tokens
  down 😄. But when it comes to my personal preferences, I more often was frustrated by the token limit rather then
  enjoying it.
- There is a minor issues with a browser build of PICO-8 games, where the long press of a in-game button on iOS Safari
  results with a system text selection to appear and prevents from playing a game smoothly. Of course, this is something
  I could work around by adjusting an HTML template exported from PICO-8. But since I decided to create my own engine, I
  am able to take care of browser iOS experience and do it the way I like.
- Last but not least: I just wanted to have something created for
  public, [available on npm](https://www.npmjs.com/package/@beetpx/beetpx), something I feel I am capable to do and can
  be proud of later ☺️

That being said, I am very grateful that PICO-8 exists and there is a big community around it. If not for PICO-8, BeetPx
would never be created 💛

## Credits

### Fonts

While you are able (and encouraged) to define your own font (as an implementation of `BpxFont` interface), there are 3
fonts ready to use in BeetPx out of the box:

- `font_pico8__` (the default one)
- `font_saint11Minimal4_`
- `font_saint11Minimal5_`

The first one is a font from PICO-8 fantasy console, available under a CC-0 license (public domain, free to use). For
more info
see: https://www.lexaloffle.com/pico-8.php?page=faq

Two other fonts are created by [Saint11](https://saint11.org/about/) and available on https://saint11.org/blog/fonts/
under
a CC-0 license (public domain, free to use).

### Color Palettes

There is a PICO-8 color palette ready to use, exported as `rgb_p8_`. That palette is
created by zep and available under a CC-0 license (public domain, free to use). For more info
see: https://www.lexaloffle.com/pico-8.php?page=faq

## Random Notes

- Gamepad input seems to be laggy (at least on Firefox), unsuitable for fast paced games.
- It's good to avoid `.forEach`, `.reduce` and similar functions and use classic `for` loops instead. The former tend to
  have significantly worse performance due to an extra function call in each iteration.