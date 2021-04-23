import Vue from 'vue'
import Vuex from 'vuex'
import profile from './profile'
import { pitchList, playState, modeState, typeModeState } from '@/common/utils/const'
import { getF0Data, getYinsu } from '@/api/audio'
import { pxToTime, checkPitchDuplicated } from '@/common/utils/helper'
import { Message } from 'element-ui'
import deepAssign from 'object-assign-deep'

Vue.use(Vuex)

const defaultState = {
  beatForm: {   // 存储节拍
    fenzi: 4,
    fenmu: 4
  },
  lineLeft: 6,   // 播放线的左边距
  matter: 30,    // 总共有多少个小节
  noteWidth: 20, // 32分音符占据的最小像素单位
  noteHeight: 25, // 32分音符的占据的最小高度
  bpm: 90,       // 曲速
  toneId: 1,    // 选择的toneId
  auditUrl: '', // 选择的播放的url
  taskId: 0,    // 正在编辑的taskId
  toneName: 'luoxiang', // 选择的toneName
  stage: {
    width: 0,     // 舞台容器宽度
    height: 0,    // 舞台容器高度
    scrollLeft: 0,// 水平滚动条位置
    scrollTop: 0  // 垂直滚动条位置
  },
  mode: modeState.StatePitch,        // 模式
  typeMode: typeModeState.StateNone, // 附加模式类型
  playState: playState.StateNone,    // 播放状态
  stagePitches: [], // 舞台音块
  isSynthetizing: false, // 是否在合成音频中
  isGetF0Data: false,    // 是否在获取f0中
  isStagePitchesChanged: false,       // 舞台音块是否有改变
  isPitchLineChanged: false,          // 音高线是否有改变
  isVolumeChanged: false,             // 响度是否有改变
  isTensionChanged: false,            // 张力是否有改变
  isStagePitchElementChanged: false,  // 元辅音是否有改变
  isObbligatoChanged: false,       // 伴奏是否有改变
  pitchChanged: false, // 是否全部重置
  f0AI: [],           // 音高线虚线部分
  f0Draw: [],         // 音高线实线部分
  changedLineMap: {}, // 音高线改变的信息
  volumeMap: [],  // 响度原始map数据
  tensionMap: [], // 张力原始map数据
  pinyinList: [], // 当前用户输入的字里面包括的多音字列表
  onlineUrl: '',  // 在线播放的音频
  isExceedHeader: false, // 滚动是否超过头部
  appScrollTop: 0, // 页面垂直滚动条的位置
  typeContainerHeight: 250, // 响度/张力面板的高度
  showMenuList: false,   // 音块的右键菜单列表
  showStageList: false,  // 全局舞台的右键菜单列表
  copyStagePitches: [], // 复制的内容
  musicId: 0, // 从主流程过来的选中的歌曲id
  musicName: '编辑器填词', // 歌曲名称
  showArrange: true, // 是否展开编曲
  wavesurfer: null, // 音波对象
  waveWidth: 0, // 音波长度
  ganAudio: null,
  trackList: [ // 音轨列表，!!!后续多音轨要改这里的数据
    {
      volume: 100,  // 音频音量
      is_sil: 1,    // 是否静音 1否 2是
      type: 1,      // 音频类型 1代表干音音轨, 2代表伴奏音轨
      offset: 0,
      file: '', // 地址
    },
    {
      volume: 100,
      is_sil: 1,
      type: 2,
      offset: 0,
      file: ''
    }
  ],
  arrangeStage: { // 音轨舞台
    width: 0,
    height: 0,
    scrollLeft: 0,
    scrollTop: 0
  }
}

const store = new Vuex.Store({
  state: {
    ...deepAssign({}, defaultState)
  },
  getters: {
    stageWidth: state => {
      return state.noteWidth * (32 / state.beatForm.fenmu) * state.beatForm.fenzi * state.matter
    },
    stageHeight: state => {
      return pitchList.length * state.noteHeight
    },
    beatWidth: state => {
      return state.noteWidth * (32 / state.beatForm.fenmu) * state.beatForm.fenzi
    },
    firstPitch: state => {
      return pitchList[0].pitch
    },
    pitchWidth: state => { // 音高线2个数据之间的px值
      // 10是因为数据的每一项间隔10ms
      console.log('state.bpm:', state.bpm)
      return (10 * 8 * state.bpm * state.noteWidth) / (60 * 1000)
    },
    pitchList: (state, getters) =>  {
      const stagePitches = state.stagePitches
      const pitches = []
      for (let i = 0; i < stagePitches.length; i += 1) {
        const item = stagePitches[i]
        const duration = pxToTime(item.width, state.noteWidth, state.bpm)
        const pitch = getters.firstPitch - (item.top / item.height)
        const startTime = pxToTime(item.left, state.noteWidth, state.bpm)
        let preTime = state.pitchChanged || item.pitchChanged ? 0 : item.preTime
        const before = stagePitches[i - 1]
        // 首个的辅音最短不能小于0
        if ((startTime - preTime) < 0) {
          preTime = 0
          item.pitchChanged = true
        }

        // 下面因为一些辅音和元音的限制，需要重置
        if (before) {
          const beforeEndTime = pxToTime(before.left + before.width, state.noteWidth, state.bpm)
          if (beforeEndTime < startTime) { // 前后两个有空格，辅音不会重叠到前面的元音
            if ((startTime - item.preTime) < beforeEndTime) {
              preTime = 0
              item.pitchChanged = true
            }
          } else if (beforeEndTime === startTime) { // 前后两个没有空格
            const beforeStartTimeAndpitch = pxToTime(before.left + state.noteWidth, state.noteWidth, state.bpm)
            if ((startTime - item.preTime) < beforeStartTimeAndpitch) {
              preTime = 0
              item.pitchChanged = true
            }
          }
        }

        let breath = null
        if (item.breath) {
          breath = {
            duration: pxToTime(item.breath.width, state.noteWidth, state.bpm),
            pitch: pitch,
            singer: state.toneName,
            startTime: pxToTime(item.breath.left, state.noteWidth, state.bpm),
            pinyin: item.breath.pinyin,
            preTime: 0
          }
        }

        const pitchItem = {
          duration: duration,
          pitch: pitch,
          singer: state.toneName,
          startTime: startTime,
          endTime: startTime + duration,
          pinyin: item.pinyin,
          hanzi: item.hanzi,
          toneId: state.toneId,
          bpm: state.bpm,
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
    },
    audioDuration: (state, getters) => {
      let startTime = -1
      let endTime = -1
      for (const pitch of getters.pitchList) {
        if (startTime < 0 || pitch.startTime < startTime) {
          startTime = pitch.startTime
        }
        if (endTime < 0 || pitch.endTime > endTime) {
          endTime = pitch.endTime
        }
      }

      const duration = endTime - startTime
      // SDK还补了500
      return duration > 0 ? duration + 500 : 0
    }
  },
  mutations: {
    updateBeatForm(state, form) {
      state.beatForm = {
        ...state.beatForm,
        ...form
      }
    },
    updateMatter(state, matter) {
      state.matter += matter
    },
    // 通用改成state方法
    changeStoreState(state, props) {
      Object.keys(props).forEach(k => {
        // console.log(`changeStoreState`, k, props[k])
        state[k] = props[k]
      })
    },
    changeF0(state, { index, value }) {
      const f0 = state.f0Draw
      f0[index] = value
      state.f0Draw = [...f0]
    }
  },
  actions: {
    resetState({ commit }) {
      const state = deepAssign({}, defaultState)
      commit('changeStoreState', state)
    },
    updateBeatForm (context, form) {
      context.commit('updateBeatForm', form)
    },
    updateMatter(context, matter) {
      context.commit('updateMatter', matter)
    },
    // 通用改方法
    changeStoreState({ commit }, props) {
      commit('changeStoreState', props)
    },
    changeF0({ commit, state, getters }, { values }){
      const changedLineMap = { ...state.changedLineMap }
      const f0Draw = [...state.f0Draw]
      for(const [x, v] of values) {
        const index = Math.round(x / getters.pitchWidth)
        changedLineMap[x] = v
        f0Draw[index] = v
      }
      commit('changeStoreState', { f0Draw, changedLineMap, isPitchLineChanged: true })
    },
    changeVolumeMap({ commit, state }, { values }) {
      const volumeMap = [...state.volumeMap]
      for (const [x, v] of values) {
        volumeMap[x] = v
      }
      commit('changeStoreState', { volumeMap, isVolumeChanged: true })
    },
    changeTensionMap({ commit, state }, { values }) {
      const tensionMap = [...state.tensionMap]
      for (const [x, v] of values) {
        tensionMap[x] = v
      }
      commit('changeStoreState', { tensionMap, isTensionChanged: true })
    },
    resetStagePitchesSelect({ commit, state }) { // 重置舞台音块的每个选择
      const stagePitches = [...state.stagePitches]
      stagePitches.forEach(item => {
        item.selected = false
      })
      commit('changeStoreState', { stagePitches })
    },
    async getPitchLine({ commit, state, getters }, { beforeRequest, afterRequest } = {}) {
      console.log(`[action] getPitchLine called`)
      if (getters.pitchList.length <= 0) {
        // Message.error('没有画音块，所以没音高线')
        commit('changeStoreState', { f0AI: [], f0Draw: [] })
        return
      }
      for (let i = 0; i < state.stagePitches.length; i += 1) {
        if (state.stagePitches[i].red) {
          Message.error('音符存在重叠, 请调整好~')
          return
        }
      }
      commit('changeStoreState', { isGetF0Data: true })
      // 请求参数先深复制一份
      const reqData = deepAssign({}, { pitchList: getters.pitchList })
      if (beforeRequest) {
        await beforeRequest()
      }
      const { data } = await getF0Data(reqData)
      if (afterRequest) {
        await afterRequest()
      }

      if (data.ret_code !== 0) {
        // Message.error(`请求音高线数据错误,错误信息:${data.err_msg}`)
        return
      }
      const f0Data = data.data.f0_data
      commit('changeStoreState', { f0AI: f0Data })

      const f0Draw = []
      const changed = state.changedLineMap
      // 修正音高线
      for (const [index, value] of f0Data.entries()) {
        const x = Math.round(getters.pitchWidth * index)
        // const preX = Math.round(getters.pitchWidth * (index - 1))
        const nextX = Math.round(getters.pitchWidth * (index + 1))
        const changedValue = null
        for (let j = x; j <= nextX; j +=1) {
          if (j in changed) {
            changedValue = changed[j]
            // console.log(`${j} in changed, value:${changedValue}`)
            break
          }
        }

        if (changedValue) {
          f0Draw[index] = changedValue
        } else {
          f0Draw[index] = value
        }
      }

      const pitchList = data.data.pitchList
      const stagePitches = [ ...state.stagePitches]
      // 辅音合并数据
      for (let i = 0; i < pitchList.length; i += 1) {
        const item = stagePitches[i]
        const isExist = item.hasOwnProperty('preTime')
        if (state.pitchChanged || item.pitchChanged || !isExist) {
          Vue.set(item, 'preTime', pitchList[i].preTime)
        }
        item.pitchChanged = false
      }
      commit('changeStoreState', { f0Draw, stagePitches, isPitchLineChanged: false, isGetF0Data: false, pitchChanged: false })
    },
    updateStageSize({ commit, state }) {
      const windowWidth = window.innerWidth
      const width = windowWidth - 50
      const arrangeStageWidth = windowWidth - 216
      commit('changeStoreState', {
        stage: {
          ...state.stage,
          width
        },
        arrangeStage: {
          ...state.arrangeStage,
          width: arrangeStageWidth
        }
      })
    },
    afterChangePitchAndHandle({ commit, state, dispatch }) {
      state.stagePitches.sort((a, b) => a.left - b.left) // 排序
      const stagePitches = checkPitchDuplicated(state.stagePitches)
      commit('changeStoreState', { stagePitches })
      dispatch('getPitchLine')
    },
    adjustStageWidth({ state, getters, dispatch }) {
      let maxPitchRight = 0
      state.stagePitches.forEach((item) => {
        const right = item.left + item.width
        maxPitchRight = Math.max(maxPitchRight, right)
      })
      while (maxPitchRight > getters.stageWidth) {
        dispatch('updateMatter', 15)
      }
    },
    async saveFuYuan({ commit, state }) {
      const stagePitches = state.stagePitches
      let pinyin = stagePitches.map(v => v.pinyin)
      const res = await getYinsu({pin_yin: pinyin})
      const yinsu = res.data.data.yin_su
      for (let i = 0; i < stagePitches.length; i += 1) {
        const item = stagePitches[i]
        const py = yinsu[item.pinyin] || {}
        const f = py.f || '-'
        const y = py.y || '-'
        Vue.set(item, 'fu', f)
        Vue.set(item, 'yuan', y)
      }
      commit('changeStoreState', { stagePitches })
    }
  },
  modules: {
    profile: profile
  }
})

store.dispatch('updateStageSize')
window.addEventListener('resize', () => {
  store.dispatch('updateStageSize')
})
export default store
