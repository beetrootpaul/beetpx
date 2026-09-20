# BeetPx Input Tester

This tool serves as a **quick way to test game inputs supported by
[BeetPx game framework](https://beetpx.dev)**, both on keyboard and on gamepads. The latter are especially important
here, since the key mapping varies between game controllers, web browsers and operating systems.

The **dashed line** at the edge of the canvas indicate which game input type (a keyboard or a gamepad) was detected the
last. The way it could be leveraged in a real game would be to show either keyboard or gamepad controls to the player
depending on what do they use to play the game.

When in **debug mode** (entered with a semicolon on the keyboard), the alternative screen appears, showing details of up
to 3 connected game controllers. What it presents are detected gamepad buttons. First, there are two rows of regular
buttons (with a colored square indicating the full press was detected and a cross/plus indicated a half-press). Next,
there are 7 axis of precise "buttons" like D-pad or triggers.

In the debug mode, there is also an indication of a detected gamepad type, as well as a detected web browser (and
whether it's Windows or not, when it comes to Firefox). Those are dictated by differences between gamepad mappings I
experienced so far.

This tool is supposed to work correctly on a **mobile web browser** as well.
