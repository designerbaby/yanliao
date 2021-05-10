import Command from './Command'

class ChangeArrangeCommand extends Command {
  constructor(editor, oldOffset, newOffset) {
    super( editor )
    this.name = 'Change Arrange'
    this.oldOffset = oldOffset
    this.newOffset = newOffset
  }

  execute() {
    console.log('修改伴奏')
    this.changeOffset(this.newOffset)
  }

  undo() {
    console.log(`撤销修改伴奏`)
    this.changeOffset(this.oldOffset)
  }

  changeOffset(offset) {
    const store = this.editor.store
    store.state.change.trackList[1].offset = offset
    store.dispatch('const/changeState', { isObbligatoChanged: true, showArrange: true })
  }
}


export default ChangeArrangeCommand
