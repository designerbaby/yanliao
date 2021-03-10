<template>
  <Dialog
    :visible.sync="show"
    width="400px"
    custom-class="common-dialog-box"
    :before-close="beforeClose"
    top="15%"
  >
    <div class="common-dialog-title">{{titleText}}</div>
    <div class="common-dialog-footer">
      <button class="common-confirm-button common-dialog-button" @click="confirmButtonEvent">{{confirmButtonText}}</button>
      <button class="common-cancel-button common-dialog-button" @click="cancelButtonEvent">{{cancelButtonText}}</button>
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
    },
  },
  data() {
    return {
    }
  },
  methods: {
    beforeClose() {
      this.cancelButtonEvent()
    },
  },
}
</script>

<style lang="less" scope>
  .common-dialog-box {
    line-height: 1;
    text-align: center;
    .common-dialog-title {
      font-size: 22px;
      color: #000000;
      margin-bottom: 30px;
    }
    .common-dialog-footer {
      .common-dialog-button {
        width: 150px;
        height: 40px;
      }
      .common-dialog-button + .common-dialog-button {
        margin-left: 20px;
      }
      .common-confirm-button {
        border-radius: 31px;
        border: solid 2px #2cabff;
        font-size: 18px;
        color: #2cabff;
        background: #fff;
      }
      .common-cancel-button {
        border-radius: 31px;
        font-size: 18px;
        color: #fff;
        background-image: linear-gradient(90deg, #79d2ff 0%, #44b5ff 100%);
        border-radius: 31px;
      }
    }
  }
</style>
