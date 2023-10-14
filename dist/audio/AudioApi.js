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
var _AudioApi_instances, _a, _AudioApi_storageMuteUnmuteKey, _AudioApi_storageMuteUnmuteTrue, _AudioApi_nextPlaybackId, _AudioApi_assets, _AudioApi_audioContext, _AudioApi_globalGainNode, _AudioApi_muteUnmuteExponentialTimeConstant, _AudioApi_isGloballyMuted, _AudioApi_sounds, _AudioApi_muteUnmuteTimeConstant, _AudioApi_mute, _AudioApi_unmute, _AudioApi_loadStoredGlobalMuteUnmuteState, _AudioApi_storeGlobalMuteUnmuteState, _AudioApi_stopSounds, _AudioApi_playSoundSequenceEntry, _AudioApi_newSourceNode, _AudioApi_register, _AudioApi_unregister;
import { Logger } from "../logger/Logger";
import { BpxUtils, u_ } from "../Utils";
// TODO: refactor this big mess of a class, extract playbacks for example
export class AudioApi {
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
        _AudioApi_sounds.set(this, new Map());
        _AudioApi_muteUnmuteTimeConstant.set(this, 0.001);
        __classPrivateFieldSet(this, _AudioApi_assets, assets, "f");
        __classPrivateFieldSet(this, _AudioApi_audioContext, audioContext, "f");
        __classPrivateFieldSet(this, _AudioApi_isGloballyMuted, __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_loadStoredGlobalMuteUnmuteState).call(this), "f");
        __classPrivateFieldSet(this, _AudioApi_globalGainNode, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createGain(), "f");
        __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.value = __classPrivateFieldGet(this, _AudioApi_isGloballyMuted, "f") ? 0 : 1;
        __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").connect(__classPrivateFieldGet(this, _AudioApi_audioContext, "f").destination);
    }
    // In some browsers audio should start in result of user interaction (e.g. button click).
    // Since we cannot assure it for every game setup, let' expose a function which tries to
    // resume the AudioContext and call it on every user interaction detected by this framework.
    resumeAudioContextIfNeeded() {
        if (__classPrivateFieldGet(this, _AudioApi_audioContext, "f").state === "suspended") {
            __classPrivateFieldGet(this, _AudioApi_audioContext, "f").resume().catch((err) => {
                Logger.errorBeetPx(err);
            });
            // TODO: are we sure we want to unmute here? What if it was intentionally muted?!
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
    stopAllSounds() {
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_stopSounds).call(this, (id) => true);
    }
    stopSound(playbackId) {
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_stopSounds).call(this, (id) => id === playbackId);
    }
    playSoundOnce(soundUrl) {
        var _b, _c, _d;
        const playbackId = (__classPrivateFieldSet(_b = AudioApi, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _AudioApi_nextPlaybackId), _c = _d++, _d), "f", _AudioApi_nextPlaybackId), _c);
        const soundAsset = __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(soundUrl);
        const sourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, soundAsset);
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_register).call(this, playbackId, sourceNode);
        sourceNode.connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
        sourceNode.start();
        sourceNode.addEventListener("ended", () => {
            __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_unregister).call(this, playbackId);
            sourceNode.disconnect();
        });
        return playbackId;
    }
    playSoundLooped(soundUrl, muteOnStart = false) {
        var _b, _c, _d;
        const playbackId = (__classPrivateFieldSet(_b = AudioApi, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _AudioApi_nextPlaybackId), _c = _d++, _d), "f", _AudioApi_nextPlaybackId), _c);
        const soundAsset = __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(soundUrl);
        const gainNode = __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createGain();
        gainNode.gain.value = muteOnStart ? 0 : 1;
        gainNode.connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
        const sourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, soundAsset);
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_register).call(this, playbackId, sourceNode, gainNode);
        sourceNode.loop = true;
        sourceNode.connect(gainNode);
        sourceNode.start();
        return playbackId;
    }
    playSoundSequence(soundSequence) {
        var _b, _c, _d;
        var _e, _f, _g;
        const playbackId = (__classPrivateFieldSet(_e = AudioApi, _a, (_g = __classPrivateFieldGet(_e, _a, "f", _AudioApi_nextPlaybackId), _f = _g++, _g), "f", _AudioApi_nextPlaybackId), _f);
        const intro = (_b = soundSequence.sequence) !== null && _b !== void 0 ? _b : [];
        const loop = (_c = soundSequence.sequenceLooped) !== null && _c !== void 0 ? _c : [];
        const playbackFns = Array.from({
            length: intro.length + loop.length,
        });
        for (let i = 0; i < intro.length; i++) {
            playbackFns[i] = () => {
                if (!__classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId)) {
                    return;
                }
                __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_playSoundSequenceEntry).call(this, playbackId, intro[i], () => playbackFns[i + 1]());
            };
        }
        const firstLoopedIndex = intro.length;
        for (let i = 0; i < loop.length; i++) {
            playbackFns[firstLoopedIndex + i] = () => {
                if (!__classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId)) {
                    return;
                }
                __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_playSoundSequenceEntry).call(this, playbackId, loop[i], i < loop.length - 1
                    ? () => playbackFns[firstLoopedIndex + i + 1]()
                    : () => playbackFns[firstLoopedIndex]());
            };
        }
        // one more fn just to make loops above simpler, since there is always something on index `i+1`
        playbackFns.push(BpxUtils.noop);
        __classPrivateFieldGet(this, _AudioApi_sounds, "f").set(playbackId, { sourceNodes: [], gainNodes: [] });
        (_d = playbackFns[0]) === null || _d === void 0 ? void 0 : _d.call(playbackFns);
        return playbackId;
    }
    // TODO: better API to make clear that only looped sounds can be muted individually?
    muteSound(playbackId) {
        const nodes = __classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId);
        if (nodes === null || nodes === void 0 ? void 0 : nodes.gainNodes) {
            for (const gainNode of nodes === null || nodes === void 0 ? void 0 : nodes.gainNodes) {
                // We use `setTargetAtTime` instead of `setValueAtTime`, because we want to avoid
                //   an instant volume change – it was resulting with some audio artifacts.
                gainNode.gain.setTargetAtTime(0, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_muteUnmuteTimeConstant, "f"));
            }
        }
    }
    // TODO: better API to make clear that only looped sounds can be muted individually?
    unmuteSound(playbackId) {
        const nodes = __classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId);
        if (nodes === null || nodes === void 0 ? void 0 : nodes.gainNodes) {
            for (const gainNode of nodes === null || nodes === void 0 ? void 0 : nodes.gainNodes) {
                // We use `setTargetAtTime` instead of `setValueAtTime`, because we want to avoid
                //   an instant volume change – it was resulting with some audio artifacts.
                gainNode.gain.setTargetAtTime(1, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_muteUnmuteTimeConstant, "f"));
            }
        }
    }
}
_a = AudioApi, _AudioApi_assets = new WeakMap(), _AudioApi_audioContext = new WeakMap(), _AudioApi_globalGainNode = new WeakMap(), _AudioApi_muteUnmuteExponentialTimeConstant = new WeakMap(), _AudioApi_isGloballyMuted = new WeakMap(), _AudioApi_sounds = new WeakMap(), _AudioApi_muteUnmuteTimeConstant = new WeakMap(), _AudioApi_instances = new WeakSet(), _AudioApi_mute = function _AudioApi_mute() {
    __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_storeGlobalMuteUnmuteState).call(this, true);
    __classPrivateFieldSet(this, _AudioApi_isGloballyMuted, true, "f");
    __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.setTargetAtTime(0, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_muteUnmuteExponentialTimeConstant, "f"));
}, _AudioApi_unmute = function _AudioApi_unmute() {
    __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_storeGlobalMuteUnmuteState).call(this, false);
    __classPrivateFieldSet(this, _AudioApi_isGloballyMuted, false, "f");
    __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.setTargetAtTime(1, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, __classPrivateFieldGet(this, _AudioApi_muteUnmuteExponentialTimeConstant, "f"));
}, _AudioApi_loadStoredGlobalMuteUnmuteState = function _AudioApi_loadStoredGlobalMuteUnmuteState() {
    return (window.localStorage.getItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey)) ===
        __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteTrue));
}, _AudioApi_storeGlobalMuteUnmuteState = function _AudioApi_storeGlobalMuteUnmuteState(muted) {
    if (muted) {
        window.localStorage.setItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey), __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteTrue));
    }
    else {
        window.localStorage.removeItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey));
    }
}, _AudioApi_stopSounds = function _AudioApi_stopSounds(predicate) {
    for (const [playbackId, { sourceNodes, gainNodes },] of __classPrivateFieldGet(this, _AudioApi_sounds, "f").entries()) {
        if (predicate(playbackId)) {
            __classPrivateFieldGet(this, _AudioApi_sounds, "f").delete(playbackId);
            for (const gainNode of gainNodes) {
                gainNode.disconnect();
            }
            for (const sourceNode of sourceNodes) {
                sourceNode.addEventListener("ended", () => {
                    sourceNode.disconnect();
                });
                sourceNode.stop();
            }
        }
    }
}, _AudioApi_playSoundSequenceEntry = function _AudioApi_playSoundSequenceEntry(playbackId, entry, onEntryEnded) {
    var _b;
    const [mainSound, ...additionalSounds] = entry;
    const mainSoundAsset = __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(mainSound.url);
    const durationMs = ((_b = mainSound.durationMs) !== null && _b !== void 0 ? _b : u_.identity)(mainSoundAsset.audioBuffer.duration * 1000);
    const sourceNodes = [];
    const mainSourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(mainSound.url));
    __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_register).call(this, playbackId, mainSourceNode);
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
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_register).call(this, playbackId, sourceNode);
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
}, _AudioApi_register = function _AudioApi_register(playbackId, sourceNode, gainNode) {
    const registeredNodes = __classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId);
    if (registeredNodes) {
        registeredNodes.sourceNodes.push(sourceNode);
        if (gainNode) {
            registeredNodes.gainNodes.push(gainNode);
        }
    }
    else {
        __classPrivateFieldGet(this, _AudioApi_sounds, "f").set(playbackId, {
            sourceNodes: [sourceNode],
            gainNodes: gainNode ? [gainNode] : [],
        });
    }
}, _AudioApi_unregister = function _AudioApi_unregister(playbackId) {
    __classPrivateFieldGet(this, _AudioApi_sounds, "f").delete(playbackId);
};
_AudioApi_storageMuteUnmuteKey = { value: "audio_api__muted" };
_AudioApi_storageMuteUnmuteTrue = { value: "yes" };
// start from 1 to avoid a case when someone checks for ID being truthy and gets `false`, because of value `0`
_AudioApi_nextPlaybackId = { value: 1 };
