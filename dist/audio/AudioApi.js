"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AudioApi_instances, _AudioApi_assets, _AudioApi_audioContext, _AudioApi_globalGainNode, _AudioApi_muteUnmuteExponentialTimeConstant, _AudioApi_isGloballyMuted, _AudioApi_loopedSounds, _AudioApi_muteUnmuteTimeConstant, _AudioApi_mute, _AudioApi_unmute, _AudioApi_playSoundSequenceEntry, _AudioApi_newSourceNode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioApi = void 0;
const Utils_1 = require("../Utils");
class AudioApi {
    get audioContext() {
        return __classPrivateFieldGet(this, _AudioApi_audioContext, "f");
    }
    get globalGainNode() {
        return __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f");
    }
    constructor(assets, audioContext) {
        _AudioApi_instances.add(this);
        _AudioApi_assets.set(this, void 0);
        _AudioApi_audioContext.set(this, void 0);
        _AudioApi_globalGainNode.set(this, void 0);
        _AudioApi_muteUnmuteExponentialTimeConstant.set(this, 0.1);
        _AudioApi_isGloballyMuted.set(this, void 0);
        _AudioApi_loopedSounds.set(this, new Map());
        _AudioApi_muteUnmuteTimeConstant.set(this, 0.1);
        __classPrivateFieldSet(this, _AudioApi_assets, assets, "f");
        __classPrivateFieldSet(this, _AudioApi_audioContext, audioContext, "f");
        __classPrivateFieldSet(this, _AudioApi_globalGainNode, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.value = 1;
        __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").connect(__classPrivateFieldGet(this, _AudioApi_audioContext, "f").destination);
        __classPrivateFieldSet(this, _AudioApi_isGloballyMuted, false, "f");
    }
    // In some browsers audio should start in result of user interaction (e.g. button click).
    // Since we cannot assure it for every game setup, let' expose a function which tries to
    // resume the AudioContext and call it on every user interaction detected by this framework.
    resumeAudioContextIfNeeded() {
        if (__classPrivateFieldGet(this, _AudioApi_audioContext, "f").state === "suspended") {
            __classPrivateFieldGet(this, _AudioApi_audioContext, "f").resume().catch((err) => {
                console.error(err);
            });
            __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_unmute).call(this);
        }
    }
    toggleMuteUnmute() {
        if (__classPrivateFieldGet(this, _AudioApi_isGloballyMuted, "f")) {
            __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_unmute).call(this);
        }
        else {
            __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_mute).call(this);
        }
    }
    playSoundOnce(soundUrl) {
        const soundAsset = __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(soundUrl);
        const sourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, soundAsset);
        sourceNode.connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
        sourceNode.start();
    }
    playSoundLooped(soundUrl, muteOnStart = false) {
        const soundAsset = __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(soundUrl);
        const gainNode = __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createGain();
        gainNode.gain.value = muteOnStart ? 0 : 1;
        gainNode.connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
        const sourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, soundAsset);
        sourceNode.loop = true;
        sourceNode.connect(gainNode);
        sourceNode.start();
        __classPrivateFieldGet(this, _AudioApi_loopedSounds, "f").set(soundUrl, { sourceNode, gainNode });
    }
    playSoundSequence(soundSequence) {
        const intro = soundSequence.sequence ?? [];
        const loop = soundSequence.sequenceLooped ?? [];
        const playbackFns = Array.from({
            length: intro.length + loop.length,
        });
        for (let i = 0; i < intro.length; i++) {
            playbackFns[i] = () => {
                __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_playSoundSequenceEntry).call(this, intro[i], () => playbackFns[i + 1]());
            };
        }
        const firstLoopedIndex = intro.length;
        for (let i = 0; i < loop.length; i++) {
            playbackFns[firstLoopedIndex + i] = () => {
                __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_playSoundSequenceEntry).call(this, loop[i], i < loop.length - 1
                    ? () => playbackFns[firstLoopedIndex + i + 1]()
                    : () => playbackFns[firstLoopedIndex]());
            };
        }
        // one more fn just to make loops above simpler, since there is always something on index `i+1`
        playbackFns.push(Utils_1.Utils.noop);
        playbackFns[0]?.();
    }
    // TODO: better API to make clear that only looped sounds can be muted individually?
    muteSound(loopedSoundUrl) {
        const nodes = __classPrivateFieldGet(this, _AudioApi_loopedSounds, "f").get(loopedSoundUrl);
        if (nodes) {
            nodes.gainNode.gain.setTargetAtTime(0, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_muteUnmuteTimeConstant, "f"));
        }
    }
    // TODO: better API to make clear that only looped sounds can be muted individually?
    unmuteSound(loopedSoundUrl) {
        const nodes = __classPrivateFieldGet(this, _AudioApi_loopedSounds, "f").get(loopedSoundUrl);
        if (nodes) {
            nodes.gainNode.gain.setTargetAtTime(1, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_muteUnmuteTimeConstant, "f"));
        }
    }
}
exports.AudioApi = AudioApi;
_AudioApi_assets = new WeakMap(), _AudioApi_audioContext = new WeakMap(), _AudioApi_globalGainNode = new WeakMap(), _AudioApi_muteUnmuteExponentialTimeConstant = new WeakMap(), _AudioApi_isGloballyMuted = new WeakMap(), _AudioApi_loopedSounds = new WeakMap(), _AudioApi_muteUnmuteTimeConstant = new WeakMap(), _AudioApi_instances = new WeakSet(), _AudioApi_mute = function _AudioApi_mute() {
    __classPrivateFieldSet(this, _AudioApi_isGloballyMuted, true, "f");
    __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.setTargetAtTime(0, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_muteUnmuteExponentialTimeConstant, "f"));
}, _AudioApi_unmute = function _AudioApi_unmute() {
    __classPrivateFieldSet(this, _AudioApi_isGloballyMuted, false, "f");
    __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.setTargetAtTime(1, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_muteUnmuteExponentialTimeConstant, "f"));
}, _AudioApi_playSoundSequenceEntry = function _AudioApi_playSoundSequenceEntry(entry, onEntryEnded) {
    const [mainSound, ...additionalSounds] = entry;
    const mainSoundAsset = __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(mainSound.url);
    const durationMs = mainSound.durationMs(mainSoundAsset.audioBuffer.duration * 1000);
    const sourceNodes = [];
    const mainSourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(mainSound.url));
    mainSourceNode.connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
    if (onEntryEnded) {
        // TODO: this approach doesn't seem as the precise one… so far the audio output sounds OK and on time
        //       When needed, consider reworking it based on:
        //       - https://web.dev/audio-scheduling/
        //       - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques
        mainSourceNode.addEventListener("ended", onEntryEnded);
    }
    sourceNodes.push(mainSourceNode);
    additionalSounds.forEach((sound) => {
        const sourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(sound.url));
        sourceNode.connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
        sourceNodes.push(sourceNode);
    });
    sourceNodes.forEach((sn) => {
        sn.start(0, 0, durationMs / 1000);
    });
}, _AudioApi_newSourceNode = function _AudioApi_newSourceNode(soundAsset) {
    const sourceNode = __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createBufferSource();
    sourceNode.buffer = soundAsset.audioBuffer;
    return sourceNode;
};
