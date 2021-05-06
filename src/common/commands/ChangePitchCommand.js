import Command from './Command'

class ChangePitchCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change Pitch'
  }

  execute() {
    console.log(`改变音块`)
  }

  undo() {
    console.log(`撤销改变音块`)
  }
}


export default ChangePitchCommand
