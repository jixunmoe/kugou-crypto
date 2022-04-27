import { closeSync, openSync, writeSync } from "fs";
import { getMaskByteAtOffset } from "../utils/getMaskByteAtOffset";

const f = openSync("fixture/buf-test.bin", "w");
const buf = Buffer.allocUnsafe(4096);
for (let i = 0; i < 0x45c453f; i += 4096) {
  for (let j = 0; j < 4096; j++) {
    buf[j] = getMaskByteAtOffset(i + j);
  }
  writeSync(f, buf);
}
closeSync(f);
