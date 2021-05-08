import Command from './Command'

class ChangeTrackStatusCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change TrackStatus'
  }

  execute() {
    console.log('修改轨道状态')
  }

  undo() {
    console.log('撤销修改轨道状态')
  }
}


export default ChangeTrackStatusCommand
