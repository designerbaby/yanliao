import Command from './Command'

class ChangeArrangeCommand extends Command {
  constructor(editor, left) {
    super( editor )
    this.name = 'Change Arrange'
    this.left = left
  }

  execute() {
    console.log('修改伴奏')
    this.oldOffset = this.editor.store.state.change.trackList[1].offset
    this.editor.store.state.change.trackList[1].offset = this.left
  }

  undo() {
    console.log(`撤销修改伴奏`)
    this.editor.store.state.change.trackList[1].offset = this.oldOffset
  }
}


export default ChangeArrangeCommand
