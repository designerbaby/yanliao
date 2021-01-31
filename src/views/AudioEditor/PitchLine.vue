<template>
  <div 
    :class="$style.PitchLine" 
    ref="PitchLine"
    :style="{ height: `${stageHeight}px`, width: `${stageWidth}px`, 'z-index': `${zIndex}` }"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      version="1.1" 
      ref="svgStage" 
      :width="`${stageWidth}px`" 
      :height="`${stageHeight}px`" 
      @mousedown.stop="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup.stop="onMouseUp"
      @mouseleave="onMouseUp"
      >
     <g>
      <path :d="svgData" stroke="white" fill="transparent" stroke-dasharray="5,5"/>
      <path :d="svgDataDraw" stroke="white" fill="transparent" stroke-linejoin="round" />
     </g>
    </svg>
  </div>
</template>

<script>
import { getF0Data } from '@/api/audio'
import { Message } from 'element-ui'
import { pxToTime } from '@/common/utils/helper'
import { playState } from "@/common/utils/const"
// import { drawSvgPath } from '@/common/utils/draw'

export default {
  name: 'PitchLine',
  data() {
    return {
      mouseStart: null,
      lastIndex: 0,
      lastValue: 0,
      lastTime: 0,
      lastX: 0,
      lastY: 0,
      zIndex: 999,
      cache: new Map()
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
    || this.$store.state.isStagePitchesChanged || this.$store.state.mode === 1) { // 音高线有更改才去获取新的音高线
      this.$store.dispatch('getPitchLine')
    }
  },
  methods: {
    toHandleF0Data (f0Data) {
      let result = 'M '
      // const points = []
      // 将拿到的数据转成x轴和y轴
      for (let i = 0; i < f0Data.length; i += 1) {
        const item = f0Data[i]
        const x = this.pitchWidth * i
        const y = parseFloat((this.firstPitch - parseFloat(item / 100)).toFixed(2)).toFixed(2) * this.noteHeight + 12.5

        // points.push([x, y])
        if (i == 1) {
          // result += "L "
        }

        if ((i + 1) % 3 ==0) {
          result += "C "
        }
        result += `${x},${y} `
      } 
      return result

      // return drawSvgPath(points)
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
      this.zIndex = 1001 // 把层级设得比播放线的高
      const rect = this.$refs.svgStage.getBoundingClientRect()
      this.mouseStart = {
        rect
      }

      const update = () => {
        if (this.mouseStart) {
          requestAnimationFrame(update)
        }
        if (this.cache.size > 0) {
          const values = this.cache.entries()
          // console.log(`update values:`, values)
          for(const [k, v] of values) {
            this.$store.dispatch('changeF0', { index: k, value: v })
          }
          this.cache.clear()
        }
      }
      update()
    },
    onMouseMove(event) {
      if (this.mouseStart) {

        const { rect } = this.mouseStart
        const x = event.clientX - rect.left
        const y = event.clientY- rect.top - 13

        this.changeF0Value(x, y)

        // const index = Math.round(x / this.pitchWidth)
        // const data = this.$store.state.f0AI
        // if (data) {
          // const item = data[index]
          // const value = (this.firstPitch - y / this.noteHeight) * 100
          // this.$store.dispatch('changeF0', { index, value })

          // 补帧
          // const time = Date.now() - this.lastTime
          // console.log(`time`, time, x)
          // if (time < 20) {
          //   const diff = index - this.lastIndex
          //   // 向右移动
          //   if (diff > 1) {
          //     for (let i = this.lastIndex; i < index ; i+= 1) {
          //       this.$store.dispatch('changeF0', { index: i, value: value })
          //     }
          //   } else if ( diff < -1){ // 向左移动
          //     for (let i = index; i < this.lastIndex ; i+= 1) {
          //       this.$store.dispatch('changeF0', { index: i, value: value })
          //     }
          //   }
          // }
        // }

        if (this.lastTime) {
          this.patchValue(this.lastX, this.lastY, x, y)
        }


        this.lastTime = Date.now()
        this.lastX = x
        this.lastY = y
      }
    },
    onMouseUp() {
      // console.log(`onMouseUp event`, event)
      this.mouseStart = null
      this.zIndex = 999 // 把层级设得比播放线的低
      this.lastX = 0
      this.lastY = 0
      this.lastTime = 0
    },
    onMouseLeave() {
      // console.log(`onMouseLeave event`, event)
      // this.mouseStart = null
    },
    changeF0Value(x, y) {
      const index = Math.round(x / this.pitchWidth)
      const data = this.$store.state.f0AI
      if (data) {
        const item = data[index]
        const value = (this.firstPitch - y / this.noteHeight) * 100
        // this.$store.dispatch('changeF0', { index, value })

        this.cache.set(index, value)
      }
    },
    patchValue(startX, startY, endX, endY) {
      const dx = endX - startX
      const dy = endY - startY
      const step = dy / Math.abs(dx)
      if (dx > 1) {
        // console.log(`patchValue dx>1:`, startX, startY, endX, endY, `dx:${dx},dy:${dy},step:${step}`)
        for (let i = startX; i < endX ; i+= 1) {
          this.changeF0Value(i, startY + step)
        }
      } else if( dx < -1) {
        // console.log(`patchValue dx<-1:`, startX, startY, endX, endY, step, `dx:${dx},dy:${dy}`)
        for (let i = endX; i < startX ; i+= 1) {
          this.changeF0Value(i, startY + step)
        }
      }
    }
  }
}
</script>

<style lang="less" module>
.PitchLine{
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 999; // 音高线的层级
  background: transparent;
}
</style>
