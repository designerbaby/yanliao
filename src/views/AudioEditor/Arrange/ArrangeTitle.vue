<template>
  <div :class="$style.title" @click="clickArrange">
    <img src="@/assets/audioEditor/track-arrow.png" :class="[type === 'right' ? $style.isRight : '']"/>
    编曲
  </div>
</template>

<script>
export default {
  name: 'ArrangeTitle',
  props: ['type'],
  data() {
    return {}
  },
  methods: {
    clickArrange() {
      this.$store.dispatch('changeStoreState', { showArrange: !this.$store.state.showArrange })
    }
  }
}
</script>

<style lang="less" module>
.title {
  height: 32px;
  display: flex;
  align-items: center;
  width: 100%;
  img {
    width: 12px;
    height: 12px;
    margin: 0 6px 0 16px;
  }
}



.isRight {
  transform: rotate(270deg);
}
</style>
