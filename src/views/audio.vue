<template>
  <div class="audio-page">
    <div class="main">
      <div class="title">
        作品详情
      </div>
      <div class="audio-title">{{arrangeName}}</div>
      <div class="audio-create-time">创作时间：{{$moment(updateTime * 1000).format("YYYY/MM/DD  HH:mm")}}</div>
      <div v-if="audioUrl !== ''" class="player-box" @mousemove="progressMousemoveEvent" @mouseup="progressMouseupEvent" @mouseleave="progressMouseleaveEvent">
        <img v-if="audioPaused === true" class="play-button" src="@/assets/icon-play.png" alt="" @click="playButtonClick">
        <img v-if="audioPaused === false" class="play-button" src="@/assets/icon-pause.png" alt="" @click="playButtonClick">
        <div class="progress-box" @click="progressClick" >
          <div class="progress" :style="{ width: this.progresswidth, }">
            <div class="progress-button" @mousedown="progressButtonMousedownEvent" ></div>
          </div>
        </div>
        <div class="audio-duration">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
      </div>
      <audio @play="playEvent" @pause="pauseEvent" @canplay="canplay" @timeupdate="timeupdate" id="audio" :src="audioUrl" />
      <div class="strong-text text">歌曲：{{ musicName }}</div>
      <div class="strong-text text">音源：{{ toneInfos.map(item => item.display_name).join(',') }}</div>
      <div class="lyric-box">
        <div class="left strong-text text">歌词：</div>
        <div class="right">
          <div v-for="(item, index) in lyricList" :key="item.content + index" class="text">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from '@/utils'
import Header from '@/components/Header'
import {
  audioDetail,
} from '@/api/profile'

export default {
  name: 'Home',
  components: {
    Header,
  },
  data() {
    return {
      arrangeId: this.$route.params.arrangeId,
      arrangeName: '',
      audioUrl: '',
      updateTime: 0,
      toneInfos: [],
      audioPaused: true,
      duration: 0,
      currentTime: 0,
      targetTime: 0,
      audio: null,
      progresswidth: '0px',
      musicName: '',
      lyricList: [],
    }
  },
  mounted() {
    reportEvent('audiodetail-page-exposure', 'audiodetail-page-exposure', { arrangeId: this.arrangeId })
    this.initAudio()
    audioDetail(this.arrangeId).then((response) => {
      const { data } = response.data
      this.arrangeName = data.arrange_info.arrange_name
      this.updateTime = data.arrange_info.update_time
      this.audioUrl = data.arrange_info.online_url
      this.musicName = data.music_info.name
      this.toneInfos = data.arrange_info.tone_infos
      this.lyricList = data.edit_info.new_lyric_list
    })
  },
  methods: {
    formatTime(time) {
      return this.$moment(time * 1000).format('mm:ss')
    },
    initAudio() {
      this.audio = document.querySelector('#audio')
    },
    playEvent() {
      this.audioPaused = false
    },
    pauseEvent() {
      this.audioPaused = true
    },
    canplay() {
      this.duration = audio.duration
    },
    timeupdate(event) {
      if (this.openSlideMode === false) {
        const currentTime = event.target.currentTime
        this.currentTime = currentTime
        const moveX = (currentTime / this.duration) * 460
        this.progresswidth = `${moveX}px`
      }
    },
    playButtonClick() {
      const audio = this.audio
      if (this.audio.paused === true) {
        audio.play()
      } else {
        audio.pause()
      }
    },
    progressClick(event) {
      // const offsetX = event.offsetX
      // this.progresswidth = `${offsetX}px`
    },
    progressButtonMousedownEvent(event) {
      this.openSlideMode = true
    },
    progressMousemoveEvent(event) {
      const element = document.querySelector('.progress-box')
      const moveX = event.clientX - element.offsetLeft
      if (this.openSlideMode === true) {
        if (moveX >= 0 && moveX <= 460) {
          this.progresswidth = `${moveX}px`
          const currentTime = Math.floor((moveX / 460) * this.duration)
          this.currentTime = currentTime
        }
      }
    },
    progressMouseupEvent(event) {
      this.openSlideMode = false
      const target = event.target
      if (!target.classList.contains('play-button')) {
        this.audio.currentTime = this.currentTime
      }
    },
    progressMouseleaveEvent(event) {
      this.openSlideMode = false
    }
  },
}
</script>

<style lang="less" scoped>
  .audio-page {
    line-height: 1;
    width: 100vw;
    padding-bottom: 48px;
    .main {
      padding: 0 108px;
      .title {
        font-size: 30px;
        color: #000000;
      }
      .audio-title {
        font-size: 20px;
        color: #000000;
        margin: 49px 0px 14px;
      }
      .audio-create-time {
        font-size: 14px;
        color: #979797;
        margin-bottom: 22px;
      }
      .player-box {
        width: 644px;
        height: 50px;
        background-color: #ffffff;
        box-shadow: 0px 0px 20px 0px 
          rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        margin: 0 0 22px 0px;
        display: flex;
        align-items: center;
        padding: 0px 24px;
        .play-button {
          cursor: pointer;
        }
        .progress-box {
          width: 460px;
          height: 4px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          margin-left: 18px;
          .progress {
            background: #2cabff;
            width: 0px;
            height: 100%;
            position: relative;
          }
          .progress-button {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #2cabff;
            cursor: pointer;
          }
        }
      }
      .audio-duration {
        font-size: 14px;
        color: #979797;
        margin-left: 12px;
      }
      .text {
        font-family: PingFangSC-Regular sans-serif;
        font-size: 16px;
        color: #979797;
        line-height: 40px;
      }
      .strong-text {
        color: #000;
      }
      .lyric-box {
        display: flex;
      }
    }
  }
</style>
