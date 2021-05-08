
import hotkeys from 'hotkeys-js'
import CopyPitchCommand from '@/common/commands/CopyPitchCommand'
import PastePitchCommand from '@/common/commands/PastePitchCommand'
import DeletePitchCommand from '@/common/commands/DeletePitchCommand'
// shortcuts 快捷键统一操作
class Shortcut{
  enable = true

  constructor(editor) {
    this.editor = editor

    this.init()
  }

  init() {
    hotkeys('ctrl+z,command+z', (event) => {
      this.editor.undo()
      event.preventDefault()
    })
    hotkeys('ctrl+shift+z,command+shift+z', (event) => {
      this.editor.redo()
      event.preventDefault()
    })
    hotkeys('ctrl+y,command+y', (event) => {
      this.editor.redo()
      event.preventDefault()
    })
    hotkeys('ctrl+c,command+c', (event) => {
      this.editor.execute(new CopyPitchCommand(this.editor))
      event.preventDefault()
    })
    hotkeys('ctrl+v,command+v', (event) => {
      this.editor.execute(new PastePitchCommand(this.editor, null))
      event.preventDefault()
    })
    hotkeys('space', (event) => {
      this.editor.vm.$emit('clickSpace')
      event.preventDefault()
    })

    hotkeys("*", () => {
      // if (hotkeys.isPressed(8) || hotkeys.isPressed(46)) {
      //   console.log('按下delete键', hotkeys.getPressedKeyCodes())
      //   return false
      // }

      const key = hotkeys.getPressedKeyCodes()[0]
      switch (key) {
        case 46:
        case 8:
          console.log('按下delete键或者fn+delete', hotkeys.getPressedKeyCodes())
          this.editor.execute(new DeletePitchCommand(this.editor))
          return false
        default:;
      }
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
