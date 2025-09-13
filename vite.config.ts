import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Graceful shutdown plugin to ensure dev server closes on termination signals
const gracefulShutdown = (): Plugin => {
  let closing = false;
  return {
    name: 'graceful-shutdown',
    apply: 'serve',
    configureServer(server) {
      // Use globalThis.process to avoid requiring Node types in tsconfig
      const proc: any = (globalThis as any).process;
      if (!proc) return;

      console.log('[graceful-shutdown] plugin active');

      const cleanup = async () => {
        if (closing) {
          console.log('[graceful-shutdown] cleanup already in progress, skipping');
          return;
        }
        closing = true;
        console.log('[graceful-shutdown] Closing Vite dev server...');
        try {
          await server.close();
          console.log('[graceful-shutdown] Vite dev server closed. Exiting process.');
        } catch (err) {
          console.error('[graceful-shutdown] Error while closing Vite dev server:', err);
        } finally {
          try {
            proc.exit(0);
          } catch {
            /* ignore */
          }
        }
      };

      const onSigInt = () => {
        console.log('[graceful-shutdown] SIGINT received');
        cleanup();
      };
      const onSigTerm = () => {
        console.log('[graceful-shutdown] SIGTERM received');
        cleanup();
      };

      proc.once('SIGINT', onSigInt);
      proc.once('SIGTERM', onSigTerm);

      server.httpServer?.once('close', () => {
        try {
          if (typeof proc.off === 'function') {
            proc.off('SIGINT', onSigInt);
            proc.off('SIGTERM', onSigTerm);
          } else if (typeof proc.removeListener === 'function') {
            proc.removeListener('SIGINT', onSigInt);
            proc.removeListener('SIGTERM', onSigTerm);
          }
          console.log('[graceful-shutdown] HTTP server close event fired; signal listeners removed');
        } catch {
          // ignore
        }
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), gracefulShutdown()],
  publicDir: 'public',
  assetsInclude: ['**/*.md'],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
  },
});
