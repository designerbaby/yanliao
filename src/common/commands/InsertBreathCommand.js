import Command from './Command'
import { ModeState } from "@/common/utils/const"
class InsertBreathCommand extends Command {
  constructor(editor, pitch, breath) {
    super( editor )
    this.name = 'Insert Breath'
    this.pitch = pitch
    this.breath = breath
  }

  execute() {
    console.log('插入换气')
    const vm = this.editor.vm
    vm.$set(this.pitch, 'breath', this.breath)
  }

  undo() {
    console.log('撤销插入换气')
    this.pitch.breath = null
    this.editor.store.dispatch('const/changeState', { mode: ModeState.StatePitch })
  }
}


export default InsertBreathCommand
