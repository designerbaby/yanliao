<template>
  <div class="statusDialog">
    <Dialog :visible.sync="statusVisible" 
      width="30%"
      center>
      <i class="el-icon-loading"></i>
      算法努力合成音频中（{{progress}}%）
    </Dialog>
  </div>
</template>
<script>
import { Dialog } from 'element-ui'

export default {
  name: 'statusDialog',
  data() {
    return {
      statusVisible: false,
      status: 0
    }
  },
  computed: {
    progress() {
      switch (this.status) {
        case 0:
          return 0
          break
        case 1:
          return 15
          break
        case 2:
          return 30
          break
        case 3:
          return 80
          break
        case 4:
          return 100
          break
      }
    }
  },
  methods: {
    showStatus(status) {
      this.statusVisible = true
      this.status = status
    }
  }
}
</script>
<style lang="less">

</style>