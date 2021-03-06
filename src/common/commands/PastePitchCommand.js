import Command from './Command'
import { Message } from 'element-ui'
import { amendTop, amendLeft, generateUUID } from '@/common/utils/helper'
import { turnChangeLineMap } from '@/common/utils/common'
import { ModeState } from "@/common/utils/const"
class PastePitchCommand extends Command {
  constructor(editor, position) {
    super( editor )
    this.name = 'Paste Pitch'
    this.stateJson = '{}'
    this.position = position
  }

  execute() {
    console.log('粘贴音块')
    const store = this.editor.store
    store.dispatch('change/resetStagePitchesSelect', null, { root: true })
    let copyStagePitches = store.state.const.copyStagePitches
    if (copyStagePitches.length === 0) {
      // 拿不到就拿浏览器中存着的，再拿不到，那也没办法了！
      copyStagePitches = JSON.parse(localStorage.getItem('copyStagePitches'))
      const changedLineMap = JSON.parse(localStorage.getItem('changedLineMap'))
      store.state.changedLineMap = {
        ...changedLineMap
      }
      if (copyStagePitches.length === 0) {
        Message.error('没有复制东西，快去复制把~')
        return
      }
    }
    this.stateJson = JSON.stringify(store.state.change)
    let pos = this.position || {
      x: store.state.const.mousePos.clientX - store.state.const.stage.rectLeft,
      y: store.state.const.mousePos.clientY - store.state.const.stage.rectTop
    }

    const firstItem = copyStagePitches[0]
    const offsetLeft = pos.x - firstItem.left
    const offsetTop = pos.y - firstItem.top
    const moveList = []
    for (let i = 0; i < copyStagePitches.length; i += 1) {
      const item = copyStagePitches[i]
      const newLeft = amendLeft(item.left + offsetLeft, store.state.const.noteWidth)
      const newTop = amendTop(item.top + offsetTop, store.state.const.noteHeight)

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
      store.state.change.stagePitches.push(finalItem)
    }
    turnChangeLineMap(store, moveList)

    store.dispatch('const/changeState', { showStageList: false }, { root: true })
    store.dispatch('change/afterChangePitchAndHandle', null, { root: true })
  }

  undo() {
    console.log(`撤销粘贴音块`)
    const store = this.editor.store
    store.dispatch('change/changeState', JSON.parse(this.stateJson))
    this.editor.store.dispatch('const/changeState', { mode: ModeState.StatePitch })
  }
}


export default PastePitchCommand
