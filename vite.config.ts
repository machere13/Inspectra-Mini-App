import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const tunnelUrl = process.env.VITE_PUBLIC_URL;
const tunnelHost = tunnelUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '');

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    allowedHosts: true,
    origin: tunnelUrl,
    hmr: tunnelHost ? { host: tunnelHost, clientPort: 443, protocol: 'wss' } : true,
  },
  build: { outDir: 'dist' },
});
