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
        const imageAsset = this.#images.get(imageUrl);
        if (!imageAsset) {
            throw Error(`Assets: There is no image loaded for: ${imageUrl}`);
        }
        return imageAsset;
    }
    getSoundAsset(soundUrl) {
        const soundAsset = this.#sounds.get(soundUrl);
        if (!soundAsset) {
            throw Error(`Assets: There is no sound loaded for: ${soundUrl}`);
        }
        return soundAsset;
    }
    getJsonAsset(jsonUrl) {
        const jsonAsset = this.#jsons.get(jsonUrl);
        if (!jsonAsset) {
            throw Error(`Assets: There is no JSON loaded for: ${jsonUrl}`);
        }
        return jsonAsset;
    }
}
