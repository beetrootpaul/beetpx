export class BpxCanvasSnapshotColorMapping {
    static of(mapper) {
        return new BpxCanvasSnapshotColorMapping(mapper);
    }
    type = "canvas_snapshot_mapping";
    #mapping;
    constructor(mapping) {
        this.#mapping = mapping;
    }
    getMappedColor(snapshot, canvasX, canvasY) {
        return snapshot
            ? this.#mapping(snapshot.getColorAt(canvasX, canvasY), canvasX, canvasY)
            : null;
    }
}
//# sourceMappingURL=CanvasSnapshotColorMapping.js.map