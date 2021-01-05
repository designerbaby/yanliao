<template>
  <div 
    :class="$style.PitchLine" 
    ref="PitchLine"
    :style="{ height: `${stageHeight}px`}"
  >
    <!-- <svg width="190px" height="160px" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path :d="svgData" stroke="white" fill="transparent"/>
      <circle v-for="(it, index) in filterF0Data" :key="index" :cx="it.x" :cy="it.y" r="2" fill="red"/>
    </svg> -->
  </div>
</template>

<script>
import { getF0Data } from '@/api/audio'
import { Message } from 'element-ui'
import Bus from '@/common/utils/bus'

export default {
  name: 'PitchLine',
  data() {
    return {
      f0Data: [],
      chart: {}
    }
  },
  computed: {
    noteWidth() {
      return this.$store.getters.noteWidth
    },
    bpm() {
      return this.$store.getters.bpm
    },
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    pitchWidth() {
      // 10是因为数据的每一项间隔10ms,取100是为了丢掉一些数据,然后进行转化为整数
      return (100 * 8 * this.bpm * this.noteWidth) / (60 * 1000)  
    },
    filterF0Data() {
      const finalData = []
      for (let i = 0; i < this.f0Data.length; i += 1) {
        if (i % 10 == 0) {
          const item = this.f0Data[i]
          finalData.push({
            x: this.pitchWidth * i / 10,
            y: Math.floor(item / 100)
          })
        }
      }
      return finalData
    },
    pitchList() {
      return this.$store.getters.pitchList
    },
    svgData() {
      const finalData = this.filterF0Data
      let result = 'M '
      finalData.forEach(item => {
        result += `${item.x} ${item.y},` 
      })
      return result
    }
  },
  mounted() {
    // Bus.$on('getPitchLine', this.toGetPitchLineData)
    // this.toGetPitchLineData()
  },
  methods: {
    // toInitCharts() {
    //   this.chart.setOption({
    //     title: { text: '音高线', top: 'bottom', left: 'right' },
    //     animation: true,
    //     xAxis: {
    //       min: 0,
    //       max: this.stageWidth,
    //       type: 'category'
    //     },
    //     yAxis: {
    //       min: 46,
    //       max: 81,
    //       type: 'value'
    //     },
    //     series: [
    //       {
    //         data: this.filterF0Data,
    //         type: 'line',
    //         smooth: true
    //       }
    //     ]
    //   })
    // },
    async toGetPitchLineData() {
      const pitchList = [
        {duration: 250, pitch: 81, singer: "luoxiang", startTime: 83, pinyin: "la", hanzi: "啦", tone_id: 1},
        {duration: 333, pitch: 80, singer: "luoxiang", startTime: 416, pinyin: "la", hanzi: "啦", tone_id: 1}
      ]
      const { data } = await getF0Data({ pitchList: pitchList })
      console.log(`getF0Data: ${data}`)
      if (data.ret_code === 0) {
        this.f0Data = data.data.f0_data
        // this.toInitCharts()
      } else {
        Message.error(`请求音高线数据错误,错误信息:${data.err_msg}`)
      }
    }
  }
}
</script>

<style lang="less" module>
.PitchLine{
  position: absolute;
  top: 25px;
  left: 20px;
  // z-index: 100;
  width: 1000px;
  height: 200px;
  background: transparent;
}
</style>
