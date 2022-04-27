import { createWriteStream } from "fs";
import { Readable } from "stream";
import {
  tableBuffer1 as t1,
  tableBuffer2 as t2,
  tableBufferV2 as v2,
} from "../data/tableBuffers";
import { createByteDuplicator } from "../utils/ByteDuplicatorTransform";
import { createXorStream } from "../utils/XorTableApplicationTransform";

const s = Readable.from(t2)
  .pipe(createByteDuplicator(16))
  .pipe(createXorStream(t1))
  .pipe(createByteDuplicator(16))
  .pipe(createXorStream(t2))
  .pipe(createByteDuplicator(16))
  .pipe(createXorStream(t1))
  .pipe(createByteDuplicator(16))
  .pipe(createXorStream(t2))
  .pipe(createByteDuplicator(16))
  .pipe(createXorStream(t1));

// Generate the same mask as "unlock-music/cli" project.
s.pipe(createWriteStream("fixture/kgm.v2.mask_generated.bin"));

// Include v2 key - Support for files up to 4.2GiB
s.pipe(createByteDuplicator(16))
  .pipe(createXorStream(v2))
  .pipe(createWriteStream("fixture/kgm.v2.1.mask_final.bin"));
