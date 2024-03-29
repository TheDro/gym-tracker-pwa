import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/gym-tracker-pwa/',
  plugins: [
    vue(),
    VitePWA({
      mode: 'development',
      base: '/gym-tracker-pwa/',
      manifest: {
        "name": "Gym Tracker",
        "short_name": "GymTracker",
        "start_url": ".",
        "display": "standalone",
        "background_color": "#fff",
        "description": "Track your gym progress with something better than a notepad!",
        "theme_color": "#78e6ff",
        "icons": [
          {
            "src": "./GymTrackerLogoV2_512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue']
  }
})
