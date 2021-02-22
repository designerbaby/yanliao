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
  </div>
</template>

<script>
import { getAudioSourceList } from '@/api/audioSource'
import { Table, TableColumn, Pagination, Alert } from 'element-ui'
import { audioStatusMap } from '@/common/utils/const'

export default {
  name: 'AudioSourceTable',
  components: {
    Table,
    TableColumn,
    Pagination
  },
  mounted() {
    this.getAudioSourceList()
  },
  data() {
    return {
      currentPage: 1,
      total: 0,
      toneInfoList: [],
      audioStatusMap: audioStatusMap
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
      console.log('111')
      Alert('如果对于审核结果有疑问，请联系QQ291243638', '', {
        // confirmButtonText: '确定',
        // callback: action => {

        //   // this.$message({
        //   //   type: 'info',
        //   //   message: `action: ${ action }`
        //   // });
        // }
      });
    }
  }
}
</script>

<style lang="less" module>
.AudioSourceTable{
  text-align: center;
}
</style>
