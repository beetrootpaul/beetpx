export type BpxColorId = string;

export interface BpxColor {
  // TODO: `serialized()` might be a better name for it? As long as we provide `deserialize` as well…
  // meant to be used e.g. as textual key in `Map()`
  id: BpxColorId;
}
