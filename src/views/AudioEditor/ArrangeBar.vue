<template>
  <div :class="$style.note" :style="{ width: `${noteWidth}px`}">
    <div :class="$style.matter"
      v-for="n in $store.state.matter"
      :key="n"
      :style="{ width: `${beatWidth}px`}"
      @click="changeArrangeLine"
      >
      {{ n }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'ArrangeBar',
  computed: {
    beatWidth() {
      console.log('this.$store.getters.beatWidth:', this.$store.getters.beatWidth)
      return this.$store.getters.beatWidth / 10
    },
    noteWidth() {
      return this.beatWidth * this.$store.state.matter
    }
  },
  data() {
    return {}
  },
  methods: {
    changeArrangeLine() {
      console.log('changeArrangeLine')
    }
  }
}
</script>

<style lang="less" module>
.note {
  height: 15px;
  // border: 1px solid red;
  margin: 0 0 0 240px;
  display: flex;
  color: #626262;
  width: auto;
}
.matter {
  width: 72px;
  padding-left: 3px;
  border-left: 1px solid#626262;
}
</style>
