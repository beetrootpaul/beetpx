#+private file
#+vet unused-procedures
package bpx

// An opaque RGB8 color.
//
// TODO: Make it a union that can also be transparent? If not, rename the file
// to `rgb.odin` and the type to `_Rgb`.
@(private = "package")
_Color_Rgb :: [3]u8
