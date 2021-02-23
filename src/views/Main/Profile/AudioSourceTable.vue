<template>
  <div :class="$style.AudioSourceTable">
    <Table ref="audioSourceTable" @click="showTips">
      <TableColumn label="音源名称" prop="name"></TableColumn>
      <TableColumn label="上传时间">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.update_time * 1000).format('YYYY-MM-DD HH:mm')}}</span>
        </template>
      </TableColumn>
      <TableColumn label="音源状态">
        <template slot-scope="scope">
          <span>{{ audioStatusMap[scope.row.status] }}</span>
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
    <Dialog :visible.sync="dialogVisible" width="400px" height="400px" custom-class="dialog">
      <div class="dialog-text">如果对于审核结果有疑问,请联系QQ291243638</div>
    </Dialog>
  </div>
</template>

<script>
import { getAudioSourceList } from '@/api/audioSource'
import { Table, TableColumn, Pagination } from 'element-ui'
import { audioStatusMap } from '@/common/utils/const'
import { Dialog } from 'element-ui'

export default {
  name: 'AudioSourceTable',
  components: {
    Table,
    TableColumn,
    Pagination,
    Dialog
  },
  mounted() {
    this.getAudioSourceList()
  },
  data() {
    return {
      currentPage: 1,
      total: 0,
      toneInfoList: [],
      audioStatusMap: audioStatusMap,
      dialogVisible: false
    }
  },
  methods: {
    async getAudioSourceList() {
      const res = await getAudioSourceList({
        start: (this.currentPage - 1) * 10,
        count: 10
      })
      console.log('getAudioSourceList:', res)
      const { data } = res.data
      this.toneInfoList = data.toneInfoList
      this.total = data.total
    },
    currentPageChange() {
      this.getAudioSourceList()
    },
    showTips() {
      console.log('showTips')
      const table = document.getElementsByClassName('el-table__header-wrapper')
      // const table = document.getElementsByName('音源状态')
      console.log('table:', table)
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="less" module>
.AudioSourceTable{
  text-align: center;
}
</style>
