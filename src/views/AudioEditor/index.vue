<template>
  <div :class="$style.audioEditor" ref="audioEditor">
    <BeatHeader :isPlaying="state == 1" @play="toPlay"></BeatHeader>
    <BeatContainer 
      ref="BeatContainer"
      @showBeat="toShowBeat" 
      @getPitches="toGetPictData"
    ></BeatContainer>
    <BeatSelector ref="BeatSelector"></BeatSelector>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import BeatSelector from './BeatSelector.vue'
import BeatContainer from './BeatContainer.vue'
import BeatHeader from './BeatHeader.vue'
import { editorSynth, editorSynthStatus, editorSynthResult } from '@/api/audio'
import { processStatus, statusMap } from '@/common/utils/const'
import Bus from '@/common/utils/bus'
import { sleep } from '@/common/utils/helper'
import { PlayAudio } from '@/common/utils/player'

// 音频状态映射
const StateNone = 0
const StatePlaying = 1
const StatePaused = 2
const StateStopped = 3

export default {
  name: 'AudioEditor',
  components: {
    Message,
    BeatSelector,
    BeatContainer,
    BeatHeader
  },
  data() {
    return {
      pitches: [],
      timerId: 0,
      state: 0,
      onlineUrl: '',
      audio: null
    }
  },
  mounted() {},
  computed: {
    noteWidth() {
      return this.$store.state.noteWidth
    },
    bpm() {
      return this.$store.state.bpm
    },
    isSynthetizing() {
      return this.$store.state.isSynthetizing
    },
    pitchHasChange() {
      return this.$store.state.pitchHasChange
    }
  },
  methods: {
    async toPlay() {
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,请耐心等待~')
        return
      }

      if (this.state === StatePlaying) {
        this.toPauseAudio()
      } else if (this.state === StatePaused) {
        const lineLeft = this.$store.state.lineLeft
        // console.log('lineLeft:', lineLeft)
        this.state = StatePlaying
        // this.audio.currentTime = Math.floor(((lineLeft / this.noteWidth) * 60) / (8 * this.bpm))
        this.audio.play()
        // this.toPlayAudio(this.onlineUrl)
      } else {
        const { url } = await this.getAudioInfo()
        if (url) {
          this.toPlayAudio(url)
        }
      }
    },
    toPlayAudio(url) {
      console.log('toPlayAudio')
      this.state = StatePlaying

      let { start, end } = this.getLinePosition()
      if (this.$store.state.hasMoveLine) {
        start = this.$store.state.lineLeft
      }
      console.log(`getLinePosition: start`, start, `end`, end)

      const length = end - start
      let current = start

      clearInterval(this.timerId)

      const ticker = (timestamp) => {
        if (this.state === StatePlaying){
          // console.log('current:', current)
          this.$store.dispatch('updateLineLeft', current)
          window.requestAnimationFrame(ticker);
        }
      }

    
      this.audio = PlayAudio({
        url,
        // startTime: this.audioCurrentTime,
        onProgress: (time) => {
          // console.log('PlayAudio', time)
          // this.audioCurrentTime = time
          // const move = (time * 8 * this.bpm * this.noteWidth) / 60
          // const x = start + move

          // console.log(`onProgress time:${time}, left:${x}`)
          // console.log('this.audioCurrentTime:', time)
          // this.$store.dispatch('updateLineLeft', x)
        },
        onPlay: (dom) => {
          this.timerId = setInterval(() => {
            if (dom.duration) {
              const duration = dom.duration * 1000
              const times = duration / 16
              const step = length / times
              // console.log(dom, `duration`, duration, `times`, times, `step`, step)

              // console.log(`onPlay , current`, current, step)
              current += step
            }
          }, 16)

          window.requestAnimationFrame(ticker);
        },
        onPause: (dom) => {
          this.state = StatePaused
          clearInterval(this.timerId)
        },
        onEnd: () => {
          this.state = StateStopped
          clearInterval(this.timerId)
          this.$store.dispatch('updateLineLeft', start)
          this.$store.dispatch('updatePitchHasChange', false)
          this.$store.dispatch('updateLineMove', false)
        }
      })

    },
    toPauseAudio() {
      console.log('toPauseAudio')
      this.audio.pause()
      this.state = StatePaused
    },
    toGetPictData(pitches) {
      this.pitches = pitches
      this.$store.dispatch('updatePitchHasChange', true)
    },
    toHandlePitches (pitches) {
      const lineLeft = this.$store.state.lineLeft // 根据播放线的距离去获取相应的块
      const firstPitch = this.$store.getters.firstPitch // 拿到钢琴的最高的pitch

      console.log('lineLeft:', lineLeft)
      let excessPitches = []
      pitches.forEach(item => {
        if (item.left >= lineLeft || (item.left + item.width) >= lineLeft) {
          excessPitches.push(item)
        }
      })
      // 检测是否重叠了，重叠了就标红不给合成播放
      for (let i = 0; i < excessPitches.length; i += 1) {
        if (excessPitches[i].red) {
          return
        }
      }
      const newPitches = []
      excessPitches.forEach(item => {
        const duration = Math.floor((60 * (parseInt(item.width) / this.noteWidth) * 1000) / (8 * this.bpm))
        const pitch = firstPitch - (item.top / item.height)
        const startTime = Math.floor(((item.left / this.noteWidth) * 60 * 1000) / (8 * this.bpm))
        const pitchItem = {
          duration: duration,
          pitch: pitch,
          singer: 'luoxiang',
          startTime: startTime,
          pinyin: 'la',
          hanzi: item.hanzi,
          tone_id: 1
        }
        newPitches.push(pitchItem)
      })
      // console.log('newPitches:', newPitches)
      return newPitches
    },
    getLinePosition() {
      const lineLeft = this.$store.state.lineLeft // 根据播放线的距离去获取相应的块
      const excessPitches = []
      let lineStartX = 10000000
      let lineEndX = 0
      this.pitches.forEach(item => {
        const right = item.left + item.width
        if (item.left >= lineLeft || right >= lineLeft) {
          lineStartX = Math.min(lineStartX, item.left)
          lineEndX = Math.max(lineEndX, right)
        }
        // console.log(`lineStartX: ${lineStartX}, lineEndX: ${lineEndX}`)
      })
      return {
        start: lineStartX,
        end: lineEndX
      } 
    },
    toShowBeat() {
      this.$refs.BeatSelector.showBeatDialog()
    },
    async getAudioInfo() {
      let url = ''
      if (this.onlineUrl && !this.pitchHasChange) {
        url = this.onlineUrl
      } else {
        url = await this.toSynthesize()
      }
      this.onlineUrl = url
      return {
        url
      }
    },
    async toSynthesize() {
      console.log('toSynthesize')

      const finalPitches = await this.toHandlePitches(this.pitches)

      // console.log('finalPitches:', finalPitches)
      if (finalPitches === undefined) {
        Message.error('音符存在重叠, 请调整好~')
        return
      }
      if (!finalPitches.length) {
        Message.error('播放线后已经没有音符, 请画好音符再播放~')
        return
      }

      this.$store.dispatch('updateIsSynthetizing', true)
      this.$store.dispatch('updatePitchList', finalPitches)

      const req = {
        pitchList: finalPitches,
        f0: []
      }
      const { data } = await editorSynth(req)
      console.log('editorSynth:', data)
      if (data.ret_code !== 0) {
        Message.error(`合成失败, 错误信息:${data.err_msg}, 请重试~`)
        return
      } 

      const paramId = data.data.param_id
      const taskId = data.data.task_id
    
      // Message.success('开始合成音频中~')

      let url = ''

      for (let i = 0; i < 10 ;i ++) {
        const { data } = await editorSynthStatus(paramId)
        if (data.ret_code !== 0) {
          Message.error(`查询合成状态失败, 错误信息: ${data.err_msg}`)
          break
        }
        // 合成成功
        if (data.data.status === 4) {
            const resp = await editorSynthResult(taskId)
            console.log('editorSynthResult:', data)
            if (resp.data.ret_code === 0 && resp.data.data.state === 2 ) {
              url = resp.data.data.online_url
              Message.success('音频合成成功~')
              break
            }
        } else {
          Message.success(`算法努力合成音频中(${processStatus[data.data.status]}%)`)
        }
        await sleep(3000)
      }

      this.$store.dispatch('updateIsSynthetizing', false)

      return url
    }
  }
}
</script>

<style module lang="less">
.audioEditor {
  margin: 0 93px;
  background:#373736;
  color: #b8b8b8;
}

.audioPlay {
  width: 0;
  height: 0;
  display: none;
}
</style>