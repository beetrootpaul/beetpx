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
var _BpxTimerSequence_instances, _BpxTimerSequence_firstIterationPhases, _BpxTimerSequence_loopPhases, _BpxTimerSequence_firstIterationFrames, _BpxTimerSequence_loopFrames, _BpxTimerSequence_firstIterationOffset, _BpxTimerSequence_loopOffset, _BpxTimerSequence_firstIterationTimer, _BpxTimerSequence_loopTimer, _BpxTimerSequence_recentlyComputedNow, _BpxTimerSequence_now_get, _BpxTimerSequence_frames_get, _BpxTimerSequence_tRaw_get;
import { BeetPx } from "../BeetPx";
import { u_ } from "../Utils";
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
        _BpxTimerSequence_firstIterationTimer.set(this, void 0);
        _BpxTimerSequence_loopTimer.set(this, void 0);
        _BpxTimerSequence_recentlyComputedNow.set(this, void 0);
        
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationPhases, [...params.intro, ...params.loop].map((entry) => ({
            name: entry[0],
            frames: entry[1],
            
            
            
            
            
            
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopPhases, params.loop.map((entry) => ({
            name: entry[0],
            frames: entry[1],
            
            
            
            
            
            
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationFrames, __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f").reduce((acc, p) => acc + p.frames, 0), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopFrames, __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").reduce((acc, p) => acc + p.frames, 0), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationOffset, BeetPx.frameNumber, "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopOffset, __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationOffset, "f") + __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationFrames, "f"), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_firstIterationTimer, BpxTimer.for({
            frames: __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f") - __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationOffset, "f"),
            loop: false,
            pause: false,
            delayFrames: 0,
        }), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopTimer, __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length > 0
            ? BpxTimer.for({
                frames: __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f"),
                loop: true,
                pause: false,
                delayFrames: __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f") - __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationOffset, "f"),
            })
            : null, "f");
    }
    
    
    
    
    
    
    
    
    get justFinishedPhase() {
        return null;
        
        
        
        
        
        
        
    }
    get currentPhase() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_instances, "a", _BpxTimerSequence_now_get).phase;
    }
    get t() {
        return 123;
        
        
        
        
        
    }
    get progress() {
        return 123;
        
        
    }
    get framesLeft() {
        return 123;
        
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
}
_BpxTimerSequence_firstIterationPhases = new WeakMap(), _BpxTimerSequence_loopPhases = new WeakMap(), _BpxTimerSequence_firstIterationFrames = new WeakMap(), _BpxTimerSequence_loopFrames = new WeakMap(), _BpxTimerSequence_firstIterationOffset = new WeakMap(), _BpxTimerSequence_loopOffset = new WeakMap(), _BpxTimerSequence_firstIterationTimer = new WeakMap(), _BpxTimerSequence_loopTimer = new WeakMap(), _BpxTimerSequence_recentlyComputedNow = new WeakMap(), _BpxTimerSequence_instances = new WeakSet(), _BpxTimerSequence_now_get = function _BpxTimerSequence_now_get() {
    if (__classPrivateFieldGet(this, _BpxTimerSequence_recentlyComputedNow, "f")?.frameNumber === BeetPx.frameNumber) {
        return __classPrivateFieldGet(this, _BpxTimerSequence_recentlyComputedNow, "f").value;
    }
    
    
    
    if (BeetPx.frameNumber < __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f") || !__classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")) {
        let offset = __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationOffset, "f");
        let i = 0;
        while (i < __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f").length - 1) {
            let p = __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f")[i];
            if (BeetPx.frameNumber < offset + p.frames) {
                return {
                    phase: p.name,
                };
            }
            offset += p.frames;
            i += 1;
        }
        return {
            phase: __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationPhases, "f")[i].name,
        };
    }
    
    
    
    let offset = __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f");
    let i = 0;
    while (i < __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f").length - 1) {
        let p = __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f")[i];
        if (u_.mod(BeetPx.frameNumber - __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f"), __classPrivateFieldGet(this, _BpxTimerSequence_loopFrames, "f")) <
            offset + p.frames - __classPrivateFieldGet(this, _BpxTimerSequence_loopOffset, "f")) {
            return {
                phase: p.name,
            };
        }
        offset += p.frames;
        i += 1;
    }
    return {
        phase: __classPrivateFieldGet(this, _BpxTimerSequence_loopPhases, "f")[i].name,
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}, _BpxTimerSequence_frames_get = function _BpxTimerSequence_frames_get() {
    return 123;
    
    
}, _BpxTimerSequence_tRaw_get = function _BpxTimerSequence_tRaw_get() {
    return 123;
    
};
