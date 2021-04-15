import CosAuth from '@/common/utils/cosAuth'
import { pitchList } from '@/common/utils/const'

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

// 检测是否重叠了
export const isDuplicated = (pitches) => {
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

// 对更多字符编码的 url encode 格式
export const camSafeUrlEncode = (str) => {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

const getPitchLeftPosition = (pitch) => {
  return pitch.breath ? pitch.breath.left : pitch.left
}
const getPitchFullWidth = (pitch) => {
  return pitch.breath ? pitch.breath.width + pitch.width : pitch.width
}
// 检查音符块有没重叠
export const checkPitchDuplicated = (stagePitches) => {
  const pitches = stagePitches
  for(let i = 0; i < pitches.length; i++){
    const pitch1 = pitches[i]
    pitch1.red = false
    for(let j = 0; j < pitches.length; j++){
      const pitch2 = pitches[j]
      if (i !== j) {
        let leftPitch = null
        let rightPitch = null
        const p1Left = getPitchLeftPosition(pitch1)
        const p2Left = getPitchLeftPosition(pitch2)
        if (p1Left < p2Left) {
          leftPitch = pitch1
          rightPitch = pitch2
        } else {
          leftPitch = pitch2
          rightPitch = pitch1
        }

        const isRed = getPitchLeftPosition(leftPitch) + getPitchFullWidth(leftPitch) > getPitchLeftPosition(rightPitch)
        if (isRed) {
          pitch1.red = isRed
        }
        // console.log(`检查外层第${i}个格子left:${pitch1.left},width:${pitch1.width}，内层第${j}个格子left:${pitch2.left},width:${pitch2.width} ,red:${isRed}`)
      }
    }
  }
  return pitches
}

export const findLastIndex = (array, cb) => {
  for (let i = array.length-1; i >=0; i--) {
    const element = array[i];
    if (cb.call(null, element, i, array)) {
      return i
    }
  }
  return -1
}


export const generateUUID = () => {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
// 每隔n个分隔下数组
export const divideArray = (n, arr) => {
  const result = []
  for (let i = 0; i < arr.length;) {
    result.push(arr.slice(i, i += n))
  }
  return result
}

// 计算签名
export const getAuthorization = (method, key, data) => {
  return {
    XCosSecurityToken: data.credentials.session_token,
    Authorization: CosAuth({
      SecretId: data.credentials.tmp_secret_id,
      SecretKey: data.credentials.tmp_secret_key,
      Method: method,
      Pathname: `/${key}`
    })
  }
}
const UA = typeof window !== 'undefined' && window.navigator.userAgent.toLowerCase()
const isEdge = UA && UA.indexOf('edge/') > 0;
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge

// pitchList 转换成 stagePitches
export const pitchList2StagePitches = (pitchList, type, vm) => {
  // type: grid 代表格子数，其他代表时间
  let stagePitches = []
  const noteWidth = vm.$store.state.noteWidth
  const noteHeight = vm.$store.state.noteHeight
  pitchList.forEach(item => {
    let breath = {}
    if (!item.breath) {
      breath = null
    } else if (item.breath && item.breath.pinyin === '') {
      breath = null
    } else {
      breath = {
        left: timeToPx(item.breath.startTime, noteWidth, pitchList[0].bpm),
        width: timeToPx(item.breath.duration, noteWidth, pitchList[0].bpm),
        pinyin: 'br'
      }
    }
    stagePitches.push({
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      red: false,
      height: noteHeight,
      width: type === 'grid' ? item.duration * noteWidth : timeToPx(item.duration, noteWidth, pitchList[0].bpm),
      left: type === 'grid' ? item.startTime * noteWidth : timeToPx(item.startTime, noteWidth, pitchList[0].bpm),
      top: noteHeight * (vm.$store.getters.firstPitch - item.pitch),
      pinyinList: item.pinyinList,
      select: item.select,
      preTime: item.preTime,
      fu: item.fu,
      yuan: item.yuan,
      breath: breath,
      selected: false, // 表示是否选中了音块
      uuid: generateUUID()
    })
  })
  console.log('pitchList2StagePitches:', stagePitches)
  return stagePitches
}

export const turnChangeLineMap = (vm, moveList, reset) => {
  const changedLineMap = { ...vm.$store.state.changedLineMap }
  const deleteLinePoints = new Set()
  const newLinePointsMap = {}
  const pitchPerPx = 100 / vm.$store.state.noteHeight // 100是因为后台加了乘以100了

  const before = moveList[0].before
  const after = moveList[0].after
  const distanceY = before.top - after.top
  const distanceX = after.left - before.left


  let fromX0 = before.left
  let fromX1 = before.left + before.width
  let minFromX0 = fromX0
  let MaxFromX1 = fromX1

  for (const { before } of moveList) {
    minFromX0 = Math.min(minFromX0, before.left)
    MaxFromX1 = Math.max(MaxFromX1, before.left + before.width)
  }

  Object.keys(changedLineMap)
    .map(Number)
    .filter(x => x >= minFromX0 && x <= MaxFromX1)
    .forEach(x => {
      const pitch = changedLineMap[x]
      const newX = x + distanceX
      let newPitch = pitch + (pitchPerPx * distanceY)
      const highestPitch = vm.$store.getters.firstPitch
      if (newPitch > highestPitch * 100) { // 大于最大的pitch取最大的
        newPitch = highestPitch * 100
      }
      const lowestPitch = pitchList[pitchList.length - 1].pitch
      if (newPitch < lowestPitch * 100) { // 小于最小的pitch取最小的
        newPitch = lowestPitch * 100
      }
      deleteLinePoints.add(x)
      newLinePointsMap[newX] = newPitch
    })
  if (reset) {
    deleteLinePoints.forEach(v => {
      delete changedLineMap[v]
    })
  }

  vm.$store.state.changedLineMap = {
    ...changedLineMap,
    ...newLinePointsMap
  }
}
