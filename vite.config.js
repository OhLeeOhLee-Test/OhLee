import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ⭐️ 나중에 깃허브 창고 이름이 정해지면 이 부분을 꼭 그 이름으로 바꿔주세요!
  // (예: '/ohlee-portfolio/') 지금은 비워두거나 임시로 적어둡니다.
  base: '/OhLee/',
});
