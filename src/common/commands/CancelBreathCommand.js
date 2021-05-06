import Command from './Command'

class CancelBreathCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Cancel Breath'
  }

  execute() {
    console.log('取消换气')
  }

  undo() {
    console.log(`撤销取消换气`)
  }
}


export default CancelBreathCommand
