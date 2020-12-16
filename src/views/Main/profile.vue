<template>
  <div class="profile-page">
    <div class="main">
      <div class="nav-menu-box">
        <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="menuSelect">
          <el-menu-item index="1">我的作品</el-menu-item>
          <el-menu-item index="2">我的草稿</el-menu-item>
          <el-menu-item index="3">我的视频</el-menu-item>
        </el-menu>
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
        <el-table
          ref="worksTable"
          :data="worksList"
          class="table-box"
          highlight-current-row
          @cell-mouse-enter="tableCellMouseEnter"
        >
          <el-table-column
            label="音频作品名称"
          >
            <template slot-scope="scope">
              <span class="audio-name" @click="audioNameClick(scope.row.arrange_id)">{{scope.row.arrange_name || '填词'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="音源"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.tone_infos.map(item => item.display_name).join('、') || '— —' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
          >
            <template slot-scope="scope">
              <span>{{$moment(scope.row.update_time * 1000).format('YYYY/MM/DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              <span>{{ stateMap(scope.row.state) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="音频作品操作"
            width="130"
          >
            <template slot-scope="scope">
              <i :class="scope.row.state === 0 || scope.row.state === 1 ? 'icon el-icon-download disabled' : 'icon el-icon-download'" @click="downloadButtonClick(scope.row)"></i>
              <i :class="scope.row.state === 0 || scope.row.state === 1 ? 'icon el-icon-edit disabled' : 'icon el-icon-edit'" @click="editButtonClick(scope.row)"></i>
              <i class="icon el-icon-delete" @click="deleteButtonClick(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @current-change="currentPageChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <div v-if="activeIndex === '2'">
        <DraftTable />
      </div>
      <div v-if="activeIndex === '3'">
        <VideoTable />
      </div>
    </div>
    <CommonDialog :show="dialogShow" titleText="确定删除该作品吗?" confirmButtonText="删除" :confirmButtonEvent="deleteItem" :cancelButtonEvent="closeDialog" />
  </div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from '@/common/utils/helper'
import { 
  Table,
  TableColumn,
  Menu,
  MenuItem,
  Pagination,
  Message,
} from 'element-ui'
import Header from '@/common/components/Header'
import DraftTable from '@/common/components/DraftTable'
import VideoTable from '@/common/components/VideoTable'
import CommonDialog from '@/common/components/CommonDialog'
import {
  fetchArrangeList,
  deleteAudio,
} from '@/api/profile'

export default {
  name: 'Home',
  components: {
    'el-table': Table,
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    Header,
    DraftTable,
    VideoTable,
    CommonDialog,
  },
  data() {
    return {
      activeIndex: '1',
      worksList: [],
      currentPage: 1,
      dialogShow: false,
      total: 0,
      targetArrangeId: '',
    }
  },
  mounted() {
    reportEvent('person-page-exposure')
    const index = this.$router.history.current.query.index
    if (index) {
      this.activeIndex = index
    }
    this.getList()
  },
  methods: {
    stateMap(state) {
      const m = {
        0: '音频合成中',
        1: '音频合成中',
        2: '音频合成成功',
        3: '音频失效',
        4: '音频合成失败',
      }
      return m[state]
    },
    tableCellMouseEnter() {
      this.$refs.worksTable.setCurrentRow()
    },
    getList() {
      const p = {
        start: (this.currentPage - 1) * 10,
        count: 10,
      }
      fetchArrangeList(p).then((response) => {
        const { data } = response.data
        const worksList = data.arrange_infos
        const total = data.total
        this.worksList = worksList || []
        // this.$refs.worksTable.setCurrentRow(this.worksList[0])
        // setTimeout(() => {
        //   this.$refs.worksTable.setCurrentRow()
        // }, 5000)
        this.total = total || 0
      })
    },
    menuSelect(index) {
      log(index)
      this.activeIndex = index
      this.$router.push({
        path: this.$route.path,
        query: Object.assign({}, this.$route.query, { _: +new Date() }, {index,})
      })
    },
    audioNameClick(arrangeId) {
      log('audioNameClick', arrangeId)
      this.$router.push(`/audio/${arrangeId}`)
    },
    newWorksButtonClick() {
      // this.$vnode.parent.componentInstance.cache = {}
      sessionStorage.setItem('draftId', '')
      this.$router.push('/search')
    },
    uploadVideoButtonClick() {
      this.$router.push('/videoUpload')
    },
    downloadButtonClick(row) {
      const arrangeId = row.arrange_id
      reportEvent('person-page-audiodownload-button', 'person-page-audiodownload-button', { arrangeId, })
      const url = row.down_url
      if (url === '') {
        Message.error('音频合成中，请耐心等待1分钟后刷新页面')
        return
      }
      const element = document.createElement('a')
      element.href = url
      const a = document.body.appendChild(element)
      a.click()
      document.body.removeChild(element)
    },
    editButtonClick(row) {
      const arrangeId = row.arrange_id
      const state = row.state
      if (state === 0 || state === 1) {
        Message.error('音频合成中，暂不可编辑')
        return
      }
      sessionStorage.setItem('draftId', '')
      reportEvent('person-page-audioedit-button', 'person-page-audioedit-button', { arrangeId, })
      const editable = row.is_edit
      if (editable === 1) {
        this.$router.push('/exception')
        return
      }
      window.location.href = `/edit/${row.music_id}/${row.arrange_id}`
    },
    deleteButtonClick(row) {
      const arrangeId = row.arrange_id
      reportEvent('person-page-audiodelete-button', 'person-page-audiodelete-button', { arrangeId, })
      this.dialogShow = true
      this.targetArrangeId = row.arrange_id
    },
    deleteItem() {
      log('deleteItem', this.targetArrangeId)
      deleteAudio(this.targetArrangeId).then((response) => {
        const { data, ret_code } = response.data
        if (ret_code === 0) {
          Message.success('作品删除成功 ! ')
          this.getList()
          this.dialogShow = false
        }
      })
    },
    closeDialog() {
      this.dialogShow = false
    },
    currentPageChange() {
      this.getList()
    },
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
      .table-box {
        color: #000;
        background: transparent;
        .audio-name {
          color: #0090ef;
          cursor: pointer;
        }
        .icon {
          cursor: pointer;
          font-size: 20px;
          color: #0090ef;
        }
        .icon + .icon {
          margin-left: 24px;
        }
        .disabled {
          // cursor: not-allowed;
          // pointer-events: none;
          color: #979797;
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