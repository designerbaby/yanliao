import Command from './Command'

class ChangeBreathCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change Breath'
  }

  execute() {
    console.log('修改换气')
  }

  undo() {
    console.log(`撤销修改换气`)
  }
}


export default ChangeBreathCommand
