// What the BeetPx CLI would generate: the library's exports, wrapped around
// the game package.
package hot

import fw "../fw"
import game "../game"

@(private)
_runtime_started: bool

@(init)
_on_init :: proc "contextless" () {
	_runtime_started = true
}

// Whether the Odin runtime startup of this library has run.
@(export)
hot_runtime_started :: proc() -> bool {
	return _runtime_started
}

// Called right after every load. Runs the game's `main`, which in a `FW_HOT`
// build only records the callbacks, and checks the game state.
@(export)
hot_load :: proc(fw_state: ^fw.State) {
	fw.state_set(fw_state)
	game.main()
}

@(export)
hot_advance :: proc() {
	fw.advance()
}
