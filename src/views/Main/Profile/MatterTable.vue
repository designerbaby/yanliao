<template>
  <div class="video-table-box">
    <Table
      ref="table"
      :data="list"
      class="table-box"
      :show-header="false"
      v-if="this.list.length !== 0"
    >
      <TableColumn>
        <template slot-scope="scope">
          <img class="cover" :src="scope.row.cover_url" alt="暂无封面" @click="coverClick(scope.row)">
          <div class="info">
            <div class="title">
              <span class="text">{{scope.row.desc}}</span>
            </div>
            <div class="detail">
              <span class="upload-time">{{scope.row.publish_time | formatDate}}</span>
              <span class="video-state">{{scope.row.status.state_desc || ''}}</span>
            </div>
            <div class="data-column data-button">
              <div @click="deleteButtonClick(scope.row)">
                <span class="el-icon-delete"></span>
                <span>删除素材</span>
              </div>
            </div>
          </div>
        </template>
      </TableColumn>
    </Table>
    <Pagination
      v-if="this.list.length !== 0"
      class="pagination"
      @current-change="currentPageChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
    >
    </Pagination>
    <CommonDialog :show="dialogShow" titleText="确定删除该素材吗?" confirmButtonText="删除" :confirmButtonEvent="deleteItem" :cancelButtonEvent="closeDialog" />
    <div class="empty-box" v-if="this.list.length === 0 && this.dataReady === true">
      <img class="empty-img" src="@/assets/empty.png" alt="" />
      <div class="empty-text">还没有上传素材哦~</div>
      <div class="empty-tips">点击页面右上角"发布素材"</div>
    </div>
    <VideoDialog ref="VideoDialog"></VideoDialog>
    <VideoDescDialog ref="VideoDescriptor" @getList="getList"></VideoDescDialog>
  </div>
</template>

<script>
// @ is an alias to /src
// 我的素材组件
import { reportEvent } from '@/common/utils/helper'
import CommonDialog from '@/common/components/CommonDialog'
import VideoDescDialog from './Components/VideoDescDialog'
import VideoDialog from './Components/VideoDialog'
import {
  Table,
  TableColumn,
  Pagination,
  Message,
  Dialog,
} from 'element-ui'
import {
  fetchList,
  uploadMatter,
  associateTag,
  delMatter
} from '@/api/matter'

export default {
  name: 'MatterTable',
  components: {
    Dialog,
    Table,
    TableColumn,
    Pagination,
    CommonDialog,
    VideoDescDialog,
    VideoDialog
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      dialogShow: false,
      total: 0,
      targetId: '',
      dataReady: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    coverClick(row) {
      this.$refs.VideoDialog.show(row)
    },
    getList() { // 获取素材列表
      const p = {
        start: (this.currentPage - 1) * 10,
        size: 10,
      }
      fetchList(p).then((response) => {
        const { data } = response.data
        const list = data.materials
        const total = data.total
        this.list = list || []
        this.total = Number(total || 0)
        this.dataReady = true
      })
    },
    deleteButtonClick(row) {
      const targetId = row.id
      this.dialogShow = true
      this.targetId = targetId
    },
    deleteItem() {
      // 删除素材按钮确认点击
      delMatter({ id: Number(this.targetId) }).then((response) => {
        const { data, ret_code } = response.data
        if (ret_code === 0) {
          Message.success('素材删除成功 ! ')
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
    }
  },
}
</script>

<style lang="less" scoped>
.video-table-box {
  width: 100%;
  background: transparent;
  .empty-box {
    height: 48vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .empty-img {
      width: 200px;
    }
    .empty-text {
      font-size: 20px;
      color: #000;
      font-weight: 500;
      margin-top: -30px;
      line-height: normal;

    }
    .empty-tips {
      line-height: normal;
      margin-top: 8px;
    }
  }
  .table-box {
    background: transparent;
    .cover {
      width: 320px;
      height: 180px;
      float: left;
      margin-right: 24px;
      cursor: pointer;
    }
    .info {
      height: 180px;
      display: flex;
      flex-direction: column;
      .topic {
        color: #939393;
      }
      .title {
        color: #000;
        font-size: 20px;
        font-weight: 500;
      }
      .detail {
        margin-top: 12px;
        color: #939393;
        span + span {
          margin-left: 18px;
        }
        .video-state {
          font-weight: 500;
        }
        .video-state-success {
          color: #85CE61;
        }
        .video-state-invalid {
          color: #F78989;
        }
      }
      .data-column {
        display: flex;
        align-items: center;
        .data-item + .data-item {
          margin-left: 24px;
        }
        .data-item {
          display: flex;
          align-items: center;
          img {
            margin-right: 5px;
          }
          span {
            line-height: 20px;
          }
          .icon-view {
            width: 20px;
          }
          .icon-like {
            width: 15px;
          }
          span + span {
            margin-left: 5px;
          }
        }
      }
      .data-top {
        margin-top: 60px;
      }
      .data-button {
        font-size: 16px;
        margin-top: auto;
        // width: 100px;
        cursor: pointer;
        .el-icon-delete {
          font-size: 20px;
        }
        .el-icon-edit-outline {
          font-size: 20px;
        }
        .edit {
          margin: 0 10px;
        }
      }
    }
  }
  .video {
    // width: 100%;
    max-width: 50vw;
    max-height: 80vh;
  }
  .video:focus {
    outline: none;
  }
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
