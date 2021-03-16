<template>
  <Dialog
    title="拼音校正"
    :visible.sync="pinyinVisible"
    width="400px">
    <div :class="$style.pinyinInput">
      <div :class="$style.list" v-for="(it, index) in pinyinList" :key="index">
        {{ it.hanzi }}
        <template v-if="it.pinyin.length > 1">
          [
            <Radio v-for="(item, itemIndex) in it.pinyin" :key="itemIndex" :label="itemIndex" v-model="it.select">{{ item }}</Radio>
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
      lyric: ''
    }
  },
  components: {
    Dialog,
    Button,
    Radio
  },
  computed: {
    pinyinList() {
      return this.$store.state.pinyinList
    },
    stagePitches() {
      return this.$store.state.stagePitches
    }
  },
  methods: {
    showLyric(lyric) {
      this.pinyinVisible = true
      this.lyric = lyric
    },
    submit() {
      this.$emit('saveAllPinyin')
      this.pinyinVisible = false
    },
    toBack() {
      this.pinyinVisible = false
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
  display: inline-block;
}
</style>
