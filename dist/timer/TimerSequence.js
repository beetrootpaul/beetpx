import { timer_ } from "./Timer";
export function timerSeq_(params) {
    return BpxTimerSequence.of({
        intro: params.intro ?? [],
        loop: params.loop ?? [],
    });
}
export class BpxTimerSequence {
    static of(params) {
        return new BpxTimerSequence(params);
    }
    
    
    
    
    
    constructor(params) {
        
        
        
        
        
        
        
        
        
        
        
    }
    
    get justFinishedPhase() {
        
        return null;
    }
    
    get phase() {
        
        return "aaa";
    }
    
    get phaseTimer() {
        
        return timer_(8);
    }
    
    get t() {
        
        return 0;
    }
    
    get framesLeft() {
        
        return 10;
    }
    
    get progress() {
        
        return 0;
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
