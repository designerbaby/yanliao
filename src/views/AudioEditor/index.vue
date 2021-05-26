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
    <ChromeDialog
      :show="dialogShow"
      :confirmButtonEvent="closeDialogShow"
    ></ChromeDialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import BeatContainer from './BeatContainer'
import BeatHeader from './BeatHeader'
import BeatSetting from './BeatSetting.vue'
import StatusBar from './StatusBar'
import Arrange from './Arrange'
import { editorSynth, editorSynthStatus, editorSynthResult, editorDetail, musicXml2Json } from '@/api/audio'
import { songDetail } from '@/api/api'
import { ProcessStatus, PlayState, TrackMode, PitchList } from '@/common/utils/const'
import { sleep, pxToTime, getParam, timeToPx, isDuplicated, reportEvent, isChrome } from '@/common/utils/helper'
import { pitchList2StagePitches } from '@/common/utils/common'
import { PlayAudio } from '@/common/utils/player'
import ChromeDialog from './Components/ChromeDialog'
import * as waveSurfer from '@/common/utils/waveSurfer'
import Editor from '@/common/editor'
let audio = null

export default {
  name: 'AudioEditor',
  components: {
    Message,
    BeatContainer,
    BeatHeader,
    BeatSetting,
    StatusBar,
    Arrange,
    ChromeDialog
  },
  data() {
    return {
      userInfo: sessionStorage.getItem('userInfo'),
      timer: null,
      audio: null,
      // 播放线
      playLine: {
        current: 0 // 当前的位置, px
      },
      playStartTime: 0, // 从第几秒开始播放
      dialogShow: false,
      isAddAc: 1
    }
  },
  created() {
    this.$root.$on('clickSpace', this.toPlay)
  },
  async mounted() {
    reportEvent('audioedit-page-exposure', 147622)
    Editor.getInstance().setVm(this.$root).setStore(this.$store)
    await this.getEditorDetail()
    this.storeStagePitchesWatcher = this.$store.watch(
      state => state.change.stagePitches,
      (newValue, oldValue) => {
        // console.log('watch store', oldValue, newValue)
        this.$store.dispatch('const/changeState', { isStagePitchesChanged: true})
      },
      {
        deep: true
      }
    )
    this.$store.dispatch('const/updateStageSize')
    await this.$nextTick()
    document.addEventListener('mousemove', this.mousemoveListener)
    document.addEventListener('mousewheel', this.mousewheelListener, { passive: false })
    if (!isChrome && !localStorage.getItem('hasShowDialog')) {
      this.dialogShow = true
      localStorage.setItem('hasShowDialog', true)
    }
  },
  destroyed() {
    this.storeStagePitchesWatcher()
    this.resetStoreState()
    if (audio) {
      audio.pause() // 要把播放的暂停了
    }
    if (waveSurfer.getWaveSurfer()) {
      waveSurfer.getWaveSurfer().pause()
      waveSurfer.clearWaveSurfer()
    }
    this.$root.$off('clickSpace', this.toPlay)
    Editor.getInstance().clear()
    document.removeEventListener('mousemove', this.mousemoveListener)
    document.removeEventListener('mousewheel', this.mousewheelListener)
    clearTimeout(this.timer)
  },
  computed: {
    noteWidth() {
      return this.$store.state.const.noteWidth
    },
    noteHeight() {
      return this.$store.state.const.noteHeight
    },
    bpm() {
      return this.$store.state.const.bpm
    },
    isSynthetizing() {
      return this.$store.state.const.isSynthetizing
    },
    playState() {
      return this.$store.state.const.playState
    },
    isManualMovedLine() { // 是否手动移动了线
      return this.$store.state.const.lineLeft !== this.playLine.current
    },
    isStagePitchesChanged() {
      return this.$store.state.const.isStagePitchesChanged
    },
    stagePitches() {
      return this.$store.state.change.stagePitches
    },
    trackList() {
      return this.$store.state.change.trackList
    },
    stageWidth() {
      return this.$store.getters['const/stageWidth']
    },
    scale() {
      return this.$store.getters['const/scale']
    }
  },
  methods: {
    mousemoveListener(e) {
      this.$store.commit('const/changeState', { mousePos: {
        x: e.x,
        y: e.y,
        clientX: e.clientX,
        clientY: e.clientY,
        layerX: e.layerX,
        layerY: e.layerY
      }})
    },
    mousewheelListener(e) {
      const oldNoteWidth = this.$store.state.const.noteWidth
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
        if (e.wheelDelta < 0) {
          if (this.$store.state.const.noteWidth <= 10) {
            return false
          }
          this.$store.state.const.noteWidth -= 1
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            const arrangeStageConWidth = this.$store.state.const.arrangeStage.width
            while (arrangeStageConWidth > this.stageWidth / 10) { // 音轨页面的宽高比里面舞台需要的大
              this.$store.dispatch('const/updateMatter', 15)
            }
          }, 250)
        } else if (e.wheelDelta > 0) {
          if (this.$store.state.const.noteWidth >= 80) {
            return false
          }
          this.$store.state.const.noteWidth += 1
        }
        // 缩放音块
        if (this.stagePitches.length > 0) {
          this.zoomStagePitches(oldNoteWidth)
        }
        // 缩放伴奏
        if (waveSurfer.getWaveSurfer()) {
          this.zoomWaveSurfer(oldNoteWidth)
        }
      }
    },
    zoomStagePitches(oldNoteWidth) {
      const oldNote = oldNoteWidth
      const newNoteWidth = this.$store.state.const.noteWidth
      this.stagePitches.forEach(item => {
        item.left = item.left * newNoteWidth / oldNote
        item.width = item.width * newNoteWidth / oldNote
        if (item.breath) {
          item.breath.left = item.breath.left * newNoteWidth / oldNote
          item.breath.width = item.breath.width * newNoteWidth / oldNote
        }
      })
    },
    zoomWaveSurfer(oldNoteWidth) {
      // console.log('zoomWaveSurfer:', oldNoteWidth)
      // 缩放音波宽度和音波
      const duration = waveSurfer.getWaveSurfer().getDuration()
      const newNoteWidth = this.$store.state.const.noteWidth
      this.$store.state.change.waveWidth = this.$store.state.change.waveWidth * newNoteWidth / oldNoteWidth
      waveSurfer.getWaveSurfer().zoom(this.$store.state.change.waveWidth / duration)
      // 缩放最左边距离
      this.trackList[1].offset = this.trackList[1].offset * newNoteWidth / oldNoteWidth
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
      this.$store.dispatch('const/changeState', { playState: stateValue })
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
    async getMusicXml2Json(xml2JsonReq) {
      const res = await musicXml2Json(xml2JsonReq)
      return res.data.data
    },
    saveF0DrawChange(f0Ai, f0Draw) {
      const changed = {}
      const pitchWidth = this.$store.getters['const/pitchWidth']
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
      this.$store.state.change.changedLineMap = changed
    },
    acInfo2TrackList(acInfo, bpm) {
      let acInfos = acInfo
      if (acInfos.length === 0) {
        acInfos = this.$store.state.change.trackList
      }
      const trackList = JSON.parse(JSON.stringify(acInfos))
      trackList.forEach(item => {
        item.offset = timeToPx(item.offset, this.noteWidth / 10, bpm)
      })
      return trackList
    },
    async getEditorDetail() {
      const taskId = getParam('taskId') || 0
      const musicId = getParam('musicId') || 0
      if (taskId) { // 从我的曲谱编辑按钮进来，如果从我的作品的编辑按钮进来就同时有taskId和musicId
        const res = await editorDetail({ task_id: taskId })
        const data = res.data.data
        const pitchList = data.pitchList
        const stagePitches = pitchList2StagePitches(pitchList, '', this)
        const trackList = this.acInfo2TrackList(data.ac_info, pitchList[0].bpm)
        const stageMousePos = {
          x: trackList[1]?.offset,
          y: 0
        }
        await this.$store.dispatch('const/changeState', {
          taskId: data.task_id,
          onlineUrl: data.online_url,
          bpm: pitchList[0].bpm,
          toneName: pitchList[0].singer,
          toneId: pitchList[0].toneId,
          musicId: musicId ? musicId : data.music_id, // 从我的作品进来有musicId就用这个，没的话，就用之前保存的
          musicName: data.music_name
        })
        const f0Draw = data.f0_draw
        await this.$store.dispatch('change/changeState', {
          f0AI: data.f0_ai,
          f0Draw,
          stagePitches: stagePitches,
          volumeMap: this.convertXyMap(data.volume_xy),
          tensionMap: this.convertXyMap(data.tension_xy),
          trackList: trackList,
          stageMousePos: stageMousePos
        })
        this.saveF0DrawChange(data.f0_ai, f0Draw)
        if (trackList[1].file) {
          this.$store.dispatch('change/showWaveSurfer', { file: trackList[1]?.file, type: 'url' })
        }
      } else if (musicId) { // 从编辑页面或者修改歌词页面进来
        const musicInfo = await this.getMusicInfo(musicId)
        const musicXml2Json = await this.getMusicXml2Json(JSON.parse(sessionStorage.getItem('xml2JsonReq')))
        console.log('musicInfo:', musicInfo)
        let stagePitches = []
        if (musicInfo.bus_type === 1) { // 从正常的xml转过来，给的是格子数
          stagePitches = pitchList2StagePitches(musicXml2Json.pitchList, 'grid', this)
        } else { // 从我自己生成的曲谱过来，给的是时间
          stagePitches = pitchList2StagePitches(musicXml2Json.pitchList, '', this)
        }
        // 重置F0Draw
        let f0Draw = musicXml2Json.f0_draw
        const resetF0Draw = parseInt(getParam('resetF0Draw'), 10)
        if (musicInfo.bus_type === 2 && resetF0Draw === 1) {
          f0Draw = []
        }
        const trackList = this.acInfo2TrackList(musicXml2Json.ac_info, musicXml2Json.pitchList[0].bpm)
        const stageMousePos = {
          x: trackList[1]?.offset,
          y: 0
        }
        this.$store.dispatch('const/changeState', {
          taskId: getParam('arrangeId') || musicXml2Json.task_id,
          musicId: musicId,
          bpm: musicXml2Json.pitchList[0].bpm,
          toneName: musicXml2Json.pitchList[0].singer,
          toneId: musicXml2Json.pitchList[0].toneId,
          musicName: `${musicInfo.name}填词`,
          pitchChanged: true // 标记音块改动了，这样才能重新拉到辅音
        })
        this.$store.dispatch('change/changeState', {
          stagePitches: stagePitches,
          f0AI: musicXml2Json.f0_ai,
          f0Draw: f0Draw,
          volumeMap: this.convertXyMap(musicXml2Json.volume_xy),
          tensionMap: this.convertXyMap(musicXml2Json.tension_xy),
          trackList: trackList,
          stageMousePos: stageMousePos
        })
        this.saveF0DrawChange(musicXml2Json.f0_ai, f0Draw)
        if (trackList[1].file) {
          this.$store.dispatch('change/showWaveSurfer', { file: trackList[1]?.file, type: 'url' })
        }
        this.$store.dispatch('change/getPitchLine')
        this.$store.dispatch('change/saveFuYuan')
      }
      this.$store.dispatch('const/adjustStageWidth')
    },
    isNeedGenerate(type) {
      // 舞台音块改变
      if (this.isStagePitchesChanged) {
        return true
      }
      // 音高线变化
      if (this.$store.state.const.isPitchLineChanged) {
        return true
      }

      // 响度改变了
      if (this.$store.state.const.isVolumeChanged) {
        return true
      }

      // 张力改变了
      if (this.$store.state.const.isTensionChanged) {
        return true
      }

      // 元辅音改变了
      if (this.$store.state.const.isStagePitchElementChanged) {
        return true
      }

      // 伴奏改变了
      if (this.$store.state.const.isObbligatoChanged) {
        return true
      }

      // 静音播放改变了
      if (this.$store.state.const.isTrackChanged) {
        return true
      }

      // 没有可播放的url
      if (!this.$store.state.const.onlineUrl && type !== 'upload') {
        return true
      }

      return false
    },
    async toPlay() {
      const trackMode = this.$store.getters['change/trackMode']
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
          this.changePlayState(PlayState.StatePaused)
        } else {
          this.changePlayState(PlayState.StatePlaying)
        }
        waveSurferObj.playPause()
        this.toSaveSynthesize()
        const waveOffset = this.trackList[1].offset
        waveSurferObj.on('audioprocess', (process) => {
          const left = timeToPx(process * 1000, this.noteWidth / 10, this.bpm)
          const currentPosition = (left + waveOffset) * 10
          this.changeLinePosition(currentPosition, true)
        })
        waveSurferObj.on('finish', () => {
          const time = this.$store.state.const.wavePlayStartTime
          waveSurfer.setCurrentTime(time)
          const left = (timeToPx(time * 1000, this.noteWidth / 10, this.bpm) + waveOffset) * 10
          this.$store.dispatch('const/changeState', { lineLeft: left })
          this.changePlayState(PlayState.StatePaused)
        })
      } else {
        Message.error('伴奏音轨没有伴奏哦~')
      }
    },
    async toSaveSynthesize() {
      const handleData = this.handleVolumeTension()
      const acInfo = this.handleAcInfo()
      const req = {
        pitchList: this.$store.getters['change/pitchList'],
        f0_ai: this.$store.state.change.f0AI,
        f0_draw: this.$store.state.change.f0Draw,
        task_id: this.$store.state.const.taskId,
        volume_data: handleData.f0Volume,
        tension_data: handleData.f0Tension,
        volume_xy: handleData.volumeXy,
        tension_xy: handleData.tensionXy,
        music_id: this.$store.state.const.musicId,
        music_name: this.$store.state.const.musicName,
        ac_info: acInfo,
        is_add_ac: 0
      }
      const { data } = await editorSynth(req)
      if (data.ret_code !== 0) {
        console.log(`保存数据失败, 错误信息:${data.err_msg}, 请重试~`)
        return
      } else {
        console.log(`保存数据成功, paramId: ${data.data.param_id}, taskId: ${data.data.task_id}`)
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
      if (!this.$store.getters['change/pitchList'].length) {
        Message.error('没有音符！！')
        return
      }
      if (this.$store.state.const.isGetF0Data) {
        Message.error(`网络不好，请稍后重试~`)
        return
      }

      const lastStagePitches = this.stagePitches[this.stagePitches.length - 1]
      const lastStagePitchRight = lastStagePitches.left + lastStagePitches.width
      const banEndX = this.trackList[1].offset * 10 + this.$store.state.change.waveWidth * 10
      let maxRight = lastStagePitchRight
      if (waveSurfer.getWaveSurfer()) {
        maxRight = Math.max(lastStagePitchRight, banEndX)
        waveSurfer.setCurrentTime(0)
      }
      if (this.$store.state.const.lineLeft > maxRight && this.playState !== PlayState.StatePlaying) {
        Message.error('播放线后没有音符或伴奏！！')
        return
      }
      console.log(`Click play button, current state: ${this.playState}`)

      const taskId = getParam('taskId')
      // 如果当前是默认状态
      if (this.playState === PlayState.StateNone) {
        if (this.isNeedGenerate()) {
          this.doPlay(true)
        } else {
          if (taskId) { // 从编辑进来，url上有taskId
            this.toPlayAudio(this.$store.state.const.onlineUrl)
            this.doPlay(false)
          } else {
            this.doPlay(true)
          }
        }
        this.changePlayState(PlayState.StatePlaying)
      } else if (this.playState === PlayState.StatePlaying) {
        audio.pause()
        this.changePlayState(PlayState.StatePaused)
      } else if (this.playState === PlayState.StatePaused) {
        if (this.isNeedGenerate()) {
          this.doPlay(true)
        } else if(this.isManualMovedLine) {
          this.doPlay(false)
        } else {
          this.doPlay(false, true)
        }
        this.changePlayState(PlayState.StatePlaying)
      } else if (this.playState === PlayState.StateEnded) {
        if (this.isNeedGenerate()) {
          this.doPlay(true)
        } else if(this.isManualMovedLine) {
          this.doPlay(false)
        } else {
          this.doPlay(false)
        }
        this.changePlayState(PlayState.StatePlaying)
      }
      this.$store.dispatch('const/changeState', { isStagePitchesChanged: false, isVolumeChanged: false, isTensionChanged: false, isStagePitchElementChanged: false, isPitchLineChanged: false, isObbligatoChanged: false, isTrackChanged: false })
    },
    async doPlay(generator = true, isContinue = false) {
      const { startTime } = this.getLinePosition()
      console.log(`doPlay generator:${generator}, isContinue:${isContinue}, startTime: ${startTime}`)

      if (generator) {
        const { onlineUrl } = await this.toSynthesize(this.isAddAc)
        // 每次生成新的都存起来
        this.$store.dispatch('const/changeState', { onlineUrl })
        this.toPlayAudio(onlineUrl)
        this.playStartTime = startTime
        audio.currentTime = startTime
        audio.play()
      } else {
        if (isContinue) {
          console.log(`play continue with start}`)
          audio.play()
        } else {
          this.playStartTime = startTime
          audio.currentTime = startTime
          audio.play()
        }
      }
    },
    toPlayAudio(url) {
      audio = PlayAudio({
        url,
        onPlay: (audio) => {
          const ticker = () => {
            if (this.playState === PlayState.StatePlaying) {
              if (audio.duration) {
                const currentPosition = timeToPx(audio.currentTime * 1000, this.noteWidth, this.bpm)
                // console.log(`ticker: duration:${audio.duration}, currentTime:${audio.currentTime}, currentPosition`, currentPosition)
                this.changeLinePosition(currentPosition, true)
              }
              requestAnimationFrame(ticker)
            }
          }

          requestAnimationFrame(ticker)
        },
        onPause: (dom) => {
        },
        onEnd: () => {
          this.changePlayState(PlayState.StateEnded)
          // 回到开始播放的位置
          const resumePosition = timeToPx(this.playStartTime * 1000, this.noteWidth, this.bpm)
          this.changeLinePosition(resumePosition, true)
        }
      })
    },
    changeLinePosition(left, autoScroll = false) {
      if (autoScroll) {
        const { width, scrollLeft } = this.$store.state.const.stage
        const max = scrollLeft + width // 滚动的大小加上容器的大小就是容器最右边的位置
        if (left > max) {
          this.$refs.BeatContainer.scrollTo(max)
        } else if  (left < scrollLeft) { // 线的位置小于滚动条的滚动位置说明线在左边看不到
          this.$refs.BeatContainer.scrollTo(left)
        }
        this.scrollArrange(left)
      }
      this.playLine.current = left
      this.$store.dispatch('const/changeState', { lineLeft: left })
    },
    scrollArrange(left) {
      const { width, scrollLeft } = this.$store.state.const.arrangeStage
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
      if (item.hasOwnProperty('preTime')) {
        left = item.left - timeToPx(item.preTime, this.noteWidth, this.bpm)
      }
      return left
    },
    getStagePitchRightPosition(item) {
      return item.left + item.width
    },
    getLinePosition() {
      const lineLeft = this.$store.state.const.lineLeft // 根据播放线的距离去获取相应的块
      const trackMode = this.$store.getters['change/trackMode']
      let lineStartX = null
      let isLineInStagePitchRange = false
      // 音块的最左边和最右边
      // let minLeft, maxRight
      this.stagePitches.forEach((item, idx) => {
        const right = this.getStagePitchRightPosition(item)
        if (lineLeft < right && trackMode !== TrackMode.TrackModeAll) {
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

      // 特殊场景：如果伴奏在音块前面，并且是同时播放的情况，伴奏最左边比第一个音符小
      const firstPitch = this.stagePitches[0]
      if (this.trackList[1].offset * 10 < this.getStagePitchLeftPosition(firstPitch) && lineLeft <= this.trackList[1].offset * 10 && trackMode === TrackMode.TrackModeAll && waveSurfer.getWaveSurfer()) {
        lineStartX = this.trackList[1].offset * 10
      }
      // 有伴奏，在最左边，都播放，第一个音符比线小
      if (firstPitch.left < this.trackList[1].offset * 10 && lineLeft < this.getStagePitchLeftPosition(firstPitch) && trackMode === TrackMode.TrackModeAll && waveSurfer.getWaveSurfer()) {
        lineStartX = this.getStagePitchLeftPosition(firstPitch)
      }
      // 没有伴奏，在第一个音符最左边，都播放
      if (trackMode === TrackMode.TrackModeAll && !waveSurfer.getWaveSurfer() && lineLeft < this.getStagePitchLeftPosition(firstPitch)) {
        lineStartX = this.getStagePitchLeftPosition(firstPitch)
      }
      console.log('lineStartX:', lineStartX)
      const startTime = pxToTime(lineStartX, this.noteWidth, this.bpm) / 1000
      return {
        startTime
      }
    },
    handleVolumeTension() {
      const pitchWidth = this.$store.getters['const/pitchWidth']
      const volumeMap = this.$store.state.change.volumeMap
      const tensionMap = this.$store.state.change.tensionMap
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
      console.log('pitchWidth:', pitchWidth)
      const apart = pitchWidth / this.scale
      for (let i = 0; i < volumeXy.length; i += apart) {
        if (volumeXy[Math.round(i)]) {
          f0Volume.push(parseInt(volumeXy[Math.round(i)].y, 10))
        }
      }
      for (let i = 0; i < tensionXy.length; i += apart) {
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
      acInfo[0].file = this.$store.state.const.onlineUrl
      acInfo[0].offset = this.$store.getters['change/pitchList'][0]?.startTime || 0
      acInfo[1].offset = pxToTime(acInfo[1].offset, this.noteWidth / 10, this.bpm)
      return acInfo
    },
    getAlteredTime() {
      // [{stb,st,et}, {stb,st,et}]
      const { changedLineMap } = this.$store.state.change
      const alteredTime = Editor.getInstance().diff.diffChangeLineMap({ changedLineMap })
      return alteredTime
    },
    async toSynthesize(isAddAc, callback) {
      this.$store.dispatch('const/changeState', { isSynthetizing: true })
      const sStart = Date.now()
      const handleData = this.handleVolumeTension()
      const acInfo = this.handleAcInfo()
      const alteredTime = this.getAlteredTime()
      const req = {
        pitchList: this.$store.getters['change/pitchList'],
        f0_ai: this.$store.state.change.f0AI,
        f0_draw: this.$store.state.change.f0Draw,
        task_id: this.$store.state.const.taskId,
        volume_data: handleData.f0Volume,
        tension_data: handleData.f0Tension,
        volume_xy: handleData.volumeXy,
        tension_xy: handleData.tensionXy,
        music_id: this.$store.state.const.musicId,
        music_name: this.$store.state.const.musicName,
        ac_info: acInfo,
        is_add_ac: isAddAc, // 是否需要合成伴奏,0为不需要，1为需要
        altered_time: alteredTime
      }
      const { data } = await editorSynth(req)
      console.log('editorSynth:', data)
      if (data.ret_code !== 0) {
        Message.error(`合成失败, 错误信息:${data.err_msg}, 请重试~`)
        return
      }

      const paramId = data.data.param_id
      const taskId = data.data.task_id

      this.$store.dispatch('const/changeState', { taskId: taskId })
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
              // 合成成功把之前的changedLineMap存起来，用于下次合成对比
              const { changedLineMap } = this.$store.state.change
              Editor.getInstance().diff.setBefore({ changedLineMap })
              break
            }
        } else {
          Message.success(`算法努力合成音频中(${ProcessStatus[data.data.status]}%)`)
        }
        await sleep(2000)
        const sEnd = Date.now()
        const duration = sEnd - sStart
        console.log(`synthesize duration: ${duration}, synthesize start: ${sStart}, synthesize end: ${sEnd}`)
        if (duration > 40 * 1000) {
          Message.error('音频合成失败，请稍后再试~')
          this.$store.dispatch('const/changeState', { isSynthetizing: false })
          this.changePlayState(PlayState.StateNone) // 合成失败，要把合成状态改回来
          break
        }
      }

      this.$store.dispatch('const/changeState', { isSynthetizing: false })
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
