import Command from './Command'

class ChangeArrangeCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change Arrange'
  }

  execute() {
    console.log('修改伴奏')
  }

  undo() {
    console.log(`撤销修改伴奏`)
  }
}


export default ChangeArrangeCommand
