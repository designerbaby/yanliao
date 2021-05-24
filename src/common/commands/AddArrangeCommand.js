import Command from './Command'
import { timeToPx } from '@/common/utils/helper'
import * as waveSurfers from '@/common/utils/waveSurfer'

class AddArrangeCommand extends Command {
  constructor(editor, file) {
    super( editor )
    this.name = 'Add Arrange'
    this.file = file
  }

  execute() {
    console.log('增加伴奏')
    const waveSurfer = waveSurfers.createWaveSurfer(this.file, 'url')
    const store = this.editor.store
    store.state.change.trackList[1].file = this.file
    waveSurfer.on('ready', () => {
      // 初始化伴奏的宽度、音波、位移、音量
      const duration = waveSurfer.getDuration()
      const waveWidth = timeToPx(duration * 1000, store.state.const.noteWidth / 10, store.state.const.bpm)
      store.commit('change/changeState', { waveWidth }, { root: true })
      store.state.change.trackList[1].offset = store.state.change.stageMousePos.x
      waveSurfer.zoom(waveWidth / duration)
      waveSurfer.setVolume(store.state.change.trackList[1].volume / 100)
      store.dispatch('const/adjustStageWidth', { root: true })
    })
    store.commit('const/changeState', { isObbligatoChanged: true }, { root: true })
  }

  undo() {
    console.log(`撤销增加伴奏`)
    waveSurfers.clearWaveSurfer()
    this.editor.store.dispatch('change/changeState', { waveWidth: 0 })
    this.editor.store.commit('const/changeState', { isObbligatoChanged: true, showArrange: true }, { root: true })
  }
}


export default AddArrangeCommand
