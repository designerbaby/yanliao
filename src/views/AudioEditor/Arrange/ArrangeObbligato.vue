<template>
  <div
    ref="Obbligato"
    :class="$style.obbligato"
    id="obbligato"
    @click.right.stop.prevent.exact="onRightClickStage"
    :style="{
      width: `${$store.getters.stageWidth / 10}px`,
      height: `${$store.getters.stageHeight / 20}px`,
      top: `${$store.getters.stageHeight / 20}`
    }">
     <!-- <div id="waveform" style="width: 200px"></div> -->
    <div :class="$style.list" v-if="showList">选择伴奏文件</div>
  </div>
</template>

<script>
// import WaveSurfer from 'wavesurfer.js'
export default {
  name: 'ArrangeObbligato',
  data() {
    return {
      showList: false
    }
  },
  mounted() {
    document.getElementById('obbligato').oncontextmenu = (e) => {
      // 右键基础事件被阻止掉了
      return false
    }
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
    onRightClickStage(event) {
      const rect = this.$refs.Obbligato.getBoundingClientRect()
      const pos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.showList = true
      console.log('onRightClickStage:', pos)
    }
  }
}
</script>

<style lang="less" module>
.obbligato {
  position: absolute;
  left: 0;
  top: 56.25px;
}
</style>
