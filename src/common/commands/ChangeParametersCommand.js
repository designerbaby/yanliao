import Command from './Command'

class ChangeParametersCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change Parameters'
  }

  execute() {
    console.log(`改变张力/响度`)
  }

  undo() {
    console.log(`撤销改变张力/响度`)
  }
}


export default ChangeParametersCommand
