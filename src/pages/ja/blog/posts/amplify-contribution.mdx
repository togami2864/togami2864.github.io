---
title: 'amplify-cliへのコントリビュートしてみよう & OSSに関する諸々'
description: "最近活動できていないのでアレですが、amplify-cliへのコントリビュートに関するあれこれ & OSS全体で今までの個人的な経験から役に立つかもしれないあれこれを書いていきます。
"
publishDate: 'Tuesday, Dec. 30 2021'
author: '@togami2864'
layout: '../../../../layouts/BlogPost.astro'
lang: 'ja'
i18: ''
filename: 'amplify-contribution'
---
最近活動できていないのでアレですが、[amplify-cli](https://github.com/togami2864/amplify-cli)へのコントリビュートに関するあれこれ & OSS全体で今までの個人的な経験から役に立つかもしれないあれこれを書いていきます。

## amplify-cliへコントリビュートしてみよう

#### 開発環境のセットアップ
基本的には[CONTRIBUTING.md](https://github.com/aws-amplify/amplify-cli/blob/master/CONTRIBUTING.md)に従っていれば大丈夫ですが1点補足があります。

- Nodeのバージョンをv14にすること

[issue](https://github.com/aws-amplify/amplify-cli/issues/8407)も出したのですが、Nodeのバージョンが`v15`だとテストで固まります。また、`v16`だと`yarn setup-dev`コマンドで落ちます。
現状`v14`だと動作を確認しているので確実だと思います。[^1]
加えて、M1macを使っている方は`v14`のビルドに多少時間がかかることにも注意してください。

また、setupのときに走るテストが割としょっちゅう落ちますが自分が作業するpackageのものでなければあんまり気にしなくていいと思います。[^2]
それが通ったらブランチを切って開発を進めましょう！


#### どこが取り組みやすいか

[amplify-cli/packages/amplify-cli/src/extensions/amplify-helpers/](https://github.com/aws-amplify/amplify-cli/tree/master/packages/amplify-cli/src/extensions/amplify-helpers)のテストの追加がやりやすいです。
この部分は基本的に関数単体で完結していたりあまり依存が多くないので取り組みやすいです。
パット見ですが
- get-project-config.ts(簡単すぎるかも)
- get-root-stack-id.ts(程よくmockを使わないといけない部分やエラーケースなど含んでて一番オススメ)
- get-tags.ts
- leave-breadcrumbs.ts
- list-categories.ts
- make-id.ts

あたりが書きやすいはずです。
テストは[amplify-cli/packages/amplify-cli/src/\_\_tests\_\_/extensions/amplify-helpers/](https://github.com/aws-amplify/amplify-cli/tree/master/packages/amplify-cli/src/__tests__/extensions/amplify-helpers)にあります。ここにないテストを追加していくといいと思います。

また、最初のうちはリポジトリになれるのももちろんですが、jestの操作やmock周りに迷うかもしれません。しかし、**似たようなテストを書いている部分が大量にある**はずなので参考にしていきましょう。

#### テストコマンド
ディレクトリ全体のルートで
```sh
$ yarn test
```
するとモノレポ傘下のすべてのテストが回って時間がかかります。
個々のパッケージでテストを走らせるには特定のパッケージルートでテストコマンドを打てば良いです。
```sh
// 例: amplify-cliのテストを走らせる。
$ cd packages/amplify-cli
$ yarn test
```

テストファイル指定するのも同様です。
例: packages/amplify-cli/src/\_\_tests\_\_/extensions/amplify-helpers/get-root-stack-id.test.tsを実行する場合

```sh
$ yarn test packages/amplify-cli/src/__tests__/extensions/amplify-helpers/get-root-stack-id.test.ts

// もしくは
$ cd packages/amplify-cli
$ yarn test src/__tests__/extensions/amplify-helpers/get-root-stack-id.test.ts
```

初めてのコントリビューションにいかがでしょうか？


## typoを直した。テストも追加した。その次は？
ここからはamplifyに限らずオープンソース全般に関してです。

ある程度コントリビューションに慣れてくると、もっと他のことをしたくなる人もいると思います。
役に立つかはわかりませんが初心者なりのちょいテクを投下しておきます。**あくまで個人の経験則に則っていることにだけご注意ください。** また、**突き詰めるとissueやリポジトリによりけりであることも忘れないでください。**
私が観測しているのはほぼ`JavaScript`及び`TypeScript`で作られているリポジトリです。

#### **issue選び**
取り組みやすいissueを選ぶ際には以下の2点は確保しておくといいと思います。

- 自分の環境で再現できること
- `expected behavior`もしくは改善案がはっきりしていること

`bug`ラベルや`enhancement`ラベルがついてるものだとこの2点がはっきりしていることが多いです。
逆に`feature-request`系のissueは若干ハードルが高い気がします。

#### **1年以上残ってるgood-first-issueについて**
1 ~ 2年以上残っている`good-first-issue`は

- コードというより依存先のパッケージが原因になっている。
- その依存先に対して破壊的な変更を加えなければならない。

というパターンが非常に多いように感じます。
なので極力新しめのものから見ていくといいかも。

#### **自分が踏み抜いたバグをなおす**
身もふたもないですが。
自分が直面したバグであれば、
- 動作しないとどのようなケースで困るのか
- どのような動作をしてほしいのか

という部分が把握できるのでモチベ的にで取り組みやすいと思います。個人的にこのパターンが一番多いです。

#### **翻訳のレビューをする**
新しめのOSSではドキュメントの`i18n`がすでに前提になっているものが増えてきました。
翻訳する側が取り上げられがちですが、**もちろん翻訳をレビューする側に回ってもOKです。**[^3]discordなどのコミュニティで「○○語できる人レビューしてちょ~」みたいな投稿が流れてきたりするのでたまに覗いてみるといいと思います。

#### その他貢献に関するヒント
[8 Non-technical ways to contribute to open-source](https://daily-dev-tips.com/posts/8-non-technical-ways-to-contribute-to-open-source/)とかも読んでみるよいかもです。

## おわりに
皆様良いお年を🎊🎊🎊🎊🎊








[^1]: 筆者の環境では`v14.17.6`で動作を確認しています。
[^2]: amplify-dynamodb-simulatorというパッケージがしょっちゅう落ちる
[^3]: 放置されてると「○○語わかんないけどgoogle翻訳かけたら大体合ってたからマージするわﾎﾟﾁ〜」みたいなノリでマージされてたりする。