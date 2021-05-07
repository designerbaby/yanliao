import Command from './Command'
import { Message } from 'element-ui'

class CopyPitchCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Copy Pitch'
  }

  execute() {
    console.log('复制音块')
    Message.success('复制成功~')
    const copyStagePitches = rootState.change.stagePitches.filter(v => v.selected);
    dispatch('const/changeState', { copyStagePitches, showMenuList: false }, { root: true })
    // 存一份在浏览器中
    localStorage.setItem('copyStagePitches', JSON.stringify(copyStagePitches))
    localStorage.setItem('changedLineMap', JSON.stringify(rootState.changedLineMap))

  }

  undo() {
    console.log(`撤销复制音块`)
  }
}


export default CopyPitchCommand
