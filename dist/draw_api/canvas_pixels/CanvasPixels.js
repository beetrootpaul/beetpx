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
var _CanvasPixels_snapshots, _CanvasPixels_nextSnapshotId;
export class CanvasPixels {
    constructor(canvasSize) {
        _CanvasPixels_snapshots.set(this, new Map());
        
        _CanvasPixels_nextSnapshotId.set(this, 1);
        this.canvasSize = canvasSize.round();
    }
    takeSnapshot() {
        var _a, _b;
        const snapshotId = (__classPrivateFieldSet(this, _CanvasPixels_nextSnapshotId, (_b = __classPrivateFieldGet(this, _CanvasPixels_nextSnapshotId, "f"), _a = _b++, _b), "f"), _a);
        __classPrivateFieldGet(this, _CanvasPixels_snapshots, "f").set(snapshotId, this.newSnapshot());
        return snapshotId;
    }
    getSnapshot(snapshotId) {
        var _a;
        return (_a = __classPrivateFieldGet(this, _CanvasPixels_snapshots, "f").get(snapshotId)) !== null && _a !== void 0 ? _a : null;
    }
    render() {
        __classPrivateFieldGet(this, _CanvasPixels_snapshots, "f").clear();
        __classPrivateFieldSet(this, _CanvasPixels_nextSnapshotId, 1, "f");
        this.doRender();
    }
}
_CanvasPixels_snapshots = new WeakMap(), _CanvasPixels_nextSnapshotId = new WeakMap();
