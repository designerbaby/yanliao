import Command from './Command'

class ChangeTensionCommand extends Command {
  constructor(editor, drawBefore, drawMap) {
    super( editor )
    this.name = 'Change Tension'
    this.drawMap = drawMap
    this.drawBefore = drawBefore
  }

  execute() {
    const tensionMap = ChangeTensionCommand.format(this.drawBefore, this.drawMap)
    this.commit(tensionMap)
  }

  undo() {
    console.log(`撤销改变张力`)
    const tensionMap = [...this.drawBefore]
    this.commit(tensionMap)
  }

  static format(stateTensionMap, drawMap) {
    const tensionMap = [...stateTensionMap]
    for (const [x, v] of drawMap.entries()) {
      tensionMap[x] = v
    }
    return tensionMap
  }

  commit(tensionMap) {
    console.log(`ChangeTensionCommand, commit: tensionMap length is:`, tensionMap.length)
    const store = this.editor.store
    store.commit('const/changeState', { isTensionChanged: true }, { root: true })
    store.commit('change/changeState', { tensionMap })
  }
}

export default ChangeTensionCommand

