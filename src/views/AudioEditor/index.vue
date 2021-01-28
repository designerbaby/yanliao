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
import { editorSynth, editorSynthStatus, editorSynthResult, editorDetail } from '@/api/audio'
import { processStatus, statusMap, playState } from '@/common/utils/const'
import { sleep, pxToTime, getParam, timeToPx, isDuplicated } from '@/common/utils/helper'
import { PlayAudio } from '@/common/utils/player'
import BeatSetting from './BeatSetting.vue'

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
  async mounted() {
    await this.getEditorDetail()
    this.storeStagePitchesWatcher = this.$store.watch(
      state => state.stagePitches,
      (newValue, oldValue) => {
        // console.log('watch store', oldValue, newValue)
        this.$store.dispatch('changeStoreState', { isStagePitchesChanged: true})
      },
      {
        deep: true
      }
    )
    // window.onbeforeunload = (event) => {
    //   console.log('onbeforeunload')

    // }
  },
  destroyed() {
    console.log('destroyed')
    this.storeStagePitchesWatcher()
    this.resetStoreState()
  },
  computed: {
    noteWidth() {
      return this.$store.state.noteWidth
    },
    noteHeight() {
      return this.$store.state.noteHeight
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
    },
    firstPitch() {
      return this.$store.getters.firstPitch
    }
  },
  methods: {
    resetStoreState() {
      this.$store.dispatch('resetState')
    },
    toOpenDrawer() {
      this.$refs.BeatSetting.handleDrawer()
    },
    buildPitchLineHandler() {
      this.$refs.BeatContainer.toBuildPitchLine()
    },
    changePlayState(stateValue) {
      this.$store.dispatch('changeStoreState', { playState: stateValue })
    },
    toShowBeat() {
      this.$refs.BeatSelector.showBeatDialog()
    },
    async getEditorDetail() {
      const taskId = getParam('taskId') || 0
      if (taskId) {
        const res = await editorDetail({ task_id: taskId })
        const data = res.data.data
        console.log('editorDetail:', data)
        const pitchList = data.pitchList
        let stagePitches = []
        pitchList.forEach(item => {
          stagePitches.push({
            hanzi: item.hanzi,
            pinyin: item.pinyin,
            red: false,
            height: this.noteHeight,
            width: timeToPx(item.duration, this.noteWidth, this.bpm),
            left: timeToPx(item.startTime, this.noteWidth, this.bpm),
            top: this.noteHeight * (this.firstPitch - item.pitch)
          })
        })
        console.log('stagePitches:', stagePitches)
        await this.$store.dispatch('changeStoreState', { 
          taskId: data.task_id, 
          downUrl: data.down_url, 
          onlineUrl: data.online_url, 
          f0AI: data.f0_ai, 
          f0Draw: data.f0_draw, 
          bpm: pitchList[0].bpm, 
          toneName: pitchList[0].singer, 
          toneId: pitchList[0].tone_id, 
          stagePitches: stagePitches 
        })

        // 比较元数据和AI数据，如果不一样表示是修改过的，下次生成新的时候不能覆盖
        for (let i = 0; i < data.f0_ai.length; i += 1) {
          if (data.f0_ai[i] !== data.f0_draw[i]) {
            // console.log(`this.$store.state`, this.$store.state)
            this.$store.state.f0IndexSet.add(i)
          }
        }
        
      }
    },
    isNeedGenerate() {
      // 舞台音块改变
      if (this.isStagePitchesChanged) {
        return true
      }
      // 音高线变化
      if (this.$store.state.isPitchLineChanged) {
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

      const finalPitches = this.$store.getters.pitchList
      console.log('finalPitches:', finalPitches)
      if (isDuplicated(this.$store.state.stagePitches)) {
        Message.error('音符存在重叠, 请调整好~')
        return
      }
      if (!finalPitches.length) {
        Message.error('没有音符！！')
        return
      }

      console.log(`Click play button, current state: ${this.playState}`)

      const taskId = getParam('taskId')
      // TODO 状态太多，后续要改成状态机
      // 如果当前是默认状态
      if (this.playState === playState.StateNone) {
        if (this.isNeedGenerate()) {
          this.doPlay(true)
        } else {
          if (taskId) { // 从编辑进来，url上有taskId
            this.toPlayAudio(this.$store.state.onlineUrl)
            this.doPlay(false)
          } else {
            this.doPlay(true)
          }
        }
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
      this.$store.dispatch('changeStoreState', { isStagePitchesChanged: false})
      this.$store.dispatch('getPitchLine')
    },
    async doPlay(generator = true, isContinue = false) {
      const { start, end, minStart, maxEnd, duration } = this.getLinePosition()
      console.log(`doPlay generator:${generator}, isContinue:${isContinue}, start: ${start}, end: ${end}, minStart:${minStart}, maxEnd: ${maxEnd}, duration:${duration}`)
      
      // 百分比不能为负数，最小为0
      const percent = Math.max(0, (start - minStart) / (maxEnd - minStart))
      const startTime = percent * duration / 1000
      console.log(`duration:${duration}, startTime:${startTime}, percent:${percent}`)
      if (generator) {
        const { onlineUrl, downUrl } = await this.toSynthesize()
        // 每次生成新的都存起来
        this.$store.dispatch('changeStoreState', { 
          downUrl, 
          onlineUrl, 
        })
        this.playLine = {
          current: start,
          start,
          end
        }
        this.playStartTime = startTime
        this.toPlayAudio(onlineUrl)
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
              
              // console.log(`开始播放，音频长度为：${audio.duration}, 剩余长度：${restDuration},当前进度：${audio.currentTime}`)
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
    getLinePosition() {
      const lineLeft = this.$store.state.lineLeft // 根据播放线的距离去获取相应的块
      const excessPitches = []
      let lineStartX = 10000000
      let lineEndX = 0
      let minStart = 0
      let maxEnd = 0

      let firstPitchStartTime = 0
      let lastPitchStartTime = 0
      let lastPitchDuration = 0
      const full = this.$store.getters.pitchWidth * 50 // TODO 这里改了500个数据的话就要改动
      this.$store.state.stagePitches.forEach(item => {
        const right = item.left + item.width
        if (item.left >= lineLeft || right >= lineLeft) {
          lineStartX = Math.min(lineStartX, item.left)
          lineEndX = Math.max(lineEndX, right)
        }
        
        // minStart = Math.min(minStart, item.left)
        maxEnd = Math.max(maxEnd, right)
        const duration = pxToTime(item.width, this.noteWidth, this.bpm)
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
        duration: totalDuration + 500 // 补了50个数据，一个数据10ms,总共500ms
      } 
    },
    async toSynthesize() {
      this.$store.dispatch('changeStoreState', { isSynthetizing: true })
      
      const req = {
        pitchList: this.$store.getters.pitchList,
        f0_ai: this.$store.state.f0AI,
        f0_draw: this.$store.state.f0Draw,
        task_id: this.$store.state.taskId
      }
      const { data } = await editorSynth(req)
      console.log('editorSynth:', data)
      if (data.ret_code !== 0) {
        Message.error(`合成失败, 错误信息:${data.err_msg}, 请重试~`)
        return
      } 

      const paramId = data.data.param_id
      const taskId = data.data.task_id

      this.$store.dispatch('changeStoreState', { taskId: taskId })
      // Message.success('开始合成音频中~')

      let onlineUrl = ''
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
              onlineUrl = resp.data.data.online_url
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
        onlineUrl,
        downUrl
      }
    }
  }
}
</script>

<style module lang="less">
.audioEditor {
  // margin: 0 93px;
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