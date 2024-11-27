import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // 경고 한계를 1000KB로 변경
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 특정 라이브러리를 별도의 청크로 분리
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
})
