import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://almtunasupporter.se',
  redirects: {
    '/bortaresor': '/matcher#bortaresor',
    '/bortaguiden': '/matcher',
  },
});
