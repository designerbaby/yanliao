<template>
  <div class="audioEditor">
    <div class="audioEditor__header">
      <div class="audioEditor__play" @click="toPlay">
        <div class="audioEditor__play--icon"></div>
        播放控制
      </div>
    </div>
    <div class="audioEditor__con">
      <div class="audioEditor__beat" @click="toShowBeat">{{beatForm.fenzi}}/{{beatForm.fenmu}}</div>
      <div class="audioEditor__left">
        <template v-for="it in pitchList">
          <div class="audioEditor__left--white" v-if="it.type === 0" :key="it.pitch">{{ it.pitch }}</div>
        </template>
      </div>
      <div class="audioEditor__middle">
        <template v-for="it in pitchList">
          <div class="audioEditor__middle--white" v-if="it.type === 0" :key="it.pitch">{{ it.pitch }}</div>
          <div class="audioEditor__middle--black" v-else :key="it.pitch">{{ it.pitch }}</div>
        </template>
      </div>
      <div class="audioEditor__right">
        <template v-for="it in pitchList">
          <div class="audioEditor__right--gray" :key="it.pitch" v-if="it.type === 0"></div>
          <div class="audioEditor__right--black" :key="it.pitch" v-else></div>
        </template>
      </div>
    </div>
    <BeatSelector ref="BeatSelector" @changeBeat="toChangeBeat"></BeatSelector>
  </div>
</template>

<script>
import { pitchList } from '@/common/utils/const'
import { Icon } from 'element-ui'
import BeatSelector from './BeatSelector.vue'

export default {
  name: 'AudioEditor',
  components: {
    Icon,
    BeatSelector
  },
  data() {
    return {
      pitchList: pitchList,
      playing: false,
      beatForm: {
        fenzi: 4,
        fenmu: 4
      }
    }
  },
  mounted() {
    const white = this.pitchList.filter((item) => item.type === 0)
    console.log('length:', white.length)
  },
  methods: {
    toPlay() {
      if (!this.playing) {
        // TODO去播放
        this.playing = true
      }
    },
    toShowBeat() {
      this.$refs.BeatSelector.showBeatDialog()
    },
    toChangeBeat(form) {
      this.beatForm = form
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
  &__con {
    border-top: 1px solid #282828;
    display: flex;
    width: 100%;
    margin: 20px 0px;
    position: relative;
  }
  &__beat {
    position: absolute;
    color: #535353;
    font-size: 13px;
    top: -20px;
    left: 15px;
  }
  &__left {
    display: flex;
    flex-direction: column;
    color: #fff;
    font-size: 8px;
    width: 50px;
    position: relative;
    float: left;
    font-size: 0;
    &--white {
      width: 50px;
      height: 42.86px;
      background: #b4b4b4;
      border: 1px solid #8b8b8b;
      border-right: #353535;
      border-bottom: #5d5e5e;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      z-index: 0;
      &:hover {
        background: rgb(4, 219, 51);
      }
      &:active {
        background: rgb(20, 155, 49);
      }
    }
  }
  &__middle {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 0;
    &--white {
      height: 25px;
      background: #fff;
      visibility: hidden;
      pointer-events: none;
    }
    &--black {
      width: 25px;
      height: 25px;
      background: #1d1d1d;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      &:hover {
        background: rgb(4, 219, 51);
      }
      &:active {
        background: rgb(20, 155, 49);
      }
    }
  }
  &__right {
    width: 1700px;
    overflow-x: scroll;
    overflow-y: hidden;
    &--gray {
      background: #2d2d2d;
      height: 25px;
    }
    &--black {
      height: 25px;
      background: #232323;
    }
  }
}
</style>