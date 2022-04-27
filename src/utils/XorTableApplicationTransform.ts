import { BlockTransform } from "./BlockTransform";

export class XorTableApplicationTransform extends BlockTransform {
  private readonly table: Buffer;

  constructor(table: Buffer) {
    super(table.byteLength);

    this.table = table;
  }

  protected transformBlock(data: Buffer, start: number): void | Error {
    const block = Buffer.allocUnsafe(this.blockSize);
    for (let i = this.blockSize - 1; i >= 0; i--) {
      block[i] = data[start + i] ^ this.table[i];
    }
    this.push(block);
  }
}

export function createXorStream(xorKey: Buffer) {
  return new XorTableApplicationTransform(xorKey);
}
