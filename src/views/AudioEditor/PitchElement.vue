<template>
  <div :class="$style.PitchElement"
    ref="PitchElement"
    :style="{ height: `${stageHeight}px`, width: `${stageWidth}px` }">
    <template v-for="(it, index) in stagePitches">
      <div
        :class="$style.ele"
        :style="{
          width: `${it.width}px`,
          height: `${it.height}px`,
          transform: `translate(${it.left}px, ${it.top}px)`
        }"
        :key="index"
        :data-left="it.left"
        :data-top="it.top"
        slot="reference"
      >
        <div :class="$style.fu">fu
          <Arrow direction="left" :pitch="it" @move-end="onArrowMoveEnd($event, index)"/>
        </div>
        <div :class="$style.yuan">yuan</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PitchElement',
  data() {
    return {
    }
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
  mounted() {},
  methods: {
    onArrowMoveEnd() {
      
    }
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

.ele {
  width: 0;
  height: 0;
  background: #016F53;
  border-radius: 3px;
  left: 0;
  top: 0;
  font-size: 12px;
  line-height: 25px;
  padding-left: 5px;
}

.fu {

}

</style>
