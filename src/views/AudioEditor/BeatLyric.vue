<template>
  <Dialog
    title="编辑歌词"
    :visible.sync="lyricVisible"
    width="400px">
    <Form :rules="rule" ref="lyricForm" :model="lyricForm">
      <FormItem prop="lyric">
        <Input type="textarea"
          placeholder="请输入歌词"
          v-model="lyricForm.lyric"
          :maxlength="maxlength"
          :rows="5"
          show-word-limit
          @change="lyricInputChange"
        ></Input>
      </FormItem>
    </Form>
    <span slot="footer" class="dialog-footer">
      <Button @click="toCorrect">拼音校正</Button>
      <Button type="primary" @click="submit">确 定</Button>
    </span>
  </Dialog>
</template>

<script>
import { Dialog, Form, FormItem, Button, Input, Message } from 'element-ui'
import { Hanzi2Pinyin } from '@/api/audio'
import { validateChinese } from '@/common/utils/validate'

export default {
  name: 'BeatLyric',
  data() {
    return {
      lyricVisible: false,
      maxlength: 1,
      lyricForm: {
        lyric: ''
      },
      index: 0,
      rule: {
        lyric: [
          { required: true, message: '请输入歌词,且必须为中文',
            trigger: 'blur', validator: validateChinese }
        ]
      },
      hasPolyphnic: false // 是否有多音字
    }
  },
  components: {
    Dialog,
    Button,
    Input,
    Message,
    Form,
    FormItem
  },
  methods: {
    showLyric(lyric, index) {
      this.lyricVisible = true
      this.lyricForm.lyric = lyric
      this.index = index
    },
    submit() {
      this.$refs.lyricForm.validate((valid) => {
        if (valid) {
          this.toChangeHanzi()
          this.toChangePinyin()
          this.lyricVisible = false
        } else {
          Message.error('请全部填写完整并正确再提交')
        }
      })
      
    },
    toChangeHanzi () {
      this.$store.dispatch('changeStagePitches', { index: this.index, key: 'hanzi', value: this.lyricForm.lyric })
    },
    async toChangePinyin() {
      const hanziList = [this.lyricForm.lyric]
      const res = await Hanzi2Pinyin({hanziList})
      const pinyinList = res.data.data.pinyinList
      const length = pinyinList[0].pinyin.length
      console.log('BeatLyric pinyinList length:', length)
      if (length <= 1) {
        this.hasPolyphnic = false
      } else {
        this.hasPolyphnic = true
      }
      console.log('this.$store.state.selectRadio:', this.$store.state.selectRadio)
      const pinyin = pinyinList[0].pinyin[this.$store.state.selectRadio]
      console.log('pinyin:', pinyin)
      this.$store.dispatch('changeStagePitches', { index: this.index, key: 'pinyin', value: pinyin })
    },
    toCorrect() {
      if (!this.hasPolyphnic) {
        Message.warning('没有多音字，无需校正~')
        return
      }
      this.$emit('showLyric', this.lyricForm.lyric, this.index)
    },
    lyricInputChange(value) {
      console.log('lyricInputChange:', value)
      this.toChangePinyin()
    }
  }
}
</script>

<style lang="less" module>

</style>
