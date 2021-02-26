<template>
  <div :class="$style.audioEditor" ref="audioEditor">
    <div :class="$style.panel" v-if="!userInfo" @click="checkLogin"></div>
    <BeatHeader 
      :isPlaying="playState == 1" 
      @play="toPlay"
      @synthesize="toSynthesize"
      @openDrawer="toOpenDrawer"
    ></BeatHeader>
    <StatusBar></StatusBar>
    <BeatContainer 
      ref="BeatContainer"
    ></BeatContainer>
    <BeatSetting ref="BeatSetting"></BeatSetting>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import BeatContainer from './BeatContainer.vue'
import BeatHeader from './BeatHeader.vue'
import BeatSetting from './BeatSetting.vue'
import StatusBar from './StatusBar.vue'
import { editorSynth, editorSynthStatus, editorSynthResult, editorDetail } from '@/api/audio'
import { processStatus, statusMap, playState } from '@/common/utils/const'
import { sleep, pxToTime, getParam, timeToPx, isDuplicated, reportEvent } from '@/common/utils/helper'
import { PlayAudio } from '@/common/utils/player'

export default {
  name: 'AudioEditor',
  components: {
    Message,
    BeatContainer,
    BeatHeader,
    BeatSetting,
    StatusBar
  },
  data() {
    return {
      userInfo: sessionStorage.getItem('userInfo'),
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
    reportEvent('audioedit-page-exposure', 147622)
    await this.getEditorDetail()
    this.storeStagePitchesWatcher = this.$store.watch(
      state => state.stagePitches,
      (newValue, oldValue) => {
        // console.log('watch store', oldValue, newValue)
        this.$store.dispatch('changeStoreState', { isStagePitchesChanged: true})
        // this.$store.dispatch('sortStagePitches')
      },
      {
        deep: true
      }
    )
    this.$store.dispatch('updateStageSize')
  },
  destroyed() {
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
    checkLogin() {
      this.$emit('openLoginDialog')
    },
    resetStoreState() {
      this.$store.dispatch('resetState')
    },
    toOpenDrawer() {
      this.$refs.BeatSetting.handleDrawer()
    },
    changePlayState(stateValue) {
      this.$store.dispatch('changeStoreState', { playState: stateValue })
    },
    convertXyMap(items) {
      const xyMap = []
      for (const it of items) {
        xyMap[it.x] = it.y
      }
      return xyMap
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
            width: timeToPx(item.duration, this.noteWidth, pitchList[0].bpm),
            left: timeToPx(item.startTime, this.noteWidth, pitchList[0].bpm),
            top: this.noteHeight * (this.firstPitch - item.pitch),
            pinyinList: item.pinyinList,
            select: item.select
          })
        })
        console.log('getEditorDetail stagePitches:', stagePitches)
        await this.$store.dispatch('changeStoreState', { 
          taskId: data.task_id, 
          downUrl: data.down_url, 
          onlineUrl: data.online_url, 
          f0AI: data.f0_ai, 
          f0Draw: data.f0_draw, 
          bpm: pitchList[0].bpm, // TODO 这里如果每个字都不同，就要改
          toneName: pitchList[0].singer, 
          toneId: pitchList[0].toneId, 
          stagePitches: stagePitches,
          volumeMap: this.convertXyMap(data.volume_xy),
          tensionMap: this.convertXyMap(data.tension_xy)
        })
        const changed = {}
        const pitchWidth = this.$store.getters.pitchWidth
        // 比较元数据和AI数据，如果不一样表示是修改过的，下次生成新的时候不能覆盖
        for (let i = 0; i < data.f0_ai.length; i += 1) {
          if (data.f0_ai[i] !== data.f0_draw[i]) {
            const value = data.f0_draw[i]
            const x = Math.round(pitchWidth * i)
            const xEnd = Math.round(pitchWidth * (i + 1))
            // console.log(`有改变的数据：pitchWidth:${pitchWidth}, index:${i}, value:${value}, x:${x}, xEnd:${xEnd}`)
            for (let j = x; j <= xEnd; j +=1) {
              changed[j] = value
            }
            // console.log(`this.$store.state`, this.$store.state)
          }
        }
        this.$store.state.changedLineMap = changed
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

      // 响度改变了
      if (this.$store.state.isVolumeChanged) {
        return true
      }

      // 张力改变了
      if (this.$store.state.isTensionChanged) {
        return true
      }

      // 没有可播放的url
      if (!this.$store.state.onlineUrl) {
        return true
      }

      return false
    },
    async toPlay() {
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,请耐心等待~')
        return
      }

      const finalPitches = this.$store.getters.pitchList
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
      this.$store.dispatch('changeStoreState', { isStagePitchesChanged: false, isVolumeChanged: false, isTensionChanged: false })
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
        // console.log('this.audio:', this.audio)
        this.audio.currentTime = startTime
        this.audio.play()
      } else {
        // console.log(`isContinue: ${isContinue}, percent:${percent}, duration:${duration}, startTime:${startTime}`)
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
          // this.$store.dispatch('changeStoreState', { lineLeft: this.playLine.current })
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
              this.changeLinePosition(this.playLine.current, true)
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
          this.changeLinePosition(this.playLine.start, true)
          this.playLine.current = this.playLine.start
        }
      })

    },
    changeLinePosition(left, autoScroll = false) {
      if (autoScroll) {
        const { width, scrollLeft } = this.$store.state.stage
        const max = scrollLeft + width // 滚动滚动的大小加上容器的大小就是容器最右边的位置
        if (left > max) {
          this.$refs.BeatContainer.scrollTo(max)
        } else if  (left < scrollLeft) { // 线的位置小于滚动条的滚动位置说明线在左边看不到
          this.$refs.BeatContainer.scrollTo(left)
        }
      }

      this.$store.dispatch('changeStoreState', { lineLeft: left })
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
    handleVolumeTension() {
      const pitchWidth = this.$store.getters.pitchWidth
      const volumeMap = this.$store.state.volumeMap
      const tensionMap = this.$store.state.tensionMap
      let volumeXy = []
      let tensionXy = []
      let f0Volume = []
      let f0Tension = []
      for (let i = 0; i < volumeMap.length; i += 1) {
        volumeXy.push({
          x: i,
          y: volumeMap[i] || 0
        })
      }
      for (let i = 0; i < tensionMap.length; i += 1) {
        tensionXy.push({
          x: i,
          y: tensionMap[i] || 0
        })
      }
      for (let i = 0; i < volumeXy.length; i += pitchWidth) {
        // console.log('volumeXy[Math.round(i)]', volumeXy[Math.round(i)])
        if (volumeXy[Math.round(i)]) {
          f0Volume.push(parseInt(volumeXy[Math.round(i)].y, 10))
        }
      }
      for (let i = 0; i < tensionXy.length; i += pitchWidth) {
        // console.log('tensionXy[Math.round(i)]', tensionXy[Math.round(i)])
        if (tensionXy[Math.round(i)]) {
          f0Tension.push(parseInt(tensionXy[Math.round(i)].y, 10))
        }
      }
      return {
        volumeXy: volumeXy,
        tensionXy: tensionXy,
        f0Volume: f0Volume,
        f0Tension: f0Tension
      }
    },
    async toSynthesize(callback) {
      this.$store.dispatch('changeStoreState', { isSynthetizing: true })
      this.$store.dispatch('getPitchLine')
      const getF0DataStart = Date.now()
      for (let i = 0; i < 10; i += 1) {
        if (!this.$store.state.isGetF0Data) {
          console.log('获取F0数据成功~')
          break
        }
        const getF0DataEnd = Date.now()
        if ((getF0DataEnd - getF0DataStart) > 10 * 1000) {
          Message.error('音频合成失败，请稍后再试~')
          this.$store.dispatch('changeStoreState', { isSynthetizing: false })
          this.changePlayState(playState.StateNone) // 合成失败，要把合成状态改回来
          break
        }
        console.log(`获取音频中:`, getF0DataEnd - getF0DataStart)
        Message.success(`算法努力合成音频中(0%)`)
        await sleep(1000)
      }

      const synthesizeStart = Date.now()  
      const handleData = this.handleVolumeTension()
      const req = {
        pitchList: this.$store.getters.pitchList,
        f0_ai: this.$store.state.f0AI,
        f0_draw: this.$store.state.f0Draw,
        task_id: this.$store.state.taskId,
        volume_data: handleData.f0Volume,
        tension_data: handleData.f0Tension,
        volume_xy: handleData.volumeXy,
        tension_xy: handleData.tensionXy
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
        const { data } = await editorSynthStatus(paramId, taskId)
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
        const synthesizeEnd = Date.now()
        console.log(`synthesizeEnd - synthesizeStart: ${synthesizeEnd - synthesizeStart}, synthesizeStart: ${synthesizeStart}, synthesizeEnd: ${synthesizeEnd}`, )
        if ((synthesizeEnd - synthesizeStart) > 30 * 1000) {
          Message.error('音频合成失败，请稍后再试~')
          this.$store.dispatch('changeStoreState', { isSynthetizing: false })
          this.changePlayState(playState.StateNone) // 合成失败，要把合成状态改回来
          break
        }
      }
      
      this.$store.dispatch('changeStoreState', { isSynthetizing: false })
      if (callback) {
        callback()
      }
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

.panel {
  position: fixed;
  top: 48px;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 2000;
}
</style>