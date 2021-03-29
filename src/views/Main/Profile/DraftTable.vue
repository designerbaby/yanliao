<template>
  <div class="draft-table-box">
    <Table
      ref="draftTable"
      :data="list"
      class="table-box"
    >
      <TableColumn label="音频作品名称" width="780">
        <template slot-scope="scope">
          <span class="highlight" @click="jumpToEditPage(scope.row, 'drawdetail')">{{scope.row.name || '填词'}}</span>
        </template>
      </TableColumn>

      <TableColumn
        label="更新时间"
      >
        <template slot-scope="scope">
          <span>{{scope.row.update_time | formatShortDate}}</span>
        </template>
      </TableColumn>
      <TableColumn
        label="音频作品操作"
        width="110"
      >
        <template slot-scope="scope">
          <i class="icon el-icon-edit" @click="jumpToEditPage(scope.row, 'drawedit')"></i>
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
    <CommonDialog :show="dialogShow" titleText="确定删除该草稿吗?" confirmButtonText="删除" :confirmButtonEvent="deleteItem" :cancelButtonEvent="closeDialog" />
  </div>
</template>

<script>
// @ is an alias to /src
// 我的草稿组件
import { reportEvent } from '@/common/utils/helper'
import CommonDialog from '@/common/components/CommonDialog'

import {
  Table,
  TableColumn,
  Pagination,
  Message,
} from 'element-ui'
import {
  fetchDraftList,
  deleteDraft,
} from '@/api/profile'

export default {
  name: 'Home',
  components: {
    Table,
    TableColumn,
    Pagination,
    CommonDialog,
  },
  data() {
    return {
      dialogShow: false,
      list: [],
      currentPage: 1,
      dialogShow: false,
      total: 0,
      targetId: '',
    }
  },
  mounted() {
    this.getList()
    reportEvent('person-page-mydrafttab-exposure')
  },
  methods: {
    getList() {
      const p = {
        start: (this.currentPage - 1) * 10,
        count: 10,
      }
      fetchDraftList(p).then((response) => {
        const { data } = response.data
        const list = data.AudioDraftList
        const total = data.total
        this.list = list || []
        this.total = total || 0
      })
    },
    jumpToEditPage(row, origin) {
      console.log('jumpToEditPage:', row)
      const draftId = row.id
      reportEvent(`person-page-${origin}-button`, `person-page-${origin}-button`, { draftId, })
      const editable = row.is_edit
      if (editable === 1) {
        this.$router.push('/exception')
        return
      }

      sessionStorage.setItem('editPath', '')

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
      const draftId = row.id
      reportEvent('person-page-drawedelete-button', 'person-page-drawedelete-button', { draftId, })
      this.dialogShow = true
      this.targetId = row.id
    },
    deleteItem() {
      deleteDraft(this.targetId).then((response) => {
        const { data, ret_code } = response.data
        if (ret_code === 0) {
          Message.success('草稿删除成功 ! ')
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
.draft-table-box {
  width: 100%;
  background: transparent;
  .table-box {
    background: transparent;
  }
  .highlight {
    color: #0090ef;
    cursor: pointer;
  }
  .icon {
    cursor: pointer;
    font-size: 20px;
    color: #0090ef;
  }
  .icon + .icon {
    margin-left: 32px;
  }
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
