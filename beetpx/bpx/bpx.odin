package beetpx_bpx

import "../core"
import "../draw"
import "../internal"
import "../palettes"
import "../utils"

// TODO: Use odin doc (e.g. `odin doc beetpx/draw -collection:beetpx=beetpx -short`)
//       to generate docs? Also, consider using it for linting if there are no
//       private (prefixed with `_`) symbols leaking.

//
// core
//
// The main API, for controlling the game, exposing the building blocks, etc.
//

On_Update :: core.On_Update
On_Draw   :: core.On_Draw
Rgb       :: internal.Rgb

start         :: core.start
set_on_update :: core.set_on_update
set_on_draw   :: core.set_on_draw
frame_number  :: core.frame_number

//
// draw
//
// API for drawing things from inside `on_draw` proc.
//

d_clear_canvas :: draw.clear_canvas
d_pixel        :: draw.pixel

//
// palettes
//
// A predefied set of colors based on some well known existing palettes.
//

// TODO: Consider changing `p_` to `pal_`.

p_pico8_black  :: palettes.pico8_black
p_pico8_storm  :: palettes.pico8_storm
p_pico8_wine   :: palettes.pico8_wine
p_pico8_moss   :: palettes.pico8_moss
p_pico8_tan    :: palettes.pico8_tan
p_pico8_slate  :: palettes.pico8_slate
p_pico8_silver :: palettes.pico8_silver
p_pico8_white  :: palettes.pico8_white
p_pico8_ember  :: palettes.pico8_ember
p_pico8_orange :: palettes.pico8_orange
p_pico8_lemon  :: palettes.pico8_lemon
p_pico8_lime   :: palettes.pico8_lime
p_pico8_sky    :: palettes.pico8_sky
p_pico8_dusk   :: palettes.pico8_dusk
p_pico8_pink   :: palettes.pico8_pink
p_pico8_peach  :: palettes.pico8_peach

@(rodata)
p_pico8 := palettes.pico8

//
// util
//
// A set of tools and helpers.
//

u_noop      :: utils.noop
u_ping_pong :: utils.ping_pong
