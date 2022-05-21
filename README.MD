# 酷狗 KGM 解密

根据 unlock-music/cli 项目的 `kgm mask` 进行研究所制作的库。

目前可以 1:1 生成相对应的 mask 文件方便运算。

## 测试

手动对比 `unlock-music/cli` 的处理结果与使用该项目解密文件的哈希值。

## 使用

简单封装了 `cli` 使用，无依赖的浏览器调用以及可以利用 `stream` 来异步生成 `mask` 的
node 接口。

### CLI

```sh
npm run build # 编译 TypeScript 文件

node dist/cli/decode_kgm "input.kgm" "output.flac"
node dist/cli/decode_vpr "input.vpr" "output.flac"
```

### 浏览器

```js
const {
  decryptKgmByteAtOffsetV2,
  decryptVprByteAtOffset,
} = require("@jixun/kugou-crypto/dist/utils/decryptionHelper");

const offset = 0x1234;
const fileKey = Buffer.alloc(17); // 17 字节的文件专属 key
decryptKgmByteAtOffsetV2(encryptedBytes[offset], fileKey, offset);
decryptVprByteAtOffset(encryptedBytes[offset], fileKey, offset);
```

参考项目的 `cli/decode_kgm.ts` 与 `cli/decode_vpr.ts`。

### Node.js

- 同浏览器调用；
- 支持使用流来生成 `mask` 文件 - 参考项目的 `cli/generate-mask.ts`。

## 其他 `cli` 小工具使用

### 压缩 `unlock-music/cli` 项目内置的 mask 文件

需要提前准备完整的 `mask` 文件来尝试压缩。

```sh
mkdir -p fixture
curl -L https://github.com/unlock-music/cli/raw/v0.1.1/algo/kgm/kgm.v2.mask \
  | xz -d > fixture/kgm.v2.mask
```

### 生成完整的 mask 文件

调用 `src/cli/generate-mask.ts` 来生成。

- `fixture/kgm.v2.mask_generated.bin`
  - SHA 256：`d4903d367b158f4f9287c6bd5dedca9893fa1da6643e372c2ea45d18e50fba00`
  - 文件大小：272 MB (285,212,672 字节)
- `fixture/kgm.v2.1.mask_final.bin`
  - SHA 256：`3ed82a45df47f5b6e93d77eff7a94a120b93b7f6a59b50d6209e47c8c36d5a0e`
  - 文件大小：4.25 GB (4,563,402,752 字节)
