<template>
  <div :class="$style.header">
    <div :class="$style.common">
      <div :class="$style.but">
        <div :class="[$style.mode, mode === 0 ? $style.isActive : '']" @click="selectMode(0)">
          <Icon class="el-icon-s-operation"></Icon>
        </div>
        <div :class="[$style.mode, mode === 1 ? $style.isActive : '']" @click="selectMode(1)">
          <Icon class="el-icon-sort-up"></Icon>
        </div>
      </div>
      <div :class="$style.text">音符/音高线模式</div>
    </div>
    <div :class="$style.common" @click="toPlay">
      <div :class="$style.but">
        <img src="@/assets/icon-pause.png" :class="$style.icon" v-if="isPlaying"/>
        <img src="@/assets/icon-play.png" :class="$style.icon" v-else/>
      </div>
      <div :class="$style.text">播放控制</div>
    </div>
    <div :class="$style.common" @click="toGenerateAudio" v-if="mode === 1">
      <div :class="$style.but">
        <div :class="$style.mode">
          <Icon class="el-icon-top-right"></Icon>
        </div>
      </div>
      <div :class="$style.text">生成音频</div>
    </div>
    <!-- <div :class="$style.common" @click="toDownload" v-if="mode === 1">
      <div :class="$style.but">
        <div :class="$style.mode">
          <Icon class="el-icon-download"></Icon>
        </div>
      </div>
      <div :class="$style.text">下载音频</div>
    </div> -->
    <div :class="[$style.common, $style.set]" @click="toSet">
      <div :class="$style.but">
        <div :class="$style.mode">
          <Icon class="el-icon-s-tools"></Icon>
        </div>
      </div>
      <div :class="$style.text">更多信息</div>
    </div>
    <!-- <div :class="$style.common" @click="toClear">
      <div :class="$style.but">
        <div :class="$style.mode">
          <Icon class="el-icon-refresh-left"></Icon>
        </div>
      </div>
      <div :class="$style.text">全部清除</div>
    </div> -->

    <div :class="$style.bpm">{{bpm}} BPM</div>
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
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
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
    },
    toDownload() {
      const downUrl = this.$store.state.downUrl
      if (!downUrl) {
        Message.error('没有音频！')
        return
      }
      window.open(downUrl, '_blank')
    }
  }
}
</script>

<style lang="less" module>
.header {
  width: 100%;
  border-top: 1px solid #505050;
  position: relative;
  display: flex;
  height: 60px;
  overflow: hidden;
  font-size: 15px;
}

.common {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  margin: 0 5px;
}

.set {
  position: absolute;
  top: 0;
  right: 10px;
}

.icon {
  width: 22px;
  height: 22px;
  margin: 2px;
}
.refresh {
  display: flex;
  width: 100px;
}
.bpm {
  color: #fff;
  font-size: 13px;
  text-align: center;
  // position: absolute;
  // bottom: -30px;
  // left: 80px;
}

.but {
  display: flex;
  align-items: center;
  height: 35px;
}
.mode {
  background: #878687;
  width: 25px;
  height: 22px;
  border-radius: 3px;
  margin: 0 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  &.isActive {
    background: #00a2fb;
  }
  &:active {
    opacity: 0.8;
  }
}

.text {
  height: 20px;
  line-height: 20px;
}
</style>
