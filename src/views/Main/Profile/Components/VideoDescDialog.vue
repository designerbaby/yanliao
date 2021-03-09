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
    </Form>
    <span slot="footer" class="dialog-footer">
      <Button type="primary" @click="submit">确 定</Button>
    </span>
  </Dialog>
</template>

<script>
import { Dialog, Form, FormItem, Button, Input, Message } from 'element-ui'
import { updateVideo } from '@/api/video'
export default {
  name: 'VideoDescDialog',
  components: {
    Dialog,
    Form,
    FormItem,
    Button,
    Input,
    Message
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

<style lang="less" module>
</style>
