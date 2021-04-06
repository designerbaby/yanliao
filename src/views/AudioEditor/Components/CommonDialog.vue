<template>
  <Dialog
    :visible.sync="show"
    width="400px"
    custom-class="editor-dialog"
    :before-close="beforeClose"
    top="15%"
  >
    <div class="editor-tip">{{ tip }}</div>
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
    tip: {
      type: String
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
  .editor-tip {
    font-size: 14px;
    color: #fff;
    text-align: center;
    height: 100px;
    line-height: 100px;
  }
  .editor-footer {
    height: 40px;
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
}
</style>
