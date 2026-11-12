import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Dirección del backend a la que Vite reenvía las peticiones que empiezan por /api.
// En Docker llega por la variable API_DESTINO; fuera de Docker se usa localhost:8080.
const destinoApi = process.env.API_DESTINO ?? 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En Docker (Mac) hay que preguntar por los cambios de ficheros para que se recargue
    watch: { usePolling: true },
    proxy: {
      '/api': {
        target: destinoApi,
        changeOrigin: true,
      },
    },
  },
})