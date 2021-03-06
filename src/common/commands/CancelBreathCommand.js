import Command from './Command'
import { ModeState } from "@/common/utils/const"
class CancelBreathCommand extends Command {
  constructor(editor, pitch) {
    super( editor )
    this.name = 'Cancel Breath'
    this.pitch = pitch
  }

  execute() {
    console.log('取消换气')
    this.oldBreath = {...this.pitch.breath}
    this.pitch.breath = null
  }

  undo() {
    console.log(`撤销取消换气`)
    this.pitch.breath = this.oldBreath
    this.editor.store.dispatch('const/changeState', { mode: ModeState.StatePitch })
  }
}


export default CancelBreathCommand
