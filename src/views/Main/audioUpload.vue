<template>
  <div class="audioUpload">
    <div class="title">上传音源</div>
    <Form ref="audioForm" label-width="100px" :model="form" class="form" :rules="rules">
      <FormItem label="上传音源" prop="file">
        <Upload
          ref="upload"
          :accept="'zip/*'"
          :on-change="uploadChange"
          :on-exceed="uploadExcced"
          :auto-upload="false"
          :limit="1"
          drag
          action=""
          :multiple="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将zip文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传zip格式的文件</div>
        </Upload>
      </FormItem>
      <FormItem label="音源名称" prop="audioSourceName">
        <Input 
          placeholder="请输入音源名称" 
          v-model="form.audio_source_name"
          maxlength="10"
          show-word-limit>
        </Input>
      </FormItem>
      <FormItem>
        <Checkbox v-model="form.read">
          我已阅读
          <a href="https://docs.qq.com/doc/DVU5YY0R5eWt3c3Bs?_t=1613810464004" target="_blank" title="上传音源须知" class="policy">上传音源须知</a>
        </Checkbox>
      </FormItem>
    </Form>
    <Button :loading="loading" @click="uploadAudio">上传</Button>
  </div>
</template>

<script>
import TcVod from 'vod-js-sdk-v6'
import {
  Input,
  Form,
  FormItem,
  Upload,
  Message,
  Button,
  Checkbox
} from 'element-ui'
import { addAudioSource } from '@/api/audioSource'
import { fetchSign } from '@/api/video'

export default {
  name: 'audioUpload',
  data() {
    return {
      loading: false,
      form: {
        file: null,
        audio_source_name: '',
        read: false
      },
      rules: {
        audioSourceUrl: [{
          required: true, message: '请上传', trigger: 'change'
        }]
        // audioSourceName: [{
        //   required: true, message: '请输入音源名称', trigger: 'blur'
        // }]
      }
    }
  },
  components: {
    Input,
    Form,
    FormItem,
    Upload,
    Button,
    Checkbox 
  },
  methods: {
    uploadChange(file) {
      const size = file.size
      if (size > 2147483648) {
        Message.error('文件大小超过 2GB')
        this.$refs['upload'].clearFiles()
        return
      }
      this.form.file = file.raw
    },
    uploadExcced(files, fileList) {
      Message.error('请勿重复上传')
    },
    getSignature() {
      const req = {
        filesize: this.form.file.size,
        desc: 'rar文件',
        music: this.form.audio_source_name,
        syn_ku_gou: false,
        source: 0
      }
      return fetchSign(req).then(res => {
        return res.data.data.sign
      })
    },
    uploadAudio() {
      console.log('this.form.audio_source_name:', this.form.audio_source_name)
      this.$refs['audioForm'].validate((valid) => {
        if (valid) {
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
              this.$router.push('/profile?index=3')
            }, 3000)
          }).catch((error) => {
            this.loading = false
            Message.error('上传失败, 请重试')
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.audioUpload{
  padding-left: 110px;
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
    &:active {
      opacity: 0.8;
    }
    &:hover {
      opacity: 0.8;
    }
  }
  .policy {
    color: #2cabff;
    text-decoration: none;
  }
  .title {
    font-size: 34px;
    color: #000;
    font-weight: 500;
  }
  .form {
    width: 600px;
    margin-top: 36px;
    .el-input {
      width: 240px;
    }
  }
}
</style>
<style lang="less">
.audioUpload {
  .el-form-item__label {
    font-weight: 500;
    font-size: 16px;
    color: #000;
  }
}
</style>
