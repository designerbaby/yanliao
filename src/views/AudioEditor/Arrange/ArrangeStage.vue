<template>
  <div :class="$style.ArrangeStage">
    <div
      :class="$style.stage"
      id="arrageStage"
      :style="{ width: `${$store.getters['const/stageWidth'] / 10}px`, height: `${$store.getters['const/stageHeight'] / 20}px`}">
    </div>
    <template v-for="(it, index) in $store.state.change.stagePitches">
      <div
        :class="[$style.pitch, it.selected ? $style.isActive : '', it.red ? $style.isRed: '']"
        :key="index"
        :style="{
          width: `${it.width / 10}px`,
          height: `${it.height / 20}px`,
          transform: `translate(${it.left / 10}px, ${it.top / 20}px)`
        }"
      >
        <div :class="[$style.breath, it.selected ? $style.isActive : '', it.red ? $style.isRed: '']"
          v-if="it.breath"
          :style="{
            width: `${it.breath.width / 10}px`,
            height: `${it.height / 20}px`,
            left: `${(it.breath.left - it.left) / 10}px`
          }"></div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ArrangeStage',
  data() {
    return {}
  }
}
</script>

<style lang="less" module>


.stage {
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 1px solid #1d1d1d;
}

.pitch {
  background: #57673b;
  border-radius: 1.5px;
  position: absolute;
  top: 0;
  left: 0;
  &.isActive {
    background: rgb(20, 155, 49)
  }
  &.isRed {
    border: 0.5px solid red;
  }
}

.breath {
  position: absolute;
  background: #0f6d23;
  border-radius: 1.5px;
  &.isActive {
    background: #159430;
  }
  &.isRed {
    border: 0.5px solid red;
    border-right: 0;
    top: -1px;
  }
}

</style>
