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
        <div id="uploadQupuWrap">
          <div :class="$style.common" @click="uploadQupu">
            <img src="@/assets/audioEditor/import.png"/>
            <div :class="$style.text">导入曲谱</div>
          </div>
        </div>
      </Upload>
      <div :class="$style.common" @click="clickArrange">
        <img src="@/assets/audioEditor/track-arrange.png" v-if="$store.state.showArrange">
        <img src="@/assets/audioEditor/track-normal.png" v-else>
        <div :class="$style.text">编曲</div>
      </div>
      <div :class="$style.linefu">
        <div :class="[$style.check, mode === modeState.StatePitch ? $style.isActive : '']" @click="selectMode(modeState.StatePitch)">
          <img src="@/assets/audioEditor/note-active.png" v-if="mode === modeState.StatePitch">
          <img src="@/assets/audioEditor/note-normal.png" v-else>
          <div :class="$style.text">音符模式</div>
        </div>
        <div :class="[$style.check, $style.middle, mode === modeState.StateLine ? $style.isActive : '']" @click="selectMode(modeState.StateLine)">
          <img src="@/assets/audioEditor/line-active.png" v-if="mode === modeState.StateLine">
          <img src="@/assets/audioEditor/line-normal.png" v-else>
          <div :class="$style.text">音高线模式</div>
        </div>
        <div :class="[$style.check, $style.right, mode === modeState.StateElement ? $style.isActive : '']" @click="selectMode(modeState.StateElement)">
          <img src="@/assets/audioEditor/yinsu-active.png" v-if="mode === modeState.StateElement">
          <img src="@/assets/audioEditor/yinsu-normal.png" v-else>
          <div :class="$style.text">音素模式</div>
        </div>
      </div>
      <div :class="$style.linefu">
        <div :class="[$style.check, typeMode === typeModeState.StateVolume ? $style.isActive : '']" @click="selectTypeMode(typeModeState.StateVolume)">
          <img src="@/assets/audioEditor/loud-active.png" v-if="typeMode === typeModeState.StateVolume">
          <img src="@/assets/audioEditor/loud-normal.png" v-else>
          <div :class="$style.text">响度</div>
        </div>
        <div :class="[$style.check, $style.right, typeMode === typeModeState.StateTension ? $style.isActive : '']" @click="selectTypeMode(typeModeState.StateTension)">
          <img src="@/assets/audioEditor/tension-active.png" v-if="typeMode === typeModeState.StateTension">
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
      <div :class="$style.linefu">
        <div :class="[$style.check, $style.isActive]"
          @mousedown="toScroll(0)"
          @mousemove="onMouseUp"
          @mouseup="onMouseUp"
        >
          <img src="@/assets/audioEditor/left.png">
          <div :class="$style.text">左滑</div>
        </div>
        <div :class="[$style.check, $style.right, $style.isActive]"
          @mousedown="toScroll(1)"
          @mousemove="onMouseUp"
          @mouseup="onMouseUp"
        >
          <img src="@/assets/audioEditor/right.png">
          <div :class="$style.text">右滑</div>
        </div>
      </div>
      <div :class="[$style.common, $style.set]" @click="toSet">
        <img src="@/assets/audioEditor/setting.png" :class="$style.icon"/>
        <div :class="$style.text">更多信息</div>
      </div>
    </div>
    <MidiDialog ref="MidiDialog" @midi-cancel="midiCancelEvent"></MidiDialog>
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
import { Button, Message, Upload } from 'element-ui'
import { playState, modeState, typeModeState } from "@/common/utils/const"
import { isDuplicated, reportEvent, getParam } from '@/common/utils/helper'
import MidiDialog from './MidiDialog.vue'
import CommonDialog from '@/views/AudioEditor/Components/CommonDialog.vue'
import { mid2json } from '@/api/audio'
import { uploadFile } from '@/common/utils/upload'

export default {
  name: 'BeatHeader',
  props: ['isPlaying', 'isNeedGenerate'],
  data() {
    return {
      modeState: modeState,
      typeModeState: typeModeState,
      clickMouseStart: false,
      timer: null,
      file: '',
      clickType: -1,
      dialogShow: false
    }
  },
  computed: {
    mode() {
      return this.$store.state.mode
    },
    typeMode() {
      return this.$store.state.typeMode
    },
    playState() {
      return this.$store.state.playState
    },
    isExceedHeader() {
      return this.$store.state.isExceedHeader
    },
    showArrange() {
      return this.$store.state.showArrange
    },
    status() {
      let status = 'normal'
      const trackList = this.$store.state.trackList
      if (trackList[0].is_sil === 2 && trackList[1].is_sil === 2) {
        status = 'notPlay'
      } else if (trackList[0].is_sil === 2 && trackList[1].is_sil === 1) {
        status = 'notGenerate'
      }
      return status
    }
  },
  components: {
    Button,
    Upload,
    MidiDialog,
    CommonDialog
  },
  watch: {
    clickMouseStart(oldValue) {
      // console.log('clickMouseStart:', oldValue)
      if (oldValue) {
        this.timer = setInterval(() => {
          if (this.clickType === 0) {
            this.$emit('toScroll', this.$store.state.stage.scrollLeft - 30)
          } else {
            this.$emit('toScroll', this.$store.state.stage.scrollLeft + 30)
          }
        }, 50)
      } else {
        clearInterval(this.timer)
      }
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  mounted() {
  },
  methods: {
    toPlay() {
      this.$emit('play')
    },
    clickArrange() {
      this.$store.dispatch('changeStoreState', { showArrange: !this.$store.state.showArrange })
    },
    async mid2json(url) {
      const res = await mid2json({
        mid_url: url
      })
      console.log('mid2json:', res)
      this.$refs.MidiDialog.show(res.data.data, this.file.name)
    },
    selectMode(mode) {
      if (mode === modeState.StatePitch) {
        reportEvent('note-button-click', 147617)
      } else {
        reportEvent('pitch-button-click', 147618)
      }
      if (this.$store.state.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      this.$store.dispatch('changeStoreState', { mode })
    },
    selectTypeMode(typeMode) {
      if (typeMode === this.typeMode && this.typeMode !== typeModeState.StateNone) {
        this.$store.dispatch('changeStoreState', { typeMode: typeModeState.StateNone })
      } else {
        this.$store.dispatch('changeStoreState', { typeMode })
      }
    },
    async toGenerateAudio() {
      reportEvent('create-audio-button-click', 147619)
      const ganIsSil = this.$store.state.trackList[0].is_sil
      const banIsSil = this.$store.state.trackList[1].is_sil
      console.log(`ganIsSil: ${ganIsSil}, banIsSil: ${banIsSil}`)
      if (ganIsSil === 2 && banIsSil === 2) {
        Message.error('静音状态下不可合成')
        return
      }
      if (ganIsSil === 2 && banIsSil === 1) {
        Message.error('干音在静音状态下不可合成')
        this.toSave()
        return
      }

      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      if (isDuplicated(this.$store.state.stagePitches)) {
        Message.error('音符存在重叠, 请调整好~')
        return
      }
      if (this.$store.state.stagePitches.length === 0 &&
          this.$store.state.f0AI.length === 0 &&
          this.$store.state.f0Draw.length === 0) {
        Message.error('没有音符！！')
        return
      }
      let isAddAc = 1  // 是否需要合成伴奏,0为不需要，1为需要
      if (ganIsSil === 1 && banIsSil === 2) {
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
    toScroll(type) {
      this.clickType = type
      this.clickMouseStart = true
      if (type === 0) {
        this.$emit('toScroll', this.$store.state.stage.scrollLeft - 30)
      } else {
        this.$emit('toScroll', this.$store.state.stage.scrollLeft + 30)
      }
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
    uploadQupu(event) {
      if (this.playState === playState.StatePlaying) {
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
      document.getElementById('uploadQupuWrap').click()
    },
    cancelEvent() {
      // 放弃未保存的改动，取消
      this.dialogShow = false
    },
    midiCancelEvent() {
      this.$refs['upload'].clearFiles()
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
  overflow: hidden;
  font-size: 12px;
  background: #323232;
  z-index: 1050; // 头部控制板的层级
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
  margin: 0 0 0 40px;
  // border: 1px solid red;
}

.commonRight {
  margin: 0 0 0 5px;
}

.set {
  position: absolute;
  right: 30px;
}

.linefu {
  display: flex;
  flex-direction: row;
  margin: 0 0 0 24px;
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
