package beetpx_core

import bi "../internal"

// TODO: Use odin doc (e.g. `odin doc beetpx_core/draw -collection:beetpx=beetpx_core -short`)
//       to generate docs? Also, consider using it for linting if there are no
//       private (prefixed with `_`) symbols leaking.

// Basic `(x,y)` coordinates type.
Xy :: bi.Xy

// An opaque RGB8 color.
Rgb :: bi.Color_Rgb
