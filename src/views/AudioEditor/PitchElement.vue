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
          <ArrowElement :pitch="it" :index="index" @move="onArrowMove($event, index)" @move-end="onArrowMoveEnd($event, index)" :canMove="canMove"/>
        </div>
        <div
          :class="$style.yuan"
          data-ele-type="yuan"
          :style="getYuanStyles(index)"
        >{{ it.yuan }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import ArrowElement from './ArrowElement.vue'
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
    timeToPx(time) {
      const { noteWidth, bpm } = this.$store.state
      const px = timeToPx(time, noteWidth, bpm)
      return px
    },
    getStyles(it, width, left) {
      return {
        width: `${width}px`,
        height: `${it.height}px`,
        left: `${left}px`,
        top: `${it.top}px`
      }
    },
    getFuStyles(it) {
      const width = this.timeToPx(it.preTime)
      let left = it.left - width
      if (left <= 0) { // 最小不能为0
        left = 0
      }
      return this.getStyles(it, width, left)
    },
    getYuanStyles(index) {
      const it = this.stagePitches[index]
      const next = this.stagePitches[index + 1]

      let width = it.width
      const end = it.width + it.left // The end position of current pitch

      if (next) {
        const startPxOfNext = next.left
        if (end === startPxOfNext) {
          width = width - this.timeToPx(next.preTime)
        }
      }

      // console.log(`getYuanStyles:`, it.width, width)
      return this.getStyles(it, width, it.left)
    },
    onArrowMove({ preTime }, index) {
      // console.log(`preTime: ${preTime}, startPreTime: ${startPreTime}`)
      const pitch = this.stagePitches[index]

      const it = {...pitch, preTime }
      const fuStyles = this.getFuStyles(it)
      const yuanStyles = this.getYuanStyles(index)

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
    canMove(startPreTime, newPreTime, index) {
      if (newPreTime <= 20) { // 最小只能移动到20
        return false
      }
      if (index <= 0) {
        return true
      }
      const { noteWidth, bpm } = this.$store.state
      const current = this.stagePitches[index]
      const before = this.stagePitches[index - 1]
      const beforeEnd = before.left + before.width
      const width = timeToPx(startPreTime, noteWidth, bpm)
      const left = current.left - width
      const newLeft = current.left - timeToPx(newPreTime, noteWidth, bpm)
      // console.log(`beforeEnd: ${beforeEnd}, left: ${left}, newLeft: ${newLeft}, `)
      if (beforeEnd <= left) { // 前一个和当前的有空格
        if (newLeft < beforeEnd) {
          return false
        }
      } else { // 前一个和当前的没空格
        if (newLeft < (before.left + noteWidth)) {
          return false
        }
      }
      return true
    },
    onArrowMoveEnd({ preTime }, index) {
      console.log(`onArrowMoveEnd, preTime:${preTime}`, index)
      const pitch = this.stagePitches[index]
      pitch.preTime = preTime
      this.$store.dispatch('changeStoreState', { isStagePitchElementChanged: true })
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
