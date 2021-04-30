import { TrackMode } from '@/common/utils/const'

const getters = {
  trackMode: state => {
    const ganIsSil = state.trackList[0].is_sil
    const banIsSil = state.trackList[1].is_sil
    if (ganIsSil === 2 && banIsSil === 2) {
      return TrackMode.TrackModeNone
    } else if (ganIsSil === 2 && banIsSil === 1) {
      return TrackMode.TrackModeBan
    } else if (ganIsSil === 1 && banIsSil === 2) {
      return TrackMode.TrackModeGan
    } else if (ganIsSil === 1 && ganIsSil === 1) {
      return TrackMode.TrackModeAll
    } else {
      return TrackMode.TrackModeNone
    }
  }
}

export default getters
