<template>
  <Dialog
    title="编辑拍号"
    :visible.sync="dialogVisible"
    width="400px"
    :rules="rules"
    ref="beatForm"
    :model="beatForm">
    <Form label-position="top" label-width="80px" :model="beatForm">
      <FormItem label="分子" prop="fenzi">
        <Input v-model="beatForm.fenzi"></Input>
      </FormItem>
      <FormItem label="分母" prop="fenmu">
        <Input v-model="beatForm.fenmu"></Input>
      </FormItem>
    </Form>
    <span slot="footer" class="dialog-footer">
      <Button @click="dialogVisible = false">取 消</Button>
      <Button type="primary" @click="toSubmitBeat('beatForm')">确 定</Button>
    </span>
  </Dialog>
</template>
<script>
import { Dialog, Form, FormItem, Input, Button, Message } from 'element-ui'
import { validateInt, validateFenmu } from '@/common/utils/validate'

export default {
  name: 'BeatSelector',
  components: {
    Dialog,
    Form,
    FormItem,
    Input,
    Button,
    Message
  },
  data() {
    return {
      dialogVisible: false,
      beatForm: {
        fenzi: 4,
        fenmu: 4
      },
      rules: {
        fenzi: [
          { required: true, message: '请输入分子', trigger: 'blur' },
          { type: 'number', message: '必须为正整数', validate: validateInt }
        ],
        fenmu: [
          { required: true, message: '请输入分母', trigger: 'blur' },
          { type: 'number', message: '只能为2,4,8或16', validate: validateFenmu }
        ]
      }
    }
  },
  methods: {
    toSubmitBeat(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('changeBeat', this.beatForm)
        } else {
          Message.error('请全部填写完整并正确再提交')
        }
      })
    },
    showBeatDialog() {
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="less">

</style>