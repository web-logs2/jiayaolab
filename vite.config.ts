import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/vendors.[hash].js',
        chunkFileNames: 'assets/chunk.[hash].js',
        assetFileNames: chunkInfo => {
          let prefix = '[name]'
          if (chunkInfo.name.endsWith('.css')) {
            prefix = 'chunk'
          }
          return `assets/${prefix}.[hash].[ext]`
        },
      },
    },
  },
})
