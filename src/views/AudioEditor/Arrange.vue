<template>
  <div :class="[$style.arrange, {[$style.fixed]: isFixed}]">
    <!-- <div id="waveform" style="width: 200px"></div> -->
    <div :class="$style.container" v-if="$store.state.showArrange">
      <div :class="$style.hide" @click="clickArrange">
        <img src="@/assets/audioEditor/track-arrow.png" style="transform: rotate(0deg);"/>
        编曲
      </div>
      <ArrangeBar></ArrangeBar>
    </div>
    <div :class="$style.hide" @click="clickArrange" v-else>
      <img src="@/assets/audioEditor/track-arrow.png"/>
      编曲
    </div>
  </div>
</template>

<script>
// import WaveSurfer from 'wavesurfer.js'
import ArrangeBar from './ArrangeBar.vue'
import { mapState } from 'vuex'

export default {
  name: 'Arrange',
  components: {
    ArrangeBar
  },
  computed: {
    ...mapState({
      isFixed: 'isExceedHeader'
    })
  },
  data() {
    return {}
  },
  methods: {
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
    clickArrange() {
      this.$store.dispatch('changeStoreState', { showArrange: !this.$store.state.showArrange })
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

.hide {
  height: 32px;
  display: flex;
  align-items: center;
  width: 100%;
  img {
    width: 12px;
    height: 12px;
    margin: 0 6px 0 16px;
    transform: rotate(270deg);
  }
}

.container {
  height: 144px;
}

</style>
