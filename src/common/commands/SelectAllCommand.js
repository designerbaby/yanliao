import Command from './Command'
import { ModeState } from "@/common/utils/const"

class SelectAllCommand extends Command {
  constructor(editor) {
    super( editor )
  }

  execute() {
    const store = this.editor.store
    if (store.state.const.mode === ModeState.StatePitch) {
      store.state.change.stagePitches.forEach((v, i) => {
        v.selected = true
      })
    }
  }

  undo() {
   
  }
}


export default SelectAllCommand
