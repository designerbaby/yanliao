import Command from './Command'

class ChangePitchElementCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change PitchElement'
  }

  execute() {
    console.log(`改变音素`)
  }

  undo() {
    console.log(`撤销改变音素`)
  }
}


export default ChangePitchElementCommand
