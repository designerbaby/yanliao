class Command {
  constructor( editor ) {
    this.editor = editor
    this.id = - 1
		this.name = ''
  }

  execute(){}
  undo(){}
}

export default Command
