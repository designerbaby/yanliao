<template>
  <Dialog
    title="编辑拍号"
    :visible.sync="dialogVisible"
    custom-class="beatSelector"
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
      return this.$store.getters['const/stageWidth']
    }
  },
  methods: {
    toSubmitBeat() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('const/updateBeatForm', this.beatForm)
          this.dialogVisible = false
          this.toUpdateStage()
          // this.$store.dispatch('const/toUpdateStage')
        } else {
          Message.error('请全部填写完整并正确再提交')
        }
      })
    },
    toUpdateStage() { // 根据内外舞台的框进行比较
      const stageConWidth = this.$store.state.const.stage.width
      const arrangeStageConWidth = this.$store.state.const.arrangeStage.width
      console.log(`stageConWidth: ${stageConWidth}, this.stageWidth: ${this.stageWidth}`)
      while (stageConWidth > this.stageWidth) { // 外框比里框更大
        this.$store.dispatch('const/updateMatter', 15)
      }
      while (arrangeStageConWidth > this.stageWidth / 10) { // 音轨页面的宽高比里面舞台需要的大
        this.$store.dispatch('const/updateMatter', 15)
      }
      this.$store.dispatch('const/adjustStageWidth')
    },
    showBeatDialog() {
      this.beatForm = {
        ...this.$store.state.const.beatForm
      }
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="less">
.beatSelector {
  text-align: left;
  background: #323232;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  border-radius: 8px;
  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #FFFFFF;
  }
  .el-dialog__headerbtn {
    font-size: 20px;
    color: #d0d0d0;
  }
  .el-dialog__close, .el-icon, .el-icon-close {
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
    &:active {
      color: rgba(255, 255, 255, 0.8);
    }
  }
  .el-dialog__header {
    border-bottom: 1px solid rgba(0,0,0,0.07);
  }
  .el-dialog__body {
    color: #fff;
  }
  .el-form-item__label {
    color: #fff;
  }
  .el-button {
    height: 40px;
    border-radius: 8px;
    font-size: 16px;
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    border: 0;
  }
  .el-button--default {
    background: #1D1D1D;
    &:hover {
      background: #292929;
    }
  }
  .el-button--primary {
    background: #179B30;
    height: 40px !important;
    width: 96px;
    border-radius: 8px;
    font-size: 16px;
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    border: 0;
    &:hover {
      background: #2ea545;
    }
  }
  .el-dialog__footer {
    border-top: 1px solid rgba(0,0,0,0.07);
  }
}
</style>
