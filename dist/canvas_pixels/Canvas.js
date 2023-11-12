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
var _Canvas_snapshots, _Canvas_nextSnapshotId;
export class Canvas {
    constructor(canvasSize) {
        _Canvas_snapshots.set(this, new Map());
        
        _Canvas_nextSnapshotId.set(this, 1);
        this.canvasSize = canvasSize.round();
    }
    takeSnapshot() {
        var _a, _b;
        const snapshotId = (__classPrivateFieldSet(this, _Canvas_nextSnapshotId, (_b = __classPrivateFieldGet(this, _Canvas_nextSnapshotId, "f"), _a = _b++, _b), "f"), _a);
        __classPrivateFieldGet(this, _Canvas_snapshots, "f").set(snapshotId, this.newSnapshot());
        return snapshotId;
    }
    getSnapshot(snapshotId) {
        var _a;
        return (_a = __classPrivateFieldGet(this, _Canvas_snapshots, "f").get(snapshotId)) !== null && _a !== void 0 ? _a : null;
    }
    render() {
        __classPrivateFieldGet(this, _Canvas_snapshots, "f").clear();
        __classPrivateFieldSet(this, _Canvas_nextSnapshotId, 1, "f");
        this.doRender();
    }
}
_Canvas_snapshots = new WeakMap(), _Canvas_nextSnapshotId = new WeakMap();
