<template>
  <div class="video-upload-page">
    <div class="title">
      <span>发布视频素材</span>
    </div>
    <Form ref="videoForm"
          label-width="100px"
          :model="form"
          class="form"
          :rules="rules">
      <FormItem label="上传素材"
                prop="file">
        <Upload ref="upload"
                :accept="'video/*'"
                :on-change="uploadChange"
                :on-exceed="uploadExcced"
                :auto-upload="false"
                :limit="1"
                drag
                action=""
                :multiple="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将视频文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip"
               slot="tip">只能上传MP4、TS、FLV、WMV、ASF、RM、RMVB、MPG、MPEG、3GP、MOV、WEBM、MKV、AVI。注意素材的时长不可超过30s</div>
        </Upload>
      </FormItem>
      <FormItem label="素材描述"
                prop="desc">
        <Input type="textarea"
               :autosize="{ minRows: 4, maxRows: 6}"
               placeholder="请输入素材描述内容"
               v-model="form.desc"
               maxlength="50"
               show-word-limit />
      </FormItem>
      <FormItem label="素材标签"
                prop="tag">
        <Select v-model="form.tag"
                allow-create
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading">
          <Option v-for="item in tagOptions"
                  :key="item"
                  :label="item"
                  :value="item"></Option>
        </Select>
      </FormItem>
    </Form>
    <Button :loading="loading"
            @click="uploadButtonClick">发布</Button>
  </div>
</template>

<script>
// @ is an alias to /src
import TcVod from 'vod-js-sdk-v6'
import { reportEvent } from '@/common/utils/helper'
import { Input, Form, FormItem, Upload, Message, Button, Checkbox, Select, Option } from 'element-ui'
import { search } from '@/api/api'
import { fetchSign, associateTag } from '@/api/matter'

export default {
  name: 'MatterUpload',
  components: {
    Input,
    Form,
    FormItem,
    Upload,
    Button,
    Checkbox,
    Select,
    Option
  },
  data() {
    return {
      loading: false,
      form: {
        file: null,
        desc: '',
        tag: undefined
      },
      rules: {
        file: [{ required: true, message: '请上传', trigger: 'change' }],
        desc: [{ required: true, message: '请输入', trigger: 'blur' }],
        tag: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      tagOptions: []
    }
  },
  mounted() {},
  methods: {
    getSignature() {
      const f = {
        filesize: this.form.file.size,
        desc: this.form.desc,
        tags: [this.form.tag]
      }
      return fetchSign(f).then(response => {
        return response.data.data.sign
      })
    },
    uploadChange(file) {
      console.log(file)
      const size = file.size
      if (size > 2147483648) {
        Message.error('文件大小超过 2GB')
        this.$refs['upload'].clearFiles()
        return
      }
      const url = URL.createObjectURL(file.raw) //获取录音时长
      const audioElement = new Audio(url) //audio也可获取视频的时长
      audioElement.addEventListener('loadedmetadata', () => {
        console.log(audioElement.duration)
        if (audioElement.duration > 30) {
          Message.error('注意素材的时长不可超过30s')
          this.$refs['upload'].clearFiles()
        } else {
          this.form.file = file.raw
        }
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
      if (
        musicList.length > 0 &&
        this.form.songName === musicList[0].name &&
        this.form.singerName === musicList[0].singer
      ) {
        this.musicId = data.data.music_list[0].music_id
        inSong = true
      }
      return inSong
    },
    async uploadButtonClick() {
      this.$refs['videoForm'].validate(result => {
        if (result === true) {
          const tcVod = new TcVod({
            getSignature: this.getSignature
          })
          const uploader = tcVod.upload({
            mediaFile: this.form.file
          })
          this.loading = true
          Message.success('上传中')
          uploader.on('media_progress', info => {})
          uploader
            .done()
            .then(doneResult => {
              setTimeout(() => {
                this.loading = false
                Message.success('上传成功')
                this.$router.push('/profile?index=5')
              }, 3000)
            })
            .catch(error => {
              this.loading = false
              Message.error('上传失败, 请重试')
            })
        }
      })
    },
    async remoteMethod(query) {
      const {
        data: { data }
      } = await associateTag({ name: query })
      console.log(data)
      this.tagOptions = data.list || []
    }
  }
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
