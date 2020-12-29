<template>
  <div class="audioEditor" ref="audioEditor">
    <div class="audioEditor__header">
      <div class="audioEditor__play" @click="toPlay">
        <img src="@/assets/icon-pause.png" class="audioEditor__play--icon" v-if="isPlaying"/>
        <img src="@/assets/icon-play.png" class="audioEditor__play--icon" v-else/>
        播放控制
      </div>
      <div class="audioEditor__bpm">{{bpm}} BPM</div>
    </div>
    <audio :src="onlineUrl" ref="AudioUrl" type="audio/wav" controls class="audioPlay"></audio>
    <BeatContainer 
      ref="BeatContainer"
      @showBeat="toShowBeat" 
      @getPitches="toGetPictData"
    ></BeatContainer>
    <BeatSelector ref="BeatSelector"></BeatSelector>
    <StatusDialog ref="StatusDialog"></StatusDialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import BeatSelector from './BeatSelector.vue'
import BeatContainer from './BeatContainer.vue'
import StatusDialog from './StatusDialog.vue'
import { editorSynth, editorSynthStatus, editorSynthResult } from '@/api/audio'
import { processStatus, statusMap } from '@/common/utils/const'
import Bus from '@/common/utils/bus'

export default {
  name: 'AudioEditor',
  components: {
    Message,
    BeatSelector,
    BeatContainer,
    StatusDialog
  },
  data() {
    return {
      bpm: 90,
      pitches: [],
      isPlaying: false,
      timer: null,
      onlineUrl: '',
      rollTime: 0, // 轮询请求状态循环次数
      playTime: 0,
      timeout: null,
      pitchHasChange: false, // 记录下音符块是否已经改动了
      note: 20,
      maxLeft: 0
    }
  },
  mounted() {
    Bus.$on('pitchChange', this.onPitchChange)
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
      this.$refs.BeatContainer.toMoveLinePos(this.maxLeft)
    },
    toRestartLine() {
      this.$refs.BeatContainer.toRestartLinePos()
    },
    onPitchChange() {
      this.pitchHasChange = true
    },
    toGetPictData(pitches, note) {
      this.note = note
      this.pitches = pitches
      this.pitchHasChange = true // 一改动就记录下来
    },
    toHandlePitches (pitches) {
      const lineLeft = this.$store.state.lineLeft // 根据音高线的距离去获取相应的块
      let excessPitches = []
      pitches.forEach(item => {
        if (item.left > lineLeft || (item.left + item.width) > lineLeft) {
          excessPitches.push(item)
        }
      })
      const newPitches = []
      excessPitches.forEach(item => {
        const duration = Math.floor((60 * (parseInt(item.width) / this.note) * 1000) / (8 * this.bpm))
        const pitch = (item.top / item.height) + 24
        const startTime = Math.floor(((item.left / this.note) * 60 * 1000) / (8 * this.bpm))
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

<style scoped lang="less">
.audioEditor {
  // width: 1072px;
  margin: 0 93px;
  background:#373736;
  overflow-x: scroll;
  &__header {
    width: 100%;
    border-top: 1px solid #505050;
    position: relative;
  }
  &__play {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #b8b8b8;
    font-size: 15px;
    margin: 10px 20px;
    &--icon {
      width: 22px;
      height: 22px;
    }
  }
}
.audioEditor__bpm {
  color: #fff;
  font-size: 13px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.audioPlay {
  width: 0;
  height: 0;
}
</style>