import { Message } from 'element-ui'
import { amendTop, amendLeft, generateUUID } from '@/common/utils/helper'
import { turnChangeLineMap } from './utils'

const LOCAL = {
  max: 20,  // 最多存储用户近20次操作
  cur: 0,   // 用户操作栈当前指针
  stateJson: []  // 每次操作前 state json 格式存储
}

export default {
  // 用户操作对应入栈
  push({ state, commit, dispatch, rootState, rootGetters }, payload) {
    LOCAL.stateJson = [ ...LOCAL.stateJson.slice(0, LOCAL.cur), JSON.stringify(rootState)]
    LOCAL.stateJson = LOCAL.stateJson.slice(-LOCAL.max)
    LOCAL.cur = LOCAL.stateJson.length
  },
  // payload： -1 撤销操作; 1 恢复操作
  redo({ state, commit, dispatch, rootState, rootGetters }, payload) {
    console.log(LOCAL)
    const cur = LOCAL.cur + payload
    if (cur < 0 || cur >= LOCAL.stateJson.length) { return }
    dispatch('changeStoreState', JSON.parse(LOCAL.stateJson[cur]), { root: true })
    LOCAL.cur = cur
  },
  // 音块复制
  copyPitches({ state, commit, dispatch, rootState }) {
    Message.success('复制成功~')
    const copyStagePitches = rootState.stagePitches.filter(v => v.selected);
    dispatch('changeStoreState', { copyStagePitches, showMenuList: false }, { root: true })
  },
  // 音块粘贴
  pastePitches({ state, commit, dispatch, rootState, rootGetters }) {
    dispatch('push')
    dispatch('resetStagePitchesSelect', null, { root: true })
    const copyStagePitches = rootState.copyStagePitches
    if (copyStagePitches.length === 0) {
      Message.error('没有复制东西，快去复制把~')
      return
    }
    const pos = {
      x: state.mousePos.clientX - rootState.stage.rectLeft,
      y: state.mousePos.clientY - rootState.stage.rectTop
    }

    const firstItem = copyStagePitches[0]
    const offsetLeft = pos.x - firstItem.left
    const offsetTop = pos.y - firstItem.top
    const moveList = []
    for (let i = 0; i < copyStagePitches.length; i += 1) {
      const item = copyStagePitches[i]
      const newLeft = amendLeft(item.left + offsetLeft, rootState.noteWidth)
      const newTop = amendTop(item.top + offsetTop, rootState.noteHeight)

      const newItem = {
        left: newLeft,
        top: newTop,
        selected: true,
        uuid: generateUUID(),
        breath: item.breath ? {
          left: newLeft - item.breath.width,
          width: item.breath.width,
          pinyin: 'br'
        } : item.breath
      }

      const finalItem = Object.assign({}, item, newItem)
      moveList.push({
        before: item,
        after: finalItem
      })
      rootState.stagePitches.push(finalItem)
    }
    turnChangeLineMap(rootState, rootGetters, moveList)

    dispatch('changeStoreState', { showStageList: false }, { root: true })
    dispatch('afterChangePitchAndHandle', null, { root: true })
  },
  // 音块删除
  deletePitches({ dispatch, rootState }) {
    const stagePitches = rootState.stagePitches.filter(({ selected }) => !selected)
    const selectStagePitches = rootState.stagePitches.filter(({ selected }) => selected)
    if (selectStagePitches.length === 0) { return; }
    dispatch('push')
    const changedLineMap = { ...rootState.changedLineMap }
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
  
    rootState.changedLineMap = {
      ...changedLineMap
    }
    dispatch('changeStoreState', { stagePitches }, { root: true })
    dispatch('afterChangePitchAndHandle', null, { root: true })
  }
}
