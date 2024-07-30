import { HtmlTemplate } from "../HtmlTemplate";
import { throwError } from "../utils/throwError";
export class Loading {
    #minWaitToAvoidFlicker = new Promise(resolve => {
        setTimeout(() => resolve(), 750);
    });
    #startButton;
    #startClicked;
    constructor(params) {
        this.#startButton =
            document.querySelector(HtmlTemplate.selectors.startButton) ??
                throwError(`Unable to find a start button under a selector "${HtmlTemplate.selectors.startButton}"`);
        this.#startClicked = new Promise(resolve => {
            this.#startButton.addEventListener("click", () => {
                params.onStartClicked();
                resolve();
            });
        });
    }
    async showStartScreen() {
        await this.#minWaitToAvoidFlicker;
        HtmlTemplate.addLoadedClass();
        this.#startButton.focus();
        await this.#startClicked;
        HtmlTemplate.addStartedClass();
    }
}
