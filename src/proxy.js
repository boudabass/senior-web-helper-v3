import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const port = 3001;

// Enable CORS with specific options
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Proxy middleware configuration
const proxy = createProxyMiddleware({
  target: 'https://google.com',
  changeOrigin: true,
  ws: true,
  xfwd: true,
  secure: false,
  followRedirects: true,
  proxyTimeout: 30000,
  timeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    // Add custom headers to the proxied request
    proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
    proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.5');
    proxyReq.setHeader('Connection', 'keep-alive');
    proxyReq.setHeader('Upgrade-Insecure-Requests', '1');
    proxyReq.setHeader('Sec-Fetch-Dest', 'document');
    proxyReq.setHeader('Sec-Fetch-Mode', 'navigate');
    proxyReq.setHeader('Sec-Fetch-Site', 'none');
    proxyReq.setHeader('Sec-Fetch-User', '?1');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Remove restrictive headers
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['x-content-security-policy'];
    delete proxyRes.headers['x-webkit-csp'];
    
    // Set permissive CSP
    proxyRes.headers['content-security-policy'] = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *";
    
    // Add CORS headers
    proxyRes.headers['access-control-allow-origin'] = '*';
    proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization, Accept, X-Requested-With';
    proxyRes.headers['access-control-allow-credentials'] = 'true';
    proxyRes.headers['access-control-max-age'] = '86400';
    
    // Add security headers
    proxyRes.headers['x-content-type-options'] = 'nosniff';
    proxyRes.headers['x-xss-protection'] = '1; mode=block';
    
    // Ensure proper content type for HTML
    if (proxyRes.headers['content-type']?.includes('text/html')) {
      proxyRes.headers['content-type'] = 'text/html;charset=utf-8';
    }
  },
  pathRewrite: (path) => {
    return path.replace(/^\/proxy\//, '');
  },
  router: (req) => {
    const path = req.url.replace(/^\/proxy\//, '');
    const url = path.includes('://') ? path : `https://${path}`;
    return url.replace(/\/+/g, '/').replace(':/', '://');
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.writeHead(500, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: *"
    });
    res.end('Proxy Error');
  }
});

// Use proxy for all routes starting with /proxy/
app.use('/proxy/', proxy);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Proxy server terminated');
    process.exit(0);
  });
});