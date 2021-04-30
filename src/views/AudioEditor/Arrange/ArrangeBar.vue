<template>
  <div :class="$style.wrap">
    <div :class="$style.note" :style="style">
      <div :class="$style.matter"
        v-for="n in $store.state.const.matter"
        :key="n"
        :style="{ width: `${$store.getters['const/beatWidth'] / 10}px`}"
        @click="changeArrangeLine"
        >
        {{ n }}
      </div>
    </div>
  </div>
</template>

<script>
import { pxToTime } from '@/common/utils/helper'
import { TrackMode } from '@/common/utils/const'
import * as waveSurfer from '@/common/utils/waveSurfer'
export default {
  name: 'ArrangeBar',
  computed: {
    style() {
      return {
        width: `${this.$store.getters['const/stageWidth'] / 10}px`,
        left: `${-this.$store.state.const.arrangeStage.scrollLeft}px`
      }
    },
    trackList() {
      return this.$store.state.change.trackList
    }
  },
  data() {
    return {}
  },
  methods: {
    changeArrangeLine(event) {
      const stage = document.querySelector('#arrageStage')
      const rect = stage.getBoundingClientRect()
      const left = event.clientX - rect.left
      const lineLeft = left * 10
      this.$store.dispatch('const/changeState', { lineLeft })

      // 改变音轨区播放线的位置顺便移动下面主舞台
      const { width } = this.$store.state.const.stage
      const stageRightArea = document.getElementById('rightArea')
      const scrollLeft = lineLeft - width / 2
      this.$store.state.const.stage.scrollLeft = scrollLeft
      stageRightArea.scrollLeft = scrollLeft

      // 修改伴奏轨的播放进度
      if (waveSurfer.getWaveSurfer() && this.$store.getters['change/trackMode'] === TrackMode.TrackModeBan) {
        const waveSurferLeft = left - this.trackList[1].offset
        let time = pxToTime(waveSurferLeft, this.$store.state.const.noteWidth / 10, this.$store.state.const.bpm) / 1000
        if (time < 0) {
          time = 0
        }
        console.log(`waveSurferLeft: ${waveSurferLeft}, time: ${time}`)
        waveSurfer.setCurrentTime(time)
        this.$store.dispatch('const/changeState', { wavePlayStartTime: time })
      }
    }
  }
}
</script>

<style lang="less" module>
.wrap {
  height: 15px;
  margin: 0 0 0 240px;
  color: #626262;
  position: relative;
  overflow: hidden;
}
.note {
  display: flex;
  position: absolute;
}
.matter {
  width: 72px;
  padding-left: 3px;
  border-left: 1px solid#626262;
}
</style>
