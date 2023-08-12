// TODO: implement a PICO-8 like button press detection which starts to repeat after certain threshold
export class Button {
  #isPressed = false;
  #wasJustToggled = false;

  get wasJustPressed(): boolean {
    return this.#wasJustToggled && this.#isPressed;
  }

  get wasJustReleased(): boolean {
    return this.#wasJustToggled && !this.#isPressed;
  }

  get isPressed(): boolean {
    return this.#isPressed;
  }

  update(isPressed: boolean): void {
    this.#wasJustToggled = this.#isPressed !== isPressed;
    this.#isPressed = isPressed;
  }
}
