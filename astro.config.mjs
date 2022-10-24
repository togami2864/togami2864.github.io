import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// let base;
// if (process.env.NODE_ENV !== 'production') {
//   base = '';
// } else {
//   base = 'https://togami2864.github.io/';
// }
export default defineConfig({
  integrations: [react(), mdx()],
  // base,
});
