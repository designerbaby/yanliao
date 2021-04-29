
import hotkeys from 'hotkeys-js'
// 快捷键统一操作
class Shortcut{
  enable = true

  constructor(editor) {
    this.editor = editor

    this.init()
  }

  init() {
    hotkeys('ctrl+z,command+z', () => {
      this.editor.undo()
    })
    hotkeys('ctrl+shift+z,command+shift+z', () => {
      this.editor.redo()
    })
  }

  on() {
    this.enable = true
  }
  off() {
    this.enable = false
  }

}
export default Shortcut
