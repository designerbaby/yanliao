<template>
  <Dialog class="video-dialog" :visible.sync="videoDialogShow" @close="videoDialogClose">
    <div class="video-container">
      <video class="video" :src="currentVideoUrl" controls autoplay ref="dialogVideo">
        您的浏览器不支持 video 标签。
      </video>
      <img class="close-button" src="@/assets/icon-close.png" alt="" @click="closeButtonClick">
    </div>
  </Dialog>
</template>

<script>
import { Dialog } from 'element-ui'

export default {
  name: 'VideoDialog',
  data() {
    return {
      videoDialogShow: false,
      currentVideoUrl: ''
    }
  },
  components: {
    Dialog
  },
  computed: {
    videoGroup() {
      const currentVideoUrl = this.currentVideoUrl
      const type = currentVideoUrl.split(currentVideoUrl)[1] || 'mp4'
      switch (type) {
        case 'ogg':
          return {
            url: currentVideoUrl,
            type: 'video/ogg'
          }
          break
        case 'webm':
          return {
            url: currentVideoUrl,
            type: 'video/webm'
          }
          break
        case 'mov':
          return {
            url: currentVideoUrl,
            type: 'video/mov'
          }
          break
        case 'mp4':
          return {
            url: currentVideoUrl,
            type: 'video/mp4'
          }
          break
      }
    }
  },
  methods: {
    videoDialogClose() {
      const video = document.querySelector('.video')
      video.pause()
    },
    closeButtonClick() {
      this.videoDialogShow = false
      this.$nextTick(() => { // 暂停视频
        this.$refs.dialogVideo.pause()
      })
    },
    show(row) {
      console.log('VideoDialog show:', row)
      this.videoDialogShow = true
      this.currentVideoUrl = row.play_info[0].url
      this.$nextTick(() => {
        this.$refs.dialogVideo.play()
      })
    }
  }
}
</script>

<style lang="less">
.video-container {
  position: relative;
  display: flex;
  justify-content: center;
  .close-button {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin: -20px 10px;
  }
}
  .video-dialog {
    .el-dialog {
      background: none;
      box-shadow: none;
      text-align: center;
      .el-dialog__header {
        display: none;
      }
    }
  }
</style>
