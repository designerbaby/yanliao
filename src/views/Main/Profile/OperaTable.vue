<template>
  <div class="work-table-box">
    <Table
      ref="worksTable"
      :data="worksList"
      class="table-box"
      highlight-current-row
      @cell-mouse-enter="tableCellMouseEnter"
    >
      <TableColumn label="音频作品名称">
        <template slot-scope="scope">
          <span class="audio-name" v-if="scope.row.bus_type === 2" @click="toAudioEditor(scope.row)">{{scope.row.arrange_name || '填词'}}</span>
          <span class="audio-name" v-else @click="audioNameClick(scope.row.arrange_id)">{{scope.row.arrange_name || '填词'}}</span>
        </template>
      </TableColumn>
      <TableColumn label="音源">
        <template slot-scope="scope">
          <span>{{ scope.row.tone_infos.map(item => item.display_name).join('、') || '— —' }}</span>
        </template>
      </TableColumn>
      <TableColumn label="更新时间">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.update_time * 1000).format('YYYY/MM/DD HH:mm')}}</span>
        </template>
      </TableColumn>
      <TableColumn label="状态">
        <template slot-scope="scope">
          <span>{{ stateMap(scope.row.state) }}</span>
        </template>
      </TableColumn>
      <TableColumn label="共享曲谱">
        <template slot-scope="scope">
          <i class="icon el-icon-share" @click.stop="shareOpera(scope.row)"></i>
        </template>
      </TableColumn>
      <TableColumn label="音频作品操作" width="130">
        <template slot-scope="scope">
          <i :class="scope.row.state === 0 || scope.row.state === 1 ? 'icon el-icon-download disabled' : 'icon el-icon-download'" @click="downloadButtonClick(scope.row)"></i>
          <i :class="scope.row.state === 0 || scope.row.state === 1 ? 'icon el-icon-edit disabled' : 'icon el-icon-edit'" v-if="scope.row.bus_type === 2" @click.stop="toAudioEditor(scope.row)"></i>
          <i :class="scope.row.state === 0 || scope.row.state === 1 ? 'icon el-icon-edit disabled' : 'icon el-icon-edit'" v-else @click="editButtonClick(scope.row)"></i>
          <i class="icon el-icon-delete" @click="deleteButtonClick(scope.row)"></i>
        </template>
      </TableColumn>
    </Table>
    <Pagination
      class="pagination"
      @current-change="currentPageChange"
      :current-page.sync="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
    >
    </Pagination>
    <CommonDialog
      :show="dialogShow"
      titleText="确定删除该作品吗?"
      confirmButtonText="删除"
      :confirmButtonEvent="deleteItem"
      :cancelButtonEvent="closeDialog" />
    <CommonConfirmDialog
      :show="shareShow"
      titleText="确定共享该曲谱吗?"
      tipText="共享的曲谱将被收录进盐料视频的曲库供大家使用"
      confirmButtonText="确认"
      cancelButtonText="取消"
      :confirmButtonEvent="shareQuPu"
      :cancelButtonEvent="closeShareDialog" />
  </div>
</template>

<script>
import {
  Table,
  TableColumn,
  Pagination,
  Message
} from 'element-ui'
import { fetchArrangeList, deleteAudio } from '@/api/profile'
import CommonDialog from '@/common/components/CommonDialog'
import CommonConfirmDialog from '@/common/components/CommonConfirmDialog'
import { reportEvent } from '@/common/utils/helper'

export default {
  name: 'WorkTable',
  components: {
    Table,
    TableColumn,
    Pagination,
    Message,
    CommonDialog,
    CommonConfirmDialog
  },
  data() {
    return {
      worksList: [],
      currentPage: 1,
      total: 0,
      targetArrangeId: '',
      dialogShow: false,
      shareShow: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    toAudioEditor(row) {
      if (row.state === 0 || row.state === 1) {
        Message.error('音频合成中，暂不可编辑')
        return
      }
      // console.log('toAudioEditor row:', row)
      this.$router.push(`/audioEditor?taskId=${row.arrange_id}`)
    },
    audioNameClick(arrangeId) {
      console.log('audioNameClick', arrangeId)
      this.$router.push(`/audio/${arrangeId}`)
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
    tableCellMouseEnter() {
      this.$refs.worksTable.setCurrentRow()
    },
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
      console.log('profile editButtonClick row:', JSON.stringify(row))
      this.$router.push(`/edit/${row.music_id}/${row.arrange_id}`)
    },
    deleteButtonClick(row) {
      const arrangeId = row.arrange_id
      reportEvent('person-page-audiodelete-button', 'person-page-audiodelete-button', { arrangeId, })
      this.dialogShow = true
      this.targetArrangeId = row.arrange_id
    },
    currentPageChange() {
      this.getList()
    },
    deleteItem() {
      console.log('deleteItem', this.targetArrangeId)
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
    shareOpera() {
      this.shareShow = true
    },
    shareQuPu() {
      console.log('shareQuPu')
      // TODO 这里要对接下分享曲谱的接口
    },
    closeShareDialog() {
      this.shareShow = false
    }
  }
}
</script>

<style lang="less" scoped>
  .profile-page {
    .main{
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
