export class BpxCanvasSnapshotColorMapping {
    static from(colorMappingEntries) {
        const map = new Map(colorMappingEntries.map(([from, to]) => [from.cssHex, to]));
        return new BpxCanvasSnapshotColorMapping((canvasSnapshotColor, _x, _y) => {
            if (!canvasSnapshotColor)
                return canvasSnapshotColor;
            const mapped = map.get(canvasSnapshotColor.cssHex);
            return typeof mapped === "undefined" ? canvasSnapshotColor : mapped;
        });
    }
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