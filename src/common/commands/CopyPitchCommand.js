import Command from './Command'

class CopyPitchCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Copy Pitch'
  }

  execute() {
    console.log('复制音块')

  }

  undo() {
    console.log(`撤销复制音块`)
  }
}


export default CopyPitchCommand
