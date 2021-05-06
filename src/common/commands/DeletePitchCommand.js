import Command from './Command'

class DeletePitchCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Delete Pitch'
  }

  execute() {
    console.log(`删除音块`)
  }

  undo() {
    console.log(`撤销删除音块`)
  }
}


export default DeletePitchCommand
