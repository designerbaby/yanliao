import deepAssign from 'object-assign-deep'
import { pxToTime } from '@/common/utils/helper'
class Diff {

  beforeChangedLineMap = null
  constructor(editor) {
    this.editor = editor
  }

  diffChangeLineMap({ changedLineMap }) {
    // console.log('beforeChangedLineMap:', beforeChangedLineMap)
    // console.log('Object.keys(changedLineMap).length:', Object.keys(changedLineMap).length)
    const beforeChangedLineMap = this.beforeChangedLineMap
    const deleted = {}
    const added = {}
    const changed = {}
    if (!beforeChangedLineMap && Object.keys(changedLineMap).length === 0) {
      return []
    }
    if (!beforeChangedLineMap && Object.keys(changedLineMap).length > 0) {
      return this.formaAlteredTime(changedLineMap)
    }
    for (const [index, value] of Object.entries(beforeChangedLineMap)) {
      if (!changedLineMap[index]) {
        // 新的没有，说明是删除的，存下旧的
        deleted[index] = value
      } else if (changedLineMap[index] && changedLineMap[index] !== value) {
        // 新的有，并且改变了，存下改变的
        changed[index] = changedLineMap[index]
      }
    }
    for (const [index, value] of Object.entries(changedLineMap)) {
      if (!beforeChangedLineMap[index]) {
        // 新的有，旧的没有，是新增的
        added[index] = value
      }
    }
    const changeMap = Object.assign(deleted, added, changed)
    // console.log('changeMap:', changeMap)
    return this.formaAlteredTime(changeMap)
  }

  formaAlteredTime(changeMap) {
    const final = {}
    const { noteWidth, bpm } = this.editor.store.state.const
    for (const [x, value] of Object.entries(changeMap)) {
      const time = Math.round(pxToTime(x, noteWidth, bpm) / 10)
      final[time] = Math.round(value)
    }
    // console.log('final:', final)
    let values = []
    let lastIndex = -2
    for (const [index] of Object.entries(final)) {
      const item = {
        stb: parseInt(index, 10) * 10,
        et: parseInt(index, 10) * 10,
        st: -1
      }
      if (lastIndex + 1 === parseInt(index, 10)) {
        values[values.length - 1].et = parseInt(index, 10) * 10
      } else {
        values.push(item)
      }
      lastIndex = parseInt(index, 10)
    }
    console.log('values:', values)
    return values
  }

  setBefore({ changedLineMap }) {
    this.beforeChangedLineMap = deepAssign({}, changedLineMap)
  }

  clear() {
    this.beforeChangedLineMap = null
  }

}


export default Diff
