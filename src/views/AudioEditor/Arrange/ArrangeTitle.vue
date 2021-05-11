<template>
  <div :class="$style.title">
    <div :class="$style.inner" @click="clickArrange">
      <img src="@/assets/audioEditor/track-arrow.png" :class="[type === 'right' ? $style.isRight : '']"/>
      编曲
    </div>
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
      this.$store.dispatch('const/changeState', { showArrange: !this.$store.state.const.showArrange })
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
    margin: 0 0px 0 16px;
  }
}

.inner {
  display: inline-block;
}

.isRight {
  transform: rotate(270deg);
}
</style>
