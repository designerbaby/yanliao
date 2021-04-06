<template>
  <Dialog
    title="导入Midi"
    :visible.sync="midiVisible"
    custom-class="midi-dialog">
    <div class="container">
      <div class="midi-tips">选择要导入的音轨</div>
      <Radio v-for="(it, index) in pitchLists"
        :key="index"
        :label="index"
        v-model="it.select"
        @change="changeSelect($event, it)"
        >
          音轨{{ index + 1 }} ({{ it.length }}个音符, D9-G9, Piano)
      </Radio>
    </div>
    <span slot="footer" class="dialog-footer">
      <Button @click="cancel">取 消</Button>
      <Button type="primary" @click="submit">确 定</Button>
    </span>
  </Dialog>
  <!-- <Modal @close="doClose">
    <div :class="$style.title">导入Midi</div>
    <div :class="$style.midTitle">选择要导入的音轨</div>
    <div :class="$style.midiList">
      <div :class="$style.radio" v-for="(it, index) in pitchLists" :key="index">
        <div :class="$style.select">
          <img src="@/assets/audioEditor/radio-actived.png" v-if="it.select">
          <img src="@/assets/audioEditor/radio-normal.png">
        </div>
      </div>
      音轨{{ index + 1 }}({{ it.length }}个音符, D9 - G9, Piano)
    </div>
    <div :class="$style.footer">
      <div :class="$style.cancel">取消</div>
      <div :class="$style.confirm">确定</div>
    </div>
  </Modal> -->
</template>

<script>
import { Dialog, Button, Message, Radio } from 'element-ui'
import Modal from '@/common/components/Modal.vue'

export default {
  name: 'MidiDialog',
  components: {
    Dialog,
    Button,
    Message,
    Radio,
    Modal
  },
  data() {
    return {
      midiVisible: false,
      pitchLists: [[{}, {}], [{}, {}]]
    }
  },
  methods: {
    show() {
      this.midiVisible = true
    },
    changeSelect(event, it) {
      console.log('changeSelect:', event, it)
    },
    cancel() {
      this.midiVisible = false
      this.$emit('midi-cancel')
    },
    submit() {
      console.log('submit')
    },
    doClose() {

    }
  }
}
</script>

<style lang="less">
.midi-tips {
  margin: 0px 0 0 24px;
  font-size: 14px;
  color: #fff;
  height: 44px;
  line-height: 44px;
}
.midi-dialog {
  background: #323232;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  border-radius: 8px;
  width: 520px;
  color: #fff;
  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #FFFFFF;
  }
  .el-dialog__header {
    height: 64px;
    line-height: 64px;
    text-align: center;
    padding: 0;
    border-bottom: 1px solid rgba(0,0,0,0.07);
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
  .el-dialog__body {
    padding: 24px 0;
  }
  .el-dialog__footer {
    border-top: 1px solid rgba(0,0,0,0.07);
    height: 72px;
    line-height: 72px;
    padding: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .el-button {
    height: 40px;
    border-radius: 8px;
    font-size: 16px;
    width: 80px;
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    border: 0;
  }
  .el-button--default {
    background: #1D1D1D;
    padding: 0;
    &:hover {
      background: #292929;
    }
  }
  .el-button--primary {
    background: #179B30;
    height: 40px !important;
    border-radius: 8px;
    font-size: 16px;
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    margin: 0 24px 0 16px;
    border: 0;
    &:hover {
      background: #2ea545;
    }
  }
  .el-radio__inner {
    border-radius: 3px;
    border: 1px solid #888888;
    &:hover {
      border-color: #888888;
    }
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #888888;
    background: #009032;
  }
  .el-radio__input.is-checked+.el-radio__label  {
    color: #ffffff;
  }
  .el-radio {
    display: block;
    height: 44px;
    line-height: 44px;
    margin: 0 24px;
    color: #fff;
    font-size: 14px;
  }
}
</style>
