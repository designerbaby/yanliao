import { PitchList } from '@/common/utils/const'

export const turnChangeLineMap = (state, getters, moveList, reset) => {
  const changedLineMap = { ...state.changedLineMap }
  const deleteLinePoints = new Set()
  const newLinePointsMap = {}
  const pitchPerPx = 100 / state.noteHeight // 100是因为后台加了乘以100了

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
      const highestPitch = getters.firstPitch
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
    deleteLinePoints.forEach(v => {
      delete changedLineMap[v]
    })
  }

  state.changedLineMap = {
    ...changedLineMap,
    ...newLinePointsMap
  }
}


export const deleteStagePitches = (state) => {
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
