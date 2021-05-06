import Command from './Command'

class ChangePitchCommand extends Command {
  constructor(editor, movePitch) {
    super( editor )
    this.name = 'Change Pitch'
    this.movePitch = movePitch
  }

  findByUUID(uuid) {
    return this.editor.store.state.change.stagePitches.find(v => v.uuid === uuid)
  }

  execute() {
    console.log(`改变音块 movePitch:`, this.movePitch)
    const { after } = this.movePitch
    const stateBefore = this.findByUUID(this.movePitch.after.uuid)
    stateBefore.left = after.left
    stateBefore.top = after.top
    stateBefore.width = after.width
    if (after.breath) {
      stateBefore.breath.left = after.breath.left
    }
    this.editor.store.dispatch('change/afterChangePitchAndHandle', null, { root: true })
  }

  undo() {
    console.log(`撤销改变音块 movePitch:`, this.movePitch)
    const { before } = this.movePitch
    const stateBefore = this.findByUUID(this.movePitch.before.uuid)
    stateBefore.left = before.left
    stateBefore.top = before.top
    stateBefore.width = before.width
    if (before.breath) {
      stateBefore.breath.left = before.left - before.breath.width
    }
    this.editor.store.dispatch('change/afterChangePitchAndHandle', null, { root: true })
  }
}


export default ChangePitchCommand
