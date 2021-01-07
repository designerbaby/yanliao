<template>
  <div :class="$style.audioEditor" ref="audioEditor">
    <BeatHeader :isPlaying="state == 1" @play="toPlay"></BeatHeader>
    <BeatContainer 
      ref="BeatContainer"
      @showBeat="toShowBeat" 
      @getPitches="toGetPictData"
    ></BeatContainer>
    <BeatSelector ref="BeatSelector"></BeatSelector>
    <StatusDialog ref="StatusDialog"></StatusDialog>
    <!-- <audio 
      :src="onlineUrl" 
      ref="AudioUrl" 
      type="audio/wav" 
      controls 
      :class="$style.audioPlay"
    ></audio> -->
  </div>
</template>

<script>
import { Message } from 'element-ui'
import BeatSelector from './BeatSelector.vue'
import BeatContainer from './BeatContainer.vue'
import StatusDialog from './StatusDialog.vue'
import BeatHeader from './BeatHeader.vue'
import { editorSynth, editorSynthStatus, editorSynthResult } from '@/api/audio'
import { processStatus, statusMap } from '@/common/utils/const'
import Bus from '@/common/utils/bus'
import { sleep } from '@/common/utils/helper'
import { PlayAudio } from '@/common/utils/player'

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
    StatusDialog,
    BeatHeader
  },
  data() {
    return {
      pitches: [],
      timerId: 0,
      state: 0,
      isPlaying: false,
      isPaused: false,
      timer: null,
      onlineUrl: '',
      rollTime: 0, // 轮询请求状态循环次数
      playTime: 0,
      // timeout: null,
      pitchHasChange: false, // 记录下音符块是否已经改动了
      maxLeft: 0, // 播放线应该跑的最大偏移量
      minLeft: 0  // 播放线最开始应该在的位置
    }
  },
  mounted() {
    Bus.$on('pitchChange', this.onPitchChange)
    Bus.$on('moveEnd', this.onMoveEnd)
    // this.$refs.AudioUrl.addEventListener('timeupdate', (event) => {
    //   console.log('timeupdate:', event.target.currentTime)
    // })
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
    }
  },
  methods: {
    async toPlay() {
      // 音频播放3个状态 play noplay stop
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,请耐心等待~')
        return
      }

      if (this.state === StatePlaying) {
        this.toPauseAudio()
      } else if (this.state === StatePaused) {
        this.audio.play()
      } else {
        const { url } = await this.getAudioInfo()
        if (url) {
          this.toPlayAudio(url)
        }
      }

      // if (!this.isPlaying) { // 没有在播放且没有完成
      //   console.log('this.onlineUrl:', this.onlineUrl)
      //   console.log('this.pitchHasChange:', this.pitchHasChange)
      //   if (this.onlineUrl && !this.pitchHasChange) { // 有现成的音频，直接播放
      //     this.toPlayAudio()
      //   } else {
      //     this.toSynthesize() // 合成音频
      //   }
      // } else if (this.isStoping) {
      //   this.toPlayAudio()
      // } else { // 在播放但是暂停了
      //   this.toPauseAudio()
      // }
    },
    toPlayAudio(url) {
      console.log('toPlayAudio')
      this.state = StatePlaying
      const { start, end } = this.getLinePosition()

      console.log(`getLinePosition: start`, start, `end`, end)

      const length = end - start
      let current = start

      clearInterval(this.timerId)

      const ticker = (timestamp) => {
        if (this.state === StatePlaying){
          this.$store.dispatch('updateLineLeft', current)
          window.requestAnimationFrame(ticker);
        }
      }

    
      this.audio = PlayAudio({
        url,
        onProgress: (time) => {
          console.log('PlayAudio', time)
          const move = (time * 8 * this.bpm * this.noteWidth) / 60
          const x = start + move

          console.log(`onProgress time:${time}, left:${x}`)

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
        onPause: () => {
          this.state = StatePaused
          clearInterval(this.timerId)
        },
        onEnd: () => {
          this.state = StateStopped
          clearInterval(this.timerId)
        }
      })

      // this.$refs.AudioUrl.play()
      // Bus.$emit('toMoveLine', this.minLeft, this.maxLeft, this.playTime)
    },
    onMoveEnd() {
      console.log('onMoveEnd')
      this.isPlaying = false
      this.isStoping = true
      this.pitchHasChange = false
    },
    toPauseAudio() {
      console.log('toPauseAudio')
      // this.$refs.AudioUrl.pause()
      this.audio.pause()
      this.state = StatePaused
      // Bus.$emit('toStopLine')
      // this.isStoping = true
      // this.isPlaying = false
    },
    toRefreshData() { // 重新开始就清除数据
      this.maxLeft = 0
      this.playTime = 0
    },
    onPitchChange() {
      console.log('onPitchChange')
      this.pitchHasChange = true
    },
    toGetPictData(pitches) {
      this.pitches = pitches
      this.pitchHasChange = true // 一改动就记录下来
    },
    toHandlePitches (pitches) {
      const lineLeft = this.$store.state.lineLeft // 根据播放线的距离去获取相应的块
      console.log('lineLeft:', lineLeft)
      let excessPitches = []
      pitches.forEach(item => {
        if (item.left >= lineLeft || (item.left + item.width) >= lineLeft) {
          excessPitches.push(item)
        }
      })
      for (let i = 0; i < excessPitches.length; i += 1) {
        if (excessPitches[i].red) {
          return
        }
      }
      const newPitches = []
      excessPitches.forEach(item => {
        const duration = Math.floor((60 * (parseInt(item.width) / this.noteWidth) * 1000) / (8 * this.bpm))
        const pitch = 81 - (item.top / item.height)
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
        this.toGetMaxSecond(duration, startTime) // 获取当前音频的最大时长
        this.toGetLineLeft(excessPitches) // 获取线的偏移量
      })
      // console.log('newPitches:', newPitches)
      return newPitches
    },
    toGetMaxSecond(duration, startTime) {
      const maxTime = duration + startTime
      if (maxTime > this.playTime) {
        this.playTime = maxTime
        console.log('this.playTime:', this.playTime)
      }
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
      })
      return {
        start: lineStartX,
        end: lineEndX
      } 
    },
    toGetLineLeft(pitches) {
      let maxLeft = this.maxLeft
      let minLeft = this.minLeft
      pitches.forEach(item => {
        const newLeft = item.width + item.left
        if (newLeft > this.maxLeft) {
          this.maxLeft = newLeft
        }
        const newMinLeft = item.left
        if (newMinLeft < this.minLeft) {
          this.minLeft = newMinLeft
        }
      })
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
      this.toRefreshData()

      const finalPitches = await this.toHandlePitches(this.pitches)

      // console.log('finalPitches:', finalPitches)
      if (finalPitches === undefined) {
        Message.error('音符存在重叠, 请调整好~')
        return
      }
      if (!finalPitches.length) {
        Message.error('请画好音符再播放~')
        this.toPauseAudio()
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
    
      Message.success('开始合成音频中~')

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
    },
    async toEditorSynthStatus (paramId, taskId) {
      this.rollTime += 1
      const { data } = await editorSynthStatus(paramId)
      console.log('editorSynthStatus:', data)
      if (data.ret_code === 0) {
        if (data.data.status === 4) {
          Message.success('音频合成成功~')
          clearInterval(this.timer)
          this.toEditorSynthResult(taskId)
        } else {
          Message.success(`算法努力合成音频中(${processStatus[data.data.status]}%)`)
          // this.$refs.StatusDialog.showStatus(data.data.status)
        }
      } else {
        Message.error(`查询合成状态失败, 错误信息: ${data.err_msg}`)
      }
    },
    toRollStatus (paramId, taskId) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.rollTime <= 10) { // 小于10才循环
          this.toEditorSynthStatus(paramId, taskId)
        } else {
          this.toEditorSynthResult(taskId)
        }
      }, 3000)
    },
    async toEditorSynthResult (taskId) {
      const { data } = await editorSynthResult(taskId)
      console.log('editorSynthResult:', data)
      if (data.ret_code === 0) {
        if (data.data.state === 2) {
          this.onlineUrl = data.data.online_url
          // this.$refs.StatusDialog.hideStatus()
          this.$nextTick(() => {
            this.toPlayAudio()
          })
        } else {
          Message.error(`合成状态: ${statusMap[data.data.state]}`)
        }
      } else {
        Message.error(`合成失败, 错误信息: ${data.err_msg}`)
      }
      clearInterval(this.timer)
      this.rollTime = 0
      this.$store.dispatch('updateIsSynthetizing', false)
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