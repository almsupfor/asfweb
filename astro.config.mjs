import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://almtunasupporter.se',
  redirects: {
    '/bortaguiden': '/matcher',
  },
});
