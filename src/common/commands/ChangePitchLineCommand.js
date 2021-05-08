import Command from './Command'

class ChangePitchLineCommand extends Command {
  // drawMap是一个Map对象
  constructor(editor, f0DrawBefore, changedLineMapBefore, drawMap) {
    super( editor )
    this.name = 'Change PitchLine'
    this.pitchWidth = 0
    this.f0DrawBefore = f0DrawBefore
    this.changedLineMapBefore = changedLineMapBefore
    this.drawMap = drawMap
  }

  execute() {
    const store = this.editor.store
    const pitchWidth = store.getters['const/pitchWidth']
    this.pitchWidth = pitchWidth

    const {
      f0Draw,
      changedLineMap
    } = store.state.change

    console.log(`改变音高线, pitchWidth:${pitchWidth}, f0Draw: ${Object.keys(f0Draw).length}, changedLineMap:${Object.keys(changedLineMap).length}, drawMap:${this.drawMap.size}`)
    const data = ChangePitchLineCommand.format({
      f0Draw,
      changedLineMap,
      pitchWidth,
      drawMap: this.drawMap
    })
    this.commit(data)
  }

  undo() {
    const data = {
      pitchWidth: this.pitchWidth,
      f0Draw: this.f0DrawBefore,
      changedLineMap: this.changedLineMapBefore
    }

    console.log(`撤销改变音高线, pitchWidth:${data.pitchWidth}, f0Draw: ${Object.keys(data.f0Draw).length}, changedLineMap:${Object.keys(data.changedLineMap).length}`)
    this.commit(data)
  }

  static format({
    pitchWidth,
    f0Draw: argF0Draw,
    changedLineMap: argChangedLineMap,
    drawMap
  }) {
    const changedLineMap = { ...argChangedLineMap }
    const f0Draw = [...argF0Draw]
    for(const [x, v] of drawMap.entries()) {
      const index = Math.round(Number(x) / pitchWidth)
      changedLineMap[x] = v
      f0Draw[index] = v
    }

    return {
      f0Draw,
      changedLineMap
    }
  }

  // 真正提交数据
  commit({ f0Draw, changedLineMap }) {
    console.log(`ChangePitchLineCommand, commit`)
    const store = this.editor.store
    store.commit('const/changeState', { isPitchLineChanged: true }, { root: true })
    store.commit('change/changeState', { f0Draw, changedLineMap })
  }
}


export default ChangePitchLineCommand
