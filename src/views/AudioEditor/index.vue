<template>
  <div :class="$style.audioEditor" ref="audioEditor">
    <BeatHeader 
      :isPlaying="playState == 1" 
      @play="toPlay"
      @openDrawer="toOpenDrawer"
    ></BeatHeader>
    <BeatContainer 
      ref="BeatContainer"
      @showBeat="toShowBeat" 
      @getPitches="toGetPictData"
    ></BeatContainer>
    <BeatSetting ref="BeatSetting" @buildPitchLine="buildPitchLineHandler"></BeatSetting>
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
import { sleep, pxToTime } from '@/common/utils/helper'
import { PlayAudio } from '@/common/utils/player'
import BeatSetting from './BeatSetting.vue' // 更多信息设置面板

export default {
  name: 'AudioEditor',
  components: {
    Message,
    BeatSelector,
    BeatContainer,
    BeatHeader,
    BeatSetting
  },
  data() {
    return {
      pitches: [],
      timerId: 0,
      audio: null,
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
        // console.log('watch store', oldValue, newValue)
        this.$store.dispatch('changeStoreState', { isStagePitchesChanged: true, isNeedCreatePitchLine: true })
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
    },
    isStagePitchesChanged() {
      return this.$store.state.isStagePitchesChanged
    },
    mode() {
      return this.$store.state.mode
    }
  },
  methods: {
    toOpenDrawer() {
      this.$refs.BeatSetting.showDrawer()
    },
    buildPitchLineHandler() {
      this.$refs.BeatContainer.toBuildPitchLine()
    },
    // async toGenerateAudio() {
    //   const { downUrl } = await this.toSynthesize() // 根据音高线去合成音频
    //   this.$store.dispatch('changeStoreState', { downUrl: downUrl })
    // },
    changePlayState(stateValue) {
      this.$store.dispatch('changeStoreState', { playState: stateValue })
    },
    isNeedGenerate() {
      // 舞台音块改变
      if (this.isStagePitchesChanged) {
        return true
      }
      // 音高线变化
      if (this.$store.state.isNeedCreatePitchLine) {
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
      this.$store.dispatch('changeStoreState', { isStagePitchesChanged: false, isNeedCreatePitchLine: false })
    },
    async doPlay(generator = true, isContinue = false) {
      const { start, end, minStart, maxEnd, duration } = this.getLinePosition()
      console.log(`doPlay generator:${generator}, isContinue:${isContinue}, start: ${start}, end: ${end}, minStart:${minStart}, maxEnd: ${maxEnd}, duration:${duration}`)
      
      // 百分比不能为负数，最小为0
      const percent = Math.max(0, (start - minStart) / (maxEnd - minStart))
      const startTime = percent * duration / 1000
      console.log(`duration:${duration}, startTime:${startTime}, percent:${percent}`)
      if (generator) {
        const { url } = await this.toSynthesize()
        this.playLine = {
          current: start,
          start,
          end
        }
        this.playStartTime = startTime
        this.toPlayAudio(url)
        console.log('this.audio:', this.audio)
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

              this.playLine.current += step
              this.$store.dispatch('changeStoreState', { lineLeft: this.playLine.current})
              // console.log('this.playLine.current:', this.playLine.current)
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
          this.$store.dispatch('changeStoreState', { lineLeft: this.playLine.start })
          this.playLine.current = this.playLine.start
        }
      })

    },
    toGetPictData(pitches) {
      this.pitches = pitches
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
        // const duration = Math.floor((60 * (parseInt(item.width) / this.noteWidth) * 1000) / (8 * this.bpm))
        const duration = pxToTime(item.width, this.noteWidth, this.bpm)
        const pitch = firstPitch - (item.top / item.height)
        // const startTime = Math.floor(((item.left / this.noteWidth) * 60 * 1000) / (8 * this.bpm))
        const startTime = pxToTime(item.left, this.noteWidth, this.bpm)
        const pitchItem = {
          duration: duration,
          pitch: pitch,
          singer: this.$store.state.toneName,
          startTime: startTime,
          pinyin: item.pinyin,
          hanzi: item.hanzi,
          tone_id: this.$store.state.toneId
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
      const full = this.$store.getters.pitchWidth * 50 // TODO 这里改了500个数据的话就要改动
      this.pitches.forEach(item => {
        const right = item.left + item.width
        if (item.left >= lineLeft || right >= lineLeft) {
          lineStartX = Math.min(lineStartX, item.left)
          lineEndX = Math.max(lineEndX, right)
        }
        
        minStart = Math.min(minStart, item.left)
        maxEnd = Math.max(maxEnd, right)
        // const duration = Math.floor((60 * (parseInt(item.width) / this.noteWidth) * 1000) / (8 * this.bpm))
        const duration = pxToTime(item.width, this.noteWidth, this.bpm)
        // const startTime = Math.floor(((item.left / this.noteWidth) * 60 * 1000) / (8 * this.bpm))
        const startTime = pxToTime(item.left, this.noteWidth, this.bpm)
        
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
        end: lineEndX + full, // full代表sdk补的宽度
        minStart,
        maxEnd: maxEnd + full, // full代表sdk补的宽度
        duration: totalDuration + 500 // 补了500个数据，一个数据10ms,总共5000ms
      } 
    },
    toShowBeat() {
      this.$refs.BeatSelector.showBeatDialog()
    },
    handleF0() {
      let f0ai = []
      let f0draw = []
      if (this.mode === 1) { // 音高线模式
        const f0AI= this.$store.state.f0AI
        const f0Draw = this.$store.state.f0Draw
        f0AI.forEach(item => {
          f0ai.push(parseFloat(item/ 100).toFixed(2))
        })
        f0Draw.forEach(item => {
          f0draw.push(Math.floor(item / 100))
        })
      }
      return {
        f0ai,
        f0draw
      }
    },
    async toSynthesize() {
      
      const finalPitches = await this.toHandlePitches(this.pitches)
      console.log('finalPitches:', finalPitches)
      if (finalPitches === undefined) {
        Message.error('音符存在重叠, 请调整好~')
        this.changePlayState(playState.StateNone)
        return
      }
      if (!finalPitches.length) {
        Message.error('没有音符！！')
        return
      }

      this.$store.dispatch('changeStoreState', { isSynthetizing: true })
      
      const { f0ai, f0draw } = await this.handleF0()
      const req = {
        pitchList: finalPitches,
        f0_ai: f0ai,
        f0_draw: f0draw,
        task_id: 0
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
      let downUrl = ''

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
              downUrl = resp.data.data.down_url
              Message.success('音频合成成功~')
              break
            }
        } else {
          Message.success(`算法努力合成音频中(${processStatus[data.data.status]}%)`)
        }
        await sleep(3000)
      }

      this.$store.dispatch('changeStoreState', { isSynthetizing: false })

      return {
        url,
        downUrl
      }
    }
  }
}
</script>

<style module lang="less">
.audioEditor {
  margin: 0 93px;
  background:#373736;
  color: #b8b8b8;
  position: relative;
}

.audioPlay {
  width: 0;
  height: 0;
  display: none;
}
</style>