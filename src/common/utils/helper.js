export const reportEvent = (eventName, eventId, params='') => { // 数据上报事件
  console.log('reportEvent:', eventName, eventId, params)
  BeaconAction.onEvent(eventId || eventName, eventName, params)
}

export const isProdEnv = 'yan.qq.com' === location.hostname
export const isTestEnv = !isProdEnv
// export const isTestEnv = (/dev|test|localhost/i).test(location.hostname)

// 获取url上各个信息
export const getUrlParameters = _ => { 
  const match = window.location.search.match(/([^?=&]+)(=([^&]*))/g)
  if (match) {
    return match.reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = process.browser && decodeURIComponent(v.slice(v.indexOf('=') + 1)), a), {}) // eslint-disable-line
  }
  return {}
}

// 获取url上各个信息
export const getParam = (key) => {
  const result = new RegExp(`${key}=([^&]*)`, 'i').exec(window.location.search)
  return (result && decodeURI(result[1])) || ''
}

export const sleep = delay => new Promise(resolve => setTimeout(resolve, delay))

// 获取cookie里面的信息
export const getCookie = name => {
  const RE = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
  const arr = document.cookie.match(RE)
  if (arr) {
    return unescape(arr[2])
  }
  return ''
}

// 将像素转成相应时间的方法
export const pxToTime = (target, note, bpm) => {
  return Math.floor(((parseInt(target, 10) / note) * 60 * 1000) / (8 * bpm))
}

// 将时间转换成像素的方法
export const timeToPx = (time, note, bpm) => {
  return Math.floor((parseInt(time, 10) * 8 * bpm * note) / (60 * 1000))
}
// 验证是不是包含中文字符
export const isChineseChar = str => {
  return (/^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/.test(str))
}