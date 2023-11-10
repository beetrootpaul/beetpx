import { PngDataArray } from 'fast-png';

type BpxCanvasPixelsSnapshotId = number;
interface CanvasPixelsSnapshot {
    get(index: number): BpxSolidColor;
}

type BpxColorId = string;
interface BpxColor {
    id: BpxColorId;
}
declare class BpxTransparentColor implements BpxColor {
    #private;
    readonly id: BpxColorId;
}
declare const transparent_: BpxTransparentColor;
declare class BpxSolidColor implements BpxColor {
    #private;
    readonly id: BpxColorId;
    readonly r: number;
    readonly g: number;
    readonly b: number;
    constructor(r: number, g: number, b: number);
    asRgbCssHex(): string;
    static fromRgbCssHex(cssHex: string): BpxSolidColor;
}
declare const black_: BpxSolidColor;
declare const white_: BpxSolidColor;
declare const red_: BpxSolidColor;
declare const green_: BpxSolidColor;
declare const blue_: BpxSolidColor;
declare class BpxCompositeColor implements BpxColor {
    #private;
    readonly id: BpxColorId;
    readonly primary: BpxSolidColor | BpxTransparentColor;
    readonly secondary: BpxSolidColor | BpxTransparentColor;
    constructor(primary: BpxSolidColor | BpxTransparentColor, secondary: BpxSolidColor | BpxTransparentColor);
}
declare class BpxMappingColor implements BpxColor {
    #private;
    readonly id: BpxColorId;
    readonly snapshotId: BpxCanvasPixelsSnapshotId;
    readonly getMappedColorFromCanvasSnapshot: (snapshot: CanvasPixelsSnapshot, index: number) => BpxSolidColor | BpxTransparentColor;
    constructor(snapshotId: BpxCanvasPixelsSnapshotId, mapping: (canvasColor: BpxSolidColor) => BpxSolidColor | BpxTransparentColor);
}

interface PrintDebug {
    __printDebug(): string;
}

declare function v_(x: number, y: number): BpxVector2d;
declare class BpxVector2d implements PrintDebug {
    static min(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    static max(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    static minMax(xy1: BpxVector2d, xy2: BpxVector2d): [BpxVector2d, BpxVector2d];
    static lerp(xy1: BpxVector2d, xy2: BpxVector2d, t: number): BpxVector2d;
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static unitFromAngle(turnAngle: number): BpxVector2d;
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    asArray(): [number, number];
    magnitude(): number;
    sign(): BpxVector2d;
    abs(): BpxVector2d;
    floor(): BpxVector2d;
    ceil(): BpxVector2d;
    round(): BpxVector2d;
    /**
     * "turn" – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    toAngle(): number;
    eq(other: BpxVector2d): boolean;
    eq(value: number): boolean;
    gt(other: BpxVector2d): boolean;
    gt(value: number): boolean;
    gte(other: BpxVector2d): boolean;
    gte(value: number): boolean;
    lt(other: BpxVector2d): boolean;
    lt(value: number): boolean;
    lte(other: BpxVector2d): boolean;
    lte(value: number): boolean;
    clamp(xy1: BpxVector2d, xy2: BpxVector2d): BpxVector2d;
    mod(other: BpxVector2d): BpxVector2d;
    mod(value: number): BpxVector2d;
    mod(x: number, y: number): BpxVector2d;
    add(other: BpxVector2d): BpxVector2d;
    add(value: number): BpxVector2d;
    add(x: number, y: number): BpxVector2d;
    sub(other: BpxVector2d): BpxVector2d;
    sub(value: number): BpxVector2d;
    sub(x: number, y: number): BpxVector2d;
    mul(other: BpxVector2d): BpxVector2d;
    mul(value: number): BpxVector2d;
    mul(x: number, y: number): BpxVector2d;
    div(other: BpxVector2d): BpxVector2d;
    div(value: number): BpxVector2d;
    div(x: number, y: number): BpxVector2d;
    __printDebug(): string;
}
declare const v_0_0_: BpxVector2d;
declare const v_1_1_: BpxVector2d;

type SpriteCreationHelper = (x1: number, y1: number, w: number, h: number) => BpxSprite;
declare function spr_(imageUrl: BpxImageUrl): SpriteCreationHelper;
declare class BpxSprite {
    imageUrl: BpxImageUrl;
    xy1: BpxVector2d;
    xy2: BpxVector2d;
    constructor(imageUrl: BpxImageUrl, xy1: BpxVector2d, xy2: BpxVector2d);
    size(): BpxVector2d;
}

type BpxCharSprite = {
    positionInText: BpxVector2d;
    sprite: BpxSprite;
    char: string;
};
type BpxFontId = string;
interface BpxFont {
    readonly id: BpxFontId;
    readonly imageUrl: BpxImageUrl;
    spritesFor(text: string): BpxCharSprite[];
}

type AssetsToLoad = {
    images: ImageAssetToLoad[];
    fonts: FontAssetToLoad[];
    sounds: SoundAssetToLoad[];
    jsons: JsonAssetToLoad[];
};
type BpxImageUrl = string;
type BpxSoundUrl = string;
type BpxJsonUrl = string;
type ImageAssetToLoad = {
    url: BpxImageUrl;
};
type FontAssetToLoad = {
    font: BpxFont;
    imageTextColor: BpxSolidColor;
    imageBgColor: BpxSolidColor;
};
type SoundAssetToLoad = {
    url: BpxSoundUrl;
};
type JsonAssetToLoad = {
    url: BpxJsonUrl;
};
type ImageAsset = {
    width: number;
    height: number;
    channels: 3 | 4;
    rgba8bitData: PngDataArray;
};
type FontAsset = {
    font: BpxFont;
    image: ImageAsset;
    imageTextColor: BpxSolidColor;
    imageBgColor: BpxSolidColor;
};
type SoundAsset = {
    audioBuffer: AudioBuffer;
};
type JsonAsset = {
    json: any;
};
declare class Assets {
    #private;
    constructor(params: {
        decodeAudioData: (arrayBuffer: ArrayBuffer) => Promise<AudioBuffer>;
    });
    loadAssets(assetsToLoad: AssetsToLoad): Promise<void>;
    /** NOTE: call `loadAssets` before this one */
    getImageAsset(urlOfAlreadyLoadedImage: BpxImageUrl): ImageAsset;
    /** NOTE: call `loadAssets` before this one */
    getFontAsset(fontId: BpxFontId): FontAsset;
    /** NOTE: call `loadAssets` before this one */
    getSoundAsset(urlOfAlreadyLoadedSound: BpxSoundUrl): SoundAsset;
    /** NOTE: call `loadAssets` before this one */
    getJsonAsset(urlOfAlreadyLoadedJson: BpxJsonUrl): JsonAsset;
}

type BpxEasingFn = (t: number) => number;
declare class BpxEasing {
    static linear: BpxEasingFn;
    static inQuadratic: BpxEasingFn;
    static outQuadratic: BpxEasingFn;
    static inQuartic: BpxEasingFn;
    static outQuartic: BpxEasingFn;
}

declare class BpxUtils {
    /**
     * NOTE: This function makes sense in a TypeScript codebase only.
     *
     * This function is meant to be used in a last branch of `if - else if - … - else`
     *   chain or in `default` of `switch - case - case - …`. Let's imagine there is
     *   a union type of which we check all possible cases. Someday we add one more
     *   type to the union, but we forget to extend our `switch` by that one more `case`.
     *   Thanks to `assertUnreachable(theValueOfThatUnionType)` the TypeScript checker
     *   will inform us about such mistake.
     *
     * @param thingThatShouldBeOfTypeNeverAtThisPoint - a value which we expect to be of type never
     */
    static assertUnreachable(thingThatShouldBeOfTypeNeverAtThisPoint: never): void;
    static booleanChangingEveryNthFrame(n: number): boolean;
    static clamp(a: number, b: number, c: number): number;
    static identity<Param>(param: Param): Param;
    static isDefined<Value>(value: Value | null | undefined): value is Value;
    static lerp(a: number, b: number, t: number): number;
    static measureText(text: string): BpxVector2d;
    static noop(): void;
    static offset8Directions(): BpxVector2d[];
    static printWithOutline(text: string, canvasXy1: BpxVector2d, textColor: BpxSolidColor, outlineColor: BpxSolidColor, centerXy?: [boolean, boolean]): void;
    static randomElementOf<V>(array: V[]): V | undefined;
    static range(n: number): number[];
    /**
     * To be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`.
     */
    static throwError(message: string): never;
    /**
     * @return turn angle. A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigAtan2(x: number, y: number): number;
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigCos(turnAngle: number): number;
    /**
     * @param turnAngle – A full circle turn = 1. In other words: 0 deg = 0 turn, 90 deg = 0.25 turn, 180 deg = 0.5 turn, 270 deg = 0.75 turn.
     */
    static trigSin(turnAngle: number): number;
    static wait(millis: number): Promise<void>;
}
declare const u_: typeof BpxUtils;

type BpxAudioPlaybackId = number;

type BpxSoundSequence = {
    intro?: BpxSoundSequenceEntry[];
    loop?: BpxSoundSequenceEntry[];
};
type BpxSoundSequenceEntry = [
    SoundSequenceEntrySoundMain,
    ...SoundSequenceEntrySoundAdditional[]
];
type SoundSequenceEntrySoundMain = BpxSoundUrl | {
    url: BpxSoundUrl;
    durationMs?: (fullSoundDurationMs: number) => number;
};
type SoundSequenceEntrySoundAdditional = BpxSoundUrl | {
    url: BpxSoundUrl;
};

type BpxBrowserType = "chromium" | "firefox_windows" | "firefox_other" | "safari" | "other";

declare class BpxFillPattern {
    #private;
    static of(bits: number): BpxFillPattern;
    static primaryOnly: BpxFillPattern;
    static secondaryOnly: BpxFillPattern;
    private constructor();
    hasPrimaryColorAt(x: number, y: number): boolean;
}

declare abstract class CanvasPixels {
    #private;
    readonly canvasSize: BpxVector2d;
    protected constructor(canvasSize: BpxVector2d);
    abstract setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void;
    abstract removeClippingRegion(): void;
    abstract canSetAny(xMin: number, yMin: number, xMax: number, yMax: number): boolean;
    abstract canSetAt(x: number, y: number): boolean;
    abstract set(color: BpxSolidColor, x: number, y: number): void;
    takeSnapshot(): BpxCanvasPixelsSnapshotId;
    getSnapshot(snapshotId: BpxCanvasPixelsSnapshotId): CanvasPixelsSnapshot | null;
    protected abstract newSnapshot(): CanvasPixelsSnapshot;
    abstract onWindowResize(): void;
    render(): void;
    protected abstract doRender(): void;
}

type BpxColorMapping = Array<{
    from: BpxSolidColor;
    to: BpxSolidColor | BpxTransparentColor;
}>;
type DrawApiOptions = {
    canvasPixels: CanvasPixels;
    assets: Assets;
};
declare class DrawApi {
    #private;
    constructor(options: DrawApiOptions);
    setCameraOffset(offset: BpxVector2d): void;
    setClippingRegion(xy: BpxVector2d, wh: BpxVector2d): void;
    removeClippingRegion(): void;
    setFillPattern(fillPattern: BpxFillPattern): void;
    mapSpriteColors(mapping: BpxColorMapping): BpxColorMapping;
    clearCanvas(color: BpxSolidColor): void;
    pixel(xy: BpxVector2d, color: BpxSolidColor): void;
    pixels(xy: BpxVector2d, color: BpxSolidColor, bits: string[]): void;
    line(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    rect(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    rectFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    ellipse(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    ellipseFilled(xy: BpxVector2d, wh: BpxVector2d, color: BpxSolidColor | BpxCompositeColor | BpxMappingColor): void;
    sprite(sprite: BpxSprite, canvasXy: BpxVector2d, scaleXy?: BpxVector2d): void;
    setFont(fontId: BpxFontId | null): void;
    getFont(): BpxFont | null;
    print(text: string, canvasXy: BpxVector2d, color: BpxSolidColor | ((charSprite: BpxCharSprite) => BpxSolidColor), centerXy?: [boolean, boolean]): void;
    takeCanvasSnapshot(): BpxCanvasPixelsSnapshotId;
}

declare class Button {
    #private;
    static readonly repeatingFramesStart = 30;
    static readonly repeatingFramesInterval = 8;
    get isPressed(): boolean;
    wasJustPressed(repeating: boolean): boolean;
    wasJustReleased(repeating: boolean): boolean;
    update(isPressed: boolean): void;
}

declare const supportedGamepadTypes: readonly ["xbox", "dualsense", "other"];
type BpxGamepadType = (typeof supportedGamepadTypes)[number];

type GameInputMethod = "gamepad" | "keyboard" | "mouse" | "touch";
type BpxGameInputEvent = null | "button_left" | "button_right" | "button_up" | "button_down" | "button_a" | "button_b" | "button_menu" | "mute_unmute_toggle" | "full_screen" | "debug_toggle" | "frame_by_frame_toggle" | "frame_by_frame_step";
declare class GameInput {
    #private;
    readonly gameButtons: Buttons;
    readonly buttonFullScreen: Button;
    readonly buttonMuteUnmute: Button;
    readonly buttonDebugToggle: Button;
    readonly buttonFrameByFrameToggle: Button;
    readonly buttonFrameByFrameStep: Button;
    constructor(params: {
        enableDebugInputs: boolean;
        browserType: BpxBrowserType;
    });
    startListening(): void;
    /**
     * @return If any interaction happened.
     */
    update(params: {
        skipGameButtons: boolean;
    }): boolean;
    mostRecentInputMethods(): Set<GameInputMethod>;
    connectedGamepadTypes(): Set<BpxGamepadType>;
    __internal__capturedEvents(): Set<BpxGameInputEvent>;
}

type BpxButtonName = "left" | "right" | "up" | "down" | "a" | "b" | "menu";
declare class Buttons {
    #private;
    update(events: Set<BpxGameInputEvent>): void;
    isPressed(button: BpxButtonName): boolean;
    areDirectionsPressedAsVector(): BpxVector2d;
    setRepeating(button: BpxButtonName, repeating: boolean): void;
    wasAnyJustPressed(): boolean;
    wasJustPressed(button: BpxButtonName): boolean;
    wasJustReleased(button: BpxButtonName): boolean;
}

declare function timer_(frames: number): BpxTimer;
declare class BpxTimer {
    #private;
    constructor(params: {
        frames: number;
    });
    get framesLeft(): number;
    get progress(): number;
    get hasFinished(): boolean;
    update(): void;
    restart(): void;
}

declare class AudioApi {
    #private;
    constructor(assets: Assets, audioContext: AudioContext);
    restart(): void;
    tryToResumeAudioContextSuspendedByBrowserForSecurityReasons(): Promise<boolean>;
    playSoundOnce(soundUrl: BpxSoundUrl, muteOnStart?: boolean): BpxAudioPlaybackId;
    playSoundLooped(soundUrl: BpxSoundUrl, muteOnStart?: boolean): BpxAudioPlaybackId;
    playSoundSequence(soundSequence: BpxSoundSequence, muteOnStart?: boolean): BpxAudioPlaybackId;
    isAudioMuted(): boolean;
    muteAudio(opts?: {
        fadeOutMillis?: number;
    }): void;
    unmuteAudio(opts?: {
        fadeInMillis?: number;
    }): void;
    mutePlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeOutMillis?: number;
    }): void;
    unmutePlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeInMillis?: number;
    }): void;
    pauseAudio(): void;
    resumeAudio(): void;
    stopAllPlaybacks(opts?: {
        fadeOutMillis?: number;
    }): void;
    stopPlayback(playbackId: BpxAudioPlaybackId, opts?: {
        fadeOutMillis?: number;
    }): void;
    __internal__audioContext(): AudioContext;
    __internal__globalGainNode(): GainNode;
}

declare class DebugMode {
    #private;
    static get enabled(): boolean;
    static set enabled(value: boolean);
}

declare global {
    interface Document {
        webkitFullscreenEnabled?: boolean;
        webkitFullscreenElement?: () => Element;
        webkitExitFullscreen?: () => void;
    }
    interface Element {
        webkitRequestFullscreen?: () => void;
    }
}
declare abstract class FullScreen {
    #private;
    isFullScreenSupported(): boolean;
    abstract isInFullScreen(): boolean;
    static create(): FullScreen;
    abstract toggleFullScreen(): void;
}

type PersistedStateValueContraints = Record<string, string | number | boolean | null>;
declare class StorageApi {
    #private;
    savePersistedState<PersistedStateValue extends PersistedStateValueContraints>(value: PersistedStateValue): void;
    loadPersistedState<PersistedStateValue extends PersistedStateValueContraints>(): PersistedStateValue | null;
    clearPersistedState(): void;
}

type FrameworkOptions = {
    gameCanvasSize: "64x64" | "128x128" | "256x256";
    desiredUpdateFps: 30 | 60;
    debugFeatures: boolean;
};
type OnAssetsLoaded = {
    startGame: () => void;
};
declare class Framework {
    #private;
    readonly gameInput: GameInput;
    readonly audioApi: AudioApi;
    readonly fullScreen: FullScreen;
    readonly storageApi: StorageApi;
    readonly assets: Assets;
    readonly drawApi: DrawApi;
    get frameNumber(): number;
    get renderFps(): number;
    constructor(options: FrameworkOptions);
    detectedBrowserType(): BpxBrowserType;
    init(assetsToLoad: AssetsToLoad): Promise<OnAssetsLoaded>;
    setOnStarted(onStarted: () => void): void;
    setOnUpdate(onUpdate: () => void): void;
    setOnDraw(onDraw: () => void): void;
    restart(): void;
}

declare class Logger {
    #private;
    static debugBeetPx(...args: any[]): void;
    static debug(...args: any[]): void;
    static infoBeetPx(...args: any[]): void;
    static info(...args: any[]): void;
    static warnBeetPx(...args: any[]): void;
    static warn(...args: any[]): void;
    static errorBeetPx(...args: any[]): void;
    static error(...args: any[]): void;
}

declare class BeetPx {
    #private;
    static init(frameworkOptions: FrameworkOptions, assetsToLoad: AssetsToLoad): ReturnType<Framework["init"]>;
    static get debug(): typeof DebugMode.enabled;
    /**
     * Number of frames processed since game started.
     * It gets reset to 0 when `BeetPx.restart()` is called.
     * It counts update calls, not draw calls.
     */
    static get frameNumber(): Framework["frameNumber"];
    static get renderFps(): Framework["renderFps"];
    static setOnStarted: Framework["setOnStarted"];
    static setOnUpdate: Framework["setOnUpdate"];
    static setOnDraw: Framework["setOnDraw"];
    static restart: Framework["restart"];
    static logDebug: typeof Logger.debug;
    static logInfo: typeof Logger.info;
    static logWarn: typeof Logger.warn;
    static logError: typeof Logger.error;
    static isPressed: Buttons["isPressed"];
    static areDirectionsPressedAsVector: Buttons["areDirectionsPressedAsVector"];
    static setRepeating: Buttons["setRepeating"];
    static wasJustPressed: Buttons["wasJustPressed"];
    static wasJustReleased: Buttons["wasJustReleased"];
    static mostRecentInputMethods: GameInput["mostRecentInputMethods"];
    static connectedGamepadTypes: GameInput["connectedGamepadTypes"];
    static __internal__capturedEvents: GameInput["__internal__capturedEvents"];
    static setCameraOffset: DrawApi["setCameraOffset"];
    static setClippingRegion: DrawApi["setClippingRegion"];
    static removeClippingRegion: DrawApi["removeClippingRegion"];
    static setFillPattern: DrawApi["setFillPattern"];
    static mapSpriteColors: DrawApi["mapSpriteColors"];
    static clearCanvas: DrawApi["clearCanvas"];
    static pixel: DrawApi["pixel"];
    static pixels: DrawApi["pixels"];
    static line: DrawApi["line"];
    static rect: DrawApi["rect"];
    static rectFilled: DrawApi["rectFilled"];
    static ellipse: DrawApi["ellipse"];
    static ellipseFilled: DrawApi["ellipseFilled"];
    static sprite: DrawApi["sprite"];
    static setFont: DrawApi["setFont"];
    static getFont: DrawApi["getFont"];
    static print: DrawApi["print"];
    static takeCanvasSnapshot: DrawApi["takeCanvasSnapshot"];
    static playSoundOnce: AudioApi["playSoundOnce"];
    static playSoundLooped: AudioApi["playSoundLooped"];
    static playSoundSequence: AudioApi["playSoundSequence"];
    static isAudioMuted: AudioApi["isAudioMuted"];
    static muteAudio: AudioApi["muteAudio"];
    static unmuteAudio: AudioApi["unmuteAudio"];
    static mutePlayback: AudioApi["mutePlayback"];
    static unmutePlayback: AudioApi["unmutePlayback"];
    static pauseAudio: AudioApi["pauseAudio"];
    static resumeAudio: AudioApi["resumeAudio"];
    static stopAllPlaybacks: AudioApi["stopAllPlaybacks"];
    static stopPlayback: AudioApi["stopPlayback"];
    static __internal__audioContext: AudioApi["__internal__audioContext"];
    static __internal__globalGainNode: AudioApi["__internal__globalGainNode"];
    static isFullScreenSupported: FullScreen["isFullScreenSupported"];
    static isInFullScreen: FullScreen["isInFullScreen"];
    static toggleFullScreen: FullScreen["toggleFullScreen"];
    static savePersistedState: StorageApi["savePersistedState"];
    static loadPersistedState: StorageApi["loadPersistedState"];
    static clearPersistedState: StorageApi["clearPersistedState"];
    static getImageAsset: Assets["getImageAsset"];
    static getFontAsset: Assets["getFontAsset"];
    static getSoundAsset: Assets["getSoundAsset"];
    static getJsonAsset: Assets["getJsonAsset"];
    static detectedBrowserType: Framework["detectedBrowserType"];
}
declare const b_: typeof BeetPx;

declare global {
    /**
     * Note: the generated documentation marks this variable as "Not Exported".
     *   This is *not* true.
     *
     * @notExported
     */
    const BEETPX__IS_PROD: boolean;
    /**
     * Note: the generated documentation marks this variable as "Not Exported".
     *   This is *not* true.
     *
     * @notExported
     */
    const BEETPX__VERSION: string;
}

export { BeetPx, BpxAudioPlaybackId, BpxBrowserType, BpxButtonName, BpxCanvasPixelsSnapshotId, BpxCharSprite, BpxColor, BpxColorId, BpxColorMapping, BpxCompositeColor, BpxEasing, BpxEasingFn, BpxFillPattern, BpxFont, BpxFontId, BpxGameInputEvent, BpxGamepadType, BpxImageUrl, BpxJsonUrl, BpxMappingColor, BpxSolidColor, BpxSoundSequence, BpxSoundSequenceEntry, BpxSoundUrl, BpxSprite, BpxTimer, BpxTransparentColor, BpxUtils, BpxVector2d, b_, black_, blue_, green_, red_, spr_, timer_, transparent_, u_, v_, v_0_0_, v_1_1_, white_ };
