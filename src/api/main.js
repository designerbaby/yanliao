// 主功能相关api

import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  timeout: 5000,
})

service.interceptors.response.use(response => {
  if (response && response.data) {
    // 网关错误拦截
    let data = response.data || {}
    if (data && data.ret_code !== 0 && data.ret_code !== 100000) {
      Message.error('请求失败: ' + data.err_msg)
    }
  }
  return response
}, error => {
  const res = {
    success: false,
    message: '系统错误，请重试！'
  }
  Message.error('系统错误，请重试！')
  return Promise.resolve(res)
})

export default service