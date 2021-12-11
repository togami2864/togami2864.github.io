---
title: '[Tip]: How to add alias in your astro project'
description: "Astro v0.21.0 got new build engine powered by Vite.
So we can use the alias settings provided by Vite in your astro project."
publishDate: 'Saturday, Dec. 11 2021'
author: '@togami2864'
layout: '../../../layouts/BlogPost.astro'
lang: 'en'
i18: 'ja'
filename: 'tip-about-alias-astro'
---

`Astro v0.21.0` got new build engine powered by `Vite`.
So we can use the alias settings provided by `Vite` in your `astro` project.
**It's no different than how you set up aliases in Vite for React or Vue projects.** It's just two steps.

1. Set `alias` in the `Vite` section of `astro.config.mjs`.
2. Set `paths` in `tsconfig.json` to enable editor support.

## config setting
Let's try to configure the `src` directory to be referenced by `@`.

1:
Add the following in the `vite` section of `astro.config.mjs`.

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

`path.dirname(new URL(import.meta.url).pathname)` is a bit unfamiliar, but **it's simply the equivalent of `__dirname` in `ESModules`.** The default extension for `astro.config.mjs` is `mjs`.

You have to use it **because the global variable `__dirname` is not available in `ESModules`.**


2:
If you are using `VSCode`, define `alias` in `paths` of `tsconfig.json` to enable Intellisense.

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

## Conclusion

You can import components like `import { Component } from '@/path'` in your astro project !!

```js
import { Button } from '@/components/Button.astro'
// src
//  |- components
//         | - Button.astro <- you can get it!!
```
