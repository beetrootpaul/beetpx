package main

import fw "../fw"
import "core:fmt"

State :: struct {
	counter: int,
	extra:   int,
	label:   string,
}

@(init)
init_ :: proc "contextless" () {
	// Shows whether @(init) runs when the library is loaded.
	init_ran = true
}

init_ran: bool
// A package global, to show that a reload resets it.
global_counter: int

main :: proc() {
	when !fw.HOT do fw.state_set(new(fw.State))
	fw.start(State, on_started = on_started, on_update = on_update)
}

on_started :: proc(s: ^State) {
	fmt.println("  game(v3): on_started, @(init) ran:", init_ran)
	s.label = "v3 literal"
}

on_update :: proc(s: ^State) {
	s.counter += 1
	s.extra += 1
	global_counter += 1
	fmt.printfln("  game(v3): frame=%v state=%v global=%v", fw.frame_number(), s^, global_counter)
}
