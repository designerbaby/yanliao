<template>
  <Dialog
    title="拼音校正"
    :visible.sync="pinyinVisible"
    width="400px">
    <div :class="$style.pinyinInput">
      <div :class="$style.list" v-for="(it, index) in correctSelectStagePitches" :key="index">
        {{ it.hanzi }}
        <template v-if="it.pinyinList.length > 1">
          [
            <Radio v-for="(item, itemIndex) in it.pinyinList"
              :key="itemIndex"
              :label="itemIndex"
              v-model="it.select"
              @change="changeSelect($event, it.uuid)"
              >{{ item }}
            </Radio>
          ]
        </template>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <Button @click="toBack">返回歌词</Button>
      <Button type="primary" @click="submit">确 定</Button>
    </span>
  </Dialog>
</template>

<script>
import { Dialog, Button, Radio } from 'element-ui'

export default {
  name: 'LyricCorrect',
  data() {
    return {
      pinyinVisible: false,
      selectStagePitches: [],
      correctSelectStagePitches: []
    }
  },
  components: {
    Dialog,
    Button,
    Radio
  },
  computed: {
    stagePitches() {
      return this.$store.state.stagePitches
    }
  },
  methods: {
    showLyric(selectStagePitches) {
      this.pinyinVisible = true
      this.selectStagePitches = selectStagePitches
      this.setCorrectSelectStagePitches()
    },
    setCorrectSelectStagePitches() {
      const pinyinList = this.$store.state.pinyinList
      const selectStagePitches = this.selectStagePitches
      let correctSelectStagePitches = []
      for (let i = 0; i < selectStagePitches.length; i += 1) {
        const item = selectStagePitches[i]
        const pinyin = item.pinyin
        item.pinyinList = pinyinList[i].pinyin
        let select = 0
        if (item.pinyinList.length > 1) {
          for (let j = 0; j < item.pinyinList.length; j += 1) {
            if (item.pinyinList[j] === pinyin) {
              select = j
            }
          }
        }
        item.hanzi = pinyinList[i].hanzi
        item.select = select
        correctSelectStagePitches.push(item)
      }
      // console.log('correctSelectStagePitches:', correctSelectStagePitches)
      this.correctSelectStagePitches = correctSelectStagePitches
    },
    submit() {
      this.$emit('saveAllPinyin')
      this.pinyinVisible = false
    },
    toBack() {
      this.pinyinVisible = false
    },
    changeSelect(event, uuid) {
      this.$store.state.stagePitches.forEach(item => {
        if (item.uuid === uuid) {
          item.select = event
        }
      });
    }
  }
}
</script>

<style lang="less" module>
.pinyinInput {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #FFF;
  background-image: none;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  height: 120px;
  overflow: scroll;
}
.list {
  color: #606266;
  display: inline-block;
}
</style>
