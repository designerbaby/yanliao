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

// 获取cookie里面的信息
export const getCookie = name => {
  const RE = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
  const arr = document.cookie.match(RE)
  if (arr) {
    return unescape(arr[2])
  }
  return ''
}
