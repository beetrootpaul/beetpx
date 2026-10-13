package beetpx_bpx

import sa "core:container/small_array"

// TODO: Add more keys, and mouse, touch, and gamepad events.

// Keyboard keys games can check. Each one is a physical key, so it does not
// depend on the keyboard layout.
Key :: enum u8 {
	Left,
	Right,
	Up,
	Down,
}

// Something that happened outside of the game, e.g. a key press or the window
// losing focus. See `events`.
Event :: union {
	Event_Key_Down,
	Event_Key_Up,
	Event_Focus_Lost,
	Event_Focus_Gained,
	Event_Resize,
}

// A key went down. Repeats, which the OS sends while a key is held, are left
// out.
Event_Key_Down :: struct {
	key: Key,
}

// A key went up.
Event_Key_Up :: struct {
	key: Key,
}

// The window (on the web: the browser window) stopped receiving keyboard
// input, e.g. because the user switched to another app.
Event_Focus_Lost :: struct {}

// The window (on the web: the browser window) started receiving keyboard
// input again.
Event_Focus_Gained :: struct {}

// The window (on the web: the browser window) changed its size.
Event_Resize :: struct {}

// More events between two ticks are dropped.
//
// TODO: Log when events are dropped.
@(private = "file")
_MAX_EVENTS_PER_TICK :: 64

// Events captured since the last `_events_update`. Kept separately from
// `_events_of_tick`, so that events between two ticks are not lost.
@(private = "file")
_events_since_update: sa.Small_Array(_MAX_EVENTS_PER_TICK, Event)

@(private = "file")
_events_of_tick: sa.Small_Array(_MAX_EVENTS_PER_TICK, Event)

// Called by the platform whenever an event happens.
@(private)
_events_push :: proc(event: Event) {
	sa.push_back(&_events_since_update, event)
}

// Takes the events captured since the previous call as the events of the
// current tick. Runs once per tick, before `on_update`.
@(private)
_events_update :: proc() {
	_events_of_tick = _events_since_update
	sa.clear(&_events_since_update)
}

// A list of events captured since the previous tick, oldest first.
//
// Events are captured between ticks, so when several ticks run in one host
// frame, only the first of them gets the events, and the others get none.
// `on_draw` gets the events of the latest tick, so it may get the same events
// more than once.
//
// The returned slice is valid until the next tick.
events :: proc() -> []Event {
	return sa.slice(&_events_of_tick)
}
