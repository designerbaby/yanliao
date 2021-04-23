<template>
  <div :class="$style.track">
    <div :class="$style.menu" v-for="(it, index) in trackList" :key="index">
      <div :class="$style.top">
        <img src="@/assets/audioEditor/track-people.png" v-if="it.type === 1">
        <img src="@/assets/audioEditor/track-music.png" v-else>
        <div :class="$style.name">{{ it.name }}</div>
        <div @click="play(index)">
          <img src="@/assets/audioEditor/track-play.png" v-if="it.play">
          <img src="@/assets/audioEditor/track-mute.png" v-else>
        </div>
      </div>
      <div :class="$style.progress">
        <div :class="$style.inner" :style="{ width: `${(it.current / it.total) * 100}%` }"></div>
        <Dragger
          :className="$style.select"
          :styles="{ left: `${(it.current / it.total) * 100}%` }"
          @on-start="onStart($event, index)"
          @on-move="onMove($event, index)"
          @on-end="onEnd"
          >
          <img src="@/assets/audioEditor/arrow-right.png">
        </Dragger>
        <div
          :class="$style.bubble"
          :style="{ left: `${(it.current / it.total) * 100}%` }"
          v-if="isChangeVolume === index"
        >{{ it.current }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Dragger from '@/views/AudioEditor/Components/Dragger.vue'

export default {
  name: 'ArrangeTrack',
  components: { Dragger },
  data() {
    return {
      isChangeVolume: -1, // 要开始修改音量了
      startVolume: null,
      endVolume: null
    }
  },
  computed: {
    trackList() {
      return this.$store.state.trackList
    }
  },
  methods: {
    onStart(event, index) {
      this.isChangeVolume = index
      this.startVolume = {
        left: this.trackList[index].current,
        x: event.clientX
      }
    },
    onMove(event, index) {
      if (this.isChangeVolume >= 0) {
        const pos = {
          x: event.clientX
        }
        const moveX = pos.x - this.startVolume.x
        if (this.startVolume.left + moveX < 0 || this.startVolume.left + moveX > 100) {
          return
        }
        this.trackList[index].current = this.startVolume.left + moveX
        if (this.trackList[index].current === 0) {
          this.trackList[index].play = false
        } else {
          this.trackList[index].play = true
        }
        if (index === 0 && this.trackList[0].audio) {
          this.trackList[0].audio.volume = this.trackList[0].current / 100
        }
        if (index === 1 && this.$store.state.wavesurfer) {
          this.$store.state.wavesurfer.setVolume(this.trackList[1].current / 100)
        }
      }
    },
    onEnd() {
      if (this.isChangeVolume >= 0) {
        this.isChangeVolume = -1
      }
    },
    play(index) {
      if (this.trackList[index].play) {
        this.trackList[index].current = 0
      } else {
        this.trackList[index].current = 100
      }
      this.trackList[index].play = !this.trackList[index].play

    }
  }
}
</script>

<style lang="less" module>

.track {
  width: 240px;
  background: #2d2d2d;
}

.menu {
  border-bottom: 1px solid #1d1d1d;
  overflow: hidden;
  height: 56.25px;
}

.top {
  display: flex;
  font-size: 12px;
  color: rgba(255,255,255,0.80);
  margin: 12px;
  // justify-content: space-around;
  align-items: center;
  height: 12px;
  img {
    width: 14px;
    height: 14px;
    margin: 0;
  }
}

.name {
  margin-left: 4px;
  display: flex;
  flex: 1;
}

.progress {
  width: 216px;
  height: 3px;
  background: #181818;
  border-radius: 1.5px;
  margin: 20px auto 0 auto;
  position: relative;
}


.inner {
  background: rgba(255,255,255,0.60);
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 1.5px;
  height: 3px;
}

.select {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #D0D0D0;
  border: 2px solid #181818;
  position: absolute;
  left: 0;
  top: -3px;
}

.bubble {
  position: absolute;
  left: 0;
  top: -41px;
  width: 44px;
  height: 30px;
  background: #181818;
  border-radius: 5px;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  color: #fff;
  transform: translateX(-50%);
  font-family: PingFangSC-Regular;
  font-weight: bolder;
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 5px 0 5px;
    border-color: #181818 transparent transparent transparent;
    border-radius: 3px;
    top: 30px;
    left: 48%;
  }
}
</style>
