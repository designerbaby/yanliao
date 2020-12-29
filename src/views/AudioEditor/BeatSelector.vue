<template>
  <Dialog
    title="编辑拍号"
    :visible.sync="dialogVisible"
    width="400px">
    <Form label-position="top" :rules="rules" ref="ruleForm" label-width="80px" :model="ruleForm">
      <FormItem label="分子" required prop="fenzi">
        <InputNumber v-model="ruleForm.fenzi"></InputNumber>
      </FormItem>
      <FormItem label="分母" required prop="fenmu">
        <InputNumber v-model="ruleForm.fenmu"></InputNumber>
      </FormItem>
    </Form>
    <span slot="footer" class="dialog-footer">
      <Button @click="dialogVisible = false">取 消</Button>
      <Button type="primary" @click="toSubmitBeat">确 定</Button>
    </span>
  </Dialog>
</template>
<script>
import { Dialog, Form, FormItem, InputNumber, Button, Message } from 'element-ui'
import { validateInt, validateFenmu } from '@/common/utils/validate'

export default {
  name: 'BeatSelector',
  components: {
    Dialog,
    Form,
    FormItem,
    InputNumber,
    Button,
    Message
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {},
      rules: {
        fenzi: [
          { required: true, message: '请输入分子,且必须为正整数', 
            trigger: 'blur', validator: validateInt }
        ],
        fenmu: [
          { required: true, message: '请输入分母,只能为2,4,8或16', 
            trigger: 'blur', validator: validateFenmu }
        ]
      }
    }
  },
  methods: {
    toSubmitBeat() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('changeBeat', this.ruleForm)
          this.dialogVisible = false 
        } else {
          Message.error('请全部填写完整并正确再提交')
        }
      })
    },
    showBeatDialog(form) {
      this.dialogVisible = true
      this.ruleForm = form
    }
  }
}
</script>
<style lang="less">

</style>