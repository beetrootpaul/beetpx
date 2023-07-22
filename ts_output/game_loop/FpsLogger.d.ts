export interface FpsLogger {
    get mostRecentAverageFps(): number;
    track(fps: number): void;
}
export declare class FpsLoggerNoop implements FpsLogger {
    get mostRecentAverageFps(): number;
    track(_fps: number): void;
}
export declare class FpsLoggerAverage implements FpsLogger {
    #private;
    get mostRecentAverageFps(): number;
    track(fps: number): void;
}
