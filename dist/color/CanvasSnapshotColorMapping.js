"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BpxCanvasSnapshotColorMapping_mapping;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BpxCanvasSnapshotColorMapping = void 0;
class BpxCanvasSnapshotColorMapping {
    static of(mapping) {
        return new BpxCanvasSnapshotColorMapping(mapping);
    }
    constructor(mapping) {
        this.type = "canvas_snapshot_mapping";
        _BpxCanvasSnapshotColorMapping_mapping.set(this, void 0);
        __classPrivateFieldSet(this, _BpxCanvasSnapshotColorMapping_mapping, mapping, "f");
    }
    getMappedColor(snapshot, index) {
        return snapshot ? __classPrivateFieldGet(this, _BpxCanvasSnapshotColorMapping_mapping, "f").call(this, snapshot.getColorAtIndex(index)) : null;
    }
}
exports.BpxCanvasSnapshotColorMapping = BpxCanvasSnapshotColorMapping;
_BpxCanvasSnapshotColorMapping_mapping = new WeakMap();
