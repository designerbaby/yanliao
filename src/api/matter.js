import service from './main'

const axios = service
// 文档 http://git.tmeoa.com/willwu/ApiDocs/blob/master/yan/%E7%B4%A0%E6%9D%90.md

// 用户素材列表
const fetchList = data => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/material/list_user_material',
    data
  })
}

// 上传素材签名
const fetchSign = data => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/material/get_upload_sign',
    data
  })
}

// 获取标签输入建议
const associateTag = data => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/material/associate_tag',
    data
  })
}

// 删除素材
const delMatter = data => {
  return axios({
    method: 'post',
    url: '/cgi-bin/v1/yan/material/del_material',
    data
  })
}

export { fetchList, fetchSign, associateTag, delMatter }
