import Command from './Command'

class ChangeTrackVolumeCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change TrackVolume'
  }

  execute() {
    console.log('修改轨道音量')
  }

  undo() {
    console.log('撤销修改轨道音量')
  }
}


export default ChangeTrackVolumeCommand
