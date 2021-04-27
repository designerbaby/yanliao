export const pitchListBefore = [
  // 1 代表黑键，0 代表白键
  {
    pitch: 40,
    str: 'E2',
    type: 0,
    show: 1
  },
  {
    pitch: 41,
    str: 'F2',
    type: 0,
    show: 1
  },
  {
    pitch: 42,
    str: 'F2#',
    type: 1,
    show: 0
  },
  {
    pitch: 43,
    str: 'G2',
    type: 0,
    show: 1
  },
  {
    pitch: 44,
    str: 'G2#',
    type: 1,
    show: 0
  },
  {
    pitch: 45,
    str: 'A2',
    type: 0,
    show: 0
  },
  {
    pitch: 46,
    str: 'A2#',
    type: 1,
    show: 0
  },
  {
    pitch: 47,
    str: 'B2',
    type: 0,
    show: 0
  },
  {
    pitch: 48,
    str: 'C3',
    type: 0,
    show: 1
  },
  {
    pitch: 49,
    str: 'C3#',
    type: 1,
    show: 0
  },
  {
    pitch: 50,
    str: 'D3',
    type: 0,
    show: 0
  },
  {
    pitch: 51,
    str: 'D3#',
    type: 1,
    show: 0
  },
  {
    pitch: 52,
    str: 'E3',
    type: 0,
    show: 0
  },
  {
    pitch: 53,
    str: 'F3',
    type: 0,
    show: 0
  },
  {
    pitch: 54,
    str: 'F3#',
    type: 1,
    show: 0
  },
  {
    pitch: 55,
    str: 'G3',
    type: 0,
    show: 0
  },
  {
    pitch: 56,
    str: 'G3#',
    type: 1,
    show: 0
  },
  {
    pitch: 57,
    str: 'A3',
    type: 0,
    show: 0
  },
  {
    pitch: 58,
    str: 'A3#',
    type: 1,
    show: 0
  },
  {
    pitch: 59,
    str: 'B3',
    type: 0,
    show: 0
  },
  {
    pitch: 60,
    str: 'C4',
    type: 0,
    show: 1
  },
  {
    pitch: 61,
    str: 'C4#',
    type: 1,
    show: 0
  },
  {
    pitch: 62,
    str: 'D4',
    type: 0,
    show: 0
  },
  {
    pitch: 63,
    str: 'D4#',
    type: 1,
    show: 0
  },
  {
    pitch: 64,
    str: 'E4',
    type: 0,
    show: 0
  },
  {
    pitch: 65,
    str: 'F4',
    type: 0,
    show: 0
  },
  {
    pitch: 66,
    str: 'F4#',
    type: 1,
    show: 0
  },
  {
    pitch: 67,
    str: 'G4',
    type: 0,
    show: 0
  },
  {
    pitch: 68,
    str: 'G4#',
    type: 1,
    show: 0
  },
  {
    pitch: 69,
    str: 'A4',
    type: 0,
    show: 0
  },
  {
    pitch: 70,
    str: 'A4#',
    type: 1,
    show: 0
  },
  {
    pitch: 71,
    str: 'B4',
    type: 0,
    show: 0
  },
  {
    pitch: 72,
    str: 'C5',
    type: 0,
    show: 1
  },
  {
    pitch: 73,
    str: 'C5#',
    type: 1,
    show: 0
  },
  {
    pitch: 74,
    str: 'D5',
    type: 0,
    show: 0
  },
  {
    pitch: 75,
    str: 'D5#',
    type: 1,
    show: 0
  },
  {
    pitch: 76,
    str: 'E5',
    type: 0,
    show: 0
  },
  {
    pitch: 77,
    str: 'F5',
    type: 0,
    show: 0
  },
  {
    pitch: 78,
    str: 'F5#',
    type: 1,
    show: 0
  },
  {
    pitch: 79,
    str: 'G5',
    type: 0,
    show: 0
  },
  {
    pitch: 80,
    str: 'G5#',
    type: 1,
    show: 0
  },
  {
    pitch: 81,
    str: 'A5',
    type: 0,
    show: 0
  },
  {
    pitch: 82,
    str: 'A5#',
    type: 1,
    show: 0
  },
  {
    pitch: 83,
    str: 'B5',
    type: 0,
    show: 0
  },
  {
    pitch: 84,
    str: 'C6',
    type: 0,
    show: 0
  }
]

export const pitchList = pitchListBefore.reverse()

export const processStatus = { // 进度从0到4对应的百分比
  0: 0,
  1: 15,
  2: 30,
  3: 80,
  4: 100
}

export const statusMap = {
  0: '待跑状态',
  1: '进行中',
  2: '已成功',
  3: '失效',
  4: '失败'
}
// 音频状态映射
export const playState = {
  StateNone: 0, // 初始状态
  StatePlaying: 1, // 播放中
  StatePaused: 2, // 暂停
  StateEnded: 3 // 播放完成
}

export const TrackMode = {
  TrackModeNone: 0, // 都静音
  TrackModeBan: 1, // 只播放伴奏
  TrackModeGan: 2, // 只播放干声
  TrackModeAll: 3  // 都播放
}

export const modeState = {
  StatePitch: 0, // 音符模式
  StateLine: 1,  // 音高线模式
  StateElement: 2 // 音素模式
}

export const TypeModeState = {
  StateNone: -1, // 初识状态
  StateVolume: 0, // 响度模式
  StateTension: 1 // 张力模式
}

// 我的音源的音源状态
export const audioStatusMap = {
  1: '审核中',
  2: '审核不通过',
  3: '审核通过',
  4: '音源合成失败',
  5: '已上线',
  6: '已下线'
}

// 错误码对应信息
export const errorMsg = {
  100000: 'token无效，用户未登录',
  100011: '参数错误',
  100012: '登录后台服务错误',
  100013: '业务后台错误',
  100014: '路由不存在',
  100015: '请求参数为空',
  100016: '设置header错误'
}
