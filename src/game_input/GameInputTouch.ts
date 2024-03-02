import { HtmlTemplate } from "../HtmlTemplate";
import { BpxGameInputEvent, GameInputMethod } from "./GameInput";
import { GameInputSpecialized } from "./GameInputSpecialized";

type BitMask = number;

export class GameInputTouch implements GameInputSpecialized {
  inputMethod: GameInputMethod = "touch";

  static readonly #bitMasks = {
    up: 0b1000_00_0_00,
    down: 0b0100_00_0_00,
    left: 0b0010_00_0_00,
    right: 0b0001_00_0_00,
    a: 0b0000_10_0_00,
    b: 0b0000_01_0_00,
    menu: 0b0000_00_1_00,
    muteUnmute: 0b0000_00_0_10,
    fullScreen: 0b0000_00_0_01,
  } as const;

  readonly #config: Array<{
    bitMask: BitMask;
    events: BpxGameInputEvent[];
    requiresStart: boolean;
    selector: string;
    elements: HTMLElement[];
  }> = [
    {
      bitMask: GameInputTouch.#bitMasks.up | GameInputTouch.#bitMasks.left,
      events: ["button_up", "button_left"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsUpLeft,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.up,
      events: ["button_up"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsUp,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.up | GameInputTouch.#bitMasks.right,
      events: ["button_up", "button_right"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsUpRight,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.left,
      events: ["button_left"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsLeft,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.right,
      events: ["button_right"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsRight,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.down | GameInputTouch.#bitMasks.left,
      events: ["button_down", "button_left"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsDownLeft,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.down,
      events: ["button_down"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsDown,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.down | GameInputTouch.#bitMasks.right,
      events: ["button_down", "button_right"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsDownRight,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.a,
      events: ["button_a"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsA,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.b,
      events: ["button_b"],
      requiresStart: false,
      selector: HtmlTemplate.selectors.controlsB,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.menu,
      events: ["button_menu"],
      requiresStart: true,
      selector: HtmlTemplate.selectors.controlsMenu,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.muteUnmute,
      events: ["mute_unmute_toggle"],
      requiresStart: true,
      selector: HtmlTemplate.selectors.controlsMuteToggle,
      elements: [],
    },
    {
      bitMask: GameInputTouch.#bitMasks.fullScreen,
      events: ["full_screen"],
      requiresStart: true,
      selector: HtmlTemplate.selectors.controlsFullScreen,
      elements: [],
    },
  ];

  readonly #ongoingTouches: Map<Touch["identifier"], BitMask> = new Map();

  constructor() {
    this.#config.forEach(({ selector, elements }) => {
      elements.push(...document.querySelectorAll<HTMLElement>(selector));
    });
  }

  startListening(): void {
    document.addEventListener("touchstart", this.#handleTouchEvent.bind(this));
    document.addEventListener("touchmove", this.#handleTouchEvent.bind(this));
    document.addEventListener("touchcancel", this.#handleTouchEvent.bind(this));
    document.addEventListener("touchend", this.#handleTouchEvent.bind(this));
  }

  #handleTouchEvent(touchEvent: TouchEvent): void {
    // Try to prevent iOS Safari from doing helpful things that do not apply
    //   to a game like: text selection, div selection, area zoom on a double
    //   tap, etc.
    touchEvent.preventDefault();

    for (const touch of touchEvent.changedTouches) {
      if (touchEvent.type === "touchmove") {
        let detectedEvents = 0;
        for (const { elements, bitMask, requiresStart } of this.#config) {
          if (
            !requiresStart &&
            this.#isAnyElementTouched(elements, touch, bitMask)
          ) {
            detectedEvents |= bitMask;
          }
        }
        this.#ongoingTouches.set(touch.identifier, detectedEvents);
      } else if (touchEvent.type === "touchstart") {
        let detectedEvents = 0;
        for (const { elements, bitMask, events } of this.#config) {
          if (this.#isAnyElementTouched(elements, touch, bitMask)) {
            detectedEvents |= bitMask;
          }
        }
        this.#ongoingTouches.set(touch.identifier, detectedEvents);
      } else if (
        touchEvent.type === "touchend" ||
        touchEvent.type === "touchcancel"
      ) {
        this.#ongoingTouches.delete(touch.identifier);
      }
    }
  }

  #isAnyElementTouched(
    elements: HTMLElement[],
    touch: Touch,
    bitMask: BitMask,
  ): boolean {
    for (const el of elements) {
      const bcr = el.getBoundingClientRect();
      if (
        touch.clientX >=
          bcr.left -
            (bitMask & GameInputTouch.#bitMasks.left ? bcr.width : 0) &&
        touch.clientX <=
          bcr.right +
            (bitMask & GameInputTouch.#bitMasks.right ? bcr.width : 0) &&
        touch.clientY >=
          bcr.top - (bitMask & GameInputTouch.#bitMasks.up ? bcr.height : 0) &&
        touch.clientY <=
          bcr.bottom +
            (bitMask & GameInputTouch.#bitMasks.down ? bcr.height : 0)
      ) {
        return true;
      }
    }
    return false;
  }

  update(eventsCollector: Set<BpxGameInputEvent>): boolean {
    let anythingAdded = false;

    for (const [
      touchIdentifier,
      ongoingEvents,
    ] of this.#ongoingTouches.entries()) {
      for (const { bitMask, events } of this.#config) {
        if ((ongoingEvents & bitMask) === bitMask) {
          for (const event of events) {
            eventsCollector.add(event);
          }
        }
      }

      // On macOS Chrome and Safari touch events are not registered during full
      //   screen transition. If user touches the button for a typical short duration,
      //   it ends up recognized as still pressed after the full screen transition
      //   ends. Therefore, in order to toggle full screen back, user has to press
      //   the button twice: once to "release" the key, and second time to initiate
      //   the next full screen transition.
      // As a workaround we do not keep "full_screen" event "pressed", so the engine
      //   will recognize it as a key being up immediately.
      if (ongoingEvents & GameInputTouch.#bitMasks.fullScreen) {
        this.#ongoingTouches.set(
          touchIdentifier,
          ongoingEvents & ~GameInputTouch.#bitMasks.fullScreen,
        );
      }
    }

    return anythingAdded;
  }
}
