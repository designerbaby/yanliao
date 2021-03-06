<template>
  <div
    ref="Obbligato"
    :class="$style.obbligato"
    id="obbligato"
    @click.right.stop.prevent.exact="onRightClickStage"
    :style="{
      width: `${$store.getters['const/stageWidth'] / 10}px`,
      height: `${$store.getters['const/stageHeight'] / 20}px`,
      top: `${$store.getters['const/stageHeight'] / 20}`
    }">
    <Dragger
      @on-start="onStart($event)"
      @on-move="onMove($event)"
      @on-end="onEnd($event)"
    >
      <div
        id="waveform"
        ref="WaveForm"
        :class="[$style.waveform, waveActive ? $style.isActive : '']"
        :style="{
          width: `${waveWidth}px`,
          height: '48px',
          transform: `translateX(${trackList[1].offset}px)`
        }"
        @click.right.stop.prevent.exact="onRightClickWave"
      >
      </div>
    </Dragger>
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
        top: `${$store.state.change.stageMousePos.y}px`,
        left: `${$store.state.change.stageMousePos.x}px`
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
import { PlayState } from "@/common/utils/const"
import * as waveSurfer from '@/common/utils/waveSurfer'
import AddArrangeCommand from '@/common/commands/AddArrangeCommand'
import ChangeArrangeCommand from '@/common/commands/ChangeArrangeCommand'
import DeleteArrangeCommand from '@/common/commands/DeleteArrangeCommand'
import Dragger from '../Components/Dragger'

export default {
  name: 'ArrangeObbligato',
  components: {
    Upload,
    Message,
    Dragger
  },
  data() {
    return {
      showMenu: false,
      showDelete: false,
      waveMousePos: null, // 伴奏音波鼠标右键的位置
      waveActive: false,
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
    document.addEventListener('click', this.documentListener)
  },
  computed: {
    trackList() {
      return this.$store.state.change.trackList
    },
    playState() {
      return this.$store.state.const.playState
    },
    waveWidth() {
      return this.$store.state.change.waveWidth
    }
  },
  destroyed() {
    document.removeEventListener('click', this.documentListener)
  },
  methods: {
    documentListener(event) {
      this.showMenu = false
      this.showDelete = false
      const tagName = event.target.tagName
      if (tagName !== 'WAVE') {
        this.waveActive = false
      }
    },
    async uploadChange(file) {
      const fileNameArr = file.raw.name.split('.')
      const type = fileNameArr[fileNameArr.length - 1]
      const allowType = ['mp3', 'wav']

      if (allowType.indexOf(type) === -1) {
        Message.error('只能上传mp3或wav的文件～')
        return
      }

      uploadFile(file.raw, 'analyze', (url) => {
        this.$execute(new AddArrangeCommand(this.$editor(), url))
      })
    },
    onRightClickStage(event) {
      // 伴奏音轨鼠标右键
      // console.log('onRightClickStage:', event)
      const rect = this.$refs.Obbligato.getBoundingClientRect()
      this.$store.state.change.stageMousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      this.showMenu = true
    },
    onRightClickWave(event) {
      // 鼠标右键在伴奏上
      // console.log('onRightClickWave:', event)
      this.waveMousePos = {
        x: event.layerX,
        y: event.layerY
      }

      this.showDelete = true
    },
    onStart(event) {
      // console.log('onStart:', event)
      if (this.playState === PlayState.StatePlaying) {
        Message.error('正在播放中, 不能修改哦~')
        return
      }
      this.waveActive = true
      this.waveStartPos = {
        clientX: event.clientX,
        oldOffset: this.trackList[1].offset,
        newOffset: this.trackList[1].offset
      }
      this.$refs.WaveForm.style.opacity = 0.8
    },
    onMove(event) {
      if (this.waveStartPos) {
        // console.log('onMove', event)
        const moveX = event.clientX - this.waveStartPos.clientX
        let newOffset = this.waveStartPos.oldOffset + moveX
        // 达到最左边就只能是最左边了
        if (newOffset < 0) {
          newOffset = 0
        }
        const arrangeStageWidth = this.$store.getters['const/stageWidth'] / 10
        const arrangeFenziWidth = this.$store.getters['const/arrangeFenziWidth'] * this.$store.state.const.beatForm.fenzi
        // 达到最右边就扩展区域
        if (newOffset + this.waveWidth > arrangeStageWidth - arrangeFenziWidth) {
          // newLeft = arrangeStageWidth - this.waveWidth
          this.$store.dispatch('const/adjustStageWidth')
        }
        this.waveStartPos.newOffset = newOffset
        this.$store.state.change.trackList[1].offset = newOffset
      }
    },
    onEnd(event) {
      // console.log('onEnd:', event)
      if (this.waveStartPos) {
        const { oldOffset, newOffset } = this.waveStartPos
        this.waveStartPos = null
        this.$refs.WaveForm.style.opacity = 1
        this.$execute(new ChangeArrangeCommand(this.$editor(), oldOffset, newOffset))
      }
    },
    deleteObbligato() {
      this.showDelete = false
      this.waveActive = false
      this.$execute(new DeleteArrangeCommand(this.$editor()))
    },
    selectObbligato() {
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
  border: 0;
  cursor: pointer;
  &.isActive {
    background: rgba(255,255,255,0.07);
    border-radius: 5px;
    border: 2px solid #6C6C6C !important;
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
