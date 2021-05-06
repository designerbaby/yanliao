
import hotkeys from 'hotkeys-js'
// shortcuts 快捷键统一操作
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
    hotkeys('ctrl+y,command+y', (event) => {
      this.editor.redo()
      event.preventDefault()
    })
    hotkeys('ctrl+c,command+c', () => {
      console.log('按下复制键')
      // TODO 迁移
    })
    hotkeys('ctrl+v,command+v', () => {
      console.log('按下粘贴键')
      // TODO 迁移
    })
    hotkeys('tab', () => {
      console.log('按下tab键')
      // TODO 迁移,tab键监听错误
    })
    hotkeys('delete', () => {
      console.log('按下delete键')
      // TODO 迁移,delete和return键监听错误
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
