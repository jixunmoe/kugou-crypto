import { createReadStream, createWriteStream, writeFileSync } from "fs";
import { createRowCompressor } from "../utils/CompressRowTransform";
import { createXorCompressor } from "../utils/XorTableExtractionTransform";

const stage1Table = Buffer.alloc(16 * 17);
const stage2Table = Buffer.alloc(16 * 17);
const stage3Table = Buffer.alloc(16 * 17);
const stage4Table = Buffer.alloc(16 * 17);
const stage5Table = Buffer.alloc(16 * 17);

const processStream = createReadStream("fixture/kgm.v2.mask")
  .pipe(createXorCompressor(stage1Table))
  .pipe(createRowCompressor(16))
  .pipe(createXorCompressor(stage2Table))
  .pipe(createRowCompressor(16))
  .pipe(createXorCompressor(stage3Table))
  .pipe(createRowCompressor(16))
  .pipe(createXorCompressor(stage4Table))
  .pipe(createRowCompressor(16))
  .pipe(createXorCompressor(stage5Table))
  .pipe(createRowCompressor(16))
  .pipe(createWriteStream("fixture/xor.stage5-compressed.bin"));

processStream.once("finish", () => {
  writeFileSync("fixture/stage1Table.bin", stage1Table);
  writeFileSync("fixture/stage2Table.bin", stage2Table);
  writeFileSync("fixture/stage3Table.bin", stage3Table);
  writeFileSync("fixture/stage4Table.bin", stage4Table);
  writeFileSync("fixture/stage5Table.bin", stage5Table);
});
