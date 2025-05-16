const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // バックエンド接続用プロキシ設定
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      },
      logLevel: 'debug'
    })
  );
}; 
