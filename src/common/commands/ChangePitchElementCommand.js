import Command from './Command'

class ChangePitchElementCommand extends Command {
  constructor(editor, pitch, preTime) {
    super( editor )
    this.name = 'Change PitchElement'
    this.pitch = pitch
    this.preTime = preTime
  }

  execute() {
    console.log(`改变音素`)
    this.oldPreTime = this.pitch.preTime
    this.pitch.preTime = this.preTime
  }

  undo() {
    console.log(`撤销改变音素`)
    this.pitch.preTime = this.oldPreTime
  }
}


export default ChangePitchElementCommand
