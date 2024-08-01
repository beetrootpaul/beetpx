import { HtmlTemplate } from "../HtmlTemplate";
export class GameInputMouse {
    inputMethod = "mouse";
    static mapping = [
        { event: "button_left", selector: HtmlTemplate.selectors.controlsLeft },
        { event: "button_left", selector: HtmlTemplate.selectors.controlsUpLeft },
        { event: "button_left", selector: HtmlTemplate.selectors.controlsDownLeft },
        { event: "button_right", selector: HtmlTemplate.selectors.controlsRight },
        { event: "button_right", selector: HtmlTemplate.selectors.controlsUpRight },
        {
            event: "button_right",
            selector: HtmlTemplate.selectors.controlsDownRight,
        },
        { event: "button_up", selector: HtmlTemplate.selectors.controlsUp },
        { event: "button_up", selector: HtmlTemplate.selectors.controlsUpLeft },
        { event: "button_up", selector: HtmlTemplate.selectors.controlsUpRight },
        { event: "button_down", selector: HtmlTemplate.selectors.controlsDown },
        { event: "button_down", selector: HtmlTemplate.selectors.controlsDownLeft },
        {
            event: "button_down",
            selector: HtmlTemplate.selectors.controlsDownRight,
        },
        { event: "button_O", selector: HtmlTemplate.selectors.controlsO },
        { event: "button_X", selector: HtmlTemplate.selectors.controlsX },
        { event: "button_menu", selector: HtmlTemplate.selectors.controlsMenu },
        {
            event: "mute_unmute_toggle",
            selector: HtmlTemplate.selectors.controlsMuteToggle,
        },
        {
            event: "full_screen",
            selector: HtmlTemplate.selectors.controlsFullScreen,
        },
    ];
    #eventsSinceLastUpdate = new Set();
    startListening() {
        GameInputMouse.mapping.forEach(({ event, selector }) => {
            document.querySelectorAll(selector).forEach(button => {
                button.addEventListener("mousedown", () => {
                    this.#eventsSinceLastUpdate.add(event);
                });
                button.addEventListener("mouseup", () => {
                    this.#eventsSinceLastUpdate.delete(event);
                });
            });
        });
    }
    update(eventsCollector) {
        let anythingAdded = false;
        for (const event of this.#eventsSinceLastUpdate) {
            eventsCollector.add(event);
            anythingAdded = true;
        }
        
        
        
        
        
        
        
        
        this.#eventsSinceLastUpdate.delete("full_screen");
        return anythingAdded;
    }
}
