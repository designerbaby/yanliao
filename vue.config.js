module.exports = {
  devServer: {
    // port: 9090,
    // proxy: 'http://dev-yan.qq.com'
    proxy: {
      '/cgi-bin': {
        target: 'https://test-yan.qq.com',
        changeOrigin: true,
      }
    }
  }
}