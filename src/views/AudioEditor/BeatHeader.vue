<template>
  <div :class="$style.header">
    <div :class="$style.common">
      <div :class="$style.but">
        <div :class="[$style.mode, select === 0 ? $style.isActive : '']" @click="selectMode(0)">
          <Icon class="el-icon-s-operation"></Icon>
        </div>
        <div :class="[$style.mode, select === 1 ? $style.isActive : '']" @click="selectMode(1)">
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
    <div :class="$style.common" @click="toGenerateAudio">
      <div :class="$style.but">
        <div :class="$style.mode">
          <Icon class="el-icon-top-right"></Icon>
        </div>
      </div>
      <div :class="$style.text">生成音频</div>
    </div>
    <div :class="$style.common" @click="toClear">
      <div :class="$style.but">
        <div :class="$style.mode">
          <Icon class="el-icon-refresh-left"></Icon>
        </div>
      </div>
      <div :class="$style.text">全部清除</div>
    </div>
    <div :class="$style.bpm">{{bpm}} BPM</div>
  </div>
</template>

<script>
import { Icon, Button, Message } from 'element-ui'

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
    select() {
      return this.$store.state.mode
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
      this.$store.dispatch('changeStoreState', { mode: mode })
    },
    toGenerateAudio() {
      // TODO
      Message.error('这里需要根据音高线去生成新的音频，暂时没做，先放着。')
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
  position: absolute;
  top: 10px;
  right: 10px;
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
  // border: 1px solid red;
  line-height: 20px;
}
</style>
