<template>
  <div :class="$style.wrap">
    <div :class="$style.blank" v-if="isExceedHeader"></div>
    <div :class="[$style.header, isExceedHeader ? $style.isFloat : '']">
      <!-- <div :class="$style.common" @click="toImport">
        <img src="@/assets/audioEditor/import.png"/>
        <div :class="$style.text">导入曲谱</div>
      </div> -->
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
      <div :class="$style.common" @click="toPlay">
        <img src="@/assets/audioEditor/pause.png" v-if="isPlaying"/>
        <img src="@/assets/audioEditor/play.png" v-else/>
        <div :class="$style.text">播放控制</div>
      </div>
      <div :class="$style.common" @click="toGenerateAudio">
        <img src="@/assets/audioEditor/export.png"/>
        <div :class="$style.text">生成音频</div>
      </div>
      <div :class="[$style.common, $style.set]" @click="toSet">
        <img src="@/assets/audioEditor/setting.png"/>
        <div :class="$style.text">更多信息</div>
      </div>
    </div>
    <ImportDialog ref="ImportDialog"></ImportDialog>
  </div>

</template>

<script>
import { Icon, Button, Message } from 'element-ui'
import { playState, modeState, typeModeState } from "@/common/utils/const"
import { isDuplicated, reportEvent, getParam } from '@/common/utils/helper'
import ImportDialog from './ImportDialog'

export default {
  name: 'BeatHeader',
  props: ['isPlaying'],
  data() {
    return {
      modeState: modeState,
      typeModeState: typeModeState
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
    }
  },
  components: {
    Icon,
    Button,
    ImportDialog
  },
  methods: {
    toPlay() {
      this.$emit('play')
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
      this.$emit('synthesize', () => {
        const index = getParam('index')
        this.$router.push(`/profile?index=${index}`)
      })
    },
    toSet() {
      reportEvent('more-information-button-click', 147620)
      this.$emit('openDrawer')
    },
    toImport() {
      this.$refs.ImportDialog.show()
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
.header {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  height: 78px;
  overflow: hidden;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  background: #323232;
  z-index: 1050; // 头部控制板的层级
  img {
    width: 24px;
    height: 24px;
    margin: 2px auto;
    cursor: pointer;
    opacity: 1;
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
  opacity: 0.3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #1E1E1E;
  &.isActive {
    opacity: 1;
  }
  &:active {
    opacity: 0.8;
  }
  &:hover {
    opacity: 0.8;
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
  opacity: 1;
}
</style>
