import { Transform, TransformCallback } from "stream";

export class ByteDuplicatorTransform extends Transform {
  private readonly duplicateSize: number;

  constructor(duplicateSize: number) {
    super({
      objectMode: false,
    });

    this.duplicateSize = duplicateSize;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    for (const byte of chunk) {
      this.push(Buffer.alloc(this.duplicateSize, byte));
    }

    callback();
  }
}

export function createByteDuplicator(duplicateSize: number) {
  return new ByteDuplicatorTransform(duplicateSize);
}
