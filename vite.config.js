import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.PORT || '5173', 10)

  return {
    plugins: [
      tailwindcss(),
      react(),
    ],
    server: {
      port,
      strictPort: true, // Fail if port is already in use instead of falling back to next available
    },
    preview: {
      port,
      strictPort: true,
    }
  }
})
