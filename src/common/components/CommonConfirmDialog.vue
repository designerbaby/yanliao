<template>
  <Dialog
    :visible.sync="show"
    width="400px"
    custom-class="confirm-dialog-box"
    :before-close="beforeClose"
    top="15%"
  >
    <div class="confirm-dialog-title">{{ titleText }}</div>
    <div class="confirm-dialog-tip">{{ tipText }}</div>
    <div class="confirm-dialog-footer">
      <button class="confirm-confirm-button confirm-dialog-button" @click="confirmButtonEvent">{{ confirmButtonText }}</button>
      <button class="confirm-cancel-button confirm-dialog-button" @click="cancelButtonEvent">{{ cancelButtonText }}</button>
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
    titleText: {
      type: String,
      default: '确认?',
    },
    tipText: {
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
  },
}
</script>

<style lang="less" scope>
  .confirm-dialog-box {
    line-height: 1;
    text-align: center;
    .confirm-dialog-title {
      font-size: 22px;
      color: #000000;
      margin-bottom: 30px;
    }
    .confirm-dialog-tip {
      margin-bottom: 20px;
    }
    .confirm-dialog-footer {
      .confirm-dialog-button {
        width: 150px;
        height: 40px;
      }
      .confirm-dialog-button + .confirm-dialog-button {
        margin-left: 20px;
      }
      .confirm-confirm-button {
        border-radius: 31px;
        font-size: 18px;
        color: #fff;
        background-image: linear-gradient(90deg, #79d2ff 0%, #44b5ff 100%);
      }
      .confirm-cancel-button {
        border-radius: 31px;
        font-size: 18px;
        color: #2cabff;
        border-radius: 31px;
        background: #fff;
        border: solid 2px #2cabff;
      }
    }
  }
</style>
