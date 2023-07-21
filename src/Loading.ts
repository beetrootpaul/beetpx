// TODO: When the loading of assets gets implemented, we will have to wait a bit more for the game to start.
//      We will need a minimum wait then in order to avoid a case when game loads super fast, making the loading screen flicker.

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

  // TODO: rename to hideLoadingScreen maybe?
  showApp(): void {
    // TODO: externalize this class as a parameter coming from the game itself
    document.body.classList.add("app_loaded");
  }
}
