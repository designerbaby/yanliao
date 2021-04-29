import { getCookie, getAuthorization, camSafeUrlEncode } from '@/common/utils/helper'
import { getUserCredential } from '@/api/audioSource'
import { Message } from 'element-ui'

const getCredential = async () => {
  const res = await getUserCredential()
  return res.data
}

const sendFile = (file, method, key, Authorization, XCosSecurityToken, callback) => {
  const action = 'https://yan-1253428821.cos.ap-guangzhou.myqcloud.com/'
  var url = `${action}${camSafeUrlEncode(key).replace(/%2F/g, '/')}`
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Authorization', Authorization);
  XCosSecurityToken && xhr.setRequestHeader('x-cos-security-token', XCosSecurityToken)
  xhr.upload.onprogress = (e) => {
    const percentage = parseFloat(Math.round(e.loaded / e.total * 10000) / 100)
    // callback(null, { percentage: percentage })
    console.log(`进度: ${percentage}%`)
    // Message.success(`正在解析${percentage}%`)
  };
  xhr.onload = () => {
    if (/^2\d\d$/.test('' + xhr.status)) {
      var ETag = xhr.getResponseHeader('etag')
      callback(null, {url: url, ETag: ETag})
    } else {
      callback(`文件${key}上传失败，状态码：${xhr.status}`)
    }
  };
  xhr.onerror = () => {
    callback(`文件${key}上传失败，请检查是否没配置 CORS 跨域规则`)
  };
  xhr.send(file);
}

export const uploadFile = async (file, type, callback) => {
  const method = 'PUT'
  const mxUid = getCookie('mx_uid')
  if (type === 'upload') {
    Message.success('上传中')
  } else {
    Message.success('开始解析中,请耐心等待～')
  }
  const key = `file/${mxUid}/${file.name}`
  const { data } = await getCredential()
  const info = await getAuthorization(method, key, data)
  const Authorization = info.Authorization   // 得到的签名
  const XCosSecurityToken = info.XCosSecurityToken // 得到的sessionToken
  sendFile(file, method, key, Authorization, XCosSecurityToken, (err, data) => {
    if (err) {
      Message.error(err)
    } else {
      console.log('uploadFile url:', data.url)
      callback(data.url)
    }
  })
}
