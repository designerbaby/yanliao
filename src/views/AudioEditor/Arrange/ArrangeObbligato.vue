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
        width: `${this.waveWidth}px`,
        height: `${$store.getters.stageHeight / 20}px`,
        transform: `translateX(${mousePos.x}px)`
      }"
      @mousedown="onWaveMouseDown"
      @mousemove="onWaveMouseMove"
      @mouseup="onWaveMouseUp"
      @mouseleave="onWaveMouseUp"
      @click.right.stop.prevent.exact="onRightClickWave"
    >
      <div
        :class="$style.delete"
        v-if="showDelete"
        @click="deleteObbligato"
      >删除</div>
    </div>
    <div
      :class="$style.list"
      v-if="showMenu"
      :style="{
        top: `${mousePos.y}px`,
        left: `${mousePos.x}px`
      }"
      @click="selectObbligato"
    >选择伴奏文件</div>
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
import { PlayAudio } from '@/common/utils/player'
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
      mousePos: {
        x: 0,
        y: 0
      },
      audio: null,
      waveWidth: 0,
      isWaveMouseDown: false,
      waveStartPos: null,
      wavesurfer: null
    }
  },
  mounted() {
    document.getElementById('obbligato').oncontextmenu = (e) => {
      // 右键基础事件被阻止掉了
      return false
    }
  },
  methods: {
    showWaveSurfer(url) {
      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        backgroundColor: 'rgba(255,255,255,0.07)',
        height: 56
      })
      this.wavesurfer.load(url);
      this.audio = PlayAudio({
        url,
        onPlay: (audio) => {
          console.log('playing')
        },
        onPause: (dom) => {
          console.log('pause')
        },
        onEnd: () => {
          console.log('end')
        }
      })
      this.audio.addEventListener('canplay', () => {
        console.log('audio.duration:', this.audio.duration)
        this.waveWidth = timeToPx(this.audio.duration * 1000, this.$store.state.noteWidth / 10, this.$store.state.bpm)
        console.log('this.waveWidth:', this.waveWidth)
      })
      // wavesurfer.on('ready', function () {
      //   wavesurfer.play()
      // })
    },
    onRightClickStage(event) {
      const rect = this.$refs.Obbligato.getBoundingClientRect()
      this.mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.showMenu = true
    },
    onRightClickWave() {
      this.showDelete = true
    },
    onWaveMouseDown(event) {
      this.isWaveMouseDown = true
      const rect = this.$refs.WaveForm.getBoundingClientRect()

      this.waveStartPos = {
        x: event.clientX - rect.left
      }
      event.target.style.opacity = 0.8
      document.addEventListener('mousemove', this.onWaveMouseMove)
      document.addEventListener('mouseleave', this.onWaveMouseUp)
    },
    onWaveMouseMove(event) {
      if (this.waveStartPos) {
        const moveX = event.clientX - this.waveStartPos.clientX
        const target = event.target
        const newLeft = target.left + moveX
        target.style.transform = `translateX(${newLeft}px)`
        target.dataset.left = newLeft
      }
    },
    onWaveMouseUp(event) {
      if (this.waveStartPos) {

      }
      event.target.style.opacity = 1
      document.removeEventListener('mousemove', this.onWaveMouseMove)
      document.removeEventListener('mouseleave', this.onWaveMouseUp)
    },
    deleteObbligato() {
      console.log('deleteObbligato')
      this.wavesurfer.destroy()
    },
    selectObbligato() {
      document.getElementById('uploadBanzou').click()
    },
    async uploadChange(file) {
      console.log('uploadChange file:', file)
      this.showMenu = false
      uploadFile(file.raw, 'analyze', (url) => {
        Message.success('解析成功～')
        this.showWaveSurfer(url)
      })
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
