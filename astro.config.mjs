import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
