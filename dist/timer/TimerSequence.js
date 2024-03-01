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
var _BpxTimerSequence_instances, _BpxTimerSequence_introPhases, _BpxTimerSequence_loopPhases, _BpxTimerSequence_introFrames, _BpxTimerSequence_loopFrames, _BpxTimerSequence_firstIterationTimer, _BpxTimerSequence_loopTimer, _BpxTimerSequence_frames_get, _BpxTimerSequence_tRaw_get;
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
        _BpxTimerSequence_introPhases.set(this, void 0);
        _BpxTimerSequence_loopPhases.set(this, void 0);
        _BpxTimerSequence_introFrames.set(this, void 0);
        _BpxTimerSequence_loopFrames.set(this, void 0);
        _BpxTimerSequence_firstIterationTimer.set(this, void 0);
        _BpxTimerSequence_loopTimer.set(this, void 0);
        
        __classPrivateFieldSet(this, _BpxTimerSequence_introPhases, params.intro.map((entry) => ({
            
            frames: entry[1],
            
            
            
            
            
            
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_loopPhases, params.loop.map((entry) => ({
            
            frames: entry[1],
            
            
            
            
            
            
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
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    get justFinishedPhase() {
        return null;
        
        
        
        
        
        
        
    }
    get currentPhase() {
        return "aaa";
        
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
        return __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f")
            ? __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").hasFinished
                ? __classPrivateFieldGet(this, _BpxTimerSequence_loopTimer, "f").t
                : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").t
            : __classPrivateFieldGet(this, _BpxTimerSequence_firstIterationTimer, "f").t;
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
        return true;
        
    }
    get hasJustFinishedOverall() {
        return true;
        
        
        
        
    }
}
_BpxTimerSequence_introPhases = new WeakMap(), _BpxTimerSequence_loopPhases = new WeakMap(), _BpxTimerSequence_introFrames = new WeakMap(), _BpxTimerSequence_loopFrames = new WeakMap(), _BpxTimerSequence_firstIterationTimer = new WeakMap(), _BpxTimerSequence_loopTimer = new WeakMap(), _BpxTimerSequence_instances = new WeakSet(), _BpxTimerSequence_frames_get = function _BpxTimerSequence_frames_get() {
    return 123;
    
    
}, _BpxTimerSequence_tRaw_get = function _BpxTimerSequence_tRaw_get() {
    return 123;
    
};
