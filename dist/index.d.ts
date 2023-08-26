type ColorId = string;
interface Color {
    id(): ColorId;
}
declare class TransparentColor implements Color {
    id(): ColorId;
}
declare const transparent_: TransparentColor;
declare class SolidColor implements Color {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    constructor(r: number, g: number, b: number);
    id(): ColorId;
    asRgbCssHex(): string;
    static fromRgbCssHex(cssHex: string): SolidColor;
}
declare class CompositeColor implements Color {
    readonly primary: SolidColor | TransparentColor;
    readonly secondary: SolidColor | TransparentColor;
    constructor(primary: SolidColor | TransparentColor, secondary: SolidColor | TransparentColor);
    id(): ColorId;
}
declare class MappingColor implements Color {
    #private;
    constructor(mapping: (canvasRgba: {
        r: number;
        g: number;
        b: number;
        a: number;
    }) => SolidColor | TransparentColor);
    getMappedColorFor(r: number, g: number, b: number, a: number): SolidColor | TransparentColor;
    id(): ColorId;
}

interface PrintDebug {
    d(): string;
}

declare function v_(x: number, y: number): Vector2d;
declare class Vector2d implements PrintDebug {
    static zero: Vector2d;
    static min(xy1: Vector2d, xy2: Vector2d): Vector2d;
    static max(xy1: Vector2d, xy2: Vector2d): Vector2d;
    static minMax(xy1: Vector2d, xy2: Vector2d): [Vector2d, Vector2d];
    static forEachIntXyWithinRectOf(xy: Vector2d, wh: Vector2d, fill: boolean, callback: (xy: Vector2d) => void): void;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    asArray(): [number, number];
    magnitude(): number;
    sign(): Vector2d;
    abs(): Vector2d;
    floor(): Vector2d;
    round(): Vector2d;
    eq(other: Vector2d): boolean;
    eq(value: number): boolean;
    gt(other: Vector2d): boolean;
    gt(value: number): boolean;
    gte(other: Vector2d): boolean;
    gte(value: number): boolean;
    lt(other: Vector2d): boolean;
    lt(value: number): boolean;
    lte(other: Vector2d): boolean;
    lte(value: number): boolean;
    clamp(xy1: Vector2d, xy2: Vector2d): Vector2d;
    mod(other: Vector2d): Vector2d;
    mod(value: number): Vector2d;
    mod(x: number, y: number): Vector2d;
    add(other: Vector2d): Vector2d;
    add(value: number): Vector2d;
    add(x: number, y: number): Vector2d;
    sub(other: Vector2d): Vector2d;
    sub(value: number): Vector2d;
    sub(x: number, y: number): Vector2d;
    mul(other: Vector2d): Vector2d;
    mul(value: number): Vector2d;
    mul(x: number, y: number): Vector2d;
    div(other: Vector2d): Vector2d;
    div(value: number): Vector2d;
    div(x: number, y: number): Vector2d;
    d(): string;
}

type SpriteCreationHelper = (x1: number, y1: number, w: number, h: number) => Sprite;
declare function spr_(imageUrl: ImageUrl): SpriteCreationHelper;
declare class Sprite {
    imageUrl: ImageUrl;
    xy1: Vector2d;
    xy2: Vector2d;
    constructor(imageUrl: ImageUrl, xy1: Vector2d, xy2: Vector2d);
    size(): Vector2d;
}

type CharSprite = {
    positionInText: Vector2d;
    sprite: Sprite;
    char: string;
};
type FontId = string;
interface Font {
    readonly id: FontId;
    readonly imageUrl: ImageUrl;
    spritesFor(text: string): CharSprite[];
}

type AssetsToLoad = {
    images: ImageAssetToLoad[];
    fonts: FontAssetToLoad[];
    sounds: SoundAssetToLoad[];
};
type ImageUrl = string;
type SoundUrl = string;
type ImageAssetToLoad = {
    url: ImageUrl;
};
type FontAssetToLoad = {
    font: Font;
    imageTextColor: SolidColor;
    imageBgColor: SolidColor;
};
type SoundAssetToLoad = {
    url: SoundUrl;
};
type ImageAsset = {
    width: number;
    height: number;
    rgba8bitData: Uint8ClampedArray;
};
type FontAsset = {
    font: Font;
    image: ImageAsset;
    imageTextColor: SolidColor;
    imageBgColor: SolidColor;
};
type SoundAsset = {
    audioBuffer: AudioBuffer;
};
type AssetsParams = {
    decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;
};
declare class Assets {
    #private;
    constructor(params: AssetsParams);
    loadAssets(assetsToLoad: AssetsToLoad): Promise<void>;
    getImageAsset(urlOfAlreadyLoadedImage: ImageUrl): ImageAsset;
    getFontAsset(fontId: FontId): FontAsset;
    getSoundAsset(urlOfAlreadyLoadedSound: SoundUrl): SoundAsset;
}

declare class Utils {
    static noop(): void;
    static clamp(a: number, b: number, c: number): number;
    static repeatN(n: number, callback: (i: number) => void): void;
    static booleanChangingEveryNthFrame(n: number): boolean;
    static get offset8Directions(): Vector2d[];
    static measureTextSize(text: string): Vector2d;
    static printWithOutline(text: string, canvasXy1: Vector2d, textColor: SolidColor, outlineColor: SolidColor): void;
    static throwError(message: string): never;
}

type SoundSequence = {
    sequence?: SoundSequenceEntry[];
    sequenceLooped?: SoundSequenceEntry[];
};
type SoundSequenceEntry = [
    SoundSequenceEntrySoundMain,
    ...SoundSequenceEntrySoundAdditional[]
];
type SoundSequenceEntrySoundMain = {
    url: SoundUrl;
    durationMs: (fullSoundDurationMs: number) => number;
};
type SoundSequenceEntrySoundAdditional = {
    url: SoundUrl;
};

type AudioPlaybackId = number;
declare class AudioApi {
    #private;
    get audioContext(): AudioContext;
    get globalGainNode(): GainNode;
    constructor(assets: Assets, audioContext: AudioContext);
    resumeAudioContextIfNeeded(): void;
    toggleMuteUnmute(): void;
    stopAllSounds(): void;
    playSoundOnce(soundUrl: SoundUrl): AudioPlaybackId;
    playSoundLooped(soundUrl: SoundUrl, muteOnStart?: boolean): AudioPlaybackId;
    playSoundSequence(soundSequence: SoundSequence): AudioPlaybackId;
    muteSound(playbackId: AudioPlaybackId): void;
    unmuteSound(playbackId: AudioPlaybackId): void;
}

declare class ClippingRegion {
    #private;
    constructor(xy: Vector2d, wh: Vector2d);
    allowsDrawingAt(xy: Vector2d): boolean;
}

declare class FillPattern {
    #private;
    static of(bits: number): FillPattern;
    static primaryOnly: FillPattern;
    static secondaryOnly: FillPattern;
    private constructor();
    hasPrimaryColorAt(xy: Vector2d): boolean;
}

type ColorMapping = Array<{
    from: SolidColor;
    to: SolidColor | TransparentColor;
}>;
type DrawApiOptions = {
    canvasBytes: Uint8ClampedArray;
    canvasSize: Vector2d;
    assets: Assets;
};
declare class DrawApi {
    #private;
    constructor(options: DrawApiOptions);
    setCameraOffset(offset: Vector2d): void;
    setClippingRegion(xy: Vector2d, wh: Vector2d): void;
    removeClippingRegion(): void;
    setFillPattern(fillPattern: FillPattern): void;
    mapSpriteColors(mapping: ColorMapping): ColorMapping;
    setFont(fontId: FontId | null): void;
    getFont(): Font | null;
    clearCanvas(color: SolidColor): void;
    pixel(xy: Vector2d, color: SolidColor): void;
    line(xy: Vector2d, wh: Vector2d, color: SolidColor | CompositeColor | MappingColor): void;
    rect(xy: Vector2d, wh: Vector2d, color: SolidColor | CompositeColor | MappingColor): void;
    rectFilled(xy: Vector2d, wh: Vector2d, color: SolidColor | CompositeColor | MappingColor): void;
    ellipse(xy: Vector2d, wh: Vector2d, color: SolidColor | CompositeColor | MappingColor): void;
    ellipseFilled(xy: Vector2d, wh: Vector2d, color: SolidColor | CompositeColor | MappingColor): void;
    sprite(sprite: Sprite, canvasXy: Vector2d): void;
    print(text: string, canvasXy: Vector2d, color: SolidColor | ((charSprite: CharSprite) => SolidColor)): void;
}

declare class Button {
    #private;
    static readonly repeatingStartSeconds = 0.5;
    static readonly repeatingIntervalSeconds = 0.1334;
    get isPressed(): boolean;
    wasJustPressed(repeating: boolean): boolean;
    wasJustReleased(repeating: boolean): boolean;
    update(isPressed: boolean, secondsPassed: number): void;
}

type GameInputEvent = null | "button_left" | "button_right" | "button_up" | "button_down" | "button_x" | "button_o" | "button_menu" | "mute_unmute_toggle" | "full_screen" | "debug_toggle" | "frame_by_frame_toggle" | "frame_by_frame_step";
type GameInputParams = {
    visibleTouchButtons: ButtonName[];
    muteButtonsSelector: string;
    fullScreenButtonsSelector: string;
    debugToggleKey?: string;
    debugFrameByFrameActivateKey?: string;
    debugFrameByFrameStepKey?: string;
};
declare class GameInput {
    #private;
    readonly gameButtons: Buttons;
    readonly buttonFullScreen: Button;
    readonly buttonMuteUnmute: Button;
    readonly buttonDebugToggle: Button;
    readonly buttonFrameByFrameToggle: Button;
    readonly buttonFrameByFrameStep: Button;
    constructor(params: GameInputParams);
    startListening(): void;
    update(params: {
        skipGameButtons: boolean;
    }): void;
    wasAnyButtonPressed(): boolean;
}

type ButtonName = "left" | "right" | "up" | "down" | "o" | "x" | "menu";
declare class Buttons {
    #private;
    update(events: Set<GameInputEvent>): void;
    isPressed(button: ButtonName): boolean;
    setRepeating(button: ButtonName, repeating: boolean): void;
    wasAnyJustPressed(): boolean;
    wasJustPressed(button: ButtonName): boolean;
    wasJustReleased(button: ButtonName): boolean;
}

declare class Timer {
    #private;
    constructor(seconds: number);
    /**
     * How many seconds has left until the timer ends.
     */
    get left(): number;
    get progress(): number;
    get hasFinished(): boolean;
    update(secondsPassed: number): void;
}

declare class DebugMode {
    static enabled: boolean;
}

type StorageApiValueConstraint = Record<string, string | number | boolean | null>;
declare class StorageApi {
    #private;
    store<StorageApiValue extends StorageApiValueConstraint>(value: StorageApiValue): void;
    load<StorageApiValue extends StorageApiValueConstraint>(): StorageApiValue | null;
    clearStorage(): void;
}

type FrameworkOptions = {
    gameCanvasSize: "64x64" | "128x128";
    desiredFps: number;
    visibleTouchButtons: ButtonName[];
    logActualFps?: boolean;
    debug?: {
        available: boolean;
        /**
         * A key to toggle debug mode on/off. Has to match a
         * [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
         * of a desired key.
         */
        toggleKey?: string;
        frameByFrame?: {
            activateKey?: string;
            stepKey?: string;
        };
    };
};
type OnAssetsLoaded = {
    startGame: () => void;
};
declare class Framework {
    #private;
    readonly gameInput: GameInput;
    readonly audioApi: AudioApi;
    readonly storageApi: StorageApi;
    readonly assets: Assets;
    readonly drawApi: DrawApi;
    averageFps: number;
    get frameNumber(): number;
    get t(): number;
    get dt(): number;
    constructor(options: FrameworkOptions);
    loadAssets(assetsToLoad: AssetsToLoad): Promise<OnAssetsLoaded>;
    setOnStarted(onStarted: () => void): void;
    setOnUpdate(onUpdate: () => void): void;
    setOnDraw(onDraw: () => void): void;
    restart(): void;
}

declare class BeetPx {
    #private;
    static init(frameworkOptions: FrameworkOptions, assetsToLoad: AssetsToLoad): ReturnType<Framework["loadAssets"]>;
    static get debug(): typeof DebugMode.enabled;
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     * It counts update calls, not draw calls.
     */
    static get frameNumber(): Framework["frameNumber"];
    /**
     * Time since game started, in seconds.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     */
    static get t(): Framework["t"];
    /**
     * Delta time since last update call, in seconds.
     */
    static get dt(): Framework["dt"];
    static get averageFps(): Framework["averageFps"];
    static get audioContext(): AudioApi["audioContext"];
    static get globalGainNode(): AudioApi["globalGainNode"];
    static setOnStarted: Framework["setOnStarted"];
    static setOnUpdate: Framework["setOnUpdate"];
    static setOnDraw: Framework["setOnDraw"];
    static restart: Framework["restart"];
    static isPressed: Buttons["isPressed"];
    static setRepeating: Buttons["setRepeating"];
    static wasJustPressed: Buttons["wasJustPressed"];
    static wasJustReleased: Buttons["wasJustReleased"];
    static setCameraOffset: DrawApi["setCameraOffset"];
    static setClippingRegion: DrawApi["setClippingRegion"];
    static removeClippingRegion: DrawApi["removeClippingRegion"];
    static setFillPattern: DrawApi["setFillPattern"];
    static mapSpriteColors: DrawApi["mapSpriteColors"];
    static setFont: DrawApi["setFont"];
    static getFont: DrawApi["getFont"];
    static clearCanvas: DrawApi["clearCanvas"];
    static pixel: DrawApi["pixel"];
    static line: DrawApi["line"];
    static rect: DrawApi["rect"];
    static rectFilled: DrawApi["rectFilled"];
    static ellipse: DrawApi["ellipse"];
    static ellipseFilled: DrawApi["ellipseFilled"];
    static sprite: DrawApi["sprite"];
    /**
     * Draws a text on the canvas
     *
     * @param text
     * @param canvasXy1 top-left text corner
     * @param color text color or a function which returns a text color for a given character
     */
    static print: DrawApi["print"];
    static toggleMuteUnmute: AudioApi["toggleMuteUnmute"];
    static playSoundOnce: AudioApi["playSoundOnce"];
    static playSoundLooped: AudioApi["playSoundLooped"];
    static playSoundSequence: AudioApi["playSoundSequence"];
    static stopAllSounds: AudioApi["stopAllSounds"];
    static muteSound: AudioApi["muteSound"];
    static unmuteSound: AudioApi["unmuteSound"];
    static store: StorageApi["store"];
    static load: StorageApi["load"];
    static clearStorage: StorageApi["clearStorage"];
    static getImageAsset: Assets["getImageAsset"];
    static getFontAsset: Assets["getFontAsset"];
    static getSoundAsset: Assets["getSoundAsset"];
}

declare global {
    const __BEETPX_IS_PROD__: boolean;
}

export { AudioPlaybackId, BeetPx, ButtonName, CharSprite, ClippingRegion, Color, ColorId, ColorMapping, CompositeColor, FillPattern, Font, FontId, GameInputEvent, ImageUrl, MappingColor, SolidColor, SoundSequence, Sprite, Timer, TransparentColor, Utils, Vector2d, spr_, transparent_, v_ };
