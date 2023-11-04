// TODO: add some loading animation

import { HtmlTemplate } from "./HtmlTemplate";
import { u_ } from "./Utils";

export class Loading {
  readonly #minWaitToAvoidFlicker: Promise<void> = u_.wait(1000);

  async showApp(): Promise<void> {
    await this.#minWaitToAvoidFlicker;
    HtmlTemplate.addLoadedClass();
  }
}
