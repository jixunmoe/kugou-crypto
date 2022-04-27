import { Readable } from "stream";

export async function readAll(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let chunks: Buffer[] = [];
    stream.on("data", (blob: Buffer) => {
      chunks.push(blob);
    });
    stream.once("end", () => {
      resolve(Buffer.concat(chunks));
      (chunks as unknown) = null;
    });
    stream.once("error", (error) => {
      reject(error);
      (chunks as unknown) = null;
    });
  });
}
