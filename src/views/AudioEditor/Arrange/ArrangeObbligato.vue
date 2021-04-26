<template>
  <div
    ref="Obbligato"
    :class="$style.obbligato"
    id="obbligato"
    @click.right.stop.prevent.exact="onRightClickStage"
    @mousedown.self="onStageMouseDown"
    :style="{
      width: `${$store.getters.stageWidth / 10}px`,
      height: `${$store.getters.stageHeight / 20}px`,
      top: `${$store.getters.stageHeight / 20}`
    }">
    <div
      id="waveform"
      ref="WaveForm"
      :class="[$style.waveform, showWaveBorder ? $style.isActive : '']"
      :style="{
        width: `${waveWidth}px`,
        height: `${$store.getters.stageHeight / 20}px`,
        transform: `translateX(${trackList[1].offset}px)`
      }"
      @mousedown="onWaveMouseDown"
      @mousemove="onWaveMouseMove"
      @mouseup="onWaveMouseUp"
      @mouseleave="onWaveMouseUp"
      @click.right.stop.prevent.exact="onRightClickWave"
    >
    </div>
    <div
      :class="$style.delete"
      v-if="showDelete"
      @click="deleteObbligato"
      :style="{
        top: `${waveMousePos.y}px`,
        left: `${waveMousePos.x}px`
      }"
    >删除</div>
    <div
      :class="$style.list"
      v-if="showMenu"
      :style="{
        top: `${$store.state.stageMousePos.y}px`,
        left: `${$store.state.stageMousePos.x}px`
      }"
      @click="selectObbligato"
    >选择伴奏文件</div>
    <!-- diaplay none -->
    <Upload
      ref="upload"
      accept=".wav, .mp3"
      :on-change="uploadChange"
      :auto-upload="false"
      :multiple="false"
      :show-file-list="false"
      :with-credentials="true"
      action="/">
      <div id="uploadBanzou"></div>
    </Upload>
  </div>
</template>

<script>
import { Upload, Message } from 'element-ui'
import { uploadFile } from '@/common/utils/upload'
import { playState } from "@/common/utils/const"
import * as waveSurfer from '@/common/utils/waveSurfer'

export default {
  name: 'ArrangeObbligato',
  components: {
    Upload,
    Message
  },
  data() {
    return {
      showMenu: false,
      showDelete: false,
      waveMousePos: null, // 伴奏音波鼠标右键的位置
      showWaveBorder: false,
      isWaveMouseDown: false,
      waveStartPos: null,
      waveEndPos: null
    }
  },
  mounted() {
    document.getElementById('obbligato').oncontextmenu = (e) => {
      // 右键基础事件被阻止掉了
      return false
    }
  },
  computed: {
    trackList() {
      return this.$store.state.trackList
    },
    playState() {
      return this.$store.state.playState
    },
    waveWidth() {
      return this.$store.state.waveWidth
    }
  },
  methods: {
    async uploadChange(file) {
      const fileNameArr = file.raw.name.split('.')
      const type = fileNameArr[fileNameArr.length - 1]
      const allowType = ['mp3', 'wav']

      if (allowType.indexOf(type) === -1) {
        Message.error('只能上传mp3或wav的文件～')
        return
      }
      this.showMenu = false
      this.$store.dispatch('showWaveSurfer', { file: file.raw, type: 'blob' })
      uploadFile(file.raw, 'analyze', (url) => {
        this.$store.state.trackList[1].file = url
      })
    },
    onRightClickStage(event) {
      // 伴奏音轨鼠标右键
      console.log('onRightClickStage:', event)
      const rect = this.$refs.Obbligato.getBoundingClientRect()
      this.$store.state.stageMousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.showMenu = true
    },
    onRightClickWave(event) {
      // 鼠标右键在伴奏上
      console.log('onRightClickWave:', event)
      this.waveMousePos = {
        x: event.layerX,
        y: event.layerY
      }
      // console.log('waveMousePos:', this.waveMousePos)
      this.showWaveBorder = true
      this.showMenu = false
      this.showDelete = true
    },
    onWaveMouseDown(event) {
      this.showMenu = false
      this.showDelete = false
      // console.log('onWaveMouseDown:', event)
      if (this.playState === playState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.showWaveBorder = true
      this.isWaveMouseDown = true
      this.$refs.WaveForm.style.height = '48px'
      waveSurfer.getWaveSurfer().setHeight(48)
      const rect = this.$refs.WaveForm.getBoundingClientRect()

      this.waveStartPos = {
        x: event.clientX - rect.left,
        left: this.trackList[1].offset
      }
      this.$refs.WaveForm.style.opacity = 0.8
      document.addEventListener('mousemove', this.onWaveMouseMove)
      document.addEventListener('mouseleave', this.onWaveMouseUp)
    },
    onWaveMouseMove(event) {
      if (this.isWaveMouseDown) {
        // console.log('onWaveMouseMove', event)
        this.showWaveBorder = true

        const rect = this.$refs.WaveForm.getBoundingClientRect()

        this.waveEndPos = {
          x: event.clientX - rect.left
        }
        const moveX = this.waveEndPos.x - this.waveStartPos.x

        let newLeft = this.trackList[1].offset + moveX

        if (newLeft < 0) {
          newLeft = 0
        }
        const arrangeStageWidth = this.$store.getters.stageWidth / 10
        if (newLeft + this.waveWidth > arrangeStageWidth) {
          newLeft = arrangeStageWidth - this.waveWidth
        }

        this.$store.state.trackList[1].offset = newLeft
        this.$store.dispatch('changeStoreState', { isObbligatoChanged: true })
      }
    },
    onWaveMouseUp(event) {
      // console.log('onWaveMouseUp', event)
      if (this.isWaveMouseDown) {
        this.isWaveMouseDown = false
      }
      this.$refs.WaveForm.style.opacity = 1

      document.removeEventListener('mousemove', this.onWaveMouseMove)
      document.removeEventListener('mouseleave', this.onWaveMouseUp)
    },
    onStageMouseDown() {
      // 鼠标点击伴奏舞台
      this.showWaveBorder = false
      this.showMenu = false
      this.showDelete = false
    },
    deleteObbligato() {
      this.showDelete = false
      this.showWaveBorder = false
      waveSurfer.clearWaveSurfer()
      this.$store.dispatch('changeStoreState', { waveWidth: 0, isObbligatoChanged: true })
    },
    selectObbligato() {
      this.showMenu = false
      const waveSurferObj = waveSurfer.getWaveSurfer()
      if (waveSurferObj) {
        Message.error('最多只能添加一个音频')
        return
      }
      document.getElementById('uploadBanzou').click()
    }
  }
}
</script>

<style lang="less" module>
.obbligato {
  position: absolute;
  left: 0;
  top: 56.25px;
}
.waveform {
  position: absolute;
  top: 0;
  left: 0;
  height: 50px;
  width: 0;
  &.isActive {
    background: rgba(255,255,255,0.07);
    border-radius: 5px;
    border: 2px solid #6C6C6C;
    // border: 1px solid red;
    height: 46px;
  }
}


.list {
  width: 96px;
  height: 26px;
  background: #151517;
  border-radius: 4px;
  text-align: center;
  line-height: 26px;
  font-size: 12px;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.8;
  }
}

.delete {
  background: #151517;
  width: 48px;
  height: 26px;
  border-radius: 4px;
  line-height: 26px;
  text-align: center;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>
