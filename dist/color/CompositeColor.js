var _BpxCompositeColor_nominalTypeHelper__composite;
export class BpxCompositeColor {
    constructor(primary, secondary) {
        
        _BpxCompositeColor_nominalTypeHelper__composite.set(this, true);
        this.primary = primary;
        this.secondary = secondary;
        this.id = `composite:${this.primary.id}:${this.secondary.id}`;
    }
}
_BpxCompositeColor_nominalTypeHelper__composite = new WeakMap();
