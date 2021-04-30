<template>
  <div :class="$style.container">
    <div @click="toShowBeat">
      {{ beatForm.fenzi }}/{{ beatForm.fenmu }}
    </div>
  <BeatSelector ref="BeatSelector"></BeatSelector>
</div>

</template>

<script>
import { Message } from "element-ui"
import BeatSelector from './BeatSelector.vue'
import { PlayState } from "@/common/utils/const"
export default {
  name: 'Beat',
  components: { BeatSelector },
  computed: {
    beatForm() {
      return this.$store.state.const.beatForm
    },
    isExceedHeader() {
      return this.$store.state.const.isExceedHeader
    }
  },
  data() {
    return {}
  },
  methods: {
    toShowBeat() {
      if (this.$store.state.const.isSynthetizing) {
        Message.error('正在合成音频中,不能修改哦~')
        return
      }
      if (this.$store.state.const.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.$refs.BeatSelector.showBeatDialog()
    }
  }
}
</script>

<style lang="less" module>
.container {
  color: #fff;
  font-size: 13px;
  width: 50px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  flex-shrink: 0;
  flex-grow: 0;
}
</style>
