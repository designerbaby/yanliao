<template>
  <div class="exception-page">
    <div class="main">
      <div class="el-icon-warning-outline"></div>
      <div class="title">该作品所用音源或歌曲已下架, 无法再次编辑</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
  .exception-page {
    height: calc(100vh - 195px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .main {
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-icon-warning-outline {
        font-size: 50px;
        color: #79d2ff;
        margin-bottom: 30px;
      }
      .title {
        font-size: 30px;
        color: #000;
      }
      .button {
        width: 150px;
        height: 40px;
        border-radius: 30px;
        color: #fff;
        font-size: 18px;
        font-weight: 500;
        margin-top: 36px;
        background: linear-gradient(to right, #44b5ff, #79d2ff);
      }
    }
  }
</style>
