import Command from './Command'

class AddArrangeCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Add Arrange'
  }

  execute() {
    console.log('增加伴奏')
  }

  undo() {
    console.log(`撤销增加伴奏`)
  }
}


export default AddArrangeCommand
