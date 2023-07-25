export class Loading {
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
