import { Message } from 'element-ui'
import { amendTop, amendLeft, generateUUID } from '@/common/utils/helper'
import { turnChangeLineMap } from '@/common/utils/common'

const LOCAL = {
  max: 10,  // 最多存储用户近10次操作
  cur: 0,   // 用户操作栈当前指针
  stateJson: [],  // 每次操作前 state json 格式存储
  newMutation: true
}

export default {
  // 用户操作对应入栈
  push({ state, commit, dispatch, rootState, rootGetters }, payload) {
    LOCAL.stateJson = [ ...LOCAL.stateJson.slice(0, LOCAL.cur), JSON.stringify({ ...rootState, showMenuList: false, showStageList: false })]
    LOCAL.stateJson = LOCAL.stateJson.slice(-LOCAL.max)
    LOCAL.cur = LOCAL.stateJson.length
    LOCAL.newMutation = true
    console.log('push', LOCAL)
  },
  // payload： -1 撤销操作; 1 恢复操作
  redo({ state, commit, dispatch, rootState, rootGetters }, payload) {
    console.log('redo', LOCAL)
    // 首次撤销需保存当前state
    if (LOCAL.newMutation === true) {
      dispatch('push')
      LOCAL.newMutation = false
      LOCAL.cur -= 1
    }
    const cur = LOCAL.cur + payload
    if (cur < 0 || cur >= LOCAL.stateJson.length) { return }
    dispatch('changeStoreState', JSON.parse(LOCAL.stateJson[cur]), { root: true })
    LOCAL.cur = cur
  },
  // 音块复制
  copyPitches({ state, commit, dispatch, rootState }) {
    Message.success('复制成功~')
    const copyStagePitches = rootState.change.stagePitches.filter(v => v.selected);
    dispatch('const/changeState', { copyStagePitches, showMenuList: false }, { root: true })
    // 存一份在浏览器中
    localStorage.setItem('copyStagePitches', JSON.stringify(copyStagePitches))
    localStorage.setItem('changedLineMap', JSON.stringify(rootState.changedLineMap))
  },
  // 音块粘贴
  pastePitches({ state, commit, dispatch, rootState, rootGetters }, { position }) {
    dispatch('push')
    dispatch('change/resetStagePitchesSelect', null, { root: true })
    let copyStagePitches = rootState.const.copyStagePitches
    if (copyStagePitches.length === 0) {
      // 拿不到就拿浏览器中存着的，再拿不到，那也没办法了！
      copyStagePitches = JSON.parse(localStorage.getItem('copyStagePitches'))
      const changedLineMap = JSON.parse(localStorage.getItem('changedLineMap'))
      rootState.changedLineMap = {
        ...changedLineMap
      }
      if (copyStagePitches.length === 0) {
        Message.error('没有复制东西，快去复制把~')
        return
      }
    }

    let pos = {
      x: state.mousePos.clientX - rootState.const.stage.rectLeft,
      y: state.mousePos.clientY - rootState.const.stage.rectTop
    }
    if (position) {
      pos = position
    }

    const firstItem = copyStagePitches[0]
    const offsetLeft = pos.x - firstItem.left
    const offsetTop = pos.y - firstItem.top
    const moveList = []
    for (let i = 0; i < copyStagePitches.length; i += 1) {
      const item = copyStagePitches[i]
      const newLeft = amendLeft(item.left + offsetLeft, rootState.const.noteWidth)
      const newTop = amendTop(item.top + offsetTop, rootState.const.noteHeight)

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
      rootState.change.stagePitches.push(finalItem)
    }
    turnChangeLineMap(rootState, moveList)

    dispatch('const/changeState', { showStageList: false }, { root: true })
    dispatch('change/afterChangePitchAndHandle', null, { root: true })
  },
  // 音块删除
  deletePitches({ dispatch, rootState }) {
    const stagePitches = rootState.change.stagePitches.filter(({ selected }) => !selected)
    const selectStagePitches = rootState.change.stagePitches.filter(({ selected }) => selected)
    if (selectStagePitches.length === 0) { return; }
    dispatch('push')
    const changedLineMap = { ...rootState.change.changedLineMap }
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

    rootState.change.changedLineMap = {
      ...changedLineMap
    }
    dispatch('change/changeState', { stagePitches }, { root: true })
    dispatch('change/afterChangePitchAndHandle', null, { root: true })
  }
}
