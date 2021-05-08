import Command from './Command'

class ChangeArrangeCommand extends Command {
  constructor(editor, left) {
    super( editor )
    this.name = 'Change Arrange'
    this.left = left
  }

  execute() {
    console.log('修改伴奏')
    const store = this.editor.store
    this.oldOffset = store.state.change.trackList[1].offset
    store.state.change.trackList[1].offset = this.left
    store.dispatch('const/changeState', { isObbligatoChanged: true })
  }

  undo() {
    console.log(`撤销修改伴奏`, this.oldOffset)
    const store = this.editor.store
    store.state.change.trackList[1].offset = this.oldOffset
    store.dispatch('const/changeState', { isObbligatoChanged: true })
  }
}


export default ChangeArrangeCommand
