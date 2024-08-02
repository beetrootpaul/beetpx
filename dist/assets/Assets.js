import { throwError } from "../utils/throwError";
export class Assets {
    #images = new Map();
    #sounds = new Map();
    #jsons = new Map();
    addImageAsset(imageUrl, imageAsset) {
        this.#images.set(imageUrl, imageAsset);
    }
    addSoundAsset(soundUrl, soundAsset) {
        this.#sounds.set(soundUrl, soundAsset);
    }
    addJsonAsset(jsonUrl, jsonAsset) {
        this.#jsons.set(jsonUrl, jsonAsset);
    }
    getImageAsset(imageUrl) {
        return (this.#images.get(imageUrl) ??
            throwError(`Assets: There is no image loaded for: ${imageUrl}`));
    }
    getSoundAsset(soundUrl) {
        return (this.#sounds.get(soundUrl) ??
            throwError(`Assets: There is no sound loaded for: ${soundUrl}`));
    }
    getJsonAsset(jsonUrl) {
        return (this.#jsons.get(jsonUrl) ??
            throwError(`Assets: There is no JSON loaded for: ${jsonUrl}`));
    }
}
//# sourceMappingURL=Assets.js.map