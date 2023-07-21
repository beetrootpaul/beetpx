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
export declare abstract class FullScreen {
    static newFor(fullScreenSubjectSelector: string, buttonsSelector: string): FullScreen;
    abstract toggle(): void;
}
