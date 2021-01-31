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

// 安全Parse JSON数据
export const safeParse = (str, def) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return def
  } 
}

// 将像素转成相应时间的方法
export const pxToTime = (target, note, bpm) => {
  return Math.floor(((parseInt(target, 10) / note) * 60 * 1000) / (8 * bpm))
}

// 将时间转换成像素的方法
export const timeToPx = (time, note, bpm) => {
  // console.log(`timeToPx: time:${time}, note: ${note}, bpm: ${bpm}: result: ${Math.ceil((parseInt(time, 10) * 8 * bpm * note) / (60 * 1000))}`)
  return Math.ceil((parseInt(time, 10) * 8 * bpm * note) / (60 * 1000))
}
// 验证是不是包含中文字符
export const isChineseChar = str => {
  return (/^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/.test(str))
}

export const isDuplicated = (pitches) => { // 检测是否重叠了
  for (let i = 0; i < pitches.length; i += 1) {
    if (pitches[i].red) {
      return true
    }
  }
  return false
}

// 修正top值
export const amendTop = (top, noteHeight) => {
  const mod = top % noteHeight
  if (mod < noteHeight / 2) {
    return top - mod
  } else {
    return top - mod + noteHeight
  }
}

// 修正left值
export const amendLeft = (left, noteWidth) => {
  const mod = left % noteWidth
  if (mod < noteWidth / 2) {
    return left - mod
  } else {
    return left - mod + noteWidth
  }
}