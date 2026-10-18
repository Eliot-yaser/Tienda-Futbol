import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages publica este proyecto en /Tienda-Futbol/.
// En desarrollo local mantenemos la ruta raíz habitual.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Tienda-Futbol/' : '/',
}))
