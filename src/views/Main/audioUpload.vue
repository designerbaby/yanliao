<template>
  <div class="audioUpload">
    <div class="title">上传音源</div>
    <Form ref="audioForm" label-width="100px" :model="form" class="form">
      <FormItem label="上传音源" required>
        <Upload
          ref="upload"
          accept=".zip, .rar"
          :on-change="uploadChange"
          :on-exceed="uploadExcced"
          :auto-upload="false"
          :limit="1"
          :drag="true"
          :action="action"
          :multiple="false"
          :headers="headers"
          :with-credentials="true"
        >
          <input id="key" name="key" type="hidden" value="">
          <input id="Signature" name="Signature" type="hidden" value="">
          <input name="Content-Type" type="hidden" value="">
          <input id="x-cos-security-token" name="x-cos-security-token" type="hidden" value="">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传zip或rar格式的文件</div>
        </Upload>
        <div v-if="fileDownloadUrl">文件链接: {{ fileDownloadUrl }}</div>
        <a href="https://yan-1253428821.cos.ap-guangzhou.myqcloud.com/file/100080/%E7%BD%97%E7%BF%94%E4%BC%98%E5%8C%96%E6%A0%A1%E5%87%86.zip" class="policy" target="_blank">下载示例文件</a>
      </FormItem>
      <FormItem label="音源名称" required>
        <Input
          placeholder="请输入音源名称"
          v-model="form.audio_source_name"
          maxlength="10"
          show-word-limit>
        </Input>
      </FormItem>
      <FormItem prop="read" required label=" ">
        <Checkbox v-model="form.read">
          我已阅读
          <a href="https://docs.qq.com/doc/DVU5YY0R5eWt3c3Bs?_t=1613810464004" target="_blank" title="上传音源须知" class="policy">上传音源须知</a>
        </Checkbox>
      </FormItem>
    </Form>
    <Button :loading="loading" @click="uploadAudio">上传</Button>
    <Progress :percentage="percentage" class="progress" v-if="percentage > 0" text-inside :show-text="false"></Progress>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import {
  Input,
  Form,
  FormItem,
  Upload,
  Message,
  Button,
  Checkbox,
  Progress
} from 'element-ui'
import { addAudioSource, getUserCredential } from '@/api/audioSource'
import { getCookie, camSafeUrlEncode, getAuthorization } from '@/common/utils/helper'

export default {
  name: 'audioUpload',
  data() {
    return {
      percentage: 0,
      loading: false,
      form: {
        file: null,
        audio_source_name: '',
        read: false
      },
      fileDownloadUrl: '',
      headers: {
        'Authorization': '',
        'x-cos-security-token': ''
      },
      action: 'https://yan-1253428821.cos.ap-guangzhou.myqcloud.com/',
    }
  },
  components: {
    Input,
    Form,
    FormItem,
    Upload,
    Button,
    Checkbox,
    Progress
  },
  destroyed() {
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
    async getUserCredential() {
      const res = await getUserCredential()
      return res.data
    },
    async uploadAudio() {
      if (!this.form.file) {
        Message.error('未选择上传文件')
        return
      }
      const fileFormatArr = this.form.file.name.split('.')
      const fileFormat = fileFormatArr[fileFormatArr.length - 1]
      const allowFormat = ['zip', 'rar']
      if (allowFormat.indexOf(fileFormat) === -1) {
        Message.error('请上传zip或rar格式的文件')
        return
      }
      if (!this.form.audio_source_name) {
        Message.error('未填入音源名称')
        return
      }
      if (!this.form.read) {
        Message.error('未勾选已阅读上传音源须知')
        return
      }
      const method = 'PUT'
      const mxUid = getCookie('mx_uid')
      Message.success('上传中')
      this.loading = true
      const key = `file/${mxUid}/${this.form.file.name}`
      const { data } = await this.getUserCredential()
      const info = await getAuthorization(method, key, data)
      const Authorization = info.Authorization   // 得到的签名
      const XCosSecurityToken = info.XCosSecurityToken // 得到的sessionToken
      this.uploadFile(method, key, Authorization, XCosSecurityToken, (err, data) => {
        if (err) {
          Message.error(err)
        } else {
          this.addAudioSource(data.url)
          this.fileDownloadUrl = data.url
          console.log('url:', this.fileDownloadUrl)
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
        this.percentage = percentage
        console.log(`上传进度: ${this.percentage}%`)
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
      xhr.send(this.form.file);
    },
    async addAudioSource(url) {
      if (!this.form.audio_source_name) {
        Message.error('请填入音源名称～')
        return
      }
      const req = {
        audio_source_name: this.form.audio_source_name,
        audio_source_url: url
      }
      const res = await addAudioSource(req)
      console.log('addAudioSource:', res)
      if (res.data.ret_code === 0) {
        this.loading = false
        Message.success('添加音源成功')
        this.$router.push('/profile?index=6')
      } else {
        this.loading = false
        Message.error('上传失败, 请重试')
      }
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
  .progress {
    width: 50%;
    margin: 5px auto;
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
