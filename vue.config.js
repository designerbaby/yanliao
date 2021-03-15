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
  productionSourceMap: false   // 在正式环境不用sourceMap,就看不到源代码
  // lintOnSave: process.env.NODE_ENV !== 'production' // 正式环境禁用eslint-loader,测试环境启用
}
