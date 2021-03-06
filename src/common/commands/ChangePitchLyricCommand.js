import Command from './Command'
import { ModeState } from "@/common/utils/const"
class ChangePitchLyricCommand extends Command {
  constructor(editor, lyricArray, maxlength, index) {
    super( editor )
    this.name = 'Change PitchLyric'
    this.lyricArray = lyricArray
    this.maxlength = maxlength
    this.index = index
  }

  execute() {
    console.log('修改音块歌词')
    const store = this.editor.store
    this.oldStagePitches = JSON.stringify(store.state.change.stagePitches)
    const stagePitches = store.state.change.stagePitches
    const pinyinList = store.state.const.pinyinList
    if (this.index === -1) {
      for(let i = 0; i < this.maxlength; i += 1) {
        const pitch = stagePitches[i]

        // 歌词逐个有没改动
        if (pitch.hanzi !== this.lyricArray[i]) {
          pitch.pitchChanged = true
        } else {
          pitch.pitchChanged = false
        }
        pitch.hanzi = this.lyricArray[i] || '啦'
        pitch.pinyinList = pinyinList[i].pinyin || ['la']
        let select = 0
        if (pinyinList[i].pinyin.length > 1) {
          select = pitch.select
        }
        pitch.pinyin = pinyinList[i].pinyin[select] || 'la'
      }
    } else {
      const changeStagePitches = stagePitches.filter(v => v.selected)
      for (let i = 0; i < changeStagePitches.length; i += 1) {
        const pitch = changeStagePitches[i]
        if (pitch.hanzi !== this.lyricArray[i]) {
          pitch.pitchChanged = true
        } else {
          pitch.pitchChanged = false
        }
        pitch.hanzi = this.lyricArray[i]
        pitch.pinyinList = pinyinList[i].pinyin || ['la']
        let select = 0
        if (pinyinList[i].pinyin.length > 1) {
          select = pitch.select
        }
        pitch.pinyin = pinyinList[i].pinyin[select] || 'la'
      }
    }
    store.dispatch('change/saveFuYuan')
    store.dispatch('change/getPitchLine')
  }

  undo() {
    console.log(`撤销改变音块歌词`)
    this.editor.store.state.change.stagePitches = JSON.parse(this.oldStagePitches)
    this.editor.store.dispatch('const/changeState', { mode: ModeState.StatePitch })
  }
}


export default ChangePitchLyricCommand
