export interface FpsLogger {
    track(fps: number): void;
}
export declare class FpsLoggerNoop implements FpsLogger {
    track(_fps: number): void;
}
export declare class FpsLoggerAverage implements FpsLogger {
    #private;
    track(fps: number): void;
}
