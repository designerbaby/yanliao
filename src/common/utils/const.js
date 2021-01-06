export const pitchListBefore = [
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