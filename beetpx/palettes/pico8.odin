package beetpx_palettes

import "../internal"

// TODO: Do palettes deserver their unique package and imported dir?
// TODO: Add more palettes to test out package API shape better.
// TODO: Should we get rid ot our custom names for PICO-8 colors? Those are not
//       some community agreed on names.

// The 16 colors of the PICO-8 system palette, created by zep for the PICO-8
// fantasy console and free to use under CC0. They are declared in the order
// of their PICO-8 indexes, 0 to 15.
//
// - License: https://www.lexaloffle.com/pico-8.php?page=faq
// - Values: https://pico-8.fandom.com/wiki/Palette#The_system_palette

pico8_black  :: internal.Rgb{0, 0, 0}
pico8_storm  :: internal.Rgb{29, 43, 83}
pico8_wine   :: internal.Rgb{126, 37, 83}
pico8_moss   :: internal.Rgb{0, 135, 81}
pico8_tan    :: internal.Rgb{171, 82, 54}
pico8_slate  :: internal.Rgb{95, 87, 79}
pico8_silver :: internal.Rgb{194, 195, 199}
pico8_white  :: internal.Rgb{255, 241, 232}
pico8_ember  :: internal.Rgb{255, 0, 77}
pico8_orange :: internal.Rgb{255, 163, 0}
pico8_lemon  :: internal.Rgb{255, 236, 39}
pico8_lime   :: internal.Rgb{0, 228, 54}
pico8_sky    :: internal.Rgb{41, 173, 255}
pico8_dusk   :: internal.Rgb{131, 118, 156}
pico8_pink   :: internal.Rgb{255, 119, 168}
pico8_peach  :: internal.Rgb{255, 204, 170}

// All PICO-8 colors, indexed by their PICO-8 indexes.
pico8 :: [16]internal.Rgb {
	pico8_black,
	pico8_storm,
	pico8_wine,
	pico8_moss,
	pico8_tan,
	pico8_slate,
	pico8_silver,
	pico8_white,
	pico8_ember,
	pico8_orange,
	pico8_lemon,
	pico8_lime,
	pico8_sky,
	pico8_dusk,
	pico8_pink,
	pico8_peach,
}
