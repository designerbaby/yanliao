<template>
  <div class="audioEditor" ref="audioEditor">
    <div class="audioEditor__header">
      <div class="audioEditor__play" @click="toPlay">
        <div class="audioEditor__play--icon"></div>
        播放控制
      </div>
      <div class="audioEditor__bpm">{{bpm}} BPM</div>
    </div>
    <BeatContainer @showBeat="toShowBeat" :beatForm="beatForm"></BeatContainer>
    <BeatSelector ref="BeatSelector" @changeBeat="toChangeBeat"></BeatSelector>
  </div>
</template>

<script>
import { Icon } from 'element-ui'
import BeatSelector from './BeatSelector.vue'
import BeatContainer from './BeatContainer.vue'
import { editorSynth } from '@/api/audio'
import { pitchItem } from '@/common/utils/const'

export default {
  name: 'AudioEditor',
  components: {
    Icon,
    BeatSelector,
    BeatContainer
  },
  data() {
    const defaultForm = {
      fenzi: 4,
      fenmu: 4
    }
    return {
      beatForm: JSON.parse(sessionStorage.getItem('beatForm')) || defaultForm,
      bpm: 90
    }
  },
  methods: {
    toPlay() {
      this.toSynthesize()
    },
    toShowBeat() {
      this.$refs.BeatSelector.showBeatDialog(this.beatForm)
    },
    toChangeBeat(form) {
      this.beatForm = form
      sessionStorage.setItem('beatForm', JSON.stringify(form))
    },
    async toSynthesize () {
      const req = {
        pitch_list: this.pitchList
      }
      const res = await editorSynth()
      log('editorSynth:', res)
      if (res.code === 0) {
        Message.success('合成成功')
      } else {
        Message.error('合成失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.audioEditor {
  // width: 1072px;
  margin: 0 93px;
  background:#373736;
  overflow-x: scroll;
  &__header {
    width: 100%;
    border-top: 1px solid #505050;
    position: relative;
  }
  &__play {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #b8b8b8;
    font-size: 15px;
    margin: 10px 20px;
    &--icon {
      border-left: 10px solid #b8b8b8;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
  }
}
.audioEditor__bpm {
  color: #fff;
  font-size: 13px;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>