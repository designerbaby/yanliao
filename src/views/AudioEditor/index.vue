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
      maxLeft: 0
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
    }
  },
  methods: {
    toPlay() {
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
      Bus.$emit('toMoveLinePos', this.maxLeft, this.playTime)
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
      const lineLeft = this.$store.state.lineLeft // 根据音高线的距离去获取相应的块
      log('lineLeft:', lineLeft)
      let excessPitches = []
      pitches.forEach(item => {
        if (item.left > lineLeft || (item.left + item.width) > lineLeft) {
          excessPitches.push(item)
        }
      })
      for (let i = 0; i < excessPitches.length; i += 1) {
        if (excessPitches[i].red) {
          Message.error('音符存在重叠, 请调整好~')
          return
        }
      }
      const newPitches = []
      excessPitches.forEach(item => {
        const duration = Math.floor((60 * (parseInt(item.width) / this.noteWidth) * 1000) / (8 * this.bpm))
        const pitch = 107 - (item.top / item.height)
        const startTime = Math.floor(((item.left / this.noteWidth) * 60 * 1000) / (8 * this.bpm))
        const pitchItem = {
          duration: duration,
          pitch: pitch,
          singer: 'luoxiang',
          start_time: startTime,
          pinyin: 'la',
          hanzi: item.hanzi,
          tone_id: 1
        }
        newPitches.push(pitchItem)
        this.toGetMaxSecond(duration, startTime) // 获取当前音频的最大时长
        this.toGetMaxLineLeft(excessPitches) // 获取当前最大的偏移量
      })
      return newPitches
    },
    toGetMaxSecond(duration, startTime) {
      const maxTime = duration + startTime
      if (maxTime > this.playTime) {
        this.playTime = maxTime
      }
    },
    toGetMaxLineLeft(pitches) {
      let maxLeft = this.maxLeft
      pitches.forEach(item => {
        const newLeft = item.width + item.left
        if (newLeft > this.maxLeft) {
          this.maxLeft = newLeft
        }
      })
    },
    toShowBeat() {
      this.$refs.BeatSelector.showBeatDialog()
    },
    async toSynthesize() {

      this.toRefreshData()
      const finalPitches = await this.toHandlePitches(this.pitches)

      if (finalPitches.length === 0) {
        Message.error('请画好音符再播放~')
        this.toPauseAudio()
        return
      }

      const req = {
        pitch_list: finalPitches,
        f0: []
      }
      const { data } = await editorSynth(req)
      log('editorSynth:', data)
      Message.success('开始合成音频中~')
      if (data.ret_code === 0) {
        this.toRollStatus(data.data.param_id, data.data.task_id)
      } else {
        Message.error(`合成失败, 错误信息:${data.err_msg}, 请重试~`)
      }
    },
    async toEditorSynthStatus (paramId, taskId) {
      this.rollTime += 1
      log('this.rollTime:', this.rollTime)
      const { data } = await editorSynthStatus(paramId)
      log('editorSynthStatus:', data)
      if (data.ret_code === 0) {
        if (data.data.status === 4) {
          Message.success('音频合成成功~')
          clearInterval(this.timer)
          this.toEditorSynthResult(taskId)
          clearInterval(this.timer)
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
      log('editorSynthResult:', data)
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
      this.toRestartLine()
      this.$refs.AudioUrl.pause()
      this.isPlaying = false
      this.pitchHasChange = false
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