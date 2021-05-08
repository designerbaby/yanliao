import Command from './Command'

class ChangeTrackStatusCommand extends Command {
  constructor(editor, index) {
    super( editor )
    this.name = 'Change TrackStatus'
    this.index = index
  }

  execute() {
    console.log('修改轨道状态')
    const trackList = this.editor.store.state.change.trackList
    const index = this.index
    if (trackList[index].is_sil === 1) {
      trackList[index].is_sil = 2
    } else {
      trackList[index].is_sil = 1
    }
    this.editor.store.dispatch('const/changeState', { isTrackChanged: true })
  }

  undo() {
    console.log('撤销修改轨道状态')
    const trackList = this.editor.store.state.change.trackList
    const index = this.index
    if (trackList[index].is_sil === 1) {
      trackList[index].is_sil = 2
    } else {
      trackList[index].is_sil = 1
    }
    this.editor.store.dispatch('const/changeState', { isTrackChanged: true })
  }
}


export default ChangeTrackStatusCommand
