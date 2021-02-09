<template>
  <div>
    <div :class="$style.top" v-if="isExceedHeader"></div>
    <div :class="[$style.top, { [$style.fixed]: isExceedHeader }]" @click="changeLine">
      <div :class="$style.matter" v-for="n in matter" :key="n" :style="{width: `${beatWidth}px`}">{{ n }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BeatTop',
  computed: {
    isExceedHeader() {
      return this.$store.state.isExceedHeader
    },
    matter() {
      return this.$store.state.matter
    },
    beatWidth() {
      return this.$store.getters.beatWidth
    },
    stageStyle() {
      return { 
        width: `${this.$store.getters.stageWidth}px`,
        left: `${-this.$store.state.stage.scrollLeft + 50}px`
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    changeLine() {
      this.$emit('changeLine')
    }
  }
}
</script>

<style lang="less" module>
.top {
  height: 25px;
  position: relative;
  display: flex;
}
.fixed {
 position: fixed; 
 z-index: 100;
 top: 78px;
 background-color: #373736;
}
.matter {
  height: 25px;
  color: #fff;
  font-size: 13px;
  border-left: 1px solid #626263;
  text-align: left;
  position: relative;
  padding-left: 5px;
  line-height: 25px;
  flex-shrink: 0;
}

</style>
