package beetpx_bpx

// TODO: Do palettes deserver their unique package and imported dir?
// TODO: Add more palettes to test out package API shape better.
// TODO: Should we get rid ot our custom names for PICO-8 colors? Those are not
//       some community agreed on names.
// TODO: Consider changing `p_` to `pal_`.

// The 16 colors of the PICO-8 system palette, created by zep for the PICO-8
// fantasy console and free to use under CC0. They are declared in the order
// of their PICO-8 indexes, 0 to 15.
//
// - License: https://www.lexaloffle.com/pico-8.php?page=faq
// - Values: https://pico-8.fandom.com/wiki/Palette#The_system_palette

p_pico8_black  :: Rgb{0, 0, 0}
p_pico8_storm  :: Rgb{29, 43, 83}
p_pico8_wine   :: Rgb{126, 37, 83}
p_pico8_moss   :: Rgb{0, 135, 81}
p_pico8_tan    :: Rgb{171, 82, 54}
p_pico8_slate  :: Rgb{95, 87, 79}
p_pico8_silver :: Rgb{194, 195, 199}
p_pico8_white  :: Rgb{255, 241, 232}
p_pico8_ember  :: Rgb{255, 0, 77}
p_pico8_orange :: Rgb{255, 163, 0}
p_pico8_lemon  :: Rgb{255, 236, 39}
p_pico8_lime   :: Rgb{0, 228, 54}
p_pico8_sky    :: Rgb{41, 173, 255}
p_pico8_dusk   :: Rgb{131, 118, 156}
p_pico8_pink   :: Rgb{255, 119, 168}
p_pico8_peach  :: Rgb{255, 204, 170}

// All PICO-8 colors, indexed by their PICO-8 indexes.
@(rodata)
p_pico8 := [16]Rgb {
	p_pico8_black,
	p_pico8_storm,
	p_pico8_wine,
	p_pico8_moss,
	p_pico8_tan,
	p_pico8_slate,
	p_pico8_silver,
	p_pico8_white,
	p_pico8_ember,
	p_pico8_orange,
	p_pico8_lemon,
	p_pico8_lime,
	p_pico8_sky,
	p_pico8_dusk,
	p_pico8_pink,
	p_pico8_peach,
}
