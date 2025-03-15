import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start proxy server
const proxyProcess = spawn('node', [resolve(__dirname, 'proxy.js')], {
  stdio: 'inherit'
});

// Wait for proxy server to start
setTimeout(() => {
  // Start Vite dev server
  const viteProcess = spawn('vite', [], {
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  const cleanup = () => {
    proxyProcess.kill();
    viteProcess.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Handle child process errors
  viteProcess.on('error', (err) => {
    console.error('Vite server error:', err);
    cleanup();
  });

  // Handle child process exit
  viteProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Vite server exited with code ${code}`);
      cleanup();
    }
  });
}, 1000); // Wait 1 second for proxy server to start

// Handle proxy process errors
proxyProcess.on('error', (err) => {
  console.error('Proxy server error:', err);
  process.exit(1);
});

// Handle proxy process exit
proxyProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Proxy server exited with code ${code}`);
    process.exit(1);
  }
});