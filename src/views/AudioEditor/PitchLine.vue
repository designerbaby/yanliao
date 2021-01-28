<template>
  <div 
    :class="$style.PitchLine" 
    ref="PitchLine"
    :style="{ height: `${stageHeight}px`, width: `${stageWidth}px` }"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      version="1.1" 
      ref="svgStage" 
      :width="`${stageWidth}px`" 
      :height="`${stageHeight}px`" 
      @mousedown.stop="onMouseDown"
      @mousemove.stop="onMouseMove"
      @mouseup.stop="onMouseUp"
      @mouseleave.stop="onMouseLeave"
      >
     <g>
      <path :d="svgData" stroke="white" fill="transparent" stroke-dasharray="5,5"/>
      <path :d="svgDataDraw" stroke="white" fill="transparent"/>
     </g>
    </svg>
  </div>
</template>

<script>
import { getF0Data } from '@/api/audio'
import { Message } from 'element-ui'
import { pxToTime } from '@/common/utils/helper'
import { playState } from "@/common/utils/const"

export default {
  name: 'PitchLine',
  data() {
    return {
      mouseStart: null,
      lastIndex: 0,
      lastTime: 0
    }
  },
  computed: {
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    firstPitch() {
      return this.$store.getters.firstPitch
    },
    noteHeight() {
      return this.$store.state.noteHeight
    },
    pitchWidth() {
      return this.$store.getters.pitchWidth
    },
    isSynthetizing() {
      return this.$store.state.isSynthetizing
    },
    playState() {
      return this.$store.state.playState
    },
    svgData() {
      // console.log(`svgData`)
      return this.toHandleF0Data(this.$store.state.f0AI)
    },
    svgDataDraw() {
      return this.toHandleF0Data(this.$store.state.f0Draw)
    }
  },
  mounted() {
    if (this.$store.state.isPitchLineChanged
    || this.$store.state.isStagePitchesChanged) { // 音高线有更改才去获取新的音高线
      this.$store.dispatch('getPitchLine')
    }
  },
  methods: {
    createPitchLine () {
      this.$store.dispatch('getPitchLine')
    },
    toHandleF0Data (f0Data) {
      const finalData = []
      // 将拿到的数据转成x轴和y轴
      for (let i = 0; i < f0Data.length; i += 1) {
        const item = f0Data[i]
        finalData.push({
          x: this.pitchWidth * i,
          y: parseFloat((this.firstPitch - parseFloat(item / 100)).toFixed(2)).toFixed(2) * this.noteHeight + 12.5
        })
      } 
      let result = 'M '
      finalData.forEach(item => {
        result += `${item.x} ${item.y},` 
      })
      // console.log('result:', result)
      return result
    },
    onMouseDown(event) {
      // console.log(`onMouseDown event`, event)
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      const rect = this.$refs.svgStage.getBoundingClientRect()
      this.mouseStart = {
        rect
      }
    },
    onMouseMove(event) {
      if (this.mouseStart) {
        const { rect } = this.mouseStart
        const x = event.clientX - rect.left
        const y = event.clientY- rect.top - 13

        const index = Math.round(x / this.pitchWidth)
        const data = this.$store.state.f0AI
        if (data) {
          const item = data[index]
          const value = (this.firstPitch - y / this.noteHeight) * 100
          this.$store.dispatch('changeF0', { index, value })

          // 补帧
          const time = Date.now() - this.lastTime
          if (time < 20) {
            const diff = index - this.lastIndex
            // 向右移动
            if (diff > 1 && diff < 10) {
              for (let i = this.lastIndex; i < index ; i+= 1) {
                this.$store.dispatch('changeF0', { index: i, value: value })
              }
            } else if ( diff < 1 && diff > -10){ // 向左移动
              for (let i = index; i < this.lastIndex ; i+= 1) {
                this.$store.dispatch('changeF0', { index: i, value: value })
              }
            }
          }

          this.lastIndex = index
          this.lastTime = Date.now()
        }
      }
    },
    onMouseUp() {
      // console.log(`onMouseUp event`, event)
      this.mouseStart = null
    },
    onMouseLeave() {
      // console.log(`onMouseLeave event`, event)
      this.mouseStart = null
    }
  }
}
</script>

<style lang="less" module>
.PitchLine{
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 100;
  width: 10px;
  height: 20px;
  background: transparent;
}
</style>
