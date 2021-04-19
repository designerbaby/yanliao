<template>
  <div :class="[$style.arrange, {[$style.fixed]: isFixed}]">
    <!-- <div id="waveform" style="width: 200px"></div> -->
    <div :class="$style.container" v-if="$store.state.showArrange">
      <ArrangeTitle></ArrangeTitle>
      <ArrangeBar></ArrangeBar>
      <div :class="$style.wrap">
        <ArrangeTrack></ArrangeTrack>
        <div :class="$style.right" ref="rightArea">
          <ArrangeStageBg></ArrangeStageBg>
          <div
            :class="$style.line"
            :style="{
              transform: `translateX(${$store.state.lineLeft / 10}px)`
            }"></div>
          <div
            :class="$style.stage"
            id="arrageStage"
            :style="{ width: `${$store.getters.stageWidth / 10}px`, height: `${$store.getters.stageHeight / 20}px`}">
          </div>
          <template v-for="(it, index) in $store.state.stagePitches">
            <div
              :class="[$style.pitch, it.red ? $style.isRed: '']"
              :key="index"
              :style="{
                width: `${it.width / 10}px`,
                height: `${it.height / 20}px`,
                transform: `translate(${it.left / 10}px, ${it.top / 20}px)`
              }"
            ></div>
          </template>
        </div>
      </div>
    </div>
    <ArrangeTitle v-else :type="'right'"></ArrangeTitle>
  </div>
</template>

<script>
// import WaveSurfer from 'wavesurfer.js'
import ArrangeBar from './ArrangeBar.vue'
import ArrangeTitle from './ArrangeTitle.vue'
import ArrangeTrack from './ArrangeTrack.vue'
import ArrangeStageBg from './ArrangeStageBg.vue'
import { mapState } from 'vuex'

export default {
  name: 'Arrange',
  components: {
    ArrangeBar,
    ArrangeTitle,
    ArrangeTrack,
    ArrangeStageBg
  },
  computed: {
    ...mapState({
      isFixed: 'isExceedHeader'
    })
  },
  data() {
    return {
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

      this.$store.dispatch('changeStoreState', {
        arrangeStage: {
          ...this.$store.state.arrangeStage,
          scrollLeft,
          scrollTop
        }
      })
    },
    showWaveSurfer() {
        // var wavesurfer = WaveSurfer.create({
      //   container: '#waveform',
      //   waveColor: 'violet',
      //   progressColor: 'purple'
      // });
      // wavesurfer.load('https://yan-1253428821.cos.ap-guangzhou.myqcloud.com/kuwa-wav/cdb9df7547db4a278d95a792a3a6839a.wav');
      // wavesurfer.on('ready', function () {
      //   wavesurfer.play();
      // });
    },
    changeVolume(index) {
      console.log('changeVolume:', index)
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
.show {
  transform: rotate(0deg);
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
  &.isRed {
    border: 0.5px solid red;
  }
}
</style>
