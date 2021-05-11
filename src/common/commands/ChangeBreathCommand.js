import Command from './Command'
import { ModeState } from "@/common/utils/const"

class ChangeBreathCommand extends Command {
  constructor(editor, pitch, left, width) {
    super( editor )
    this.name = 'Change Breath'
    this.pitch = pitch
    this.left = left
    this.width = width
  }


  execute() {
    console.log('修改换气')
    this.oldPitchBreathLeft = this.pitch.breath.left
    this.oldPitchBreathWidth = this.pitch.breath.width
    this.pitch.breath.left = this.left
    this.pitch.breath.width = this.width
  }

  undo() {
    console.log('撤销修改换气')
    this.pitch.breath.left = this.oldPitchBreathLeft
    this.pitch.breath.width = this.oldPitchBreathWidth
    this.editor.store.dispatch('const/changeState', { mode: ModeState.StatePitch })
  }
}


export default ChangeBreathCommand
