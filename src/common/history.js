class History {
  constructor(editor) {
    this.editor = editor
    this.undos = []
    this.redos = []

    this.id = 0
  }

  execute (cmd) {
    this.undos.push( cmd )
    cmd.id = ++ this.id
    cmd.execute()

    this.redos = []
  }
  undo() {
    if (this.undos.length > 0) {
      const cmd = this.undos.pop()
      cmd.undo()
      this.redos.push( cmd )
    } else {
      console.info(`没有可以undo的命令`)
    }
  }
  redo() {
    if ( this.redos.length > 0 ) {
      const cmd = this.redos.pop()
      cmd.execute()
			this.undos.push( cmd )
		} else {
      console.info(`没有可以redo的命令`)
    }
  }
  clear() {
    this.undos = []
		this.redos = []
		this.id = 0
  }
}

export default History
