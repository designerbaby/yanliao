<template>
  <div :class="$style.wrap">
    <div :class="$style.note" :style="style">
      <div :class="$style.matter"
        v-for="n in $store.state.matter"
        :key="n"
        :style="{ width: `${$store.getters.beatWidth / 10}px`}"
        @click="changeArrangeLine"
        >
        {{ n }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ArrangeBar',
  computed: {
    style() {
      return {
        width: `${this.$store.getters.stageWidth / 10}px`,
        left: `${-this.$store.state.arrangeStage.scrollLeft}px`
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    changeArrangeLine(event) {
      const stage = document.querySelector('#arrageStage')
      const rect = stage.getBoundingClientRect()
      const left = event.clientX - rect.left
      const lineLeft = left * 10
      // TODO 这里的修改下面主筐的位置，不太准确
      const { width, scrollLeft } = this.$store.state.stage
      const max = scrollLeft + width
      const stageRightArea = document.getElementById('rightArea')
      if (lineLeft > max) {
        stageRightArea.scrollLeft = max
      } else if (lineLeft < scrollLeft) {
        stageRightArea.scrollLeft = lineLeft
      }

      this.$store.dispatch('changeStoreState', { lineLeft })
    }
  }
}
</script>

<style lang="less" module>
.wrap {
  height: 15px;
  margin: 0 0 0 240px;
  color: #626262;
  position: relative;
  overflow: hidden;
}
.note {
  display: flex;
  position: absolute;
}
.matter {
  width: 72px;
  padding-left: 3px;
  border-left: 1px solid#626262;
}
</style>
