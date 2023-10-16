var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _AudioApi_instances, _a, _AudioApi_storageMuteUnmuteKey, _AudioApi_storageMuteUnmuteTrue, _AudioApi_nextPlaybackId, _AudioApi_assets, _AudioApi_audioContext, _AudioApi_isPaused, _AudioApi_globalGainNode, _AudioApi_isGloballyMuted, _AudioApi_sounds, _AudioApi_loadStoredGlobalMuteUnmuteState, _AudioApi_storeGlobalMuteUnmuteState, _AudioApi_fadeOutSounds, _AudioApi_stopSounds, _AudioApi_playSoundSequenceEntry, _AudioApi_newSourceNode, _AudioApi_register, _AudioApi_unregister;
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
        _AudioApi_isPaused.set(this, false);
        _AudioApi_globalGainNode.set(this, void 0);
        _AudioApi_isGloballyMuted.set(this, void 0);
        _AudioApi_sounds.set(this, new Map());
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
    tryToResumeAudioContextSuspendedByBrowserForSecurityReasons() {
        return __awaiter(this, void 0, void 0, function* () {
            Logger.debugBeetPx("AudioApi.tryToResumeAudioContextSuspendedByBrowserForSecurityReasons");
            if (__classPrivateFieldGet(this, _AudioApi_audioContext, "f").state === "running") {
                Logger.debugBeetPx("Audio Context is already running");
                return Promise.resolve(true);
            }
            if (__classPrivateFieldGet(this, _AudioApi_isPaused, "f")) {
                Logger.debugBeetPx("Cannot detect if Audio Context requires resuming, because it is intentionally paused (suspended) right now");
                return Promise.resolve(false);
            }
            return __classPrivateFieldGet(this, _AudioApi_audioContext, "f")
                .resume()
                .then(() => {
                Logger.debugBeetPx("Audio Context got resumed");
                return true;
            })
                .catch((err) => {
                Logger.errorBeetPx(err);
                return false;
            });
        });
    }
    areAllSoundsMuted() {
        return __classPrivateFieldGet(this, _AudioApi_isGloballyMuted, "f");
    }
    muteAllSounds(opts = {}) {
        Logger.debugBeetPx(`AudioApi.muteAllSounds (fadeOutMillis: ${opts.fadeOutMillis})`);
        if (__classPrivateFieldGet(this, _AudioApi_isGloballyMuted, "f"))
            return;
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_storeGlobalMuteUnmuteState).call(this, true);
        __classPrivateFieldSet(this, _AudioApi_isGloballyMuted, true, "f");
        if (__classPrivateFieldGet(this, _AudioApi_isPaused, "f")) {
            __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.setValueAtTime(0, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime);
        }
        else {
            __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.setValueCurveAtTime([this.globalGainNode.gain.value, 0], __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, opts.fadeOutMillis != null ? opts.fadeOutMillis / 1000 : 0.1);
        }
    }
    unmuteAllSounds(opts = {}) {
        Logger.debugBeetPx(`AudioApi.unmuteAllSounds (fadeInMillis: ${opts.fadeInMillis})`);
        if (!__classPrivateFieldGet(this, _AudioApi_isGloballyMuted, "f"))
            return;
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_storeGlobalMuteUnmuteState).call(this, false);
        __classPrivateFieldSet(this, _AudioApi_isGloballyMuted, false, "f");
        if (__classPrivateFieldGet(this, _AudioApi_isPaused, "f")) {
            __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.setValueAtTime(1, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime);
        }
        else {
            __classPrivateFieldGet(this, _AudioApi_globalGainNode, "f").gain.setValueCurveAtTime([this.globalGainNode.gain.value, 1], __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, opts.fadeInMillis != null ? opts.fadeInMillis / 1000 : 0.1);
        }
    }
    // TODO: better API to make clear that only looped sounds can be muted individually?
    muteSound(playbackId, opts = {}) {
        Logger.debugBeetPx(`AudioApi.muteSound (fadeOutMillis: ${opts.fadeOutMillis})`);
        const nodes = __classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId);
        if (nodes === null || nodes === void 0 ? void 0 : nodes.gainNodes) {
            for (const gainNode of nodes === null || nodes === void 0 ? void 0 : nodes.gainNodes) {
                if (__classPrivateFieldGet(this, _AudioApi_isPaused, "f")) {
                    gainNode.gain.setValueAtTime(0, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime);
                }
                else {
                    // We use `setValueCurveAtTime` instead of `setValueAtTime`, because we want to avoid
                    //   an instant volume change – it was resulting with some audio artifacts.
                    gainNode.gain.setValueCurveAtTime([gainNode.gain.value, 0], __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, opts.fadeOutMillis != null ? opts.fadeOutMillis / 1000 : 0.1);
                }
            }
        }
    }
    // TODO: better API to make clear that only looped sounds can be muted individually?
    unmuteSound(playbackId, opts = {}) {
        Logger.debugBeetPx(`AudioApi.unmuteSound (fadeInMillis: ${opts.fadeInMillis})`);
        const nodes = __classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId);
        if (nodes === null || nodes === void 0 ? void 0 : nodes.gainNodes) {
            for (const gainNode of nodes === null || nodes === void 0 ? void 0 : nodes.gainNodes) {
                if (__classPrivateFieldGet(this, _AudioApi_isPaused, "f")) {
                    gainNode.gain.setValueAtTime(1, __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime);
                }
                else {
                    // We use `setValueCurveAtTime` instead of `setValueAtTime`, because we want to avoid
                    //   an instant volume change – it was resulting with some audio artifacts.
                    gainNode.gain.setValueCurveAtTime([gainNode.gain.value, 1], __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, opts.fadeInMillis != null ? opts.fadeInMillis / 1000 : 0.1);
                }
            }
        }
    }
    pauseAllSounds() {
        Logger.debugBeetPx("AudioApi.pauseAllSounds");
        __classPrivateFieldSet(this, _AudioApi_isPaused, true, "f");
        __classPrivateFieldGet(this, _AudioApi_audioContext, "f").suspend().catch((err) => {
            Logger.errorBeetPx(err);
        });
    }
    resumeAllSounds() {
        Logger.debugBeetPx("AudioApi.resumeAllSounds");
        __classPrivateFieldSet(this, _AudioApi_isPaused, false, "f");
        __classPrivateFieldGet(this, _AudioApi_audioContext, "f").resume().catch((err) => {
            Logger.errorBeetPx(err);
        });
    }
    stopAllSounds(opts = {}) {
        Logger.debugBeetPx(`AudioApi.stopAllSounds (fadeOutMillis: ${opts.fadeOutMillis})`);
        if (opts.fadeOutMillis != null && !__classPrivateFieldGet(this, _AudioApi_isGloballyMuted, "f")) {
            const fadeOutSounds = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_fadeOutSounds).call(this, opts.fadeOutMillis, (id) => true);
            setTimeout(() => {
                __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_stopSounds).call(this, (id) => fadeOutSounds.includes(id));
            }, opts.fadeOutMillis);
        }
        else {
            __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_stopSounds).call(this, (id) => true);
        }
    }
    stopSound(playbackId, opts = {}) {
        Logger.debugBeetPx("AudioApi.stopSound");
        if (opts.fadeOutMillis != null && !__classPrivateFieldGet(this, _AudioApi_isGloballyMuted, "f")) {
            const fadeOutSounds = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_fadeOutSounds).call(this, opts.fadeOutMillis, (id) => id === playbackId);
            setTimeout(() => {
                __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_stopSounds).call(this, (id) => fadeOutSounds.includes(id));
            }, opts.fadeOutMillis);
        }
        else {
            __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_stopSounds).call(this, (id) => id === playbackId);
        }
    }
    playSoundOnce(soundUrl, muteOnStart = false) {
        var _b, _c, _d;
        Logger.debugBeetPx("AudioApi.playSoundOnce");
        const playbackId = (__classPrivateFieldSet(_b = AudioApi, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _AudioApi_nextPlaybackId), _c = _d++, _d), "f", _AudioApi_nextPlaybackId), _c);
        const soundAsset = __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(soundUrl);
        const gainNode = __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createGain();
        gainNode.gain.value = muteOnStart ? 0 : 1;
        gainNode.connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
        const sourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, soundAsset);
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_register).call(this, playbackId, sourceNode, gainNode);
        sourceNode.connect(gainNode);
        sourceNode.start();
        sourceNode.addEventListener("ended", () => {
            __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_unregister).call(this, playbackId);
            sourceNode.disconnect();
        });
        return playbackId;
    }
    playSoundLooped(soundUrl, muteOnStart = false) {
        var _b, _c, _d;
        Logger.debugBeetPx("AudioApi.playSoundLooped");
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
    // TODO: move out to a class which can make use of some shared state instead of passing everything through function params
    playSoundSequence(soundSequence) {
        var _b, _c, _d;
        var _e, _f, _g;
        Logger.debugBeetPx("AudioApi.playSoundSequence");
        const playbackId = (__classPrivateFieldSet(_e = AudioApi, _a, (_g = __classPrivateFieldGet(_e, _a, "f", _AudioApi_nextPlaybackId), _f = _g++, _g), "f", _AudioApi_nextPlaybackId), _f);
        const intro = (_b = soundSequence.sequence) !== null && _b !== void 0 ? _b : [];
        const loop = (_c = soundSequence.sequenceLooped) !== null && _c !== void 0 ? _c : [];
        const sequenceGainNode = __classPrivateFieldGet(this, _AudioApi_audioContext, "f").createGain();
        sequenceGainNode.connect(__classPrivateFieldGet(this, _AudioApi_globalGainNode, "f"));
        const playbackFns = Array.from({
            length: intro.length + loop.length,
        });
        for (let i = 0; i < intro.length; i++) {
            playbackFns[i] = () => {
                if (!__classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId)) {
                    return;
                }
                __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_playSoundSequenceEntry).call(this, playbackId, intro[i], sequenceGainNode, (sourceNodes) => {
                    playbackFns[i + 1]();
                    sourceNodes.forEach((sn) => {
                        sn.disconnect();
                    });
                });
            };
        }
        const firstLoopedIndex = intro.length;
        for (let i = 0; i < loop.length; i++) {
            playbackFns[firstLoopedIndex + i] = () => {
                if (!__classPrivateFieldGet(this, _AudioApi_sounds, "f").get(playbackId)) {
                    return;
                }
                __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_playSoundSequenceEntry).call(this, playbackId, loop[i], sequenceGainNode, i < loop.length - 1
                    ? (sourceNodes) => {
                        playbackFns[firstLoopedIndex + i + 1]();
                        sourceNodes.forEach((sn) => {
                            sn.disconnect();
                        });
                    }
                    : (sourceNodes) => {
                        playbackFns[firstLoopedIndex]();
                        sourceNodes.forEach((sn) => {
                            sn.disconnect();
                        });
                    });
            };
        }
        // one more fn just to make loops above simpler, since there is always something on index `i+1`
        playbackFns.push(BpxUtils.noop);
        __classPrivateFieldGet(this, _AudioApi_sounds, "f").set(playbackId, {
            sourceNodes: [],
            gainNodes: [sequenceGainNode],
        });
        (_d = playbackFns[0]) === null || _d === void 0 ? void 0 : _d.call(playbackFns);
        return playbackId;
    }
}
_a = AudioApi, _AudioApi_assets = new WeakMap(), _AudioApi_audioContext = new WeakMap(), _AudioApi_isPaused = new WeakMap(), _AudioApi_globalGainNode = new WeakMap(), _AudioApi_isGloballyMuted = new WeakMap(), _AudioApi_sounds = new WeakMap(), _AudioApi_instances = new WeakSet(), _AudioApi_loadStoredGlobalMuteUnmuteState = function _AudioApi_loadStoredGlobalMuteUnmuteState() {
    return (window.localStorage.getItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey)) ===
        __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteTrue));
}, _AudioApi_storeGlobalMuteUnmuteState = function _AudioApi_storeGlobalMuteUnmuteState(muted) {
    if (muted) {
        window.localStorage.setItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey), __classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteTrue));
    }
    else {
        window.localStorage.removeItem(__classPrivateFieldGet(AudioApi, _a, "f", _AudioApi_storageMuteUnmuteKey));
    }
}, _AudioApi_fadeOutSounds = function _AudioApi_fadeOutSounds(fadeOutMillis, predicate) {
    const idsOfFadedOutSounds = [];
    for (const [playbackId, { sourceNodes, gainNodes },] of __classPrivateFieldGet(this, _AudioApi_sounds, "f").entries()) {
        if (predicate(playbackId)) {
            idsOfFadedOutSounds.push(playbackId);
            for (const gainNode of gainNodes) {
                gainNode.gain.setValueCurveAtTime([gainNode.gain.value, 0], __classPrivateFieldGet(this, _AudioApi_audioContext, "f").currentTime, fadeOutMillis / 1000);
            }
        }
    }
    return idsOfFadedOutSounds;
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
}, _AudioApi_playSoundSequenceEntry = function _AudioApi_playSoundSequenceEntry(playbackId, entry, sequenceGainNode, onEntryEnded) {
    var _b;
    const [mainSound, ...additionalSounds] = entry;
    const mainSoundAsset = __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(mainSound.url);
    const durationMs = ((_b = mainSound.durationMs) !== null && _b !== void 0 ? _b : u_.identity)(mainSoundAsset.audioBuffer.duration * 1000);
    const sourceNodes = [];
    const mainSourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(mainSound.url));
    __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_register).call(this, playbackId, mainSourceNode);
    mainSourceNode.connect(sequenceGainNode);
    sourceNodes.push(mainSourceNode);
    additionalSounds.forEach((sound) => {
        const sourceNode = __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_newSourceNode).call(this, __classPrivateFieldGet(this, _AudioApi_assets, "f").getSoundAsset(sound.url));
        __classPrivateFieldGet(this, _AudioApi_instances, "m", _AudioApi_register).call(this, playbackId, sourceNode);
        sourceNode.connect(sequenceGainNode);
        sourceNodes.push(sourceNode);
    });
    sourceNodes.forEach((sn) => {
        sn.start(0, 0, durationMs / 1000);
    });
    if (onEntryEnded) {
        // TODO: this approach sometimes result with audio gaps between individual node playbacks :-(
        //       When needed, consider reworking it based on:
        //       - https://web.dev/audio-scheduling/
        //       - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques
        mainSourceNode.addEventListener("ended", () => onEntryEnded(sourceNodes));
    }
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
