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
var _a, _BpxMappingColor_nextId, _BpxMappingColor_nominalTypeHelper__mapping;
export class BpxMappingColor {
    constructor(snapshotId, mapping) {
        var _b, _c, _d;
        
        _BpxMappingColor_nominalTypeHelper__mapping.set(this, true);
        this.id = `mapping:${__classPrivateFieldSet(_b = BpxMappingColor, _a, (_d = __classPrivateFieldGet(_b, _a, "f", _BpxMappingColor_nextId), _c = _d++, _d), "f", _BpxMappingColor_nextId), _c}`;
        this.snapshotId = snapshotId;
        this.getMappedColorFromCanvasSnapshot = (snapshot, index) => mapping(snapshot.get(index));
    }
}
_a = BpxMappingColor, _BpxMappingColor_nominalTypeHelper__mapping = new WeakMap();
_BpxMappingColor_nextId = { value: 1 };
