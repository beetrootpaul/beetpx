import { BeetPx } from "../BeetPx";
import { BpxTimer } from "./Timer";
export class BpxTimerSequence {
    static of(params, opts) {
        return new BpxTimerSequence(params, opts);
    }
    
    #firstIterationPhases;
    #loopPhases;
    #firstIterationFrames;
    #loopFrames;
    
    #firstIterationOffset;
    #ignoreGlobalPause;
    #onGamePause;
    #isPaused;
    #pausedFrame;
    #firstIterationTimer;
    #loopTimer;
    #recentlyComputedNow;
    constructor(params, opts) {
        this.#ignoreGlobalPause = opts.onGamePause === "ignore";
        this.#onGamePause = opts.onGamePause;
        this.#firstIterationPhases = [...params.intro, ...params.loop].map(entry => ({
            name: entry[0],
            frames: Math.max(0, Math.round(entry[1])),
        }));
        this.#loopPhases = params.loop.map(entry => ({
            name: entry[0],
            frames: Math.max(0, Math.round(entry[1])),
        }));
        this.#firstIterationFrames = this.#firstIterationPhases.reduce((acc, p) => acc + p.frames, 0);
        this.#loopFrames = this.#loopPhases.reduce((acc, p) => acc + p.frames, 0);
        this.#firstIterationOffset = this.#fn + opts.delayFrames;
        this.#firstIterationTimer = BpxTimer.for({
            frames: this.#firstIterationFrames,
            loop: false,
            pause: opts.pause,
            delayFrames: opts.delayFrames,
            onGamePause: this.#onGamePause,
        });
        this.#loopTimer =
            this.#loopPhases.length > 0 ?
                BpxTimer.for({
                    frames: this.#loopFrames,
                    loop: true,
                    pause: opts.pause,
                    delayFrames: opts.delayFrames + this.#firstIterationFrames,
                    onGamePause: this.#onGamePause,
                })
                : null;
        this.#isPaused = false;
        this.#pausedFrame = null;
        if (opts.pause) {
            this.pause();
        }
    }
    get #now() {
        if (this.#recentlyComputedNow?.frameNumber === (this.#pausedFrame ?? this.#fn)) {
            return this.#recentlyComputedNow.value;
        }
        
        
        
        if (!this.#loopTimer ||
            (this.#pausedFrame ?? this.#fn) <
                this.#firstIterationOffset + this.#firstIterationFrames) {
            const firstIterationT = this.#firstIterationTimer.t;
            let offset = 0;
            let prev = null;
            let i = 0;
            while (i < this.#firstIterationPhases.length - 1) {
                let curr = this.#firstIterationPhases[i];
                if (firstIterationT < offset + curr.frames) {
                    return {
                        recentlyFinishedPhase: prev?.name ?? null,
                        phase: curr,
                        t: firstIterationT - offset,
                    };
                }
                offset += curr.frames;
                prev = curr;
                i += 1;
            }
            let curr = this.#firstIterationPhases[i] ?? null;
            return {
                recentlyFinishedPhase: this.#firstIterationTimer.hasJustFinished ?
                    (curr?.name ?? null)
                    : (prev?.name ?? null),
                phase: curr,
                t: firstIterationT - offset,
            };
        }
        
        
        
        const loopT = this.#loopTimer.t;
        let offset = 0;
        let prev = this.#firstIterationPhases[this.#firstIterationPhases.length - 1] ?? null;
        let i = 0;
        while (i < this.#loopPhases.length - 1) {
            let curr = this.#loopPhases[i];
            if (loopT < offset + curr.frames) {
                return {
                    recentlyFinishedPhase: prev?.name ?? null,
                    phase: curr,
                    t: loopT - offset,
                };
            }
            offset += curr.frames;
            prev = curr;
            i += 1;
        }
        let curr = this.#loopPhases[i] ?? null;
        return {
            recentlyFinishedPhase: prev?.name ?? null,
            phase: curr,
            t: loopT - offset,
        };
    }
    get justFinishedPhase() {
        return this.hasJustFinishedOverall || this.#now.t === 0 ?
            this.#now.recentlyFinishedPhase
            : null;
    }
    get currentPhase() {
        return this.#now.phase?.name ?? null;
    }
    get #fn() {
        return this.#ignoreGlobalPause ?
            BeetPx.frameNumber
            : BeetPx.frameNumberOutsidePause;
    }
    get t() {
        return this.#now.t;
    }
    get progress() {
        return this.#now.phase && this.#now.phase.frames > 0 ?
            this.#now.t / this.#now.phase.frames
            : 1;
    }
    get framesLeft() {
        return this.#now.phase ? this.#now.phase.frames - this.#now.t : 0;
    }
    get tOverall() {
        return this.#firstIterationTimer.hasFinished ?
            (this.#loopTimer?.t ?? this.#firstIterationTimer.t)
            : this.#firstIterationTimer.t;
    }
    get framesLeftOverall() {
        return this.#firstIterationTimer.hasFinished ?
            (this.#loopTimer?.framesLeft ?? this.#firstIterationTimer.framesLeft)
            : this.#firstIterationTimer.framesLeft;
    }
    get progressOverall() {
        return this.#firstIterationTimer.hasFinished ?
            (this.#loopTimer?.progress ?? this.#firstIterationTimer.progress)
            : this.#firstIterationTimer.progress;
    }
    get hasFinishedOverall() {
        return this.#firstIterationTimer.hasFinished;
    }
    get hasJustFinishedOverall() {
        return (this.#loopTimer?.hasJustFinished ||
            this.#firstIterationTimer.hasJustFinished);
    }
    pause() {
        if (this.#isPaused)
            return;
        this.#isPaused = true;
        this.#pausedFrame = this.#fn;
        this.#firstIterationTimer.pause();
        this.#loopTimer?.pause();
    }
    resume() {
        if (!this.#isPaused)
            return;
        this.#isPaused = false;
        this.#firstIterationOffset += this.#fn - (this.#pausedFrame ?? 0);
        this.#pausedFrame = null;
        this.#firstIterationTimer.resume();
        this.#loopTimer?.resume();
    }
    restart() {
        this.#firstIterationOffset = this.#fn;
        this.#isPaused = false;
        this.#pausedFrame = null;
        this.#firstIterationTimer.restart();
        if (this.#loopTimer) {
            this.#loopTimer = BpxTimer.for({
                frames: this.#loopFrames,
                loop: true,
                pause: false,
                delayFrames: this.#firstIterationFrames,
                onGamePause: this.#onGamePause,
            });
        }
    }
}
