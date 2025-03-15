import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy middleware configuration
const proxyOptions = {
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy/': '/', // remove /proxy/ path
  },
  onProxyRes: function (proxyRes: any) {
    // Remove headers that prevent framing
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  },
};

// Create proxy instance
const proxy = createProxyMiddleware(proxyOptions);

// Use proxy for all routes starting with /proxy/
app.use('/proxy/', proxy);

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});