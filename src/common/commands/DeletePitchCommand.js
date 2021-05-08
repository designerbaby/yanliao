import Command from './Command'
import { ModeState } from "@/common/utils/const"
class DeletePitchCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Delete Pitch'
    this.stateJson = '{}'
  }

  execute() {
    console.log(`删除音块`)
    const store = this.editor.store
    const stagePitches = store.state.change.stagePitches.filter(({ selected }) => !selected)
    const selectStagePitches = store.state.change.stagePitches.filter(({ selected }) => selected)
    if (selectStagePitches.length === 0) { return }
    this.stateJson = JSON.stringify(store.state.change)
    const changedLineMap = { ...store.state.change.changedLineMap }
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

    store.state.change.changedLineMap = {
      ...changedLineMap
    }
    store.dispatch('change/changeState', { stagePitches }, { root: true })
    store.dispatch('change/afterChangePitchAndHandle', null, { root: true })
  }

  undo() {
    const store = this.editor.store
    store.dispatch('change/changeState', JSON.parse(this.stateJson))
    this.editor.store.dispatch('const/changeState', { mode: ModeState.StatePitch })
  }
}


export default DeletePitchCommand
