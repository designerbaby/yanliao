<template>
  <div :class="$style.audioEditor" ref="audioEditor">
    <div :class="$style.panel" v-if="!userInfo" @click="checkLogin"></div>
    <BeatHeader
      :isPlaying="playState == 1"
      :isNeedGenerate="isNeedGenerate('upload')"
      @play="toPlay"
      @synthesize="toSynthesize"
      @openDrawer="toOpenDrawer"
      @toScroll="toScroll"
    ></BeatHeader>
    <Arrange ref="Arrange"></Arrange>
    <StatusBar></StatusBar>
    <BeatContainer ref="BeatContainer"></BeatContainer>
    <BeatSetting ref="BeatSetting"></BeatSetting>
    <CommonDialog
      :show="dialogShow"
      titleText="为更好的提供服务,建议您使用chrome浏览器哦～"
      confirmButtonText="确定"
      :confirmButtonEvent="closeDialogShow"
      :cancelButtonEvent="closeDialogShow" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import BeatContainer from './BeatContainer'
import BeatHeader from './BeatHeader'
import BeatSetting from './BeatSetting.vue'
import StatusBar from './StatusBar'
import Arrange from './Arrange'
import { editorSynth, editorSynthStatus, editorSynthResult, editorDetail, musicxml2Json } from '@/api/audio'
import { songDetail } from '@/api/api'
import { processStatus, statusMap, playState, TrackMode } from '@/common/utils/const'
import { sleep, pxToTime, getParam, timeToPx, isDuplicated, reportEvent } from '@/common/utils/helper'
import { pitchList2StagePitches, deleteStagePitches } from '@/common/utils/common'
import { PlayAudio } from '@/common/utils/player'
import CommonDialog from '@/common/components/CommonDialog'
import * as waveSurfer from '@/common/utils/waveSurfer'

export default {
  name: 'AudioEditor',
  components: {
    Message,
    BeatContainer,
    BeatHeader,
    BeatSetting,
    StatusBar,
    Arrange,
    CommonDialog
  },
  data() {
    return {
      userInfo: sessionStorage.getItem('userInfo'),
      timerId: 0,

      // 播放线
      playLine: {
        current: 0 // 当前的位置, px
      },
      playStartTime: 0, // 从第几秒开始播放
      dialogShow: false,
      isAddAc: 1
    }
  },
  async mounted() {
    reportEvent('audioedit-page-exposure', 147622)
    await this.getEditorDetail()
    this.storeStagePitchesWatcher = this.$store.watch(
      state => state.stagePitches,
      (newValue, oldValue) => {
        // console.log('watch store', oldValue, newValue)
        // console.log('changeStoreState isStagePitchesChanged true')
        this.$store.dispatch('changeStoreState', { isStagePitchesChanged: true})
      },
      {
        deep: true
      }
    )
    this.$store.dispatch('updateStageSize')
    await this.$nextTick()
    document.addEventListener('keydown', this.keyDownListener)
  },
  destroyed() {
    if (this.$store.state.ganAudio) {
      this.$store.state.ganAudio.pause() // 要把播放的暂停了
    }
    if (waveSurfer.getWaveSurfer()) {
      waveSurfer.getWaveSurfer().pause()
      waveSurfer.clearWaveSurfer()
    }
    this.storeStagePitchesWatcher()
    this.resetStoreState()
    document.removeEventListener('keydown', this.keyDownListener)
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
    firstPitch() {
      return this.$store.getters.firstPitch
    },
    stagePitches() {
      return this.$store.state.stagePitches
    },
    trackList() {
      return this.$store.state.trackList
    }
  },
  methods: {
    keyDownListener(event) {
      if (event.target !== document.body) return
      if (event.keyCode === 32) {
        this.toPlay()
        event.preventDefault()
      } else if (event.keyCode === 8 || event.keyCode === 46) { // delete or return
        deleteStagePitches(this)
        event.stopPropagation()
      }
    },
    closeDialogShow() {
      this.dialogShow = false
    },
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
    async getMusicInfo(musicId) {
      const res = await songDetail(musicId)
      return res.data.data
    },
    async getMusicxml2Json(xml2JsonReq) {
      const res = await musicxml2Json(xml2JsonReq)
      return res.data.data
    },
    saveF0DrawChange(f0Ai, f0Draw) {
      const changed = {}
      const pitchWidth = this.$store.getters.pitchWidth
      // 比较元数据和AI数据，如果不一样表示是修改过的，下次生成新的时候不能覆盖
      for (let i = 0; i < f0Ai.length; i += 1) {
        if (f0Ai[i] !== f0Draw[i]) {
          const value = f0Draw[i]
          const x = Math.round(pitchWidth * i)
          const xEnd = Math.round(pitchWidth * (i + 1))
          // console.log(`有改变的数据：pitchWidth:${pitchWidth}, index:${i}, value:${value}, x:${x}, xEnd:${xEnd}`)
          for (let j = x; j <= xEnd; j +=1) {
            changed[j] = value
          }
        }
      }
      this.$store.state.changedLineMap = changed
    },
    acInfo2TrackList(acInfo) {
      let acInfos = acInfo
      if (acInfos.length === 0) {
        acInfos = this.$store.state.trackList
      }
      const trackList = JSON.parse(JSON.stringify(acInfos))
      trackList.forEach(item => {
        item.offset = timeToPx(item.offset, this.noteWidth / 10, this.bpm)
      })
      return trackList
    },
    async getEditorDetail() {
      const taskId = getParam('taskId') || 0
      const musicId = getParam('musicId') || 0
      if (taskId) { // 从我的曲谱编辑按钮进来，如果从我的作品的编辑按钮进来就同时有taskId和musicId
        // console.log('taskId:', taskId)
        const res = await editorDetail({ task_id: taskId })
        const data = res.data.data
        const pitchList = data.pitchList
        const stagePitches = pitchList2StagePitches(pitchList, '', this)
        const trackList = this.acInfo2TrackList(data.ac_info)
        const stageMousePos = {
          x: trackList[1]?.offset,
          y: 0
        }
        await this.$store.dispatch('changeStoreState', {
          taskId: data.task_id,
          onlineUrl: data.online_url,
          f0AI: data.f0_ai,
          f0Draw: data.f0_draw,
          bpm: pitchList[0].bpm,
          toneName: pitchList[0].singer,
          toneId: pitchList[0].toneId,
          stagePitches: stagePitches,
          volumeMap: this.convertXyMap(data.volume_xy),
          tensionMap: this.convertXyMap(data.tension_xy),
          musicId: musicId ? musicId : data.music_id, // 从我的作品进来有musicId就用这个，没的话，就用之前保存的
          musicName: data.music_name,
          trackList: trackList,
          stageMousePos: stageMousePos
        })
        this.saveF0DrawChange(data.f0_ai, data.f0_draw)
        if (trackList[1].file) {
          this.$store.dispatch('showWaveSurfer', { file: trackList[1]?.file, type: 'url' })
        }
      } else if (musicId) { // 从编辑页面或者修改歌词页面进来
        const musicInfo = await this.getMusicInfo(musicId)
        const musicxml2Json = await this.getMusicxml2Json(JSON.parse(sessionStorage.getItem('xml2JsonReq')))
        console.log('musicInfo:', musicInfo)
        let stagePitches = []
        if (musicInfo.bus_type === 1) { // 从正常的xml转过来，给的是格子数
          stagePitches = pitchList2StagePitches(musicxml2Json.pitchList, 'grid', this)
        } else { // 从我自己生成的曲谱过来，给的是时间
          stagePitches = pitchList2StagePitches(musicxml2Json.pitchList, '', this)
        }
        // 重置F0Draw
        let f0Draw = musicxml2Json.f0_draw
        const resetF0Draw = parseInt(getParam('resetF0Draw'), 10)
        if (musicInfo.bus_type === 2 && resetF0Draw === 1) {
          f0Draw = []
        }
        this.$store.dispatch('changeStoreState', {
          taskId: getParam('arrangeId') || musicxml2Json.task_id,
          musicId: musicId,
          bpm: musicxml2Json.pitchList[0].bpm,
          toneName: musicxml2Json.pitchList[0].singer,
          toneId: musicxml2Json.pitchList[0].toneId,
          musicName: `${musicInfo.name}填词`,
          stagePitches: stagePitches,
          f0AI: musicxml2Json.f0_ai,
          f0Draw: f0Draw,
          volumeMap: this.convertXyMap(musicxml2Json.volume_xy),
          tensionMap: this.convertXyMap(musicxml2Json.tension_xy),
          pitchChanged: true // 标记音块改动了，这样才能重新拉到辅音
        })
        this.saveF0DrawChange(musicxml2Json.f0_ai, f0Draw)
        this.$store.dispatch('getPitchLine')
        this.$store.dispatch('saveFuYuan')
      }
      this.$store.dispatch('adjustStageWidth')
    },
    isNeedGenerate(type) {
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

      // 元辅音改变了
      if (this.$store.state.isStagePitchElementChanged) {
        return true
      }

      // 伴奏改变了
      if (this.$store.state.isObbligatoChanged) {
        return true
      }

      // 静音播放改变了
      if (this.$store.state.isTrackChanged) {
        return true
      }

      // 没有可播放的url
      if (!this.$store.state.onlineUrl && type !== 'upload') {
        return true
      }

      return false
    },
    async toPlay() {
      const trackMode = this.$store.getters.trackMode
      if (trackMode === TrackMode.TrackModeNone) {
        Message.error('都设置静音了,不播放了～')
        return
      }

      if (trackMode === TrackMode.TrackModeBan) {
        console.log('只播放伴奏')
        this.toPlayWaver()
        return
      }
      if (trackMode === TrackMode.TrackModeGan || !waveSurfer.getWaveSurfer()) {
        console.log('播放干声,不合成伴奏')
        this.isAddAc = 0
        this.toPlayVoice()
        return
      }
      if (trackMode === TrackMode.TrackModeAll) {
        console.log('干声和伴奏一起播放,也合成伴奏')
        this.isAddAc = 1
        this.toPlayVoice()
        return
      }
    },
    toPlayWaver() {
      // 只播伴奏
      const waveSurferObj = waveSurfer.getWaveSurfer()
      if (waveSurferObj) {
        if (waveSurferObj.isPlaying()) {
          this.changePlayState(playState.StatePaused)
        } else {
          this.changePlayState(playState.StatePlaying)
        }
        waveSurferObj.playPause()
        const waveOffset = this.trackList[1].offset
        waveSurferObj.on('audioprocess', (process) => {
          const left = timeToPx(process * 1000, this.noteWidth / 10, this.bpm)
          this.$store.dispatch('changeStoreState', { lineLeft: (left + waveOffset) * 10 })
        })
        waveSurferObj.on('finish', () => {
          this.$store.dispatch('changeStoreState', { lineLeft: waveOffset * 10 })
          waveSurferObj.setCurrentTime(0)
          this.changePlayState(playState.StatePaused)
        })
      } else {
        Message.error('伴奏音轨没有伴奏哦~')
      }
    },
    toPlayVoice() {
      if (this.isSynthetizing) {
        Message.error('正在合成音频中,请耐心等待~')
        return
      }

      if (isDuplicated(this.stagePitches)) {
        Message.error('音符存在重叠, 请调整好~')
        return
      }
      if (!this.$store.getters.pitchList.length) {
        Message.error('没有音符！！')
        return
      }

      const lastStagePitches = this.stagePitches[this.stagePitches.length - 1]
      const lastStagePitchRight = lastStagePitches.left + lastStagePitches.width
      const banEndX = this.trackList[1].offset * 10 + this.$store.state.waveWidth * 10
      let maxRight = lastStagePitchRight
      if (waveSurfer.getWaveSurfer()) {
        maxRight = Math.max(lastStagePitchRight, banEndX)
        waveSurfer.setCurrentTime(0)
      }
      if (this.$store.state.lineLeft > maxRight && this.playState !== playState.StatePlaying) {
        Message.error('播放线后没有音符或伴奏！！')
        return
      }
      console.log(`Click play button, current state: ${this.playState}`)

      const taskId = getParam('taskId')
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
        this.$store.state.ganAudio.pause()
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
      this.$store.dispatch('changeStoreState', { isStagePitchesChanged: false, isVolumeChanged: false, isTensionChanged: false, isStagePitchElementChanged: false, isPitchLineChanged: false, isObbligatoChanged: false, isTrackChanged: false })
    },
    async doPlay(generator = true, isContinue = false) {
      const { startTime } = this.getLinePosition()
      console.log(`doPlay generator:${generator}, isContinue:${isContinue}, startTime: ${startTime}`)

      if (generator) {
        const { onlineUrl } = await this.toSynthesize(this.isAddAc)
        // 每次生成新的都存起来
        this.$store.dispatch('changeStoreState', {
          onlineUrl,
        })
        this.toPlayAudio(onlineUrl)
        this.playStartTime = startTime
        this.$store.state.ganAudio.currentTime = startTime
        this.$store.state.ganAudio.play()
      } else {
        if (isContinue) {
          console.log(`play continue with start}`)
          this.$store.state.ganAudio.play()
        } else {
          this.playStartTime = startTime
          this.$store.state.ganAudio.currentTime = startTime
          this.$store.state.ganAudio.play()
        }
      }
    },
    toPlayAudio(url) {
      clearInterval(this.timerId)
      this.$store.state.ganAudio = PlayAudio({
        url,
        onPlay: (audio) => {
          const ticker = () => {
            if (this.playState === playState.StatePlaying) {
              if (audio.duration) {
                const currentPosition = timeToPx(audio.currentTime * 1000, this.noteWidth, this.bpm)
                // console.log(`ticker: duration:${audio.duration}, currentTime:${audio.currentTime}, currentPosition`, currentPosition)
                this.changeLinePosition(currentPosition, true)
              }
              requestAnimationFrame(ticker)
            }
          }
          /* 废弃
          this.timerId = setInterval(() => {
            if (audio.duration) {
              // 需要播放的音频长度，如果移动了线，则可能从中间位置开始播
              const duration = audio.duration // 音频总长度
              const restDuration = duration - this.playStartTime
              const msDuration = restDuration * 1000

              const length = this.playLine.end - this.playLine.start
              const times = msDuration / 16
              const step = length / times

              this.playLine.current += step
              this.changeLinePosition(this.playLine.current, true)
            }
          }, 16)
          */

          requestAnimationFrame(ticker)
        },
        onPause: (dom) => {
          clearInterval(this.timerId)
        },
        onEnd: () => {
          clearInterval(this.timerId)
          this.changePlayState(playState.StateEnded)
          // 回到开始播放的位置
          const resumePosition = timeToPx(this.playStartTime * 1000, this.noteWidth, this.bpm)
          // console.log(`resumePosition`, resumePosition, this.playStartTime)
          this.changeLinePosition(resumePosition, true)
          // this.playLine.current = this.playLine.start
        }
      })
    },
    changeLinePosition(left, autoScroll = false) {
      if (autoScroll) {
        const { width, scrollLeft } = this.$store.state.stage
        const max = scrollLeft + width // 滚动的大小加上容器的大小就是容器最右边的位置
        if (left > max) {
          this.$refs.BeatContainer.scrollTo(max)
        } else if  (left < scrollLeft) { // 线的位置小于滚动条的滚动位置说明线在左边看不到
          this.$refs.BeatContainer.scrollTo(left)
        }
        this.scrollArrange(left)
      }
      this.playLine.current = left
      this.$store.dispatch('changeStoreState', { lineLeft: left })
    },
    scrollArrange(left) {
      const { width, scrollLeft } = this.$store.state.arrangeStage
      const max = scrollLeft + width
      const arrangeLeft = left / 10
      if (arrangeLeft > max) {
        this.$refs.Arrange.scrollTo(max)
      } else if (arrangeLeft < scrollLeft) {
        this.$refs.Arrange.scrollTo(arrangeLeft)
      }
    },
    toScroll(left) {
      this.$refs.BeatContainer.scrollTo(left)
    },
    getStagePitchLeftPosition(item) {
      let left = item.left
      // 有preTime表示是音素模式，因此要加上这个长度
      // if (item.hasOwnProperty('preTime')) {
      //   left = item.left - timeToPx(item.preTime, this.noteWidth, this.bpm)
      // }
      return left
    },
    getStagePitchRightPosition(item) {
      return item.left + item.width
    },
    getLinePosition() {
      const lineLeft = this.$store.state.lineLeft // 根据播放线的距离去获取相应的块
      // const trackMode = this.$store.getters.trackMode
      // TODO 这里当有伴奏的时候，要考虑伴奏的最左边的位置
      let lineStartX = null
      let isLineInStagePitchRange = false
      // 音块的最左边和最右边
      // let minLeft, maxRight
      this.stagePitches.forEach((item, idx) => {
        const right = this.getStagePitchRightPosition(item)
        if (lineLeft < right) {
          isLineInStagePitchRange = true
        }
      })


      console.log(`isLineInStagePitchRange:`, isLineInStagePitchRange)

      // 如果在音块范围内，以音块为准
      if (isLineInStagePitchRange) {
        this.stagePitches.forEach((item, index) => {
          const left = this.getStagePitchLeftPosition(item)
          const right = this.getStagePitchRightPosition(item)
          // console.log(`left`, left)

          if (lineLeft <= right) {
            if (lineStartX === null) {
              lineStartX = left
            }
            lineStartX = Math.min(lineStartX, left)
          }
        })
      } else {
        lineStartX = lineLeft
      }
      console.log('lineStartX:', lineStartX)
      const startTime = pxToTime(lineStartX, this.noteWidth, this.bpm) / 1000

      return {
        startTime,
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
        if (volumeXy[Math.round(i)]) {
          f0Volume.push(parseInt(volumeXy[Math.round(i)].y, 10))
        }
      }
      for (let i = 0; i < tensionXy.length; i += pitchWidth) {
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
    handleAcInfo() {
      let acInfo = JSON.parse(JSON.stringify(this.trackList))
      acInfo[0].file = this.$store.state.onlineUrl
      acInfo[0].offset = this.$store.getters.pitchList[0].startTime
      acInfo[1].offset = pxToTime(acInfo[1].offset, this.noteWidth / 10, this.bpm)
      return acInfo
    },
    async toSynthesize(isAddAc, callback) {
      // isAddAc 是否合成伴奏 0 不合成 1合成
      if (this.$store.state.isGetF0Data) {
        Message.error(`网络不好，请稍后重试~`)
        return
      }
      this.$store.dispatch('changeStoreState', { isSynthetizing: true })
      const sStart = Date.now()
      const handleData = this.handleVolumeTension()
      const acInfo = this.handleAcInfo()
      const req = {
        pitchList: this.$store.getters.pitchList,
        f0_ai: this.$store.state.f0AI,
        f0_draw: this.$store.state.f0Draw,
        task_id: this.$store.state.taskId,
        volume_data: handleData.f0Volume,
        tension_data: handleData.f0Tension,
        volume_xy: handleData.volumeXy,
        tension_xy: handleData.tensionXy,
        music_id: this.$store.state.musicId,
        music_name: this.$store.state.musicName,
        ac_info: acInfo,
        is_add_ac: isAddAc  // 是否需要合成伴奏,0为不需要，1为需要
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

      for (let i = 0; i < 20 ;i ++) {
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
              Message.success('音频合成成功~')
              break
            }
        } else {
          Message.success(`算法努力合成音频中(${processStatus[data.data.status]}%)`)
        }
        await sleep(3000)
        const sEnd = Date.now()
        const duration = sEnd - sStart
        console.log(`synthesize duration: ${duration}, synthesize start: ${sStart}, synthesize end: ${sEnd}`)
        if (duration > 60 * 1000) {
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
        onlineUrl
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
