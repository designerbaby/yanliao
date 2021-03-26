<template>
  <Dialog
    :visible.sync="dialogVisible"
    width="400px"
    custom-class="dialog"
  >
    <div class="dialog-main">{{ text }}</div>
    <div class="dialog-confirm-button" @click="dialogVisible = false">确定</div>
  </Dialog>
</template>

<script>
import { Dialog } from 'element-ui'

export default {
  name: 'CompleteDialog',
  data() {
    return {
      dialogVisible: false,
      text: ''
    }
  },
  components: {
    Dialog
  },
  methods: {
    show(text) {
      this.text = text
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" module>
</style>
