export function xorLowerHalfByte(x: number) {
  return x ^ ((x & 0x0f) << 4);
}
