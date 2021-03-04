<template>
  <div :class="$style.PitchElement"
    ref="PitchElement"
    :style="{ height: `${stageHeight}px`, width: `${stageWidth}px` }">
    <template v-for="(it, index) in stagePitches">
      <div
        :key="index"
        slot="reference"
        :class="$style.container"
      >
        <div
          :class="$style.fu"
          data-ele-type="fu"
          :style="getFuStyles(it)"
        >
          {{ it.fu }}
          <ArrowElement :pitch="it" :index="index" @move="onArrowMove($event, index)" @move-end="onArrowMoveEnd($event, index)"/>
        </div>
        <div
          :class="$style.yuan"
          data-ele-type="yuan"
          :style="getYuanStyles(it)"
        >{{ it.yuan }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import ArrowElement from './ArrowElement.vue'
import { getYinsu } from '@/api/audio'
import { Message } from 'element-ui'
import { timeToPx } from '@/common/utils/helper'
import { modeState } from '@/common/utils/const'

export default {
  name: 'PitchElement',
  data() {
    return {
    }
  },
  mounted() {
    console.log(`PitchElement mounted`)
    this.handleSatgePitches()
    if (this.$store.state.isStagePitchesChanged ||
      this.$store.state.isPitchLineChanged ||
      this.$store.state.mode === modeState.StateElement) {
        this.$store.dispatch('getPitchLine')
      }
  },
  computed: {
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    },
    stagePitches() {
      return this.$store.state.stagePitches
    }
  },
  methods: {
    getStyles(it, width, left) {
      return {
        width: `${width}px`,
        height: `${it.height}px`,
        left: `${left}px`,
        top: `${it.top}px`
      }
    },
    getFuStyles(it) {
      const { noteWidth, bpm } = this.$store.state
      const width = timeToPx(it.preTime, noteWidth, bpm)
      const left = it.left - width
      return this.getStyles(it, width, left)
    },
    getYuanStyles(it) {
      return this.getStyles(it, it.width, it.left)
    },
    onArrowMove({ preTime }, index) {
      const pitch = this.stagePitches[index]
      const it = {...pitch, preTime }
      const fuStyles = this.getFuStyles(it)
      const yuanStyles = this.getYuanStyles(it)

      const eleItem = this.$el.childNodes[index]
      const eleFu = eleItem.querySelector(`[data-ele-type="fu"]`)
      const eleYuan = eleItem.querySelector(`[data-ele-type="yuan"]`)

      Object.keys(fuStyles).forEach(k => {
        eleFu.style[k] = fuStyles[k]
      })

      Object.keys(yuanStyles).forEach(k => {
        eleYuan.style[k] = yuanStyles[k]
      })

    },
    onArrowMoveEnd({ preTime }, index) {
      console.log(`onArrowMoveEnd, preTime:${preTime}`, index)
      const pitch = this.stagePitches[index]
      pitch.preTime = preTime
      this.$store.dispatch('changeStoreState', { isStagePitchElementChanged: true })
    },
    async handleSatgePitches() {
      const stagePitches = this.$store.state.stagePitches
      if (stagePitches.length <= 0) {
        // Message.error('没有画音块，所以不去获取音符')
        return
      }
      let pinyin = []
      stagePitches.forEach(item => {
        pinyin.push(item.pinyin)
      })
      const res = await getYinsu({pin_yin: pinyin})
      const yinsu = res.data.data.yin_su
      for (let i = 0; i < stagePitches.length; i += 1) {
        const item = stagePitches[i]
        this.$set(item, 'fu', yinsu[item.pinyin].f)
        this.$set(item, 'yuan', yinsu[item.pinyin].y)
      }
    }
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
  font-size: 14px;
  line-height: 25px;
  padding-left: 5px;
  position: relative;
  color: #fff;
}

.fu {
  position: absolute;
  top: 0;
  left: 0;
  background: #1F9C7C;
  border-radius: 4px 0px 0px 4px;
  padding: 0 0 0 5px;
}

.yuan {
  position: absolute;
  top: 0;
  left: 0;
  background: #016F53;
  border-radius: 0px 4px 4px 0px;
  padding: 0 0 0 5px;
}

</style>
