<template>
  <Dialog
    :visible.sync="show"
    custom-class="chrome-dialog"
    :before-close="beforeClose"
    top="15%"
  >
    <div :class="$style.wrap">
      <img src="@/assets/audioEditor/computer.png" :class="$style.computer">
      <div :class="$style.tip">音频编辑器不支持该浏览器,如果使用该浏览器会造成数据丢失等异常,建议使用谷歌浏览器</div>
    </div>
    <div :class="$style.footer">
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

<style lang="less" module>
.wrap {
  color: #fff;
  padding: 20px;
  text-align: center;
  span {
    color: #009032;
  }
}

.computer {
  width: 160px;
  height: 100px;
  margin: 0 auto;
}

.tip {
  width: 340px;
  margin: 24px auto;
  text-align: center;
  margin-bottom: 8px;
}

.footer {
  height: 72px;
  line-height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid rgba(0,0,0,0.07);
}
</style>
<style lang="less">
.chrome-dialog {
  background: #323232;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  border-radius: 8px;
  width: 436px;
  height: 316px;
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
    width: 80px;
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
