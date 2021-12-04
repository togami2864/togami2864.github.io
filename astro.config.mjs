// @ts-check
import path from 'path';
/** @type {import('astro').AstroUserConfig} */
export default {
  renderers: ['@astrojs/renderer-react'],
  buildOptions: {
    site: 'https://togami2864.github.io/',
  },
  vite: {
    plugins: [],
    resolve: {
      alias: {
        '@components/*': path.join(
          // @ts-ignore
          path.dirname(new URL(import.meta.url).pathname),
          './src/components'
        ),
      },
    },
  },
};
