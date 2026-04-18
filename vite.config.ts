import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.svg'],
  
  build: {
    // Code splitting for better caching and parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    
    // Aggressive minification and compression
    minify: 'terser',
    
    // Disable source maps in production for smaller bundle
    sourcemap: false,
    
    // Reduce chunk file size warning
    chunkSizeWarningLimit: 1000,
    
    // CSS code splitting for separate CSS files
    cssCodeSplit: true,
    
    // Enable gzip compression
    reportCompressedSize: true,
  },
  
  // Optimize dependencies - pre-bundle them for faster loads
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vite/client'],
  },
})