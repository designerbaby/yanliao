import { pitchList } from '@/common/utils/const'
import { timeToPx, generateUUID } from '@/common/utils/helper'

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
  let maxFromX1 = fromX1

  for (const { before } of moveList) {
    minFromX0 = Math.min(minFromX0, before.left)
    maxFromX1 = Math.max(maxFromX1, before.left + before.width)
  }

  Object.keys(changedLineMap)
    .map(Number)
    .filter(x => x >= minFromX0 && x <= maxFromX1)
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

export const deleteStagePitches = (vm) => {
  const stagePitches = vm.$store.state.stagePitches.filter(({ selected }) => !selected)
  const selectStagePitches = vm.$store.state.stagePitches.filter(({ selected }) => selected)
  const changedLineMap = { ...vm.$store.state.changedLineMap }
  let minLeft = selectStagePitches[0].left
  let maxRight = selectStagePitches[0].left + selectStagePitches[0].width
  selectStagePitches.forEach(item => {
    minLeft = Math.min(minLeft, item.left)
    maxRight = Math.max(maxRight, item.left + item.width)
  })
  Object.keys(changedLineMap)
    .map(Number)
    .filter(x => x >= minLeft && x <= maxRight)
    .forEach(x => {
      delete changedLineMap[x]
    })

  vm.$store.state.changedLineMap = {
    ...changedLineMap
  }
  vm.$store.dispatch('changeStoreState', { stagePitches })
  vm.$store.dispatch('afterChangePitchAndHandle')
}
