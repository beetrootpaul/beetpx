import { AudioPlayback } from "./AudioPlayback";
export class AudioPlaybackLooped extends AudioPlayback {
    id = AudioPlayback.nextPlaybackId++;
    type = "looped";
    #soundAsset;
    #sourceNode;
    #loopDurationMs;
    constructor(soundUrl, params) {
        super(params.audioContext, params.target, params.muteOnStart, params.onGamePause, params.onEnded);
        this.#soundAsset = params.assets.getSoundAsset(soundUrl);
        this.#loopDurationMs = this.#soundAsset.audioBuffer.duration * 1000;
        this.#sourceNode = this.createSourceNode();
        this.setupAndStartNodes();
    }
    stopAllNodes() {
        this.#sourceNode.stop();
    }
    setupAndStartNodes() {
        if (this.pausedAtMs != null) {
            this.#sourceNode = this.createSourceNode();
        }
        this.#sourceNode.buffer = this.#soundAsset.audioBuffer;
        this.#sourceNode.loop = true;
        this.connectToMainGainNode(this.#sourceNode);
        this.#sourceNode.addEventListener("ended", () => {
            this.#sourceNode.disconnect();
            this.disconnectFromOutput();
            if (!this.isPausedByGame && !this.isPausedByEngine) {
                this.onEnded();
            }
        });
        const offsetMs = this.pausedAtMs ?
            (this.pausedAtMs - this.startedAtMs - this.accumulatedPauseMs) %
                this.#loopDurationMs
            : 0;
        this.#sourceNode.start(0, offsetMs / 1000);
    }
}
//# sourceMappingURL=AudioPlaybackLooped.js.map