import { closeSync, openSync, readSync, writeSync } from "fs";
import { decryptVprByteAtOffset } from "../utils/decryptionHelper";

const [, , inputFile, outputFile] = process.argv;

if (!inputFile || !outputFile) {
  throw new Error("file not specified");
}

const fInput = openSync(inputFile, "r");
const fOutput = openSync(outputFile, "w");

const header = Buffer.allocUnsafe(0x3c);
readSync(fInput, header);

const fileKey = Buffer.allocUnsafe(0x11);
header.copy(fileKey, 0, 0x1c, 0x2c);
fileKey[0x10] = 0;

const headerLen = header.readUint32LE(0x10);
console.info("header len: 0x%d", headerLen.toString(16));

// Seek
console.info("read extra %d bytes to seek...", headerLen - 0x3c);
readSync(fInput, Buffer.allocUnsafe(headerLen - 0x3c));

const blockSize = parseInt(process.env.BLOCK_SIZE || "", 10) || 40960;
const block = Buffer.allocUnsafe(blockSize);
let offset = 0;
let bytesRead = 0;

process.stdout.write(`begin decryption, block size = ${blockSize}...`);
while ((bytesRead = readSync(fInput, block)) > 0) {
  for (let i = 0; i < bytesRead; i++) {
    block[i] = decryptVprByteAtOffset(block[i], fileKey, offset + i);
  }
  writeSync(fOutput, block, 0, bytesRead);

  offset += bytesRead;
}

closeSync(fInput);
closeSync(fOutput);

process.stdout.write(" OK!\n");
