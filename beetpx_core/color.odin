#+private file
package beetpx_core

// TODO: Maybe use some union type to represent Rgb or Transparent? Otherwise
// consider renaming the file to `rgb.odin` and exporting `_Rgb` (without
// `_Color` prefix).
@(private = "package")
_Color_Rgb :: [3]u8
