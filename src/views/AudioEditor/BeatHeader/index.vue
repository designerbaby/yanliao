<template>
  <div :class="$style.wrap">
    <div :class="$style.blank" v-if="isExceedHeader"></div>
    <div :class="[$style.header, isExceedHeader ? $style.isFloat : '']">
      <Upload
        ref="upload"
        accept=".mid"
        :on-change="uploadChange"
        :auto-upload="false"
        :multiple="false"
        :show-file-list="false"
        :with-credentials="true"
        action="/">
        <div id="uploadQuPuWrap">
          <div :class="[$style.common, $style.left]" @click="uploadQuPu">
            <img src="@/assets/audioEditor/import.png"/>
            <div :class="$style.text">导入曲谱</div>
          </div>
        </div>
      </Upload>
      <div :class="$style.common" @click="clickArrange">
        <img src="@/assets/track/track-arrange.png" v-if="$store.state.const.showArrange">
        <img src="@/assets/track/track-normal.png" v-else>
        <div :class="$style.text">编曲</div>
      </div>
      <div :class="$style.linefu">
        <div :class="[$style.check, mode === ModeState.StatePitch ? $style.isActive : '']" @click="selectMode(ModeState.StatePitch)">
          <img src="@/assets/audioEditor/note-active.png" v-if="mode === ModeState.StatePitch">
          <img src="@/assets/audioEditor/note-normal.png" v-else>
          <div :class="$style.text">音符模式</div>
        </div>
        <div :class="$style.lineWrapper" @mouseover="showLineContainer(true)" @mouseout="showLineContainer(false)">
          <div :class="[$style.check, $style.middle, mode === ModeState.StateLine ? $style.isActive : '']" @click="selectMode(ModeState.StateLine)">
            <img src="@/assets/audioEditor/line-active.png" v-if="mode === ModeState.StateLine">
            <img src="@/assets/audioEditor/line-normal.png" v-else>
            <div :class="$style.text">音高线模式</div>
          </div>
          <div :class="$style.lineContainer" v-show="mode === ModeState.StateLine && lineOver">
            <div :class="[$style.lineLi, lineMode === StateLineMode.Free ? $style.lineActive : '']" @click="selectLineMode(StateLineMode.Free)">
              <img src="@/assets/shake/free.png" alt="">
              <span>自由绘制</span>
            </div>
            <div :class="[$style.lineLi, lineMode === StateLineMode.Shake ? $style.lineActive : '']" @click="selectLineMode(StateLineMode.Shake)">
              <img src="@/assets/shake/shake.png" alt="">
              <span>颤音绘制</span>
            </div>
          </div>

        </div>
        <div :class="[$style.check, $style.right, mode === ModeState.StateElement ? $style.isActive : '']" @click="selectMode(ModeState.StateElement)">
          <img src="@/assets/audioEditor/yinsu-active.png" v-if="mode === ModeState.StateElement">
          <img src="@/assets/audioEditor/yinsu-normal.png" v-else>
          <div :class="$style.text">音素模式</div>
        </div>
      </div>
      <div :class="$style.linefu">
        <div :class="[$style.check, typeMode === TypeModeState.StateVolume ? $style.isActive : '']" @click="selectTypeMode(TypeModeState.StateVolume)">
          <img src="@/assets/audioEditor/loud-active.png" v-if="typeMode === TypeModeState.StateVolume">
          <img src="@/assets/audioEditor/loud-normal.png" v-else>
          <div :class="$style.text">响度</div>
        </div>
        <div :class="[$style.check, $style.right, typeMode === TypeModeState.StateTension ? $style.isActive : '']" @click="selectTypeMode(TypeModeState.StateTension)">
          <img src="@/assets/audioEditor/tension-active.png" v-if="typeMode === TypeModeState.StateTension">
          <img src="@/assets/audioEditor/tension-normal.png" v-else>
          <div :class="$style.text">张力</div>
        </div>
      </div>
      <div :class="[$style.common, status === 'notPlay' ? $style.disabled : '']" @click="toPlay">
        <img src="@/assets/audioEditor/pause.png" v-if="isPlaying" :class="$style.icon"/>
        <img src="@/assets/audioEditor/play.png" v-else :class="$style.icon"/>
        <div :class="$style.text">播放控制</div>
      </div>
      <div :class="[$style.common, status === 'notPlay' || status === 'notGenerate' ? $style.disabled : '']" @click="toGenerateAudio">
        <img src="@/assets/audioEditor/export.png" :class="$style.icon"/>
        <div :class="$style.text">生成音频</div>
      </div>
      <div :class="[$style.set]">
        <div :class="[$style.common]" @click="downClient" v-if="!isInElectron">
          <img src="@/assets/audioEditor/chrome.png" :class="$style.icon"/>
          <div :class="$style.text">下载客户端</div>
        </div>
        <div :class="[$style.common]" @click="showDialog('SpeedyDialog')">
          <img src="@/assets/audioEditor/keyboard.png" :class="$style.icon"/>
          <div :class="$style.text">快捷键</div>
        </div>
        <div :class="[$style.common]" @click="toSet">
          <img src="@/assets/audioEditor/setting.png" :class="$style.icon"/>
          <div :class="$style.text">更多信息</div>
        </div>
      </div>
    </div>
    <MidiDialog ref="MidiDialog" @midi-cancel="midiCancelEvent"></MidiDialog>
    <SpeedyDialog ref="SpeedyDialog"></SpeedyDialog>
    <CommonDialog
      :show="dialogShow"
      title="导入Midi"
      tip="是否放弃未保存的改动？"
      confirmButtonText="放弃改动"
      :confirmButtonEvent="confirmEvent"
      :cancelButtonEvent="cancelEvent" />
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Button, Message, Upload } from 'element-ui'
import { PlayState, ModeState, TypeModeState, TrackMode, StateLineMode } from "@/common/utils/const"
import { isDuplicated, reportEvent, getParam, isMac, isWindows, isInElectron } from '@/common/utils/helper'
import MidiDialog from './MidiDialog.vue'
import SpeedyDialog from './SpeedyDialog.vue'
import CommonDialog from '@/views/AudioEditor/Components/CommonDialog.vue'
import { mid2json } from '@/api/audio'
import { uploadFile } from '@/common/utils/upload'
import * as waveSurfer from '@/common/utils/waveSurfer'

export default {
  name: 'BeatHeader',
  props: ['isPlaying', 'isNeedGenerate'],
  data() {
    return {
      ModeState: ModeState,
      TypeModeState: TypeModeState,
      StateLineMode: StateLineMode,
      isInElectron: isInElectron,
      clickMouseStart: false,
      file: '',
      clickType: -1,
      dialogShow: false,
      lineOver: false
    }
  },
  computed: {
    ...mapState('const', ['mode', 'lineMode', 'typeMode', 'playState', 'isExceedHeader', 'showArrange']),
    ...mapGetters('change', ['trackMode']),
    status() {
      let status = 'normal'
      const trackMode = this.trackMode
      if (trackMode === TrackMode.TrackModeNone) {
        status = 'notPlay'
      } else if (trackMode === TrackMode.TrackModeBan) {
        status = 'notGenerate'
      }
      return status
    }
  },
  components: {
    Button,
    Upload,
    MidiDialog,
    SpeedyDialog,
    CommonDialog
  },
  watch: {
  },
  destroyed() {
  },
  mounted() {
  },
  methods: {
    toPlay() {
      this.$emit('play')
    },
    clickArrange() {
      this.$store.dispatch('const/changeState', { showArrange: !this.$store.state.const.showArrange })
    },
    async mid2json(url) {
      const res = await mid2json({
        mid_url: url
      })
      console.log('mid2json:', res)
      this.$refs.MidiDialog.show(res.data.data, this.file.name)
    },
    selectMode(mode) {
      if (mode === ModeState.StatePitch) {
        reportEvent('note-button-click', 147617)
      } else {
        reportEvent('pitch-button-click', 147618)
      }
      if (this.$store.state.const.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      this.$store.dispatch('const/changeState', { mode })
    },
    selectLineMode(lineMode) {
      if (lineMode !== this.lineMode) {
        this.$store.dispatch('const/changeState', { lineMode })
      }
    },
    selectTypeMode(typeMode) {
      if (typeMode === this.typeMode && this.typeMode !== TypeModeState.StateNone) {
        this.$store.dispatch('const/changeState', { typeMode: TypeModeState.StateNone })
      } else {
        this.$store.dispatch('const/changeState', { typeMode })
      }
    },
    showLineContainer(flag) {
      clearTimeout(this.lineOverTimer)
      if (flag) {
        this.lineOver = true
      } else {
        this.lineOverTimer = setTimeout(() => {
          this.lineOver = false
        }, 400)
      }
    },
    async toGenerateAudio() {
      reportEvent('create-audio-button-click', 147619)
      const trackMode = this.trackMode
      if (trackMode === TrackMode.TrackModeNone) {
        Message.error('静音状态下不可合成')
        return
      }
      if (trackMode === TrackMode.TrackModeBan) {
        Message.error('干音在静音状态下不可合成')
        return
      }

      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      if (isDuplicated(this.$store.state.change.stagePitches)) {
        Message.error('音符存在重叠, 请调整好~')
        return
      }
      if (this.$store.state.change.stagePitches.length === 0 &&
          this.$store.state.change.f0AI.length === 0 &&
          this.$store.state.change.f0Draw.length === 0) {
        Message.error('没有音符！！')
        return
      }
      let isAddAc = 1  // 是否需要合成伴奏,0为不需要，1为需要
      if (trackMode === TrackMode.TrackModeGan || !waveSurfer.getWaveSurfer()) {
        isAddAc = 0
      }
      this.$emit('synthesize', isAddAc, () => {
        const index = getParam('index')
        this.$router.push(`/profile?index=${index}`)
      })
    },
    toSet() {
      reportEvent('more-information-button-click', 147620)
      this.$emit('openDrawer')
    },
    onMouseUp() {
      this.clickMouseStart = false
    },
    uploadChange(originalFile) {
      this.file = originalFile.raw
      const file = originalFile.raw
      const fileNameArr = file.name.split('.')
      const type = fileNameArr[fileNameArr.length - 1]
      if (type !== 'mid') {
        Message.error('只能上传mid格式的文件～')
        this.$refs['upload'].clearFiles()
        return
      }
      const size = file.size
      if (size > 2147483648) {
        Message.error('文件大小超过 2GB')
        this.$refs['upload'].clearFiles()
        return
      }
      uploadFile(file, 'analyze', (url) => {
        Message.success('解析成功～')
        this.mid2json(url)
      })
    },
    uploadQuPu(event) {
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      if (this.isNeedGenerate) {
        this.dialogShow = true
        event.stopPropagation()
      }
    },
    confirmEvent() {
      // 放弃未保存的改动，确定
      this.dialogShow = false
      document.getElementById('uploadQuPuWrap').click()
    },
    cancelEvent() {
      // 放弃未保存的改动，取消
      this.dialogShow = false
    },
    midiCancelEvent() {
      this.$refs['upload'].clearFiles()
    },
    showDialog(name, data) {
			this.$refs[name].show(data);
    },
    downClient() {
      if (isMac) {
        location.href = 'https://musicx-1253428821.file.myqcloud.com/files/盐料视频-darwin-x64-2.0.0.zip'
      }
      if (isWindows) {
        location.href = 'https://musicx-1253428821.file.myqcloud.com/files/%E7%9B%90%E6%96%99%E8%A7%86%E9%A2%91-2.0.0-win.zip'
      }
    }
  }
}
</script>

<style lang="less" module>
.wrap {
  border-top: 1px solid #282828;
}
.blank {
  width: 100%;
  height: 78px;
}
.blankTop {
  width: 100%;
  height: 237px;
}
.header {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  height: 78px;
  // overflow: hidden;
  font-size: 12px;
  background: #323232;
  z-index: 2001; // 头部控制板的层级
  img {
    width: 24px;
    height: 24px;
    margin: 2px auto;
    cursor: pointer;
    &:active {
      transform: scale(0.95);
    }
  }
  &.isFloat {
    position: fixed;
    top: 0;
  }
}

.common {
  height: 54px;
  line-height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  margin: 0 0 0 44px;
  // border: 1px solid red;
}

.left {
  margin: 0 0 0 24px;
}
.commonRight {
  margin: 0 0 0 5px;
}

.set {
  position: absolute;
  right: 24px;
  display: flex;
  align-items: center;
}

.linefu {
  display: flex;
  flex-direction: row;
  margin: 0 0 0 44px;
}

.lineWrapper {
  position: relative;
}

.lineContainer {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 96px;
  padding: 8px 0;
  background: #242424;
  box-shadow: 0 4px 10px 0 rgba(0,0,0,0.50);
  border-radius: 8px;
}

.lineLi {
  display: flex;
  padding: 0 9px;
  align-items: center;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  line-height: 36px;
  cursor: pointer;

  &.lineActive {
    background: #1A1A1A;

    &:hover {
      background: #1A1A1A;
    }

    &::after {
      content: '';
      width: 12px;
      height: 12px;
      background-image: url('~@/assets/shake/active.png');
      background-repeat: no-repeat;
      background-position: 100% 100%;
      background-size: 100%;
    }
  }

  &:hover {
    background: rgba(30,30,30,0.5);
  }

  img {
    width: 10px;
    height: 10px;
    margin: 0 5px 0 0;
  }

  span {
    margin-right: 3px;
  }
}

.check {
  width: 72px;
  height: 54px;
  border-radius: 12px 0px 0px 12px;
  background: rgba(30,30,30,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &.isActive {
    background: rgba(30,30,30,0.5);
  }
  &:active {
    background: rgba(30,30,30,0.5);
  }
  &:hover {
    background: rgba(30,30,30,0.5);
  }
}

.right {
  border-radius: 0px 12px 12px 0px;
}

.middle {
  border-radius: 0px;
}

.text {
  height: 20px;
  line-height: 20px;
}

.fileInput {
  position: absolute;
  height: 54px;
  width: 100%;
  opacity: 0;
  cursor: pointer;
}

.disabled {
  filter: grayscale(100%);
  transform: translate3d(0, 0, 0);
}

</style>
<style lang="less">
.el-upload, .el-upload--text {
  &:hover {
    color: #b8b8b8;
  }
}
.el-upload--picture-card:hover, .el-upload:focus {
  color: #b8b8b8;
}
</style>
