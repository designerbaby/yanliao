import Command from './Command'
import { generateUUID } from '@/common/utils/helper'
import { ModeState } from "@/common/utils/const"

class AddPitchCommand extends Command {
  constructor( editor, pitch ) {
		super( editor )
    this.name = 'Add One Pitch'
    this.pitch = {
      hanzi: '啦',
      pinyin: 'la',
      red: false,
      pinyinList: ['la'],
      select: 0,
      fu: 'l',
      yuan: 'a',
      selected: true,
      pitchChanged: true,
      uuid: generateUUID(),
      ...pitch
    }
  }

  execute() {
    console.log(`添加一个音块：`, { ...this.pitch})
    const store = this.editor.store
    const stagePitches = this.editor.store.state.change.stagePitches
    store.dispatch('change/resetStagePitchesSelect', null, { root: true })

    const beatContainer = this.editor.findVueComponentByName('BeatContainer')

    beatContainer.doSelectUUID(null)
    this.editor.store.state.change.stagePitches.push({ ...this.pitch})
    if (stagePitches.length) {
      beatContainer.doSelectUUID(stagePitches[stagePitches.length - 1].uuid)
    }
    store.dispatch('change/afterChangePitchAndHandle', null, { root: true })
    // console.log(`this.stagePitches`, this.editor.store.state.change.stagePitches)
  }
  undo() {
    console.log(`撤销一个音块：`, { ...this.pitch})
    const stagePitches = this.editor.store.state.change.stagePitches
    const index = stagePitches.findIndex(v => v.uuid === this.pitch.uuid)
    this.editor.store.state.change.stagePitches.splice(index, 1)
    this.editor.store.dispatch('change/afterChangePitchAndHandle', null, { root: true })
    this.editor.store.dispatch('const/changeState', { mode: ModeState.StatePitch })
  }
}

export default AddPitchCommand
