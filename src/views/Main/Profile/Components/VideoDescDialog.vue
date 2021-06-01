<template>
  <Dialog
    :visible.sync="videoDescDialogShow"
    title="编辑视频描述"
    width="400px"
    center
  >
    <Form :model="descForm" ref="descForm" :rules="rules">
      <FormItem prop="desc">
        <Input type="textarea"
          placeholder="请输入视频描述"
          v-model="descForm.desc"
          :rows="5"
        />
      </FormItem>
      <FormItem label="上传视频封面" prop="file">
        <Upload
          ref="uploadImg"
          accept=".jpg,.png"
          :on-change="uploadImgChange"
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
    </Form>
    <span slot="footer" class="dialog-footer">
      <Button type="primary" @click="submit">确 定</Button>
    </span>
  </Dialog>
</template>

<script>
import { Dialog, Form, FormItem, Button, Input, Message, Upload } from 'element-ui'
import { updateVideo } from '@/api/video'
import { uploadFile } from '@/common/utils/upload'

export default {
  name: 'VideoDescDialog',
  components: {
    Dialog,
    Form,
    FormItem,
    Button,
    Input,
    Message,
    Upload
  },
  data() {
    return {
      videoDescDialogShow: false,
      descForm: {
        desc: ''
      },
      rules: {
        desc: [{
          required: true,
          message: '请输入视频描述',
          trigger: 'blur'
        }]
      },
      data: {}
    }
  },
  methods: {
    show(row) {
      this.videoDescDialogShow = true
      this.data = row
      this.descForm.desc = row.desc
    },
    submit() {
      this.$refs.descForm.validate(valid => {
        if (valid) {
          this.toUpload()
        } else {
          Message.error('请全部填写完整并正确再提交')
        }
      })
    },
    uploadImgChange(file) {
      const size = file.size
      if (size > 2147483648) {
        Message.error('文件大小超过 2GB')
        this.$refs['uploadImg'].clearFiles()
        return
      }
      uploadFile(file.raw, 'upload', (url) => {
        this.form.imgUrl = url
      })
    },
    async toUpload() {
      const { data } = await updateVideo({
        file_id: this.data.file_id,
        desc: this.descForm.desc
      })
      if (data.ret_code === 0) {
        Message.success('编辑成功~')
        this.$emit('getList')
        this.videoDescDialogShow = false
      } else {
        Message.error(data.err_msg)
      }
    }
  }
}
</script>





