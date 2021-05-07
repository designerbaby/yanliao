import Command from './Command'

class ChangePitchLyricCommand extends Command {
  constructor(editor) {
    super( editor )
    this.name = 'Change PitchLyric'
  }

  execute() {
    console.log('修改音块歌词')
  }

  undo() {
    console.log(`撤销改变音块歌词`)
  }
}


export default ChangePitchLyricCommand
