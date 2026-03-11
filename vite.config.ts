import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Stavanger Mobilitet',
        short_name: 'Stavanger',
        description: 'Ledige parkeringsplasser og bysykler i Stavanger',
        theme_color: '#007079',
        background_color: '#f7f7f7',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        globIgnores: ['**/*.{jpg,jpeg}', 'Skjermbilde*'],
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 300 },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api/parking': {
        target: 'https://opencom.no',
        changeOrigin: true,
        rewrite: () =>
          '/dataset/36ceda99-bbc3-4909-bc52-b05a6d634b3f/resource/d1bdc6eb-9b49-4f24-89c2-ab9f5ce2acce/download/parking.json',
      },
      '/api/bikes': {
        target: 'https://opencom.no',
        changeOrigin: true,
        rewrite: () =>
          '/dataset/3e1b1ea2-1155-4058-8f92-8cbc9f547e72/resource/d0023623-128b-4a4a-be9b-cd8419cd3120/download/citybikesstvg_entur_processed.json',
      },
      '/api/transit': {
        target: 'https://api.entur.io',
        changeOrigin: true,
        rewrite: () => '/journey-planner/v3/graphql',
      },
      '/api/gbfs': {
        target: 'https://gbfs.urbansharing.com',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/gbfs', ''),
      },
    },
  },
})
