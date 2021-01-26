<template>
  <div :class="$style.header">
    <div :class="$style.linefu">
      <div :class="[$style.check, mode === 0 ? $style.isActive : '']" @click="selectMode(0)">
        <img src="@/assets/audioEditor/note-normal.png" v-if="mode === 1">
        <img src="@/assets/audioEditor/note-active.png" v-else>
        <div :class="$style.text">音符模式</div>
      </div>
      <div :class="[$style.check, $style.right, mode === 1 ? $style.isActive : '']" @click="selectMode(1)">
        <img src="@/assets/audioEditor/line-normal.png" v-if="mode === 0">
        <img src="@/assets/audioEditor/line-active.png" v-else>
        <div :class="$style.text">音高线模式</div>
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
</template>

<script>
import { Icon, Button, Message } from 'element-ui'
import { playState } from "@/common/utils/const"

export default {
  name: 'BeatHeader',
  props: ['isPlaying'],
  data() {
    return {
    }
  },
  computed: {
    bpm() {
      return this.$store.state.bpm
    },
    mode() {
      return this.$store.state.mode
    },
    downUrl() {
      return this.$store.state.downUrl
    },
    isSynthetizing() {
      return this.$store.state.isSynthetizing
    },
    playState() {
      return this.$store.state.playState
    }
  },
  components: {
    Icon,
    Button
  },
  methods: {
    toClear() {
      location.reload()
    },
    toPlay() {
      this.$emit('play')
    },
    selectMode(mode) {
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      // if (this.playState === playState.StatePlaying) {
      //   Message.error('正在播放中, 不能修改哦~')
      //   return
      // }
      this.$store.dispatch('changeStoreState', { mode: mode })
      if (mode === 0) { // 改成音块模式，就默认设置为音块没改动
        this.$store.dispatch('changeStoreState', { isStagePitchesChanged: false })
      }
    },
    toGenerateAudio() {
      // this.$emit('generateAudio')
      this.$router.push(`/profile`)
    },
    toSet() {
      this.$emit('openDrawer')
    }
  }
}
</script>

<style lang="less" module>
.header {
  width: 100%;
  border-top: 1px solid #282828;
  position: relative;
  display: flex;
  align-items: center;
  height: 78px;
  overflow: hidden;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  img {
    width: 24px;
    height: 24px;
    margin: 2px auto;
    cursor: pointer;
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
    opacity: 0.8; 
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

.text {
  height: 20px;
  line-height: 20px;
  opacity: 1;
}
</style>
