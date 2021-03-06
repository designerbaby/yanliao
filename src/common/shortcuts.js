
import hotkeys from 'hotkeys-js'
import CopyPitchCommand from '@/common/commands/CopyPitchCommand'
import PastePitchCommand from '@/common/commands/PastePitchCommand'
import DeletePitchCommand from '@/common/commands/DeletePitchCommand'
import SelectAllCommand from '@/common/commands/SelectAllCommand'
import { Message } from 'element-ui'
// shortcuts 快捷键统一操作
class Shortcut{
  enable = true

  constructor(editor) {
    this.editor = editor

    this.init()
  }

  init() {
    // ctrl + a 全选音符
    hotkeys('ctrl+a,command+a', (event) => {
      new SelectAllCommand(this.editor).execute()
      event.preventDefault()
    })
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
    hotkeys('ctrl+l,command+l', (event) => {
      const selectStagePitches = this.editor.store.state.change.stagePitches.filter(v => v.selected)
      if (selectStagePitches.length <= 0) {
        Message.error(`没有选中音符块~`)
        return
      }
      const BeatLyric = this.editor.findVueComponentByName('BeatLyric')
      BeatLyric.showLyric(-2)
      event.preventDefault()
    })
    hotkeys('ctrl+shift+l,command+shift+l', (event) => {
      const BeatLyric = this.editor.findVueComponentByName('BeatLyric')
      BeatLyric.showLyric(-1)
      event.preventDefault()
    })
    // hotkeys('ctrl+b,command+b', (event) => {
    //   console.log('ctrl+b,command+b:', event)
    // })
    // hotkeys('ctrl+p,command+p', (event) => {
    //   console.log('ctrl+p,command+p:', event)
    // })

    hotkeys("*", () => {
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
