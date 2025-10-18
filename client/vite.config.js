import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: { port: 5173, strictPort: true, host: true },
    // если хочешь без CORS, раскомментируй прокси:
    // server: { port: 8000, strictPort: true, host: true, proxy: { '/api': 'http://localhost:4000' } },
    preview: { port: 5173, strictPort: true, host: true }
})
