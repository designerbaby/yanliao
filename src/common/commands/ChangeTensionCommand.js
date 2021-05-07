import Command from './Command'

class ChangeTensionCommand extends Command {
  constructor(editor, values) {
    super( editor )
    this.name = 'Change Tension'
    this.values = values
  }

  execute() {
    // TODO 这里需要识别鼠标放开之后才触发，不是鼠标移动就触发
    console.log(`改变张力 values`, this.values)
    const store = this.editor.store

    const tensionMap = [...store.state.change.tensionMap]
    for (const [x, v] of this.values) {
      tensionMap[x] = v
    }
    commit('const/changeState', { isTensionChanged: true }, { root: true })
    commit('changeState', { tensionMap })
  }

  undo() {
    console.log(`撤销改变张力`)
    const store = this.editor.store
    const tensionMap = [...store.state.change.tensionMap]
    for (const x of this.values) {
      delete tensionMap[x]
    }
    store.commit('change/changeState', { tensionMap })
  }
}


export default ChangeTensionCommand
