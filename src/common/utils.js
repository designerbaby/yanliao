export const reportEvent = (eventName, eventId, params='') => { // 数据上报事件
  console.log('reportEvent:', eventName, eventId, params)
  BeaconAction.onEvent(eventId || eventName, eventName, params)
}

export const isProdEnv = 'yan.qq.com' === location.hostname
export const isTestEnv = !isProdEnv
// export const isTestEnv = (/dev|test|localhost/i).test(location.hostname)

export const getUrlParameters = _ => { // 获取url上各别信息
  const match = window.location.search.match(/([^?=&]+)(=([^&]*))/g)
  if (match) {
    return match.reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = process.browser && decodeURIComponent(v.slice(v.indexOf('=') + 1)), a), {}) // eslint-disable-line
  }
  return {}
}

export const getParams = (query = window.location.search) => {
  const match = query.match(/([^?=&]+)(=([^&]*))/g)
  if (match) {
    return match.reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = decodeURIComponent(v.slice(v.indexOf('=') + 1)), a), {}) // eslint-disable-line
  }
  return {}
}