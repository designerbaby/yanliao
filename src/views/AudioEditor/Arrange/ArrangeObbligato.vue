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
      :class="$style.waveform"
      :style="{
        width: `${this.waveWidth}px`,
        height: `${$store.getters.stageHeight / 20}px`,
        left: `${mousePos.x}px`
      }"
      @click.right.stop.prevent.exact="onRightClickWave"
    ></div>
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
      :action="action">
      <div id="uploadBanzou"></div>
    </Upload>

    <div
      :class="$style.delete"
      v-if="showDelete"
      @click="deleteObbligato"
    >删除</div>
  </div>
</template>

<script>
import WaveSurfer from 'wavesurfer.js'
import { Upload, Message } from 'element-ui'
import { timeToPx, getCookie, getAuthorization, camSafeUrlEncode } from '@/common/utils/helper'
import { getUserCredential } from '@/api/audioSource'
import { PlayAudio } from '@/common/utils/player'

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
      action: 'https://yan-1253428821.cos.ap-guangzhou.myqcloud.com/',
      file: '',
      audio: null,
      waveWidth: 0
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
      var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        backgroundColor: 'rgba(255,255,255,0.07)'
      })

      wavesurfer.load(url);
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
      wavesurfer.on('ready', function () {
        wavesurfer.play()
      })
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
    deleteObbligato() {
      console.log('deleteObbligato')
    },
    selectObbligato() {
      document.getElementById('uploadBanzou').click()
    },
    async getUserCredential() {
      const res = await getUserCredential()
      return res.data
    },
    async uploadChange(file) {
      console.log('file:', file)
      this.showMenu = false
      this.file = file.raw
      const method = 'PUT'
      const mxUid = getCookie('mx_uid')
      Message.success('开始解析伴奏中')
      const key = `file/${mxUid}/${this.file.name}`
      const { data } = await this.getUserCredential()
      const info = await getAuthorization(method, key, data)
      const Authorization = info.Authorization   // 得到的签名
      const XCosSecurityToken = info.XCosSecurityToken // 得到的sessionToken
      this.uploadFile(method, key, Authorization, XCosSecurityToken, (err, data) => {
        if (err) {
          Message.error(err)
        } else {
          console.log('url:', data.url)
          this.showWaveSurfer(data.url)
        }
      })
    },
    uploadFile(method, key, Authorization, XCosSecurityToken, callback) {
      var url = `${this.action}${camSafeUrlEncode(key).replace(/%2F/g, '/')}`
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Authorization', Authorization);
      XCosSecurityToken && xhr.setRequestHeader('x-cos-security-token', XCosSecurityToken)
      xhr.upload.onprogress = (e) => {
        const percentage = parseFloat(Math.round(e.loaded / e.total * 10000) / 100)
        console.log(`解析进度: ${percentage}%`)
        // Message.success(`解析进度${percentage}%`)
      };
      xhr.onload = () => {
        if (/^2\d\d$/.test('' + xhr.status)) {
          var ETag = xhr.getResponseHeader('etag')
          callback(null, {url: url, ETag: ETag})
        } else {
          callback(`文件${key}上传失败，状态码：${xhr.status}`)
        }
      };
      xhr.onerror = () => {
        callback(`文件${key}上传失败，请检查是否没配置 CORS 跨域规则`)
      };
      xhr.send(this.file);
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
  height: 56px;
  width: 0;
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
