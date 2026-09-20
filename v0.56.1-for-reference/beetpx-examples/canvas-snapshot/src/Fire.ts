import {$x, $aspr, $d, $rgb_p8, $u, $v_0_0, BpxVector2d} from "@beetpx/beetpx";

export class Fire {
    #position = $v_0_0;

    readonly #animation = $aspr("fire.png")(
        16,
        32,
        $u.range(8).map(i => [i * 16, 0]),
        {frameDuration: 5}
    );

    setPosition(xy: BpxVector2d): void {
        this.#position = xy;
    }

    get position(): BpxVector2d {
        return this.#position;
    }

    draw(): void {
        $d.sprite(this.#animation.current, this.#position.sub(8, 24));
        if ($x.debug) {
            $d.pixel(this.#position, $rgb_p8.ember);
        }
    }
}
