




import { Engine } from "./Engine";
import { DebugMode } from "./debug/DebugMode";
import { Logger } from "./logger/Logger";
import { GamePause } from "./pause/GamePause";

/**
 * One of 3 main API entry points. This one provides you with the most of
 * the BeetPx capabilities, except drawing.
 *
 * @example
 * ```ts
 * BeetPx.setOnUpdate(() => {
 *   BeetPx.logInfo(BeetPx.isAnyButtonPressed());
 * });
 * ```
 *
 * @category API entry points
 */
export class BeetPx {
    constructor() { }
    static #dataStoredBeforeEngineStarted = {};
    static #tryGetEngine() {
        if (!Engine.engineSingleton) {
            throw Error(`Tried to access BeetPx API without calling BeetPx.start(…) first.`);
        }
        return Engine.engineSingleton;
    }
    
    
    
    /**
     * The method which starts the game.
     *
     * You are supposed to set {@link BeetPx.setOnStarted},
     * {@link BeetPx.setOnUpdate}, and {@link BeetPx.setOnDraw} before this one.
     *
     * @example
     * ```ts
     * $.setOnStarted(() => {
     *   
     * });
     *
     * $.setOnUpdate(() => {
     *   
     * });
     *
     * $.setOnDraw(() => {
     *   
     * });
     *
     * $.start({
     *   gameId: "my-game",
     *   
     * });
     * ```
     *
     * @category Game loop
     */
    static async start(config) {
        if (Engine.engineSingleton) {
            throw Error("BeetPx is already started");
        }
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initializing…`);
        Engine.engineSingleton = new Engine(config);
        const { startGame } = await Engine.engineSingleton.init();
        Logger.infoBeetPx(`BeetPx ${window.BEETPX__VERSION} : Initialized`);
        if (this.#dataStoredBeforeEngineStarted.onStarted) {
            Engine.engineSingleton.setOnStarted(this.#dataStoredBeforeEngineStarted.onStarted);
        }
        if (this.#dataStoredBeforeEngineStarted.onUpdate) {
            Engine.engineSingleton.setOnUpdate(this.#dataStoredBeforeEngineStarted.onUpdate);
        }
        if (this.#dataStoredBeforeEngineStarted.onDraw) {
            Engine.engineSingleton.setOnDraw(this.#dataStoredBeforeEngineStarted.onDraw);
        }
        this.#dataStoredBeforeEngineStarted = {};
        return await startGame();
    }
    
    
    
    /**
     * Let's you know whether the debug mode is on or off. To be used in combination with:
     * - {@link BpxEngineConfig}'s `debugMode.available` set to `true`
     * - `;` key used to toggle the debug mode on/off
     *
     * @category Debug
     */
    static get debug() {
        return DebugMode.enabled;
    }
    /**
     * The canvas size as set in {@link BpxEngineConfig}'s `canvasSize`.
     *
     * @category Graphics
     */
    static get canvasSize() {
        return this.#tryGetEngine().canvasSize;
    }
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when {@link BeetPx.restart} is called.
     * It counts update calls, not draw calls.
     *
     * Usually you would use e.g. {@link $timer} instead of this low-level API.
     *
     * @category Game loop
     */
    static get frameNumber() {
        return this.#tryGetEngine().frameNumber;
    }
    /**
     * Number of frames processed since game started, excluding the frames which happened during an active game pause.
     * It gets reset to 0 when {@link BeetPx.restart} is called.
     * It counts update calls, not draw calls.
     *
     * Usually you would use e.g. {@link $timer} instead of this low-level API.
     *
     * @category Game loop
     */
    static get frameNumberOutsidePause() {
        return this.#tryGetEngine().frameNumberOutsidePause;
    }
    /**
     * The effective FPS (frames per second) of render calls. This does *not* count the update calls.
     *
     * This value is used (with some averaging, to avoid quickly changing number) in the FPS display,
     * which is active in debug mode if {@link BpxEngineConfig}'s
     * `debugMode.fpsDisplay.enabled` is set to `true`.
     *
     * @category Game loop
     */
    static get renderingFps() {
        return this.#tryGetEngine().renderingFps;
    }
    /**
     * The type of a browser detected by the engine.
     * It is tightly related to the gamepad mapping detection.
     *
     * @see https:
     *
     * @category Game input
     */
    static get detectedBrowserType() {
        return this.#tryGetEngine().detectedBrowserType;
    }
    
    
    
    /**
     * The method to set an on-started callback which is called every time the game is (re-)started.
     *
     * While the game starts only once, it can be restarted many time with use of {@link BeetPx.restart}.
     * In such case, the callback is useful for clearing up the game state, so nothing from the previous
     * gameplay remains.
     *
     * The timers, animations, and music restart on their own, there is no manual action needed.
     *
     * The on-started callback is one of 2 recommended places to use `BeetPxDraw` methods within
     * (the other one is the draw callback set by {@link BeetPx.setOnDraw}).
     *
     * @example
     * ```ts
     * const inputManager = MySpecialInputManager();
     * let gameLogic: MyComplexGameLogic;
     *
     * $.setOnStarted(() => {
     *   gameLogic = new MyComplexGameLogic();
     *   inputManager.reset();
     * });
     *
     * $.setOnUpdate(() => {
     *   
     * });
     *
     * $.setOnDraw(() => {
     *   
     * });
     *
     * $.start({
     *   
     * });
     * ```
     *
     * @category Game loop
     */
    static setOnStarted(onStarted) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnStarted(onStarted);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onStarted = onStarted;
        }
    }
    /**
     * The method to set an update callback which is called on every iteration of the game loop,
     * on a fixed timestep.
     *
     * @example
     * ```ts
     * const speed = 6;
     * let player;
     *
     * $.setOnStarted(() => {
     *   
     * });
     *
     * $.setOnUpdate(() => {
     *   player.setPosition(
     *     player.position.mul($.getPressedDirection()).mul(speed)
     *   );
     * });
     *
     * $.setOnDraw(() => {
     *   
     * });
     *
     * $.start({
     *   
     * });
     * ```
     *
     * @see {@link BpxEngineConfig.fixedTimestep}
     *
     * @category Game loop
     */
    static setOnUpdate(onUpdate) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnUpdate(onUpdate);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onUpdate = onUpdate;
        }
    }
    /**
     * The method to set a draw callback which is called every time the browser has a chance to repaint the canvas
     * ([requestAnimationFrame](https:
     * under the hood).
     *
     * The draw callback is one of 2 recommended places to use `BeetPxDraw` methods within
     * (the other one is the on-started callback set by {@link BeetPx.setOnStarted}).
     *
     * @example
     * ```ts
     * $.setOnStarted(() => {
     *   
     * });
     *
     * $.setOnUpdate(() => {
     *   
     * });
     *
     * $.setOnDraw(() => {
     *   $d.clearCanvas($rgb_blue);
     *   $d.pixel($v(10,20), $rgb_red);
     * });
     *
     * $.start({
     *   
     * });
     * ```
     *
     * @see {@link BpxEngineConfig.fixedTimestep}
     *
     * @category Game loop
     */
    static setOnDraw(onDraw) {
        if (Engine.engineSingleton) {
            Engine.engineSingleton.setOnDraw(onDraw);
        }
        else {
            this.#dataStoredBeforeEngineStarted.onDraw = onDraw;
        }
    }
    /**
     * Restarts the entire game.
     *
     * It is important to properly set the game initialization logic through the {@link BeetPx.setOnStarted},
     * so the `$.restart()` will result with a properly restarted game.
     *
     * An example usage would be to implement a game pause menu, with the "restart the game" as
     * one of available options.
     *
     * @category Game loop
     */
    static restart() {
        this.#tryGetEngine().restart();
    }
    
    
    
    /**
     * Prints to the console on the debug level, with use of `console.debug`.
     * This one is run only in the debug mode.
     *
     * You can implement {@link BpxPrintDebug} on a given object if you want
     * it to be printed out in a custom way.
     *
     * @see {@link BpxEngineConfig.debugMode}
     * @see {@link BpxPrintDebug}
     *
     * @category Logging
     */
    static logDebug(...args) {
        Logger.debug(...args);
    }
    /**
     * Prints to the console on the info level, with use of `console.info`.
     *
     * You can implement {@link BpxPrintDebug} on a given object if you want
     * it to be printed out in a custom way.
     *
     * @see {@link BpxPrintDebug}
     *
     * @category Logging
     */
    static logInfo(...args) {
        Logger.info(...args);
    }
    /**
     * Prints to the console on the warn level, with use of `console.warn`.
     *
     * You can implement {@link BpxPrintDebug} on a given object if you want
     * it to be printed out in a custom way.
     *
     * @see {@link BpxPrintDebug}
     *
     * @category Logging
     */
    static logWarn(...args) {
        Logger.warn(...args);
    }
    /**
     * Prints to the console on the error level, with use of `console.error`.
     *
     * You can implement {@link BpxPrintDebug} on a given object if you want
     * it to be printed out in a custom way.
     *
     * @see {@link BpxPrintDebug}
     *
     * @category Logging
     */
    static logError(...args) {
        Logger.error(...args);
    }
    
    
    
    /**
     * Whether the game pause is active.
     *
     * @see https:
     *
     * @category Game pause
     */
    static get isPaused() {
        return GamePause.isActive;
    }
    /**
     Whether the game pause was activated in the most recent game loop iteration.
     *
     * @see https:
     *
     * @category Game pause
     */
    static get wasJustPaused() {
        return GamePause.wasJustActivated;
    }
    /**
     Whether the game pause was deactivated in the most recent game loop iteration.
     *
     * @see https:
     *
     * @category Game pause
     */
    static get wasJustResumed() {
        return GamePause.wasJustDeactivated;
    }
    /**
     * Pauses the game. This works only if {@link BpxEngineConfig.gamePause}'s `available` is set to `true`.
     *
     * The game pauses is by default toggled with the "menu" button, but this method allows you
     * to add other ways of activating the pause.
     *
     * @see https:
     *
     * @category Game pause
     */
    static pause() {
        GamePause.activate();
    }
    /**
     * Resumes the game. This works only if {@link BpxEngineConfig.gamePause}'s `available` is set to `true`.
     *
     * The game pauses is by default toggled with the "menu" button, but this method allows you
     * to add other ways of deactivating the pause.
     *
     * @see https:
     *
     * @category Game pause
     */
    static resume() {
        GamePause.deactivate();
    }
    
    
    
    /**
     * Tells whether any of the game buttons changed from released to pressed in the recent game loop iteration.
     *
     * @see For a list of available game buttons check {@link BpxGameButtonName}
     *
     * @category Game input
     */
    static wasAnyButtonJustPressed() {
        return this.#tryGetEngine().gameInput.gameButtons.wasAnyJustPressed();
    }
    /**
     * Tells whether a given game button changed from released to pressed in the recent game loop iteration.
     *
     * @category Game input
     */
    static wasButtonJustPressed(button) {
        return this.#tryGetEngine().gameInput.gameButtons.wasJustPressed(button);
    }
    /**
     * Tells whether a given game button changed from pressed to released in the recent game loop iteration.
     *
     * @category Game input
     */
    static wasButtonJustReleased(button) {
        return this.#tryGetEngine().gameInput.gameButtons.wasJustReleased(button);
    }
    /**
     * Tells whether any of the game buttons is pressed right now.
     *
     * @see For a list of available game buttons check {@link BpxGameButtonName}
     *
     * @category Game input
     */
    static isAnyButtonPressed() {
        return this.#tryGetEngine().gameInput.gameButtons.isAnyPressed();
    }
    /**
     * Tells whether a given button is pressed right now.
     *
     * @category Game input
     */
    static isButtonPressed(button) {
        return this.#tryGetEngine().gameInput.gameButtons.isPressed(button);
    }
    /**
     * Returns a 2D vector where:
     * - X=-1 means the up is pressed,
     * - X=0 means neither up nor down is pressed or both are pressed at the same time,
     * - X=1 means the down is pressed,
     * - Y=-1 means the left is pressed,
     * - Y=0 means neither left nor right is pressed or both are pressed at the same time,
     * - Y=1 means the right is pressed.
     *
     * @example
     * ```ts
     * this.position += $.getPressedDirection().mul(this.speed);
     * ```
     *
     * @category Game input
     */
    static getPressedDirection() {
        return this.#tryGetEngine().gameInput.gameButtons.getPressedDirection();
    }
    /**
     * Allows to enable repeating for a given button.
     * Repeating means if the user presses the button for a longer timer,
     * the "just pressed" state is detected first after `firstRepeatFrames`
     * frames, then repetitively after `loopedRepeatFrames` frames.
     *
     * @category Game input
     */
    static setButtonRepeating(button, repeating) {
        this.#tryGetEngine().gameInput.gameButtons.setButtonRepeating(button, repeating);
    }
    /**
     * Tells what input methods were used in the last game loop iteration.
     *
     * Might be used to render in-game indications what button to press,
     * with their sprites chosen based on which input method was recently
     * used.
     *
     * @category Game input
     */
    static getRecentInputMethods() {
        return this.#tryGetEngine().gameInput.getRecentInputMethods();
    }
    /**
     * @category Game input
     */
    static getConnectedGamepadTypes() {
        return this.#tryGetEngine().gameInput.getConnectedGamepadTypes();
    }
    /**
     * A set of game input events captures since the last game loop iteration.
     *
     * Typically you wouldn't need to use those this method unless dealing
     * with custom even handling.
     *
     * @see https:
     *
     * @category Game input
     */
    static getEventsCapturedInLastUpdate() {
        return this.#tryGetEngine().gameInput.getEventsCapturedInLastUpdate();
    }
    
    
    
    /**
     * Checks if the audio is globally muted.
     *
     * @category Audio
     */
    static isAudioMuted() {
        return this.#tryGetEngine().audioApi.isAudioMuted();
    }
    /**
     * Mutes the audio globally.
     *
     * The global mute/unmute logic is independent from
     * {@link BeetPx.mutePlayback} and {@link BeetPx.unmutePlayback}.
     *
     * @category Audio
     */
    static muteAudio(opts) {
        this.#tryGetEngine().audioApi.muteAudio(opts);
    }
    /**
     * Un-mutes the audio globally.
     *
     * The global mute/unmute logic is independent from
     * {@link BeetPx.mutePlayback} and {@link BeetPx.unmutePlayback}.
     *
     * @category Audio
     */
    static unmuteAudio(opts) {
        this.#tryGetEngine().audioApi.unmuteAudio(opts);
    }
    /**
     * Start to play a given sound, once.
     *
     * @returns - A {@link BpxAudioPlaybackId} of the started playback. Can be later used to e.g. mute this playback.
     *
     * @category Audio
     */
    static startPlayback(soundUrl, opts) {
        return this.#tryGetEngine().audioApi.startPlayback(soundUrl, opts);
    }
    /**
     * Start to play a given sound, looped.
     *
     * @returns - A {@link BpxAudioPlaybackId} of the started playback. Can be later used to e.g. mute this playback.
     *
     * @category Audio
     */
    static startPlaybackLooped(soundUrl, opts) {
        return this.#tryGetEngine().audioApi.startPlaybackLooped(soundUrl, opts);
    }
    /**
     * Start to play a given sound, defined by a sequence of audio samples.
     *
     * @see {@link BpxSoundSequence}
     *
     * @returns - A {@link BpxAudioPlaybackId} of the started playback. Can be later used to e.g. mute this playback.
     *
     * @category Audio
     */
    static startPlaybackSequence(soundSequence, opts) {
        return this.#tryGetEngine().audioApi.startPlaybackSequence(soundSequence, opts);
    }
    /**
     * Mutes a given playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static mutePlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.mutePlayback(playbackId, opts);
    }
    /**
     * Un-mutes a given playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static unmutePlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.unmutePlayback(playbackId, opts);
    }
    /**
     * Completely stops a given playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static stopPlayback(playbackId, opts) {
        this.#tryGetEngine().audioApi.stopPlayback(playbackId, opts);
    }
    /**
     * Pauses a given playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static pausePlayback(playbackId) {
        this.#tryGetEngine().audioApi.pausePlayback(playbackId);
    }
    /**
     * Resumes a given paused playback, denoted by its {@link BpxAudioPlaybackId}.
     *
     * @category Audio
     */
    static resumePlayback(playbackId) {
        this.#tryGetEngine().audioApi.resumePlayback(playbackId);
    }
    /**
     * Gives access to the main global [AudioContext](https:
     *
     * Typically, you wouldn't have to access to method on your own. But it might prove useful
     * to have it in some unexpected scenario.
     *
     * @category Audio
     */
    static getAudioContext() {
        return this.#tryGetEngine().audioApi.getAudioContext();
    }
    
    
    
    /**
     * Tells whether it is possible to enter full screen on the current device and browser.
     *
     * It might be used e.g. for implementing a pause menu action to toggle full screen.
     *
     * @category Full screen
     */
    static isFullScreenSupported() {
        return this.#tryGetEngine().fullScreen.isFullScreenSupported();
    }
    /**
     * Tells whether the game is currently in a full screen mode.
     *
     * It might be used e.g. for implementing a pause menu action to toggle full screen.
     *
     * @category Full screen
     */
    static isInFullScreen() {
        return this.#tryGetEngine().fullScreen.isInFullScreen();
    }
    /**
     * Requests the game to either enter or exit the full screen mode.
     *
     * It might be used e.g. for implementing a pause menu action to toggle full screen.
     *
     * @category Full screen
     */
    static toggleFullScreen() {
        this.#tryGetEngine().fullScreen.toggleFullScreen();
    }
    
    
    
    /**
     * Allows to persist some data between separate game runs.
     *
     * The stored data is kept in the
     * [localStorage](https:
     * It means it will be there as long as you the same web browser (with the same user profile active)
     * on the same machine, without clearing the website's data.
     *
     * @category Storage
     */
    static savePersistedState(value) {
        this.#tryGetEngine().storageApi.savePersistedState(value);
    }
    /**
     * Allows to bring back the previously persisted data.
     *
     * The stored data is kept in the
     * [localStorage](https:
     * It means it will be there as long as you the same web browser (with the same user profile active)
     * on the same machine, without clearing the website's data.
     *
     * @category Storage
     */
    static loadPersistedState() {
        return this.#tryGetEngine().storageApi.loadPersistedState();
    }
    /**
     * Allows to completely remove the previously persisted data.
     *
     * @category Storage
     */
    static clearPersistedState() {
        this.#tryGetEngine().storageApi.clearPersistedState();
    }
    
    
    
    /**
     * Retrieves a previously fetched image.
     *
     * Usually, you wouldn't need to directly call this method,
     * as the image retrieval happens under the hood for operations
     * like sprite drawing.
     *
     * @see {@link BpxEngineConfig}'a `assets`
     *
     * @category Assets
     */
    static getImageAsset(imageUrl) {
        return this.#tryGetEngine().assets.getImageAsset(imageUrl);
    }
    /**
     * Retrieves a previously fetched sound.
     *
     * Usually, you wouldn't need to directly call this method,
     * as the sound retrieval happens under the hood for operations
     * like music playing.
     *
     * @see {@link BpxEngineConfig}'a `assets`
     *
     * @category Assets
     */
    static getSoundAsset(soundUrl) {
        return this.#tryGetEngine().assets.getSoundAsset(soundUrl);
    }
    /**
     * Retrieves a previously fetched JSON.
     *
     * Right now there is no API which would make use of the fetched JSON under the hood.
     *
     * Example use case for this method is when you develop your game level in [LDtk](https:
     * and want to read the level's file in the game code.
     *
     * @see {@link BpxEngineConfig}'a `assets`
     *
     * @category Assets
     */
    static getJsonAsset(jsonUrl) {
        return this.#tryGetEngine().assets.getJsonAsset(jsonUrl);
    }
}

/**
 * A shorthand for {@link BeetPx}.
 *
 * @category API entry points
 */
export const $ = BeetPx;

