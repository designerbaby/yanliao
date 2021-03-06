import { PitchList } from '@/common/utils/const'
import { timeToPx, generateUUID } from '@/common/utils/helper'

// 修改用户画过的音高线数据
export const turnChangeLineMap = (store, moveList, reset) => {
  const rootState = store.state
  const rootGetters = store.getters
  const changedLineMap = { ...rootState.change.changedLineMap }
  const deleteLinePoints = new Set()
  const newLinePointsMap = {}
  const pitchPerPx = 100 / rootState.const.noteHeight // 100是因为后台加了乘以100了
  const scale = rootGetters['const/scale']

  const before = moveList[0].before
  const after = moveList[0].after
  const distanceY = before.top - after.top
  const distanceX = after.left - before.left

  let fromX0 = before.left
  let fromX1 = before.left + before.width
  let minFromX0 = fromX0 / scale // 最左边除以比例
  let maxFromX1 = fromX1 / scale // 最右边除以比例

  for (const { before } of moveList) {
    minFromX0 = Math.min(minFromX0, before.left / scale)
    maxFromX1 = Math.max(maxFromX1, (before.left + before.width) / scale)
  }
  // console.log(`minFromX0: ${minFromX0}, maxFromX1: ${maxFromX1}`)
  Object.keys(changedLineMap)
    .map(Number)
    .filter(x => x >= minFromX0 && x <= maxFromX1)
    .forEach(x => {
      const pitch = changedLineMap[x]
      const newX = x + distanceX / scale
      // console.log(`scale: ${scale}, minFromX0: ${minFromX0}, maxFromX1: ${maxFromX1}, x: ${x}, newX: ${newX}, distanceX: ${distanceX}`)
      let newPitch = pitch + (pitchPerPx * distanceY)
      const highestPitch = PitchList[0].pitch
      if (newPitch > highestPitch * 100) { // 大于最大的pitch取最大的
        newPitch = highestPitch * 100
      }
      const lowestPitch = PitchList[PitchList.length - 1].pitch
      if (newPitch < lowestPitch * 100) { // 小于最小的pitch取最小的
        newPitch = lowestPitch * 100
      }
      deleteLinePoints.add(x)
      newLinePointsMap[newX] = newPitch
    })
  if (reset) {
    // 是否要把原来的音高线对应的音高删了
    deleteLinePoints.forEach(v => {
      delete changedLineMap[v]
    })
  }

  rootState.change.changedLineMap = {
    ...changedLineMap,
    ...newLinePointsMap
  }
}


// pitchList 转换成 stagePitches
export const pitchList2StagePitches = (pitchList, type, vm) => {
  // type: grid 代表格子数，其他代表时间
  let stagePitches = []
  const noteWidth = vm.$store.state.const.noteWidth
  const noteHeight = vm.$store.state.const.noteHeight
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
      top: noteHeight * (PitchList[0].pitch - item.pitch),
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

