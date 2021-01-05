<template>
  <div :class="$style.audioEditor" ref="audioEditor">
    <BeatHeader :isPlaying="isPlaying" @play="toPlay"></BeatHeader>
    <BeatContainer 
      ref="BeatContainer"
      @showBeat="toShowBeat" 
      @getPitches="toGetPictData"
    ></BeatContainer>
    <BeatSelector ref="BeatSelector"></BeatSelector>
    <StatusDialog ref="StatusDialog"></StatusDialog>
    <audio :src="onlineUrl" ref="AudioUrl" type="audio/wav" controls :class="$style.audioPlay"></audio>
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
      isPlaying: false,
      timer: null,
      onlineUrl: '',
      rollTime: 0, // 轮询请求状态循环次数
      playTime: 0,
      timeout: null,
      pitchHasChange: false, // 记录下音符块是否已经改动了
      maxLeft: 0, // 播放线应该跑的最大偏移量
      minLeft: 0  // 播放线最开始应该在的位置
    }
  },
  mounted() {
    Bus.$on('pitchChange', this.onPitchChange)
  },
  computed: {
    noteWidth() {
      return this.$store.getters.noteWidth
    },
    bpm() {
      return this.$store.getters.bpm
    },
    isSynthetizing() {
      return this.$store.getters.isSynthetizing
    }
  },
  methods: {
    toPlay() {
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,请耐心等待~')
        return
      }
      if (!this.isPlaying) {
        if (this.onlineUrl && !this.pitchHasChange) { // 有现成的音频，直接播放
          this.toPlayAudio()
        } else {
          this.toSynthesize() // 合成音频
        }
      } else {
        this.toPauseAudio()
      }
    },
    toRefreshData() { // 重新开始就清除数据
      this.maxLeft = 0
      this.playTime = 0
    },
    toMoveLine() {
      Bus.$emit('toMoveLinePos', this.minLeft, this.maxLeft, this.playTime)
    },
    toRestartLine() {
      Bus.$emit('toRestartLinePos')
    },
    onPitchChange() {
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
        const pitch = 81 - ((item.top - 25) / item.height)
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
    async toSynthesize() {
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
      Message.success('开始合成音频中~')
      if (data.ret_code === 0) {
        this.toRollStatus(data.data.param_id, data.data.task_id)
      } else {
        Message.error(`合成失败, 错误信息:${data.err_msg}, 请重试~`)
      }
    },
    async toEditorSynthStatus (paramId, taskId) {
      this.rollTime += 1
      console.log('this.rollTime:', this.rollTime)
      const { data } = await editorSynthStatus(paramId)
      console.log('editorSynthStatus:', data)
      if (data.ret_code === 0) {
        if (data.data.status === 4) {
          Message.success('音频合成成功~')
          clearInterval(this.timer)
          this.toEditorSynthResult(taskId)
          // Bus.$emit('getPitchLine')
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
    },
    toPlayAudio() {
      this.isPlaying = true
      this.$refs.AudioUrl.play()
      this.toMoveLine()
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.toPauseAudio()
      }, this.playTime + 500) // 这里主要是算法那边计算总和后加0.5s做缓冲
    },
    toPauseAudio() {
      if (this.isPlaying) {
        // this.$refs.AudioUrl.pause()
        this.isPlaying = false
        this.toRestartLine()
        this.pitchHasChange = false
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
}

.audioPlay {
  width: 0;
  height: 0;
  display: none;
}
</style>