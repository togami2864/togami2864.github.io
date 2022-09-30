import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  buildOptions: {
    site: 'https://togami2864.github.io/',
  },
});
