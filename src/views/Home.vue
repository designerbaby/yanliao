<template>
  <div class="home">
    <div class="main">
      <div>
        <div class="title">调音好帮手</div>
        <div class="text">百万调音合成工具，是一款帮助视频创作者快速生成高质量音频的工具，解放出你调音的时间，将精力集中在视频创作上，为你的创意腾飞助力！赶紧点击“我要制作”去试试<br>欢迎添加创作工具交流QQ：291243638</div>
        <!-- <div class="text"></div> -->
        <button class="button" type="button" name="button" @click="nextPage">我要制作</button>
      </div>
      <img class="people-icon" src="@/assets/people-home.png" alt="">
    </div>
    <div class="step-box">
      <div class="step-box-start">
        <img class="item" src="@/assets/icon-1.png" alt="">
        <img class="arrow" src="@/assets/icon-arrow.png" alt="">
        <img class="item" src="@/assets/icon-2.png" alt="">
        <img class="arrow" src="@/assets/icon-arrow.png" alt="">
        <img class="item" src="@/assets/icon-3.png" alt="">
      </div>
      <img class="arrow" src="@/assets/icon-arrow-blue.png" alt="">
      <div class="step-box-end">
        <img class="item" src="@/assets/icon-4.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import { reportEvent } from '@/common/utils'

export default {
  name: 'Home',
  components: {
    Header,
  },
  mounted() {
    reportEvent('home-page-exposure')
  },
  methods: {
    nextPage() {
      reportEvent("home-page-create-button")
      const userInfo = sessionStorage.getItem('userInfo')
      if (userInfo) {
        sessionStorage.setItem('draftId', '')
        this.$router.push('/search')
      } else {
        this.$emit('openLoginDialog')
      }
    },
  },
}
</script>

<style lang="less" scoped>
  .home {
    .main {
      padding: 56px 0px 0px 0px;
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      width: 1072px;
      .title {
        font-size: 70px;
        color: #000;
        margin: 0px 0px 5px 0px;
      }
      .text {
        font-size: 22px;
        color: #b2b2b2;
        font-weight: 400;
      }
      .text + .text {
        margin-top: 6px;
      }
      .button {
        margin-top: 58px;
        width: 324px;
        height: 64px;
        border-radius: 40px;
        color: #fff;
        font-size: 26px;
        background: linear-gradient(to right, #44b5ff, #79d2ff);
      }
    }
    .step-box {
      display: flex;
      align-items: center;
      height: 190px;
      margin: 76px auto 0px;
      // padding: 0 204px 0;
      justify-content: space-between;
      width: 1032px;
      // box-sizing: border-box;
      .step-box-start {
        height: 100%;
        width: 713px;
        border-radius: 20px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: #fff;
        .arrow {
          width: 10px;
          height: 22px;
        }
        .item {
          width: 101px;
          height: 120px;
          font-size: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          span {
            color: #ccc;
          }
        }
      }
      .step-box-end {
        border-radius: 20px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
        width: 215px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
      }
    }
  }
</style>
