import Command from './Command'
import * as waveSurfers from '@/common/utils/waveSurfer'
import { timeToPx } from '@/common/utils/helper'

class DeleteArrangeCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Delete Arrange'
  }

  execute() {
    console.log('删除伴奏')
    waveSurfers.clearWaveSurfer()
    this.editor.store.dispatch('change/changeState', { waveWidth: 0 })
    this.editor.store.dispatch('const/changeState', { isObbligatoChanged: true })
  }

  undo() {
    console.log(`撤销删除伴奏`)
    const store = this.editor.store
    const waveSurfer = waveSurfers.createWaveSurfer(store.state.change.trackList[1].file, 'url')
    waveSurfer.on('ready', () => {
      // 初始化伴奏的宽度、音波、位移、音量
      const duration = waveSurfer.getDuration()
      const waveWidth = timeToPx(duration * 1000, store.state.const.noteWidth / 10, store.state.const.bpm)
      store.commit('change/changeState', { waveWidth }, { root: true })
      waveSurfer.zoom(waveWidth / duration)
      waveSurfer.setVolume(store.state.change.trackList[1].volume / 100)
      store.dispatch('const/adjustStageWidth', { root: true })
    })
    store.commit('const/changeState', { isObbligatoChanged: true, showArrange: true }, { root: true })

  }
}


export default DeleteArrangeCommand
