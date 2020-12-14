module.exports = {
  devServer: {
    proxy: {
      '/cgi-bin': {
        target: 'https://test-yan.qq.com',
        changeOrigin: true,
      }
    }
  }
}