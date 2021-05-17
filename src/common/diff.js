import deepAssign from 'object-assign-deep'

class Diff {

  beforePitches = null
  constructor(editor) {
    this.editor = editor
  }
  diffProps = ['hanzi','pinyin','pinyinList','fu','yuan','left','width','breath','preTime']

  diff(pitches) {
    const added = []
    const deleted = []
    const changed = []
    for (let i = 0; i < pitches.length; i += 1) {
      const item = pitches[i]
      const oldItem = this.beforePitches.find(it => it.uuid === item.uuid)
      if (!oldItem) {
        added.push(item)
      }
    }
    for (let i = 0; i < this.beforePitches.length; i += 1) {
      const item = this.beforePitches[i]
      const newItem = pitches.find(it => it.uuid === item.uuid)
      if (!newItem) {
        deleted.push(newItem)
      }
    }
    for (let i = 0; i < pitches.length; i += 1) {
      const item = pitches[i]
      const oldItem = this.beforePitches.find(it => it.uuid === item.uuid)
      if (oldItem) {
        changed.push(item)
      }
    }
  }

  setBeforePitches(pitches) {
    this.beforePitches = deepAssign([], pitches)
  }

}


export default Diff
