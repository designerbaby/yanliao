import Command from './Command'

class PastePitchCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Paste Pitch'
  }

  execute() {
    console.log('粘贴音块')
  }

  undo() {
    console.log(`撤销粘贴音块`)
  }
}


export default PastePitchCommand
