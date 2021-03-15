<template>
  <Dialog :visible.sync="visible">
    <div :class="$style.ImportDialog">
      <Form>
        <Upload
          ref="upload"
          :accept="'*'"
          :auto-upload="false"
          :on-change="uploadChange"
          :limit="1"
          drag
          action=""
          :multiple="false"
        >
          <i class="el-icon-upload"></i>
        </Upload>
      </Form>
    </div>
  </Dialog>
</template>

<script>
import { parseArrayBuffer } from 'midi-json-parser'
import { Dialog, Upload, Form } from 'element-ui'

export default {
  name: 'ImportDialog',
  components: {
    Dialog,
    Upload,
    Form
  },
  data() {
    return {
      form: {
        file: ''
      },
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    uploadChange(file) {
      const size = file.size
      if (size > 2147483648) {
        Message.error('文件大小超过 2GB')
        this.$refs['upload'].clearFiles()
        return
      }
      this.form.file = file.raw
      this.upload(file.raw)
    },
    upload(file) {
      const reader = new FileReader()
      const buffer = reader.readAsArrayBuffer(file)
      reader.onload = (e) => {
        const data = e.target.result
        console.log('data:', data)
        parseArrayBuffer(data)
        .then((json) => {
            console.log('json:', json)
        })
      }
    }
  }
}
</script>

<style lang="less" module>
.ImportDialog{

}
</style>
