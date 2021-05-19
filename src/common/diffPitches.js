import deepAssign from 'object-assign-deep'

class DiffPitches {

  beforePitches = null
  beforeF0Draw = null
  diffProps = ['fu', 'hanzi', 'height', 'left', 'pinyin', 'pitchChanged', 'preTime', 'select', 'top','width', 'yuan']
  breathDiffProp = ['left', 'width', 'pinyin']

  constructor(editor) {
    this.editor = editor
  }

  diff(pitches) {
    console.log('this.beforePitches:', this.beforePitches)
    console.log('pitches:', pitches)
    if (!this.beforePitches) {
      return []
    }

    const added = []
    const deleted = []
    const changed = []
    for (let i = 0; i < pitches.length; i += 1) {
      const item = pitches[i]
      const oldItem = this.beforePitches.find(it => it.uuid === item.uuid)
      // 找不到旧的,说明是新增的，那就把这个新增的push进去
      if (!oldItem) {
        added.push(item)
      }
    }
    console.log('added:', added)
    for (let i = 0; i < this.beforePitches.length; i += 1) {
      const item = this.beforePitches[i]
      const newItem = pitches.find(it => it.uuid === item.uuid)
      // 找不到新的，说明是被删除的，删除的原来那项push进去
      if (!newItem) {
        deleted.push(item)
      }
    }
    console.log('deleted:', deleted)
    // 不是新增也不是删除，前后两个的长度相等
    if (pitches.length === this.beforePitches.length) {
      for (let i = 0; i < pitches.length; i += 1) {
        const item = pitches[i]
        const oldItem = this.beforePitches.find(it => it.uuid === item.uuid)
        const diffProps = this.diffProps
        // console.log(`item: ${JSON.stringify(item)}, oldItem: ${JSON.stringify(oldItem)}`)
        if (item && oldItem) {
          for (let i = 0; i < diffProps.length; i += 1) {
            const prop = diffProps[i]
            // console.log(`prop: ${prop}, item[prop]: ${item[prop]}, oldItem: ${oldItem}, item[prop] !== oldItem[prop]: ${item[prop] !== oldItem[prop]}`)
            if (item[prop] !== oldItem[prop]) {
              changed.push(item)
              break
            }
            if (item.breath) {
              if (!oldItem.breath) {
                changed.push(item)
                break
              }
              const breathDiffProp = this.breathDiffProp
              for (let i = 0; i < breathDiffProp.length; i += 1) {
                const breathProp = breathDiffProp[i]
                if (item.breath[breathProp] !== oldItem.breath[breathProp])
                changed.push(item)
                break
              }
            }
          }
        }
      }
    }
    console.log('changed:', changed)
    const finalArray = this.unique(added, changed, deleted)
    console.log('finalArray:', finalArray)
    return finalArray
  }

  diffF0Draw(newF0Draw) {
    const oldF0Draw = this.beforeF0Draw
    if (!oldF0Draw || !newF0Draw) {
      return []
    }
    const values = []
    const length = newF0Draw.length

    let lastIndex = -2
    for (let i = 0; i < length; i += 1) {
      const oldValue = oldF0Draw[i]
      const newValue = newF0Draw[i]
      const item = {
        index: i,
        st: i * 10,
        et: i * 10,
        stb: -1
      }
      if (oldValue != newValue) {
        // 连续
        if ((lastIndex + 1) === i) {
          values[values.length].et = i * 10
        } else {
          values.push(item)
        }
        lastIndex = i
      }
    }

    return values
  }

  unique (added, changed, deleted) {
    const alterTimePitches = added.concat(changed, deleted)
    let map = new Map();
    let array = new Array();  // 数组用于返回结果
    for (let i = 0; i < alterTimePitches.length; i++) {
      const uuid = alterTimePitches[i].uuid
      if(map.has(uuid)) {  // 如果有该key值
        map.set(alterTimePitches[i], true);
      } else {
        map.set(alterTimePitches[i], false);   // 如果没有该key值
        array.push(alterTimePitches[i]);
      }
    }
    return array
  }

  setBefore({ stagePitches, f0Draw }) {
    this.beforePitches = deepAssign([], stagePitches)
    this.beforeF0Draw = deepAssign([], f0Draw)
  }

  // setBeforePitches(pitches) {
  //   this.beforePitches = deepAssign([], pitches)
  // }

  // setBeforeChangedLineMap (changedLineMap) {
  //   this.beforeChangedLineMap = deepAssign({}, changedLineMap)
  // }

  clearBefore() {
    this.beforePitches = null
    this.beforeF0Draw = null
  }

}


export default DiffPitches
