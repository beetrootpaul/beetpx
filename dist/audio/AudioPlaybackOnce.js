import { AudioPlayback } from "./AudioPlayback";
export class AudioPlaybackOnce extends AudioPlayback {
    id = AudioPlayback.nextPlaybackId++;
    type = "once";
    #soundAsset;
    #sourceNode;
    constructor(soundUrl, params) {
        super(params.audioContext, params.target, params.muteOnStart, params.onGamePause, params.onEnded);
        this.#soundAsset = params.assets.getSoundAsset(soundUrl);
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
        this.connectToMainGainNode(this.#sourceNode);
        this.#sourceNode.addEventListener("ended", () => {
            this.#sourceNode.disconnect();
            this.disconnectFromOutput();
            if (!this.isPausedByGame && !this.isPausedByEngine) {
                this.onEnded();
            }
        });
        const offsetMs = this.pausedAtMs ?
            this.pausedAtMs - this.startedAtMs - this.accumulatedPauseMs
            : 0;
        this.#sourceNode.start(0, offsetMs / 1000);
    }
}
