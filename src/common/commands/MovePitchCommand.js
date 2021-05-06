import Command from './Command'
import deepAssign from 'object-assign-deep'

class MovePitchCommand extends Command {
  constructor( editor, moveList ) {
		super( editor )
    this.name = 'Move Pitch'

    this.moveList = deepAssign([], moveList)
  }

  findByUUID(uuid) {
    return this.editor.store.state.change.stagePitches.find(v => v.uuid === uuid)
  }

  execute() {
    console.log(`移动音块：`, { ...this.moveList})
    this.moveList.forEach((it, idx) => {
      const { after } = it
      const stateBefore = this.findByUUID(it.after.uuid)
      stateBefore.left = after.left
      stateBefore.top = after.top

      if (after.breath) {
        stateBefore.breath.left = after.breath.left
      }
    })
  }
  undo() {
    console.log(`撤销移动音块：`, { ...this.moveList})

    this.moveList.forEach((it, idx) => {
      const { before } = it
      // const stateBefore = this.findByUUID(it.before.uuid)
      const stateBefore = this.editor.store.state.change.stagePitches.find(v => v.uuid === it.before.uuid)
      stateBefore.left = before.left
      stateBefore.top = before.top
      if (before.breath) {
        stateBefore.breath.left = before.breath.left
      }
    })
  }
}

export default MovePitchCommand
