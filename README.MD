# 酷狗 KGM 解密

根据 unlock-music/cli 项目的 `kgm mask` 进行研究所制作的库。

目前可以 1:1 生成相对应的 mask 文件并进行解密。

## 测试

手动对比 `unlock-music/cli` 的处理结果与使用该项目解密文件的哈希值。

## CLI 使用

```sh
node -r ts-node/register/transpile-only src/cli/decode_kgm.ts "input.kgm" "output.flac"
node -r ts-node/register/transpile-only src/cli/decode_vpr.ts "input.vpr" "output.flac"
```

## 浏览器调用

```js
const {
  decryptKgmByteAtOffsetV2,
  decryptVprByteAtOffset,
} = require("@jixun/kugou-crypto/utils/decryptionHelper");

const offset = 0x1234;
const fileKey = Buffer.alloc(17); // 17 字节的文件专属 key
decryptKgmByteAtOffsetV2(encryptedBytes[offset], fileKey, offset);
decryptVprByteAtOffset(encryptedBytes[offset], fileKey, offset);
```

参考项目的 `cli/decode_kgm.ts` 与 `cli/decode_vpr.ts`。

## Node.js 调用

- 同浏览器调用；
- 支持使用流来生成 `mask` 文件 - 参考项目的 `cli/generate-mask.ts`。
