import { HtmlTemplate } from "../HtmlTemplate";
import { throwError } from "../utils/throwError";
import { wait } from "../utils/wait";

export class Loading {
  readonly #minWaitToAvoidFlicker: Promise<void> = wait(750);

  readonly #startButton: HTMLElement;
  readonly #startClicked: Promise<void>;

  constructor(params: { onStartClicked: () => void }) {
    this.#startButton =
      document.querySelector<HTMLElement>(HtmlTemplate.selectors.startButton) ??
      throwError(
        `Unable to find a start button under a selector "${HtmlTemplate.selectors.startButton}"`,
      );

    this.#startClicked = new Promise(resolve => {
      this.#startButton.addEventListener("click", () => {
        params.onStartClicked();
        resolve();
      });
    });
  }

  async showStartScreen(): Promise<void> {
    await this.#minWaitToAvoidFlicker;

    HtmlTemplate.addLoadedClass();

    this.#startButton.focus();

    await this.#startClicked;

    HtmlTemplate.addStartedClass();
  }
}
