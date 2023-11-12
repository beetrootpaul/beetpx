var _BpxCompositeColor_nominalTypeHelper__composite;
export class BpxCompositeColor {
    constructor(primary, secondary) {
        var _a, _b, _c, _d;
        
        _BpxCompositeColor_nominalTypeHelper__composite.set(this, true);
        this.primary = primary;
        this.secondary = secondary;
        this.id = `composite:${(_b = (_a = this.primary) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "transparent"}:${(_d = (_c = this.secondary) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : "transparent"}`;
    }
}
_BpxCompositeColor_nominalTypeHelper__composite = new WeakMap();
