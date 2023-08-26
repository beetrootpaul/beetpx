// TODO: add some loading animation
export class Loading {
  // TODO: why do we even have this field here if it's unused in the end?
  readonly #displayElement: Element;

  constructor(htmlDisplaySelector: string) {
    const displayElement = document.querySelector(htmlDisplaySelector);
    if (!displayElement) {
      throw Error(
        `Was unable to find a display element by selector '${htmlDisplaySelector}'`,
      );
    }
    this.#displayElement = displayElement;
  }

  showApp(): void {
    // TODO: externalize this class as a parameter coming from the game itself
    document.body.classList.add("app_loaded");
  }
}
