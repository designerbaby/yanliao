import { PitchList } from '@/common/utils/const'

const getters = {
  stageWidth: state => {
    return state.noteWidth * (32 / state.beatForm.fenmu) * state.beatForm.fenzi * state.matter
  },
  stageHeight: state => {
    return PitchList.length * state.noteHeight
  },
  arrangeFenziWidth: state => {
    return state.noteWidth * (32 / state.beatForm.fenmu) / 10
  },
  beatWidth: state => {
    return state.noteWidth * (32 / state.beatForm.fenmu) * state.beatForm.fenzi
  },
  pitchWidth: state => { // 音高线2个数据之间的px值
    // 10是因为数据的每一项间隔10ms
    return (10 * 8 * state.bpm * state.noteWidth) / (60 * 1000)
  }
}

export default getters
