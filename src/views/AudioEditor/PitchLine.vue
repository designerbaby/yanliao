<template>
  <div 
    :class="$style.PitchLine" 
    ref="PitchLine"
    :style="{ height: `${stageHeight}px`, width: `${stageWidth}px` }"
  >
    <svg :width="`${stageWidth}px`" :height="`${stageHeight}px`" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path :d="svgData" stroke="white" fill="transparent"/>
      <!-- <circle v-for="(it, index) in filterF0Data" :key="index" :cx="it.x" :cy="it.y" r="2" fill="red"/> -->
    </svg>
  </div>
</template>

<script>
import { getF0Data } from '@/api/audio'
import { Message } from 'element-ui'
import { pxToTime } from '@/common/utils/helper'

export default {
  name: 'PitchLine',
  data() {
    return {
      svgData: '',
      filterF0Data: []
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
      // 10是因为数据的每一项间隔10ms，音高线2个数据之间的px值
      return (10 * 8 * this.bpm * this.noteWidth) / (60 * 1000)  
    },
    pitchList() {
      const stagePitches = this.$store.state.stagePitches
      console.log('stagePitches:', stagePitches)
      const pitches = []
      stagePitches.forEach(item => {
        const duration = pxToTime(item.width, this.noteWidth, this.bpm)
        const pitch = this.firstPitch - (item.top / item.height)
        const startTime = pxToTime(item.left, this.noteWidth, this.bpm)
        const pitchItem = {
          duration: duration,
          pitch: pitch,
          singer: 'luoxiang',
          startTime: startTime,
          pinyin: 'la',
          hanzi: item.hanzi,
          tone_id: 1
        }
        pitches.push(pitchItem)
      })
      return pitches
    }
  },
  mounted() {
    this.drawPitchLine()
  },
  methods: {
    async drawPitchLine() {
      const f0Data = await this.toGetPitchLineData()
      const svgData = await this.toHandleF0Data(f0Data)
      this.svgData = svgData
    },
    async toGetPitchLineData() {
      if (this.pitchList.length <= 0) {
        Message.error('没有画音块，所以没音高线')
        return
      }
      Message.success('音高线正在生成中~') // !这里后端没有音高线的进度状态返回
      const { data } = await getF0Data({ pitchList: this.pitchList })
      console.log(`getF0Data: ${data}`)
      if (data.ret_code !== 0) {
        Message.error(`请求音高线数据错误,错误信息:${data.err_msg}`)
        return
      }

      return data.data.f0_data
    },
    toHandleF0Data (f0Data) {
      const finalData = []
      console.log('f0Data:', f0Data)
      // 将拿到的数据转成x轴和y轴
      for (let i = 0; i < f0Data.length; i += 1) {
        const item = f0Data[i]
        finalData.push({
          x: this.pitchWidth * i,
          y: parseFloat((this.firstPitch - parseFloat(item / 100)).toFixed(2)).toFixed(2) * this.noteHeight
        })
        // if (i % 10 === 0) {
        //   finalData.push({
        //     x: this.pitchWidth * i / 10,
        //     y: parseFloat((this.firstPitch - (item / 100)).toFixed(2)) * this.noteHeight
        //   })
        // }
      }
      this.filterF0Data = finalData
      console.log('finalData:', finalData)
      // 转成svg相应的数据
      let result = 'M '
      finalData.forEach(item => {
        result += `${item.x} ${item.y},` 
      })
      console.log('result:', result)
      return result
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
