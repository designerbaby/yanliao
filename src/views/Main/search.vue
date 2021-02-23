<template>
  <div class="search-page">
    <div class="main">
      <div class="page-title">
        <img class="step" src="@/assets/1.png" alt="" />
        <div class="text">选择要改编的歌曲</div>
      </div>
      <div class="search-bar">
        <input
          class="search-input"
          type="text"
          placeholder="请输入歌曲名或者歌手名"
          v-model="searchWord"
          @keyup.enter="searchButtonClick"
        />
        <img v-if="searchButtonClicked === true" @click="deleteButtonClick" class="delete-button" src="@/assets/icon-delete.png" alt="">
        <button class="search-button" @click="searchButtonClick">搜索</button>
      </div>
      <div class="search-result" v-if="list.length !== 0">
        <div class="title">{{ searchButtonClicked === false ? '全部歌曲' : '搜索结果' }}</div>
        <div class="list-box">
          <div :class="selected === item.music_id ? 'item selected' : 'item'" v-for="item in list" :key="item.id" @click="itemClick(item)">
            <div class="radio">
              <div class="icon"></div>
              <input :id="item.music_id" v-model="selected" type="radio" :value="item.music_id" hidden>
            </div>
            <div class="text">{{ item.name }} - {{ item.singer }}</div>
          </div>
        </div>
        <Pagination
          class="pagination"
          @current-change="currentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="total"
        >
        </Pagination>
        <button class="confirm-button" @click="confirmButtonClick">确定</button>
      </div>
      <div class="no-result" v-if="list.length === 0 && unsearched === false">
        <span>没有符合条件的搜索结果, </span>
        <span class="return-all" @click="resetList">返回全部歌曲</span>
      </div>
    </div>
    <Dialog
      :visible.sync="dialogVisible"
      width="400px"
      custom-class="dialog"
    >
      <div class="dialog-main">请先选择歌曲在进行下一步</div>
      <div class="dialog-confirm-button" @click="dialogVisible = false">确定</div>
    </Dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import { Pagination, Dialog } from "element-ui"
import { search } from "@/api/api"
import Header from '@/common/components/Header.vue'
import { reportEvent } from '@/common/utils/helper'

export default {
  name: "Home",
  components: {
    Pagination,
    Dialog,
    Header,
  },
  data() {
    return {
      searchButtonClicked: false,
      unsearched: true,
      dialogVisible: false,
      currentPage: 1,
      selected: '',
      list: [],
      searchWord: "",
      total: 0,
    };
  },
  mounted() {
    reportEvent('search-page-exposure')
    this.getList()
  },
  methods: {
    deleteButtonClick() {
      this.resetList()
    },
    currentChange() {
      this.getList()
    },
    getList() {
      // this.selected = ''
      const p = {
        word: this.searchWord,
        start: (this.currentPage - 1) * 10,
        count: 10,
      }
      search(p).then((response) => {
        const { data } = response.data
        const list = data.music_list
        const total = data.total
        this.list = list || []
        this.total = total || 0
        this.unsearched = false
      })
    },
    itemClick(item) {
      this.selected = item.music_id
    },
    resetList() {
      this.searchButtonClicked = false
      this.searchWord = ''
      this.currentPage = 1
      // this.selected = ''
      this.getList()
    },
    searchButtonClick() {
      // 搜索页-搜索按钮-点击
      reportEvent("search-page-search-button", "search-page-search-button", { searchWord: this.searchWord })
      if (this.searchWord !== '') {
        this.currentPage = 1
        this.searchButtonClicked = true
        this.getList()
      }
    },
    confirmButtonClick() {
      log('选中', this.selected)
      // 搜索页-确定按钮-点击
      reportEvent("search-page-confirm-button")
      if (this.selected === '') {
        this.dialogVisible = true
      } else {
        sessionStorage.setItem('draftId', '')
        this.$router.push(`/edit/${this.selected}`)
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search-page {
  // background: url('../assets/bg.png');
  // background-size: cover;
  // height: 100vh;
  .main {
    padding: 0px 0px 0px 105px;
    .page-title {
      margin-bottom: 38px;
      display: flex;
      align-items: flex-end;
      .text {
        height: 38px;
        line-height: 38px;
        color: #000;
        font-size: 38px;
        margin-left: 10px;
      }
    }
    .search-bar {
      display: flex;
      position: relative;
      height: 36px;
      width: 400px;
      .search-input {
        border-radius: 30px 0px 0px 30px;
        border: 1px #bcbcbc solid;
        width: 322px;
        height: 36px;
        line-height: 36px;
        padding-left: 20px;
        box-sizing: border-box;
        outline: none;
        font-family: "Source Han Sans CN", Avenir, Helvetica, Arial, sans-serif;
        min-width: 78%;
        &::placeholder {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.2);
        }
      }
      .delete-button {
        width: 14px;
        height: 14px;
        position: absolute;
        top: 50%;
        right: 80px;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }
      .search-button {
        box-sizing: border-box;
        height: 36px;
        width: 78px;
        border-radius: 0px 30px 30px 0px;
        font-size: 14px;
        color: #fff;
        background: linear-gradient(to right, #44b5ff, #79d2ff);
      }
    }
    .search-result {
      // width: 1180px;
      // margin: 0 auto;
      padding-right: 130px;
      .title {
        font-size: 16px;
        color: #979797;
        font-weight: lighter;
        border-bottom: 1px solid rgba(216, 216, 216, 0.3);
        padding: 25px 0 7px 75px;
      }
      .list-box {
        // width: 1180px;
        .item {
          cursor: pointer;
          height: 48px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(216, 216, 216, 0.3);
          .text {
            margin-left: 28px;
          }
          .radio {
            margin-left: 26px;
            .icon {
              display: block;
              position: relative;
              cursor: pointer;
              width: 20px;
              height: 20px;
              border-radius: 20px;
              border: 1px solid #d8d8d8;
            }
          }
        }
        .selected {
          color: #2cabff;
          background: rgba(44, 171, 255, 0.03);
          .radio {
            .icon {
              border: 1px solid #2cabff;
            }
            .icon::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #2cabff;
              width: 12px;
              height: 12px;
              border-radius: 50%;
            }
          }
        }
        .item:hover {
          color: #2cabff;
          background: rgba(44, 171, 255, 0.03);
        }
      }
    }
    .no-result {
      font-size: 22px;
      color: #000;
      margin: 250px 0px;
      text-align: center;
      .return-all {
        color: #2cabff;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .pagination {
      text-align: center;
      margin-top: 21px;
    }
    .confirm-button {
      width: 200px;
      height: 40px;
      color: #fff;
      border-radius: 40px;
      background: linear-gradient(to right, #44b5ff, #79d2ff);
      margin: 22px auto 0px;
      display: block;
      font-size: 18px;
    }
  }
}
</style>

<style lang="less">
  .dialog {
    border-radius: 10px;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    margin: 0 !important;
    .dialog-main {
      font-size: 22px;
      color: #000;
      text-align: center;
    }
    .dialog-confirm-button {
      color: #fff;
      background: linear-gradient(to right, #44b5ff, #79d2ff);
      font-size: 18px;
      width: 150px;
      height: 40px;
      border-radius: 30px;
      margin: 40px auto 0;
      text-align: center;
      line-height: 40px;
      font-weight: 500;
      cursor: pointer;
    }
  }
</style>