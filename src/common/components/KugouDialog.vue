<template>
  <Dialog
    :visible.sync="bindKugouShow"
    width="400px"
    custom-class="logout-dialog"
    top="15%"
  >
    <img src="@/assets/icon-complete.png" alt="success-icon" class="success-icon"/>
    <div class="bind-success__title">绑定成功</div>
    <div class="bind-success__kugou">您已经绑定酷狗音乐账号</div>
    <div class="bind-success__nickname">{{ kugouNickName }}</div>
    <div>绑定有效期为3个月, 超过有效期重新绑定</div>
    <div class="bind-success__validity">在个人主页发布视频同步到酷狗可获得<a href="/playIncentives" target="_blank" title="播放激励">播放激励</a></div>
  </Dialog>
</template>

<script>
import { Dialog } from 'element-ui'
import { bindKugou } from '@/api/bind'
import { getParam } from '@/common/utils/helper'

export default {
  name: 'KugouDialog',
  data() {
    return {
      bindKugouShow: false,
      code: getParam('code'),
      kugouNickName: ''
    }
  },
  components: {
    Dialog
  },
  mounted() {
    this.toBindKugouAccrossCode()
  },
  methods: {
    showKugou() {
      this.bindKugouShow = true
    },
    toBindKugouAccrossCode() {
      if (this.code) { // url带有code才发起请求
        this.bindKugouShow = true
        bindKugou(this.code).then(res => {
          const { data, ret_code } = res.data
          console.log('bindKugou:', res)
          if (ret_code === 0) {
            this.kugouNickName = data.nickname
            // this.userLogo = data.profile_photo
            this.$emit('showBindKugou') // 绑定成功后再去查下不显示绑定的按钮
          } else { // 绑定不成功的话，就再去请求下账号
            this.$emit('getUserInfo')
          }
        })
      }
    },
  }
}
</script>

<style lang="less">
.success-icon {
  width: 100px;
  height: 100px;
}
.bind-success {
  &__title {
    font-size: 38px;
    line-height: 40px;
    margin: 30px auto;
    color: #000;
    font-weight: bold;
  }
  &__kugou {
    color: #000;
    font-size: 24px;
  }
  &__nickname {
    color: #000;
    font-size: 28px;
    margin: 20px auto
  }
  &__validity {
    margin: 80px auto 0 auto;
    a {
      color: #2cabff;
      text-decoration: none;
    }
  }
}
</style>
