module.exports = {
  devServer: {
    proxy: {
      '/cgi-bin': {
        target: 'http://test-yan.qq.com',
        changeOrigin: true,
      }
    }
  }
}