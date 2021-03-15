<template>
  <Dialog
    title="编辑拍号"
    :visible.sync="dialogVisible"
    :custom-class="$style.beatSelector"
    width="400px">
    <Form label-position="top" :rules="rules" ref="ruleForm" label-width="80px" :model="beatForm">
      <FormItem label="分子" prop="fenzi">
        <InputNumber v-model="beatForm.fenzi"></InputNumber>
      </FormItem>
      <FormItem label="分母" prop="fenmu">
        <InputNumber v-model="beatForm.fenmu"></InputNumber>
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
      beatForm: {
        fenzi: 0,
        fenmu: 0
      },
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
  computed: {
    stageWidth() {
      return this.$store.getters.stageWidth
    }
  },
  methods: {
    toSubmitBeat() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('updateBeatForm', this.beatForm)
          this.dialogVisible = false
          this.toUpdateStage()
        } else {
          Message.error('请全部填写完整并正确再提交')
        }
      })
    },
    toUpdateStage() { // 根据内外舞台的框进行比较
      const stageConWidth = this.$store.state.stage.width
      const maxPitchRight = this.$store.state.maxPitchRight
      console.log(`maxPitchRight: ${maxPitchRight}, stageConWidth: ${stageConWidth}, this.stageWidth: ${this.stageWidth}`)
      while (stageConWidth > this.stageWidth) { // 外框比里框更大
        this.$store.dispatch('updateMatter', 15)
      }
      while (maxPitchRight > this.stageWidth) {
        this.$store.dispatch('updateMatter', 15)
      }
    },
    showBeatDialog() {
      this.beatForm = {
        ...this.$store.state.beatForm
      }
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="less" module>
.beatSelector {
  text-align: left;
}
</style>