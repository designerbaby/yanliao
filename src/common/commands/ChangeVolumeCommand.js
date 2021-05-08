import Command from './Command'

class ChangeVolumeCommand extends Command {
  constructor(editor, drawBefore, drawMap) {
    super( editor )
    this.name = 'Change Volume'
    this.drawMap = drawMap
    this.drawBefore = drawBefore
  }

  execute() {
    const volumeMap = ChangeVolumeCommand.format(this.drawBefore, this.drawMap)
    this.commit(volumeMap)
  }

  undo() {
    console.log(`撤销改变响度`)
    const volumeMap = [...this.drawBefore]
    this.commit(volumeMap)
  }

  static format(stateVolumeMap, drawMap) {
    // console.trace(`ChangeVolumeCommand, format:`, drawMap)
    const volumeMap = [...stateVolumeMap]
    for (const [x, v] of drawMap.entries()) {
      volumeMap[x] = v
    }
    return volumeMap
  }

  commit(volumeMap) {
    console.log(`ChangeVolumeCommand, commit: volumeMap length is:`, volumeMap.length)
    const store = this.editor.store
    store.commit('const/changeState', { isVolumeChanged: true }, { root: true })
    store.commit('change/changeState', { volumeMap })
  }
}


export default ChangeVolumeCommand
