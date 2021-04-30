<template>
  <div :class="$style.beat">
    <div :class="$style.column" :style="{ width: `${$store.getters.stageWidth / 10}px`}">
      <div :class="$style.matter" v-for="n in $store.state.matter" :key="n">
        <div
          :class="$style.fenzi"
          v-for="m in $store.state.beatForm.fenzi"
          :key="m"
          :style="{ width: `${$store.getters.const.arrangeFenziWidth}px` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArrangeStageBg'
}
</script>

<style lang="less" module>
.beat {
  position: relative;
  height: 100%;
}

.column {
  height: 100%;
  display: flex;
  background: #2d2d2d;
}

.matter {
  display: flex;
  box-sizing: border-box;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: #1d1d1d;
  }
}

.fenzi {
  display: flex;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: #282828;
  }
}
</style>
