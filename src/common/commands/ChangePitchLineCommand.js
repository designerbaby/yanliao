import Command from './Command'

class ChangePitchLineCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change PitchLine'
  }

  execute() {
    console.log(`改变音高线`)
  }

  undo() {
    console.log(`撤销改变音高线`)
  }
}


export default ChangePitchLineCommand
