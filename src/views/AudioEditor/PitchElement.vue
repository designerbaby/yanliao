<template>
  <div :class="$style.PitchElement"
    ref="PitchElement"
    :style="{ height: `${stageHeight}px`, width: `${stageWidth}px` }">
    这里是音素这里是音素这里是音素这里是音素这里是音素这里是音素这里是音素
  </div>
</template>

<script>
export default {
  name: 'PitchElement',
  data() {
    return {}
  },
  computed: {
    stageWidth() {
      return this.$store.getters.stageWidth
    },
    stageHeight() {
      return this.$store.getters.stageHeight
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" module>
.PitchElement{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>
