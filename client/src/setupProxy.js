const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('setupProxy.js loaded');
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000/api',
      changeOrigin: true,
    })
  );
};


