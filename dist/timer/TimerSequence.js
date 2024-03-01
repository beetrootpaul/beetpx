var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxTimerSequence_instances, _BpxTimerSequence_firstIterationPhases, _BpxTimerSequence_loopPhases, _BpxTimerSequence_firstIterationFrames, _BpxTimerSequence_loopFrames, _BpxTimerSequence_firstIterationOffset, _BpxTimerSequence_loopOffset, _BpxTimerSequence_pausedFrame, _BpxTimerSequence_firstIterationTimer, _BpxTimerSequence_loopTimer, _BpxTimerSequence_recentlyComputedNow, _BpxTimerSequence_now_get;
import { BeetPx } from "../BeetPx";
import { BpxTimer } from "./Timer";
export function timerSeq_(params, opts) {
    return BpxTimerSequence.of({
        intro: params.intro ?? [],
        loop: params.loop ?? [],
    }, {
        pause: opts?.pause ?? false,
        delayFrames: opts?.delayFrames ?? 0,
    });
}

export class BpxTimerSequence {
    static of(params, opts) {
        return new BpxTimerSequence(params, opts);
    }
    constructor(params, opts) {
        _BpxTimerSequence_instances.add(this);
        
        _BpxTimerSequence_firstIterationPhases.set(this, void 0);
        _BpxTimerSequence_loopPhases.set(this, void 0);
        _BpxTimerSequence_firstIterationFrames.set(this, void 0);
        _BpxTimerSequence_loopFrames.set(this, void 0);
        
        _BpxTimerSequence_firstIterationOffset.set(this, void 0);
        _BpxTimerSequence_loopOffset.set(this, void 0);
        _BpxTimerSequence_pausedFrame.set(this, void 0);
        _BpxTimerSequence_firstIterationTimer.set(this, void 0);
        _BpxTimerSequence_loopTimer.set(this, void 0);
        _BpxTimerSequence_recentlyComputedNow.set(this, void 0);
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationPhases, [...params.intro, ...params.loop].map((entry) => ({
            name: entry[0],
            frames: Math.max(0, Math.round(entry[1])),
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopPhases, params.loop.map((entry) => ({
            name: entry[0],
            frames: Math.max(0, Math.round(entry[1])),
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationFrames, __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f").reduce((acc, p) => acc + p.frames, 0), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopFrames, __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").reduce((acc, p) => acc + p.frames, 0), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationOffset, BeetPx.frameNumber + opts.delayFrames, "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopOffset, __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationOffset, "f") + __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationFrames, "f"), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationTimer, BpxTimer.for({
            frames: __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f") - __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationOffset, "f"),
            loop: false,
            pause: false,
            delayFrames: opts.delayFrames,
        }), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopTimer, __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length > 0
            ? BpxTimer.for({
                frames: __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f"),
                loop: true,
                pause: false,
                delayFrames: __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f") - __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationOffset, "f"),
            })
            : null, "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_pausedFrame, null, "f");
        if (opts.pause) {
            this.pause();
        }
    }
    get justFinishedPhase() {
        return this.hasJustFinishedOverall || __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).t === 0
            ? __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).recentlyFinishedPhase
            : null;
    }
    get currentPhase() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).phase?.name ?? null;
    }
    get t() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).t;
    }
    get progress() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).phase && __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).phase.frames > 0
            ? __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).t / __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).phase.frames
            : 1;
    }
    get framesLeft() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).phase ? __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).phase.frames - __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).t : 0;
    }
    get tOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasFinished
            ? __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")?.t ?? __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").t
            : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").t;
    }
    get framesLeftOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasFinished
            ? __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")?.framesLeft ?? __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").framesLeft
            : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").framesLeft;
    }
    get progressOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasFinished
            ? __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")?.progress ?? __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").progress
            : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").progress;
    }
    get hasFinishedOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasFinished;
    }
    get hasJustFinishedOverall() {
        return (__classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")?.hasJustFinished ||
            __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasJustFinished);
    }
    pause() {
        if (__classPrivateFieldGet(this, _BpxTimerSequence_pausedFrame, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _BpxTimerSequence_pausedFrame, BeetPx.frameNumber, "f");
        __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").pause();
        __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")?.pause();
    }
    resume() {
        if (!__classPrivateFieldGet(this, _BpxTimerSequence_pausedFrame, "f")) {
            return;
        }
        
        
        __classPrivateFieldSet(this, _BpxTimerSequence_pausedFrame, null, "f");
        __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").resume();
        __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")?.resume();
    }
    restart() {
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationOffset, BeetPx.frameNumber, "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopOffset, __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationOffset, "f") + __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationFrames, "f"), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_pausedFrame, null, "f");
        __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").restart();
        
        
    }
}
_BpxTimerSequence_firstIterationPhases = new WeakMap(), _BpxTimerSequence_loopPhases = new WeakMap(), _BpxTimerSequence_firstIterationFrames = new WeakMap(), _BpxTimerSequence_loopFrames = new WeakMap(), _BpxTimerSequence_firstIterationOffset = new WeakMap(), _BpxTimerSequence_loopOffset = new WeakMap(), _BpxTimerSequence_pausedFrame = new WeakMap(), _BpxTimerSequence_firstIterationTimer = new WeakMap(), _BpxTimerSequence_loopTimer = new WeakMap(), _BpxTimerSequence_recentlyComputedNow = new WeakMap(), _BpxTimerSequence_instances = new WeakSet(), _BpxTimerSequence_now_get = function _BpxTimerSequence_now_get() {
    if (__classPrivateFieldGet(this, _BpxTimerSequence_recentlyComputedNow, "f")?.frameNumber ===
        (__classPrivateFieldGet(this, _BpxTimerSequence_pausedFrame, "f") ?? BeetPx.frameNumber)) {
        return __classPrivateFieldGet(this, _BpxTimerSequence_recentlyComputedNow, "f").value;
    }
    
    
    
    if (!__classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f") ||
        (__classPrivateFieldGet(this, _BpxTimerSequence_pausedFrame, "f") ?? BeetPx.frameNumber) < __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f")) {
        const firstIterationT = __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").t;
        let offset = 0;
        let prev = null;
        let i = 0;
        while (i < __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f").length - 1) {
            let curr = __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f")[i];
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
        let curr = __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f")[i] ?? null;
        return {
            recentlyFinishedPhase: __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasJustFinished
                ? curr?.name ?? null
                : prev?.name ?? null,
            phase: curr,
            t: firstIterationT - offset,
        };
    }
    
    
    
    const loopT = __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f").t;
    let offset = 0;
    let prev = __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f")[__classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f").length - 1] ?? null;
    let i = 0;
    while (i < __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length - 1) {
        let curr = __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f")[i];
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
    let curr = __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f")[i] ?? null;
    return {
        recentlyFinishedPhase: prev?.name ?? null,
        phase: curr,
        t: loopT - offset,
    };
};
