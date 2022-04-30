import { table1 as t1, table2 as t2, tableV2 as v2 } from "../data/tables";

export const TABLE_SIZE = 16 * 17;

export function getMaskByteAtOffset(offset: number) {
  let value = 0;
  while (offset >= 0x11) {
    value ^= t1[offset % TABLE_SIZE];
    offset >>>= 4;
    value ^= t2[offset % TABLE_SIZE];
    offset >>>= 4;
  }
  return value;
}

export function getMaskByteAtOffsetV2(offset: number) {
  return v2[offset % TABLE_SIZE] ^ getMaskByteAtOffset(offset >>> 4);
}
