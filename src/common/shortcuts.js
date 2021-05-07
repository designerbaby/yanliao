
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
      this.editor.store.dispatch('done/copyPitches')
    })
    hotkeys('ctrl+v,command+v', () => {
      console.log('按下粘贴键')
      this.editor.store.dispatch('done/pastePitches', { position: null })
    })
    hotkeys('space', (event) => {
      console.log('按下space键')
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
          this.editor.store.dispatch('done/deletePitches')
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
