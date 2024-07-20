export class BpxCanvasSnapshotColorMapping {
    static of(mapping) {
        return new BpxCanvasSnapshotColorMapping(mapping);
    }
    type = "canvas_snapshot_mapping";
    #mapping;
    constructor(mapping) {
        this.#mapping = mapping;
    }
    getMappedColor(snapshot, canvasX, canvasY) {
        return snapshot ?
            this.#mapping(snapshot.getColorAt(canvasX, canvasY), canvasX, canvasY)
            : null;
    }
}
