export function mod(value, modulus) {
    return modulus === 0 ? 0 : ((value % modulus) + modulus) % modulus;
}
