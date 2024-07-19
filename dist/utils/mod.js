/**
 * a modulo operation – in contrary to native `%`, this returns results from [0, n) range (positive values only)
 */
export function mod(value, modulus) {
    return modulus === 0 ? 0 : ((value % modulus) + modulus) % modulus;
}
