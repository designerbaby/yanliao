import Command from './Command'

class InsertBreathCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Insert Breath'
  }

  execute() {
    console.log('插入换气')
  }

  undo() {
    console.log(`撤销插入换气`)
  }
}


export default InsertBreathCommand
