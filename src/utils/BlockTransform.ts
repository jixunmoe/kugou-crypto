import { Transform, TransformCallback } from "stream";

export abstract class BlockTransform extends Transform {
  protected blockSize: number;
  protected prevBuff = Buffer.alloc(0);
  protected bytesProcessed = 0;

  constructor(blockSize: number) {
    super({
      objectMode: false,
    });

    this.blockSize = blockSize;
  }

  _transform(
    chunk: Buffer,
    encoding: never,
    callback: TransformCallback
  ): void {
    const { blockSize, bytesProcessed } = this;
    const chunkSize = chunk.byteLength;
    const prevBuffSize = this.prevBuff.byteLength;

    if (chunkSize + prevBuffSize < blockSize) {
      this.prevBuff = Buffer.concat([this.prevBuff, chunk]);
      return callback();
    }

    let chunkOffset = 0;
    if (this.prevBuff.byteLength > 0) {
      chunkOffset += blockSize - prevBuffSize;
      const buf = Buffer.concat([this.prevBuff, chunk.slice(0, chunkOffset)]);
      const error = this.transformBlock(buf, 0, bytesProcessed - prevBuffSize);
      if (error) return callback(error);
    }

    const maxIter = chunkSize - blockSize;
    while (chunkOffset <= maxIter) {
      const error = this.transformBlock(
        chunk,
        chunkOffset,
        bytesProcessed + chunkOffset
      );
      if (error) return callback(error);
      chunkOffset += blockSize;
    }

    this.bytesProcessed += chunkSize;
    this.prevBuff = chunk.slice(chunkOffset);
    callback();
  }

  protected abstract transformBlock(
    data: Buffer,
    start: number,
    exactIndex: number
  ): void | Error;
}
