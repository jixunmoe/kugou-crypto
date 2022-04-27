import * as assert from "assert";
import { table1, table2, tableV2 } from "./tables";

export const tableBuffer1 = Buffer.from(table1);
export const tableBuffer2 = Buffer.from(table2);
export const tableBufferV2 = Buffer.from(tableV2);

assert.equal(tableBuffer1.byteLength, 0x110);
assert.equal(tableBuffer2.byteLength, 0x110);
assert.equal(tableBufferV2.byteLength, 0x110);
