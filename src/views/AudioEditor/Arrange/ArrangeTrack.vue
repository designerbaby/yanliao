<template>
  <div :class="$style.track">
    <div :class="$style.menu" v-for="(it, index) in trackList" :key="index">
      <div :class="$style.top">
        <img src="@/assets/audioEditor/track-people.png" v-if="it.type === 1">
        <img src="@/assets/audioEditor/track-music.png" v-else>
        <div :class="$style.name">{{ getName(it.type) }}</div>
        <div :class="$style.plus" v-if="it.type !== 1"
          @click.stop="showObbligato"
          @mouseover.stop="showObbligato">
          <img src="@/assets/audioEditor/track-add.png">
         <div :class="$style.list" v-if="showMenu" @click="selectObbligato">选择伴奏文件</div>
        </div>
        <div :class="$style.volume" @click="play(index)">
          <img src="@/assets/audioEditor/track-play.png" v-if="it.is_sil === 1">
          <img src="@/assets/audioEditor/track-mute.png" v-else>
        </div>
      </div>
      <div :class="$style.progress">
        <div :class="$style.inner" :style="{ width: `${(it.volume / 100) * 100}%` }"></div>
        <Dragger
          :className="$style.select"
          :styles="{ left: `${(it.volume / 100) * 100}%` }"
          @on-start="onStart($event, index)"
          @on-move="onMove($event, index)"
          @on-end="onEnd($event, index)"
          >
          <img src="@/assets/audioEditor/arrow-right.png">
        </Dragger>
        <div
          :class="$style.bubble"
          :style="{ left: `${(it.volume / 100) * 100}%` }"
          v-if="isChangeVolume === index"
        >{{ it.volume }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Dragger from '@/views/AudioEditor/Components/Dragger.vue'
import { getWaveSurfer } from '@/common/utils/waveSurfer'
import { PlayState, TrackMode } from "@/common/utils/const"
import { Message } from 'element-ui'
import ChangeTrackStatusCommand from '@/common/commands/ChangeTrackStatusCommand'
import ChangeTrackVolumeCommand from '@/common/commands/ChangeTrackVolumeCommand'

export default {
  name: 'ArrangeTrack',
  components: { Dragger },
  data() {
    return {
      isChangeVolume: -1, // 要开始修改音量了
      startVolume: null,
      endVolume: null,
      showMenu: false
    }
  },
  computed: {
    trackList() {
      return this.$store.state.change.trackList
    },
    playState() {
      return this.$store.state.const.playState
    }
  },
  mounted() {
    console.log('2222')
    document.addEventListener('click', this.documentListener)
  },
  destroyed() {
    document.removeEventListener('click', this.documentListener)
  },
  methods: {
    documentListener(event) {
      this.showMenu = false
    },
    getName(type) {
      if (type === 1) {
        return '干音音轨'
      } else {
        return '伴奏音轨'
      }
    },
    onStart(event, index) {
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.isChangeVolume = index
      const track = this.trackList[index]
      this.startVolume = {
        trackingType: track.type,
        silenceStatus: track.is_sil,
        volume: track.volume,
        x: event.clientX
      }
    },
    onMove(event, index) {
      if (this.isChangeVolume >= 0) {
        const pos = {
          x: event.clientX
        }
        const moveX = pos.x - this.startVolume.x

        const ratio = 216 / 100

        const currentVolume = Math.ceil(this.startVolume.volume + moveX / ratio)
        if (currentVolume < 0 || currentVolume > 100) {
          return
        }

        this.trackList[index].volume = currentVolume

        if (this.trackList[index].volume === 0) {
          this.trackList[index].is_sil = 2
        } else {
          this.trackList[index].is_sil = 1
        }

        const waveSurfer = getWaveSurfer()
        const trackMode = this.$store.getters['change/trackMode']
        if (index === 1 && waveSurfer && trackMode === TrackMode.TrackModeBan) {
          waveSurfer.setVolume(this.trackList[1].volume / 100)
        }
      }
    },
    onEnd(event, index) {
      if (this.isChangeVolume >= 0) {
        this.isChangeVolume = -1
        const track = this.trackList[index]

        const before = {...this.startVolume}
        const after = {
          trackingType: track.type,
          silenceStatus: track.is_sil,
          volume: track.volume,
        }
        this.$execute(new ChangeTrackVolumeCommand(this.$editor(), before, after))
      }
      this.$store.dispatch('const/changeState', { isTrackChanged: true })
    },
    play(index) {
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }

      this.$execute(new ChangeTrackStatusCommand(this.$editor(), index))
    },
    showObbligato() {
      this.showMenu = true
    },
    selectObbligato() {
      this.showMenu = false
      this.$store.state.change.stageMousePos.x = 0
      this.$emit('select')
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
  // justify-content: space-between;
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
  // display: flex;
  // flex: 1;
  text-align: left;
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
  cursor: pointer;
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

.plus {
  margin: 0 5px;
  font-size: 18px;
  font-weight: bolder;
  position: relative;
  cursor: pointer;
  img {
    width: 12px;
    height: 12px;
  }
}

.volume {
  margin-left: auto;
  line-height: 12px;
  cursor: pointer;
}

.list {
  width: 96px;
  height: 26px;
  background: #151517;
  border-radius: 4px;
  text-align: center;
  line-height: 26px;
  font-size: 12px;
  color: #fff;
  position: absolute;
  top: 17px;
  left: 10px;
  cursor: pointer;
  z-index: 10;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.8;
  }
}
</style>
