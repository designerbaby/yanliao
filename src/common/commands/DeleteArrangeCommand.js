import Command from './Command'

class DeleteArrangeCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Delete Arrange'
  }

  execute() {
    console.log('删除伴奏')
  }

  undo() {
    console.log(`撤销删除伴奏`)
  }
}


export default DeleteArrangeCommand
