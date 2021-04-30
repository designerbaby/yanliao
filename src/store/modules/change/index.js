import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'

const changeState = () => ({
  stagePitches: [],    // 舞台音块
  f0AI: [],            // 音高线虚线部分
  f0Draw: [],          // 音高线实线部分
  changedLineMap: {},  // 音高线改变的信息
  volumeMap: [],  // 响度原始map数据
  tensionMap: [], // 张力原始map数据
  waveWidth: 0, // 音波长度
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
  stageMousePos: {  // 伴奏轨的位置
    x: 0,
    y: 0
  }
})

const state = changeState


export default {
  state,
  getters,
  mutations,
  actions
}
