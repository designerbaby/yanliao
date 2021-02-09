<template>
  <div class="video-table-box">
    <el-table
      ref="table"
      :data="list"
      class="table-box"
      :show-header="false"
      v-if="this.list.length !== 0"
    >
      <el-table-column>
        <template slot-scope="scope">
          <img class="cover" :src="scope.row.cover_url" alt="暂无封面" @click="coverClick(scope.row)">
          <div class="info">
            <div class="title">
              <!-- <span class="topic">#特朗普#</span> -->
              <span class="text">{{scope.row.desc}}</span>
            </div>
            <div class="detail">
              <span v-if="scope.row.music" class="music-info">所用歌曲: {{scope.row.music}}</span>
              <span class="upload-time">{{scope.row.public_unix_time | formatDate}}</span>
              <span class="video-state">{{scope.row.state_detail.state_pub_desc || ''}}</span>
              <!-- <span v-if="scope.row.state === 3" class="video-state">发布中</span>
              <span v-if="scope.row.state === 1 || scope.row.state === 0" class="video-state video-state-success">发布成功</span>
              <span v-if="scope.row.state === 4" class="video-state">发布失败</span>
              <span v-if="scope.row.state === 2" class="video-state video-state-invalid">被下线</span> -->
            </div>
            <div class="data-column">
              <span class="data-item">
                <!-- <span class="el-icon-view"></span> -->
                <img class="icon-view" src="@/assets/icon-view.png" alt="">
                <span>{{scope.row.stats.play_times}}</span>
              </span>
              <span class="data-item">
                <!-- <span class="el-icon-star-off"></span> -->
                <img class="icon-like" src="@/assets/icon-like.png" alt="">
                <span>{{scope.row.stats.likes}}</span>
              </span>
            </div>
            <div class="delete-button" @click="deleteButtonClick(scope.row)">
              <span class="el-icon-delete"></span>
              <span>删除视频</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="this.list.length !== 0"
      class="pagination"
      @current-change="currentPageChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <CommonDialog :show="dialogShow" titleText="确定删除该视频吗?" confirmButtonText="删除" :confirmButtonEvent="deleteItem" :cancelButtonEvent="closeDialog" />
    <el-dialog class="video-dialog" :visible.sync="videoDialogShow" @close="videoDialogClose">
      <div class="video-container">
        <video class="video" :src="currentVideoUrl" controls autoplay ref="dialogVideo">
          您的浏览器不支持 video 标签。
        </video>
        <!-- <video class="video" controls autoplay ref="dialogVideo">
          <source :src="currentVideoUrl" :type="videoGroup.type">
          <object id="video" v-if="videoGroup.type === 'avi' || videoGroup.type === 'wmv' || videoGroup.type === 'asf'">
            <embed border="0" showdisplay="0" showcontrols="1" autostart="1" :filename="currentVideoUrl" :src="currentVideoUrl">
            </embed> 
          </object>
          Your browser is too old which doesn't support HTML5 video.
        </video> -->
        <img class="close-button" src="@/assets/icon-close.png" alt="" @click="closeButtonClick">
      </div>
    </el-dialog>
    <div class="empty-box" v-if="this.list.length === 0 && this.dataReady === true">
      <img class="empty-img" src="@/assets/empty.png" alt="" />
      <div class="empty-text">还没有上传视频哦~</div>
      <div class="empty-tips">点击页面右上角"发布视频"</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// 我的视频组件
import { reportEvent } from '@/common/utils/helper'
import CommonDialog from '@/common/components/CommonDialog'
import { 
  Table,
  TableColumn,
  Pagination,
  Message,
  Dialog,
} from 'element-ui'
import {
  fetchList,
  deleteVideo,
} from '@/api/video'

export default {
  name: 'VideoTable',
  components: {
    'el-dialog': Dialog,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    CommonDialog,
  },
  data() {
    return {
      videoDialogShow: false,
      list: [],
      currentPage: 1,
      dialogShow: false,
      total: 0,
      targetId: '',
      currentVideoUrl: '',
      dataReady: false,
    }
  },
  computed: {
    videoGroup() {
      const currentVideoUrl = this.currentVideoUrl
      const type = currentVideoUrl.split(currentVideoUrl)[1] || 'mp4'
      switch (type) {
        case 'ogg': 
          return {
            url: currentVideoUrl,
            type: 'video/ogg'
          }
          break
        case 'webm':
          return {
            url: currentVideoUrl,
            type: 'video/webm'
          }
          break
        case 'mov':
          return {
            url: currentVideoUrl,
            type: 'video/mov'
          }
          break
        case 'mp4':
          return {
            url: currentVideoUrl,
            type: 'video/mp4'
          }
          break
      }
    }
  },
  mounted() {
    this.getList()
    reportEvent('person-page-myvideotab-exposure')
  },
  methods: {
    videoDialogClose() {
      const video = document.querySelector('.video')
      video.pause()
    },
    coverClick(row) {
      console.log('coverClick row:', row)
      reportEvent('person-page-videocover-click')
      if (row.control.ban_play) {
        Message.error(row.control.ban_play_msg)
        return
      }
      this.videoDialogShow = true
      this.currentVideoUrl = row.play_info[0].url
      this.$nextTick(() => {
        this.$refs.dialogVideo.play()
      })
    },
    getList() { // 获取视频列表
      const p = {
        start: (this.currentPage - 1) * 10,
        count: 10,
        queryAll: true,
      }
      fetchList(p).then((response) => {
        const { data } = response.data
        const list = data.vod_infos
        const total = data.total
        this.list = list || []
        this.total = total || 0
        this.dataReady = true
      })
    },
    jumpToEditPage(row, origin) {
      console.log(`VideoTable jumpToEditPage row:`, JSON.stringify(row))
      const draftId = row.id
      // reportEvent(`person-page-${origin}-button`, `person-page-${origin}-button`, { draftId, })
      const editable = row.is_edit
      if (editable === 1) {
        this.$router.push('/exception')
        return
      }

      const step = row.step
      const musicId = row.music_id
      
      if (step === 2) {
        this.$router.push(`/rectify`)
      } else {
        this.$router.push(`/edit/${musicId}`)
      }
      sessionStorage.setItem('draftId', draftId)
    },
    deleteButtonClick(row) {
      reportEvent('person-page-videodelete-button')
      const targetId = row.file_id
      // reportEvent('person-page-drawedelete-button', 'person-page-drawedelete-button', { draftId, })
      this.dialogShow = true
      this.targetId = targetId
    },
    deleteItem() {
      // 删除视频按钮确认点击
      deleteVideo(this.targetId).then((response) => {
        const { data, ret_code } = response.data
        if (ret_code === 0) {
          Message.success('视频删除成功 ! ')
          this.getList()
          this.dialogShow = false
        }
      })
    },
    closeDialog() {
      this.dialogShow = false
    },
    closeButtonClick() {
      this.videoDialogShow = false
      this.$nextTick(() => { // 暂停视频
        this.$refs.dialogVideo.pause()
      })
    },
    currentPageChange() {
      this.getList()
    },
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
        margin-top: 60px;
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
      .delete-button {
        font-size: 16px;
        margin-top: auto;
        width: 100px;
        cursor: pointer;
        .el-icon-delete {
          font-size: 20px;
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

<style lang="less">
  .video-container {
    position: relative;
    display: flex;
    justify-content: center;
    .close-button {
      width: 20px;
      height: 20px;
      cursor: pointer;
      margin: -20px 10px;
    }
  }
  .video-dialog {
    .el-dialog {
      background: none;
      box-shadow: none;
      text-align: center;
      .el-dialog__header {
        display: none;
      }
    }
  }
</style>
