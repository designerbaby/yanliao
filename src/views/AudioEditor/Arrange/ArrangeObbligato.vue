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
      :class="[$style.waveform, isWaveMouseDown ? $style.isActive : '']"
      :style="{
        width: `${waveWidth}px`,
        height: `${$store.getters.stageHeight / 20}px`,
        transform: `translateX(${waveformStyle.left}px)`
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
        top: `${stageMousePos.y}px`,
        left: `${stageMousePos.x}px`
      }"
      @click="selectObbligato"
    >选择伴奏文件</div>
    <!-- diaplay none -->
    <Upload
      ref="upload"
      :accept="'*'"
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
import WaveSurfer from 'wavesurfer.js'
import { Upload, Message } from 'element-ui'
import { timeToPx } from '@/common/utils/helper'
import { uploadFile } from '@/common/utils/upload'

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
      stageMousePos: { // 伴奏轨的位置
        x: 0,
        y: 0
      },
      waveWidth: 0,
      waveMousePos: null, // 伴奏音波鼠标右键的位置
      // audio: null,
      isWaveMouseDown: false,
      waveformStyle: {
        left: 0,
        top: 0
      },
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
    }
  },
  methods: {
    async uploadChange(file) {
      this.showMenu = false
      uploadFile(file.raw, 'analyze', (url) => {
        Message.success('解析成功～')
        this.showWaveSurfer(url)
      })
    },
    showWaveSurfer(url) {
      this.$store.state.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        backgroundColor: 'rgba(255,255,255,0.07)',
        height: 56,
        pixelRatio: 1,
        audioRate: (this.$store.state.bpm / 150).toFixed(2)
      })
      this.$store.state.wavesurfer.load(url);
      this.$store.state.wavesurfer.on('ready', () => {
        const duration = this.$store.state.wavesurfer.getDuration()
        this.waveWidth = timeToPx(duration * 1000, this.$store.state.noteWidth / 10, this.$store.state.bpm)
        console.log('duration:', duration)
      })
      this.waveformStyle.left = this.stageMousePos.x
    },
    onRightClickStage(event) {
      // 伴奏音轨鼠标右键
      console.log('onRightClickStage:', event)
      const rect = this.$refs.Obbligato.getBoundingClientRect()
      this.stageMousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.showMenu = true
    },
    onRightClickWave(event) {
      // 音波鼠标右键
      console.log('onRightClickWave:', event)
      this.waveMousePos = {
        x: event.layerX,
        y: event.layerY
      }
      console.log('waveMousePos:', this.waveMousePos)
      this.showDelete = true
    },
    onWaveMouseDown(event) {
      console.log('onWaveMouseDown:', event)
      this.$refs.WaveForm.style.height = '48px'
      this.$store.state.wavesurfer.setHeight(48)
      this.isWaveMouseDown = true
      const rect = this.$refs.WaveForm.getBoundingClientRect()

      this.waveStartPos = {
        x: event.clientX - rect.left,
        left: this.waveformStyle.left
      }
      this.$refs.WaveForm.style.opacity = 0.8
      document.addEventListener('mousemove', this.onWaveMouseMove)
      document.addEventListener('mouseleave', this.onWaveMouseUp)
    },
    onWaveMouseMove(event) {
      if (this.isWaveMouseDown) {
        const rect = this.$refs.WaveForm.getBoundingClientRect()
        console.log('onWaveMouseMove', event)
        this.waveEndPos = {
          x: event.clientX - rect.left
        }
        const moveX = this.waveEndPos.x - this.waveStartPos.x

        let newLeft = this.waveformStyle.left + moveX

        if (newLeft < 0) {
          newLeft = 0
        }
        this.waveformStyle.left = newLeft
      }
    },
    onWaveMouseUp(event) {
      console.log('onWaveMouseUp', event)
      if (this.isWaveMouseDown) {
        this.isWaveMouseDown = false
      }
      this.$refs.WaveForm.style.opacity = 1
      document.removeEventListener('mousemove', this.onWaveMouseMove)
      document.removeEventListener('mouseleave', this.onWaveMouseUp)
    },
    deleteObbligato() {
      this.showDelete = false
      this.waveWidth = 0
      this.$store.state.wavesurfer.destroy()
    },
    selectObbligato() {
      document.getElementById('uploadBanzou').click()
    },
    onStageMouseDown() {
      this.showMenu = false
      this.showDelete = false
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
