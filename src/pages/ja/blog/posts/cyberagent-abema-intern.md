---
title: 'jsテストライブラリの内部実装調査と実行速度の改善@abema-web'
description: "2022年2月にabemaTVでjsテストライブラリの内部実装調査とライブラリの移行検証、実行速度の改善を行いました。"
publishDate: 'Tuesday, Mar. 29 2022'
author: '@togami2864'
layout: '../../../../layouts/BlogPost.astro'
lang: 'ja'
i18: ''
filename: 'cyberagent-abema-intern'
---
2022年2月にabemaTVでjsテストライブラリの内部実装調査とライブラリの移行検証、実行速度の改善を行いました。メンターの[@nodaguchi](https://twitter.com/nodaguti)さんを始めabema-webチームの皆様ありがとうございました。

早速本題に入りますが、タイトルの通り次のような業務を行いました。
- jsテストライブラリの内部実装調査
- abema-webでのjest移行検証
- ユニットテストの実行速度改善

最終的にはローカルにおける実行速度を **約80%** 高速化しました。

### モチベーション
#### 1: 実行に時間がかかる

abema-webではテストライブラリとして`ava`を、テスト実行時のトランスパイラに`babel`と各種`react`や`typescript`のプラグイン(`preset-react`、`preset-typescript`など)を使用しており、**約1400件**のユニットテストが存在しています。そしてローカルですべてのユニットテストを実行すると**約10分**かかり、実行するのが億劫な状態でした。

#### 2: エコシステム面で不安


### ライブラリの内部調査
実行速度のボトルネックとなっている部分を知るために`ava`のコードを実際にコードリーディングを行いました。その結果、テストの実行の流れを勝手に3つのフェーズに分けました。
1. **glob**: テストファイルの取得
2. **setup**: (globの終了 ~ runの実行前)
   - 依存のresolve
   - テストファイルのトランスパイル
   - describeやit、chain、hookの解析
3. **run**: アサーションの実行

文字だと少しわかりにくいため[非常に簡素化したテストライブラリを用意しました]()。手元にクローンして遊んでみてください。
実際にコードを見ていきましょう。シンプルなテストケースとして次のようなものをテストするとします。

```javascript
// __test__/index.test.js

it("sample test", () => {
  expect(true).toBe(true);
});
```

テストライブラリ側で用意する関数は
- it
- expect

です。
`toBe` はシンプルに `received` と `expected` が一致していれば `true` をそうでなければ `Error` をthrowします。
また、`it` は第一引数にタイトルを第二引数に関数を受け取る関数です。それらを適当な配列へpushします。

```javascript
// index.js

const tests = []

~~~~~~~~~~~~~~~

//matcherの定義
const expect = (received) => ({
  toBe: (expected) => {
    if (received !== expected) {
      throw new Error(`Expected ${expected} but received ${received}.`);
    }
    return true;
  },
});

// test関数の定義
const it = (title, fn) => tests.push([title, fn]);
```

簡単のため `eval` 使っていますが

やってることは次のコードと同じになります。`it`や `expect` は前に宣言していますね。

```js
// index.js
for (file of testFilePath) {
  const code = fs.readFileSync(`${root}/${file}`, "utf-8");

  // ↓ evalの部分
  it("sample test", () => {
    expect(true).toBe(true);
  });

  const results = [];
  for ([title, fn] of tests) {
.....
```
すると関数 `it` が実行され、配列 `tests`にpushされていきます。

最後にアサーションを行っていきます。 `for`で `tests` を回して `title` と `fn`を取り出します。
`fn`は先程のテストファイルのアサーション`expect(true).toBe(true)`に当たります。

これを `try`内で実行します。もしも関数`expect`でエラーが発生すれば `catch`節へ行きます。

```js
try {
      // 3. assertion実行(今回の場合`expect(true).toBe(true)`)
      fn();
      result.success = true;
    } catch (e) {
      // もしもfn()でエラーが起こったらcatch節へ
      result.error = e;
    }
```

これが大まかなテストライブラリの実行の流れになります。


もう少し実際のテストライブラリに近づけたものも用意しました。ぜひ遊んでみてください。(解説はおまけにて)












