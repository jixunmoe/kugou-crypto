import { vprKey } from "../data/tables";
import { getMaskByteAtOffsetV2 } from "./getMaskByteAtOffset";
import { xorLowerHalfByte } from "./xorLowerHalfByte";

export function decryptKgmByteAtOffsetV2(
  encryptedByte: number,
  fileKey: Buffer | number[],
  offset: number
) {
  return xorLowerHalfByte(
    getMaskByteAtOffsetV2(offset) ^ encryptedByte ^ fileKey[offset % 17]
  );
}

export function decryptVprByteAtOffset(
  encryptedByte: number,
  fileKey: Buffer | number[],
  offset: number
) {
  return (
    decryptKgmByteAtOffsetV2(encryptedByte, fileKey, offset) ^
    vprKey[offset % 17]
  );
}
