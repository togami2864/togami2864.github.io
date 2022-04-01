---
title: 'jsテストライブラリの内部実装調査と実行速度の改善@abema-web'
description: "2022年2月にabemaのwebチームでjsテストライブラリの内部実装調査とライブラリの移行検証、実行速度の改善を行いました。"
publishDate: 'Tuesday, Mar. 29 2022'
author: '@togami2864'
layout: '../../../../layouts/BlogPost.astro'
lang: 'ja'
i18: ''
filename: 'cyberagent-abema-intern'
---
2022年2月にabemaのwebチームでjsテストライブラリの内部実装調査とライブラリの移行検証、実行速度の改善を行いました。メンターの[@nodaguchi](https://twitter.com/nodaguti)さんを始めabema-webチームの皆様ありがとうございました。

早速本題に入りますが、タイトルの通り次のような業務を行いました。
- jsテストライブラリの内部実装調査
- abema-webでのjest移行検証
- ユニットテストの実行速度改善

最終的にはローカルにおける実行速度を **約80%** 高速化しました。

### モチベーション
#### 1: 実行に時間がかかる

abema-webではテストライブラリとして `ava` を、テスト実行時のトランスパイラに  `babel` と各種 `react` や `typescript` のプラグイン(`preset-react` 、`preset-typescript` など)を使用しており、**約1400件** のユニットテストが存在しています。そしてローカルですべてのユニットテストを実行すると **約10分** かかり、実行するのが億劫な状態でした。

#### 2: エコシステム面で不安

esbuildやswcといったコンパイラを用いた `jest` の実行時間の高速化や `vitest`の登場など新たなコンパイラを用いたテスト環境が取り上げられるケースが多くなりました。
これらのエコシステムの充実度合いや将来性を考えると不安が残るため、移行を検証してみてみました。


### ライブラリの内部調査
実行速度のボトルネックとなっている部分を知るために `ava` のコードを実際にコードリーディングを行いました。その結果、テストの実行の流れを勝手に3つのフェーズに分けました。
1. **glob**: テストファイルの取得
2. **setup**: (globの終了 ~ runの実行前)
   - 依存のresolve
   - テストファイルのトランスパイル
   - describeやit、chain、hookの解析
   - プロセスやスレッドのfork
3. **assertion**: アサーションの実行

文字だと少しわかりにくいため[非常に簡素化したテストライブラリを用意しました](https://github.com/togami2864/toy-js-test-framework)。手元にクローンして遊んでみてください。

実際にコードを見ていきましょう。シンプルなテストケースとして次のようなものをテストするとします。

```js
// __test__/index.test.js
it("sample test", () => {
  expect(true).toBe(true);
});
```

テストライブラリ側で用意する関数は
- it
- expect

です。
`toBe` はシンプルに `received` と `expected` が一致していれば `true` を返し、そうでなければ `Error` をthrowします。
また、`it` は第一引数にタイトルを第二引数に関数を受け取る関数です。それらを適当な配列へpushします。

```js
// index.js
const tests = []

//matcherの定義
const expect = (received) => ({
  toBe: (expected) => {
    if (received !== expected) {
      throw new Error(`Expected ${expected} but received ${received}.`);
    }
    return true;
  },
});

// test関数の定義(testsは適当な配列)
const it = (title, fn) => tests.push([title, fn]);
```

次にファイルの取得です。本来ならば適当な `glob` ができるライブラリを用いてテストファイルのパスの配列を取得します。

```js
// 1. glob(本来であればglobを使う)
const testFilePath = ["__test__/index.test.js"];
```

この取得した `testFilePath` を `for` で回して評価していきます。

```js
for (file of testFilePath) {
  const code = fs.readFileSync(`${root}/${file}`, "utf-8");
  eval(code);
```

やってることは次のコードと同じになります。`it`や `expect` は前に宣言していますね。

```js
// index.js
for (file of testFilePath) {
  const code = fs.readFileSync(`${root}/${file}`, "utf-8");

  // ↓ evalの部分。引数の `code` の内容がそのまま実行される。
  it("sample test", () => {
    expect(true).toBe(true);
  });

.....
```
すると関数 `it` が実行され、配列 `tests`にpushされていきます。

最後にアサーションを行っていきます。 `for`で `tests` を回して `title` と `fn`を取り出します。
`fn` は先程のテストファイルのアサーション `expect(true).toBe(true)` に当たります。

これを `try` 内で実行します。もしも関数 `expect` でエラーが発生すれば `catch` 節へ行きます。

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
[もう少し実際のテストライブラリに近づけたものも用意しました。](https://github.com/togami2864/toy-js-test-lib-esm)雰囲気はつかめると思うので、ぜひ遊んでみてください。(解説はいつか書く)

### 仮説
テストライブラリの仕組みを知ることで

- 思いのほかjsのコード自体を評価しなければならない部分が多い。
- ライブラリの外からパフォーマンス改善のために手を加えられる部分は少ない

ということがわかったと思います。

jsのコード自体を評価しなければならない部分を早くするというのは `Node.js` の実行スピードを上げることとほぼ同義なのであまり現実的ではありません。また、テストの数が増えれば増えるほどこの部分の実行時間がかさむのではないかと考えました。

そのため身もふたもないのですが、**一つ一つの実行スピードを縮めるのはあまり現実的で無いため、如何にコンピュータに効率よくタスクをさばかせられるか(結局コア数指定増やしてparallel run)が改善の鍵だと考えました。**

これを踏まえて、
- トランスフォーマーを変える
- 論理コア数を使える最大まで使ってparallelにテスト実行

を行うことでabema-webのテストがどこまで早くできるか、移行とセットで検証をしました。

また、参考程度ではありますが、一つテストタスクあたりの各フェーズにかかる時間を測定して大小比較を試みました。もちろんこれはライブラリ間で単純比較できるものではありませんし、測定の都合上正確な数字ではありません。

![chart-phase](/images/cyberagent-abema-intern/chart-phase.png)

当たり前ではありますが処理盛りだくさんの `setup` が `assertion` の約6倍程度かかっていました。
また `glob` の全体に対する割合は小さいことがわかります。

### jestへの移行検証
調査を踏まえて、abema-webのテスト環境を `jest` へ移行をはじめました。[^1]
大まかな流れとして

1. [jest-codemods](https://github.com/skovhus/jest-codemods)による一括変換
2. 残りを変換
   - jest-codemodsが非対応なところ
   - avaのコンテクストに依存して独自に実装していたところ

jest-codemodsは `ava` や `jasmine` から `jest` に移行するためのマイグレーションツールです。このツールで最初に一括でコードを変換しました。

次に残りの部分ですが、`jest-codemods` が未対応なものとして次のものが挙げられます。

- t.like
- t.pass / t.fail
- t.context など

これらの部分と独自に作っていた `assertProvider` や `Mock` をVSCodeの置換や[js-codeshift](https://github.com/facebook/jscodeshift)のtransformerを自作して変換を行っていきました。

### トランスパイラについて
再掲ですが abema-webのテスト環境では `babel` と各種 `react` や `typescript` のプラグイン(`preset-react` 、`preset-typescript` など)を使用しています。

`preset-typescript` は型チェックは行っていないので変更しても問題ないと判断しました。今回は次の2つのツールを検討しました。

#### [esbuild-jest](https://github.com/aelbore/esbuild-jest)

abema-webではプロダクションビルドで `esbuild` を使っているため統一できると考え、最初に検討しました。しかし、
   - jestの最新バージョン `v27` に対応していない
   - メンテナンスがあまりされていない

ことから今回は試しませんでした。

#### [@swc/jest](https://github.com/swc-project/jest)

swc-project公式でメンテナンスされており、jestのv27でも問題なかったため今回はこちらを採用しました。また、思わぬ副産物として**今まで使っていたプラグインがなくてもすべて正常に動作したため、configが非常に簡潔になりました。**

## 速度の計測
ローカル環境では
- AVA + Babel(コア3)
- AVA + Babel(コア数15)
- jest + Babel(コア数15)
- jest + swc(コア数15)
を比較しました。

`MacBook Pro 2019` 上であり、論理コア数は16でした。[^2]
そのため `jest` の実行コマンドオプションに `--maxWorkers=15`を指定して実行しました。

CircleCi上では`Docker` の `Executer` は `medium` でコア数は2です。同様に `jest` の実行コマンドオプションに `--maxWorkers=1`を指定した上で、CircleCIのparallelismで分割指定し、

- AVA + Babel
- jest + Babel
- jest + swc

を比較しました。

すべて実行は5回ずつ行ってその平均を取りました。

### 速度の比較(ローカル)

| | AVA+Babel(3) | AVA+Babel(15) | jest+Babel | jest+swc |
| ---- | ---- | ---- | ---- | ---- |
| 1 | 10m 13s| 5m 54s | 2m 6s | 1m 52s |
| 2 | 10m 14s| 6m 3s| 2m 4s | 1m 53s |
| 3 | 10m 12s | 5m 51s | 2m 5s | 1m 52s |
| 4 | 10m 13s | 5m 50s | 2m 4s | 1m 51s |
| 5 | 10m 13s | 5m 49s | 2m 5s | 1m 51 s|
| 平均 | 10m 13s | 5m 53s | 2m 5s | 1m 52s |

![chart-local](/images/cyberagent-abema-intern/chart-local.png)

- ava + babel(コア３) -> jest + swc 構成への移行で **約80%** の短縮
- ava + babel(コア15) -> jest + swc 構成への移行で **約70%** の短縮

をすることができました。
概ね仮説通り実行コア数を増やすことは効果的であり、大幅な実行時間の改善を行うことができました。また、トランスパイラによる差異もせいぜい10秒未満であり影響は小さかったと言えました。


### 速度の比較(CircleCI)

| | AVA+Babel | jest+Babel | jest+swc |
| ---- | ---- | ---- | ---- |
| 1 | 3m 36s | 3m 38s | 3m 10s |
| 2 | 3m 27s | 3m 33s| 3m 11s |
| 3 | 3m 20s | 3m 20s | 3m 6s |
| 4 | 3m 13s | 3m 11s | 2m 47s |
| 5 | 3m 44s | 3m 14s | 2m 53s |
| 平均 | 3m 28s | 3m 23s | 3m 1s |


![chart-ci](/images/cyberagent-abema-intern/chart-ci.png)

こちらはあまり劇的な改善をすることができませんでした。ローカルではコアを富豪的に使えたこともあってそれに比べると、リソースが厳しく、あまり全体的に大きな差異が出ませんでした。

一方で**仮説とは反対にトランスパイラによる違いがはっきりと現れており、30秒 ~ ほど早くなりました。** 今回測定した中では2分台が出たのは `swc` を使ったパターンのみでした。

また、別の問題として、CircleCIのparallelismの挙動に偏りがあり、それを解消できなかったことが挙げられます。コンテナ1は2分40秒ほどで終わっているのにコンテナ2は3分40秒かかるみたいな現象が起きていました。

### 残った課題
先程言及したとおり、CircleCIのparallelismの挙動となぜCircleCI環境下では顕著に早かったかまでは深く探求することができませんでした。[^3]また、今回の測定ではCPU負荷やテスト環境のisolationに関して言及できていなかったため、まだまだ調査が必要だと感じています。

### 最後に
まだまだ粗のある調査でしたが、とてもおもしろかったです。改めて、abema-webチームの皆様、ありがとうございました！！

### おまけ: vitestを使っておけば早くなるのか
**watchモードではなく通常実行(CIとかで単発で実行するとき)での話です。**
- バージョン
  - v0.8.0

現状だとケースバイケースだと個人的に考えています。まずは理屈っぽい話から。
`vitest` のアイデアは単純明快でリゾルバーとして `vite` を使おうというものです。
核は[vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node)というパッケージです。これはREADMEの通り `Vite as Node runtime` であり、Browserの代わりにRunnerがclientに当たります。

`vitest` は
- Viteで諸々transform -> vmのコンテクスト内でテストファイルを実行 -> vitest側の処理

というのを繰り返して動作していることになります。

ここで、テストの流れを再度復習しておくと

1. **glob**: テストファイルの取得
2. **setup**: (globの終了 ~ runの実行前)
   - 依存のresolve
   - テストファイルのトランスパイル
   - describeやit、chain、hookの解析
   - プロセスやスレッドのfork
3. **assertion**: アサーションの実行

でした。`vite` を使うことによって高速化できそうな部分は
- 依存のresolve
- テストファイルのトランスパイル

です。
`vite` を使ったからと言ってjs自体の実行速度が早くなるわけではありません。そのため、assertionやテストファイルの解析はできないため、この２つです。

また、トランスパイルに関しては `jest` でもtransformerを変えれば同じことができそうです。
**となると依存のresolveの高速化により時間の短縮は期待できそうです。**

裏を返すと**そこまで依存のresolveがネックになっていないテストでは `jest` で回したときとあんまり変わらない!みたいなことは十分起こりうると考えています。**(現にちょこちょこissueやdiscordで見かける)

現状babel -> esbuild/swcでビルド時間が○○十倍になりました！みたいな衝撃はないと思っていて、個人的には **`jest` での最速編成に当たるものを no config で作れる + `typescript` や`esm` を気にしなくていい** みたいな感覚でいます。(言うまでもなく**watchでの差分実行は爆速です。**)

#### `vitest` がパフォーマンスに関して現状ぶち当たってる課題

- workerの挙動

あまり安定していないケースがあるようです。(もちろんあまり影響していないケースもある)
`vitest` は[デフォルトでisolateが `true` になっています](https://vitest.dev/config/#isolate)。このisolateは単にparallelに実行するときの `worker` を都度生成し直すことでenv pollutionを防ぎます。([実装はvitestではなくtinypoolというライブラリ](https://github.com/tinylibs/tinypool/pull/4))

しかし、これが原因でやたら実行が遅くなるケースが確認されており、isolateを切ると早くなります。([jest vs jasmine](https://github.com/EvHaus/jest-vs-jasmine))おそらくworkerの生成や消去の乱発をし過ぎなんじゃないかなーみたいな話が出ています。

また、別の話でprofilerで解析したところ一部workerが無意味にアイドル状態になっている期間があり、あまり効率よく実行できていないケースがあるようです。

- v0.6.0 ?

これは原因もわかっていないのですが、`v0.6.0` を境に謎に若干遅くなっている現象が起きています。
ちょくちょく `vitest` を試す記事が出ていますが、バージョン `0.6.0` 以前のものであれば、最新版で再度実行すると結果が変わるかもしれません。


[^1]: 他に候補もあったのですが時間の都合で試せませんでした。
[^2]: PCをとっくの昔に返却してしまいこれ以上わからない。。
[^3]: swc云々というよりもローカルの方では parallel runのオーバヘッド > swcが短縮した時間になってしまいこのような結果になった可能性も考えられる。
[^4]: もちろん実装が違うのでライブラリ間での単純比較は難しい

