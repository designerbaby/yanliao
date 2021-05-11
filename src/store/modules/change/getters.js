import { pxToTime } from '@/common/utils/helper'
import { PitchList, TrackMode } from '@/common/utils/const'

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
  },
  pitchList: (state, getters, rootState) =>  {
    const stagePitches = state.stagePitches
    const pitches = []
    for (let i = 0; i < stagePitches.length; i += 1) {
      const item = stagePitches[i]
      const duration = pxToTime(item.width, rootState.const.noteWidth, rootState.const.bpm)
      const pitch = PitchList[0].pitch - (item.top / item.height)
      const startTime = pxToTime(item.left, rootState.const.noteWidth, rootState.const.bpm)
      let preTime = rootState.const.pitchChanged || item.pitchChanged ? 0 : item.preTime
      const before = stagePitches[i - 1]
      // 首个的辅音最短不能小于0
      if ((startTime - preTime) < 0) {
        preTime = 0
        item.pitchChanged = true
      }

      // 下面因为一些辅音和元音的限制，需要重置
      if (before) {
        const beforeEndTime = pxToTime(before.left + before.width, rootState.const.noteWidth, rootState.const.bpm)
        if (beforeEndTime < startTime) { // 前后两个有空格，辅音不会重叠到前面的元音
          if ((startTime - item.preTime) < beforeEndTime) {
            preTime = 0
            item.pitchChanged = true
          }
        } else if (beforeEndTime === startTime) { // 前后两个没有空格
          const beforeStartTimeAndPitch = pxToTime(before.left + rootState.const.noteWidth, rootState.const.noteWidth, rootState.const.bpm)
          if ((startTime - item.preTime) < beforeStartTimeAndPitch) {
            preTime = 0
            item.pitchChanged = true
          }
        }
      }

      let breath = null
      if (item.breath) {
        breath = {
          duration: pxToTime(item.breath.width, rootState.const.noteWidth, rootState.const.bpm),
          pitch: pitch,
          singer: rootState.const.toneName,
          startTime: pxToTime(item.breath.left, rootState.const.noteWidth, rootState.const.bpm),
          pinyin: item.breath.pinyin,
          preTime: 0
        }
      }

      const pitchItem = {
        duration: duration,
        pitch: pitch,
        singer: rootState.const.toneName,
        startTime: startTime,
        endTime: startTime + duration,
        pinyin: item.pinyin,
        hanzi: item.hanzi,
        toneId: rootState.const.toneId,
        bpm: rootState.const.bpm,
        pinyinList: item.pinyinList,
        select: item.select, // 拼音多音字选择的第几项
        fu: item.fu,
        yuan: item.yuan,
        preTime: preTime,
        breath: breath // 换气的字段
      }
      pitches.push(pitchItem)
    }
    return pitches
  }
}

export default getters
