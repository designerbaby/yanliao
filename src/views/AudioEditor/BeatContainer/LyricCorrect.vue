<template>
  <Dialog
    title="拼音校正"
    :visible.sync="pinyinVisible"
    custom-class="correct-dialog">
    <div class="pinyinInput">
      <div class="list" v-for="(it, index) in correctSelectStagePitches" :key="index">
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
      return this.$store.state.change.stagePitches
    }
  },
  methods: {
    showLyric(selectStagePitches) {
      this.pinyinVisible = true
      this.selectStagePitches = selectStagePitches
      this.setCorrectSelectStagePitches()
    },
    setCorrectSelectStagePitches() {
      const pinyinList = this.$store.state.const.pinyinList
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
      this.pinyinVisible = false
    },
    toBack() {
      this.pinyinVisible = false
    },
    changeSelect(event, uuid) {
      this.$store.state.change.stagePitches.forEach(item => {
        if (item.uuid === uuid) {
          item.select = event
        }
      });
    }
  }
}
</script>

<style lang="less">
.correct-dialog {
  width: 520px;
  background: #2c2c2c;
  box-shadow: -8px 0 32px 0 rgba(0,0,0,0.30);
  border-radius: 8px;
  .el-dialog__title {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #FFFFFF;
    margin-left: 20px;
  }
  .el-dialog__header {
    border-bottom: 1px solid rgba(0,0,0,0.07);
    height: 64px;
    // text-align: center;
    padding: 0;
    line-height: 64px;
  }
  .pinyinInput {
    display: block;
    resize: vertical;
    padding: 5px 8px;
    line-height: 1.5;
    box-sizing: border-box;
    width: 100%;
    font-size: 14px;
    border: 2px solid rgba(255,255,255,0.15);
    color: #FFFFFF;
    background-image: none;
    border-radius: 8px;
    height: 149px;
    overflow: scroll;
  }
  .list {
    display: inline-block;
  }
  .el-dialog__footer {
    border-top: 1px solid rgba(0,0,0,0.07);
    height: 72px;
    line-height: 72px;
    padding: 0;
  }
  .el-button {
    height: 40px;
    border-radius: 8px;
    font-size: 16px;
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    border: 0;
  }
  .el-button--default {
    background: #1D1D1D;
    &:hover {
      background: #292929;
    }
  }
  .el-button--primary {
    background: #179B30;
    height: 40px !important;
    width: 80px;
    border-radius: 8px;
    font-size: 16px;
    color: rgba(255,255,255,0.80);
    letter-spacing: 0;
    text-align: center;
    margin: 0 24px 0 16px;
    border: 0;
    &:hover {
      background: #2ea545;
    }
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #179B30;
    background: #179B30;
  }
  .el-radio__inner {
    &:hover {
      border-color: #179B30;
    }
  }
  .el-radio__input.is-checked+.el-radio__label {
    color: #179B30;
  }
}

</style>
