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
var _BpxTimerSequence_phases, _BpxTimerSequence_frames, _BpxTimerSequence_offsetFrame;
import { BeetPx } from "../BeetPx";
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
        
        _BpxTimerSequence_phases.set(this, void 0);
        _BpxTimerSequence_frames.set(this, void 0);
        _BpxTimerSequence_offsetFrame.set(this, 0);
        __classPrivateFieldSet(this, _BpxTimerSequence_phases, params.intro.map((entry) => ({
            name: entry[0],
            frames: entry[1],
            timer: BpxTimer.for({ frames: entry[1], loop: false, pause: false }),
        })), "f");
        __classPrivateFieldSet(this, _BpxTimerSequence_frames, __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f").reduce((acc, p) => acc + p.frames, 0), "f");
        
        __classPrivateFieldSet(this, _BpxTimerSequence_offsetFrame, BeetPx.frameNumber, "f");
    }
    
    get justFinishedPhase() {
        
        return null;
    }
    
    get phase() {
        
        return "aaa";
    }
    
    get phaseTimer() {
        let tmp = this.t;
        let idx = 0;
        
        
        while (tmp > __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f")[idx].frames) {
            tmp -= __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f")[idx].frames;
            idx += 1;
        }
        return __classPrivateFieldGet(this, _BpxTimerSequence_phases, "f")[idx].timer;
    }
    
    get t() {
        return BeetPx.frameNumber - __classPrivateFieldGet(this, _BpxTimerSequence_offsetFrame, "f");
        
        
        
        
        
        
    }
    
    get framesLeft() {
        return __classPrivateFieldGet(this, _BpxTimerSequence_frames, "f") - this.t;
    }
    
    get progress() {
        return this.t / __classPrivateFieldGet(this, _BpxTimerSequence_frames, "f");
        
        
    }
    
    get hasFinished() {
        
        return false;
        
        
    }
    
    get hasJustFinished() {
        
        return false;
        
        
        
        
        
        
        
        
    }
    
    pause() {
        
        
        
        
        
        
    }
    
    resume() {
        
        
        
        
        
        
        
    }
    
    restart() {
        
        
        
        
    }
}
_BpxTimerSequence_phases = new WeakMap(), _BpxTimerSequence_frames = new WeakMap(), _BpxTimerSequence_offsetFrame = new WeakMap();
