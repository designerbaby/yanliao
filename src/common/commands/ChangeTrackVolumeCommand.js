import Command from './Command'

class ChangeTrackVolumeCommand extends Command {
  constructor(editor, before, after) {
    super( editor )
    this.name = 'Change TrackVolume'
    this.before = before
    this.after = after
  }

  execute() {
    console.log('修改轨道音量')
    this.commit(this.after)
  }

  undo() {
    console.log('撤销修改轨道音量')
    this.commit(this.before)
  }

  commit(item) {
    const track = this.getTrack(item)
    track.volume = item.volume
    track.is_sil = item.silenceStatus
    this.editor.store.dispatch('const/changeState', { isTrackChanged: true })
  }

  getTrack(item) {
    const track = this.editor.store.state.change.trackList.find(v => v.type === item.trackingType)
    return track
  }
}


export default ChangeTrackVolumeCommand
