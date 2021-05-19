
const config = {
  // lintOnSave: process.env.NODE_ENV !== 'production' // 正式环境禁用eslint-loader,测试环境启用
  productionSourceMap: false,   // 在正式环境不用sourceMap,就看不到源代码
  configureWebpack: config => {
    config.entry.app = ["babel-polyfill", "./src/main.js"];
  }
}

// 若本地配了nginx做转发，这里就不需要配代理转发了
if (process.env.proxy) {
  config.devServer = {
    proxy: {
      '/cgi-bin': {
        target: 'https://test-yan.qq.com',
        changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader('referer', 'https://test-yan.qq.com')
        },
        onProxyRes(proxyRes, req, res) {
          if (Array.isArray(proxyRes.headers['set-cookie'])) {
            proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(n => (n.replace(/Domain=[a-z.-]+;/, '')))
          }
        }
      }
    }
  }
}

module.exports = config;