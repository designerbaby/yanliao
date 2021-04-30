import { PlayState, ModeState, TypeModeState } from '@/common/utils/const'

const constState = () => ({
  beatForm: {   // 存储节拍
    fenzi: 4,
    fenmu: 4
  },
  lineLeft: 0,   // 播放线的左边距
  matter: 30,    // 总共有多少个小节
  noteWidth: 20, // 32分音符占据的最小像素单位
  noteHeight: 25,// 32分音符的占据的最小高度
  bpm: 90,       // 曲速
  toneId: 1,     // 选择的toneId
  auditUrl: '',  // 选择的播放的url
  taskId: 0,     // 正在编辑的taskId
  toneName: 'luoxiang', // 选择的toneName
  stage: {
    width: 0,     // 舞台容器宽度
    height: 0,    // 舞台容器高度
    scrollLeft: 0,// 水平滚动条位置
    scrollTop: 0, // 垂直滚动条位置
    rectLeft: 0,
    rectTop: 0
  },
  mode: ModeState.StatePitch,        // 模式
  typeMode: TypeModeState.StateNone, // 附加模式类型
  playState: PlayState.StateNone,    // 播放状态
  isSynthetizing: false, // 是否在合成音频中
  isGetF0Data: false,    // 是否在获取f0中
  isStagePitchesChanged: false,       // 舞台音块是否有改变
  isPitchLineChanged: false,          // 音高线是否有改变
  isVolumeChanged: false,             // 响度是否有改变
  isTensionChanged: false,            // 张力是否有改变
  isStagePitchElementChanged: false,  // 元辅音是否有改变
  isObbligatoChanged: false,          // 伴奏是否有改变
  isTrackChanged: false,              // 干音和伴奏是否有改变
  pitchChanged: false,                // 是否全部重置
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
  arrangeStage: { // 音轨舞台
    width: 0,
    height: 0,
    scrollLeft: 0,
    scrollTop: 0
  },
  wavePlayStartTime: 0 // 伴奏轨开始的时间
})

export default constState
