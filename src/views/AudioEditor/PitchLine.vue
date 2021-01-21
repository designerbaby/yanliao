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
    noteWidth() {
      return this.$store.state.noteWidth
    },
    bpm() {
      return this.$store.state.bpm
    },
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    firstPitch() {
      return this.$store.getters.firstPitch
    },
    isStagePitchesChanged() {
      return this.$store.state.isStagePitchesChanged
    },
    noteHeight() {
      return this.$store.state.noteHeight
    },
    pitchWidth() {
      return this.$store.getters.pitchWidth
    },
    stagePitches() {
      return this.$store.state.stagePitches
    },
    isSynthetizing() {
      return this.$store.state.isSynthetizing
    },
    playState() {
      return this.$store.state.playState
    },
    isNeedCreatePitchLine() {
      return this.$store.state.isNeedCreatePitchLine
    },
    pitchList() {
      const stagePitches = this.stagePitches
      console.log('stagePitches:', stagePitches)
      const pitches = []
      stagePitches.forEach(item => {
        const duration = pxToTime(item.width, this.noteWidth, this.bpm)
        const pitch = this.firstPitch - (item.top / item.height)
        const startTime = pxToTime(item.left, this.noteWidth, this.bpm)
        const pitchItem = {
          duration: duration,
          pitch: pitch,
          singer: this.$store.state.toneName,
          startTime: startTime,
          pinyin: item.pinyin,
          hanzi: item.hanzi,
          tone_id: this.$store.state.toneId
        }
        pitches.push(pitchItem)
      })
      return pitches
    },
    changedIndexes() {
      return this.$store.state.f0IndexSet
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
    if (this.isNeedCreatePitchLine) { // 音块有更改才去获取新的音高线
      this.createPitchLine()
    }
  },
  methods: {
    async createPitchLine() {
      this.$store.dispatch("changeStoreState", { isNeedCreatePitchLine: false })
      const f0Data = (await this.toGetPitchLineData()) || []

      this.$store.dispatch("changeStoreState", { f0AI: f0Data })

      const draw = this.$store.state.f0Draw
      const f0Draw = [...f0Data]

      draw.forEach((v, index) => {
        if (this.changedIndexes.has(index)) {
          f0Draw[index] = v
        }
      })

      this.$store.dispatch("changeStoreState", { f0Draw })

    },
    async toGetPitchLineData() {
      if (this.pitchList.length <= 0) {
        Message.error('没有画音块，所以没音高线')
        return
      }
      for (let i = 0; i < this.stagePitches.length; i += 1) {
        if (this.stagePitches[i].red) {
          Message.error('音符存在重叠, 请调整好~')
          return
        }
      }
      // Message.success('音高线正在生成中~') // !这里后端没有音高线的进度状态返回
      const { data } = await getF0Data({ pitchList: this.pitchList })
      // console.log(`getF0Data: ${data}`)
      if (data.ret_code !== 0) {
        Message.error(`请求音高线数据错误,错误信息:${data.err_msg}`)
        return
      }

      return data.data.f0_data
    },
    toHandleF0Data (f0Data) {
      const finalData = []
      // 将拿到的数据转成x轴和y轴
      for (let i = 0; i < f0Data.length; i += 1) {
        const item = f0Data[i]
        finalData.push({
          x: this.pitchWidth * i,
          y: parseFloat((this.firstPitch - parseFloat(item / 100)).toFixed(2)).toFixed(2) * this.noteHeight + 10
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
      console.log(`onMouseDown event`, event)
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
        const y = event.clientY- rect.top

        const index = Math.round(x / this.pitchWidth)
        const data = this.$store.state.f0AI
        if (data) {
          const item = data[index]
          const value = (this.firstPitch - y / this.noteHeight) * 100
          // console.log(`changeF0`, x, index, value)
          this.$store.dispatch('changeF0', { index, value })
          this.$store.dispatch("changeStoreState", { isNeedCreatePitchLine: true })
          this.changedIndexes.add(index)

          // 补帧
          const time = Date.now() - this.lastTime
          if (time < 20) {
            const diff = index - this.lastIndex
            // 向右移动
            if (diff > 1 && diff < 10) {
              for (let i = this.lastIndex; i < index ; i+= 1) {
                // console.log(`move right changeF0 add lost data`, i, value)
                this.$store.dispatch('changeF0', { index: i, value: value })
                this.$store.dispatch("changeStoreState", { isNeedCreatePitchLine: true })
                this.changedIndexes.add(i)
              }
            } else if ( diff < 1 && diff > -10){ // 向左移动
              for (let i = index; i < this.lastIndex ; i+= 1) {
                // console.log(`move left changeF0 add lost data`, i, value)
                this.$store.dispatch('changeF0', { index: i, value: value })
                this.$store.dispatch("changeStoreState", { isNeedCreatePitchLine: true })
                this.changedIndexes.add(i)
              }
            }
          }

          this.lastIndex = index
          this.lastTime = Date.now()
        }
      }
    },
    onMouseUp() {
      console.log(`onMouseUp event`, event)
      this.mouseStart = null
    },
    onMouseLeave() {
      console.log(`onMouseLeave event`, event)
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
