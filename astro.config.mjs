import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  site: 'https://progress-tab.vercel.app',
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
