<template>
  <div :class="$style.audioEditor" ref="audioEditor">
    <BeatHeader :isPlaying="playState == 1" @play="toPlay"></BeatHeader>
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
import { processStatus, statusMap, playState } from '@/common/utils/const'
import Bus from '@/common/utils/bus'
import { sleep } from '@/common/utils/helper'
import { PlayAudio } from '@/common/utils/player'

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
      audio: null,
      isStagePitchesChanged: false,
      linePosition: null, // 播放时，线所在的位置播放

      // 播放线
      playLine: {
        start: 0,
        end: 0,
        current: 0 // 当前的位置, px
      },
      playStartTime: 0 // 从第几秒开始播放
    }
  },
  mounted() {
    this.storeStagePitchesWatcher = this.$store.watch(
      state => state.stagePitches,
      (newValue, oldValue) => {
        console.log('watch store', oldValue, newValue)
        this.isStagePitchesChanged = true
      },
      {
        deep: true
      }
    )
  },
  destroyed() {
    this.storeStagePitchesWatcher()
  },
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
    playState() {
      return this.$store.state.playState
    },
    isManualMovedLine() { // 是否手动移动了线
      return this.$store.state.lineLeft !== this.playLine.current
    }
  },
  methods: {
    changePlayState(stateValue) {
      this.$store.dispatch('changeStoreState', { playState: stateValue })
    },
    isNeedGenerate() {
      // 舞台音块改变
      if (this.isStagePitchesChanged) {
        return true
      }

      // 线的开始位置如果比上一次播放的位置还靠前，则要重新生成
      // let { start, end } = this.getLinePosition()
      // if (start < this.playLine.start) {
      //   return true
      // }
      return false
    },
    async toPlay() {
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,请耐心等待~')
        return
      }

      console.log(`Click play button, current state: ${this.playState}`)

      // 如果当前是播放中状态，则暂时
      if (this.playState === playState.StateNone) {
        this.doPlay(true)
        this.changePlayState(playState.StatePlaying)
      } else if (this.playState === playState.StatePlaying) {
        this.audio.pause()
        this.changePlayState(playState.StatePaused)
      } else if (this.playState === playState.StatePaused) {
        if (this.isNeedGenerate()) {
          this.doPlay(true)
        } else if(this.isManualMovedLine) {
          this.doPlay(false)
        } else {
          this.doPlay(false, true)
        }
        this.changePlayState(playState.StatePlaying)
      } else if (this.playState === playState.StateEnded) {
        if (this.isNeedGenerate()) {
          this.doPlay(true)
        } else if(this.isManualMovedLine) {
          this.doPlay(false)
        } else {
          this.doPlay(false)
        }
        this.changePlayState(playState.StatePlaying)
      }
      this.isStagePitchesChanged = false
    },
    async doPlay(generator = true, isContinue = false) {
      const { start, end, minStart, maxEnd, duration } = this.getLinePosition()
      console.log(`doPlay generator:${generator}, isContinue:${isContinue}, start: ${start}, end: ${end}, minStart:${minStart}, maxEnd: ${maxEnd}, duration:${duration}`)
      
      // 百分比不能为负数，最小为0
      const percent = Math.max(0, (start - minStart) / (maxEnd - minStart))
      const startTime = percent * duration / 1000
      console.log(`duration:$${duration}, startTime:$${startTime}, percent:${percent}`)
      if (generator) {
        const url = await this.toSynthesize()
        this.playLine = {
          current: start,
          start,
          end
        }
        this.playStartTime = startTime
        this.toPlayAudio(url)
        this.audio.currentTime = startTime
        this.audio.play()
      } else {
        if (isContinue) {
          console.log(`play continue with start: ${this.playStartTime}`)
          // this.audio.currentTime = this.playStartTime
          this.audio.play()
        } else {
          this.playLine = {
            current: start,
            start,
            end
          }
          // const duration = this.audio.duration
          // 百分比不能为负数，最小为0
          // const startTime = percent * duration
          // console.log(`percent:${percent}, duration:$${duration}, startTime:$${startTime}`)
          this.playStartTime = startTime
          this.audio.currentTime = startTime
          this.audio.play()
        }
        
      }
    },
    toPlayAudio(url) {
      clearInterval(this.timerId)
      const ticker = (timestamp) => {
        if (this.playState === playState.StatePlaying){
          // this.$store.dispatch('updateLineLeft', this.playLine.current)
          window.requestAnimationFrame(ticker);
        }
      }
    
      this.audio = PlayAudio({
        url,
        onPlay: (audio) => {
          this.timerId = setInterval(() => {
            if (audio.duration) {
              // 需要播放的音频长度，如果移动了线，则可能从中间位置开始播
              const duration = audio.duration // 音频总长度
              const restDuration = duration - this.playStartTime
              const msDuration = restDuration * 1000
              
              const length = this.playLine.end - this.playLine.start
              const times = msDuration / 16
              const step = length / times
              // console.log(audio, `duration`, duration, `times`, times, `step`, step)

              // console.log(`onPlay , current`, current, step)
              this.playLine.current += step
              this.$store.dispatch('updateLineLeft', this.playLine.current)
            }
          }, 16)

          window.requestAnimationFrame(ticker);
        },
        onPause: (dom) => {
          clearInterval(this.timerId)
        },
        onEnd: () => {
          clearInterval(this.timerId)
          this.changePlayState(playState.StateEnded)
          this.$store.dispatch('updateLineLeft', this.playLine.start)
          this.playLine.current = this.playLine.start
        }
      })

    },
    toGetPictData(pitches) {
      this.pitches = pitches
      this.$store.dispatch('updatePitchHasChange', true)
    },
    toHandlePitches (pitches) {
      // const lineLeft = this.$store.state.lineLeft // 根据播放线的距离去获取相应的块
      const firstPitch = this.$store.getters.firstPitch // 拿到钢琴的最高的pitch

      // console.log('lineLeft:', lineLeft)
      // let excessPitches = []
      // pitches.forEach(item => {
      //   // if (item.left >= lineLeft || (item.left + item.width) >= lineLeft) {
      //     excessPitches.push(item)
      //   // }
      // })
      // 检测是否重叠了，重叠了就标红不给合成播放
      for (let i = 0; i < pitches.length; i += 1) {
        if (pitches[i].red) {
          return
        }
      }
      const newPitches = []
      pitches.forEach(item => {
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
      let minStart = 1000000000
      let maxEnd = 0


      let firstPitchStartTime = 0
      let lastPitchStartTime = 0
      let lastPitchDuration = 0

      this.pitches.forEach(item => {
        const right = item.left + item.width
        if (item.left >= lineLeft || right >= lineLeft) {
          lineStartX = Math.min(lineStartX, item.left)
          lineEndX = Math.max(lineEndX, right)
        }

        minStart = Math.min(minStart, item.left)
        maxEnd = Math.max(maxEnd, right)

        const duration = Math.floor((60 * (parseInt(item.width) / this.noteWidth) * 1000) / (8 * this.bpm))
        const startTime = Math.floor(((item.left / this.noteWidth) * 60 * 1000) / (8 * this.bpm))

        if (startTime < firstPitchStartTime) {
          firstPitchStartTime = startTime
        }

        if (startTime > lastPitchStartTime) {
          lastPitchStartTime = startTime
          lastPitchDuration = duration
        }
        

        // console.log(`lineStartX: ${lineStartX}, lineEndX: ${lineEndX}`)
      })

      const totalDuration = lastPitchStartTime - firstPitchStartTime + lastPitchDuration
      return {
        start: lineStartX,
        end: lineEndX,
        minStart,
        maxEnd,
        duration: totalDuration 
      } 
    },
    toShowBeat() {
      this.$refs.BeatSelector.showBeatDialog()
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