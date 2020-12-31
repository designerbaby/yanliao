<template>
  <div :class="$style.header">
    <div :class="$style.play" @click="toPlay">
      <img src="@/assets/icon-pause.png" :class="$style.icon" v-if="isPlaying"/>
      <img src="@/assets/icon-play.png" :class="$style.icon" v-else/>
      播放控制
    </div>
    <!-- <div :class="$style.refresh" @click="toClear">
      <Icon class="el-icon-refresh-left"></Icon>
      清除
    </div> -->
    <div :class="$style.bpm">{{bpm}} BPM</div>
  </div>
</template>

<script>
import { Icon } from 'element-ui'

export default {
  name: 'BeatHeader',
  props: ['isPlaying'],
  data() {
    return {}
  },
  computed: {
    bpm() {
      return this.$store.getters.bpm
    }
  },
  components: {
    Icon
  },
  methods: {
    toClear() {
      location.reload()
    },
    toPlay() {
      this.$emit('play')
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
}
.play {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 15px;
}
.icon {
  width: 22px;
  height: 22px;
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

</style>
