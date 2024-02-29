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
var _BpxTimerSequence_instances, _BpxTimerSequence_introFrames, _BpxTimerSequence_loopFrames, _BpxTimerSequence_firstIterationTimer, _BpxTimerSequence_loopTimer, _BpxTimerSequence_introPhases, _BpxTimerSequence_loopPhases, _BpxTimerSequence_offsetFrame, _BpxTimerSequence_recentlyComputedNow, _BpxTimerSequence_now_get, _BpxTimerSequence_frames_get, _BpxTimerSequence_tRaw_get, _BpxTimerSequence_tOverallRaw_get;
import { BeetPx } from "../BeetPx";
import { BpxUtils } from "../Utils";
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
        _BpxTimerSequence_introFrames.set(this, void 0);
        _BpxTimerSequence_loopFrames.set(this, void 0);
        _BpxTimerSequence_firstIterationTimer.set(this, void 0);
        _BpxTimerSequence_loopTimer.set(this, void 0);
        _BpxTimerSequence_introPhases.set(this, void 0);
        _BpxTimerSequence_loopPhases.set(this, void 0);
        _BpxTimerSequence_offsetFrame.set(this, 0);
        _BpxTimerSequence_recentlyComputedNow.set(this, void 0);
        __classPrivateFieldSet(this, _BpxTimerSequence_introPhases, params.intro.map((entry) => ({
            name: entry[0],
            frames: entry[1],
            timer: BpxTimer.for({
                frames: entry[1],
                loop: false,
                pause: false,
                delayFrames: 0,
            }),
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopPhases, params.loop.map((entry) => ({
            name: entry[0],
            frames: entry[1],
            timer: BpxTimer.for({
                frames: entry[1],
                loop: false,
                pause: false,
                delayFrames: 0,
            }),
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_introFrames, __classPrivateFieldGet(this, _BpxTimerSequence_introPhases, "f").reduce((acc, p) => acc + p.frames, 0), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopFrames, __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").reduce((acc, p) => acc + p.frames, 0), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationTimer, BpxTimer.for({
            frames: __classPrivateFieldGet(this, _BpxTimerSequence_introFrames, "f") + __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f"),
            loop: false,
            pause: false,
            delayFrames: 0,
        }), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopTimer, __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length > 0
            ? BpxTimer.for({
                frames: __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f"),
                loop: true,
                pause: false,
                delayFrames: __classPrivateFieldGet(this, _BpxTimerSequence_introFrames, "f") + __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f"),
            })
            : null, "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_offsetFrame, BeetPx.frameNumber, "f");
    }
    
    get tmpTRaw() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tRaw_get);
    }
    
    get tmpNow() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get);
    }
    get justFinishedPhase() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")
            ? __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tOverallRaw_get) > 0 && this.t === 0
                ? __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).recentlyFinished
                : null
            : __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tRaw_get) === 0 || __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tRaw_get) === __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_frames_get)
                ? __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).recentlyFinished
                : null;
    }
    get currentPhase() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).phase;
    }
    get t() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")
            ? BpxUtils.mod(this.tmpTRaw, __classPrivateFieldGet(this, _BpxTimerSequence_introFrames, "f") + __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f"))
            : Math.min(__classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tRaw_get), __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_frames_get));
    }
    get progress() {
        const f = __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_frames_get);
        return this.t / f;
    }
    get framesLeft() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_frames_get) - this.t;
    }
    get tOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length > 0
            ? BpxUtils.mod(__classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tOverallRaw_get), __classPrivateFieldGet(this, _BpxTimerSequence_introFrames, "f") + __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f"))
            : 
                Math.min(__classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tOverallRaw_get), __classPrivateFieldGet(this, _BpxTimerSequence_introFrames, "f"));
    }
    get framesLeftOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")
            ? __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasFinished
                ? __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f").framesLeft
                : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").framesLeft
            : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").framesLeft;
    }
    get progressOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")
            ? __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasFinished
                ? __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f").progress
                : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").progress
            : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").progress;
    }
    get hasFinishedOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasFinished;
    }
    get hasJustFinishedOverall() {
        return (__classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasJustFinished ||
            (__classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")?.hasJustFinished ?? false));
    }
}
_BpxTimerSequence_introFrames = new WeakMap(), _BpxTimerSequence_loopFrames = new WeakMap(), _BpxTimerSequence_firstIterationTimer = new WeakMap(), _BpxTimerSequence_loopTimer = new WeakMap(), _BpxTimerSequence_introPhases = new WeakMap(), _BpxTimerSequence_loopPhases = new WeakMap(), _BpxTimerSequence_offsetFrame = new WeakMap(), _BpxTimerSequence_recentlyComputedNow = new WeakMap(), _BpxTimerSequence_instances = new WeakSet(), _BpxTimerSequence_now_get = function _BpxTimerSequence_now_get() {
    if (__classPrivateFieldGet(this, _BpxTimerSequence_recentlyComputedNow, "f")?.frameNumber === BeetPx.frameNumber) {
        return __classPrivateFieldGet(this, _BpxTimerSequence_recentlyComputedNow, "f").value;
    }
    let offset = __classPrivateFieldGet(this, _BpxTimerSequence_offsetFrame, "f");
    let prev = undefined;
    let curr = __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length > 0
        ? __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f")[__classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length - 1]
        : undefined;
    let i = 0;
    while (i < __classPrivateFieldGet(this, _BpxTimerSequence_introPhases, "f").length) {
        prev = curr;
        curr = __classPrivateFieldGet(this, _BpxTimerSequence_introPhases, "f")[i];
        if (!curr)
            break;
        if (curr.frames > BeetPx.frameNumber - offset) {
            return {
                phase: curr.name,
                offsetCurr: offset,
                offsetNext: offset + curr.frames,
                recentlyFinished: prev?.name ?? null,
                
                
                curr1: curr,
                
                
                prev1: prev,
            };
        }
        offset += curr.frames;
        i += 1;
    }
    i = 0;
    while (i < __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length) {
        prev = curr;
        curr = __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f")[i];
        if (!curr)
            break;
        if (curr.frames >
            BpxUtils.mod(BeetPx.frameNumber - offset, __classPrivateFieldGet(this, _BpxTimerSequence_introFrames, "f") + __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f"))) {
            return {
                phase: curr.name,
                offsetCurr: offset,
                offsetNext: offset + curr.frames,
                recentlyFinished: prev?.name ?? null,
                
                
                curr2: curr,
                
                
                prev2: prev,
            };
        }
        offset += curr.frames;
        i += 1;
    }
    if (curr) {
        offset -= curr.frames;
    }
    return {
        
        phase: curr.name,
        offsetCurr: offset,
        
        offsetNext: offset + curr.frames,
        recentlyFinished: curr?.name ?? null,
        
        
        curr3: curr,
        
        
        prev3: prev,
    };
}, _BpxTimerSequence_frames_get = function _BpxTimerSequence_frames_get() {
    const ctx = __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get);
    return ctx.offsetNext - ctx.offsetCurr;
}, _BpxTimerSequence_tRaw_get = function _BpxTimerSequence_tRaw_get() {
    return BeetPx.frameNumber - __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).offsetCurr;
}, _BpxTimerSequence_tOverallRaw_get = function _BpxTimerSequence_tOverallRaw_get() {
    return BeetPx.frameNumber - __classPrivateFieldGet(this, _BpxTimerSequence_offsetFrame, "f");
};
