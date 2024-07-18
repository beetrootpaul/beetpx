export class BpxCanvasSnapshotColorMapping {
    static of(mapping) {
        return new BpxCanvasSnapshotColorMapping(mapping);
    }
    type = "canvas_snapshot_mapping";
    #mapping;
    constructor(mapping) {
        this.#mapping = mapping;
    }
    getMappedColor(snapshot, index) {
        return snapshot ? this.#mapping(snapshot.getColorAtIndex(index)) : null;
    }
}
