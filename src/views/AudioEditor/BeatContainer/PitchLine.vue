<template>
  <div
    :class="$style.PitchLine"
    ref="PitchLine"
    :style="{ height: `${stageHeight}px`, width: `${stageWidth}px`, 'z-index': `${zIndex}` }"
    id="PitchLine"
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
      <!-- <path :d="svgDataDraw" stroke="white" fill="transparent" stroke-linejoin="round"/> -->
      <path v-for="(it, index) in divideDraw" :key="index" :d="it" stroke="white" fill="transparent" stroke-linejoin="round"/>
     </g>
    </svg>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { PlayState, StateLineMode } from "@/common/utils/const"
import { divideArray } from '@/common/utils/helper'
import { PitchList } from '@/common/utils/const'
import ChangePitchLineCommand from '@/common/commands/ChangePitchLineCommand'

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
      zIndex: 998,
      cache: new Map(),
      oneDrawCache: new Map() // 一次完整的操作的cache
    }
  },
  computed: {
    ...mapState('const', ['lineMode', 'noteWidth', 'noteHeight', 'playState', 'shakeOption']),
    ...mapGetters('const', ['stageWidth', 'stageHeight', 'pitchWidth', 'scale']),
    svgData() {
      return this.handleData(this.$store.state.change.f0AI)
    },
    divideDraw() {
      return this.handleDivideDraw(this.$store.state.change.f0Draw)
    }
  },
  mounted() {
  },
  methods: {
    handleDivideDraw(data) {
      // console.time('handleDivideDraw')
      let result = []
      const pw = this.pitchWidth
      const fp = PitchList[0].pitch
      const nh = this.noteHeight
      for (let i = 0; i < data.length; i += 1) {
        const item = data[i]
        const x = Math.round(pw * i)
        const y = Number(((fp - item / 100) * nh + 12.5).toFixed(2))
        result.push({
          x,
          y
        })
      }
      // console.timeEnd('handleDivideDraw')
      // 每隔100个分段显示
      const divide = divideArray(99, result)
      let classifyDraw = []
      // console.time(`toDrawSvg`)
      for (let i = 0; i < divide.length; i += 1) {
        const item = divide[i]
        // 这里分段后，最后一个插入下一个的第一个值，这样就可以看起来连续了
        if (i < divide.length - 1) {
          item.push(divide[i + 1][0])
        }
        classifyDraw.push(this.toDrawSvg(item))
      }
      // console.timeEnd(`toDrawSvg`)
      return classifyDraw
    },
    handleData(data) {
      // console.time(`handleData`)
      let result = []
      const pw = this.pitchWidth
      const fp = PitchList[0].pitch
      const nh = this.noteHeight
      for (let i = 0; i < data.length; i += 1) {
        const item = data[i]
        const x = Math.round(pw * i)
        const y = ((fp - item / 100) * nh + 12.5).toFixed(2)
        result.push({
          x,
          y
        })
      }
      // console.timeEnd(`handleData`)
      return this.toDrawSvg(result)
    },
    toDrawSvg(arr) {
      let result = []

      let lastX = 0
      let lastY = 0
      // 这里改成数组形式是因为字符串直接拼接性能比较差，用数组最后再转字符串。
      for (let i = 0; i < arr.length; i += 1) {
        lastX = arr[i].x
        lastY = arr[i].y
        if (i === 0) {
          result.push("M ")
        }
        if ((i - 1) % 3 ==0) {
          result.push("C ")
        }
        result.push(arr[i].x)
        result.push(',')
        result.push(arr[i].y)
        result.push(' ')
      }
      // 这里主要兼容svg，如果不满3个去贝塞尔，svg会出错。
      if (arr.length > 0) {
        const mod = (arr.length - 1) % 3
        const size = mod === 0 ? 0 : 3 - mod

        for (let j = 0; j < size ; j += 1) {
          result.push(lastX)
          result.push(',')
          result.push(lastY)
          result.push(' ')
        }
      }
      return result.join('')
    },
    onMouseDown(event) {
      // console.log(`onMouseDown event`, event)
      if (this.$store.state.const.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }

      this.zIndex = 1001 // 把层级设得比播放线的高
      const rect = this.$refs.svgStage.getBoundingClientRect()
      this.mouseStart = {
        rect
      }

      // 一次独立完整的划线开始前，记录之前的状态
      this.f0DrawBefore = [...this.$store.state.change.f0Draw]
      this.changedLineMapBefore = {...this.$store.state.change.changedLineMap}
      const update = () => {
        if (this.mouseStart) {
          requestAnimationFrame(update)
        }
        if (this.cache.size > 0) {
          // const values = this.cache.entries()
          // console.log(`update values:`, values)
          // for(const [k, v] of values) {
          //   this.$store.dispatch('changeF0', { x: k, value: v })
          // }
          // this.$store.dispatch('change/changeF0', { values })

          // 每次浏览器渲染的时候更新数据
          const drawMap = new Map(this.cache)
          const {
            f0Draw,
            changedLineMap
          } = ChangePitchLineCommand.format({
            pitchWidth: this.$store.getters['const/pitchWidth'],
            f0Draw: this.$store.state.change.f0Draw,
            changedLineMap: this.$store.state.change.changedLineMap,
            drawMap,
            scale: this.scale
          })

          this.$store.commit('change/changeState', { f0Draw, changedLineMap })
          this.cache.clear()
        }
      }
      update()
    },
    onMouseMove(event) {
      if (this.mouseStart) {
        const { rect } = this.mouseStart
        const pointX = event.clientX - rect.left
        const x = Math.round(pointX / this.scale)
        // console.log(`Draw pitch line, pointX:${pointX}, realX:${x}, scale:${this.scale}`)
        const y = event.clientY - rect.top - 13
        this.changeF0Value(x, y)
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
      if (this.mouseStart) {
        this.mouseStart = null
        this.zIndex = 998 // 把层级设得比播放线的低
        this.lastX = 0
        this.lastY = 0
        this.lastTime = 0

        const drawMap = new Map(this.oneDrawCache)
        setTimeout(() => {
          this.$execute(new ChangePitchLineCommand(this.$editor(), this.f0DrawBefore, this.changedLineMapBefore, drawMap))
          this.oneDrawCache.clear()
        }, 50)
      }
    },
    changeF0Value(x, y) {
      // 这里的x是没有缩放的值
      const index = Math.round(x * this.scale / this.pitchWidth)
      const data = this.$store.state.change.f0AI
      if (data) {
        const item = data[index]
        if (item) {

          let value = (PitchList[0].pitch - y / this.noteHeight) * 100
          if (this.lineMode === StateLineMode.Shake) {
            const A = this.shakeOption.swing
            const T = this.shakeOption.cycle
            const x0 = Math.round(this.pitchWidth * index)
            value = Number((value + (A * 100) * Math.sin(x0 * 2 * Math.PI / T / this.noteWidth)).toFixed(2))
          }  

          this.cache.set(x, value)
          this.oneDrawCache.set(x, value)
        }
        // console.log('this.cache:', this.cache)
      }
    },
    // 补帧
    patchValue(startX, startY, endX, endY) {
      const dx = endX - startX
      const dy = endY - startY
      const step = dy / Math.abs(dx)
      if (dx > 1) {
        for (let i = startX; i < endX ; i+= 1) {
          this.changeF0Value(i, startY + step)
        }
      } else if( dx < -1) {
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
  z-index: 998; // 音高线的层级
  background: transparent;
}
</style>
