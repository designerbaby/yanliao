<template>
  <div :class="$style.PitchElement"
    ref="PitchElement"
    :style="{ height: `${stageHeight}px`, width: `${stageWidth}px` }">
    <template v-for="(it, index) in yinsuStagePitches">
      <div 
        :key="index"
        slot="reference" 
        :class="$style.container" 
        :data-left="it.left"
        :data-top="it.top"
        :style="{
          width: `${it.width}px`,
          height: `${it.height}px`,
          transform: `translate(${it.left}px, ${it.top}px)`
        }"
      >
        <div 
          :class="$style.fu"
          :style="{
            width: `${it.width}px`,
            transform: `translate(-10px)`
          }"
        >
          {{ it.fu }}
          <ArrowElement :pitch="it" @move-end="onArrowMoveEnd($event, index)"/>
        </div>
        <div 
          :class="$style.yuan"
          :style="{
            width: `${it.width}px`,
            height: `${it.height}px`
          }"
        >{{ it.yuan }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import ArrowElement from './ArrowElement.vue'
import { getYinsu } from '@/api/audio'

export default {
  name: 'PitchElement',
  data() {
    return {
    }
  },
  mounted() {
    // if (this.$store.state.isStagePitchElementChanged
    //   || this.$store.state.isStagePitchesChanged
    //   || this.$store.state.mode === 2) { // 元辅音变化或者音块变化或者切换模式，都要重新去获取元辅音的内容
    //     this.$store.dispatch('getPitchLine')
    // }
  },
  computed: {
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    yinsuStagePitches() {
      return this.handleSatgePitches(this.$store.state.stagePitches)
    }
  },
  mounted() {},
  methods: {
    onArrowMoveEnd({ width, left, target }, index) {
      const pitch = this.stagePitches[index]

      console.log(`onArrowMoveEnd: width: ${width}, left: ${left}, target: ${target}`)
      console.log('pitch:', pitch)
    },
    async handleSatgePitches(stagePitches) {
      let pinyin = []
      stagePitches.forEach(item => {
        pinyin.push(item.pinyin)
      })
      const res = await getYinsu({pin_yin: pinyin})
      console.log('getYinsu:', res)
      const yinsu = res.data.data.yin_su
      for (let i = 0; i < stagePitches.length; i += 1) {
        const item = stagePitches[i]
        item.fu = yinsu[item.pinyin].f
        item.yuan = yinsu[item.pinyin].y
      }
      return stagePitches
    },
  },
  components: {
    ArrowElement
  }
}
</script>

<style lang="less" module>
.PitchElement{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}

.container {
  clear: both;
  border-radius: 3px;
  font-size: 12px;
  line-height: 25px;
  padding-left: 5px;
  position: relative;
}

.fu {
  position: absolute;
  top: 0;
  left: 0;
  background: #1F9C7C;
  border-radius: 4px 0px 0px 4px;
}

.yuan {
  position: absolute;
  top: 0;
  right: 0;
  background: #016F53;
  border-radius: 0px 4px 4px 0px;
}

</style>