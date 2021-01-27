<template>
  <Dialog
    title="拼音校正"
    :visible.sync="pinyinVisible"
    width="400px">  
    <div :class="$style.pinyinInput">
      <div :class="$style.list" v-for="(it, index) in pinyinList" :key="index">
        {{ it.hanzi }}
        [
          <Radio v-for="(item, itemIndex) in it.pinyin" :key="itemIndex" :label="itemIndex" v-model="radio">{{ item }}</Radio>
        ]
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
import { Hanzi2Pinyin } from '@/api/audio'

export default {
  name: 'LyricCorrect',
  data() {
    return {
      pinyinVisible: false,
      pinyin: '',
      index: 0,
      radio: 0,
      pinyinList: []
    }
  },
  components: {
    Dialog,
    Button,
    Radio
  },
  methods: {
    showLyric(lyric, index) {
      this.pinyinVisible = true
      this.index = index
      this.toHanzi2Pinyin(lyric)
    },
    submit() {
      const pinyinList = this.pinyinList
      pinyinList.forEach(item => {
        item.pinyin.forEach((it, index) => {
          if (index === this.radio) {
            this.pinyin = it
          }
        })
      })
      console.log('this.pinyin:', this.pinyin)
      this.$store.dispatch('changeStagePitches', { index: this.index, key: 'pinyin', value: this.pinyin })
      this.$store.dispatch('changeStoreState', { selectRadio: this.radio })
      this.pinyinVisible = false
    },
    toBack() {
      this.pinyinVisible = false
    },
    async toHanzi2Pinyin(lyric) {
      const hanziList = [lyric]
      const res = await Hanzi2Pinyin({hanziList})
      this.pinyinList = res.data.data.pinyinList
      console.log('this.pinyinList:', this.pinyinList) 
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
}
.list {
  color: #606266;
}
</style>
