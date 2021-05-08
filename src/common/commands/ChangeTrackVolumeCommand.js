import Command from './Command'

class ChangeTrackVolumeCommand extends Command {
  constructor(editor, volume, index) {
    super( editor )
    this.name = 'Change TrackVolume'
    this.volume = volume
    this.index = index
    this.oldVolume = 0
  }

  execute() {
    // TODO 移动结束后才处理
    console.log('修改轨道音量')
    this.oldVolume = this.editor.store.state.change.trackList[this.index].volume
    this.editor.store.state.change.trackList[this.index] = this.volume
    this.editor.store.dispatch('const/changeState', { isTrackChanged: true })
  }

  undo() {
    console.log('撤销修改轨道音量')
    this.editor.store.state.change.trackList[this.index] = this.oldVolume
    this.editor.store.dispatch('const/changeState', { isTrackChanged: true })
  }
}


export default ChangeTrackVolumeCommand
