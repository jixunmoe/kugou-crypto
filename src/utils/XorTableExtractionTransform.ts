import { BlockTransform } from "./BlockTransform";

export class XorTableExtractionTransform extends BlockTransform {
  private readonly table: Buffer;
  private tableExtracted = false;

  constructor(table: Buffer) {
    super(table.byteLength);

    this.table = table;
  }

  protected transformBlock(data: Buffer, start: number): void | Error {
    if (!this.tableExtracted) {
      data.copy(this.table, 0, start, start + this.blockSize);
      this.tableExtracted = true;
      this.push(Buffer.alloc(this.blockSize, 0));
      return;
    }

    const block = Buffer.allocUnsafe(this.blockSize);
    for (let i = this.blockSize - 1; i >= 0; i--) {
      block[i] = data[start + i] ^ this.table[i];
    }
    this.push(block);
  }
}

export function createXorCompressor(tableOutput: Buffer) {
  return new XorTableExtractionTransform(tableOutput);
}
