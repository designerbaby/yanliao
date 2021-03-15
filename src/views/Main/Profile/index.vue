<template>
  <div class="profile-page">
    <div class="main">
      <div class="nav-menu-box">
        <Menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="menuSelect">
          <MenuItem index="1">我的作品</MenuItem>
          <MenuItem index="2">我的草稿</MenuItem>
          <MenuItem index="5">我的曲谱</MenuItem>
          <MenuItem index="3">我的视频</MenuItem>
          <MenuItem index="4">我的音源</MenuItem>
        </Menu>
        <div class="control">
          <button class="add-button" @click="uploadVideoButtonClick">
            <span class="el-icon-plus"></span>
            <span>发布视频</span>
          </button>
          <button class="add-button" @click="newWorksButtonClick">
            <span class="el-icon-plus"></span>
            <span>新建作品</span>
          </button>
        </div>
      </div>
      <div v-if="activeIndex === '1'">
        <WorkTable />
      </div>
      <div v-if="activeIndex === '2'">
        <DraftTable />
      </div>
      <div v-if="activeIndex === '3'">
        <VideoTable />
      </div>
      <div v-if="activeIndex === '4'">
        <AudioSourceTable />
      </div>
      <div v-if="activeIndex === '5'">
        <OperaTable />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from '@/common/utils/helper'
import {
  Menu,
  MenuItem,
  Message,
} from 'element-ui'
import Header from '@/common/components/Header'
import DraftTable from './DraftTable.vue'
import VideoTable from './VideoTable.vue'
import WorkTable from './WorkTable.vue'
import AudioSourceTable from './AudioSourceTable.vue'
import OperaTable from './OperaTable.vue'
import { deleteAudio } from '@/api/profile'

export default {
  name: 'Home',
  components: {
    Menu,
    MenuItem,
    Header,
    WorkTable,
    DraftTable,
    VideoTable,
    OperaTable,
    AudioSourceTable
  },
  data() {
    return {
      activeIndex: '1'
    }
  },
  mounted() {
    reportEvent('person-page-exposure')
    reportEvent('person-page-myworktab-exposure')
    const index = this.$router.history.current.query.index
    if (index) {
      this.activeIndex = index
    }
  },
  methods: {
    menuSelect(index) {
      this.activeIndex = index
      this.$router.push({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, { _: +new Date() }, {index,})
      })
    },
    newWorksButtonClick() {
      // this.$vnode.parent.componentInstance.cache = {}
      sessionStorage.setItem('draftId', '')
      this.$router.push('/search')
    },
    uploadVideoButtonClick() {
      reportEvent('person-page-uovideo-button')
      this.$router.push('/videoUpload')
    }
  },
}
</script>

<style lang="less" scoped>
  .profile-page {
    .main {
      padding: 0 93px;
      .nav-menu-box {
        display: flex;
        align-items: center;
        margin-bottom: 22px;
        .control {
          margin-left: auto;
          .add-button {
            width: 128px;
            height: 36px;
            background-color: #2cabff;
            border-radius: 23px;
            color: #fff;
            font-size: 16px;
          }
          .add-button + .add-button {
            margin-left: 12px;
          }
        }
        .el-menu {
          background: transparent;
        }
        .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
          background: transparent;
        }
        .el-menu-item {
          font-size: 24px;
        }
        .el-menu.el-menu--horizontal {
          border: none;
        }
        .el-icon-plus {
          margin-right: 3px;
          font-weight: bold;
        }
        .new-works-button {
          width: 156px;
          height: 42px;
          background-color: #2cabff;
          border-radius: 23px;
          color: #fff;
          font-size: 18px;
          margin-left: auto;
        }
      }
    }

    .pagination {
      text-align: center;
      margin-top: 24px;
    }
  }
</style>

<style lang="less">
  .el-table {
    .el-table__row {
      background: transparent;
    }
    th {
      font-weight: normal;
      background: transparent;
    }
    tr {
      background: transparent;
    }
  }
</style>
