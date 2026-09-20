export function mod(value: number, modulus: number): number {
  return modulus === 0 ? 0 : ((value % modulus) + modulus) % modulus;
}
