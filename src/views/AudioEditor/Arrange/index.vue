<template>
  <div :class="[$style.arrange, {[$style.fixed]: isFixed}]">
    <div :class="$style.container" v-show="$store.state.const.showArrange">
      <ArrangeTitle></ArrangeTitle>
      <ArrangeBar></ArrangeBar>
      <div :class="$style.wrap">
        <ArrangeTrack @select="select"></ArrangeTrack>
        <div :class="$style.right" ref="rightArea" id="arrangeRightArea">
          <ArrangeStageBg></ArrangeStageBg>
          <div
            :class="$style.line"
            :style="{
              transform: `translateX(${$store.state.const.lineLeft / 10}px)`
            }"></div>
          <ArrangeStage></ArrangeStage>
          <ArrangeObbligato ref="ArrangeObbligato"></ArrangeObbligato>
        </div>
      </div>
    </div>
    <ArrangeTitle v-if="!$store.state.const.showArrange" :type="'right'"></ArrangeTitle>
  </div>
</template>

<script>
import ArrangeBar from './ArrangeBar.vue'
import ArrangeTitle from './ArrangeTitle.vue'
import ArrangeTrack from './ArrangeTrack.vue'
import ArrangeStage from './ArrangeStage.vue'
import ArrangeStageBg from './ArrangeStageBg.vue'
import ArrangeObbligato from './ArrangeObbligato.vue'

export default {
  name: 'Arrange',
  components: {
    ArrangeBar,
    ArrangeTitle,
    ArrangeTrack,
    ArrangeStage,
    ArrangeStageBg,
    ArrangeObbligato
  },
  computed: {
    isFixed() {
      return this.$store.state.const.isExceedHeader
    }
  },
  mounted() {
    this.$refs.rightArea.addEventListener('scroll', () => {
      this.updateStageOffset()
    })
  },
  methods: {
    updateStageOffset() {
      const scrollLeft = this.$refs.rightArea.scrollLeft
      const scrollTop = this.$refs.rightArea.scrollTop
      this.$store.dispatch('const/changeState', {
        arrangeStage: {
          ...this.$store.state.const.arrangeStage,
          scrollLeft,
          scrollTop
        }
      })
    },
    scrollTo(left) {
      this.$refs.rightArea.scrollLeft = left
    },
    select() {
      this.$refs.ArrangeObbligato.selectObbligato()
    }
  }
}
</script>

<style lang="less" module>
.arrange{
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  border-top: 1px solid #282828;
  border-bottom: 1px solid #282828;
  background: #323232;
  width: 100%;
}

.fixed {
  position: fixed;
  top: 78px;
  z-index: 2000;
  width: 100%;
}

.container {
  height: 157px;
}

.wrap {
  height: 110px;
  display: flex;
}

.right {
  position: relative;
  width: calc(100% - 240px);
  user-select: none;
  overflow-x: scroll;
  overflow-x: overlay;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent
  }
  &::-webkit-scrollbar-thumb {
    background: #1f1f1f;
    border-radius: 5px;
  }
}

.line {
  width: 2px;
  height: 100%;
  background: #cfcfcf;
  position: absolute;
  left: 0px;
  top: 0;
  z-index: 1000;
  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: -3.8px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 4.5px 0 4.5px;
    border-color: #cfcfcf transparent transparent transparent;
  }
  &:after {
    content: '';
    position: absolute;
    bottom: 0px;
    left: -3px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 4.5px 5px 4.5px;
    border-color: transparent transparent #cfcfcf transparent;
  }
}

</style>
