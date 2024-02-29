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
var _BpxTimerSequence_instances, _BpxTimerSequence_framesOverall, _BpxTimerSequence_globalTimer, _BpxTimerSequence_phases, _BpxTimerSequence_loop, _BpxTimerSequence_offsetFrame, _BpxTimerSequence_recentlyComputedNow, _BpxTimerSequence_now_get, _BpxTimerSequence_frames_get, _BpxTimerSequence_tRaw_get, _BpxTimerSequence_tOverallRaw_get;
import { BeetPx } from "../BeetPx";
import { BpxUtils } from "../Utils";
import { BpxTimer } from "./Timer";
export function timerSeq_(params, opts) {
    return BpxTimerSequence.of({
        intro: params.intro ?? [],
        loop: params.loop ?? [],
    }, {
        pause: opts?.pause ?? false,
    });
}



export class BpxTimerSequence {
    static of(params, opts) {
        return new BpxTimerSequence(params, opts);
    }
    constructor(params, opts) {
        
        _BpxTimerSequence_instances.add(this);
        _BpxTimerSequence_framesOverall.set(this, void 0);
        _BpxTimerSequence_globalTimer.set(this, void 0);
        _BpxTimerSequence_phases.set(this, void 0);
        _BpxTimerSequence_loop.set(this, void 0);
        _BpxTimerSequence_offsetFrame.set(this, 0);
        _BpxTimerSequence_recentlyComputedNow.set(this, void 0);
        __classPrivateFieldSet(this, _BpxTimerSequence_phases, [...params.intro, ...params.loop].map((entry) => ({
            name: entry[0],
            frames: entry[1],
            timer: BpxTimer.for({ frames: entry[1], loop: false, pause: false }),
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loop, params.loop.length > 0, "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_framesOverall, __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f").reduce((acc, p) => acc + p.frames, 0), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_globalTimer, BpxTimer.for({
            frames: __classPrivateFieldGet(this, _BpxTimerSequence_framesOverall, "f"),
            loop: __classPrivateFieldGet(this, _BpxTimerSequence_loop, "f"),
            pause: false,
        }), "f");
        
        __classPrivateFieldSet(this, _BpxTimerSequence_offsetFrame, BeetPx.frameNumber, "f");
    }
    
    get tmpTRaw() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tRaw_get);
    }
    
    get tmpNow() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get);
    }
    get justFinishedPhase() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_loop, "f")
            ? this.t === 0
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
        
        return __classPrivateFieldGet(this, _BpxTimerSequence_loop, "f")
            ? BpxUtils.mod(this.tmpTRaw, __classPrivateFieldGet(this, _BpxTimerSequence_framesOverall, "f"))
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
        return __classPrivateFieldGet(this, _BpxTimerSequence_loop, "f")
            ? BpxUtils.mod(__classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tOverallRaw_get), __classPrivateFieldGet(this, _BpxTimerSequence_framesOverall, "f"))
            : 
                Math.min(__classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_tOverallRaw_get), __classPrivateFieldGet(this, _BpxTimerSequence_framesOverall, "f"));
        
        
        
        
        
        
    }
    get framesLeftOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_globalTimer, "f").framesLeft;
    }
    get progressOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_globalTimer, "f").progress;
    }
    get hasFinishedOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_globalTimer, "f").hasFinished;
    }
    get hasJustFinishedOverall() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_globalTimer, "f").hasJustFinished;
    }
}
_BpxTimerSequence_framesOverall = new WeakMap(), _BpxTimerSequence_globalTimer = new WeakMap(), _BpxTimerSequence_phases = new WeakMap(), _BpxTimerSequence_loop = new WeakMap(), _BpxTimerSequence_offsetFrame = new WeakMap(), _BpxTimerSequence_recentlyComputedNow = new WeakMap(), _BpxTimerSequence_instances = new WeakSet(), _BpxTimerSequence_now_get = function _BpxTimerSequence_now_get() {
    if (__classPrivateFieldGet(this, _BpxTimerSequence_recentlyComputedNow, "f")?.frameNumber === BeetPx.frameNumber) {
        return __classPrivateFieldGet(this, _BpxTimerSequence_recentlyComputedNow, "f").value;
    }
    let offset = __classPrivateFieldGet(this, _BpxTimerSequence_offsetFrame, "f");
    let i = 0;
    let prev = undefined;
    let curr = undefined;
    while (i < __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f").length) {
        prev =
            i > 0
                ? __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f")[i - 1]
                : __classPrivateFieldGet(this, _BpxTimerSequence_loop, "f")
                    ? __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f")[__classPrivateFieldGet(this, _BpxTimerSequence_phases, "f").length - 1]
                    : undefined;
        curr = __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f")[i];
        if (!curr) {
            break;
        }
        if (__classPrivateFieldGet(this, _BpxTimerSequence_loop, "f")
            ? curr.frames >
                BpxUtils.mod(BeetPx.frameNumber - offset, __classPrivateFieldGet(this, _BpxTimerSequence_framesOverall, "f"))
            : curr.frames > BeetPx.frameNumber - offset) {
            return {
                phase: curr.name,
                offsetCurr: offset,
                offsetNext: offset + curr.frames,
                recentlyFinished: prev?.name ?? null,
                
                
                prev: prev,
                
                
                i: i,
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
        
        
        prev2: prev,
    };
}, _BpxTimerSequence_frames_get = function _BpxTimerSequence_frames_get() {
    const ctx = __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get);
    return ctx.offsetNext - ctx.offsetCurr;
}, _BpxTimerSequence_tRaw_get = function _BpxTimerSequence_tRaw_get() {
    return BeetPx.frameNumber - __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).offsetCurr;
}, _BpxTimerSequence_tOverallRaw_get = function _BpxTimerSequence_tOverallRaw_get() {
    return BeetPx.frameNumber - __classPrivateFieldGet(this, _BpxTimerSequence_offsetFrame, "f");
};
