import Command from './Command'
import * as waveSurfer from '@/common/utils/waveSurfer'
import { timeToPx } from '@/common/utils/helper'

class ChangeBpmCommand extends Command {
  constructor(editor, inputBpmValue) {
    super(editor)
    this.name = 'Change Bpm'
    this.stateJson = '{}'
    this.inputBpmValue = inputBpmValue
  }

  execute() {
    console.log('修改曲速')
    const store = this.editor.store
    this.stateJson = JSON.stringify(this.editor.store.state.change)
    // 为了修复，bpm改变的时候，曲线闪一下的bug,这里特殊处理。
    const oldBpm = store.state.const.bpm
    this.oldBpm = oldBpm
    store.dispatch('const/changeState', { bpm: this.inputBpmValue, pitchChanged: true })
    store.dispatch('change/getPitchLine', {
      beforeRequest: () => {
        // 请求函数之前把bpm改回旧的，这样曲线就不会变动
        store.state.const.bpm = oldBpm
      },
      afterRequest: () => {
        // 数据请求回来之后，把bpm改成真正修改后的值，这样f0和bpm都是新的，曲线重新绘制
        store.state.const.bpm = this.inputBpmValue
      }
    })
     // 有伴奏的话，要相应修改伴奏的长度
    const waveSurferObj = waveSurfer.getWaveSurfer()
    if (waveSurferObj) {
      const duration = waveSurferObj.getDuration()
      const waveWidth = timeToPx(duration * 1000, store.state.const.noteWidth / 10, this.inputBpmValue)
      store.dispatch('change/changeState', { waveWidth })
      waveSurfer.clearWaveSurfer()
      store.dispatch('change/showWaveSurfer', { file: store.state.change.trackList[1].file, type: 'url', bpm: this.inputBpmValue })
    }
  }

  undo() {
    console.log('撤回修改曲速')
    const store = this.editor.store
    store.dispatch('const/changeState', { bpm: this.oldBpm, pitchChanged: true })
    store.dispatch('change/changeState', JSON.parse(this.stateJson))
    const waveSurferObj = waveSurfer.getWaveSurfer()
    if (waveSurferObj) {
      const duration = waveSurferObj.getDuration()
      const waveWidth = timeToPx(duration * 1000, store.state.const.noteWidth / 10, this.oldBpm)
      store.dispatch('change/changeState', { waveWidth })
      waveSurfer.clearWaveSurfer()
      store.dispatch('change/showWaveSurfer', { file: store.state.change.trackList[1].file, type: 'url', bpm: this.oldBpm })
    }
  }
}

export default ChangeBpmCommand
