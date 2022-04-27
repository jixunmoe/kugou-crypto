import test from "ava";
import { PassThrough, Readable } from "stream";
import { readAll } from "../readAll";
import { CompressRowTransform } from "../CompressRowTransform";

test("It should compress rows", async (t) => {
  const s = Readable.from(Buffer.from([1, 1, 2, 2, 3, 3, 4, 4])).pipe(
    new CompressRowTransform(2)
  );
  t.deepEqual(await readAll(s), Buffer.from([1, 2, 3, 4]));
});

test("It should discard extra data", async (t) => {
  const s = Readable.from(Buffer.from([1, 1, 2, 2, 3, 3, 4, 4, 0xff])).pipe(
    new CompressRowTransform(2)
  );
  t.deepEqual(await readAll(s), Buffer.from([1, 2, 3, 4]));
});

test("It should work when the data is injected slowly", async (t) => {
  const s = new PassThrough();

  s.write(Buffer.from([1, 1]));
  setTimeout(() => {
    s.write(Buffer.from([1, 0xff, 0xff, 0xff]));
    s.end();
  }, 50);

  t.deepEqual(
    await readAll(s.pipe(new CompressRowTransform(3))),
    Buffer.from([1, 0xff])
  );
});
