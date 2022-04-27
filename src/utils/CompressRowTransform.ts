import { BlockTransform } from "./BlockTransform";

function validateBufferSameByte(buf: Buffer, start: number, len: number) {
  const firstByte = buf[start];
  for (let i = start + len - 1; i > start; i--) {
    if (firstByte !== buf[i]) {
      return false;
    }
  }
  return true;
}

export class CompressRowTransform extends BlockTransform {
  protected transformBlock(
    data: Buffer,
    start: number,
    position: number
  ): void | Error {
    if (!validateBufferSameByte(data, start, this.blockSize)) {
      return new Error(`could not validate block at ${position}`);
    }

    this.push(data.slice(start, start + 1));
  }
}

export function createRowCompressor(columnWidth = 16) {
  return new CompressRowTransform(columnWidth);
}
