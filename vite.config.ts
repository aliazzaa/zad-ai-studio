
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false, // Disable sourcemaps for production security and size
      rollupOptions: {
        output: {
          // Use hash in filenames for better cache busting on CDN/Firebase
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: {
            // Core React vendor chunk - separates framework from app code
            'vendor-react': ['react', 'react-dom'],
            // AI SDK chunk - separates the heavy AI library
            'vendor-ai': ['@google/genai'],
          }
        }
      },
      // Ensure assets are handled correctly
      assetsInlineLimit: 4096
    },
    define: {
      // Securely expose specific environment variables to the client
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY),
      'process.env.YOUTUBE_CLIENT_ID': JSON.stringify(env.VITE_YOUTUBE_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID),
      'process.env.YOUTUBE_API_KEY': JSON.stringify(env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY)
    }
  }
})
