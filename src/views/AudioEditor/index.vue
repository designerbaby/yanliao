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
      :beatForm="beatForm" 
      @getPitches="toGetPictData"
    ></BeatContainer>
    <BeatSelector ref="BeatSelector" @changeBeat="toChangeBeat"></BeatSelector>
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

export default {
  name: 'AudioEditor',
  components: {
    Message,
    BeatSelector,
    BeatContainer,
    StatusDialog
  },
  data() {
    const defaultForm = {
      fenzi: 4,
      fenmu: 4
    }
    return {
      beatForm: JSON.parse(sessionStorage.getItem('beatForm')) || defaultForm,
      bpm: 90,
      newPitches: [],
      isPlaying: false,
      timer: null,
      onlineUrl: '',
      rollTime: 0, // 轮询请求状态循环次数
      playTime: 0,
      timeout: null
    }
  },
  mounted() {},
  methods: {
    toPlay() {
      if (!this.isPlaying) {
        if (this.onlineUrl) { // 有现成的音频，直接播放
          this.toPlayAudio()
        } else {
          this.toSynthesize() // 合成音频
        }
      } else {
        this.toPauseAudio()
      }
    },
    toMoveLine() {
      this.$refs.BeatContainer.toMoveLinePos()
    },
    toRestartLine() {
      this.$refs.BeatContainer.toRestartLinePos()
    },
    toGetPictData(pitches, note) {
      const newPitches = []
      pitches.forEach(item => {
        const duration = Math.floor((60 * (parseInt(item.width) / note) * 1000) / (8 * this.bpm))
        const pitch = (item.top / item.height) + 24
        const startTime = Math.floor(((item.left / note) * 60 * 1000) / (8 * this.bpm))
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
        this.toGetMaxSecond(duration, startTime)
      })
      this.newPitches = newPitches
      log('this.newPitches:', this.newPitches)
    },
    toGetMaxSecond(duration, startTime) { // 获取当前音频的最大时长
      const maxTime = duration + startTime
      if (maxTime > this.playTime) {
        this.playTime = maxTime
      }
    },
    toShowBeat() {
      this.$refs.BeatSelector.showBeatDialog(this.beatForm)
    },
    toChangeBeat(form) {
      this.beatForm = form
      sessionStorage.setItem('beatForm', JSON.stringify(form))
    },
    async toSynthesize() {
      if (this.newPitches.length === 0) {
        Message.error('请画好音符再播放~')
        return
      }
      const req = {
        pitch_list: this.newPitches,
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
      log('this.rollTime:', this.rollTime)
      this.rollTime += 1
      const { data } = await editorSynthStatus(paramId)
      log('editorSynthStatus:', data)
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
      if (this.rollTime <= 10) {
        this.timer = setInterval(() => {
          this.toEditorSynthStatus(paramId, taskId)
        }, 3000)
      }
    },
    async toEditorSynthResult (taskId) {
      const { data } = await editorSynthResult(taskId)
      log('editorSynthResult:', data)
      if (data.ret_code === 0) {
        if (data.data.state === 2) {
          this.onlineUrl = data.data.online_url
          this.$refs.StatusDialog.hideStatus()
          this.$nextTick(() => {
            this.toPlayAudio()
            this.isPlaying = false
          })
        } else {
          Message.error(`合成状态: ${statusMap[data.data.state]}`)
        }
      } else {
        Message.error(`合成失败, 错误信息: ${data.err_msg}`)
      }
    },
    toPlayAudio() {
      this.isPlaying = true
      this.$refs.AudioUrl.play()
      this.toMoveLine()
      this.timeout = setTimeout(() => {
        this.toPauseAudio()
      }, this.playTime + 500)
    },
    toPauseAudio() {
      this.$refs.AudioUrl.pause()
      this.isPlaying = false
      this.toRestartLine()
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
      // border-left: 10px solid #b8b8b8;
      // border-top: 10px solid transparent;
      // border-bottom: 10px solid transparent;
      // background-image: url('@/assets/icon-play.png');
      // background-repeat: no-repeat;
      // background-size: 100%;
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