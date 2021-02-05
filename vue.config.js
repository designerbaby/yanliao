
module.exports = {
  // 注释原因，本地配了nginx做转发，这里就不需要配代理转发了
  // devServer: { 
  //   proxy: {
  //     '/cgi-bin': {
  //       target: 'https://test-yan.qq.com',
  //       changeOrigin: true,
  //     }
  //   }
  // }
  productionSourceMap: false
}