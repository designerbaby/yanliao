<template>
  <div :class="$style.container">
    <div :class="[$style.top]" :style="style" @click="changeLine">
      <div :class="$style.matter" v-for="n in matter" :key="n" :style="{width: `${beatWidth}px`}">{{ n }}</div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui"
import { playState } from "@/common/utils/const"
import { pxToTime } from '@/common/utils/helper'

export default {
  name: 'BeatTop',
  computed: {
    matter() {
      return this.$store.state.matter
    },
    beatWidth() {
      return this.$store.getters.beatWidth
    },
    style() {
      return {
        left: `${-this.$store.state.stage.scrollLeft}px`
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    changeLine(event) {
      if (this.$store.state.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      // 依赖这个元素的ID
      const stage = document.querySelector('#audioStage')
      const rect = stage.getBoundingClientRect()
      const left = event.clientX - rect.left
      this.$store.dispatch("changeStoreState", { lineLeft: left })

      // 修改伴奏轨的播放进度
      if (this.$store.state.wavesurfer) {
        const wavesurferLeft = left / 10 - this.$store.state.waveformStyle.left
        let time = pxToTime(wavesurferLeft, this.$store.state.noteWidth / 10, this.$store.state.bpm) / 1000
        if (time < 0) {
          time = 0
        }
        console.log(`wavesurferLeft: ${wavesurferLeft}, time: ${time}`)
        this.$store.state.wavesurfer.setCurrentTime(time)
      }
    }
  }
}
</script>

<style lang="less" module>
.container {
  flex: 1;
  overflow: hidden;
}
.top {
  height: 25px;
  position: relative;
  display: inline-flex;
  background-color: #373736;
}
.matter {
  height: 25px;
  color: #fff;
  font-size: 13px;
  border-left: 1px solid #626263;
  text-align: left;
  position: relative;
  padding-left: 5px;
  line-height: 25px;
  flex-shrink: 0;
}
</style>
