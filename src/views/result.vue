<template>
  <div class="ending-page">
    <Header />
    <div class="title">音频创作完成</div>
    <div class="tips">请复制链接以便您重复下载/编辑您的作品</div>
    <div class="main">
      <div class="box">
        <img src="@/assets/icon-download.png" alt="">
        <button class="button download-button" @click="download">下载音频作品</button>
        <button class="button download-button" :data-clipboard-text="`${window.location.origin}/download/${this.$route.params.arrangeId}`" @click="copyUrl('download')">复制下载链接</button>
      </div>
      <div class="box">
        <img src="@/assets/icon-edit.png" alt="">
        <button class="button edit-button" @click="edit">编辑音频作品</button>
        <button class="button edit-button" :data-clipboard-text="`${window.location.origin}/edit/${musicId}/${$route.params.arrangeId}`" @click="copyUrl('edit')">复制编辑链接</button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Clipboard from 'clipboard'
import { Message } from 'element-ui'
import { reportEvent } from '@/common/utils'

export default {
  name: 'Home',
  components: {
    Header,
  },
  data() {
    return {
      musicId: JSON.parse(sessionStorage.getItem('form')).music_id,
      window,
    }
  },
  created() {
  },
  mounted() {
    reportEvent('result-page-exposure')
  },
  methods: {
    edit() {
      // 编辑结果页-编辑按钮-点击
      BeaconAction.onEvent(`result-page-edit-button`, `result-page-edit-button`)
      window.location.href = `/edit/${this.musicId}/${this.$route.params.arrangeId}`
    },
    download() {
      // 编辑结果页-下载按钮-点击
      BeaconAction.onEvent(`result-page-download-button`, `result-page-download-button`)
      window.location.href = `/download/${this.$route.params.arrangeId}`
    },
    copyUrl(type) {
      // 编辑结果页-复制${type}链接按钮-点击
      BeaconAction.onEvent(`result-page-copy-${type}-button`, `result-page-copy-${type}-button`)
      const c = new Clipboard('.button')
      c.on('success', e => {  
          Message.success('复制成功')
          c.destroy()
        })  
      c.on('error', e => {
        Message.error('复制失败')
        c.destroy()
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .ending-page {
    background: url('../assets/bg.png') no-repeat;
    background-size: cover;
    min-height: 100vh;
    text-align: center;
    .title {
      font-size: 38px;
      color: #000;
      margin: 76px 0 20px;
    }
    .tips {
      font-size: 18px;
      color: #979797;
    }
    .main {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 90px;
      .box {
        width: 290px;
        border-radius: 20px;
        background: #fff;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 78px 0px 54px;
        img {
          margin-bottom: 48px;
        }
        .button {
          width: 200px;
          height: 40px;
          color: #fff;
          border-radius: 40px;
          font-size: 18px;
          font-weight: 500;
        }
        button + button {
          margin-top: 34px;
        }
        .download-button {
          background: linear-gradient(to right, #44b5ff, #79d2ff);
        }
        .edit-button {
          background: linear-gradient(to right, #36cde3, #98e5e6);
        }
        .text {
          font-size: 22px;
          color: #000;
          margin-bottom: 6px;
        }
        .url {
          font-size: 18px;
          color: #979797;
          
        }

      }
      .box + .box {
        margin-left: 80px;
      }
    }
    a {
      text-decoration: none;
    }

  }
</style>
