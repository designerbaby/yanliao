<template>
  <div :class="$style.arrange">
    <!-- <div id="waveform" style="width: 200px"></div> -->
  </div>
</template>

<script>
// import WaveSurfer from 'wavesurfer.js'
export default {
  name: 'Arrange',
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
    }
  }
}
</script>

<style lang="less" module>
.arrange{
}
</style>
