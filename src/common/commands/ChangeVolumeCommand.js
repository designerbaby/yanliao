import Command from './Command'

class ChangeVolumeCommand extends Command {
  constructor(editor, values) {
    super( editor )
    this.name = 'Change Volume'
    this.values = values
  }

  execute() {
    // TODO 这里需要识别鼠标放开之后才触发，不是鼠标移动就触发
    console.log(`改变响度 values`, this.values)
    const store = this.editor.store
    const volumeMap = [...store.state.change.volumeMap]
    for (const [x, v] of this.values) {
      volumeMap[x] = v
      // this.oldValues[x] = v
    }
    store.commit('const/changeState', { isVolumeChanged: true }, { root: true })
    store.commit('change/changeState', { volumeMap })
  }

  undo() {
    console.log(`撤销改变响度`)
    const store = this.editor.store
    const volumeMap = [...store.state.change.volumeMap]
    for (const x of this.value) {
      delete volumeMap[x]
    }
    store.commit('change/changeState', { volumeMap })
  }
}


export default ChangeVolumeCommand
