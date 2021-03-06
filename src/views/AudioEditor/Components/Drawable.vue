<template>
  <div
    :class="[$style.container, className]"
    :style="styles"
    @mousedown.stop="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup.stop="onMouseUp"
    @mouseleave="onMouseUp">
    <slot></slot>
  </div>
</template>

<script>
import { PlayState } from "@/common/utils/const"
import { Message } from "element-ui"

export default {
  name: 'Drawable',
  props: ['className', 'styles', 'beforeDraw', 'valueHandler'],
  data() {
    return {
      mouseStart: null,
      cache: new Map(),
      lastX: 0,
      lastY: 0,
      lastTime: 0
    }
  },
  computed: {
    playState() {
      return this.$store.state.const.playState
    },
    scale() {
      return this.$store.getters['const/scale']
    }
  },
  methods: {
    onMouseDown(event) {
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      if (this.beforeDraw && this.beforeDraw() === false){
        return
      }
      this.$emit('on-start')
      const rect = this.$el.getBoundingClientRect()
      this.mouseStart = {
        rect
      }

      const update = () => {
        if (this.mouseStart) {
          requestAnimationFrame(update)
        }
        if (this.cache.size > 0) {
          const values = this.cache.entries()
          this.$emit('on-draw', values)
          this.cache.clear()
        }
      }
      update()
    },
    onMouseMove(event) {
      if (this.mouseStart) {
        const { rect } = this.mouseStart
        const drawX = event.clientX - rect.left

        // 根据缩放比例来缩放x的位置
        const x = Math.round(drawX / this.scale)
        // console.log(`scale:${this.scale}, drawX,${drawX} -> realX:${x}`)
        
        let y = event.clientY- rect.top

        if (y < 0) { // 不要越界
          y = 0
        }

        this.changeValue(x, y)
        if (this.lastTime) {
          this.patchValue(this.lastX, this.lastY, x, y)
        }

        this.lastTime = Date.now()
        this.lastX = x
        this.lastY = y
      }
    },
    onMouseUp() {
      if (this.mouseStart) {
        this.mouseStart = null
        this.lastX = 0
        this.lastY = 0
        this.lastTime = 0

        setTimeout(() => this.$emit('on-end'), 50)
      }
    },
    changeValue(x, y) {
      if (this.valueHandler) {
        const value = this.valueHandler(x, y)
        this.cache.set(x, value)
      } else {
        this.cache.set(x, y)
      }
    },
    // 补帧
    patchValue(startX, startY, endX, endY) {
      const dx = endX - startX
      const dy = endY - startY
      const step = dy / Math.abs(dx)
      if (dx > 1) {
        for (let i = startX; i < endX ; i += 1) {
          this.changeValue(i, startY + step)
        }
      } else if(dx < -1) {
        for (let i = endX; i < startX ; i += 1) {
          this.changeValue(i, startY + step)
        }
      }
    }
  }
}
</script>

<style lang="less" module>
.container {
  position: relative;
}
</style>
