<template>
  <Dialog
    :visible.sync="show"
    custom-class="chrome-dialog"
    :before-close="beforeClose"
    top="15%"
  >
    <div class="chrome-wrap">
      <div class="chrome-tip">音频编辑器不支持该浏览器,如果使用该浏览器会造成数据丢失等异常,建议使用<span>谷歌浏览器</span></div>
    </div>
    <div class="chrome-footer">
      <button class="editor-button editor-confirm-button" @click="confirmButtonEvent">确定</button>
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
    confirmButtonEvent: {
      type: Function,
    }
  },
  data() {
    return {
    }
  },
  methods: {
    beforeClose() {
      this.confirmButtonEvent()
    }
  }
}
</script>

<style lang="less">
.chrome-dialog {
  background: #2c2c2c;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  border-radius: 8px;
  width: 300px;
  .chrome-wrap {
    color: #fff;
    padding: 20px;
    text-align: center;
    span {
      color: #009032;
    }
  }
  .chrome-footer {
    height: 72px;
    line-height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
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
