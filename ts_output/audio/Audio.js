"use strict";
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
var _Audio_instances, _Audio_assets, _Audio_audioContext, _Audio_globalGainNode, _Audio_muteUnmuteExponentialTimeConstant, _Audio_isGloballyMuted, _Audio_loopedSounds, _Audio_muteUnmuteTimeConstant, _Audio_mute, _Audio_unmute;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = void 0;
class Audio {
    constructor(assets, audioContext) {
        _Audio_instances.add(this);
        _Audio_assets.set(this, void 0);
        _Audio_audioContext.set(this, void 0);
        _Audio_globalGainNode.set(this, void 0);
        _Audio_muteUnmuteExponentialTimeConstant.set(this, 0.1);
        _Audio_isGloballyMuted.set(this, void 0);
        _Audio_loopedSounds.set(this, new Map());
        _Audio_muteUnmuteTimeConstant.set(this, 0.1);
        __classPrivateFieldSet(this, _Audio_assets, assets, "f");
        __classPrivateFieldSet(this, _Audio_audioContext, audioContext, "f");
        __classPrivateFieldSet(this, _Audio_globalGainNode, __classPrivateFieldGet(this, _Audio_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _Audio_globalGainNode, "f").gain.value = 1;
        __classPrivateFieldGet(this, _Audio_globalGainNode, "f").connect(__classPrivateFieldGet(this, _Audio_audioContext, "f").destination);
        __classPrivateFieldSet(this, _Audio_isGloballyMuted, false, "f");
    }
    // In some browsers audio should start in result of user interaction (e.g. button click).
    // Since we cannot assure it for every game setup, let' expose a function which tries to
    // resume the AudioContext and call it on every user interaction detected by this framework.
    resumeAudioContextIfNeeded() {
        if (__classPrivateFieldGet(this, _Audio_audioContext, "f").state === "suspended") {
            __classPrivateFieldGet(this, _Audio_audioContext, "f").resume().catch((err) => {
                console.error(err);
            });
            __classPrivateFieldGet(this, _Audio_instances, "m", _Audio_unmute).call(this);
        }
    }
    toggleMuteUnmute() {
        if (__classPrivateFieldGet(this, _Audio_isGloballyMuted, "f")) {
            __classPrivateFieldGet(this, _Audio_instances, "m", _Audio_unmute).call(this);
        }
        else {
            __classPrivateFieldGet(this, _Audio_instances, "m", _Audio_mute).call(this);
        }
    }
    playSoundOnce(soundUrl) {
        const soundAsset = __classPrivateFieldGet(this, _Audio_assets, "f").getSound(soundUrl);
        const sourceNode = __classPrivateFieldGet(this, _Audio_audioContext, "f").createBufferSource();
        sourceNode.buffer = soundAsset.audioBuffer;
        sourceNode.connect(__classPrivateFieldGet(this, _Audio_globalGainNode, "f"));
        sourceNode.start();
    }
    playSoundLooped(soundUrl, muteOnStart = false) {
        const soundAsset = __classPrivateFieldGet(this, _Audio_assets, "f").getSound(soundUrl);
        const gainNode = __classPrivateFieldGet(this, _Audio_audioContext, "f").createGain();
        gainNode.gain.value = muteOnStart ? 0 : 1;
        gainNode.connect(__classPrivateFieldGet(this, _Audio_globalGainNode, "f"));
        const sourceNode = __classPrivateFieldGet(this, _Audio_audioContext, "f").createBufferSource();
        sourceNode.buffer = soundAsset.audioBuffer;
        sourceNode.loop = true;
        sourceNode.connect(gainNode);
        sourceNode.start();
        __classPrivateFieldGet(this, _Audio_loopedSounds, "f").set(soundUrl, { sourceNode, gainNode });
    }
    // TODO: better API to make clear that only looped sounds can be muted individually?
    muteSound(loopedSoundUrl) {
        const nodes = __classPrivateFieldGet(this, _Audio_loopedSounds, "f").get(loopedSoundUrl);
        if (nodes) {
            nodes.gainNode.gain.setTargetAtTime(0, __classPrivateFieldGet(this, _Audio_audioContext, "f").currentTime, __classPrivateFieldGet(this, _Audio_muteUnmuteTimeConstant, "f"));
        }
    }
    // TODO: better API to make clear that only looped sounds can be muted individually?
    unmuteSound(loopedSoundUrl) {
        const nodes = __classPrivateFieldGet(this, _Audio_loopedSounds, "f").get(loopedSoundUrl);
        if (nodes) {
            nodes.gainNode.gain.setTargetAtTime(1, __classPrivateFieldGet(this, _Audio_audioContext, "f").currentTime, __classPrivateFieldGet(this, _Audio_muteUnmuteTimeConstant, "f"));
        }
    }
}
exports.Audio = Audio;
_Audio_assets = new WeakMap(), _Audio_audioContext = new WeakMap(), _Audio_globalGainNode = new WeakMap(), _Audio_muteUnmuteExponentialTimeConstant = new WeakMap(), _Audio_isGloballyMuted = new WeakMap(), _Audio_loopedSounds = new WeakMap(), _Audio_muteUnmuteTimeConstant = new WeakMap(), _Audio_instances = new WeakSet(), _Audio_mute = function _Audio_mute() {
    __classPrivateFieldSet(this, _Audio_isGloballyMuted, true, "f");
    __classPrivateFieldGet(this, _Audio_globalGainNode, "f").gain.setTargetAtTime(0, __classPrivateFieldGet(this, _Audio_audioContext, "f").currentTime, __classPrivateFieldGet(this, _Audio_muteUnmuteExponentialTimeConstant, "f"));
}, _Audio_unmute = function _Audio_unmute() {
    __classPrivateFieldSet(this, _Audio_isGloballyMuted, false, "f");
    __classPrivateFieldGet(this, _Audio_globalGainNode, "f").gain.setTargetAtTime(1, __classPrivateFieldGet(this, _Audio_audioContext, "f").currentTime, __classPrivateFieldGet(this, _Audio_muteUnmuteExponentialTimeConstant, "f"));
};
