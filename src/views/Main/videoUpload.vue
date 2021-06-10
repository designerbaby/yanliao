<template>
  <div class="video-upload-page">
    <div class="title">
      <span>发布视频</span>
      <span class="tips"> (发布的视频会同步在盐料视频 app) </span>
    </div>
    <Form ref="videoForm" label-width="120px" :model="form" class="form" :rules="rules">
      <FormItem label="上传视频" prop="file">
        <Upload
          ref="upload"
          :accept="'video/*'"
          :on-change="uploadChange"
          :on-exceed="uploadExcced"
          :auto-upload="false"
          :limit="1"
          drag
          action=""
          :multiple="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将视频文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传avi、wmv、mpeg、mp4、m4v、mov、asf、flv、f4v文件，且不超过2GB</div>
        </Upload>
      </FormItem>
      <FormItem label="上传视频封面" prop="file">
        <Upload
          ref="uploadImg"
          accept=".jpg,.png"
          :on-change="uploadImgChange"
          :on-exceed="uploadExcced"
          :auto-upload="false"
          :limit="1"
          drag
          action=""
          :multiple="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg,png格式的封面</div>
        </Upload>
      </FormItem>
      <FormItem label="视频描述" prop="desc">
        <Input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          placeholder="请输入视频描述内容"
          v-model="form.desc"
          maxlength="35"
          show-word-limit
        />
      </FormItem>
      <FormItem label="关联歌曲" class="song-info">
        <FormItem prop="songName">
          <Input placeholder="输入视频所使用的歌曲名称" v-model="form.songName" />
        </FormItem>
        <span> - </span>
        <FormItem prop="singerName">
          <Input placeholder="输入使用歌曲的原唱歌手" v-model="form.singerName" />
        </FormItem>
      </FormItem>
      <FormItem v-if="this.$store.state.profile.showBindKugou">
        <Checkbox v-model="form.synKuGou">
          同步视频到酷狗音乐App获得
          <a href="/playIncentives" target="_blank" title="播放激励" class="validity">播放激励</a>
        </Checkbox>
      </FormItem>
    </Form>
    <Button :loading="loading" @click="uploadButtonClick">发布</Button>
  </div>
</template>

<script>
// @ is an alias to /src
import TcVod from 'vod-js-sdk-v6'
import { reportEvent } from '@/common/utils/helper'
import {
  Input,
  Form,
  FormItem,
  Upload,
  Message,
  Button,
  Checkbox
} from 'element-ui'
import { fetchSign } from '@/api/video'
import { search } from '@/api/api'
import { uploadFile } from '@/common/utils/upload'

export default {
  name: 'Home',
  components: {
    Input,
    Form,
    FormItem,
    Upload,
    Button,
    Checkbox
  },
  data() {
    return {
      loading: false,
      form: {
        file: null,
        desc: '',
        songName: '',
        singerName: '',
        synKuGou: false
      },
      musicId: 0,
      rules: {
        file: [
          { required: true, message: '请上传', trigger: 'change' },
        ],
        desc: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        songName: [
          {validator: (rule, value, callback) => {
            if (value === '' && this.form.singerName !== '') {
              callback('请输入')
            } else {
              callback()
            }
          }, trigger: 'blur'}
        ],
        singerName: [
          {validator: (rule, value, callback) => {
            if (value === '' && this.form.songName !== '') {
              callback('请输入')
            } else {
              callback()
            }
          }, trigger: 'blur'}
        ],
      },
    }
  },
  mounted() {},
  methods: {
    getSignature() {
      const f = {
        filesize: this.form.file.size,
        desc: this.form.desc,
        music: this.form.songName ? `${this.form.songName}-${this.form.singerName}` : '',
        syn_ku_gou: this.form.synKuGou,
        source: 0,
        music_id: this.musicId,
        custom_cover_url: this.form.imgUrl
      }
      return fetchSign(f).then((response) => {
        if (response.data.data.ret_code === 0) {
          return response.data.data.sign
        } else {
          Message.error(`上传失败，错误信息: ${response.data.data.err_msg}`)
          return null
        }
      })
    },
    uploadChange(file) {
      const size = file.size
      if (size > 2147483648) {
        Message.error('文件大小超过 2GB')
        this.$refs['upload'].clearFiles()
        return
      }
      this.form.file = file.raw
    },
    uploadImgChange(file) {
      const size = file.size
      if (size > 2147483648) {
        Message.error('文件大小超过 2GB')
        this.$refs['uploadImg'].clearFiles()
        return
      }
      uploadFile(file.raw, 'image', (url) => {
        this.form.imgUrl = url
      })
    },
    uploadExcced(files, fileList) {
      Message.error('请勿重复上传')
    },
    async checkSongIn() {
      let inSong = false
      const rep = {
        word: this.form.songName,
        start: 0,
        count: 10
      }
      const { data } = await search(rep)
      const musicList = data.data.music_list
      if (musicList.length > 0 && this.form.songName === musicList[0].name && this.form.singerName === musicList[0].singer) {
        this.musicId = data.data.music_list[0].music_id
        inSong = true
      }
      return inSong
    },
    async uploadButtonClick() {
      reportEvent('upvideo-page-up-button')
      // if (this.form.songName) { // 注释原因：产品不需要做这个关联使用的歌曲的限制了。
      //   if (!await this.checkSongIn()) {
      //     Message.error('请关联在盐料视频中可以使用的歌曲')
      //     return
      //   }
      // }
      this.$refs['videoForm'].validate((result) => {
        if (result === true) {
          const tcVod = new TcVod({
            getSignature: this.getSignature,
          })
          const uploader = tcVod.upload({
            mediaFile: this.form.file,
          })
          this.loading = true
          Message.success('上传中')
          uploader.on('media_progress', (info) => {
          })
          uploader.done().then((doneResult) => {
            setTimeout(() => {
              this.loading = false
              Message.success('上传成功')
              this.$router.push('/profile?index=4')
            }, 3000)
          }).catch((error) => {
            this.loading = false
            Message.error('上传失败, 请重试')
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
  .video-upload-page {
    padding-left: 110px;
    .title {
      font-size: 34px;
      color: #000;
      font-weight: 500;
      .tips {
        font-size: 18px;
        color: #939393;
      }
    }
    .form {
      width: 600px;
      margin-top: 36px;
      .song-info {
        .el-form-item {
          display: inline-block;
          .el-input {
            width: 240px;
          }
        }
        // .el-form-item + .el-form-item {
        //   margin-left: 20px;
        // }
      }
    }

  }
</style>

<style lang="less">
  .video-upload-page {
    .el-form-item__label {
      font-weight: 500;
      font-size: 16px;
      color: #000;
    }
    .el-button {
      width: 150px;
      background-image: linear-gradient(90deg, #79d2ff 0%, #44b5ff 100%);
      border-radius: 20px;
      height: 32px;
      color: #fff;
      border: none;
      line-height: 32px;
      padding: 0px;
      margin: 100px auto 0px;
      display: block;
    }
    .el-upload__tip {
      line-height: normal;
      margin-top: -10px;
    }
  }
  .validity {
    color: #2cabff;
    text-decoration: none;
  }
</style>
