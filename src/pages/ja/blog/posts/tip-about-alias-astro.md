---
title: 'astroのプロジェクトでaliasを設定する'
description: "Astro v0.21.0にてViteによる新たなビルドエンジンが提供されました。
そのため、Viteが提供しているaliasの設定をastroのプロジェクトでも行うことができます。"
publishDate: 'Saturday, Dec. 11 2021'
author: '@togami2864'
layout: '../../../../layouts/BlogPost.astro'
lang: 'ja'
i18: 'en'
filename: 'tip-about-alias-astro'
---

`Astro v0.21.0`にて`Vite`による新たなビルドエンジンが提供されました。
そのため、`Vite`が提供しているaliasの設定をastroのプロジェクトでも行うことができます。
結論から言っておくと reactやvueのプロジェクトにおける `Vite` での `alias` の設定方法と何も変わりません。たったの2ステップです。

1. `astro.config.mjs` の `Vite` の項目で `alias` を設定
2. エディタのサポートを有効にするため `tsconfig.json` の `paths` を設定

## config設定
`src`ディレクトリを`@`で参照できるように設定してみます。

1:
`astro.config.mjs`の`vite`配下にて以下のように記述します。

```js
import path from 'path';
/** @type {import('astro').AstroUserConfig} */
export default {
  vite: {
    resolve: {
      alias: {
        '@/*': path.join(
          path.dirname(new URL(import.meta.url).pathname),
          './src'
        ),
      },
    },
  },
};
```

`path.dirname(new URL(import.meta.url).pathname)`というちょっと見慣れない記法がありますが、簡単に言うと`ESModules`における`__dirname`に当たるものです。`astro.config.mjs`の拡張子はデフォルトで`mjs`です。

`ESModules`ではグローバル変数`__dirname`が使えなくなるため、このように書いています。


2:
もしも`VSCode`を使っているなら`tsconfig.json`の`paths`に`alias`を定義してインテリセンスを有効にしましょう。

```json
{
  "compilerOptions": {
    ......
    "paths": {
      "@/*": ["./src/*"]
    }
  },
}
```

以上の設定を終えると次のようにコンポーネントのimportができるようになります。

```js
import { Button } from '@/components/Button.astro'
// src
//  |- components
//         | - Button.astro <- you can get it!!
```






