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
  }
}

export default getters
