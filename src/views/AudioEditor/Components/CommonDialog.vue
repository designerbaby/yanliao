<template>
  <Dialog
    :visible.sync="show"
    custom-class="editor-dialog"
    :before-close="beforeClose"
    top="15%"
    :title="title"
  >
    <div class="editor-wrap">
      <div class="editor-tip">{{ tip }}</div>
    </div>
    <div class="editor-footer">
      <button class="editor-button editor-confirm-button" @click="confirmButtonEvent">{{ confirmButtonText }}</button>
      <button class="editor-button editor-cancel-button" @click="cancelButtonEvent">{{ cancelButtonText }}</button>
    </div>
  </Dialog>
</template>

<script>
import { Dialog } from 'element-ui'

export default {
  components: {
    Dialog
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '标题'
    },
    tip: {
      type: String,
      default: '提示'
    },
    confirmButtonText: {
      type: String,
      default: '确认',
    },
    cancelButtonText: {
      type: String,
      default: '取消',
    },
    confirmButtonEvent: {
      type: Function,
    },
    cancelButtonEvent: {
      type: Function,
    }
  },
  data() {
    return {
    }
  },
  methods: {
    beforeClose() {
      this.cancelButtonEvent()
    }
  }
}
</script>

<style lang="less">
.editor-dialog {
  background: #2c2c2c;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  border-radius: 8px;
  width: 520px;
  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #FFFFFF;
    margin-left: 20px;
  }
  .el-dialog__header {
    border-bottom: 1px solid rgba(0,0,0,0.07);
    height: 64px;
    // text-align: center;
    padding: 0;
    line-height: 64px;
  }
  .editor-wrap {
    height: 124px;
  }
  .editor-tip {
    font-size: 14px;
    color: #fff;
    margin: 24px 0 0 24px;
  }
  .editor-footer {
    height: 72px;
    line-height: 72px;
    border-top: 1px solid rgba(0,0,0,0.07);
    display: flex;
    flex-direction: row-reverse;
    // align-items: center;
    padding: 16px 0;
  }
  .editor-button {
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255,255,255,0.80);
    font-size: 16px;
    letter-spacing: 0;
    text-align: center;
    line-height: 24px;
    height: 40px;
    padding: 0 16px;
    border-radius: 8px;
  }
  .editor-confirm-button {
    width: 96px;
    margin-right: 24px;
    background: #179B30;
    &:hover {
      background: #2ea545;
    }
  }
  .editor-cancel-button {
    width: 80px;
    background: #252525;
    margin: 0 16px;
    &:hover {
      background: #2b2b2b;
    }
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
    padding: 0;
  }
}
</style>
