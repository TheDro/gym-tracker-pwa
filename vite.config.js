import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/gym-tracker/',
  plugins: [
    vue(),
    VitePWA({
      mode: 'development',
      base: '/gym-tracker/',
      manifest: {
        "name": "Gym Tracker",
        "short_name": "GymTracker",
        "start_url": ".",
        "display": "standalone",
        "background_color": "#fff",
        "description": "Track your gym progress with something better than a notepad.",
        "theme_color": "#fa0",
        "icons": [
          {
            "src": "./GymTrackerLogo512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      vue: path.resolve(__dirname, 'node_modules/vue/packages/vue/index')
    },
    extensions: ['.js', '.vue']
  }
})
